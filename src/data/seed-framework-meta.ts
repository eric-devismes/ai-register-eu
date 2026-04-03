/**
 * Seed Script — Enrich frameworks with meta information + EU AI Act sections/statements.
 *
 * Run with: npx tsx src/data/seed-framework-meta.ts
 * Safe to run multiple times.
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// ─── Framework Meta Updates ──────────────────────────────

const frameworkUpdates = [
  {
    slug: "eu-ai-act",
    issuingAuthority: "European Parliament & Council of the European Union",
    enforcementType: "Legal — Binding with penalties",
    maxPenalty: "Up to \u20AC35M or 7% of global annual turnover (whichever is higher)",
    applicableRegions: "All EU/EEA member states",
    purpose: "The EU AI Act establishes a comprehensive, risk-based legal framework for artificial intelligence. It aims to ensure that AI systems placed on the EU market are safe, respect fundamental rights, and foster innovation. It is the world's first comprehensive AI regulation.",
    officialUrl: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
    industrySlugs: ["financial-services", "healthcare", "insurance", "public-sector", "human-resources", "manufacturing"],
  },
  {
    slug: "gdpr",
    issuingAuthority: "European Parliament & Council of the European Union",
    enforcementType: "Legal — Binding with penalties",
    maxPenalty: "Up to \u20AC20M or 4% of global annual turnover (whichever is higher)",
    applicableRegions: "All EU/EEA member states + applies to any entity processing EU residents' data",
    purpose: "The General Data Protection Regulation protects the fundamental right to personal data protection. It governs how personal data is collected, processed, stored, and transferred, with specific provisions for automated decision-making and profiling.",
    officialUrl: "https://eur-lex.europa.eu/eli/reg/2016/679/oj",
    industrySlugs: ["financial-services", "healthcare", "insurance", "public-sector", "human-resources", "telecommunications", "manufacturing", "energy-utilities"],
  },
  {
    slug: "dora",
    issuingAuthority: "European Parliament & Council of the European Union",
    enforcementType: "Legal — Binding with penalties",
    maxPenalty: "Determined by national competent authorities; critical ICT third-party providers face direct EU oversight",
    applicableRegions: "All EU/EEA member states — applies to financial entities and their ICT service providers",
    purpose: "The Digital Operational Resilience Act ensures that financial entities can withstand, respond to, and recover from ICT-related disruptions and threats. It creates a uniform framework for ICT risk management in the financial sector.",
    officialUrl: "https://eur-lex.europa.eu/eli/reg/2022/2554/oj",
    industrySlugs: ["financial-services", "insurance"],
  },
  {
    slug: "eba-eiopa-guidelines",
    issuingAuthority: "European Banking Authority (EBA) & European Insurance and Occupational Pensions Authority (EIOPA)",
    enforcementType: "Guideline — Non-binding recommendation",
    maxPenalty: "No direct penalties — non-compliance may trigger supervisory action by national authorities",
    applicableRegions: "All EU/EEA member states — applies to banks, insurers, and pension providers",
    purpose: "Joint guidelines providing sector-specific guidance on the responsible use of AI and machine learning in financial services, focusing on model risk management, consumer protection, and anti-discrimination.",
    officialUrl: "",
    industrySlugs: ["financial-services", "insurance"],
  },
  {
    slug: "mdr-ivdr",
    issuingAuthority: "European Parliament & Council of the European Union",
    enforcementType: "Legal — Binding with penalties",
    maxPenalty: "Up to \u20AC2.5M for individuals or \u20AC10M for legal entities (per infringement)",
    applicableRegions: "All EU/EEA member states",
    purpose: "The Medical Device Regulation and In Vitro Diagnostic Regulation set safety and performance requirements for AI systems used as or embedded in medical devices and diagnostic tools.",
    officialUrl: "https://eur-lex.europa.eu/eli/reg/2017/745/oj",
    industrySlugs: ["healthcare"],
  },
  {
    slug: "national-ai-strategies",
    issuingAuthority: "Various EU member state governments",
    enforcementType: "Guideline — Non-binding recommendation",
    maxPenalty: "No direct penalties — national strategies complement EU-level regulation",
    applicableRegions: "Individual EU member states (varies by country)",
    purpose: "National AI strategies complement the EU-level framework with country-specific priorities, funding programmes, and governance structures for AI development and deployment.",
    officialUrl: "",
    industrySlugs: [],
  },
];

// ─── EU AI Act Sections & Statements ─────────────────────

const euAiActSections = [
  {
    title: "Risk Classification",
    description: "The AI Act classifies AI systems into four risk categories, each with different regulatory requirements.",
    sortOrder: 1,
    statements: [
      {
        reference: "Article 5",
        statement: "Certain AI practices are prohibited outright, including social scoring systems, real-time remote biometric identification in public spaces (with limited exceptions), and AI systems that manipulate human behaviour to circumvent free will.",
        commentary: "Organisations must audit their AI portfolio to ensure no system falls into a prohibited category. This includes any system that could be considered manipulative, exploitative of vulnerabilities, or used for mass surveillance. The penalty for violation is up to 7% of global annual turnover.",
        sortOrder: 1,
      },
      {
        reference: "Article 6 + Annex III",
        statement: "High-risk AI systems are those used in areas listed in Annex III: biometrics, critical infrastructure, education, employment and worker management, access to essential services, law enforcement, migration and border control, and administration of justice.",
        commentary: "If your organisation uses AI for recruitment, credit scoring, insurance underwriting, or any HR decision-making, your AI system is almost certainly classified as high-risk. This triggers the full set of compliance requirements in Title III, Chapter 2.",
        sortOrder: 2,
      },
      {
        reference: "Article 6(3)",
        statement: "An AI system listed in Annex III shall not be considered high-risk if it does not pose a significant risk of harm to health, safety, or fundamental rights, including by not materially influencing the outcome of decision-making.",
        commentary: "This is the 'narrow exception' clause. If your AI system is merely assistive and a human always makes the final decision independently, you may argue it is not high-risk. However, this must be documented and is subject to regulatory scrutiny.",
        sortOrder: 3,
      },
    ],
  },
  {
    title: "Requirements for High-Risk AI Systems",
    description: "High-risk AI systems must comply with a comprehensive set of requirements covering risk management, data governance, documentation, transparency, human oversight, and robustness.",
    sortOrder: 2,
    statements: [
      {
        reference: "Article 9",
        statement: "A risk management system shall be established, implemented, documented, and maintained in relation to high-risk AI systems. It shall be a continuous iterative process planned and run throughout the entire lifecycle of the system.",
        commentary: "This is not a one-time risk assessment. Organisations must establish a living risk management system that is reviewed and updated continuously. It must identify known and foreseeable risks, estimate and evaluate risks, adopt risk management measures, and test their effectiveness. Budget for ongoing risk management resources.",
        sortOrder: 1,
      },
      {
        reference: "Article 10",
        statement: "Training, validation, and testing data sets shall be subject to data governance and management practices. Data sets shall be relevant, sufficiently representative, and to the best extent possible, free of errors and complete in view of the intended purpose.",
        commentary: "Your training data must be documented, representative of the population the system will serve, and checked for biases. For EU deployment, datasets must reflect the geographical, contextual, and behavioural characteristics of the intended deployment environment. This is particularly important for multilingual and multicultural EU markets.",
        sortOrder: 2,
      },
      {
        reference: "Article 11 + Annex IV",
        statement: "Technical documentation shall be drawn up before the system is placed on the market and shall be kept up to date. It shall demonstrate compliance with requirements and provide authorities with information to assess compliance.",
        commentary: "Technical documentation must include: a general description of the system, design specifications, system architecture, data requirements, testing procedures, risk management measures, and a post-market monitoring plan. SMEs may use a simplified format. This documentation must be available to regulators upon request.",
        sortOrder: 3,
      },
      {
        reference: "Article 13",
        statement: "High-risk AI systems shall be designed and developed in such a way as to ensure that their operation is sufficiently transparent to enable deployers to interpret a system's output and use it appropriately.",
        commentary: "Deployers (your organisation, if you use the AI system) must receive instructions of use that include: the provider's identity, the system's characteristics and capabilities, its performance metrics, known limitations, and intended purpose. If you cannot explain how the AI reaches its decisions, the system likely fails this requirement.",
        sortOrder: 4,
      },
      {
        reference: "Article 14",
        statement: "High-risk AI systems shall be designed and developed so as to be effectively overseen by natural persons during the period in which they are in use, including through appropriate human-machine interface tools.",
        commentary: "Human oversight is mandatory. This means real humans must be able to: understand the system's capabilities and limitations, monitor its operation, detect anomalies, and intervene to stop or override the system at any time. 'Rubber stamping' AI decisions does not constitute meaningful human oversight.",
        sortOrder: 5,
      },
      {
        reference: "Article 15",
        statement: "High-risk AI systems shall be designed and developed in such a way that they achieve an appropriate level of accuracy, robustness, and cybersecurity, and perform consistently in those respects throughout their lifecycle.",
        commentary: "The system must be resilient against errors, attacks, and data quality issues. Accuracy levels must be declared and measured. The system must be tested for adversarial robustness. Cybersecurity measures must prevent unauthorised manipulation of inputs or outputs.",
        sortOrder: 6,
      },
    ],
  },
  {
    title: "Transparency Obligations",
    description: "Specific transparency requirements apply to all AI systems, not just high-risk ones.",
    sortOrder: 3,
    statements: [
      {
        reference: "Article 50(1)",
        statement: "Providers shall ensure that AI systems intended to directly interact with natural persons are designed and developed in such a way that the natural persons concerned are informed that they are interacting with an AI system.",
        commentary: "If your chatbot, virtual assistant, or customer service AI interacts with people, those people must be clearly told they are talking to an AI, not a human. This applies regardless of risk level.",
        sortOrder: 1,
      },
      {
        reference: "Article 50(2)",
        statement: "Providers of AI systems that generate synthetic audio, image, video, or text content shall ensure that the outputs are marked in a machine-readable format and detectable as artificially generated or manipulated.",
        commentary: "Deepfakes and AI-generated content must be labelled. If your organisation generates marketing content, images, or videos using AI, these must carry machine-readable markers indicating they are AI-generated.",
        sortOrder: 2,
      },
    ],
  },
  {
    title: "Governance & Enforcement",
    description: "The AI Act establishes governance structures at EU and national level, with significant penalties for non-compliance.",
    sortOrder: 4,
    statements: [
      {
        reference: "Article 64",
        statement: "The European AI Office is established within the Commission to support the implementation of the AI Act, develop expertise, and coordinate enforcement across member states.",
        commentary: "The AI Office will be your point of reference for guidance, codes of practice, and regulatory interpretation. It also oversees compliance of general-purpose AI models (like GPT-4 or Claude).",
        sortOrder: 1,
      },
      {
        reference: "Article 99",
        statement: "Non-compliance with prohibited AI practices results in fines of up to 35 million euros or 7% of global annual turnover. Non-compliance with other provisions results in fines of up to 15 million euros or 3% of global annual turnover.",
        commentary: "These are maximum penalties. National authorities will determine actual fines based on the severity, duration, and intentionality of the infringement. For SMEs, lower caps apply. The financial exposure is significant enough to warrant board-level attention to AI compliance.",
        sortOrder: 2,
      },
    ],
  },
];

// ─── Main Seed Function ──────────────────────────────────

async function main() {
  console.log("Enriching frameworks with meta information...\n");

  // 1. Update framework meta fields
  for (const update of frameworkUpdates) {
    const { slug, industrySlugs, ...fields } = update;

    await prisma.regulatoryFramework.update({
      where: { slug },
      data: {
        ...fields,
        industries: {
          set: industrySlugs.map((s) => ({ slug: s })),
        },
      },
    });
    console.log(`  \u2713 ${slug} — meta fields updated`);
  }

  // 2. Seed EU AI Act sections and statements
  console.log("\nSeeding EU AI Act sections & policy statements...");

  const euAiAct = await prisma.regulatoryFramework.findUnique({
    where: { slug: "eu-ai-act" },
  });
  if (!euAiAct) throw new Error("EU AI Act framework not found in database");

  // Delete existing sections (cascade deletes statements too)
  await prisma.frameworkSection.deleteMany({
    where: { frameworkId: euAiAct.id },
  });

  for (const section of euAiActSections) {
    const { statements, ...sectionData } = section;

    const created = await prisma.frameworkSection.create({
      data: {
        ...sectionData,
        frameworkId: euAiAct.id,
      },
    });

    for (const stmt of statements) {
      await prisma.policyStatement.create({
        data: {
          ...stmt,
          sectionId: created.id,
        },
      });
    }

    console.log(`  \u2713 ${section.title} (${statements.length} statements)`);
  }

  console.log("\nDone!");
}

main()
  .catch((e) => { console.error("Seed failed:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
