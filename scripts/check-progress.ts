import { PrismaClient } from "../src/generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const systems = await prisma.aISystem.findMany({
    where: { sources: { some: {} } },
    select: {
      vendor: true,
      name: true,
      _count: { select: { sources: true } },
      sources: {
        select: {
          id: true,
          url: true,
          snapshots: { where: { status: "success" }, take: 1, orderBy: { fetchedAt: "desc" } },
        },
      },
      claims: { select: { id: true, status: true } },
    },
    orderBy: [{ vendor: "asc" }, { name: "asc" }],
  });

  for (const s of systems) {
    const snapshotsOk = s.sources.filter((x) => x.snapshots.length > 0).length;
    const drafts = s.claims.filter((c) => c.status === "draft").length;
    const published = s.claims.filter((c) => c.status === "published").length;
    console.log(
      `${s.vendor.padEnd(22)} ${s.name.padEnd(38)} sources=${s._count.sources}  snapshots=${snapshotsOk}  drafts=${drafts}  published=${published}`,
    );
  }

  // Total stats
  const totalSnapshots = await prisma.sourceSnapshot.count({ where: { status: "success" } });
  const totalErrors = await prisma.sourceSnapshot.count({ where: { status: { not: "success" } } });
  const totalDrafts = await prisma.systemClaim.count({ where: { status: "draft" } });
  const totalPublished = await prisma.systemClaim.count({ where: { status: "published" } });
  const openTasks = await prisma.reviewTask.count({ where: { status: "open" } });
  console.log(`\n📊 Totals`);
  console.log(`   Successful snapshots:  ${totalSnapshots}`);
  console.log(`   Error snapshots:       ${totalErrors}`);
  console.log(`   Draft claims:          ${totalDrafts}`);
  console.log(`   Published claims:      ${totalPublished}`);
  console.log(`   Open review tasks:     ${openTasks}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
