/**
 * Seed: Vendor Maturity & Capability data for all AI systems.
 *
 * Populates: deploymentModel, sourceModel, foundedYear, employeeCount,
 * fundingStatus, marketPresence, customerCount, notableCustomers, customerStories.
 *
 * Run: npx tsx src/data/seed-vendor-maturity.ts
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

interface VendorData {
  slug: string;
  deploymentModel: string;
  sourceModel: string;
  foundedYear: number | null;
  employeeCount: string;
  fundingStatus: string;
  marketPresence: string;
  customerCount: string;
  notableCustomers: string;
  customerStories: string;
}

const vendorData: VendorData[] = [
  // ─── Major Cloud Platforms ─────────────────────────
  {
    slug: "microsoft-azure-openai-service",
    deploymentModel: "cloud-only",
    sourceModel: "closed-source",
    foundedYear: 1975,
    employeeCount: "220,000+",
    fundingStatus: "Public (MSFT, $3T+ market cap)",
    marketPresence: "Leader",
    customerCount: "100,000+",
    notableCustomers: "Mercedes-Benz, Siemens, Shell, Vodafone, ING, Deutsche Post",
    customerStories: "Mercedes-Benz uses Azure OpenAI for in-car voice AI. Siemens integrated Copilot across 300K employees for productivity. ING Bank deployed Azure AI for fraud detection across EU operations.",
  },
  {
    slug: "google-gemini-vertex-ai",
    deploymentModel: "cloud-only",
    sourceModel: "partial-open",
    foundedYear: 1998,
    employeeCount: "180,000+",
    fundingStatus: "Public (GOOGL, $2T+ market cap)",
    marketPresence: "Leader",
    customerCount: "50,000+",
    notableCustomers: "Carrefour, Deutsche Bank, Airbus, Renault, Vodafone",
    customerStories: "Carrefour uses Vertex AI for product recommendations across 12,000 EU stores. Deutsche Bank deployed Gemini for document processing in compliance workflows. Airbus uses Vertex for predictive maintenance.",
  },
  {
    slug: "openai-chatgpt-enterprise",
    deploymentModel: "cloud-only",
    sourceModel: "closed-source",
    foundedYear: 2015,
    employeeCount: "3,000+",
    fundingStatus: "Private (VC-backed, $157B valuation)",
    marketPresence: "Leader",
    customerCount: "200M+ users, 2M+ business accounts",
    notableCustomers: "Morgan Stanley, Klarna, Stripe, Bain & Company, Iceland (government)",
    customerStories: "Morgan Stanley uses GPT-4 for wealth management research. Klarna replaced 700 customer service agents with ChatGPT. Iceland government uses GPT-4 for Icelandic language preservation.",
  },
  {
    slug: "anthropic-claude-enterprise",
    deploymentModel: "cloud-only",
    sourceModel: "closed-source",
    foundedYear: 2021,
    employeeCount: "1,500+",
    fundingStatus: "Private (VC-backed, $60B valuation)",
    marketPresence: "Challenger",
    customerCount: "100,000+ businesses",
    notableCustomers: "Airtable, Notion, DuckDuckGo, GitLab, Lonely Planet",
    customerStories: "GitLab integrated Claude for code review and security scanning. Notion uses Claude for AI writing assistant. Airtable deployed Claude for enterprise workflow automation.",
  },
  {
    slug: "mistral-ai",
    deploymentModel: "hybrid",
    sourceModel: "open-weights",
    foundedYear: 2023,
    employeeCount: "600+",
    fundingStatus: "Private (VC-backed, \u20ac6B valuation)",
    marketPresence: "Challenger",
    customerCount: "5,000+",
    notableCustomers: "BNP Paribas, Orange, Brave, Doctolib, French government",
    customerStories: "BNP Paribas uses Mistral for internal document analysis with full EU data residency. French government adopted Mistral for sovereign AI initiatives. Orange deployed for customer service automation.",
  },
  // ─── Enterprise AI Platforms ───────────────────────
  {
    slug: "salesforce-agentforce-einstein",
    deploymentModel: "cloud-only",
    sourceModel: "closed-source",
    foundedYear: 1999,
    employeeCount: "70,000+",
    fundingStatus: "Public (CRM, $250B+ market cap)",
    marketPresence: "Leader",
    customerCount: "150,000+",
    notableCustomers: "Adidas, Philips, L'Or\u00e9al, Schneider Electric, T-Mobile",
    customerStories: "Adidas uses Agentforce for personalized customer engagement across 50 markets. Philips deployed Einstein for healthcare equipment service optimization. L'Or\u00e9al uses AI for beauty recommendation engines.",
  },
  {
    slug: "palantir-aip",
    deploymentModel: "hybrid",
    sourceModel: "closed-source",
    foundedYear: 2003,
    employeeCount: "3,800+",
    fundingStatus: "Public (PLTR, $250B+ market cap)",
    marketPresence: "Niche",
    customerCount: "500+",
    notableCustomers: "Airbus, NHS England, BP, Ferrari, Jacobs Engineering",
    customerStories: "Airbus uses AIP for A350 production optimization. NHS England deployed Palantir for pandemic response and hospital operations. BP uses AIP for energy trading and supply chain decisions.",
  },
  {
    slug: "workday-ai-talent",
    deploymentModel: "cloud-only",
    sourceModel: "closed-source",
    foundedYear: 2005,
    employeeCount: "18,000+",
    fundingStatus: "Public (WDAY, $65B+ market cap)",
    marketPresence: "Leader",
    customerCount: "10,000+",
    notableCustomers: "Siemens, Rolls-Royce, Sanofi, Netflix, Unilever",
    customerStories: "Siemens uses Workday AI for workforce planning across 300K employees. Rolls-Royce deployed AI skills intelligence for talent management. Sanofi uses AI for global HR operations.",
  },
  {
    slug: "fico-platform",
    deploymentModel: "hybrid",
    sourceModel: "closed-source",
    foundedYear: 1956,
    employeeCount: "13,000+",
    fundingStatus: "Public (FICO, $50B+ market cap)",
    marketPresence: "Leader",
    customerCount: "25,000+",
    notableCustomers: "HSBC, Barclays, ING, Santander, BNP Paribas",
    customerStories: "HSBC uses FICO for real-time fraud detection processing billions of transactions. Barclays deployed FICO for credit decisioning across EU markets. ING uses FICO for regulatory compliance scoring.",
  },
  {
    slug: "servicenow-now-assist",
    deploymentModel: "cloud-only",
    sourceModel: "closed-source",
    foundedYear: 2004,
    employeeCount: "22,000+",
    fundingStatus: "Public (NOW, $180B+ market cap)",
    marketPresence: "Leader",
    customerCount: "8,000+",
    notableCustomers: "Siemens, Vodafone, NHS, Deloitte, Deutsche Telekom",
    customerStories: "Vodafone uses Now Assist for IT service automation across 25 countries. Siemens deployed for enterprise-wide workflow intelligence. NHS uses ServiceNow for healthcare service management.",
  },
  {
    slug: "ibm-watsonx",
    deploymentModel: "hybrid",
    sourceModel: "partial-open",
    foundedYear: 1911,
    employeeCount: "280,000+",
    fundingStatus: "Public (IBM, $200B+ market cap)",
    marketPresence: "Challenger",
    customerCount: "40,000+",
    notableCustomers: "Lufthansa, Samsung, Bouygues Telecom, NatWest, Crédit Mutuel",
    customerStories: "Lufthansa uses watsonx for customer service automation in 7 languages. NatWest deployed watsonx.governance for AI model risk management. Cr\u00e9dit Mutuel uses IBM AI for 5,000+ banking advisors.",
  },
  {
    slug: "sap-joule",
    deploymentModel: "cloud-only",
    sourceModel: "closed-source",
    foundedYear: 1972,
    employeeCount: "105,000+",
    fundingStatus: "Public (SAP, $300B+ market cap)",
    marketPresence: "Leader",
    customerCount: "300,000+",
    notableCustomers: "BMW, Bosch, Nestl\u00e9, Siemens, Unilever",
    customerStories: "BMW uses SAP Joule for supply chain optimization across 30 plants. Bosch deployed for intelligent procurement across 400K suppliers. Nestl\u00e9 uses SAP AI for demand forecasting in 190 markets.",
  },
  {
    slug: "uipath-maestro",
    deploymentModel: "hybrid",
    sourceModel: "partial-open",
    foundedYear: 2005,
    employeeCount: "4,000+",
    fundingStatus: "Public (PATH, $12B+ market cap)",
    marketPresence: "Leader",
    customerCount: "10,000+",
    notableCustomers: "Deutsche Post DHL, CaixaBank, Uber, Generali, NHS",
    customerStories: "Deutsche Post DHL uses UiPath for invoice processing automation across Europe. CaixaBank deployed for KYC/AML compliance automation. Generali uses AI Center for claims processing.",
  },
  {
    slug: "verint-ai",
    deploymentModel: "hybrid",
    sourceModel: "closed-source",
    foundedYear: 2002,
    employeeCount: "4,000+",
    fundingStatus: "Public (VRNT, $3B+ market cap)",
    marketPresence: "Niche",
    customerCount: "10,000+",
    notableCustomers: "Vodafone, T-Mobile, Barclays, BT, KPN",
    customerStories: "Vodafone uses Da Vinci AI for customer engagement analytics across EU operations. T-Mobile deployed for contact centre workforce optimization. Barclays uses Verint for compliance monitoring.",
  },
  {
    slug: "deepmind-gemini-ultra",
    deploymentModel: "cloud-only",
    sourceModel: "closed-source",
    foundedYear: 2010,
    employeeCount: "180,000+",
    fundingStatus: "Public (GOOGL, $2T+ market cap)",
    marketPresence: "Leader",
    customerCount: "50,000+",
    notableCustomers: "Deutsche Bank, Carrefour, Vodafone, Renault, Airbus",
    customerStories: "Deutsche Bank uses Gemini for compliance document analysis. Carrefour deployed for personalized shopping across EU stores. Vodafone uses for customer service AI across 15 European markets.",
  },
  {
    slug: "github-copilot-enterprise",
    deploymentModel: "cloud-only",
    sourceModel: "partial-open",
    foundedYear: 2008,
    employeeCount: "220,000+",
    fundingStatus: "Public (MSFT via GitHub)",
    marketPresence: "Leader",
    customerCount: "77,000+ organizations",
    notableCustomers: "Accenture, Shopify, Duolingo, Daimler, Mercedes-Benz",
    customerStories: "Accenture deployed Copilot for 50K developers reducing code review time by 30%. Daimler uses for automotive software development. Duolingo accelerated feature development cycle by 25%.",
  },
  {
    slug: "hirevue-ai",
    deploymentModel: "cloud-only",
    sourceModel: "closed-source",
    foundedYear: 2004,
    employeeCount: "600+",
    fundingStatus: "Private (PE-backed by The Carlyle Group)",
    marketPresence: "Niche",
    customerCount: "800+",
    notableCustomers: "Unilever, Vodafone, Hilton, Goldman Sachs, Deloitte",
    customerStories: "Unilever uses HireVue for graduate recruitment screening across 190 countries. Vodafone deployed for high-volume hiring across EU markets. Deloitte uses for campus recruitment assessment.",
  },
  {
    slug: "notion-ai",
    deploymentModel: "cloud-only",
    sourceModel: "closed-source",
    foundedYear: 2013,
    employeeCount: "800+",
    fundingStatus: "Private (VC-backed, $10B valuation)",
    marketPresence: "Challenger",
    customerCount: "100,000+ teams",
    notableCustomers: "Figma, Loom, Headspace, Toyota, Match Group",
    customerStories: "Figma uses Notion AI for design team documentation and knowledge management. Toyota deployed for engineering project coordination. Headspace uses for content planning and AI-assisted writing.",
  },
  // ─── Conversational AI / Virtual Agents ────────────
  {
    slug: "moveworks-copilot",
    deploymentModel: "cloud-only",
    sourceModel: "closed-source",
    foundedYear: 2016,
    employeeCount: "500+",
    fundingStatus: "Private (VC-backed, $2.1B valuation)",
    marketPresence: "Challenger",
    customerCount: "500+",
    notableCustomers: "Broadcom, DocuSign, Hearst, Palo Alto Networks, Nutanix",
    customerStories: "Broadcom uses Moveworks for IT support automation resolving 60% of tickets autonomously. DocuSign deployed for employee self-service across HR and IT. Palo Alto Networks uses for internal knowledge management.",
  },
  {
    slug: "aisera-ai-service-experience",
    deploymentModel: "cloud-only",
    sourceModel: "closed-source",
    foundedYear: 2017,
    employeeCount: "300+",
    fundingStatus: "Private (VC-backed, $1.2B valuation)",
    marketPresence: "Emerging",
    customerCount: "200+",
    notableCustomers: "McAfee, Chegg, Zoom, Dave, Dartmouth College",
    customerStories: "McAfee uses Aisera for automated IT support across global operations. Zoom deployed for internal employee helpdesk automation. Dartmouth College uses for student and staff service management.",
  },
  {
    slug: "kore-ai-xo-platform",
    deploymentModel: "hybrid",
    sourceModel: "closed-source",
    foundedYear: 2013,
    employeeCount: "1,000+",
    fundingStatus: "Private (VC-backed, $500M+ raised)",
    marketPresence: "Challenger",
    customerCount: "500+",
    notableCustomers: "ING, HDFC Bank, Fidelity, Shell, Emirates NBD",
    customerStories: "ING uses Kore.ai for customer-facing banking virtual assistants in EU. Shell deployed for IT helpdesk automation across 70+ countries. Emirates NBD uses for multilingual banking chatbot.",
  },
  {
    slug: "n8n-workflow-automation",
    deploymentModel: "hybrid",
    sourceModel: "open-source",
    foundedYear: 2019,
    employeeCount: "200+",
    fundingStatus: "Private (VC-backed, $100M+ raised)",
    marketPresence: "Emerging",
    customerCount: "50,000+ self-hosted instances",
    notableCustomers: "Delivery Hero, Spendesk, Trade Republic, numerous EU SMEs",
    customerStories: "Delivery Hero uses n8n for automated data pipelines across EU operations. Trade Republic deployed for compliance workflow automation. Widely adopted by EU startups for GDPR-compliant AI automation.",
  },
  {
    slug: "cognigy-ai",
    deploymentModel: "hybrid",
    sourceModel: "closed-source",
    foundedYear: 2016,
    employeeCount: "300+",
    fundingStatus: "Private (VC-backed, \u20ac100M+ raised)",
    marketPresence: "Challenger",
    customerCount: "1,000+",
    notableCustomers: "Lufthansa, Bosch, Henkel, Daimler Truck, E.ON",
    customerStories: "Lufthansa uses Cognigy for multilingual customer service across 7 languages. Bosch deployed for 24/7 technical support automation. E.ON uses for energy customer self-service portal.",
  },
  {
    slug: "espressive-barista",
    deploymentModel: "cloud-only",
    sourceModel: "closed-source",
    foundedYear: 2016,
    employeeCount: "100+",
    fundingStatus: "Private (VC-backed, $80M+ raised)",
    marketPresence: "Niche",
    customerCount: "100+",
    notableCustomers: "Tufts Medicine, KeyBank, SAIC, CoreSite",
    customerStories: "Tufts Medicine uses Barista for employee IT support across hospital network. KeyBank deployed for financial services employee self-service. SAIC uses for defense contractor internal support.",
  },
  {
    slug: "boost-ai",
    deploymentModel: "hybrid",
    sourceModel: "closed-source",
    foundedYear: 2016,
    employeeCount: "150+",
    fundingStatus: "Private (VC-backed, $50M+ raised)",
    marketPresence: "Niche",
    customerCount: "500+",
    notableCustomers: "DNB, Nordea, Telenor, Tryg, Norwegian Labour and Welfare",
    customerStories: "DNB Bank uses Boost.ai for customer service handling 5M+ conversations/year. Nordea deployed for Nordic banking chatbot across 4 countries. Telenor uses for telecom customer support automation.",
  },
  {
    slug: "druid-ai",
    deploymentModel: "hybrid",
    sourceModel: "closed-source",
    foundedYear: 2018,
    employeeCount: "200+",
    fundingStatus: "Private (VC-backed, $50M+ raised)",
    marketPresence: "Emerging",
    customerCount: "300+",
    notableCustomers: "Banca Transilvania, Orange Romania, Carrefour Romania, OMV Petrom",
    customerStories: "Banca Transilvania uses DRUID for AI banking assistant handling loan applications. Orange Romania deployed for customer service automation. OMV Petrom uses for internal HR process automation.",
  },
  {
    slug: "resolve-rita",
    deploymentModel: "hybrid",
    sourceModel: "closed-source",
    foundedYear: 2014,
    employeeCount: "200+",
    fundingStatus: "Private (VC-backed, $60M+ raised)",
    marketPresence: "Niche",
    customerCount: "300+",
    notableCustomers: "BMC, Fujitsu, DXC Technology, Atos",
    customerStories: "BMC uses Resolve RITA for automated IT incident remediation. Fujitsu deployed for autonomous infrastructure management. DXC Technology uses for managed services automation.",
  },
  {
    slug: "yellow-ai",
    deploymentModel: "cloud-only",
    sourceModel: "closed-source",
    foundedYear: 2016,
    employeeCount: "1,000+",
    fundingStatus: "Private (VC-backed, $200M+ raised)",
    marketPresence: "Challenger",
    customerCount: "1,100+",
    notableCustomers: "Randstad, Sephora, Hyundai, Sony, Domino\u2019s",
    customerStories: "Randstad uses Yellow.ai for recruitment chatbot across EU markets. Sephora deployed for multilingual beauty advisor in 15+ languages. Hyundai uses for automotive customer service in EMEA.",
  },
];

async function main() {
  console.log("Seeding vendor maturity data for all AI systems...\n");

  let updated = 0;
  let skipped = 0;

  for (const v of vendorData) {
    const exists = await prisma.aISystem.findUnique({ where: { slug: v.slug } });
    if (!exists) {
      console.log(`  ⚠ ${v.slug} not found, skipping`);
      skipped++;
      continue;
    }

    await prisma.aISystem.update({
      where: { slug: v.slug },
      data: {
        deploymentModel: v.deploymentModel,
        sourceModel: v.sourceModel,
        foundedYear: v.foundedYear,
        employeeCount: v.employeeCount,
        fundingStatus: v.fundingStatus,
        marketPresence: v.marketPresence,
        customerCount: v.customerCount,
        notableCustomers: v.notableCustomers,
        customerStories: v.customerStories,
      },
    });

    console.log(`  ✓ ${v.slug}`);
    updated++;
  }

  console.log(`\n✅ Done — ${updated} updated, ${skipped} skipped.`);
}

main()
  .catch((e) => { console.error("Seed failed:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
