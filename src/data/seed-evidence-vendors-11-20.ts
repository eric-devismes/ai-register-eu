/**
 * Evidence Backbone — Phase 2b: Vendors 11-20
 *
 * Same pattern as Phase 2a (seed-evidence-vendors-top10.ts). Adds:
 *   - Salesforce, SAP, ServiceNow, Workday, Snowflake (enterprise SaaS)
 *   - Aleph Alpha (sovereign EU AI), GitHub Copilot, xAI Grok,
 *     Notion, Atlassian Intelligence
 *
 * URLs were researched in this session (2026-04-14) — verified 200 OK
 * via curl with browser UA. SafeBase trust portals and SAP/ServiceNow's
 * Akamai-shielded marketing pages are routed via jina-reader. xAI is
 * Cloudflare-challenged and goes entirely through jina-reader.
 *
 * Run with: npm run seed:evidence-vendors-11-20
 * Idempotent.
 */

import { PrismaClient } from "../generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

type FetchStrategy = "direct" | "jina-reader";

type SeedSource = {
  url: string;
  label: string;
  tier: number;
  notes: string;
  fetchStrategy?: FetchStrategy;
};

type VendorSeed = {
  slug: string;
  vendor: string;
  sources: SeedSource[];
};

const VENDORS: VendorSeed[] = [
  {
    slug: "salesforce-agentforce-einstein",
    vendor: "Salesforce",
    sources: [
      { url: "https://trust.salesforce.com/", label: "Salesforce Trust Status & Security Portal", tier: 1, notes: "Primary trust portal — JS-rendered, needs reader", fetchStrategy: "jina-reader" },
      { url: "https://compliance.salesforce.com/en", label: "Salesforce Compliance Portal", tier: 1, notes: "SOC 2, ISO 27001/27017/27018, C5 — JS-rendered, needs reader", fetchStrategy: "jina-reader" },
      { url: "https://www.salesforce.com/company/legal/trust-and-compliance-documentation/", label: "Trust & Compliance Documentation", tier: 1, notes: "Per-cloud DPAs, infrastructure & sub-processor docs" },
      { url: "https://www.salesforce.com/content/dam/web/en_us/www/documents/legal/Agreements/data-processing-addendum.pdf", label: "Salesforce DPA (PDF)", tier: 1, notes: "Canonical GDPR Art. 28 DPA" },
      { url: "https://help.salesforce.com/s/articleView?id=001389399&type=1", label: "Einstein Generative AI Trust Layer", tier: 1, notes: "Zero-retention, no-training — help centre JS shell, needs reader", fetchStrategy: "jina-reader" },
      { url: "https://ai.salesforce.com/trust", label: "Trusted AI / Agentforce principles", tier: 2, notes: "Salesforce AI trust principles & Agentforce overview", fetchStrategy: "jina-reader" },
    ],
  },

  {
    slug: "sap-joule-enterprise",
    vendor: "SAP",
    sources: [
      { url: "https://www.sap.com/about/trust-center.html", label: "SAP Trust Center", tier: 1, notes: "Primary trust hub (Akamai-shielded — needs reader)", fetchStrategy: "jina-reader" },
      { url: "https://www.sap.com/about/trust-center/agreements.html", label: "SAP Cloud Agreements (DPA, sub-processors)", tier: 1, notes: "Hub for DPA, TOMs, sub-processor lists per cloud", fetchStrategy: "jina-reader" },
      { url: "https://www.sap.com/about/trust-center/agreements/cloud/cloud-services.html", label: "Cloud Services — DPA & Sub-processor Exhibits", tier: 1, notes: "Direct links to per-service DPA schedules", fetchStrategy: "jina-reader" },
      { url: "https://www.sap.com/about/trust-center/certifications.html", label: "SAP Certifications & Attestations", tier: 1, notes: "ISO 27001/27017/27018/27701, SOC 1/2, C5, TISAX index", fetchStrategy: "jina-reader" },
      { url: "https://www.sap.com/about/trust-center/data-protection.html", label: "SAP Data Protection & Privacy", tier: 1, notes: "GDPR posture, transfer mechanisms, EU residency", fetchStrategy: "jina-reader" },
      { url: "https://www.sap.com/products/artificial-intelligence/ai-ethics.html", label: "SAP AI Ethics & Responsible AI", tier: 2, notes: "AI ethics policy & governance incl. Joule", fetchStrategy: "jina-reader" },
    ],
  },

  {
    slug: "servicenow-now-assist",
    vendor: "ServiceNow",
    sources: [
      { url: "https://trust.servicenow.com/", label: "ServiceNow Trust Center (SafeBase)", tier: 1, notes: "SafeBase portal; compliance + sub-processor index", fetchStrategy: "jina-reader" },
      { url: "https://www.servicenow.com/trust.html", label: "ServiceNow Trust & Compliance", tier: 1, notes: "Akamai-shielded — needs reader", fetchStrategy: "jina-reader" },
      { url: "https://www.servicenow.com/trust/compliance.html", label: "Compliance & Certifications", tier: 1, notes: "ISO 27001/17/18, SOC 2, FedRAMP", fetchStrategy: "jina-reader" },
      { url: "https://www.servicenow.com/schedules.html", label: "ServiceNow Service Schedules & DPA", tier: 1, notes: "Canonical DPA + service descriptions", fetchStrategy: "jina-reader" },
      { url: "https://www.servicenow.com/company/trust/ai.html", label: "ServiceNow Trustworthy AI / Now Assist", tier: 1, notes: "Now Assist data-use, no-training commitments, LLM boundary", fetchStrategy: "jina-reader" },
      { url: "https://www.servicenow.com/trust/privacy.html", label: "Privacy & Data Protection", tier: 2, notes: "GDPR transfer mechanisms, privacy notice", fetchStrategy: "jina-reader" },
    ],
  },

  {
    slug: "workday-illuminate-ai",
    vendor: "Workday",
    sources: [
      { url: "https://trust.workday.com/", label: "Workday Trust Center (SafeBase)", tier: 1, notes: "Primary trust portal; certifications, reports, sub-processors", fetchStrategy: "jina-reader" },
      { url: "https://www.workday.com/en-us/privacy.html", label: "Workday Privacy Statement & DPA hub", tier: 1, notes: "Canonical privacy hub linking to DPA, sub-processors" },
      { url: "https://www.workday.com/en-us/artificial-intelligence/responsible-ai.html", label: "Workday Responsible AI / Illuminate", tier: 1, notes: "ML governance, Illuminate training-data policy" },
      { url: "https://www.workday.com/en-us/artificial-intelligence.html", label: "Workday AI / Illuminate overview", tier: 2, notes: "Product-level AI scope" },
    ],
  },

  {
    slug: "snowflake-cortex-ai",
    vendor: "Snowflake",
    sources: [
      { url: "https://trust.snowflake.com/", label: "Snowflake Trust Center (SafeBase)", tier: 1, notes: "Primary trust portal: SOC 2, ISO 27001/17/18/27701, HIPAA, FedRAMP", fetchStrategy: "jina-reader" },
      { url: "https://www.snowflake.com/legal/data-processing-addendum/", label: "Snowflake DPA (page)", tier: 1, notes: "Canonical DPA landing" },
      { url: "https://www.snowflake.com/legal-files/Snowflake-Customer-Data-Processing-Addendum.pdf", label: "Snowflake Customer DPA (PDF)", tier: 1, notes: "Signed PDF DPA text" },
      { url: "https://www.snowflake.com/legal/snowflake-sub-processors/", label: "Snowflake Sub-Processors & Affiliates", tier: 1, notes: "Authoritative sub-processor list" },
      { url: "https://www.snowflake.com/en/legal/privacy/privacy-policy/", label: "Snowflake Privacy Notice", tier: 1, notes: "Canonical privacy notice" },
      { url: "https://www.snowflake.com/en/legal/snowflake-ai-trust-and-safety/", label: "Snowflake AI Trust & Safety (Cortex)", tier: 1, notes: "Cortex training-data policy" },
      { url: "https://docs.snowflake.com/en/guides-overview-ai-features", label: "Snowflake Cortex AI docs", tier: 2, notes: "Region availability, residency" },
    ],
  },

  {
    slug: "aleph-alpha-luminous",
    vendor: "Aleph Alpha",
    sources: [
      { url: "https://aleph-alpha.com/en", label: "Aleph Alpha (EN homepage)", tier: 2, notes: "Sovereign-AI positioning" },
      { url: "https://docs.aleph-alpha.com", label: "Aleph Alpha Docs root", tier: 2, notes: "Pharia AI & Luminous docs" },
      { url: "https://docs.aleph-alpha.com/products/pharia-ai/", label: "Pharia AI Product Docs", tier: 1, notes: "Primary product reference" },
      { url: "https://docs.aleph-alpha.com/products/pharia-ai/compliance/", label: "Pharia AI Compliance", tier: 1, notes: "EU AI Act, GDPR, data handling" },
      { url: "https://aleph-alpha.com/datenschutz/", label: "Aleph Alpha Privacy (DE)", tier: 1, notes: "Canonical privacy notice (German)" },
      { url: "https://aleph-alpha.com/imprint/", label: "Impressum", tier: 2, notes: "Legal entity / controller identification" },
    ],
  },

  {
    slug: "github-copilot-enterprise",
    vendor: "GitHub",
    sources: [
      { url: "https://github.com/trust-center", label: "GitHub Trust Center", tier: 1, notes: "Primary trust portal" },
      { url: "https://resources.github.com/copilot-trust-center/", label: "GitHub Copilot Trust Center", tier: 1, notes: "Copilot-specific trust, privacy, IP commitments" },
      { url: "https://docs.github.com/en/site-policy/privacy-policies/github-data-protection-agreement", label: "GitHub Data Protection Agreement", tier: 1, notes: "Public DPA (GDPR Art. 28)" },
      { url: "https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement", label: "GitHub General Privacy Statement", tier: 1, notes: "Enterprise privacy baseline" },
      { url: "https://docs.github.com/en/copilot/responsible-use-of-github-copilot-features", label: "Copilot Responsible Use Docs", tier: 1, notes: "Training-data-use & data-boundary claims" },
      { url: "https://docs.github.com/en/copilot/get-started/plans-for-github-copilot", label: "Copilot Plans (incl. Enterprise)", tier: 2, notes: "Feature/plan matrix" },
    ],
  },

  {
    slug: "xai-grok-enterprise",
    vendor: "xAI",
    sources: [
      { url: "https://x.ai/legal", label: "xAI Legal Index", tier: 1, notes: "Cloudflare-challenged — needs reader", fetchStrategy: "jina-reader" },
      { url: "https://x.ai/legal/privacy-policy", label: "xAI Privacy Policy", tier: 1, notes: "Consumer/API privacy policy", fetchStrategy: "jina-reader" },
      { url: "https://x.ai/legal/enterprise-privacy-policy", label: "xAI Enterprise Privacy Policy", tier: 1, notes: "Enterprise data-handling commitments (training opt-out)", fetchStrategy: "jina-reader" },
      { url: "https://x.ai/legal/dpa", label: "xAI DPA", tier: 1, notes: "GDPR Art. 28 DPA", fetchStrategy: "jina-reader" },
      { url: "https://x.ai/legal/subprocessors", label: "xAI Subprocessor List", tier: 1, notes: "Chain-of-custody disclosure", fetchStrategy: "jina-reader" },
    ],
  },

  {
    slug: "notion-ai",
    vendor: "Notion",
    sources: [
      { url: "https://www.notion.com/security", label: "Notion Security Overview", tier: 1, notes: "Primary security page (SOC 2, ISO 27001, GDPR links)" },
      { url: "https://www.notion.so/help/security-and-privacy", label: "Notion Security & Privacy Help", tier: 1, notes: "Help-center security article" },
      { url: "https://www.notion.com/trust/privacy-policy", label: "Notion Privacy Policy", tier: 1, notes: "Canonical privacy policy" },
      { url: "https://www.notion.com/help/notion-ai-security-practices", label: "Notion AI Security Practices", tier: 1, notes: "Notion AI-specific training-data & sub-model disclosure" },
      { url: "https://www.notion.com/help/notion-ai-faqs", label: "Notion AI FAQs", tier: 2, notes: "Customer-facing data-handling FAQ" },
      { url: "https://www.notion.com/help/data-residency", label: "Notion Data Residency", tier: 2, notes: "EU data residency (Enterprise)" },
      { url: "https://www.notion.com/product/ai", label: "Notion AI Product", tier: 2, notes: "Enterprise feature claims" },
    ],
  },

  {
    slug: "atlassian-intelligence",
    vendor: "Atlassian",
    sources: [
      { url: "https://www.atlassian.com/trust", label: "Atlassian Trust Center", tier: 1, notes: "Primary trust portal" },
      { url: "https://www.atlassian.com/trust/compliance", label: "Atlassian Compliance", tier: 1, notes: "SOC 2, ISO 27001/27018, ISO 42001 index" },
      { url: "https://www.atlassian.com/trust/privacy", label: "Atlassian Privacy", tier: 1, notes: "Enterprise privacy program overview" },
      { url: "https://www.atlassian.com/legal/data-processing-addendum", label: "Atlassian DPA", tier: 1, notes: "GDPR Art. 28 DPA" },
      { url: "https://www.atlassian.com/legal/sub-processors", label: "Atlassian Sub-processors", tier: 1, notes: "Sub-processor list" },
      { url: "https://www.atlassian.com/trust/atlassian-intelligence", label: "Atlassian Intelligence Trust", tier: 1, notes: "AI-specific trust page (models, training-data)" },
      { url: "https://support.atlassian.com/security-and-access-policies/docs/understand-data-residency/", label: "Atlassian Data Residency Docs", tier: 2, notes: "EU data residency configuration guide" },
      { url: "https://www.atlassian.com/trust/privacy/gdpr", label: "Atlassian GDPR Commitments", tier: 2, notes: "GDPR-specific commitments" },
    ],
  },
];

