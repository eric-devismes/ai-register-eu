import { prisma } from '../src/lib/db.ts';

const PAIRS = [
  ['salesforce-agentforce-einstein', 'agentforce-einstein-ai'],
  ['sap-joule', 'sap-joule-enterprise'],
  ['workday-ai-talent', 'workday-illuminate-ai'],
  ['palo-alto-networks-cortex-xsiam', 'palo-alto-cortex-xsiam'],
  ['openai-chatgpt-enterprise', 'openai-gpt4'],
  ['anthropic-claude-api', 'anthropic-claude-enterprise'],
  ['mistral-large-2', 'mistral-ai'],
  ['tempus-ai', 'tempus-ai-health'],
];

async function main() {
  for (const [a, b] of PAIRS) {
    const rows = await prisma.aISystem.findMany({
      where: { slug: { in: [a, b] } },
      select: { id: true, slug: true, name: true, status: true, _count: { select: { sources: true, claims: true } } },
    });
    if (rows.length > 1) {
      console.log(`PAIR: ${a} / ${b}`);
      for (const r of rows) {
        console.log(`  [${r.slug}] "${r.name}" status=${r.status} sources=${r._count.sources} claims=${r._count.claims}`);
      }
    } else if (rows.length === 1) {
      console.log(`SINGLE (other deleted?): ${rows[0].slug} — "${rows[0].name}" sources=${rows[0]._count.sources} claims=${rows[0]._count.claims}`);
    } else {
      console.log(`BOTH GONE: ${a} / ${b}`);
    }
  }
  await prisma.$disconnect();
}
main().catch(console.error);
