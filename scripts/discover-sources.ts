/**
 * Phase 2c — Evidence source auto-discovery
 *
 * For every AISystem that has no Source rows yet (or too few), ask Claude
 * Haiku for a short list of primary-source URLs — trust portal, DPA,
 * sub-processor list, privacy policy, AI-specific policy. Each proposed
 * URL is then HEAD-validated; if the site blocks bots (Cloudflare 403,
 * Akamai shield, JS shell), the fetcher strategy is set to `jina-reader`
 * automatically so the later evidence:fetch pass can actually read it.
 *
 * Guarantees kept:
 *   - No auto-published claims. This script only creates Source rows;
 *     snapshots + drafts still flow through evidence:fetch and admin review.
 *   - Only the vendor's own domain is accepted (LLM is told so, and we
 *     re-check with a hostname allowlist). We don't want the extractor
 *     grounding claims in third-party blog posts.
 *   - Idempotent: re-runs skip URLs already stored for the same system.
 *
 * Usage:
 *   npm run evidence:discover                     # all systems with < 4 sources
 *   npm run evidence:discover -- --slug adobe-firefly-sensei
 *   npm run evidence:discover -- --dry-run        # propose only, don't write
 *   npm run evidence:discover -- --min-sources 6  # lower bar for "enough"
 *   npm run evidence:discover -- --limit 5        # cap number of systems in one run
 */

import { PrismaClient } from "../src/generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";
import { LLM_MODEL, LLM_TIMEOUT_MS } from "../src/lib/constants.ts";
import { extractFirstJsonObject } from "../src/lib/claim-extractor.ts";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// ─── CLI args ───────────────────────────────────────────────

interface Args {
  slug?: string;
  dryRun: boolean;
  minSources: number;
  limit?: number;
}

function parseArgs(): Args {
  const out: Args = { dryRun: false, minSources: 4 };
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    switch (argv[i]) {
      case "--slug": out.slug = argv[++i]; break;
      case "--dry-run": out.dryRun = true; break;
      case "--min-sources": out.minSources = parseInt(argv[++i], 10); break;
      case "--limit": out.limit = parseInt(argv[++i], 10); break;
    }
  }
  return out;
}

// ─── Types ───────────────────────────────────────────────────

interface ProposedSource {
  url: string;
  label: string;
  tier: number;
  notes: string;
  docType: string; // "trust-portal" | "dpa" | "sub-processors" | "privacy" | "ai-policy" | "certifications" | "other"
}

// ─── LLM prompt ──────────────────────────────────────────────

function buildDiscoveryPrompt(vendor: string, systemName: string, vendorDomainHint: string | null): string {
  return `You are a procurement analyst at AI Compass EU. Your task: propose the primary-source URLs on the vendor's own website that an EU enterprise buyer would cite when evaluating this AI product.

VENDOR: ${vendor}
PRODUCT: ${systemName}${vendorDomainHint ? `\nVENDOR DOMAIN HINT: ${vendorDomainHint}` : ""}

ABSOLUTE RULES:
1. Every URL must be on the vendor's own domain or a clearly-owned sub-domain (trust.vendor.com, docs.vendor.com, legal.vendor.com, compliance.vendor.com, help.vendor.com, support.vendor.com, developer.vendor.com, <product>.vendor.com). Never link to competitors, news sites, Wikipedia, third-party reviewers, or blog aggregators.
2. Propose ONLY URLs that you are confident actually exist on this vendor's site today. Do NOT invent paths. Prefer stable, canonical-looking URLs over deep links.
3. Aim for 5 to 8 URLs. Include at least:
   - Trust portal / security overview (tier 1)
   - DPA / legal agreements (tier 1)
   - Sub-processors list (tier 1) — if the vendor publishes one
   - Privacy policy / notice (tier 1)
   - AI-specific policy / responsible-AI page (tier 1 or 2)
   - Certifications / compliance page (tier 1)
4. Tier scheme: 1 = primary canonical source (trust portal, DPA, privacy notice, sub-processors, AI policy). 2 = vendor documentation or product pages that still cite commitments. 3 = secondary marketing pages.
5. "docType" MUST be one of: trust-portal, dpa, sub-processors, privacy, ai-policy, certifications, security, data-residency, terms, other.

If the vendor is extremely small and unlikely to have a formal trust portal, return fewer URLs — don't pad with speculation.

OUTPUT FORMAT (strict JSON, no markdown fences, no commentary):
{
  "sources": [
    {
      "url": "https://...",
      "label": "<short human-readable label, under 80 chars>",
      "tier": 1 | 2 | 3,
      "notes": "<one-sentence rationale, under 150 chars>",
      "docType": "<one of the allowed values>"
    }
  ]
}

If you don't know this vendor well enough to propose any confident URLs, return: {"sources": []}`;
}