async function main() {
  console.log("🔎 Evidence backbone — Phase 2b: vendors 11-20");
  console.log(`   ${VENDORS.length} vendors, ${VENDORS.reduce((a, v) => a + v.sources.length, 0)} sources total\n`);

  let totalSourcesCreated = 0;
  let totalSourcesUpdated = 0;
  const missing: string[] = [];

  for (const v of VENDORS) {
    const system = await prisma.aISystem.findUnique({
      where: { slug: v.slug },
      select: { id: true, vendor: true, name: true },
    });
    if (!system) {
      console.warn(`   ⚠ ${v.slug}: AISystem row not found — skipping`);
      missing.push(v.slug);
      continue;
    }

    let created = 0;
    let updated = 0;
    for (const s of v.sources) {
      const existing = await prisma.source.findUnique({
        where: { systemId_url: { systemId: system.id, url: s.url } },
        select: { id: true },
      });
      await prisma.source.upsert({
        where: { systemId_url: { systemId: system.id, url: s.url } },
        create: {
          systemId: system.id,
          url: s.url,
          label: s.label,
          tier: s.tier,
          notes: s.notes,
          fetchStrategy: s.fetchStrategy ?? "direct",
        },
        update: {
          label: s.label,
          tier: s.tier,
          notes: s.notes,
          fetchStrategy: s.fetchStrategy ?? "direct",
        },
      });
      if (existing) updated++;
      else created++;
    }
    totalSourcesCreated += created;
    totalSourcesUpdated += updated;
    console.log(
      `   ✓ ${v.vendor.padEnd(22)} ${system.name.padEnd(38)} sources +${created} ~${updated}`,
    );
  }

  console.log(`\n📊 Summary`);
  console.log(`   Sources created:    ${totalSourcesCreated}`);
  console.log(`   Sources updated:    ${totalSourcesUpdated}`);
  if (missing.length > 0) {
    console.log(`   ⚠ Missing systems:  ${missing.join(", ")}`);
  }
  console.log(`\n✅ Seed complete. Run \`npm run evidence:fetch\` to snapshot + extract.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
