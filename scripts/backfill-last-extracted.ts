/**
 * One-shot: stamp Source.lastExtractedSnapshotId with each source's most
 * recent success snapshot.
 *
 * Context: the hash-skip guard was rewritten to key off this column
 * (previously it joined SystemClaim, which missed 0-yield pages and
 * re-ran them every invocation — ~150 wasted LLM calls per run). The
 * column is new, so without this backfill the next evidence:extract
 * run would pay once more to re-process every source across the catalog.
 *
 * Safe to re-run: it's an idempotent overwrite to each source's current
 * latest-success-snapshot id. Pass --dry-run to preview. Pass --force
 * to overwrite already-stamped sources (default: only stamps NULL ones).
 */

import { prisma } from "../src/lib/db.ts";

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const force = process.argv.includes("--force");

  const sources = await prisma.source.findMany({
    where: {
      active: true,
      ...(force ? {} : { lastExtractedSnapshotId: null }),
    },
    include: {
      snapshots: {
        where: { status: "success" },
        orderBy: { fetchedAt: "desc" },
        take: 1,
      },
      system: { select: { slug: true } },
    },
  });

  let stampable = 0;
  let skippedNoSnap = 0;

  for (const source of sources) {
    const snap = source.snapshots[0];
    if (!snap) { skippedNoSnap++; continue; }
    stampable++;
    if (!dryRun) {
      await prisma.source.update({
        where: { id: source.id },
        data: { lastExtractedSnapshotId: snap.id },
      });
    }
  }

  console.log("\n📌 Backfill lastExtractedSnapshotId");
  console.log(`   Mode:              ${dryRun ? "DRY RUN" : force ? "FORCE OVERWRITE" : "fill NULLs only"}`);
  console.log(`   Stamped:           ${stampable}`);
  console.log(`   Skipped (no snap): ${skippedNoSnap}`);
  console.log(dryRun ? "\n(no writes — re-run without --dry-run to apply)" : "\n✅ Done");
}

main()
  .then(() => process.exit(0))
  .catch((e) => { console.error(e); process.exit(1); });