// ─── URL validation ──────────────────────────────────────────

interface UrlCheck {
  ok: boolean;
  strategy: "direct" | "jina-reader";
  status: number;
  errorMessage: string;
}

const VALIDATE_TIMEOUT_MS = 15_000;
const USER_AGENT =
  "AI-Compass-EU-EvidenceDiscover/1.0 (+https://ai-compass.eu/methodology; contact: corrections@ai-compass.eu)";

async function headOrGet(url: string, method: "HEAD" | "GET"): Promise<{ status: number; errorMessage: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), VALIDATE_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method,
      headers: { "User-Agent": USER_AGENT, Accept: "text/html,*/*" },
      redirect: "follow",
      signal: controller.signal,
    });
    return { status: res.status, errorMessage: "" };
  } catch (err) {
    return { status: 0, errorMessage: err instanceof Error ? err.message : String(err) };
  } finally {
    clearTimeout(timer);
  }
}

async function validateUrl(url: string): Promise<UrlCheck> {
  // Try HEAD first (cheap). Some sites 403 on HEAD but accept GET with a UA.
  const head = await headOrGet(url, "HEAD");
  if (head.status >= 200 && head.status < 400) {
    return { ok: true, strategy: "direct", status: head.status, errorMessage: "" };
  }

  // HEAD failed — try GET direct
  const get = await headOrGet(url, "GET");
  if (get.status >= 200 && get.status < 400) {
    return { ok: true, strategy: "direct", status: get.status, errorMessage: "" };
  }

  // Direct blocked (403 Cloudflare, 405 on HEAD but also on GET, or error).
  // Fall back to jina-reader — if jina can read it, we'll route through it.
  const reader = await headOrGet(`https://r.jina.ai/${url}`, "GET");
  if (reader.status >= 200 && reader.status < 400) {
    return { ok: true, strategy: "jina-reader", status: reader.status, errorMessage: "" };
  }

  return {
    ok: false,
    strategy: "direct",
    status: get.status || head.status,
    errorMessage: `direct ${get.status || head.status} / jina ${reader.status}: ${get.errorMessage || head.errorMessage}`,
  };
}

// ─── Hostname safety ─────────────────────────────────────────

/**
 * Accept URLs that sit on the vendor's own domain. We derive the expected
 * root domain from the vendor name (lower-cased, stripped of " inc." etc.)
 * and compare hostnames using PSL-light rules: same registrable domain
 * or a clear subdomain.
 */
function vendorRootGuess(vendor: string): string[] {
  const cleaned = vendor
    .toLowerCase()
    .replace(/[®™©]/g, "")
    .replace(/\b(inc|corp|corporation|ltd|limited|ag|sa|plc|llc|l\.l\.c\.|gmbh|bv|sarl|as|b\.v\.|s\.a\.|group|enterprise)\b/g, "")
    .trim();

  // Pre-compute two forms: "base" collapses all non-alphanumerics (e.g.
  // "aleph alpha" → "alephalpha"), while "dashed" keeps hyphens/dots in
  // a normalised shape ("aleph-alpha", "c3.ai"). We feed both into the
  // TLD combinations so vendors with dotted or hyphenated names match.
  const base = cleaned.replace(/[^a-z0-9]+/g, "");
  const dashed = cleaned.replace(/\s+/g, "-").replace(/[^a-z0-9.-]+/g, "");

  const stems = new Set<string>();
  if (base) stems.add(base);
  if (dashed) stems.add(dashed);

  // Some vendors write their name with a TLD baked in ("C3.ai", "X.ai",
  // "hugging.face"). If the vendor string contains a dot followed by a
  // known TLD, treat the whole thing as already a registrable domain.
  if (/\.(ai|com|io|co|net|dev)$/.test(dashed)) stems.add(dashed);

  const tlds = ["com", "ai", "io", "co", "net", "dev"];
  const guesses = new Set<string>();
  for (const stem of stems) {
    guesses.add(stem);
    // If the stem already contains a dot, it's plausibly a full domain —
    // don't append another TLD to it.
    if (!stem.includes(".")) {
      for (const tld of tlds) guesses.add(stem + "." + tld);
    }
  }
  return Array.from(guesses).filter(Boolean);
}

