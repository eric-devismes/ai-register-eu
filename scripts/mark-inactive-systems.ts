import { PrismaClient } from "../src/generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";

const INACTIVE_SLUGS = [
  "apple-intelligence-enterprise",
  "bloomberg-ai",
  "deepseek-r1",
  "elevenlabs-enterprise",
  "google-gemma-4",
  "hubspot-breeze-ai",
  "monday-ai",
  "n8n-workflow-automation",
  "notion-ai",
  "perplexity-ai-enterprise",
  "runway-ai-video",
  "stability-ai-sdxl",
  "xai-grok-enterprise",
  "zoom-ai-companion",
  "deepmind-isomorphic",
];

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  const prisma = new PrismaClient({ adapter });

  const found = await prisma.aISystem.findMany({
    where: { slug: { in: INACTIVE_SLUGS } },
    select: { slug: true, vendor: true, name: true, status: true },
  });
  const foundSlugs = new Set(found.map((s) => s.slug));
  const missing = INACTIVE_SLUGS.filter((s) => !foundSlugs.has(s));
  if (missing.length) console.warn("Not found in DB:", missing);

  const result = await prisma.aISystem.updateMany({
    where: { slug: { in: INACTIVE_SLUGS } },
    data: { status: "inactive" },
  });

  console.log(`Marked ${result.count} systems inactive.`);

  const counts = await prisma.aISystem.groupBy({ by: ["status"], _count: true });
  console.log("Status distribution:", counts);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
