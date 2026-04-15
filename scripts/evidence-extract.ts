/**
 * Re-run the LLM claim extractor against existing successful snapshots.
 *
 * Useful when:
 *   - The fetcher already captured snapshots before the extractor was wired
 *   - The extraction prompt has been tuned and you want to refresh drafts
 *   - You want to extract from one specific snapshot for QA
 *
 *   npm run evidence:extract                       # new/changed snapshots only
 *   npm run evidence:extract -- --system <id>      # one system only
 *   npm run evidence:extract -- --snapshot <id>    # one specific snapshot
 *   npm run evidence:extract -- --force            # re-extract even unchanged ones
 *   npm run evidence:extract -- --max 50           # hard cap on LLM calls this run
 *
 * COST SAFETY — two independent guards:
 *
 * 1. Attempt-skip: by default, skips any source whose latest snapshot matches
 *    source.lastExtractedSnapshotId. That field is stamped after every
 *    successful API round-trip — including 0-yield extractions — so thin
 *    pages that legitimately return no claims are NOT re-processed every
 *    run. Fixes the prior bug where the guard keyed on "any claim persisted"
 *    and silently re-ran ~150 0-yield pages weekly. Pass --force to re-run
 *    anyway (e.g. after tuning the prompt).
 *
 * 2. Run cap: MAX_EXTRACTIONS_PER_RUN (default 150) aborts the loop
 *    loudly if crossed, so a runaway invocation never silently blows the
 *    Anthropic credit balance. Override with --max N (or 0 to disable).
 *
 * Spend is tracked per run: input/output tokens are tallied and converted
 * at Haiku 4.5 rates ($1/M in, $5/M out). Printed per-call and in the
 * summary so cost overruns are visible BEFORE reading the Anthropic dashboard.
 *
 * Drafts are upserted (one per system × field) so running with --force
 * is safe. Published claims are never touched.
 */

import { prisma } from "../src/lib/db.ts";
import { extractClaimsFromSnapshot, persistDraftClaims } from "../src/lib/claim-extractor.ts";

// Default run cap. Sized so a full catalog sweep (currently ~50 sources) can
// complete in one shot with headroom, but a runaway loop or future growth to
// 500+ sources can't silently burn through the Anthropic balance.
const DEFAULT_MAX_EXTRACTIONS_PER_RUN = 150;

// Haiku 4.5 token prices (USD per million tokens). Update when the model
// changes — kept local to this script so pricing never silently drifts
// from what the script actually invoices against.
const HAIKU_INPUT_PRICE_PER_M = 1.0;
const HAIKU_OUTPUT_PRICE_PER_M = 5.0;

function formatUSD(cents: number): string {
  // cents here is already a float dollar value; format to 4dp for per-call
  // detail and 2dp for totals is handled at the call site.
  return `$${cents.toFixed(4)}`;
}

function parseArgs(): {
  systemId?: string;
  snapshotId?: string;
  force: boolean;
  max: number;
} {
  const out: {
    systemId?: string;
    snapshotId?: string;
    force: boolean;
    max: number;
  } = { force: false, max: DEFAULT_MAX_EXTRACTIONS_PER_RUN };
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--system" || argv[i] === "--systemId") {
      out.systemId = argv[i + 1]; i++;
    } else if (argv[i] === "--snapshot" || argv[i] === "--snapshotId") {
      out.snapshotId = argv[i + 1]; i++;
    } else if (argv[i] === "--force") {
      out.force = true;
    } else if (argv[i] === "--max") {
      const n = parseInt(argv[i + 1] ?? "", 10);
      if (!Number.isFinite(n) || n < 0) {
        console.error(`✗ --max expects a non-negative integer, got "${argv[i + 1]}"`);
        process.exit(1);
      }
      out.max = n;
      i++;
    }
  }
  return out;
}