/**
 * Check whether `url`'s hostname is on one of the vendor's guessed roots,
 * OR on a curated allowlist of generic doc hosts that vendors commonly use
 * (GitHub, HuggingFace vendor orgs, Read the Docs, Notion pages).
 */
function hostnameIsVendorOwned(url: string, vendor: string, knownDomainHint: string | null): boolean {
  let host: string;
  try {
    host = new URL(url).hostname.toLowerCase();
  } catch {
    return false;
  }

  // Strip "www." for matching
  const h = host.replace(/^www\./, "");
  const roots = new Set(vendorRootGuess(vendor));
  if (knownDomainHint) roots.add(knownDomainHint.toLowerCase());

  for (const root of roots) {
    if (!root) continue;
    if (h === root || h.endsWith("." + root)) return true;
    // Some vendors use short brand codes — tolerate substring match on the 2-label root
    const parts = root.split(".");
    if (parts.length === 2 && h.includes(parts[0]) && h.endsWith("." + parts[1])) return true;
  }

  // Reject generic third-party aggregators outright
  return false;
}

// ─── LLM call ────────────────────────────────────────────────

async function askClaudeForSources(vendor: string, systemName: string, domainHint: string | null): Promise<ProposedSource[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not configured");

  const Anthropic = (await import("@anthropic-ai/sdk")).default;
  const client = new Anthropic({ apiKey });

  // Anthropic returns 529 "overloaded" under load; retry with exponential
  // backoff. We're running ~70 vendors in a single pass so transient
  // retries are expected and cheap to absorb.
  const MAX_ATTEMPTS = 4;
  let response: Awaited<ReturnType<typeof client.messages.create>> | null = null;
  let lastErr: unknown = null;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), LLM_TIMEOUT_MS);
    try {
      response = await client.messages
        .create(
          {
            model: LLM_MODEL,
            max_tokens: 2048,
            messages: [{ role: "user", content: buildDiscoveryPrompt(vendor, systemName, domainHint) }],
          },
          { signal: controller.signal },
        )
        .finally(() => clearTimeout(timer));
      break;
    } catch (err) {
      lastErr = err;
      const msg = err instanceof Error ? err.message : String(err);
      // Retry only on overloaded / rate-limit; fail fast on auth/invalid errors.
      if (!/(529|overloaded|rate.?limit|timeout|aborted)/i.test(msg) || attempt === MAX_ATTEMPTS) {
        throw err;
      }
      const waitMs = 1500 * Math.pow(2, attempt - 1);
      console.log(`     ⏳ retry ${attempt}/${MAX_ATTEMPTS - 1} after ${waitMs}ms (${msg.slice(0, 80)})`);
      await new Promise((r) => setTimeout(r, waitMs));
    }
  }
  if (!response) throw lastErr instanceof Error ? lastErr : new Error("LLM failed after retries");

  const raw = response.content.find((b) => b.type === "text")?.text ?? "";
  const jsonText = extractFirstJsonObject(raw);
  let parsed: { sources?: unknown };
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed.sources)) return [];

  const out: ProposedSource[] = [];
  for (const s of parsed.sources as Array<Record<string, unknown>>) {
    const url = String(s.url ?? "").trim();
    const label = String(s.label ?? "").trim().slice(0, 200);
    const tier = Number(s.tier);
    const notes = String(s.notes ?? "").trim().slice(0, 300);
    const docType = String(s.docType ?? "other").trim().slice(0, 30);
    if (!url || !url.startsWith("http")) continue;
    if (!label) continue;
    if (![1, 2, 3].includes(tier)) continue;
    out.push({ url, label, tier, notes, docType });
  }
  return out;
}

