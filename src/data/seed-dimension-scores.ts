/**
 * Seed dimension scores for Microsoft Azure OpenAI across GDPR and EU AI Act.
 * Demonstrates the spider chart and cross-report page.
 *
 * Run: npx tsx src/data/seed-dimension-scores.ts
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function upsertScore(systemId: string, sectionId: string, score: string, commentary: string) {
  await prisma.dimensionScore.upsert({
    where: { systemId_sectionId: { systemId, sectionId } },
    update: { score, commentary },
    create: { systemId, sectionId, score, commentary },
  });
}

async function main() {
  console.log("Seeding dimension scores...\n");

  // Get Azure OpenAI system
  const azure = await prisma.aISystem.findUnique({ where: { slug: "microsoft-azure-openai-service" } });
  if (!azure) { console.error("Azure OpenAI not found"); return; }

  // ─── GDPR Dimension Scores for Azure OpenAI ────────────
  const gdpr = await prisma.regulatoryFramework.findUnique({
    where: { slug: "gdpr" },
    include: { sections: { orderBy: { sortOrder: "asc" } } },
  });

  if (gdpr) {
    console.log("GDPR scores for Azure OpenAI:");
    const gdprScores: Record<string, { score: string; commentary: string }> = {
      "Core Data Protection Principles": {
        score: "A-",
        commentary: "Microsoft demonstrates strong adherence to GDPR core principles. Data processing purposes are clearly documented, minimisation is supported through configurable retention policies, and comprehensive audit logging supports accountability. Minor gap: some telemetry data collection practices could be more transparent.",
      },
      "Data Subject Rights & Automated Decisions": {
        score: "B",
        commentary: "Good support for access and portability rights via Azure APIs. However, Article 22 compliance for automated decision-making is limited \u2014 LLM outputs do not come with built-in explanation mechanisms. Organisations must implement their own human oversight layer for consequential decisions.",
      },
      "Privacy by Design & Data Processing Agreements": {
        score: "A",
        commentary: "Excellent. Microsoft\u2019s DPA is comprehensive, covers all Article 28 requirements, includes EU SCCs, and is part of the standard Product Terms. Azure Key Vault provides customer-managed encryption keys. Privacy by design is embedded in the Azure architecture.",
      },
      "Data Protection Impact Assessments": {
        score: "B+",
        commentary: "Microsoft provides DPIA templates and supporting documentation. However, the DPIA for specific AI use cases must be conducted by the customer (deployer). Microsoft\u2019s own DPIA for the Azure OpenAI platform is available under NDA to enterprise customers.",
      },
      "International Transfers & Breach Notification": {
        score: "B-",
        commentary: "EU data residency available via EU Data Boundary. However, some support and operational access may still involve non-EU Microsoft staff. Breach notification is within 72 hours (GDPR minimum). The EU Data Boundary programme is still rolling out, not yet complete for all services.",
      },
    };

    for (const section of gdpr.sections) {
      const data = gdprScores[section.title];
      if (data) {
        await upsertScore(azure.id, section.id, data.score, data.commentary);
        console.log(`  \u2713 ${section.title}: ${data.score}`);
      }
    }
  }

  // ─── EU AI Act Dimension Scores for Azure OpenAI ───────
  const aiAct = await prisma.regulatoryFramework.findUnique({
    where: { slug: "eu-ai-act" },
    include: { sections: { orderBy: { sortOrder: "asc" } } },
  });

  if (aiAct) {
    console.log("\nEU AI Act scores for Azure OpenAI:");
    const aiActScores: Record<string, { score: string; commentary: string }> = {
      "Risk Classification": {
        score: "B+",
        commentary: "Microsoft has published EU AI Act guidance and supports customers in self-classifying their use cases. Azure AI Content Safety provides risk filtering. However, the classification responsibility largely falls on the deployer (customer), not the provider.",
      },
      "Requirements for High-Risk Systems": {
        score: "B",
        commentary: "Azure provides comprehensive logging, monitoring, and audit trails. Model cards are published for GPT-4o. However, full technical documentation per Annex IV is not publicly available. Human oversight tools exist but require customer implementation. Adversarial robustness testing is conducted internally.",
      },
      "Transparency Obligations": {
        score: "B+",
        commentary: "Model cards and transparency notes are published. Content filtering provides explanations. Users can be informed they are interacting with AI. However, the labelling of AI-generated content (Article 50) depends on customer implementation.",
      },
      "Governance & Enforcement": {
        score: "A-",
        commentary: "Microsoft has a proactive EU AI Act compliance programme, a dedicated Responsible AI team, and annual transparency reports. Active engagement with the EU AI Office and standards bodies. Binding Corporate Rules approved by EU DPAs.",
      },
    };

    for (const section of aiAct.sections) {
      const data = aiActScores[section.title];
      if (data) {
        await upsertScore(azure.id, section.id, data.score, data.commentary);
        console.log(`  \u2713 ${section.title}: ${data.score}`);
      }
    }
  }

  // ─── Also seed Mistral AI for GDPR (to show another example) ───
  const mistral = await prisma.aISystem.findUnique({ where: { slug: "mistral-ai-mistral-large" } });
  if (mistral && gdpr) {
    console.log("\nGDPR scores for Mistral AI:");
    const mistralGdprScores: Record<string, { score: string; commentary: string }> = {
      "Core Data Protection Principles": {
        score: "A",
        commentary: "EU-native company, French law governs all processing. Data minimisation enforced by design. Full transparency on processing activities. Strongest GDPR positioning of any foundation model provider given EU-native status.",
      },
      "Data Subject Rights & Automated Decisions": {
        score: "A-",
        commentary: "On-premises deployment via Mistral Forge gives customers complete control over data subject rights. API usage does not retain data. Automated decision provisions are the customer\u2019s responsibility when using the platform.",
      },
      "Privacy by Design & Data Processing Agreements": {
        score: "A",
        commentary: "GDPR-compliant DPA governed by French law. EU-native terms. No international transfers required for core processing. Infrastructure partners (Scaleway, OVHcloud) are also EU-based.",
      },
      "Data Protection Impact Assessments": {
        score: "B+",
        commentary: "As an EU-native company, CNIL engagement supports DPIA processes. However, like all LLM providers, the DPIA for specific use cases must be conducted by the deployer. Mistral provides supporting documentation.",
      },
      "International Transfers & Breach Notification": {
        score: "A+",
        commentary: "No international transfers required \u2014 all processing stays in France/EU. On-premises option eliminates any transfer concerns entirely. This is the strongest data residency story of any foundation model provider. Breach notification follows French/EU requirements.",
      },
    };

    for (const section of gdpr.sections) {
      const data = mistralGdprScores[section.title];
      if (data) {
        await upsertScore(mistral.id, section.id, data.score, data.commentary);
        console.log(`  \u2713 ${section.title}: ${data.score}`);
      }
    }
  }

  console.log("\nDone!");
}

main()
  .catch((e) => { console.error("Seed failed:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
