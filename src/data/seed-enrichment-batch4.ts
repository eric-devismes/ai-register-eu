/**
 * Content Enrichment — Batch 4: UiPath Maestro + Glean + Priority 2 Systems
 *
 * Completes the top-20 enrichment (UiPath, Glean) and adds Priority 2 systems:
 * Slack AI, Canva AI, Figma AI, Grammarly, Jasper AI, Notion AI, Perplexity, DeepSeek
 *
 * Run with: npx tsx src/data/seed-enrichment-batch4.ts
 * Safe to run multiple times (uses upsert on slug).
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// ─── System Profiles ──────────────────────────────────────

const systems = [
  // ── UiPath Maestro ─────────────────────────────────────
  {
    slug: "uipath-maestro",
    vendor: "UiPath",
    name: "UiPath Platform + Maestro",
    type: "AI-Powered Process Automation",
    risk: "Limited",
    description:
      "Enterprise automation platform combining RPA with AI orchestration via Maestro — a cloud-native agentic orchestration layer that coordinates robots, humans, and AI agents across long-running workflows. Provides process mining, case management, and coding agents. One of the first enterprise vendors to achieve ISO/IEC 42001:2023 (AI management systems) certification. Strong EU roots (founded in Romania), EU data residency, and C5 (German BSI) certification.",
    category: "Other",
    featured: false,
    capabilityType: "autonomous-agents",
    vendorHq: "New York, USA (founded in Bucharest, Romania)",
    euPresence:
      "Strong EU roots — founded in Romania. EU data centers available (Amsterdam, Frankfurt). EU data residency for Automation Cloud. Multiple EU offices. Publicly traded (NYSE: PATH).",
    foundedYear: 2005,
    employeeCount: "4,000+",
    fundingStatus:
      "Public (NYSE: PATH). Market cap ~$12B (2026). Revenue ~$1.5B annually. Profitable since 2024.",
    marketPresence: "Leader",
    customerCount: "10,800+ customers globally",
    notableCustomers:
      "Fiserv (financial services automation)\nADT (security operations)\nDeloitte (ERP modernization partner)\nDeutsche Post DHL (global logistics automation)\nSiemens (manufacturing process automation)\nUBS (financial services compliance)\nToyota, Uber, CrowdStrike, Adobe",
    customerStories:
      "Deutsche Post DHL automated 500+ processes saving millions in operational costs. UBS uses UiPath for regulatory compliance workflows. Siemens deployed 2,000+ automations across manufacturing operations.",
    useCases:
      "Invoice processing and accounts payable automation\nCustomer onboarding and KYC verification\nRegulatory compliance reporting\nIT helpdesk ticket routing and resolution\nSupply chain document processing\nHR employee lifecycle management\nProcess mining and optimization\nAI agent orchestration via Maestro",
    dataStorage:
      "EU data residency available via Automation Cloud — EU data centers with Switzerland and UAE regions added 2025. On-premise deployment option for full data sovereignty. Customer data not shared across tenants.",
    dataProcessing:
      "Automation Cloud processes data in selected region. On-premise Server and Orchestrator keep all data within customer infrastructure. CAVEAT: AI model processing may temporarily route outside selected region if no local LLM endpoint exists — when strict data residency is enforced, some globally deployed models become unavailable.",
    trainingDataUse:
      "Customer data is NOT used for model training. AI models (Document Understanding, Clipboard AI) are pre-trained. Customer can fine-tune models on their own data — fine-tuned models remain customer property.",
    subprocessors:
      "Published subprocessor list. Key sub-processors: Microsoft Azure (cloud infrastructure), AWS (select features). Customer notification for subprocessor changes.",
    dpaDetails:
      "DPA available covering GDPR Article 28. EU SCCs for international transfers. Data Processing Addendum included in enterprise contracts.",
    slaDetails:
      "Enterprise SLA: 99.9% uptime for Automation Cloud. Premium support with 1-hour response for critical issues. On-premise: customer-managed SLA.",
    dataPortability:
      "Workflows exported as .nupkg packages. Data extraction via Orchestrator API. Process definitions portable between UiPath environments. No vendor lock-in on automation definitions.",
    exitTerms:
      "Annual or multi-year contracts. Workflow packages and process definitions are customer-owned and portable. Data export available via API. Reasonable exit terms in enterprise agreements.",
    ipTerms:
      "Customer retains IP in all automations, workflows, and processed data. UiPath retains IP in the platform and pre-trained AI models.",
    certifications:
      "SOC 1, SOC 2 Type II. ISO 27001. ISO 27017 (cloud security). ISO 27018 (PII in cloud). ISO 9001 (quality). ISO/IEC 42001:2023 (AI management systems — achieved Sep 2025, among first globally). C5 (German BSI cloud security). HITRUST. HIPAA. FedRAMP alignment (2025). CSA STAR Level 2.",
    encryptionInfo:
      "AES-256 at rest. TLS 1.2+ in transit. Customer-managed keys available for Automation Cloud. Hardware security module (HSM) integration for on-premise.",
    accessControls:
      "SAML 2.0 SSO. SCIM user provisioning. Role-based access control (RBAC) with granular permissions. MFA. Active Directory integration. Audit logs with full activity tracking.",
    modelDocs:
      "Document Understanding and Communications Mining model documentation available. AI Center provides model management, versioning, and monitoring. Transparency on pre-trained model capabilities and limitations.",
    explainability:
      "Process mining provides visual explanation of automation decisions. AI Center shows model confidence scores. Document Understanding provides field-level confidence. No deep XAI for LLM-based features.",
    biasTesting:
      "Responsible AI principles published. AI models tested for accuracy across document types and languages. No public bias audit reports specific to EU languages.",
    aiActStatus:
      "Automation generally classified as minimal/limited risk under EU AI Act. Document Understanding for certain use cases may fall under limited risk (transparency obligations). Active engagement with EU policy development.",
    gdprStatus:
      "DPA available. EU data residency. DPIA support. Right to deletion supported. Strong privacy-by-design in automation workflows.",
    euResidency:
      "Full EU data residency via Automation Cloud (Amsterdam, Frankfurt). On-premise option for complete data sovereignty. EU-only processing configurable.",
    deploymentModel: "hybrid",
    sourceModel: "closed-source",
    industrySlugs: ["financial-services", "healthcare", "manufacturing", "public-sector"],
    scores: {
      "eu-ai-act": "B+",
      gdpr: "A-",
      dora: "B+",
      "eba-eiopa-guidelines": "B",
    },
  },

  // ── Glean Enterprise Search ────────────────────────────
  {
    slug: "glean-enterprise-search",
    vendor: "Glean",
    name: "Glean Enterprise AI Search",
    type: "Enterprise AI Search & Knowledge Management",
    risk: "Limited",
    description:
      "AI-powered work intelligence platform combining enterprise search, AI assistant, and AI agents across 100+ enterprise applications (Slack, Google Workspace, Confluence, Salesforce, etc.). Permission-aware results respect source system access controls. Knowledge graph learns organizational context. On-premises deployment available via Dell partnership (May 2025) for full data sovereignty. $250M+ ARR, growing 150%+ YoY.",
    category: "Other",
    featured: false,
    capabilityType: "search-retrieval",
    vendorHq: "Palo Alto, California, USA",
    euPresence:
      "Growing EU presence. EMEA data residency region available. On-premises deployment option via Dell Technologies partnership (May 2025) for full data sovereignty. US-headquartered.",
    foundedYear: 2019,
    employeeCount: "1,000+",
    fundingStatus:
      "Private — raised $940M+ total. Latest: $260M Series E (Feb 2025) at $4.6B valuation. $250M+ ARR (150%+ YoY growth). Backed by Sequoia, Kleiner Perkins, Lightspeed.",
    marketPresence: "Challenger",
    customerCount: "1,000+ enterprise customers",
    notableCustomers:
      "Booking.com, Comcast, eBay, Intuit, LinkedIn, Pinterest, Samsung, Zillow\nDatabricks (company-wide knowledge search)\nDell, T-Mobile, TIME, GCash, Confluent",
    customerStories:
      "Databricks reported 40% reduction in time spent searching for information. Duolingo uses Glean to unify engineering documentation. Multiple customers report 2-3 hours saved per employee per week.",
    useCases:
      "Enterprise knowledge search across all SaaS applications\nAI-generated answers from internal documents\nEmployee onboarding knowledge access\nIT support ticket resolution\nSales knowledge base for customer-facing teams\nEngineering documentation discovery\nCompliance document retrieval\nMeeting preparation and context gathering",
    dataStorage:
      "SaaS: single-tenant, fully isolated environment. Customer-hosted cloud option (AWS, Azure, GCP). On-premises via Dell partnership (May 2025). EMEA data residency region available. Data indexed and stored in Glean's search infrastructure.",
    dataProcessing:
      "Glean crawls and indexes content from connected applications. Content is processed to build a knowledge graph. LLM inference uses customer content as context for generating answers. Processing primarily in US regions.",
    trainingDataUse:
      "Customer data is NOT used to train Glean's base models. Customer-specific knowledge graph is private to each customer. Fine-tuning on organizational data creates customer-specific relevance models (not shared).",
    subprocessors:
      "Cloud infrastructure providers (AWS, GCP). LLM providers for inference (OpenAI and proprietary models). Published subprocessor list available under NDA.",
    dpaDetails:
      "DPA available for enterprise customers. EU SCCs for international data transfers. Privacy review available. GDPR compliance documentation provided.",
    slaDetails:
      "Enterprise SLA available (terms under NDA). Typical: 99.9% uptime commitment. Dedicated support for enterprise tier.",
    dataPortability:
      "Glean indexes data from source applications — source data remains in original apps. Search indexes and knowledge graph are Glean-proprietary. User can disconnect integrations and request data deletion.",
    exitTerms:
      "Annual contracts standard. Data deletion upon contract termination. Source data unaffected (Glean only indexes, doesn't store original content). Knowledge graph deleted upon exit.",
    ipTerms:
      "Customer retains all IP in source content. Glean retains IP in search technology, models, and algorithms.",
    certifications:
      "SOC 2 Type II (recertified 2024). ISO/IEC 27001. HIPAA BAA available. GDPR-compliant DPA. FIPS 140-2 compliant key management. Annual third-party penetration testing.",
    encryptionInfo:
      "AES-256 at rest. TLS 1.3 in transit. Per-customer encryption keys via KMS. FIPS 140-2 compliant. Data segregation between customers.",
    accessControls:
      "SAML 2.0 SSO. SCIM provisioning. Permission-aware search (respects source application permissions — users only see content they have access to). Admin console with audit logs. MFA.",
    modelDocs:
      "Glean uses proprietary models plus third-party LLMs. Model documentation limited compared to pure-play AI providers. Answer generation includes source citations for verification.",
    explainability:
      "Answers include source document citations. Users can verify AI-generated answers against original sources. No deep XAI or confidence scoring.",
    biasTesting:
      "Permission-aware search reduces bias in information access. No public bias testing reports. Search relevance tuned per organization.",
    aiActStatus:
      "Enterprise search generally classified as minimal/limited risk. AI-generated answers from internal docs = limited risk (transparency obligations). No known regulatory actions.",
    gdprStatus:
      "DPA available. GDPR compliance documented. EU SCCs for cross-border transfers. Right to deletion supported.",
    euResidency:
      "Improving. EMEA data residency region available. On-premises deployment via Dell partnership for full sovereignty. Caveat: LLM inference location depends on model hub configuration — verify EU-only model routing is guaranteed.",
    deploymentModel: "cloud-only",
    sourceModel: "closed-source",
    industrySlugs: ["financial-services", "telecommunications"],
    scores: {
      "eu-ai-act": "B",
      gdpr: "B",
      dora: "B-",
    },
  },

  // ── Slack AI ───────────────────────────────────────────
  {
    slug: "slack-ai",
    vendor: "Salesforce (Slack)",
    name: "Slack AI",
    type: "AI-Powered Workplace Communication",
    risk: "Limited",
    description:
      "Built-in AI features for Slack workspace: channel summaries, thread summaries, search answers, and workflow automation. Uses LLMs to synthesize conversations and surface relevant information. Runs within existing Slack Enterprise Grid security and compliance controls. No additional cost for paid Slack plans.",
    category: "Other",
    featured: false,
    capabilityType: "conversational-ai",
    vendorHq: "San Francisco, USA (owned by Salesforce)",
    euPresence:
      "Salesforce has strong EU presence. Slack data residency available in Frankfurt (Germany). Slack is a Salesforce company — inherits Salesforce EU compliance posture.",
    foundedYear: 2009,
    employeeCount: "Part of Salesforce (73,000+ employees)",
    fundingStatus: "Subsidiary of Salesforce (NYSE: CRM). Acquired in 2021 for $27.7B.",
    marketPresence: "Leader",
    customerCount: "750,000+ organizations use Slack",
    notableCustomers:
      "IBM, Vodafone, Deliveroo, Atos, Deutsche Telekom, BBC, Allianz, Airbus",
    customerStories:
      "Vodafone uses Slack Enterprise Grid with EU data residency for 100,000+ employees. IBM deploys Slack AI across global engineering teams.",
    useCases:
      "Channel and thread summarization\nIntelligent search across workspace history\nWorkflow automation with AI-assisted steps\nMeeting recap and action item extraction\nKnowledge discovery across channels",
    dataStorage:
      "EU data residency available via Slack Enterprise Grid (Frankfurt, Germany). Customer chooses data region at workspace creation. Slack AI processing respects the selected data region.",
    dataProcessing:
      "AI processing uses LLMs to analyze messages within the customer's Slack workspace. Salesforce/Slack's Einstein Trust Layer provides prompt defense, toxicity detection, and zero data retention for AI queries.",
    trainingDataUse:
      "Customer data is NOT used for LLM training. Slack AI queries processed with zero data retention. Einstein Trust Layer enforces this contractually and technically.",
    subprocessors: "Salesforce infrastructure. AWS (hosting). Published subprocessor list.",
    dpaDetails:
      "Salesforce DPA covering GDPR. EU SCCs. Binding Corporate Rules approved by French CNIL. DPIA support.",
    slaDetails: "Enterprise Grid: 99.99% uptime SLA with financial credits.",
    dataPortability:
      "Slack data export (JSON format). Compliance exports via Discovery API. E-Discovery integrations.",
    exitTerms:
      "Annual or multi-year contracts. Full data export available. Standard Salesforce enterprise exit terms.",
    ipTerms: "Customer retains IP in all messages and content. AI summaries are derivative works of customer content.",
    certifications:
      "SOC 2 Type II. SOC 3. ISO 27001. ISO 27017. ISO 27018. FedRAMP Moderate. HIPAA BAA. CSA STAR.",
    encryptionInfo:
      "AES-256 at rest. TLS 1.2+ in transit. Slack Enterprise Key Management (EKM) — customer-controlled encryption keys via AWS KMS.",
    accessControls:
      "SAML 2.0 SSO. SCIM provisioning. Enterprise Grid admin controls. DLP integrations. Audit logs. Session management. MFA.",
    modelDocs: "Slack AI model documentation available. Einstein Trust Layer architecture published.",
    explainability:
      "AI summaries include source message references. Users can verify summaries against original conversations. No formal XAI framework.",
    biasTesting:
      "Salesforce Responsible AI team oversight. Einstein Trust Layer includes toxicity filtering. No public bias audit specific to Slack AI.",
    aiActStatus:
      "Conversation summarization = limited risk (transparency obligation: users must know they're receiving AI-generated summaries). Slack clearly labels AI outputs.",
    gdprStatus:
      "Salesforce BCR approved by French CNIL. DPA available. EU data residency. Strong GDPR compliance posture inheriting Salesforce's enterprise privacy program.",
    euResidency:
      "Yes — Frankfurt data center for Enterprise Grid. AI processing within EU data residency boundary via Einstein Trust Layer.",
    deploymentModel: "cloud-only",
    sourceModel: "closed-source",
    industrySlugs: ["financial-services", "telecommunications", "manufacturing"],
    scores: {
      "eu-ai-act": "B+",
      gdpr: "A-",
      dora: "B",
    },
  },

  // ── Canva AI (Magic Studio) ────────────────────────────
  {
    slug: "canva-ai",
    vendor: "Canva",
    name: "Canva AI / Magic Studio",
    type: "AI-Powered Design Platform",
    risk: "Minimal",
    description:
      "Suite of AI tools within the Canva design platform: Magic Design (auto-generate designs from prompts), Magic Write (AI text generation), Magic Eraser, Background Remover, text-to-image generation, and translation. Primarily consumer/SMB focused but Canva for Teams targets enterprises. Growing rapidly but limited enterprise compliance controls compared to pure enterprise vendors.",
    category: "Other",
    featured: false,
    capabilityType: "generative-ai",
    vendorHq: "Sydney, Australia",
    euPresence:
      "EU office in London (pre-Brexit). Growing European team. Data processing in multiple regions. No dedicated EU data center commitment for AI processing.",
    foundedYear: 2012,
    employeeCount: "5,000+",
    fundingStatus:
      "Private. Valued at $40B+ (2024). Revenue ~$2.5B annually. Profitable.",
    marketPresence: "Leader",
    customerCount: "190M+ monthly active users, 500,000+ team accounts",
    notableCustomers:
      "Salesforce, HubSpot, American Airlines, Zoom (marketing teams). Primarily SMB and departmental use rather than full enterprise deployments.",
    customerStories:
      "Primarily marketing and communications teams using Canva for brand consistency across large organizations. Limited public enterprise case studies.",
    useCases:
      "Marketing asset creation with AI generation\nBrand template management\nAI-powered design suggestions\nText generation for social media and marketing\nImage editing and enhancement\nPresentation creation\nVideo editing with AI assistance\nTranslation of designs into multiple languages",
    dataStorage:
      "User content stored in AWS (multiple regions). No dedicated EU-only storage option for AI features. Content stored in nearest regional data center.",
    dataProcessing:
      "AI features process data in cloud infrastructure. Magic Design and text-to-image may route through third-party AI providers (Stable Diffusion, OpenAI). Processing region not guaranteed for AI features.",
    trainingDataUse:
      "Canva's AI models trained on licensed stock imagery and public datasets. User-generated content: Canva has stated it does not use customer designs to train AI models, but terms have been ambiguous. Enterprise customers should verify specific contractual commitments.",
    subprocessors:
      "AWS (infrastructure). Third-party AI model providers. Details limited in standard plans.",
    dpaDetails:
      "DPA available for Canva for Teams. GDPR compliance documentation. Standard EU SCCs.",
    slaDetails: "Enterprise tier: 99.9% uptime. Standard plans: best-effort availability.",
    dataPortability:
      "Export designs as PNG, PDF, SVG, MP4. No bulk data export API for enterprise. Brand kit and template migration limited.",
    exitTerms:
      "Monthly/annual subscriptions. Design exports available. No lock-in on content (export in standard formats). Template and brand kit migration manual.",
    ipTerms:
      "Customer retains IP in designs. AI-generated content: Canva grants commercial use rights. Third-party stock content follows license terms.",
    certifications: "SOC 2 Type II. ISO 27001. GDPR compliant. Canva Shield provides AI indemnification for IP claims at no extra cost for Enterprise (100+ seats).",
    encryptionInfo: "AES-256 at rest. TLS 1.2+ in transit. No customer-managed keys.",
    accessControls:
      "SSO (SAML 2.0) for Enterprise tier. SCIM provisioning. Basic RBAC. Admin console with usage analytics.",
    modelDocs: "Limited model documentation. AI feature descriptions available. No model cards.",
    explainability: "No formal explainability for AI-generated designs. Users can iterate on prompts.",
    biasTesting:
      "Published responsible AI principles. No public bias audit reports. Image generation may reflect biases in training data.",
    aiActStatus:
      "Design tools = minimal risk under EU AI Act. Text-to-image generation = limited risk (transparency: users should know content is AI-generated).",
    gdprStatus: "DPA available. GDPR compliance. EU SCCs. Cookie consent management.",
    euResidency:
      "Partial. User data in nearest regional data center. AI processing not guaranteed EU-only. Weaker EU data sovereignty than enterprise AI vendors.",
    deploymentModel: "cloud-only",
    sourceModel: "closed-source",
    industrySlugs: ["telecommunications"],
    scores: {
      "eu-ai-act": "B",
      gdpr: "B",
    },
  },

  // ── Figma AI ───────────────────────────────────────────
  {
    slug: "figma-ai",
    vendor: "Figma",
    name: "Figma AI",
    type: "AI-Powered Design & Prototyping",
    risk: "Minimal",
    description:
      "AI-assisted design features within Figma's collaborative design platform: auto-layout suggestions, AI-generated designs from text prompts, smart component suggestions, and design system management. Enterprise-focused since Adobe acquisition cancellation. Growing AI capabilities but early stage compared to dedicated AI vendors.",
    category: "Other",
    featured: false,
    capabilityType: "generative-ai",
    vendorHq: "San Francisco, USA",
    euPresence:
      "London and Berlin offices. Growing EU team. Data processing in AWS with EU region options. No dedicated EU AI processing commitment.",
    foundedYear: 2012,
    employeeCount: "1,500+",
    fundingStatus:
      "Private. Valued at $12.5B (2024, post-Adobe deal cancellation). Revenue ~$700M+ annually.",
    marketPresence: "Leader",
    customerCount: "4M+ users, thousands of enterprise customers",
    notableCustomers:
      "Microsoft, Google, Airbnb, Spotify, Dropbox, Twitter/X, Uber, Netflix",
    customerStories:
      "Microsoft uses Figma across product design teams. Airbnb standardized on Figma for global design system management.",
    useCases:
      "AI-assisted UI/UX design\nAutomatic layout and spacing suggestions\nDesign-to-code prototyping\nDesign system component suggestions\nCollaborative design with AI assistance\nAsset generation and optimization",
    dataStorage:
      "AWS-hosted. Customer data in regional data centers. Enterprise tier: data region selection available.",
    dataProcessing:
      "AI features process designs in cloud. Some AI features may use third-party model providers. Processing region follows workspace region setting for Enterprise.",
    trainingDataUse:
      "Figma has committed to not training AI models on private file content. Public Figma Community files may be used for training (opt-out available). Enterprise customers have contractual protections.",
    subprocessors: "AWS (infrastructure). AI model providers (for specific AI features). Published subprocessor list for Enterprise.",
    dpaDetails: "DPA available. GDPR compliance. EU SCCs for international transfers.",
    slaDetails: "Enterprise: 99.9% uptime SLA. Financial credits for violations.",
    dataPortability:
      "Export as PNG, SVG, PDF. Figma file format (.fig) exportable. REST API for programmatic access. No full bulk migration tool to competitors.",
    exitTerms: "Annual contracts for Enterprise. File export in standard formats. Design files are portable.",
    ipTerms: "Customer retains all IP in designs. AI-generated suggestions are derivative works covered by customer's license.",
    certifications: "SOC 2 Type II. SOC 3. ISO 27001. C5 (German BSI — significant for EU procurement). GDPR compliant. Annual penetration testing.",
    encryptionInfo: "AES-256 at rest. TLS 1.2+ in transit. SSE for stored files.",
    accessControls:
      "SAML 2.0 SSO. SCIM provisioning. Organization-level admin controls. Audit logs. MFA. Guest access controls.",
    modelDocs: "Limited AI model documentation. AI features run on a credit system with monthly caps — heavy AI usage requires purchasing additional credit packs ($120-240/mo). Feature-level descriptions available.",
    explainability: "AI suggestions are interactive — designers can accept, modify, or reject. No formal explainability framework.",
    biasTesting: "No public bias audit reports. Design suggestions based on design patterns.",
    aiActStatus:
      "Design assistance = minimal risk. AI-generated design elements may require transparency labeling under limited risk obligations.",
    gdprStatus: "DPA available. GDPR compliant. EU SCCs. Privacy program documented.",
    euResidency: "Partial. Enterprise tier can select EU data region. AI processing region not separately configurable.",
    deploymentModel: "cloud-only",
    sourceModel: "closed-source",
    industrySlugs: ["telecommunications"],
    scores: {
      "eu-ai-act": "B",
      gdpr: "B+",
    },
  },

  // ── Grammarly Business ─────────────────────────────────
  {
    slug: "grammarly-business",
    vendor: "Grammarly",
    name: "Grammarly Business",
    type: "AI Writing Assistant",
    risk: "Limited",
    description:
      "Enterprise AI writing assistant providing grammar, style, tone, and clarity suggestions across business communication. Grammarly Business adds team analytics, style guides, brand tone customization, and admin controls. Generative AI features include text rewriting, summarization, and composition. Processes potentially sensitive business communications — EU data handling is a key procurement consideration.",
    category: "Other",
    featured: false,
    capabilityType: "nlp",
    vendorHq: "San Francisco, USA (founded in Kyiv, Ukraine)",
    euPresence:
      "Founded by Ukrainian team (Kyiv, 2009). US-headquartered since expansion. Growing EU customer base. Data processing primarily in US and EU (AWS). EU data processing option available for Enterprise tier.",
    foundedYear: 2009,
    employeeCount: "1,000+",
    fundingStatus:
      "Private. Valued at ~$13B (2021). Revenue estimated $250M+. Profitable.",
    marketPresence: "Leader",
    customerCount: "30M+ daily users, 70,000+ professional teams",
    notableCustomers:
      "Cisco (40,000+ employees), Databricks, Siemens, Atlassian, Expedia, Dell, HubSpot",
    customerStories:
      "Cisco deployed Grammarly to 40,000+ employees, reporting 30% faster email composition and improved communication quality across global teams.",
    useCases:
      "Business email and document writing assistance\nTone and style consistency across teams\nBrand voice customization\nAI-powered text generation and rewriting\nGrammar, punctuation, and clarity correction\nPlagiarism detection\nTeam writing analytics and insights\nSlack, Teams, and browser integration",
    dataStorage:
      "AWS infrastructure. US primary. EU data processing available for Enterprise customers. Text processed transiently for suggestions — not stored long-term on free/premium plans.",
    dataProcessing:
      "Text analyzed in real-time for suggestions. Enterprise: option for EU-only processing. Grammarly states it does not sell user data. AI suggestions generated by Grammarly's proprietary models.",
    trainingDataUse:
      "Grammarly's models trained on licensed text corpora. Enterprise tier: customer text NOT used for model training — contractually guaranteed. Free/Premium: anonymized data may be used for model improvement (opt-out available).",
    subprocessors:
      "AWS (infrastructure). Google Cloud (select services). Published subprocessor list for Enterprise customers.",
    dpaDetails: "DPA available. GDPR compliance documentation. EU SCCs for international transfers. DPIA support.",
    slaDetails: "Enterprise: 99.9% uptime SLA. Business: best-effort availability.",
    dataPortability: "Text remains in source applications (browser, Slack, email). Grammarly does not store documents long-term. Analytics exportable.",
    exitTerms: "Annual contracts for Business/Enterprise. No lock-in on content. User data deletion upon request.",
    ipTerms: "Customer retains all IP in text content. AI suggestions are ephemeral. Grammarly retains IP in models and algorithms.",
    certifications:
      "SOC 2 Type II (Security, Availability). ISO 27001. ISO 27017. HIPAA compliant. EU-US Data Privacy Framework certified. CCPA compliant. GDPR compliant. Annual third-party audits.",
    encryptionInfo: "AES-256 at rest. TLS 1.2+ in transit. SSE for stored data.",
    accessControls:
      "SAML 2.0 SSO (Enterprise). SCIM provisioning. Admin console with team management. Usage analytics. MFA. Domain-level controls.",
    modelDocs:
      "Grammarly's AI is proprietary — limited public model documentation. Responsible AI practices published. Feature-level documentation available.",
    explainability:
      "Writing suggestions include explanations (why a correction is recommended, grammar rule cited). AI-generated text clearly labeled. No formal XAI framework for generative features.",
    biasTesting:
      "Grammarly has published responsible AI principles. Inclusive language suggestions (reduces biased language). No public comprehensive bias audit.",
    aiActStatus:
      "Writing assistance = limited risk (users must be informed they're receiving AI-generated suggestions). Grammarly labels AI outputs and provides transparency about AI involvement.",
    gdprStatus:
      "GDPR compliant. DPA available. EU SCCs. Privacy-by-design approach. User data deletion supported.",
    euResidency:
      "Available for Enterprise tier (EU-only data processing). Standard plans: primarily US processing. Enterprise customers should request specific EU data processing addendum.",
    deploymentModel: "cloud-only",
    sourceModel: "closed-source",
    industrySlugs: ["financial-services", "public-sector"],
    scores: {
      "eu-ai-act": "B+",
      gdpr: "B+",
    },
  },

  // ── Jasper AI ──────────────────────────────────────────
  {
    slug: "jasper-ai",
    vendor: "Jasper",
    name: "Jasper AI",
    type: "Enterprise AI Content Platform",
    risk: "Minimal",
    description:
      "Enterprise AI marketing content platform for creating brand-consistent marketing copy, social media posts, blog articles, and advertising content. Integrates with enterprise marketing stacks (HubSpot, Google Ads, Salesforce). Strong brand voice control and team collaboration features. Primarily for marketing teams rather than general enterprise use.",
    category: "Other",
    featured: false,
    capabilityType: "generative-ai",
    vendorHq: "Austin, Texas, USA",
    euPresence:
      "Limited EU presence. US-headquartered. Growing European customer base. No dedicated EU data center.",
    foundedYear: 2021,
    employeeCount: "500+",
    fundingStatus:
      "Private. Raised $131M total. Series A: $125M (Oct 2022) at $1.5B valuation. Investors: Insight Partners, Coatue.",
    marketPresence: "Challenger",
    customerCount: "100,000+ customers including enterprise brands",
    notableCustomers:
      "Morningstar, iRobot, SentinelOne, Anthropic (marketing), Sports Illustrated",
    customerStories:
      "Morningstar uses Jasper for financial content creation at scale. Sports Illustrated deployed Jasper for digital content production.",
    useCases:
      "Marketing content creation (blog posts, social, ads)\nBrand voice and style guide enforcement\nCampaign content generation at scale\nSEO-optimized content writing\nEmail marketing copy\nProduct descriptions\nMultilingual content creation\nMarketing workflow automation",
    dataStorage:
      "AWS cloud infrastructure. US-based processing. Data processing region not configurable. Content stored in US data centers.",
    dataProcessing:
      "Uses multiple LLMs (OpenAI, Anthropic, Cohere) for content generation. Customer content processed via Jasper's infrastructure. Brand voice data stored for consistency.",
    trainingDataUse:
      "Customer content NOT used for training base LLMs. Brand voice training creates customer-specific fine-tuning (private to customer).",
    subprocessors: "AWS (infrastructure). OpenAI, Anthropic, Cohere (LLM providers). Published subprocessor list.",
    dpaDetails: "DPA available for enterprise. GDPR compliance. EU SCCs.",
    slaDetails: "Enterprise: SLA available under contract. Business: best-effort.",
    dataPortability: "Content exportable in standard text formats. Brand voice settings not portable to competitors.",
    exitTerms: "Monthly/annual subscriptions. Content export available. Brand data deletion upon request.",
    ipTerms: "Customer retains all IP in generated content. Commercial use rights included.",
    certifications: "SOC 2 Type II. GDPR compliant. Annual security audits.",
    encryptionInfo: "AES-256 at rest. TLS 1.2+ in transit.",
    accessControls: "SSO (SAML 2.0). Team management. Role-based permissions. Audit logs.",
    modelDocs: "Limited public documentation on underlying models. Feature documentation available.",
    explainability: "Content generation with prompt-based control. No formal XAI. Users can iterate on outputs.",
    biasTesting: "No public bias audit reports. Relies on upstream LLM provider safeguards.",
    aiActStatus: "Content generation = minimal risk. AI-generated marketing content should be labeled per limited risk obligations.",
    gdprStatus: "GDPR compliant. DPA available. EU SCCs. Privacy documentation.",
    euResidency: "No — US-based processing only. A limitation for EU regulated entities.",
    deploymentModel: "cloud-only",
    sourceModel: "closed-source",
    industrySlugs: ["telecommunications"],
    scores: {
      "eu-ai-act": "B-",
      gdpr: "B",
    },
  },

  // ── Notion AI ──────────────────────────────────────────
  {
    slug: "notion-ai",
    vendor: "Notion Labs",
    name: "Notion AI",
    type: "AI-Powered Workspace & Knowledge Management",
    risk: "Limited",
    description:
      "Built-in AI assistant within the Notion workspace platform. Provides writing assistance, summarization, Q&A across workspace content, action item extraction, and translation. Deeply integrated with Notion's wiki, docs, and project management features. Enterprise tier offers admin controls, SSO, and audit logs. Growing enterprise adoption but weaker compliance posture than established enterprise vendors.",
    category: "Other",
    featured: false,
    capabilityType: "generative-ai",
    vendorHq: "San Francisco, USA",
    euPresence:
      "Limited EU presence. US-headquartered. EU data residency for enterprise customers (launched 2024). Growing European customer base.",
    foundedYear: 2013,
    employeeCount: "800+",
    fundingStatus:
      "Private. Valued at $10B (2024). Revenue ~$500M+ annually. Raised $343M total.",
    marketPresence: "Challenger",
    customerCount: "100M+ users, enterprise customers growing",
    notableCustomers:
      "Figma, Loom, Headspace, Mixpanel, Cornershop (Uber)",
    customerStories:
      "Figma uses Notion as company wiki with AI-powered knowledge search. Loom migrated from multiple tools to Notion for unified project management.",
    useCases:
      "AI-powered Q&A across workspace content\nDocument summarization and synthesis\nWriting assistance and editing\nAction item and task extraction from meeting notes\nTranslation (multi-language support)\nAutofill database properties with AI\nCustom AI assistants for team workflows",
    dataStorage:
      "AWS infrastructure. US primary. EU data residency available for Enterprise plan (Frankfurt region). Content stored encrypted.",
    dataProcessing:
      "Notion AI uses third-party LLMs (Anthropic Claude) for inference. Enterprise: EU data processing available. Notion states AI features do not use customer data for model training.",
    trainingDataUse:
      "Customer data NOT used for AI model training. Enterprise workspaces: zero data retention by LLM providers. Non-Enterprise: 30-day data retention by LLM providers. AI responses generated in real-time.",
    subprocessors: "AWS (infrastructure). Anthropic (AI provider). Published subprocessor list.",
    dpaDetails: "DPA available. GDPR compliance. EU SCCs. Privacy documentation.",
    slaDetails: "Enterprise: 99.9% uptime SLA. Business: best-effort.",
    dataPortability: "Export to Markdown, CSV, PDF. API access for data extraction. Notion → competitor migration tools available (community-built).",
    exitTerms: "Annual contracts for Enterprise. Full data export available. Content portable in standard formats.",
    ipTerms: "Customer retains all IP in workspace content. AI-generated content covered by customer's license.",
    certifications: "SOC 2 Type II. ISO 27001. ISO 27701 (privacy). ISO 27017. ISO 27018. GDPR compliant (DPO appointed). HIPAA (Enterprise). Annual penetration testing.",
    encryptionInfo: "AES-256 at rest. TLS 1.2+ in transit. No customer-managed keys.",
    accessControls: "SAML 2.0 SSO. SCIM provisioning. Admin console. Audit logs. MFA. Domain management. Space permissions.",
    modelDocs: "Notion AI uses Anthropic Claude — model documentation available via Anthropic. Notion AI feature documentation published.",
    explainability: "AI responses cite workspace content as sources. Users can verify against original documents. No formal XAI.",
    biasTesting: "Relies on Anthropic's responsible AI practices. No Notion-specific bias audits published.",
    aiActStatus: "AI-assisted writing and Q&A = limited risk (transparency obligation). Notion labels AI-generated content.",
    gdprStatus: "GDPR compliant. DPA available. EU data residency for Enterprise. Privacy-by-design approach.",
    euResidency: "Available for Enterprise tier (Frankfurt). Standard/Business plans: US processing.",
    deploymentModel: "cloud-only",
    sourceModel: "closed-source",
    industrySlugs: ["telecommunications"],
    scores: {
      "eu-ai-act": "B",
      gdpr: "B+",
    },
  },

  // ── Perplexity ─────────────────────────────────────────
  {
    slug: "perplexity-ai",
    vendor: "Perplexity AI",
    name: "Perplexity Enterprise Pro",
    type: "AI-Powered Research & Search Engine",
    risk: "Limited",
    description:
      "AI-powered answer engine that combines web search with LLM inference to provide cited, real-time answers. Enterprise Pro offers internal knowledge search, data connectors, SSO, and admin controls. Positioned as an AI research assistant for knowledge workers. Fast-growing but young company with evolving enterprise compliance posture.",
    category: "Other",
    featured: false,
    capabilityType: "search-retrieval",
    vendorHq: "San Francisco, USA",
    euPresence:
      "No significant EU presence. US-headquartered. Growing European user base. No EU data center commitment.",
    foundedYear: 2022,
    employeeCount: "200+",
    fundingStatus:
      "Private. Raised $500M+ total. Series B: $250M (2024). Valued at $9B+. Revenue growing rapidly via Pro subscriptions.",
    marketPresence: "Emerging",
    customerCount: "Enterprise tier: early adoption phase. Consumer Pro: millions of subscribers.",
    notableCustomers:
      "Stripe (internal research), Databricks, Fortune 500 companies (NDAs). Enterprise tier launched mid-2024.",
    customerStories:
      "Enterprise tier is relatively new. Early adopters report significant time savings for research-heavy roles (analysts, consultants, engineers).",
    useCases:
      "Real-time research with cited sources\nInternal knowledge base search\nCompetitive intelligence gathering\nDue diligence research\nMarket analysis and trend tracking\nTechnical documentation search\nAcademic and regulatory research",
    dataStorage:
      "US cloud infrastructure. Enterprise: data isolation available. No EU-specific data center. Internal knowledge base data stored in customer's selected environment.",
    dataProcessing:
      "Uses multiple LLMs (proprietary, OpenAI, Anthropic) for answer generation. Web search combined with LLM inference. Enterprise queries processed with data isolation.",
    trainingDataUse:
      "Enterprise Pro: customer queries NOT used for model training. Pro consumer: query data used for product improvement (opt-out available in settings).",
    subprocessors: "Cloud infrastructure providers. LLM providers (OpenAI, Anthropic, proprietary). Search infrastructure.",
    dpaDetails: "Enterprise DPA available. GDPR compliance documentation. Standard SCCs.",
    slaDetails: "Enterprise: SLA available under contract. Consumer Pro: best-effort.",
    dataPortability: "Search history exportable. No lock-in on research outputs (text-based). API access for Enterprise.",
    exitTerms: "Monthly/annual subscriptions. No significant lock-in.",
    ipTerms: "User retains rights to research outputs. Citations reference original sources.",
    certifications: "SOC 2 Type II (achieved 2024). PCI DSS. GDPR self-declared (NOT independently audited — weaker than competitors). Growing certification portfolio.",
    encryptionInfo: "AES-256 at rest. TLS 1.2+ in transit. Data isolation for Enterprise.",
    accessControls: "SSO (SAML 2.0) for Enterprise. Admin console. Usage analytics. Team management.",
    modelDocs: "Perplexity uses a mix of proprietary and third-party models. Model selection documentation limited. Answer sources always cited.",
    explainability: "All answers include inline citations to source material. Users can verify claims against original sources. Transparency through citation is a core feature.",
    biasTesting: "No public bias audit reports. Young company — responsible AI program still developing.",
    aiActStatus: "AI-powered search = limited risk (users informed of AI involvement). Citations provide transparency. Young compliance posture.",
    gdprStatus: "GDPR compliance self-declared but NOT independently audited — weakest GDPR posture among US competitors. DPA available for Enterprise. EU SCCs. Enterprise Pro minimum 50 seats for audit logs and data retention controls.",
    euResidency: "No — US-based processing. A significant limitation for EU regulated entities requiring data sovereignty.",
    deploymentModel: "cloud-only",
    sourceModel: "closed-source",
    industrySlugs: ["financial-services"],
    scores: {
      "eu-ai-act": "B-",
      gdpr: "B-",
    },
  },

  // ── DeepSeek ───────────────────────────────────────────
  {
    slug: "deepseek-ai",
    vendor: "DeepSeek",
    name: "DeepSeek R1 / V3",
    type: "Open-Weight Foundation Model",
    risk: "High",
    description:
      "Chinese AI lab producing highly capable open-weight language models (DeepSeek-V3, DeepSeek-R1) that rival frontier Western models at a fraction of the training cost. Models can be self-hosted, providing full data sovereignty. However, significant EU compliance concerns: Chinese entity, no EU presence, data sovereignty questions when using the hosted API, and potential regulatory restrictions under EU–China technology relations.",
    category: "Financial",
    featured: false,
    capabilityType: "generative-ai",
    vendorHq: "Hangzhou, China",
    euPresence:
      "No EU presence. No EU entity. No EU representative designated. Chinese company subject to Chinese data laws (including national security data access provisions). Self-hosted deployment recommended for EU compliance.",
    foundedYear: 2023,
    employeeCount: "200+ (estimated, limited public disclosure)",
    fundingStatus:
      "Private. Backed by High-Flyer Capital Management (Chinese quantitative hedge fund). Limited financial disclosure. Funded primarily from parent company profits.",
    marketPresence: "Emerging",
    customerCount: "Open-weight models: millions of downloads. API users: unknown. Enterprise customers: very few in EU.",
    notableCustomers:
      "Primarily used by developers and researchers via open-weight downloads. Limited enterprise adoption. Models hosted on Hugging Face, Together AI, and other inference platforms.",
    customerStories:
      "No enterprise customer stories published. Community adoption driven by model quality and open-weight availability.",
    useCases:
      "Self-hosted LLM deployment for data sovereignty\nResearch and development\nCode generation (DeepSeek-Coder)\nReasoning tasks (DeepSeek-R1)\nAcademic research\nCost-effective alternative to proprietary models\nLocal/edge AI deployment",
    dataStorage:
      "Self-hosted: full customer control over data storage. API (chat.deepseek.com): data processed and stored in China — subject to Chinese data laws. Critical distinction for EU users.",
    dataProcessing:
      "Self-hosted: all processing on customer infrastructure — full data sovereignty. API: processing in China. Chinese cybersecurity law requires data localization and potential government access.",
    trainingDataUse:
      "API: unclear data retention and training data policies. Self-hosted: no data leaves customer infrastructure. Model weights trained on public internet data — potential copyright and bias concerns.",
    subprocessors: "Self-hosted: none (customer manages infrastructure). API: Chinese cloud providers. No published subprocessor list.",
    dpaDetails: "No GDPR-compliant DPA available for API use. Self-hosted: customer manages own GDPR compliance. No EU representative designated as required by GDPR Article 27.",
    slaDetails: "API: no published SLA. Self-hosted: customer-managed. No enterprise support in EU.",
    dataPortability: "Open-weight models: fully portable (MIT/Apache license). API outputs: standard text format. Model weights downloadable.",
    exitTerms: "Open-weight: no lock-in — models downloadable and self-hostable. API: no contractual commitment needed.",
    ipTerms: "Model weights under MIT license (DeepSeek-V3) or model-specific license. User retains IP in outputs. Open-weight = maximum flexibility.",
    certifications: "No Western certifications (no SOC 2, no ISO 27001). Chinese cybersecurity compliance. Self-hosted: customer certifications apply.",
    encryptionInfo: "Self-hosted: customer-managed encryption. API: unknown encryption standards. No public security documentation.",
    accessControls: "Self-hosted: full customer control. API: basic API key management. No enterprise admin features.",
    modelDocs: "Technical papers published (DeepSeek-V3, R1). Model cards available. Open-weight allows full model inspection. Research transparency is high for model architecture.",
    explainability: "DeepSeek-R1 provides chain-of-thought reasoning (visible reasoning steps). Open-weight allows model inspection. Better transparency than closed-source competitors in some aspects.",
    biasTesting: "No public bias audit reports. Open-weight allows third-party bias testing. Training data composition not fully disclosed.",
    aiActStatus:
      "CRITICAL CONCERN: Chinese AI company with no EU presence. Under EU AI Act, providers placing AI systems on the EU market must comply with all requirements and designate an EU representative (Article 22). DeepSeek has not done this. Self-hosted deployment shifts compliance burden to the deployer (Article 25). Italy's Garante banned the API within 72 hours of launch. 13 EU jurisdictions opened investigations.",
    gdprStatus:
      "API use: EFFECTIVELY BANNED IN EU. Italy banned the API. 13 EU jurisdictions investigated. Germany's BSI confirmed classified metadata was transmitted to Shanghai servers. Privacy policy exempts training data from consent. No DPA, no EU representative (Art. 27 violation), data processed in China subject to Chinese PIPL government data access. Self-hosted: customer manages own GDPR compliance — model weights are GDPR-neutral.",
    euResidency:
      "API: No — data processed in China. Self-hosted: Yes — full EU data sovereignty if deployed on EU infrastructure. Self-hosting is the only compliant option for EU organizations.",
    deploymentModel: "hybrid",
    sourceModel: "open-weights",
    industrySlugs: ["financial-services", "telecommunications"],
    scores: {
      "eu-ai-act": "C",
      gdpr: "C-",
    },
  },
];

// ─── Seed Runner ───────────────────────────────────────────

async function main() {
  console.log("Enriching AI system profiles (Batch 4)...\n");

  for (const sys of systems) {
    const { industrySlugs, scores, ...data } = sys;

    // Upsert the system
    const system = await prisma.aISystem.upsert({
      where: { slug: data.slug },
      update: data,
      create: data,
    });

    // Connect industries
    if (industrySlugs?.length) {
      const industries = await prisma.industry.findMany({
        where: { slug: { in: industrySlugs } },
      });
      await prisma.aISystem.update({
        where: { id: system.id },
        data: {
          industries: {
            set: industries.map((i) => ({ id: i.id })),
          },
        },
      });
    }

    // Upsert framework scores
    if (scores) {
      for (const [frameworkSlug, score] of Object.entries(scores)) {
        const framework = await prisma.regulatoryFramework.findUnique({
          where: { slug: frameworkSlug },
        });
        if (framework) {
          await prisma.assessmentScore.upsert({
            where: {
              systemId_frameworkId: {
                systemId: system.id,
                frameworkId: framework.id,
              },
            },
            update: { score },
            create: {
              systemId: system.id,
              frameworkId: framework.id,
              score,
            },
          });
        }
      }
    }

    console.log(`  ✓ ${data.vendor} — ${data.name}`);
  }

  console.log(`\nDone — enriched ${systems.length} systems.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
