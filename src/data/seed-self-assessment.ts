/**
 * Self-Assessment — VendorScope rated by its own methodology
 *
 * "Eat your own dog food" — rate ourselves with the same rigour
 * we apply to every other AI system in the database.
 *
 * Run with: npx tsx src/data/seed-self-assessment.ts
 * Safe to run multiple times (uses upsert on slug).
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Self-assessing VendorScope...\n");

  const system = {
    slug: "vendorscope-eu",
    vendor: "VendorScope",
    name: "VendorScope Platform",
    type: "AI Compliance Intelligence Platform",
    risk: "Minimal",
    description:
      "AI-powered compliance intelligence platform for European decision-makers evaluating AI systems against EU regulations. Uses AI in two features: (1) a chatbot assistant that answers compliance questions grounded in the platform's own regulatory database (RAG), and (2) an AI-powered use-case matching engine that recommends AI systems based on procurement requirements. The platform itself does NOT make automated decisions about individuals — it provides regulatory intelligence for B2B enterprise procurement teams. AI is used to surface and explain existing regulatory content, not to classify, score, or make decisions about people.",
    category: "Other",
    featured: false,
    capabilityType: "decision-support",
    vendorHq: "France (EU-native)",
    euPresence:
      "EU-native company based in France. All infrastructure hosted in EU: Vercel EU (Frankfurt), Neon PostgreSQL (AWS eu-central-1, Frankfurt). No data leaves the EU for storage or processing. Team and operations fully European. Domain: vendorscope.eu.",
    foundedYear: 2025,
    employeeCount: "1-10",
    fundingStatus:
      "Bootstrapped. No external investors. Revenue model: freemium SaaS (Free / Pro €19/mo / Enterprise custom pricing) + consulting services. Payment processing via LemonSqueezy (Merchant of Record, handles EU VAT).",
    marketPresence: "Startup",
    customerCount: "Early stage — growing subscriber base",
    notableCustomers:
      "Early-stage platform. Target market: EU enterprise procurement teams, CISOs, DPOs, compliance officers, and AI governance teams in regulated industries (financial services, healthcare, manufacturing, public sector).",
    customerStories:
      "Platform launched in 2025 with comprehensive coverage of 50+ AI systems assessed against 10+ EU regulatory frameworks. Self-assessment published for full transparency.",
    useCases:
      "AI system compliance research for procurement decisions\nRegulatory framework comparison and mapping\nCompliance checklist generation per framework combination\nSide-by-side AI system comparison with EU compliance criteria\nAI regulatory intelligence briefings\nEnterprise AI vendor due diligence support",
    dataStorage:
      "All data stored in Neon PostgreSQL in AWS eu-central-1 (Frankfurt, Germany). AES-256 encryption at rest. No data replication outside the EU. Static assets served via Vercel Edge Network (EU nodes). Subscriber data: email, optional display name, topic preferences, consent record. Chat logs stored for quality assurance (12-month retention).",
    dataProcessing:
      "Minimal personal data processing. Core data is regulatory content and AI system assessments (public information). Subscriber data: email for authentication (magic link, no passwords stored), optional profile (role, industry, org size) for AI personalisation. Chat questions sent to Anthropic Claude API for inference — no email, name, or account identifiers are forwarded to the LLM. Only the question text and an anonymised role/industry label are sent.",
    trainingDataUse:
      "VendorScope does NOT train any AI models. The platform uses Anthropic's Claude Haiku 4.5 via API. Per Anthropic's API terms: data sent via API is not used for model training. Customer data is never used for any form of model training, fine-tuning, or improvement. The platform's regulatory database content is curated by human editorial processes.",
    subprocessors:
      "Anthropic (US — AI inference for chatbot and comparison tool, questions only, no PII forwarded)\nVercel (EU Frankfurt — hosting, CDN, serverless functions)\nNeon (EU Frankfurt — PostgreSQL database)\nResend (US + EU SCCs — transactional email delivery)\nLemonSqueezy (US — payment processing as Merchant of Record, handles EU VAT)",
    dpaDetails:
      "GDPR-compliant privacy policy published at /privacy. Consent recorded with date and text snapshot at subscription. Data Processing Agreements: Vercel DPA (standard), Neon DPA (EU data residency), Anthropic API terms (no training use), Resend DPA (EU SCCs), LemonSqueezy DPA (Merchant of Record). No DPA required from subscribers — VendorScope is the data controller, not a processor.",
    slaDetails:
      "Platform hosted on Vercel with global CDN. Database on Neon with automatic failover. No formal SLA published for the free tier. Pro/Enterprise: best-effort 99.9% uptime. Chatbot availability depends on Anthropic API availability. Incident response plan published at /incident-response. Security policy published at /security.",
    dataPortability:
      "Subscriber data export available via /api/account/export (JSON format). Includes email, preferences, consent record, digest history. CSV and JSON export of AI system data available for Pro subscribers via /api/export. No vendor lock-in — all platform content accessible via public pages.",
    exitTerms:
      "Monthly subscription via LemonSqueezy. Cancel anytime via customer portal. Data deletion available via account settings (immediate, irreversible). Unsubscribe from communications via one-click link. No lock-in period. No exit fees.",
    ipTerms:
      "VendorScope retains IP in platform, assessment methodology, and editorial content. Regulatory text and framework content is derived from public EU legislation. AI-generated chatbot responses are not claimed as IP. Subscriber data owned by subscribers.",
    certifications:
      "No formal certifications (early-stage startup). Security measures implemented: bcrypt password hashing (admin), SHA-256 token hashing, TOTP 2FA for admin access, HTTP-only session cookies, input validation and injection detection on all AI endpoints, rate limiting on chatbot and comparison tool. Self-assessed against EU AI Act, GDPR, and platform's own methodology. ICT Risk Management framework documented per DORA Chapter II requirements. Incident Response Plan published (P1-P4 classification with SLA timelines). Supply chain risk assessment documented for all subprocessors.",
    encryptionInfo:
      "AES-256 at rest (Neon PostgreSQL, AWS eu-central-1). TLS 1.2+ in transit for all connections. Magic link tokens and session tokens stored as SHA-256 hashes. Admin passwords hashed with bcrypt (cost factor 12). HTTP-only, Secure, SameSite cookies.",
    accessControls:
      "Admin panel: email/password + optional TOTP 2FA. Role-based access (owner/admin/editor). Subscriber accounts: magic link authentication (passwordless). Session tokens with 30-day expiry, validated against database on each request. Chat rate limiting: anonymous 3/day, free 10/day, pro/enterprise unlimited. Three-layer chatbot security: input guard (injection detection + off-topic filter), rate limiter, LLM prompt hardening. Security policy and incident handling procedures publicly documented.",
    modelDocs:
      "LLM model used: Claude Haiku 4.5 (claude-haiku-4-5-20251001) via Anthropic API. Max response: 256 tokens (chatbot), 2048 tokens (comparison). System prompt: constrains model to EU AI/GDPR topics only, requires source citations from provided context, prohibits hallucination, refuses prompt injection. RAG architecture: keyword-based retrieval from platform's own regulatory database (frameworks, policy statements, AI systems, changelog). No fine-tuning — uses base Anthropic model with context injection.",
    explainability:
      "Chatbot responses grounded in platform's regulatory database via RAG — model instructed to cite specific articles and frameworks. Comparison matching explains relevance scores and risk notes for each recommendation. Assessment scores displayed on every system page with methodology link. Framework sections include expert commentary explaining each requirement in plain language.",
    biasTesting:
      "AI is used for information retrieval and explanation, not for decisions about individuals. Bias risk is low because: (1) no automated decision-making about people, (2) chatbot answers grounded in regulatory text (not generated from training data), (3) comparison tool ranks systems by compliance data, not demographic factors. Known limitation: regulatory content skewed toward EU perspective (by design — this is an EU-focused platform). English-language content most comprehensive.",
    aiActStatus:
      "Minimal risk under EU AI Act. The platform uses AI for two features: (1) chatbot providing regulatory information — this is an AI system that interacts with natural persons, classified as 'limited risk' under Article 50, requiring transparency that the user is interacting with AI (implemented via footer notice + chatbot UI). (2) Comparison tool providing procurement recommendations — advisory only, no automated decision-making about individuals. NOT in Annex III high-risk categories: the platform does not perform biometric identification, credit scoring, recruitment, law enforcement, or any other high-risk use case. Risk classification: Minimal to Limited. Transparency measures: AI disclosure in chatbot UI (Article 50), published security and incident response policies.",
    gdprStatus:
      "Good GDPR compliance posture for data processing scope. Data controller (not processor). Minimal personal data: email, optional name, preferences. Consent recorded per Article 7. Data subject rights implemented: access (Art. 15), portability (Art. 20, JSON export), erasure (Art. 17, immediate deletion), withdrawal of consent (one-click unsubscribe). Magic link auth means no passwords stored. Privacy policy published. Areas for improvement: ChatLog inclusion in data export, formal DPO designation, Anthropic listed in processor table. Security measures documented in public security policy per Article 32.",
    euResidency:
      "Full EU data residency. Database: Neon PostgreSQL in AWS eu-central-1 (Frankfurt). Hosting: Vercel EU (Frankfurt). No subscriber data stored outside the EU. Chatbot queries sent to Anthropic API (US) contain only the question text + anonymised role label — no email, name, or account identifiers cross the Atlantic. Payment data handled by LemonSqueezy as Merchant of Record (US, but they act as independent controller for payment data).",
    deploymentModel: "cloud",
    sourceModel: "closed-source",
  };

  // Upsert system
  const created = await prisma.aISystem.upsert({
    where: { slug: system.slug },
    update: system,
    create: system,
  });

  // Framework scores — honest self-assessment
  const scores: Record<string, string> = {
    // EU AI Act: Minimal/Limited risk system. Good transparency (footer notice, Article 50).
    // Missing: no formal conformity assessment (not required for minimal risk).
    // Honest assessment: B+ — we're transparent and compliant for our risk level.
    "eu-ai-act": "B+",

    // GDPR: Good for our processing scope. Minimal data, consent recorded, rights implemented.
    // Gaps: ChatLog not in export, Anthropic not in privacy policy (being fixed), no formal DPO.
    // For a startup processing minimal personal data, this is solid but not perfect.
    "gdpr": "B+",

    // DORA: Improved — ICT risk management framework documented, incident response plan published, supply chain assessment completed. Still gaps: no formal TLPT, no dedicated ICT risk officer.
    "dora": "B-",

    // NIS2: Improved — cybersecurity hygiene documented, incident response with classification, vulnerability handling process. Gaps: no CSIRT notification process, no formal supply chain security policy beyond assessment.
    "nis2": "C+",
  };

  const frameworks = await prisma.regulatoryFramework.findMany({
    where: { slug: { in: Object.keys(scores) } },
  });

  for (const fw of frameworks) {
    const score = scores[fw.slug];
    if (score) {
      await prisma.assessmentScore.upsert({
        where: {
          systemId_frameworkId: {
            systemId: created.id,
            frameworkId: fw.id,
          },
        },
        update: { score },
        create: {
          systemId: created.id,
          frameworkId: fw.id,
          score,
        },
      });
    }
  }

  console.log("  ✓ VendorScope — self-assessment profile created");
  console.log("    Risk: Minimal");
  console.log("    EU AI Act: B+ | GDPR: B+ | DORA: B- | NIS2: C+");
  console.log("    Honest gaps documented in aiActStatus, gdprStatus fields");
  console.log("\nDone — practicing what we preach.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
