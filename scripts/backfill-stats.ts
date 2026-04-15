import { PrismaClient } from "../src/generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const [
    systemTotal,
    draftTotal,
    publishedTotal,
    rejectedTotal,
    systemsWithDrafts,
    systemsWithPublished,
    byConfidence,
  ] = await Promise.all([
    prisma.aISystem.count(),
    prisma.systemClaim.count({ where: { status: "draft" } }),
    prisma.systemClaim.count({ where: { status: "published" } }),
    prisma.systemClaim.count({ where: { status: "rejected" } }),
    prisma.systemClaim
      .groupBy({ by: ["systemId"], where: { status: "draft" } })
      .then((rows) => rows.length),
    prisma.systemClaim
      .groupBy({ by: ["systemId"], where: { status: "published" } })
      .then((rows) => rows.length),
    prisma.systemClaim.groupBy({
      by: ["confidence"],
      where: { status: "draft" },
      _count: true,
    }),
  ]);

  console.log("\n📊 Evidence DB state\n");
  console.log(`  Systems in catalog:       ${systemTotal}`);
  console.log(`  Systems w/ draft claims:  ${systemsWithDrafts}`);
  console.log(`  Systems w/ published:     ${systemsWithPublished}`);
  console.log(`  Total drafts:             ${draftTotal}`);
  console.log(`  Total published:          ${publishedTotal}`);
  console.log(`  Total rejected:           ${rejectedTotal}`);
  console.log(`\n  Drafts by confidence:`);
  for (const row of byConfidence.sort((a, b) => String(a.confidence).localeCompare(String(b.confidence)))) {
    console.log(`    ${row.confidence ?? "null"}: ${row._count}`);
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
