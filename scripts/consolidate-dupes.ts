/**
 * Consolidate duplicate AISystem records.
 * Safe merge: moves claims + unique sources to the keeper, deletes the loser.
 * Run with: npx tsx --env-file=.env.local scripts/consolidate-dupes.ts
 * Add --dry-run to preview without changes.
 */
import { prisma } from '../src/lib/db.ts';

const DRY_RUN = process.argv.includes('--dry-run');

// [keeper-slug, loser-slug] — keeper is the one we keep
const PAIRS: [string, string][] = [
  ['salesforce-agentforce-einstein', 'agentforce-einstein-ai'],
  ['sap-joule', 'sap-joule-enterprise'],
  ['workday-illuminate-ai', 'workday-ai-talent'],
  ['palo-alto-networks-cortex-xsiam', 'palo-alto-cortex-xsiam'],
  ['openai-chatgpt-enterprise', 'openai-gpt4'],
  ['anthropic-claude-enterprise', 'anthropic-claude-api'],
  ['mistral-ai', 'mistral-large-2'],
  ['tempus-ai', 'tempus-ai-health'],
];

async function mergePair(keeperSlug: string, loserSlug: string) {
  const keeper = await prisma.aISystem.findUnique({ where: { slug: keeperSlug }, select: { id: true, name: true } });
  const loser = await prisma.aISystem.findUnique({ where: { slug: loserSlug }, select: { id: true, name: true } });

  if (!keeper) { console.log(`  SKIP: keeper ${keeperSlug} not found`); return; }
  if (!loser) { console.log(`  SKIP: loser ${loserSlug} not found`); return; }

  console.log(`\nMerging "${loser.name}" [${loserSlug}] → "${keeper.name}" [${keeperSlug}]`);

  // Sources in loser
  const loserSources = await prisma.source.findMany({ where: { systemId: loser.id }, select: { id: true, url: true } });
  // Sources already in keeper
  const keeperSources = await prisma.source.findMany({ where: { systemId: keeper.id }, select: { id: true, url: true } });
  const keeperUrlMap = new Map(keeperSources.map(s => [s.url, s.id]));

  for (const src of loserSources) {
    if (keeperUrlMap.has(src.url)) {
      // Duplicate URL: re-point any claims from loser-source → keeper-source
      const keeperSrcId = keeperUrlMap.get(src.url)!;
      const affected = await prisma.systemClaim.count({ where: { sourceId: src.id } });
      console.log(`  Source duplicate URL ${src.url} — re-pointing ${affected} claims to keeper source`);
      if (!DRY_RUN && affected > 0) {
        await prisma.systemClaim.updateMany({ where: { sourceId: src.id }, data: { sourceId: keeperSrcId } });
      }
      // Leave the loser source — will be cascade-deleted with the loser AISystem
    } else {
      // Unique URL: move the source to keeper
      console.log(`  Moving source ${src.url} to keeper`);
      if (!DRY_RUN) {
        await prisma.source.update({ where: { id: src.id }, data: { systemId: keeper.id } });
      }
    }
  }

  // Move remaining claims — skip any that would violate (systemId, field, status) unique constraint
  const loserClaims = await prisma.systemClaim.findMany({
    where: { systemId: loser.id },
    select: { id: true, field: true, status: true },
  });
  const keeperFieldStatusSet = new Set(
    (await prisma.systemClaim.findMany({
      where: { systemId: keeper.id },
      select: { field: true, status: true },
    })).map(c => `${c.field}::${c.status}`)
  );

  const claimsToMove = loserClaims.filter(c => !keeperFieldStatusSet.has(`${c.field}::${c.status}`));
  const claimsToDiscard = loserClaims.filter(c => keeperFieldStatusSet.has(`${c.field}::${c.status}`));

  console.log(`  Moving ${claimsToMove.length} claims to keeper, discarding ${claimsToDiscard.length} duplicates`);
  if (!DRY_RUN) {
    if (claimsToMove.length > 0) {
      await prisma.systemClaim.updateMany({
        where: { id: { in: claimsToMove.map(c => c.id) } },
        data: { systemId: keeper.id },
      });
    }
    if (claimsToDiscard.length > 0) {
      await prisma.systemClaim.deleteMany({ where: { id: { in: claimsToDiscard.map(c => c.id) } } });
    }
  }

  // Delete the loser (cascade removes remaining sources, snapshots, claims)
  console.log(`  Deleting loser [${loserSlug}]`);
  if (!DRY_RUN) {
    await prisma.aISystem.delete({ where: { id: loser.id } });
  }
  console.log(`  ✓ Done`);
}

async function main() {
  if (DRY_RUN) console.log('=== DRY RUN — no changes will be made ===\n');
  
  for (const [keeper, loser] of PAIRS) {
    await mergePair(keeper, loser);
  }
  
  // Final count
  const total = await prisma.aISystem.count();
  console.log(`\nDone. AISystem total: ${total}`);
  
  await prisma.$disconnect();
}

main().catch(console.error);
