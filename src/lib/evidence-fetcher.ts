/**
 * Evidence Fetcher Pipeline (Phase 1a)
 *
 * For each active Source row in the database:
 *   1. HTTP GET the URL with a generous timeout
 *   2. Strip HTML to clean text
 *   3. SHA-256 hash the cleaned text
 *   4. Compare hash to the source's latest SourceSnapshot
 *      - If unchanged: skip
 *      - If new content (or first fetch): insert SourceSnapshot
 *      - On change: also create a ReviewTask of type "source-diff"
 *        linking every published claim that uses this source — analyst
 *        must re-verify the affected claims
 *      - On error: insert a snapshot with status="fetch-error" and
 *        create a high-priority ReviewTask
 *
 * Designed to be re-run safely: idempotent on hash equality.
 *
 * Triggered by:
 *   - Vercel cron (POST /api/admin/evidence-fetch with CRON_SECRET)
 *   - Admin button (POST /api/admin/evidence-fetch with admin session)
 *   - CLI (npm run evidence:fetch)
 */

import crypto from "node:crypto";
import { prisma } from "@/lib/db";
import { extractClaimsFromSnapshot, persistDraftClaims } from "@/lib/claim-extractor";

// ─── HTML → text (regex-based, no extra dep) ────────────────
//
// Trust portals, DPAs, sub-processor lists are mostly plain text in
// simple HTML. We only need stable extraction for diff-detection,
// not perfect rendering. Heavier parsers (cheerio, jsdom) can be
// dropped in later if a particular vendor's page needs them.

export function htmlToText(html: string): string {
  return (
    html
      // Drop script/style blocks entirely
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
      // Drop HTML comments
      .replace(/<!--[\s\S]*?-->/g, " ")
      // Block-level → newlines (preserves rough structure for diff)
      .replace(/<\/(p|div|li|tr|h[1-6]|section|article|header|footer|main|nav|br)>/gi, "\n")
      .replace(/<br\s*\/?>(?!<)/gi, "\n")
      // Strip remaining tags
      .replace(/<[^>]+>/g, " ")
      // HTML entity decode (common ones; keep small)
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;|&apos;/g, "'")
      .replace(/&mdash;/g, "—")
      .replace(/&ndash;/g, "–")
      .replace(/&hellip;/g, "…")
      // Decode numeric entities (e.g. &#8217;)
      .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)))
      .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
      // Collapse whitespace, keep newlines
      .replace(/[ \t]+/g, " ")
      .replace(/\n[ \t]+/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  );
}

export function sha256(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex");
}

// ─── Fetch a single URL with timeout ────────────────────────

const FETCH_TIMEOUT_MS = 30_000;
const MAX_BYTES = 2 * 1024 * 1024; // 2 MB cap — trust pages are tiny; protects against rogue downloads
const USER_AGENT =
  "AI-Compass-EU-EvidenceFetcher/1.0 (+https://ai-compass.eu/methodology; contact: corrections@ai-compass.eu)";

export interface FetchResult {
  ok: boolean;
  rawText: string;       // Cleaned text (empty on error)
  contentHash: string;   // SHA-256 of rawText (empty on error)
  errorMessage: string;
}

