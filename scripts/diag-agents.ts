import { PrismaClient } from "../src/generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  const prisma = new PrismaClient({ adapter });

  const [cycleCount, reportCount, discussionCount] = await Promise.all([
    prisma.workCycle.count(),
    prisma.agentReport.count(),
    prisma.expertDiscussion.count(),
  ]);
  console.log(`WorkCycles: ${cycleCount}  AgentReports: ${reportCount}  ExpertDiscussions: ${discussionCount}`);

  const recent = await prisma.workCycle.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { _count: { select: { reports: true } } },
  });
  console.log("\nMost recent work cycles:");
  for (const c of recent) {
    console.log(`  ${c.createdAt.toISOString()} | ${c.status} | reports=${c._count.reports}`);
  }

  const recentReports = await prisma.agentReport.findMany({
    orderBy: { createdAt: "desc" },
    take: 15,
    select: { createdAt: true, agentName: true, hasFindings: true, done: true },
  });
  console.log("\nMost recent agent reports:");
  for (const r of recentReports) {
    console.log(`  ${r.createdAt.toISOString()} | ${r.agentName} | findings=${r.hasFindings} | done=${r.done}`);
  }

  const recentDiscussions = await prisma.expertDiscussion.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { createdAt: true, topic: true, outcome: true },
  });
  console.log("\nMost recent expert discussions:");
  for (const d of recentDiscussions) {
    console.log(`  ${d.createdAt.toISOString()} | ${d.topic?.slice(0, 60) ?? "(no topic)"} | ${d.outcome?.slice(0, 30) ?? "?"}`);
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
