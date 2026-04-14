/**
 * One-shot triage script for the two open ReviewTasks surfaced by Phase 1a:
 *   - openai.com sources blocked by Cloudflare (403)  → switch to jina-reader strategy
 *   - learn.microsoft.com Azure data residency 404    → replace URL with Foundry deployment-types page
 *
 * After applying changes, resolve the open `source-diff` tasks for these
 * sources so the queue reflects the fix (the next fetcher run will create
 * fresh tasks if the change actually broke something else).
 *
 * Idempotent: safe to re-run.
 */

import { PrismaClient } from "../src/generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const OLD_AZURE_URL =
  "https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/data-residency";
const NEW_AZURE_URL =
  "https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/deployment-types";
const NEW_AZURE_LABEL = "Microsoft — Azure / Foundry Deployment Types (EU Data Zone)";

async function main() {
  console.log("🔧 Triage: fetch errors → jina-reader for openai.com, new URL for Azure");

  // 1. Flip every openai.com Source to jina-reader fetch strategy
  const openaiUpdates = await prisma.source.updateMany({
    where: {
      url: { contains: "openai.com" },
      fetchStrategy: { not: "jina-reader" },
    },
    data: { fetchStrategy: "jina-reader" },
  });
  console.log(`   ✓ Switched ${openaiUpdates.count} openai.com source(s) to jina-reader`);

  // 2. Migrate the Azure Source row from the dead URL to the new URL.
  //    `(systemId, url)` is unique, so updating url in place is the cleanest
  //    move (and preserves snapshot history + claim foreign keys).
  const azureSources = await prisma.source.findMany({
    where: { url: OLD_AZURE_URL },
  });
  for (const src of azureSources) {
    await prisma.source.update({
      where: { id: src.id },
      data: { url: NEW_AZURE_URL, label: NEW_AZURE_LABEL },
    });
    // Re-point any published claims that reference the old URL via sourceId:
    // they already use sourceId, so no change needed. But the legacy pilot
    // seed stored claims keyed on sourceUrl — those are resolved at seed
    // time via sourceByUrl map, so updating url here is enough.
    console.log(`   ✓ Migrated Azure source ${src.id} → ${NEW_AZURE_URL}`);
  }
  if (azureSources.length === 0) {
    console.log(`   • No source row at ${OLD_AZURE_URL} (already migrated)`);
  }

  // 3. Resolve the two open source-diff tasks created when these URLs failed.
  //    The next fetcher run will re-validate; if the new URLs themselves
  //    fail, fresh tasks will be opened automatically.
  const openTasks = await prisma.reviewTask.findMany({
    where: {
      type: "source-diff",
      status: "open",
      OR: [
        { source: { url: { contains: "openai.com" } } },
        { source: { url: NEW_AZURE_URL } },
        { source: { url: OLD_AZURE_URL } },
      ],
    },
    include: { source: { select: { url: true, label: true } } },
  });
  for (const t of openTasks) {
    await prisma.reviewTask.update({
      where: { id: t.id },
      data: {
        status: "resolved",
        resolvedAt: new Date(),
        resolution:
          "Triaged: openai.com sources moved to jina-reader proxy; Azure docs URL " +
          "updated to Foundry deployment-types page. Awaiting next fetcher run for re-validation.",
      },
    });
    console.log(`   ✓ Resolved task ${t.id} (${t.source?.label})`);
  }

  console.log("\n✅ Triage complete. Re-run `npm run evidence:fetch -- --system <id>` to verify.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
