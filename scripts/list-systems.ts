import { PrismaClient } from "../src/generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  // What columns exist? List a few systems first.
  const systems = await prisma.aISystem.findMany({
    select: {
      id: true,
      slug: true,
      vendor: true,
      name: true,
      category: true,
      _count: { select: { sources: true, claims: true } },
    },
    orderBy: [{ vendor: "asc" }, { name: "asc" }],
  });

  console.log(`Total AI systems: ${systems.length}\n`);

  // Group by vendor to see uniques
  const byVendor = new Map<string, typeof systems>();
  for (const s of systems) {
    if (!byVendor.has(s.vendor)) byVendor.set(s.vendor, []);
    byVendor.get(s.vendor)!.push(s);
  }

  console.log(`Unique vendors: ${byVendor.size}\n`);
  for (const [vendor, sys] of byVendor) {
    const totalSources = sys.reduce((a, s) => a + s._count.sources, 0);
    const totalClaims = sys.reduce((a, s) => a + s._count.claims, 0);
    const sourcesIcon = totalSources > 0 ? "✓" : "·";
    console.log(
      `${sourcesIcon} ${vendor.padEnd(25)} systems=${sys.length}  sources=${totalSources}  claims=${totalClaims}`,
    );
    for (const s of sys) {
      console.log(`     • ${s.slug.padEnd(40)} ${s.name}  [${s.category}]`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
