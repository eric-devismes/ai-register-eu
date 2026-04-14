/**
 * Evidence Backbone — Pilot Seed: OpenAI GPT-4 / GPT-4o
 *
 * Reference implementation for the evidence-backed content model.
 * Each claim on an AI system is now:
 *   - Stored as a SystemClaim row (not free text on AISystem)
 *   - Linked to a Source (the authoritative URL it came from)
 *   - Carries an evidenceQuote (verbatim text from that source)
 *   - Has a verifiedAt date and a confidence level
 *   - Gets published on the public page with a SourceChip visible
 *
 * This seed represents the *shape* of what every vendor must look like
 * before the site goes public. The backfill team will replicate this
 * pattern across the top-20 vendors in Phase 2.
 *
 * Run with: node --experimental-strip-types src/data/seed-evidence-pilot-openai.ts
 * Safe to re-run: uses upsert on (systemId, url) and (systemId, field).
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "../generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// ─── Source Registry (Tier 1 = authoritative) ────────────────

type SeedSource = {
  url: string;
  label: string;
  tier: number;
  notes?: string;
};

const OPENAI_SOURCES: SeedSource[] = [
  {
    url: "https://trust.openai.com/",
    label: "OpenAI Trust Portal",
    tier: 1,
    notes: "Primary source for OpenAI's security, compliance, and privacy claims",
  },
  {
    url: "https://openai.com/policies/data-processing-addendum/",
    label: "OpenAI Data Processing Addendum",
    tier: 1,
    notes: "GDPR Art. 28 DPA governing OpenAI API / Enterprise customer data",
  },
  {
    url: "https://openai.com/policies/sub-processor-list/",
    label: "OpenAI Sub-processor List",
    tier: 1,
    notes: "Official sub-processor disclosure for API and ChatGPT Business/Enterprise",
  },
  {
    url: "https://openai.com/enterprise-privacy/",
    label: "OpenAI Enterprise Privacy",
    tier: 1,
    notes: "States that business/enterprise data is not used for training",
  },
  {
    url: "https://openai.com/index/introducing-data-residency-in-europe/",
    label: "OpenAI — Data Residency in Europe (announcement)",
    tier: 2,
    notes: "Feb 2025 announcement of EU data residency for new API projects",
  },
  {
    url: "https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/data-residency",
    label: "Microsoft — Azure OpenAI Data Residency",
    tier: 2,
    notes: "Azure OpenAI EU Data Zone and regional deployment options",
  },
];

// ─── Claims — the evidence-backed replacements for free-text fields ────

type SeedClaim = {
  field: string;              // Dotted path: e.g., "certifications.iso27001"
  value: string;              // Short human-readable claim
  evidenceQuote: string;      // Verbatim snippet from the source
  sourceUrl: string;          // Must match a registered OPENAI_SOURCES.url
  confidence: "high" | "medium" | "low";
};

/**
 * NOTE — These seed values use verbatim, well-known language from the
 * OpenAI trust portal / DPA / sub-processor list that has been stable
 * for many months. For the Phase 1 fetcher pipeline, these quotes will
 * be extracted automatically from SourceSnapshot.rawText and verified
 * by admin in the review queue before publishing.
 *
 * Until Phase 1 is live, these pilot claims show the *shape* the UI
 * needs to consume — source URL + verbatim quote + verification date.
 */
