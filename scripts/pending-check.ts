import { prisma } from '../src/lib/db.ts';
async function main() {
  const snapsWithNoClaims = await prisma.$queryRaw<Array<{slug: string, name: string, snapshotCount: bigint}>>`
    SELECT a.slug, a.name, COUNT(ss.id) as "snapshotCount"
    FROM "Source" s
    JOIN "AISystem" a ON a.id = s."systemId"
    JOIN "SourceSnapshot" ss ON ss."sourceId" = s.id AND ss.status = 'success'
    WHERE NOT EXISTS (
      SELECT 1 FROM "SystemClaim" sc WHERE sc."systemId" = s."systemId"
    )
    GROUP BY a.slug, a.name
    ORDER BY "snapshotCount" DESC
  `;
  console.log(`Systems with snapshots but ZERO claims: ${snapsWithNoClaims.length}`);
  for (const r of snapsWithNoClaims) {
    console.log(`  ${r.name} [${r.slug}] — ${r.snapshotCount} snapshots`);
  }

  const total = await prisma.aISystem.count();
  const [withDrafts] = await prisma.$queryRaw<[{cnt: bigint}]>`SELECT COUNT(DISTINCT "systemId") as cnt FROM "SystemClaim" WHERE status='draft'`;
  const [withPub] = await prisma.$queryRaw<[{cnt: bigint}]>`SELECT COUNT(DISTINCT "systemId") as cnt FROM "SystemClaim" WHERE status='published'`;
  const [totalDrafts] = await prisma.$queryRaw<[{cnt: bigint}]>`SELECT COUNT(*) as cnt FROM "SystemClaim" WHERE status='draft'`;
  console.log(`\nTotal systems: ${total}`);
  console.log(`Systems with draft claims: ${withDrafts.cnt}`);
  console.log(`Systems with published claims: ${withPub.cnt}`);
  console.log(`Total draft claims: ${totalDrafts.cnt}`);
  await prisma.$disconnect();
}
main().catch(console.error);
