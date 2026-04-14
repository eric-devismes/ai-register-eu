/**
 * Re-run the LLM claim extractor against existing successful snapshots.
 *
 * Useful when:
 *   - The fetcher already captured snapshots before the extractor was wired
 *   - The extraction prompt has been tuned and you want to refresh drafts
 *   - You want to extract from one specific snapshot for QA
 *
 *   npm run evidence:extract                       # all latest successful snapshots
 *   npm run evidence:extract -- --system <id>      # one system only
 *   npm run evidence:extract -- --snapshot <id>    # one specific snapshot
 *
 * Drafts are upserted (one per system × field) so this is safe to re-run.
 * Published claims are never touched.
 */

import { prisma } from "../src/lib/db.ts";
import { extractClaimsFromSnapshot, persistDraftClaims } from "../src/lib/claim-extractor.ts";

function parseArgs(): { systemId?: string; snapshotId?: string } {
  const out: { systemId?: string; snapshotId?: string } = {};
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--system" || argv[i] === "--systemId") {
      out.systemId = argv[i + 1]; i++;
    } else if (argv[i] === "--snapshot" || argv[i] === "--snapshotId") {
      out.snapshotId = argv[i + 1]; i++;
    }
  }
  return out;
}

async function main() {
  const { systemId, snapshotId } = parseArgs();
  console.log("🧠 Claim extractor — re-running against existing snapshots");
  if (systemId) console.log(`   Scoped to systemId=${systemId}`);
  if (snapshotId) console.log(`   Scoped to snapshotId=${snapshotId}`);

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

  for (const source of sources) {
    const snap = source.snapshots[0];
    if (!snap) {
      skipped++;
      continue;
    }

    process.stdout.write(`   → ${source.label} (${source.system.slug}) ... `);
    const result = await extractClaimsFromSnapshot({
      rawText: snap.rawText,
      sourceLabel: source.label,
      sourceUrl: source.url,
    });

    if (!result.ok) {
      console.log(`✗ extractor error: ${result.errorMessage}`);
      continue;
    }

    const persisted = await persistDraftClaims({
      systemId: source.systemId,
      sourceId: source.id,
      snapshotId: snap.id,
      claims: result.claims,
    });

    totalDrafts += result.claims.length;
    totalRejected += result.rejected.length;
    processed++;
    console.log(
      `${result.claims.length} claims (${persisted.draftsCreated} new, ${persisted.draftsUpdated} updated)` +
      (result.rejected.length > 0 ? ` | ${result.rejected.length} rejected` : ""),
    );
    for (const r of result.rejected) {
      console.log(`     ⚠ rejected ${r.field}: ${r.reason}`);
    }
  }

  console.log("\n📊 Summary");
  console.log(`   Sources processed:    ${processed}`);
  console.log(`   Sources skipped:      ${skipped} (no snapshot)`);
  console.log(`   Draft claims written: ${totalDrafts}`);
  console.log(`   Claims rejected:      ${totalRejected} (hallucination/invalid)`);
  console.log("\n✅ Done");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