async function main() {
  const { systemId, snapshotId, force, max } = parseArgs();
  console.log("🧠 Claim extractor — re-running against existing snapshots");
  if (systemId) console.log(`   Scoped to systemId=${systemId}`);
  if (snapshotId) console.log(`   Scoped to snapshotId=${snapshotId}`);
  if (force) console.log(`   --force: will re-extract even unchanged snapshots`);
  if (max === 0) {
    console.log(`   --max 0: run cap DISABLED (be careful)`);
  } else {
    console.log(`   Run cap: ${max} LLM extractions max (override with --max N, 0 to disable)`);
  }

  // Pick the latest successful snapshot per source (the freshest content
  // is the only one worth extracting from — older ones are just history).
  const sources = await prisma.source.findMany({
    where: {
      active: true,
      ...(systemId ? { systemId } : {}),
    },
    include: {
      snapshots: {
        where: {
          status: "success",
          ...(snapshotId ? { id: snapshotId } : {}),
        },
        orderBy: { fetchedAt: "desc" },
        take: 1,
      },
      system: { select: { slug: true } },
    },
  });

  let totalDrafts = 0;
  let totalRejected = 0;
  let processed = 0;
  let skipped = 0;
  let skippedAlreadyExtracted = 0;
  let totalInputTokens = 0;
  let totalOutputTokens = 0;

  for (const source of sources) {
    const snap = source.snapshots[0];
    if (!snap) {
      skipped++;
      continue;
    }

    // Idempotency gate: have we already extracted from this exact snapshot?
    // `lastExtractedSnapshotId` is stamped after every successful API round-
    // trip (including 0-yield). So the second run skips thin pages the first
    // run already queried — fixing the cost leak where pages that produce no
    // claims used to get re-processed on every invocation.
    if (!force && source.lastExtractedSnapshotId === snap.id) {
      skippedAlreadyExtracted++;
      continue;
    }

    // Run cap: abort loudly before making the next LLM call if we've hit the
    // ceiling. Belt-and-suspenders against runaway automation — the hash-skip
    // already dedupes unchanged snapshots, this is the second layer.
    if (max > 0 && processed >= max) {
      console.log(
        `\n⚠ Run cap reached: ${processed} extractions completed (--max ${max}).`,
      );
      console.log(
        `   ${sources.length - sources.indexOf(source)} source(s) remaining. Re-run to continue,`,
      );
      console.log(`   or pass --max ${max * 2} (or --max 0) to raise the ceiling.`);
      break;
    }

    process.stdout.write(`   → ${source.label} (${source.system.slug}) ... `);
    const result = await extractClaimsFromSnapshot({
      rawText: snap.rawText,
      sourceLabel: source.label,
      sourceUrl: source.url,
    });

    if (!result.ok) {
      // API or network failure — do NOT stamp lastExtractedSnapshotId, so
      // the next run retries this source. We DO consume a `processed` slot
      // conceptually if the error came back from the API (tokens billed),
      // but since `ok:false` paths in claim-extractor.ts return no tokens,
      // just log and continue.
      console.log(`✗ extractor error: ${result.errorMessage}`);
      continue;
    }

    const persisted = await persistDraftClaims({
      systemId: source.systemId,
      sourceId: source.id,
      snapshotId: snap.id,
      claims: result.claims,
    });

    // Stamp the source as "extracted for this snapshot" — even when 0 claims
    // came back. This is the fix for the cost leak: thin/empty pages won't
    // re-run the LLM on every subsequent invocation.
    await prisma.source.update({
      where: { id: source.id },
      data: { lastExtractedSnapshotId: snap.id },
    });

    // Tally spend. Tokens are undefined only for pathological non-API
    // errors; default to 0 so the math still adds up.
    const inTok = result.promptTokens ?? 0;
    const outTok = result.completionTokens ?? 0;
    const callCost = (inTok / 1_000_000) * HAIKU_INPUT_PRICE_PER_M
                   + (outTok / 1_000_000) * HAIKU_OUTPUT_PRICE_PER_M;
    totalInputTokens += inTok;
    totalOutputTokens += outTok;

    totalDrafts += result.claims.length;
    totalRejected += result.rejected.length;
    processed++;
    console.log(
      `${result.claims.length} claims (${persisted.draftsCreated} new, ${persisted.draftsUpdated} updated)` +
      (result.rejected.length > 0 ? ` | ${result.rejected.length} rejected` : "") +
      ` | ${(inTok / 1000).toFixed(1)}k in / ${outTok} out / ${formatUSD(callCost)}`,
    );
    for (const r of result.rejected) {
      console.log(`     ⚠ rejected ${r.field}: ${r.reason}`);
    }
  }

  const inputCost = (totalInputTokens / 1_000_000) * HAIKU_INPUT_PRICE_PER_M;
  const outputCost = (totalOutputTokens / 1_000_000) * HAIKU_OUTPUT_PRICE_PER_M;
  const totalCost = inputCost + outputCost;

  console.log("\n📊 Summary");
  console.log(`   Sources processed:    ${processed}`);
  console.log(`   Sources skipped:      ${skipped} (no snapshot)`);
  console.log(`   Already extracted:    ${skippedAlreadyExtracted} (same snapshotId — use --force to re-run)`);
  console.log(`   Draft claims written: ${totalDrafts}`);
  console.log(`   Claims rejected:      ${totalRejected} (hallucination/invalid)`);
  console.log(`   Tokens in / out:      ${totalInputTokens.toLocaleString()} / ${totalOutputTokens.toLocaleString()}`);
  console.log(`   Run spend:            $${totalCost.toFixed(4)} (input $${inputCost.toFixed(4)} + output $${outputCost.toFixed(4)})`);
  console.log("\n✅ Done");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
