# Seed Scripts — AI Compass EU

All seed scripts live in `src/data/`. Run with `npx tsx src/data/<filename>.ts`.

Every script uses `upsert` — safe to run multiple times without duplicating data.

## Execution Order

Run these in order for a fresh database:

```bash
# 1. Core data (frameworks, industries, initial systems)
npx tsx src/data/seed.ts

# 2. Extended vendor profiles (20 enterprise AI systems)
npx tsx src/data/seed-vendors.ts

# 3. Framework meta fields (issuing authority, penalties, etc.)
npx tsx src/data/seed-framework-meta.ts

# 4. Full framework sections with policy statements
npx tsx src/data/seed-all-framework-sections.ts

# 5. Vendor maturity data (founded year, employee count, funding)
npx tsx src/data/seed-vendor-maturity.ts

# 6. Capability type classification
npx tsx src/data/seed-capability-types.ts

# 7. Assessment dates
npx tsx src/data/seed-assessed-dates.ts

# 8. Dimension scores for spider charts
npx tsx src/data/seed-dimension-scores.ts
npx tsx src/data/seed-dimension-scores-expanded.ts

# 9. Changelog entries
npx tsx src/data/seed-changelog.ts

# 10. Admin owner account
npx tsx src/data/seed-admin-owner.ts

# 11. French translations (optional — others auto-generated via DeepL)
npx tsx src/data/seed-translations-fr.ts
```

## Wave Seeds (Additional Content)

These add more AI systems and content, run after the core seeds:

```bash
npx tsx src/data/seed-wave2-2026.ts          # EU AI Act sections + statements
npx tsx src/data/seed-wave3-2026.ts          # Additional systems batch 1
npx tsx src/data/seed-wave4-2026.ts          # Additional systems batch 2
npx tsx src/data/seed-new-content-2026.ts    # Mixed new content
npx tsx src/data/seed-conversational-ai-2026.ts  # Conversational AI systems
npx tsx src/data/seed-enterprise-intelligence.ts # Enterprise BI/analytics systems
npx tsx src/data/seed-gemma4.ts              # Google Gemma 4 system
```

## Platform Deep-Dive Seeds

Detailed vendor profiles for specific platforms:

```bash
npx tsx src/data/seed-platform-deep-m365-sfdc.ts       # Microsoft 365 + Salesforce
npx tsx src/data/seed-platform-deep-sap-ibm-google.ts  # SAP, IBM, Google
npx tsx src/data/seed-servicenow-deep.ts               # ServiceNow
```

## What Each Script Does

| Script | Creates/Updates | Records |
|--------|----------------|---------|
| `seed.ts` | Frameworks, Industries, initial Systems + Scores | ~20 |
| `seed-vendors.ts` | Extended AI systems with full profiles | ~20 |
| `seed-framework-meta.ts` | Meta fields on existing frameworks | ~6 |
| `seed-all-framework-sections.ts` | Sections + policy statements | ~50+ |
| `seed-vendor-maturity.ts` | Maturity data on existing systems | ~20 |
| `seed-capability-types.ts` | capabilityType field on systems | ~20 |
| `seed-assessed-dates.ts` | assessedAt dates on systems | ~20 |
| `seed-dimension-scores.ts` | Per-section scores for spider charts | ~100+ |
| `seed-changelog.ts` | Changelog entries | ~45 |
| `seed-admin-owner.ts` | Admin owner account | 1 |
| `seed-translations-fr.ts` | French translations | ~50 |
| `seed-wave*.ts` | Additional systems + content | varies |
| `seed-platform-deep-*.ts` | Deep vendor profiles | 2-3 each |

## Prerequisites

All scripts require `DATABASE_URL` in `.env.local`. They create their own Prisma client instance (not the app singleton) so they can run standalone.