export async function fetchSourceUrl(url: string): Promise<FetchResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml,text/plain;q=0.9,*/*;q=0.5",
      },
      signal: controller.signal,
      redirect: "follow",
    });
    if (!res.ok) {
      return {
        ok: false,
        rawText: "",
        contentHash: "",
        errorMessage: `HTTP ${res.status} ${res.statusText}`,
      };
    }
    const buf = await res.arrayBuffer();
    if (buf.byteLength > MAX_BYTES) {
      return {
        ok: false,
        rawText: "",
        contentHash: "",
        errorMessage: `Body too large (${buf.byteLength} bytes > ${MAX_BYTES})`,
      };
    }
    const html = new TextDecoder("utf-8").decode(buf);
    const rawText = htmlToText(html);
    if (!rawText) {
      return {
        ok: false,
        rawText: "",
        contentHash: "",
        errorMessage: "Empty body after HTML strip",
      };
    }
    return {
      ok: true,
      rawText,
      contentHash: sha256(rawText),
      errorMessage: "",
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, rawText: "", contentHash: "", errorMessage: msg };
  } finally {
    clearTimeout(timer);
  }
}

// ─── Pipeline runner ────────────────────────────────────────

export interface FetcherStats {
  startedAt: string;
  finishedAt: string;
  durationMs: number;
  sourcesChecked: number;
  snapshotsWritten: number;
  unchanged: number;
  changed: number;
  fetchErrors: number;
  reviewTasksCreated: number;
  draftClaimsExtracted: number;
  extractionErrors: number;
  perSource: Array<{
    sourceId: string;
    url: string;
    status: "unchanged" | "changed" | "first-snapshot" | "fetch-error";
    error?: string;
    draftClaimsExtracted?: number;
    rejectedClaims?: number;
  }>;
}

const REVIEW_DUE_DAYS_ON_DIFF = 7;
const REVIEW_DUE_DAYS_ON_ERROR = 3;

export async function runEvidenceFetcher(opts?: {
  systemId?: string;
  /**
   * Auto-run the LLM claim extractor on every new/changed snapshot. Default
   * true. Disable for tight loops where you only want to refresh content
   * hashes (e.g. when re-validating after a schema change). The extractor
   * needs ANTHROPIC_API_KEY; if absent, extraction is skipped silently.
   */
  extract?: boolean;
}): Promise<FetcherStats> {
  const shouldExtract = opts?.extract !== false;
  const startedAt = Date.now();
  const stats: FetcherStats = {
    startedAt: new Date(startedAt).toISOString(),
    finishedAt: "",
    durationMs: 0,
    sourcesChecked: 0,
    snapshotsWritten: 0,
    unchanged: 0,
    changed: 0,
    fetchErrors: 0,
    reviewTasksCreated: 0,
    draftClaimsExtracted: 0,
    extractionErrors: 0,
    perSource: [],
  };

  const sources = await prisma.source.findMany({
    where: {
      active: true,
      ...(opts?.systemId ? { systemId: opts.systemId } : {}),
    },
    include: {
      // Latest successful snapshot — that's what we compare hashes against.
      // Pulling only status="success" means a temporary fetch-error window
      // can't blank our memory of the prior good content.
      snapshots: {
        where: { status: "success" },
        orderBy: { fetchedAt: "desc" },
        take: 1,
      },
      // Open source-diff tasks — used to dedupe so a permanently broken
      // source doesn't mint a fresh task on every weekly cron run.
      reviewTasks: {
        where: { type: "source-diff", status: "open" },
        select: { id: true },
        take: 1,
      },
      // Published claims that depend on this source — they need re-verification on diff
      claims: { where: { status: "published" }, select: { id: true } },
      system: { select: { id: true, slug: true, name: true } },
    },
  });

  for (const source of sources) {
    stats.sourcesChecked++;
    const lastSuccess = source.snapshots[0] ?? null;
    const hasOpenTask = source.reviewTasks.length > 0;
    const result = await fetchSourceUrl(source.url);

    if (!result.ok) {
      // Record the failure as a snapshot row so the audit trail is complete
      await prisma.sourceSnapshot.create({
        data: {
          sourceId: source.id,
          contentHash: "",
          rawText: "",
          status: "fetch-error",
          errorMessage: result.errorMessage,
        },
      });
      stats.fetchErrors++;
      stats.snapshotsWritten++;
      // Dedupe: only open one task per (source × outage). If a task is already
      // open the analyst either hasn't gotten to it yet or is mid-investigation —
      // a second task adds noise without surfacing new info.
      if (!hasOpenTask) {
        await prisma.reviewTask.create({
          data: {
            type: "source-diff",
            systemId: source.systemId,
            sourceId: source.id,
            priority: "high",
            status: "open",
            title: `Source unreachable: ${source.label} (${source.system.slug})`,
            notes: `Fetcher could not retrieve ${source.url}: ${result.errorMessage}`,
            dueBy: new Date(Date.now() + REVIEW_DUE_DAYS_ON_ERROR * 24 * 60 * 60 * 1000),
          },
        });
        stats.reviewTasksCreated++;
      }
      stats.perSource.push({
        sourceId: source.id,
        url: source.url,
        status: "fetch-error",
        error: result.errorMessage,
      });
      continue;
    }

    if (lastSuccess && lastSuccess.contentHash === result.contentHash) {
      stats.unchanged++;
      stats.perSource.push({
        sourceId: source.id,
        url: source.url,
        status: "unchanged",
      });
      continue;
    }

    // New content (first fetch or hash differs) — write snapshot
    const snapshot = await prisma.sourceSnapshot.create({
      data: {
        sourceId: source.id,
        contentHash: result.contentHash,
        rawText: result.rawText.slice(0, 500_000), // hard cap for DB sanity
        status: "success",
      },
    });
    stats.snapshotsWritten++;

    let perSourceStatus: "changed" | "first-snapshot";
    if (lastSuccess) {
      // True content change — affected claims need re-verification
      const affectedClaimCount = source.claims.length;
      stats.changed++;
      perSourceStatus = "changed";
      // Same dedupe rule as fetch-error branch: don't pile on if the
      // analyst already has an open task for this source.
      if (!hasOpenTask) {
        await prisma.reviewTask.create({
          data: {
            type: "source-diff",
            systemId: source.systemId,
            sourceId: source.id,
            priority: affectedClaimCount > 0 ? "high" : "normal",
            status: "open",
            title: `Source content changed: ${source.label} (${source.system.slug})`,
            notes: `Detected hash change at ${source.url}. ${affectedClaimCount} published claim(s) reference this source and need re-verification.`,
            dueBy: new Date(Date.now() + REVIEW_DUE_DAYS_ON_DIFF * 24 * 60 * 60 * 1000),
          },
        });
        stats.reviewTasksCreated++;
      }
    } else {
      // First successful snapshot — no diff task needed; analysts use this for new claim extraction
      perSourceStatus = "first-snapshot";
    }

    // ─── Auto-extract draft claims from the new snapshot ──────────
    // The snapshot is fresh content; ask the LLM to pull verifiable
    // claims out of it. Quotes are validated server-side against the
    // raw text — hallucinations are dropped. Drafts go into the
    // review queue; nothing is published without admin approval.
    let draftClaimsExtracted: number | undefined;
    let rejectedClaims: number | undefined;
    if (shouldExtract) {
      try {
        const extraction = await extractClaimsFromSnapshot({
          rawText: result.rawText,
          sourceLabel: source.label,
          sourceUrl: source.url,
        });
        if (extraction.ok) {
          const persisted = await persistDraftClaims({
            systemId: source.systemId,
            sourceId: source.id,
            snapshotId: snapshot.id,
            claims: extraction.claims,
          });
          draftClaimsExtracted = persisted.draftsCreated + persisted.draftsUpdated;
          rejectedClaims = extraction.rejected.length;
          stats.draftClaimsExtracted += draftClaimsExtracted;
        } else {
          stats.extractionErrors++;
          console.warn(
            `[evidence-fetcher] extraction failed for ${source.url}: ${extraction.errorMessage}`,
          );
        }
      } catch (err) {
        stats.extractionErrors++;
        console.warn(
          `[evidence-fetcher] extractor threw for ${source.url}:`,
          err instanceof Error ? err.message : err,
        );
      }
    }

    stats.perSource.push({
      sourceId: source.id,
      url: source.url,
      status: perSourceStatus,
      draftClaimsExtracted,
      rejectedClaims,
    });
  }

  const finishedAt = Date.now();
  stats.finishedAt = new Date(finishedAt).toISOString();
  stats.durationMs = finishedAt - startedAt;
  return stats;
}