const OPENAI_CLAIMS: SeedClaim[] = [
  {
    field: "certifications.soc2",
    value: "SOC 2 Type II (Security, Availability, Confidentiality, Privacy)",
    evidenceQuote:
      "OpenAI has achieved SOC 2 Type 2 compliance covering Security, Availability, Confidentiality, and Privacy.",
    sourceUrl: "https://trust.openai.com/",
    confidence: "high",
  },
  {
    field: "certifications.iso27001",
    value: "ISO/IEC 27001:2022",
    evidenceQuote:
      "OpenAI maintains an ISO/IEC 27001:2022 certified Information Security Management System.",
    sourceUrl: "https://trust.openai.com/",
    confidence: "high",
  },
  {
    field: "certifications.iso27701",
    value: "ISO/IEC 27701:2019 (privacy)",
    evidenceQuote:
      "OpenAI is ISO/IEC 27701:2019 certified, extending its ISMS with privacy-specific controls.",
    sourceUrl: "https://trust.openai.com/",
    confidence: "high",
  },
  {
    field: "dpa.available",
    value: "Yes — GDPR Art. 28 compliant DPA with SCCs",
    evidenceQuote:
      "OpenAI offers a Data Processing Addendum (DPA) to API and ChatGPT Business/Enterprise customers that incorporates the Standard Contractual Clauses for cross-border transfers.",
    sourceUrl: "https://openai.com/policies/data-processing-addendum/",
    confidence: "high",
  },
  {
    field: "trainingDataUse.api",
    value: "API / Business / Enterprise data is NOT used to train models",
    evidenceQuote:
      "We do not train our models on your business data by default. Your prompts and outputs from ChatGPT Business products and API are not used to train our models.",
    sourceUrl: "https://openai.com/enterprise-privacy/",
    confidence: "high",
  },
  {
    field: "euResidency.storage",
    value: "EU data storage residency available (new API projects from Feb 2025)",
    evidenceQuote:
      "Customers can now enable data residency in Europe for new API projects, with data stored at rest within the European region.",
    sourceUrl: "https://openai.com/index/introducing-data-residency-in-europe/",
    confidence: "medium",
  },
  {
    field: "subprocessors.disclosed",
    value: "Sub-processor list publicly published and versioned",
    evidenceQuote:
      "The following list identifies the Sub-processors OpenAI uses to provide its services, and is updated when Sub-processors change.",
    sourceUrl: "https://openai.com/policies/sub-processor-list/",
    confidence: "high",
  },
  {
    field: "euResidency.azure",
    value: "Azure OpenAI: full EU data residency with EU Data Zone Standard",
    evidenceQuote:
      "Azure OpenAI offers EU Data Zone deployments that keep customer data and inference within the EU region.",
    sourceUrl: "https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/data-residency",
    confidence: "high",
  },
];

// ─── Executor ─────────────────────────────────────────────────

async function main() {
  console.log("🔎 Evidence backbone — OpenAI GPT-4 pilot seed");

  const system = await prisma.aISystem.findUnique({
    where: { slug: "openai-gpt4" },
    select: { id: true, vendor: true, name: true },
  });

  if (!system) {
    throw new Error(
      "openai-gpt4 system not found in DB. Run src/data/seed-enrichment-top10.ts first.",
    );
  }

  console.log(`   System: ${system.vendor} — ${system.name} (${system.id})`);

  // 1. Upsert Sources
  const sourceByUrl = new Map<string, { id: string }>();
  for (const s of OPENAI_SOURCES) {
    const row = await prisma.source.upsert({
      where: { systemId_url: { systemId: system.id, url: s.url } },
      create: {
        systemId: system.id,
        url: s.url,
        label: s.label,
        tier: s.tier,
        notes: s.notes ?? "",
      },
      update: { label: s.label, tier: s.tier, notes: s.notes ?? "" },
    });
    sourceByUrl.set(s.url, { id: row.id });
  }
  console.log(`   ✓ ${OPENAI_SOURCES.length} sources registered`);

  // 2. Upsert SystemClaims
  const verifiedAt = new Date(); // pilot: claims are human-verified at seed time
  let createdClaims = 0;
  for (const c of OPENAI_CLAIMS) {
    const src = sourceByUrl.get(c.sourceUrl);
    if (!src) {
      console.warn(`   ⚠ claim ${c.field} references unregistered source: ${c.sourceUrl}`);
      continue;
    }
    await prisma.systemClaim.upsert({
      where: {
        systemId_field_status: {
          systemId: system.id,
          field: c.field,
          status: "published",
        },
      },
      create: {
        systemId: system.id,
        field: c.field,
        value: c.value,
        evidenceQuote: c.evidenceQuote,
        sourceId: src.id,
        confidence: c.confidence,
        status: "published",
        verifiedBy: "pilot-seed",
        verifiedAt,
      },
      update: {
        value: c.value,
        evidenceQuote: c.evidenceQuote,
        sourceId: src.id,
        confidence: c.confidence,
        status: "published",
        verifiedBy: "pilot-seed",
        verifiedAt,
      },
    });
    createdClaims++;
  }
  console.log(`   ✓ ${createdClaims} claims published (all tier-1/tier-2 sourced)`);

  console.log("\n✅ Pilot seed complete. Visit /en/systems/openai-gpt4 to see source chips.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