// ─── Main ────────────────────────────────────────────────────

async function main() {
  const args = parseArgs();
  console.log("🔍 Phase 2c — evidence source auto-discovery");
  console.log(`   mode: ${args.dryRun ? "DRY RUN (no DB writes)" : "WRITE"}`);
  console.log(`   threshold: discover when < ${args.minSources} sources${args.limit ? `, cap ${args.limit} systems` : ""}`);
  if (args.slug) console.log(`   scoped to slug=${args.slug}`);
  console.log("");

  const where = args.slug
    ? { slug: args.slug }
    : { sources: { none: {} } };

  const systems = await prisma.aISystem.findMany({
    where,
    select: { id: true, slug: true, vendor: true, name: true, _count: { select: { sources: true } } },
    orderBy: [{ vendor: "asc" }, { name: "asc" }],
    take: args.limit ?? 500,
  });

  // If user passed --slug explicitly we process it regardless of source count.
  const targets = args.slug
    ? systems
    : systems.filter((s) => s._count.sources < args.minSources);

  if (targets.length === 0) {
    console.log("✅ Nothing to do — every system already has enough sources.");
    return;
  }

  console.log(`   ${targets.length} system(s) to process\n`);

  let totalProposed = 0;
  let totalAccepted = 0;
  let totalRejectedHost = 0;
  let totalRejectedValidation = 0;
  let totalCreated = 0;
  let totalSkippedDupe = 0;

  for (const sys of targets) {
    // We don't have a website field on AISystem (yet), so the LLM relies on
    // vendor + product name to guess the right domain. The hostname guard
    // below still re-checks every URL against vendorRootGuess().
    const domainHint: string | null = null;
    console.log(`─── ${sys.vendor} / ${sys.name} (${sys.slug})`);

    let proposals: ProposedSource[];
    try {
      proposals = await askClaudeForSources(sys.vendor, sys.name, domainHint);
    } catch (err) {
      console.log(`   ✗ LLM error: ${err instanceof Error ? err.message : String(err)}`);
      continue;
    }
    totalProposed += proposals.length;
    if (proposals.length === 0) {
      console.log(`   (no URLs proposed)`);
      continue;
    }

    // Existing URLs for this system — we skip duplicates
    const existingSources = await prisma.source.findMany({
      where: { systemId: sys.id },
      select: { url: true },
    });
    const existingUrls = new Set(existingSources.map((s) => s.url));

    for (const p of proposals) {
      // 1. Hostname belongs to vendor?
      if (!hostnameIsVendorOwned(p.url, sys.vendor, domainHint)) {
        totalRejectedHost++;
        console.log(`   ⊘ off-domain: ${p.url}`);
        continue;
      }
      // 2. Dedupe
      if (existingUrls.has(p.url)) {
        totalSkippedDupe++;
        console.log(`   = already present: ${p.url}`);
        continue;
      }
      // 3. Reachability — direct or via jina
      const check = await validateUrl(p.url);
      if (!check.ok) {
        totalRejectedValidation++;
        console.log(`   ✗ unreachable (${check.errorMessage}): ${p.url}`);
        continue;
      }
      totalAccepted++;
      console.log(`   ✓ [${check.strategy.padEnd(11)}] tier ${p.tier} ${p.docType.padEnd(15)} ${p.url}`);
      if (!args.dryRun) {
        await prisma.source.create({
          data: {
            systemId: sys.id,
            url: p.url,
            label: p.label,
            tier: p.tier,
            notes: `[discovery] ${p.notes} (docType: ${p.docType})`,
            fetchStrategy: check.strategy,
          },
        });
        totalCreated++;
      }
    }
  }

  console.log("\n📊 Summary");
  console.log(`   Proposed:              ${totalProposed}`);
  console.log(`   Accepted:              ${totalAccepted}`);
  console.log(`   Created (DB writes):   ${totalCreated}`);
  console.log(`   Rejected (off-domain): ${totalRejectedHost}`);
  console.log(`   Rejected (unreachable):${totalRejectedValidation}`);
  console.log(`   Skipped (duplicate):   ${totalSkippedDupe}`);
  if (args.dryRun) console.log("\n   DRY RUN — no DB writes. Remove --dry-run to persist.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
