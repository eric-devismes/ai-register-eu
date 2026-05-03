/**
 * Database Seed Script
 *
 * Populates the database with:
 *   - 6 regulatory frameworks (EU AI Act, GDPR, DORA, etc.)
 *   - 8 industries (Financial Services, Healthcare, etc.)
 *   - 6 AI systems with per-framework assessment scores
 *
 * Run with: npx tsx src/data/seed.ts
 *
 * Uses upsert so it's safe to run multiple times —
 * existing records are updated, not duplicated.
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" }); // Load env vars before anything else

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// ─── Regulatory Frameworks ───────────────────────────────

const frameworks = [
  {
    slug: "eu-ai-act",
    name: "EU AI Act",
    description: "Comprehensive risk-based regulatory framework for AI systems covering prohibited practices, high-risk requirements, and transparency obligations.",
    badgeType: "EU",
    criteriaCount: 47,
    effectiveDate: "Aug 2025",
    content: "# EU AI Act\n\nThe EU AI Act is the world's first comprehensive legal framework for artificial intelligence. It classifies AI systems by risk level and imposes requirements accordingly.\n\n## Risk Categories\n\n- **Unacceptable Risk** — Banned (e.g., social scoring, real-time biometric surveillance)\n- **High Risk** — Strict requirements (e.g., credit scoring, recruitment tools)\n- **Limited Risk** — Transparency obligations (e.g., chatbots, deepfakes)\n- **Minimal Risk** — No specific requirements\n\n## Key Requirements for High-Risk Systems\n\n- Risk management system\n- Data governance\n- Technical documentation\n- Record-keeping and traceability\n- Transparency and information to users\n- Human oversight\n- Accuracy, robustness, and cybersecurity",
  },
  {
    slug: "gdpr",
    name: "GDPR",
    description: "General Data Protection Regulation governing personal data processing, consent, data subject rights, and cross-border data transfers.",
    badgeType: "EU",
    criteriaCount: 32,
    effectiveDate: "May 2018",
    content: "# GDPR\n\nThe General Data Protection Regulation is the EU's flagship data privacy law. It applies to any organisation processing personal data of EU residents.\n\n## Core Principles\n\n- Lawfulness, fairness, and transparency\n- Purpose limitation\n- Data minimisation\n- Accuracy\n- Storage limitation\n- Integrity and confidentiality\n- Accountability\n\n## Key Rights\n\n- Right to access\n- Right to erasure\n- Right to data portability\n- Right to object to automated decision-making",
  },
  {
    slug: "dora",
    name: "DORA",
    description: "Digital Operational Resilience Act ensuring financial entities can withstand ICT-related disruptions and threats.",
    badgeType: "EU",
    criteriaCount: 28,
    effectiveDate: "Jan 2025",
    content: "# DORA\n\nThe Digital Operational Resilience Act establishes a comprehensive framework for ICT risk management in the financial sector.\n\n## Key Areas\n\n- ICT risk management\n- ICT incident reporting\n- Digital operational resilience testing\n- ICT third-party risk management\n- Information sharing",
  },
  {
    slug: "eba-eiopa-guidelines",
    name: "EBA/EIOPA Guidelines",
    description: "Sector-specific guidelines from European Banking and Insurance authorities on AI use in financial services.",
    badgeType: "Sector",
    criteriaCount: 35,
    effectiveDate: "Mar 2024",
    content: "# EBA/EIOPA Guidelines\n\nJoint guidelines from the European Banking Authority and European Insurance and Occupational Pensions Authority on AI governance in financial services.\n\n## Focus Areas\n\n- Model risk management\n- Explainability of AI decisions\n- Consumer protection\n- Anti-discrimination requirements",
  },
  {
    slug: "mdr-ivdr",
    name: "MDR/IVDR",
    description: "Medical Device and In Vitro Diagnostic Regulation covering AI-powered medical devices and diagnostic tools.",
    badgeType: "Sector",
    criteriaCount: 41,
    effectiveDate: "May 2021",
    content: "# MDR/IVDR\n\nThe Medical Device Regulation and In Vitro Diagnostic Regulation set requirements for AI systems used as medical devices.\n\n## Key Requirements\n\n- Clinical evidence\n- Post-market surveillance\n- Unique Device Identification\n- Quality management systems\n- Technical documentation",
  },
  {
    slug: "national-ai-strategies",
    name: "National AI Strategies",
    description: "National-level AI governance frameworks and strategies across EU member states.",
    badgeType: "National",
    criteriaCount: 24,
    effectiveDate: "Varies",
    content: "# National AI Strategies\n\nEU member states have developed their own AI strategies complementing the EU-level framework.\n\n## Notable Strategies\n\n- **France** — National AI Strategy\n- **Germany** — AI Strategy and AI Act implementation\n- **Netherlands** — Strategic Action Plan for AI\n- **Spain** — National AI Strategy (ENIA)",
  },
];

// ─── Industries ──────────────────────────────────────────

const industries = [
  { slug: "financial-services",   name: "Financial Services",   colorClass: "bg-blue-100 text-blue-700",     iconName: "banknotes" },
  { slug: "healthcare",           name: "Healthcare",           colorClass: "bg-emerald-100 text-emerald-700", iconName: "heart" },
  { slug: "insurance",            name: "Insurance",            colorClass: "bg-violet-100 text-violet-700",  iconName: "shield" },
  { slug: "public-sector",        name: "Public Sector",        colorClass: "bg-amber-100 text-amber-700",    iconName: "building-library" },
  { slug: "manufacturing",        name: "Manufacturing",        colorClass: "bg-orange-100 text-orange-700",  iconName: "cog" },
  { slug: "telecommunications",   name: "Telecommunications",   colorClass: "bg-cyan-100 text-cyan-700",     iconName: "signal" },
  { slug: "energy-utilities",     name: "Energy & Utilities",   colorClass: "bg-yellow-100 text-yellow-700",  iconName: "bolt" },
  { slug: "human-resources",      name: "Human Resources",      colorClass: "bg-rose-100 text-rose-700",     iconName: "users" },
];

// ─── AI Systems (with industry and score assignments) ────

const systems = [
  {
    slug: "microsoft-azure-openai-service",
    vendor: "Microsoft",
    name: "Azure OpenAI Service",
    type: "Foundation Model Platform",
    risk: "High",
    description: "Enterprise-grade access to OpenAI models with Azure security, compliance, and regional availability across EU data centres.",
    category: "Financial",
    featured: true,
    industrySlugs: ["financial-services", "healthcare", "public-sector"],
    scores: { "eu-ai-act": "B+", "gdpr": "A-", "dora": "B", "eba-eiopa-guidelines": "B+" },
  },
  {
    slug: "salesforce-einstein-gpt",
    vendor: "Salesforce",
    name: "Einstein GPT",
    type: "CRM AI Assistant",
    risk: "Limited",
    description: "Generative AI for CRM delivering personalised content across sales, service, marketing, and commerce workflows.",
    category: "Financial",
    featured: true,
    industrySlugs: ["financial-services", "insurance", "telecommunications"],
    scores: { "eu-ai-act": "B", "gdpr": "B+", "dora": "B-", "eba-eiopa-guidelines": "B" },
  },
  {
    slug: "palantir-palantir-aip",
    vendor: "Palantir",
    name: "Palantir AIP",
    type: "Decision Intelligence Platform",
    risk: "High",
    description: "AI-powered platform for complex decision-making integrating LLMs with operational data in defence and civilian applications.",
    category: "Public Sector",
    featured: true,
    industrySlugs: ["public-sector", "manufacturing", "healthcare"],
    scores: { "eu-ai-act": "C+", "gdpr": "B-", "dora": "C", "eba-eiopa-guidelines": "C+" },
  },
  {
    slug: "workday-workday-ai",
    vendor: "Workday",
    name: "Workday AI",
    type: "HR AI Platform",
    risk: "High",
    description: "Machine learning-driven talent management, workforce planning, and employee experience optimisation tools.",
    category: "HR",
    featured: true,
    industrySlugs: ["human-resources", "financial-services", "public-sector"],
    scores: { "eu-ai-act": "B-", "gdpr": "B+", "dora": "C+", "eba-eiopa-guidelines": "B" },
  },
  {
    slug: "fico-fico-platform",
    vendor: "FICO",
    name: "FICO Platform",
    type: "Decision Management",
    risk: "High",
    description: "AI-driven credit scoring and fraud detection platform used by major European banks and financial institutions.",
    category: "Financial",
    featured: true,
    industrySlugs: ["financial-services", "insurance"],
    scores: { "eu-ai-act": "B+", "gdpr": "A", "dora": "A-", "eba-eiopa-guidelines": "A-" },
  },
  {
    slug: "servicenow-servicenow-now-assist",
    vendor: "ServiceNow",
    name: "ServiceNow Now Assist",
    type: "Enterprise AI Assistant",
    risk: "Limited",
    description: "Generative AI capabilities embedded across IT service management, HR, and customer service workflows.",
    category: "Healthcare",
    featured: true,
    industrySlugs: ["telecommunications", "financial-services", "healthcare"],
    scores: { "eu-ai-act": "B", "gdpr": "B+", "dora": "B", "eba-eiopa-guidelines": "B" },
  },
  {
    slug: "anthropic-claude",
    vendor: "Anthropic",
    name: "Claude",
    type: "Foundation Model",
    risk: "High",
    description: "General-purpose AI assistant focused on safety, helpfulness, and honesty. Available via API and direct access for enterprise use.",
    category: "Financial",
    featured: false,
    industrySlugs: ["financial-services", "healthcare", "public-sector", "human-resources"],
    scores: { "eu-ai-act": "B+", "gdpr": "B", "dora": "B", "eba-eiopa-guidelines": "B" },
  },
  {
    slug: "openai-gpt-4",
    vendor: "OpenAI",
    name: "GPT-4",
    type: "Foundation Model",
    risk: "High",
    description: "Multimodal large language model powering enterprise applications in content generation, analysis, coding, and decision support.",
    category: "Financial",
    featured: false,
    industrySlugs: ["financial-services", "healthcare", "telecommunications", "public-sector"],
    scores: { "eu-ai-act": "B", "gdpr": "B-", "dora": "B-", "eba-eiopa-guidelines": "B-" },
  },
  {
    slug: "mistral-ai-mistral-large",
    vendor: "Mistral AI",
    name: "Mistral Large",
    type: "Foundation Model",
    risk: "High",
    description: "European-built large language model offering multilingual capabilities with data processing options within EU jurisdictions.",
    category: "Financial",
    featured: false,
    industrySlugs: ["financial-services", "public-sector", "telecommunications"],
    scores: { "eu-ai-act": "A-", "gdpr": "A-", "dora": "B+", "eba-eiopa-guidelines": "B+" },
  },
  {
    slug: "sap-business-ai",
    vendor: "SAP",
    name: "SAP Business AI",
    type: "Enterprise AI Platform",
    risk: "Limited",
    description: "AI capabilities embedded across SAP S/4HANA, SuccessFactors, and Ariba for process automation, forecasting, and procurement intelligence.",
    category: "Financial",
    featured: false,
    industrySlugs: ["manufacturing", "financial-services", "energy-utilities"],
    scores: { "eu-ai-act": "A-", "gdpr": "A", "dora": "B+", "eba-eiopa-guidelines": "A-" },
  },
  {
    slug: "google-vertex-ai",
    vendor: "Google Cloud",
    name: "Vertex AI",
    type: "ML Platform",
    risk: "High",
    description: "Unified machine learning platform for building, deploying, and scaling AI models including Gemini foundation models for enterprise use.",
    category: "Healthcare",
    featured: false,
    industrySlugs: ["healthcare", "telecommunications", "manufacturing"],
    scores: { "eu-ai-act": "B", "gdpr": "B", "dora": "B", "eba-eiopa-guidelines": "B" },
  },
  {
    slug: "ibm-watsonx",
    vendor: "IBM",
    name: "watsonx",
    type: "Enterprise AI Platform",
    risk: "High",
    description: "AI and data platform with foundation models, governance tools, and deployment infrastructure designed for regulated industries.",
    category: "Financial",
    featured: false,
    industrySlugs: ["financial-services", "insurance", "healthcare", "public-sector"],
    scores: { "eu-ai-act": "A-", "gdpr": "A-", "dora": "A-", "eba-eiopa-guidelines": "A" },
  },
  {
    slug: "uipath-ai-center",
    vendor: "UiPath",
    name: "AI Center",
    type: "Process Automation AI",
    risk: "Limited",
    description: "Machine learning platform integrated with robotic process automation for intelligent document processing and workflow automation.",
    category: "Financial",
    featured: false,
    industrySlugs: ["financial-services", "insurance", "manufacturing"],
    scores: { "eu-ai-act": "B+", "gdpr": "B+", "dora": "B", "eba-eiopa-guidelines": "B+" },
  },
  {
    slug: "verint-da-vinci-ai",
    vendor: "Verint",
    name: "Da Vinci AI",
    type: "Customer Experience AI",
    risk: "Limited",
    description: "AI-powered analytics for customer engagement, workforce management, and experience automation in contact centres.",
    category: "Healthcare",
    featured: false,
    industrySlugs: ["telecommunications", "insurance", "financial-services"],
    scores: { "eu-ai-act": "B", "gdpr": "B", "dora": "B-", "eba-eiopa-guidelines": "B" },
  },
  {
    slug: "siemens-industrial-copilot",
    vendor: "Siemens",
    name: "Industrial Copilot",
    type: "Industrial AI",
    risk: "High",
    description: "Generative AI assistant for engineering and manufacturing, integrating with Siemens Xcelerator for product design and factory automation.",
    category: "Public Sector",
    featured: false,
    industrySlugs: ["manufacturing", "energy-utilities"],
    scores: { "eu-ai-act": "A-", "gdpr": "A", "dora": "B", "eba-eiopa-guidelines": "B" },
  },
  {
    slug: "philips-healthsuite-ai",
    vendor: "Philips",
    name: "HealthSuite AI",
    type: "Healthcare AI Platform",
    risk: "High",
    description: "Clinical AI solutions for radiology, pathology, and patient monitoring with CE-marked medical device certifications.",
    category: "Healthcare",
    featured: false,
    industrySlugs: ["healthcare"],
    scores: { "eu-ai-act": "A", "gdpr": "A", "dora": "B+", "mdr-ivdr": "A-" },
  },
  {
    slug: "hirevue-ai-hiring",
    vendor: "HireVue",
    name: "HireVue AI Hiring",
    type: "HR AI / Recruitment",
    risk: "High",
    description: "AI-driven video interviewing and candidate assessment platform used in enterprise recruitment processes.",
    category: "HR",
    featured: false,
    industrySlugs: ["human-resources"],
    scores: { "eu-ai-act": "C+", "gdpr": "B-", "dora": "C", "eba-eiopa-guidelines": "C" },
  },
  {
    slug: "personio-ai",
    vendor: "Personio",
    name: "Personio AI",
    type: "HR AI Assistant",
    risk: "Limited",
    description: "European-built HR platform with AI capabilities for people analytics, workflow automation, and employee self-service.",
    category: "HR",
    featured: false,
    industrySlugs: ["human-resources", "manufacturing"],
    scores: { "eu-ai-act": "B+", "gdpr": "A", "dora": "B", "eba-eiopa-guidelines": "B+" },
  },
];

// ─── Main Seed Function ──────────────────────────────────

async function main() {
  console.log("Seeding database...\n");

  // 1. Seed regulatory frameworks
  console.log("Regulatory Frameworks:");
  for (const fw of frameworks) {
    await prisma.regulatoryFramework.upsert({
      where: { slug: fw.slug },
      update: fw,
      create: fw,
    });
    console.log(`  ✓ ${fw.name}`);
  }

  // 2. Seed industries
  console.log("\nIndustries:");
  for (const ind of industries) {
    await prisma.industry.upsert({
      where: { slug: ind.slug },
      update: ind,
      create: ind,
    });
    console.log(`  ✓ ${ind.name}`);
  }

  // 3. Seed AI systems with industry relations and scores
  console.log("\nAI Systems:");
  for (const sys of systems) {
    const { industrySlugs, scores, ...systemData } = sys;

    // Create or update the system, connecting industries by slug
    const created = await prisma.aISystem.upsert({
      where: { slug: sys.slug },
      update: {
        ...systemData,
        industries: {
          set: industrySlugs.map((slug) => ({ slug })),
        },
      },
      create: {
        ...systemData,
        industries: {
          connect: industrySlugs.map((slug) => ({ slug })),
        },
      },
    });

    // Create assessment scores for each framework
    for (const [frameworkSlug, score] of Object.entries(scores)) {
      const framework = await prisma.regulatoryFramework.findUnique({
        where: { slug: frameworkSlug },
      });
      if (framework) {
        await prisma.assessmentScore.upsert({
          where: {
            systemId_frameworkId: {
              systemId: created.id,
              frameworkId: framework.id,
            },
          },
          update: { score },
          create: {
            score,
            systemId: created.id,
            frameworkId: framework.id,
          },
        });
      }
    }

    console.log(`  ✓ ${sys.vendor} ${sys.name} (${Object.keys(scores).length} scores)`);
  }

  // 4. Seed a few changelog entries for realism
  console.log("\nChangelog Entries:");
  const euAiAct = await prisma.regulatoryFramework.findUnique({ where: { slug: "eu-ai-act" } });
  const gdpr = await prisma.regulatoryFramework.findUnique({ where: { slug: "gdpr" } });

  if (euAiAct) {
    await prisma.changeLog.create({
      data: {
        date: new Date("2025-08-01"),
        title: "EU AI Act enters into force",
        description: "First provisions of the EU AI Act become applicable, including prohibitions on unacceptable-risk AI systems.",
        changeType: "amendment",
        sourceUrl: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
        sourceLabel: "EUR-Lex",
        author: "VendorScope",
        frameworkId: euAiAct.id,
      },
    }).catch(() => {/* skip if duplicate */});
    console.log("  ✓ EU AI Act enters into force");

    await prisma.changeLog.create({
      data: {
        date: new Date("2026-02-15"),
        title: "AI Office publishes first general-purpose AI code of practice",
        description: "The European AI Office released the initial code of practice for general-purpose AI model providers, covering transparency and copyright obligations.",
        changeType: "update",
        sourceUrl: "https://digital-strategy.ec.europa.eu/en/policies/ai-pact",
        sourceLabel: "EU AI Office",
        author: "VendorScope",
        frameworkId: euAiAct.id,
      },
    }).catch(() => {/* skip if duplicate */});
    console.log("  ✓ AI Office code of practice");
  }

  if (gdpr) {
    await prisma.changeLog.create({
      data: {
        date: new Date("2026-01-10"),
        title: "EDPB issues guidelines on AI and data protection",
        description: "The European Data Protection Board published guidelines on the interplay between the AI Act and GDPR, clarifying supervisory responsibilities.",
        changeType: "jurisprudence",
        sourceUrl: "https://edpb.europa.eu",
        sourceLabel: "EDPB",
        author: "VendorScope",
        frameworkId: gdpr.id,
      },
    }).catch(() => {/* skip if duplicate */});
    console.log("  ✓ EDPB AI/GDPR guidelines");
  }

  console.log("\nDone! Seeded everything.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
