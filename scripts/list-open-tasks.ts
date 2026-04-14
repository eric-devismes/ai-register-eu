import { PrismaClient } from "../src/generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const tasks = await prisma.reviewTask.findMany({
    where: { status: "open" },
    include: {
      source: {
        select: {
          url: true,
          label: true,
          tier: true,
          system: { select: { vendor: true, name: true, slug: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  for (const t of tasks) {
    console.log("---");
    console.log("Task:", t.id, "|", t.type, "|", t.priority);
    console.log(
      "System:",
      t.source?.system.vendor,
      "-",
      t.source?.system.name,
      `(${t.source?.system.slug})`,
    );
    console.log("Source tier:", t.source?.tier, "|", t.source?.label);
    console.log("URL:", t.source?.url);
    console.log("Reason:", t.reason);
    console.log("Created:", t.createdAt.toISOString());
  }
  console.log("---");
  console.log("Total open:", tasks.length);

  // Also check recent fetch errors
  console.log("\n=== Recent failed snapshots ===");
  const snaps = await prisma.sourceSnapshot.findMany({
    where: { status: { not: "success" } },
    orderBy: { fetchedAt: "desc" },
    take: 10,
    include: { source: { select: { url: true, label: true } } },
  });
  for (const s of snaps) {
    console.log(`${s.fetchedAt.toISOString()}  ${s.status}  ${s.source.url}`);
    console.log(`  ${s.errorMessage}`);
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
