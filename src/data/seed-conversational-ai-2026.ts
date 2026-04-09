/**
 * Seed: Conversational AI & Enterprise Virtual Agent platforms (April 2026)
 *
 * 10 new AI systems focused on enterprise virtual agents, conversational AI,
 * workflow automation, and IT service management.
 *
 * Run: npx tsx src/data/seed-conversational-ai-2026.ts
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const newSystems = [
  {
    slug: "moveworks-copilot",
    vendor: "Moveworks",
    name: "Moveworks Copilot",
    type: "Enterprise AI Copilot",
    risk: "Limited",
    description:
      "AI-powered employee support platform that automates IT, HR, and finance requests using natural language understanding across enterprise systems. Integrates with ServiceNow, Jira, Okta, and 100+ enterprise apps.",
    category: "Healthcare",
    featured: false,
    industrySlugs: ["financial-services", "telecommunications", "manufacturing"],
    scores: {
      "eu-ai-act": "B",
      "gdpr": "B",
      "dora": "C+",
      "eba-eiopa-guidelines": "C+",
    },
  },
  {
    slug: "aisera-ai-service-experience",
    vendor: "Aisera",
    name: "Aisera AI Service Experience",
    type: "Enterprise AI Service Management",
    risk: "Limited",
    description:
      "AI-driven IT service management and customer service platform using generative AI, NLP, and workflow automation. Provides unsupervised NLU for ticket resolution, knowledge management, and proactive support.",
    category: "Healthcare",
    featured: false,
    industrySlugs: ["telecommunications", "financial-services", "healthcare"],
    scores: {
      "eu-ai-act": "B-",
      "gdpr": "B-",
      "dora": "C+",
      "eba-eiopa-guidelines": "C",
    },
  },
  {
    slug: "kore-ai-xo-platform",
    vendor: "Kore.ai",
    name: "Kore.ai XO Platform",
    type: "Conversational AI Platform",
    risk: "Limited",
    description:
      "Enterprise-grade conversational AI platform for building, training, and deploying virtual assistants across voice and digital channels. Supports 100+ languages with no-code/low-code builder and pre-built industry templates.",
    category: "Financial",
    featured: false,
    industrySlugs: ["financial-services", "healthcare", "telecommunications"],
    scores: {
      "eu-ai-act": "B",
      "gdpr": "B+",
      "dora": "B-",
      "eba-eiopa-guidelines": "B-",
    },
  },
  {
    slug: "n8n-workflow-automation",
    vendor: "n8n",
    name: "n8n",
    type: "AI Workflow Automation",
    risk: "Limited",
    description:
      "Open-source workflow automation platform with native AI agent capabilities. Self-hostable for full data sovereignty, integrates with 400+ apps. Popular in EU for GDPR-compliant AI automation with on-premises deployment.",
    category: "Healthcare",
    featured: false,
    industrySlugs: ["manufacturing", "telecommunications", "financial-services"],
    scores: {
      "eu-ai-act": "B+",
      "gdpr": "A-",
      "dora": "B-",
      "eba-eiopa-guidelines": "B",
    },
  },
  {
    slug: "cognigy-ai",
    vendor: "Cognigy",
    name: "Cognigy.AI",
    type: "Conversational AI Platform",
    risk: "Limited",
    description:
      "German-built enterprise conversational AI platform for customer and employee service automation. ISO 27001 certified, SOC 2 Type II, GDPR-compliant by design. Hosts in EU data centres (Frankfurt). Supports 100+ languages with voice and chat channels.",
    category: "Financial",
    featured: false,
    industrySlugs: ["financial-services", "insurance", "telecommunications"],
    scores: {
      "eu-ai-act": "A-",
      "gdpr": "A",
      "dora": "B+",
      "eba-eiopa-guidelines": "B+",
    },
  },
  {
    slug: "espressive-barista",
    vendor: "Espressive",
    name: "Espressive Barista",
    type: "Enterprise Virtual Agent",
    risk: "Limited",
    description:
      "AI-powered virtual support agent for employee self-service across IT, HR, payroll, legal, and facilities. Uses purpose-built Employee Language Cloud with pre-trained intent models for enterprise support scenarios.",
    category: "Healthcare",
    featured: false,
    industrySlugs: ["human-resources", "financial-services", "manufacturing"],
    scores: {
      "eu-ai-act": "B-",
      "gdpr": "B",
      "dora": "C+",
      "eba-eiopa-guidelines": "C+",
    },
  },
  {
    slug: "boost-ai",
    vendor: "Boost.ai",
    name: "Boost.ai",
    type: "Conversational AI Platform",
    risk: "Limited",
    description:
      "Norwegian enterprise conversational AI platform specialised in banking, insurance, and public sector. Built for EU compliance with on-premises deployment option. Powers virtual agents handling millions of interactions for Nordic and European financial institutions.",
    category: "Financial",
    featured: false,
    industrySlugs: ["financial-services", "insurance", "public-sector"],
    scores: {
      "eu-ai-act": "A-",
      "gdpr": "A",
      "dora": "B+",
      "eba-eiopa-guidelines": "A-",
    },
  },
  {
    slug: "druid-ai",
    vendor: "DRUID AI",
    name: "DRUID AI",
    type: "Conversational AI Platform",
    risk: "Limited",
    description:
      "Romanian-built enterprise conversational AI platform for intelligent automation. Combines NLP, RPA, and generative AI for end-to-end process automation. EU-headquartered with strong European regulatory awareness and multi-language support.",
    category: "Financial",
    featured: false,
    industrySlugs: ["financial-services", "insurance", "public-sector"],
    scores: {
      "eu-ai-act": "B+",
      "gdpr": "A-",
      "dora": "B",
      "eba-eiopa-guidelines": "B",
    },
  },
  {
    slug: "resolve-rita",
    vendor: "Resolve Systems",
    name: "Resolve RITA",
    type: "IT Automation & AIOps",
    risk: "Minimal",
    description:
      "AI-powered IT automation platform (RITA = Resolve Intelligent Technology Agent) for autonomous incident remediation, runbook automation, and event correlation. Automates IT operations workflows with human-in-the-loop guardrails.",
    category: "Healthcare",
    featured: false,
    industrySlugs: ["telecommunications", "financial-services", "manufacturing"],
    scores: {
      "eu-ai-act": "B",
      "gdpr": "B",
      "dora": "B+",
      "eba-eiopa-guidelines": "B",
    },
  },
  {
    slug: "yellow-ai",
    vendor: "Yellow.ai",
    name: "Yellow.ai",
    type: "Enterprise Conversational AI",
    risk: "Limited",
    description:
      "Multi-LLM conversational AI platform powering customer and employee support across 135+ languages with voice, chat, and email channels. Enterprise-grade with SOC 2, ISO 27001, and HIPAA compliance. Strong presence in EMEA financial services and retail.",
    category: "Financial",
    featured: false,
    industrySlugs: ["financial-services", "telecommunications", "insurance"],
    scores: {
      "eu-ai-act": "B",
      "gdpr": "B+",
      "dora": "B-",
      "eba-eiopa-guidelines": "B",
    },
  },
];

async function main() {
  console.log("Seeding 10 conversational AI / enterprise virtual agent systems...\n");

  for (const sys of newSystems) {
    const industries = await prisma.industry.findMany({
      where: { slug: { in: sys.industrySlugs } },
    });

    const created = await prisma.aISystem.upsert({
      where: { slug: sys.slug },
      update: {
        vendor: sys.vendor,
        name: sys.name,
        type: sys.type,
        risk: sys.risk,
        description: sys.description,
        category: sys.category,
        featured: sys.featured,
        industries: { set: industries.map((i) => ({ id: i.id })) },
      },
      create: {
        slug: sys.slug,
        vendor: sys.vendor,
        name: sys.name,
        type: sys.type,
        risk: sys.risk,
        description: sys.description,
        category: sys.category,
        featured: sys.featured,
        industries: { connect: industries.map((i) => ({ id: i.id })) },
      },
    });

    // Upsert scores
    for (const [frameworkSlug, score] of Object.entries(sys.scores)) {
      const framework = await prisma.regulatoryFramework.findUnique({
        where: { slug: frameworkSlug },
      });
      if (!framework) {
        console.warn(`  ⚠ Framework ${frameworkSlug} not found, skipping score`);
        continue;
      }

      await prisma.assessmentScore.upsert({
        where: {
          systemId_frameworkId: { systemId: created.id, frameworkId: framework.id },
        },
        update: { score },
        create: {
          systemId: created.id,
          frameworkId: framework.id,
          score,
        },
      });
    }

    console.log(`  ✓ ${sys.vendor} ${sys.name} (${sys.risk} risk)`);
  }

  console.log(`\n✅ Done — ${newSystems.length} systems seeded.`);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
