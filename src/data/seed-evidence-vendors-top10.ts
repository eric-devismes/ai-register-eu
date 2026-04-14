/**
 * Evidence Backbone — Phase 2a: Top-10 Vendor Backfill
 *
 * Replicates the OpenAI pilot pattern across the next nine highest-priority
 * vendors for EU enterprise buyers. Each vendor gets a Source registry
 * (trust portal, DPA, sub-processors, privacy, residency). The fetcher
 * picks them up on the next run, hashes + snapshots, and the LLM extractor
 * proposes draft claims that the analyst reviews in /admin/evidence.
 *
 * No claims are pre-seeded here on purpose: the whole point of Phase 1b
 * was to let the extractor surface claims from the live source text, not
 * from human-typed memory. The OpenAI pilot keeps its hand-typed claims
 * as a sanity baseline; everyone else flows through the queue.
 *
 * URLs were researched in this session (2026-04-14) — verified 200 OK
 * via curl with browser UA. Two SafeBase-backed portals
 * (trustcenter.cohere.com, security.databricks.com) need jina-reader
 * because they're JS-shell apps; everything else fetches direct.
 *
 * Run with: npm run seed:evidence-vendors-top10
 * (alias for: npx tsx --env-file=.env.local src/data/seed-evidence-vendors-top10.ts)
 *
 * Idempotent: upserts on (systemId, url).
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
  slug: string;          // AISystem.slug
  vendor: string;        // for log readability only
  sources: SeedSource[];
};

const VENDORS: VendorSeed[] = [
  {
    slug: "anthropic-claude-api",
    vendor: "Anthropic",
    sources: [
      { url: "https://trust.anthropic.com", label: "Anthropic Trust Center", tier: 1, notes: "Primary trust portal: SOC 2, ISO 27001/42001, security posture" },
      { url: "https://trust.anthropic.com/subprocessors", label: "Anthropic Subprocessors List", tier: 1, notes: "Chain-of-custody / GDPR Art. 28 sub-processor disclosure" },
      { url: "https://support.anthropic.com/en/articles/7996862-i-am-a-commercial-customer-how-do-i-view-your-data-processing-addendum-dpa", label: "Anthropic DPA Access Article", tier: 1, notes: "Canonical DPA access point for commercial customers" },
      { url: "https://www.anthropic.com/legal/commercial-terms", label: "Anthropic Commercial Terms of Service", tier: 1, notes: "DPA with SCCs incorporated by reference; training-data use terms" },
      { url: "https://www.anthropic.com/legal/privacy", label: "Anthropic Privacy Policy", tier: 1, notes: "Personal-data handling, retention, training-data policy" },
      { url: "https://support.anthropic.com/en/articles/7996881-what-is-your-approach-to-gdpr-or-related-issues", label: "Anthropic GDPR Approach", tier: 2, notes: "GDPR posture statement" },
    ],
  },

  {
    slug: "microsoft-azure-openai-service",
    vendor: "Microsoft",
    sources: [
      { url: "https://servicetrust.microsoft.com/", label: "Microsoft Service Trust Portal", tier: 1, notes: "Primary trust portal: SOC 2, ISO 27001/27018/27701/42001, audit reports" },
      { url: "https://servicetrust.microsoft.com/ViewPage/TrustDocuments", label: "Service Trust Documents (DPA, audits)", tier: 1, notes: "Microsoft Products & Services DPA and compliance artefacts" },
      { url: "https://learn.microsoft.com/en-us/legal/cognitive-services/openai/data-privacy", label: "Azure OpenAI Data, Privacy & Security", tier: 1, notes: "Authoritative training-data-use stance + retention for Azure OpenAI" },
      { url: "https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/abuse-monitoring", label: "Azure OpenAI Abuse Monitoring", tier: 1, notes: "Human-review/opt-out policy relevant to GDPR and confidentiality" },
      { url: "https://learn.microsoft.com/en-us/azure/ai-foundry/openai/how-to/deployment-types", label: "Azure OpenAI Deployment Types (Data Zone EU)", tier: 2, notes: "EU Data Zone / regional deployment residency reference" },
      { url: "https://azure.microsoft.com/en-us/explore/global-infrastructure/data-residency", label: "Azure Data Residency", tier: 2, notes: "EU Data Boundary context" },
      { url: "https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-privacy", label: "Microsoft 365 Copilot Privacy", tier: 1, notes: "Copilot data flows, tenant boundary, training-data stance" },
    ],
  },

  {
    slug: "google-gemini-vertex-ai",
    vendor: "Google Cloud",
    sources: [
      { url: "https://cloud.google.com/security/compliance/offerings", label: "Google Cloud Compliance Offerings", tier: 1, notes: "Primary compliance catalog: SOC 2/3, ISO 27001/27017/27018/27701/42001" },
      { url: "https://cloud.google.com/terms/data-processing-addendum", label: "Google Cloud DPA", tier: 1, notes: "GDPR Art. 28 Data Processing Addendum" },
      { url: "https://cloud.google.com/terms/subprocessors", label: "Google Cloud Subprocessors", tier: 1, notes: "Chain-of-custody sub-processor disclosure" },
      { url: "https://cloud.google.com/vertex-ai/generative-ai/docs/data-governance", label: "Vertex AI Generative AI Data Governance", tier: 1, notes: "Training-data-use policy and customer data handling" },
      { url: "https://cloud.google.com/vertex-ai/generative-ai/docs/learn/data-residency", label: "Vertex AI Generative AI Data Residency", tier: 2, notes: "EU regions, ML processing location guarantees" },
      { url: "https://cloud.google.com/vertex-ai/generative-ai/docs/vertex-ai-zero-data-retention", label: "Vertex AI Zero Data Retention", tier: 2, notes: "ZDR commitment for eligible models" },
      { url: "https://cloud.google.com/gemini/docs/discover/data-governance", label: "Gemini for Google Cloud Data Governance", tier: 1, notes: "Gemini enterprise data handling" },
    ],
  },

  {
    slug: "amazon-bedrock-aws",
    vendor: "Amazon Web Services",
    sources: [
      { url: "https://aws.amazon.com/compliance/programs/", label: "AWS Compliance Programs", tier: 1, notes: "SOC 1/2/3, ISO 27001/27017/27018/42001, PCI, HIPAA catalog" },
      { url: "https://aws.amazon.com/agreement/", label: "AWS Customer Agreement (incl. GDPR DPA)", tier: 1, notes: "GDPR DPA incorporated into AWS Service Terms §23" },
      { url: "https://aws.amazon.com/compliance/sub-processors/", label: "AWS Sub-processors", tier: 1, notes: "GDPR Art. 28 sub-processor list" },
      { url: "https://aws.amazon.com/bedrock/security-compliance/", label: "Amazon Bedrock Security & Compliance", tier: 1, notes: "Bedrock-specific compliance scope, training-data stance" },
      { url: "https://docs.aws.amazon.com/bedrock/latest/userguide/data-protection.html", label: "Bedrock Data Protection", tier: 1, notes: "Encryption, isolation, no-training commitment" },
      { url: "https://aws.amazon.com/compliance/eu-data-protection/", label: "AWS EU Data Protection", tier: 2, notes: "EU Sovereign Cloud / data residency posture" },
      { url: "https://aws.amazon.com/compliance/gdpr-center/", label: "AWS GDPR Center", tier: 2, notes: "GDPR program overview" },
    ],
  },

  {
    slug: "meta-llama-enterprise",
    vendor: "Meta",
    sources: [
      { url: "https://llama.developer.meta.com/docs/trust/data-commitments", label: "Llama API Data Commitments", tier: 1, notes: "Closest equivalent to a trust portal for Llama API: data handling & training-data commitments" },
      { url: "https://www.llama.com/llama-protections/", label: "Llama Protections (Purple Llama, Guard)", tier: 1, notes: "Safety/guardrail framework for enterprise deployments" },
      { url: "https://www.llama.com/use-policy/", label: "Llama Acceptable Use Policy", tier: 1, notes: "Use restrictions affecting enterprise compliance posture" },
      { url: "https://ai.meta.com/llama/license/", label: "Llama Community License", tier: 1, notes: "Licensing terms for self-hosted enterprise deployments" },
      { url: "https://about.meta.com/privacy/", label: "Meta Privacy", tier: 2, notes: "Meta corporate privacy framework (background context)" },
      { url: "https://llama.meta.com/responsible-use-guide/", label: "Llama Responsible Use Guide", tier: 2, notes: "Responsible deployment guidance" },
    ],
  },

  {
    slug: "mistral-ai",
    vendor: "Mistral AI",
    sources: [
      { url: "https://trust.mistral.ai/", label: "Mistral AI Trust Center", tier: 1, notes: "Primary trust portal (SOC 2, ISO 27001, GDPR posture)" },
      { url: "https://mistral.ai/terms", label: "Mistral AI Legal Terms Index", tier: 1, notes: "Hub for ToS, Privacy Policy, and DPA (anchor-linked)" },
      { url: "https://docs.mistral.ai/", label: "Mistral Platform Docs", tier: 2, notes: "La Plateforme deployment + EU residency references" },
      { url: "https://mistral.ai/news/le-chat-enterprise", label: "Le Chat Enterprise Announcement", tier: 2, notes: "EU sovereignty + self-hosted deployment claims" },
    ],
  },

  {
    slug: "cohere-enterprise",
    vendor: "Cohere",
    sources: [
      { url: "https://trustcenter.cohere.com/", label: "Cohere Trust Center", tier: 1, notes: "SafeBase portal: SOC 2 / ISO 27001 / HIPAA artefacts (JS-shell, needs reader)", fetchStrategy: "jina-reader" },
      { url: "https://cohere.com/security", label: "Cohere Security Overview", tier: 1, notes: "Public security posture summary" },
      { url: "https://cohere.com/privacy", label: "Cohere Privacy Policy", tier: 1, notes: "Data handling + training-data use statements" },
      { url: "https://cohere.com/saas-agreement", label: "Cohere SaaS Agreement", tier: 1, notes: "Master terms; references DPA by incorporation" },
      { url: "https://cohere.com/legal", label: "Cohere Legal Hub", tier: 1, notes: "Index linking DPA, sub-processors, AUP (canonical landing)" },
      { url: "https://cohere.com/terms-of-use", label: "Cohere Terms of Use", tier: 2, notes: "End-user / API terms" },
      { url: "https://docs.cohere.com/docs/cohere-works-everywhere", label: "Cohere Deployment Options Docs", tier: 2, notes: "Private cloud / VPC / on-prem deployment claims (sovereignty evidence)" },
    ],
  },

  {
    slug: "nvidia-nim-enterprise",
    vendor: "NVIDIA",
    sources: [
      { url: "https://www.nvidia.com/en-us/agreements/", label: "NVIDIA Agreements Index", tier: 1, notes: "Canonical index of all product agreements (NCSA, NAIE EULA, etc.)" },
      { url: "https://www.nvidia.com/en-us/about-nvidia/privacy-policy/", label: "NVIDIA Privacy Policy", tier: 1, notes: "Corporate GDPR/CCPA privacy statement" },
      { url: "https://www.nvidia.com/en-us/security/", label: "NVIDIA Security Portal", tier: 1, notes: "Product security, PSIRT, advisories" },
      { url: "https://docs.nvidia.com/ai-enterprise/overview/latest/index.html", label: "NVIDIA AI Enterprise Overview Docs", tier: 2, notes: "NAIE architecture, support matrix, deployment model" },
      { url: "https://www.nvidia.com/en-us/data-center/products/ai-enterprise/", label: "AI Enterprise Product Page", tier: 2, notes: "Customer-deployed model — no data sent to NVIDIA" },
      { url: "https://catalog.ngc.nvidia.com/orgs/nvidia/collections/nvaie", label: "NGC NAIE Catalog", tier: 2, notes: "NIM microservice catalogue (component inventory)" },
    ],
  },

  {
    slug: "databricks-mosaic-ai",
    vendor: "Databricks",
    sources: [
      { url: "https://www.databricks.com/trust", label: "Databricks Trust Center", tier: 1, notes: "Primary trust landing page" },
      { url: "https://security.databricks.com", label: "Databricks Security Portal (SafeBase)", tier: 1, notes: "SOC 2 / ISO 27001 / HIPAA / FedRAMP artefacts (JS-shell, needs reader)", fetchStrategy: "jina-reader" },
      { url: "https://www.databricks.com/trust/compliance", label: "Databricks Compliance Certifications", tier: 1, notes: "Enumerated certifications & frameworks" },
      { url: "https://www.databricks.com/legal/mcsa", label: "Databricks MCSA (Master Agreement)", tier: 1, notes: "MCSA incorporates DPA + sub-processor obligations" },
      { url: "https://www.databricks.com/legal/privacynotice", label: "Databricks Privacy Notice", tier: 1, notes: "Corporate privacy + customer-data boundary statements" },
      { url: "https://www.databricks.com/trust/privacy", label: "Databricks Trust - Privacy", tier: 2, notes: "Privacy & responsible-AI posture summary" },
      { url: "https://www.databricks.com/trust/security-features", label: "Databricks Security Features", tier: 2, notes: "Workspace-level security controls catalogue" },
    ],
  },

  {
    slug: "ibm-watsonx",
    vendor: "IBM",
    sources: [
      { url: "https://www.ibm.com/trust", label: "IBM Trust Center", tier: 1, notes: "Primary trust hub (security, privacy, compliance)" },
      { url: "https://www.ibm.com/trust/privacy", label: "IBM Privacy Statement", tier: 1, notes: "Global privacy statement" },
      { url: "https://www.ibm.com/trust/security", label: "IBM Trust - Security", tier: 1, notes: "Security program overview & certifications" },
      { url: "https://www.ibm.com/support/customer/csol/terms/?id=Z126-6304", label: "IBM DPA (Z126-6304)", tier: 1, notes: "Canonical IBM Data Processing Addendum document (Art. 28)" },
      { url: "https://www.ibm.com/support/customer/csol/terms/?id=Z126-7870", label: "IBM Cloud Services Agreement", tier: 1, notes: "Cloud Services master terms referencing DPA" },
      { url: "https://www.ibm.com/support/customer/csol/terms/?id=i126-6883", label: "watsonx.ai SaaS Service Description (i126-6883)", tier: 1, notes: "watsonx.ai-specific service description + data handling" },
      { url: "https://www.ibm.com/support/customer/csol/terms/?id=i126-7747", label: "watsonx.governance Service Description (i126-7747)", tier: 2, notes: "watsonx.governance-specific terms" },
      { url: "https://www.ibm.com/docs/en/watsonx/saas", label: "watsonx SaaS Documentation", tier: 2, notes: "Product docs incl. EU region availability (Frankfurt) + residency" },
    ],
  },
];

async function main() {
  console.log("🔎 Evidence backbone — Phase 2a: top-10 vendor backfill");
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
  console.log(`\n✅ Seed complete. Run \`npm run evidence:fetch\` to snapshot + extract drafts.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
