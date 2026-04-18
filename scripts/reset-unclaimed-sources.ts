/**
 * Reset lastExtractedSnapshotId for sources belonging to systems with 0 claims.
 * This makes the extractor pick them up again on next run without --force.
 */
import { prisma } from '../src/lib/db.ts';

async function main() {
  // Systems with zero claims at all
  const zeroClaim = await prisma.$queryRaw<Array<{id: string, name: string}>>`
    SELECT a.id, a.name FROM "AISystem" a
    WHERE NOT EXISTS (SELECT 1 FROM "SystemClaim" sc WHERE sc."systemId" = a.id)
    AND EXISTS (
      SELECT 1 FROM "Source" s
      JOIN "SourceSnapshot" ss ON ss."sourceId" = s.id AND ss.status = 'success'
      WHERE s."systemId" = a.id
    )
  `;

  console.log(`Resetting ${zeroClaim.length} systems with 0 claims:`);
  for (const sys of zeroClaim) {
    const { count } = await prisma.source.updateMany({
      where: { systemId: sys.id, lastExtractedSnapshotId: { not: null } },
      data: { lastExtractedSnapshotId: null },
    });
    console.log(`  ${sys.name} — reset ${count} source(s)`);
  }
  await prisma.$disconnect();
}

main().catch(console.error);
