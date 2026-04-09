/**
 * Seed: Google Gemma 4 — Open-weights foundation model.
 *
 * Run: npx tsx src/data/seed-gemma4.ts
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding Google Gemma 4...\n");

  const industries = await prisma.industry.findMany({
    where: { slug: { in: ["manufacturing", "telecommunications", "healthcare"] } },
  });

  const system = await prisma.aISystem.upsert({
    where: { slug: "google-gemma-4" },
    update: {
      vendor: "Google",
      name: "Gemma 4",
      type: "Open-Weights Foundation Model",
      risk: "Limited",
      description: "Google's latest open-weights model family (2B, 12B, 27B parameters). Fully self-hostable with permissive license. Strong multilingual capabilities covering all EU languages. Designed for enterprise fine-tuning and on-premises deployment with full data sovereignty.",
      category: "Healthcare",
      featured: false,
      capabilityType: "generative-ai",
      deploymentModel: "hybrid",
      sourceModel: "open-weights",
      foundedYear: 1998,
      employeeCount: "180,000+",
      fundingStatus: "Public (GOOGL, $2T+ market cap)",
      marketPresence: "Challenger",
      customerCount: "10,000+ deployments",
      notableCustomers: "Samsung, Hugging Face community, numerous EU research institutions, Aleph Alpha (benchmarking)",
      customerStories: "Samsung integrates Gemma models for on-device AI features. EU research institutions use Gemma for NLP research with full data sovereignty. Multiple EU startups deploy self-hosted Gemma for GDPR-compliant AI applications.",
      vendorHq: "Mountain View, USA",
      euPresence: "Major EU presence: offices in Dublin, London, Munich, Paris, Zurich. Google Cloud regions in Frankfurt, Netherlands, Finland, Belgium, Poland, Italy, Spain.",
      useCases: "Text generation and summarization\nCode generation and review\nMultilingual content creation (EU languages)\nDocument analysis and extraction\nCustomer service chatbots (self-hosted)\nEnterprise knowledge base Q&A\nFine-tuned domain-specific models\nOn-premises AI for regulated industries",
      dataStorage: "Self-hosted: data stays entirely on your infrastructure. Cloud (Vertex AI): EU regions available in Frankfurt, Netherlands, Finland.",
      dataProcessing: "Self-hosted: zero data leaves your environment. Cloud: processed in selected Google Cloud region with EU data residency options.",
      trainingDataUse: "Open-weights model trained on Google's data. Fine-tuning data remains fully under customer control. No customer data used for base model training.",
      encryptionInfo: "Self-hosted: customer-managed encryption. Cloud: AES-256 at rest, TLS 1.3 in transit, customer-managed encryption keys (CMEK) available.",
      certifications: "Google Cloud: ISO 27001, ISO 27017, ISO 27018, SOC 1/2/3, C5, ENS High, BSI IT-Grundschutz, HDS (France)",
      accessControls: "Self-hosted: fully customer-managed. Cloud: IAM, VPC Service Controls, Binary Authorization, Workload Identity.",
      modelDocs: "Full model cards published. Architecture documentation. Benchmark results on standard evaluations. Training methodology disclosed.",
      explainability: "Token-level probability outputs. Attention visualization supported. No built-in SHAP/LIME but compatible with standard explainability frameworks.",
      biasTesting: "Evaluated across demographic groups. Bias benchmarks published in model card. Google Responsible AI practices applied during development.",
      aiActStatus: "Open-weights model with GPAI transparency obligations. Model card and technical documentation provided. Deployers responsible for use-case-specific compliance.",
      gdprStatus: "Self-hosted: full GDPR compliance as data never leaves customer infrastructure. Cloud: Google DPA available, EU SCCs, adequacy decisions.",
      euResidency: "Self-hosted: full EU data residency by design. Cloud: EU-only processing available via Vertex AI with data residency controls.",
      industries: { set: industries.map((i) => ({ id: i.id })) },
    },
    create: {
      slug: "google-gemma-4",
      vendor: "Google",
      name: "Gemma 4",
      type: "Open-Weights Foundation Model",
      risk: "Limited",
      description: "Google's latest open-weights model family (2B, 12B, 27B parameters). Fully self-hostable with permissive license. Strong multilingual capabilities covering all EU languages. Designed for enterprise fine-tuning and on-premises deployment with full data sovereignty.",
      category: "Healthcare",
      featured: false,
      capabilityType: "generative-ai",
      deploymentModel: "hybrid",
      sourceModel: "open-weights",
      foundedYear: 1998,
      employeeCount: "180,000+",
      fundingStatus: "Public (GOOGL, $2T+ market cap)",
      marketPresence: "Challenger",
      customerCount: "10,000+ deployments",
      notableCustomers: "Samsung, Hugging Face community, numerous EU research institutions, Aleph Alpha (benchmarking)",
      customerStories: "Samsung integrates Gemma models for on-device AI features. EU research institutions use Gemma for NLP research with full data sovereignty. Multiple EU startups deploy self-hosted Gemma for GDPR-compliant AI applications.",
      vendorHq: "Mountain View, USA",
      euPresence: "Major EU presence: offices in Dublin, London, Munich, Paris, Zurich. Google Cloud regions in Frankfurt, Netherlands, Finland, Belgium, Poland, Italy, Spain.",
      useCases: "Text generation and summarization\nCode generation and review\nMultilingual content creation (EU languages)\nDocument analysis and extraction\nCustomer service chatbots (self-hosted)\nEnterprise knowledge base Q&A\nFine-tuned domain-specific models\nOn-premises AI for regulated industries",
      dataStorage: "Self-hosted: data stays entirely on your infrastructure. Cloud (Vertex AI): EU regions available in Frankfurt, Netherlands, Finland.",
      dataProcessing: "Self-hosted: zero data leaves your environment. Cloud: processed in selected Google Cloud region with EU data residency options.",
      trainingDataUse: "Open-weights model trained on Google's data. Fine-tuning data remains fully under customer control. No customer data used for base model training.",
      encryptionInfo: "Self-hosted: customer-managed encryption. Cloud: AES-256 at rest, TLS 1.3 in transit, customer-managed encryption keys (CMEK) available.",
      certifications: "Google Cloud: ISO 27001, ISO 27017, ISO 27018, SOC 1/2/3, C5, ENS High, BSI IT-Grundschutz, HDS (France)",
      accessControls: "Self-hosted: fully customer-managed. Cloud: IAM, VPC Service Controls, Binary Authorization, Workload Identity.",
      modelDocs: "Full model cards published. Architecture documentation. Benchmark results on standard evaluations. Training methodology disclosed.",
      explainability: "Token-level probability outputs. Attention visualization supported. No built-in SHAP/LIME but compatible with standard explainability frameworks.",
      biasTesting: "Evaluated across demographic groups. Bias benchmarks published in model card. Google Responsible AI practices applied during development.",
      aiActStatus: "Open-weights model with GPAI transparency obligations. Model card and technical documentation provided. Deployers responsible for use-case-specific compliance.",
      gdprStatus: "Self-hosted: full GDPR compliance as data never leaves customer infrastructure. Cloud: Google DPA available, EU SCCs, adequacy decisions.",
      euResidency: "Self-hosted: full EU data residency by design. Cloud: EU-only processing available via Vertex AI with data residency controls.",
      industries: { connect: industries.map((i) => ({ id: i.id })) },
    },
  });

  // Add scores
  const scores = {
    "eu-ai-act": "B+",
    "gdpr": "A",
    "dora": "B",
    "eba-eiopa-guidelines": "B+",
  };

  for (const [frameworkSlug, score] of Object.entries(scores)) {
    const framework = await prisma.regulatoryFramework.findUnique({
      where: { slug: frameworkSlug },
    });
    if (!framework) continue;

    await prisma.assessmentScore.upsert({
      where: {
        systemId_frameworkId: { systemId: system.id, frameworkId: framework.id },
      },
      update: { score },
      create: { systemId: system.id, frameworkId: framework.id, score },
    });
  }

  console.log("  ✓ Google Gemma 4 seeded with scores");
  console.log("\n✅ Done.");
}

main()
  .catch((e) => { console.error("Seed failed:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
