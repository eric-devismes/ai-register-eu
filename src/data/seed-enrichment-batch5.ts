/**
 * Content Enrichment — Batch 5: Remaining Priority 2 Systems
 *
 * Cohere, Adobe Firefly/Sensei, Zoom AI Companion, Atlassian Intelligence,
 * HubSpot AI, Zendesk AI, Freshworks Freddy AI, Monday.com AI
 *
 * Run with: npx tsx src/data/seed-enrichment-batch5.ts
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
  // ── Cohere ─────────────────────────────────────────────
  {
    slug: "cohere-enterprise",
    vendor: "Cohere",
    name: "Cohere Enterprise AI Platform",
    type: "Enterprise LLM Platform",
    risk: "Limited",
    description:
      "Enterprise-focused LLM provider offering Command (text generation), Embed (semantic search), and Rerank (result re-ranking) models. Key differentiator: deployable anywhere — cloud, on-premise, or air-gapped environments via partnerships with Oracle, AWS, Google Cloud, and private deployments. Strong multilingual capabilities (100+ languages). One of the few enterprise LLM providers offering true data sovereignty through flexible deployment. Founded by ex-Google Brain researchers including co-inventor of the Transformer architecture.",
    category: "Other",
    featured: false,
    capabilityType: "text-generation",
    vendorHq: "Toronto, Canada",
    euPresence:
      "No EU headquarters but strong EU deployment options. Models deployable on EU cloud infrastructure (AWS Frankfurt, Google Cloud EU, Oracle EU). Private deployment for full data sovereignty. Partners with EU cloud providers.",
    foundedYear: 2019,
    employeeCount: "500+",
    fundingStatus:
      "Private — raised $970M+ total. Series D: $500M (2024) at $5.5B valuation. Backed by Nvidia, Oracle, Salesforce Ventures, Inovia Capital.",
    marketPresence: "Challenger",
    customerCount: "1,000+ enterprise customers",
    notableCustomers:
      "Oracle (deep integration partner)\nMcKinsey & Company\nJasper AI (underlying LLM)\nLivePerson\nHyperscience\nFujitsu\nBCG\nADP",
    customerStories:
      "Oracle integrated Cohere models across its entire cloud stack. McKinsey uses Cohere for internal knowledge management across 30,000+ consultants. Fujitsu deploys Cohere in Japanese enterprise applications.",
    useCases:
      "Enterprise search and retrieval-augmented generation (RAG)\nDocument understanding and summarization\nCustomer support automation\nContent generation and copywriting\nMultilingual text processing\nCode generation and analysis\nData classification and labeling\nConversational AI for business applications",
    dataStorage:
      "Flexible deployment: SaaS (data processed in Cohere cloud), Virtual Private Cloud (VPC — customer's cloud account), on-premise, or air-gapped. SaaS data primarily in US/Canada. VPC and on-prem: data stays in customer-chosen location.",
    dataProcessing:
      "SaaS: API calls processed in Cohere's infrastructure. VPC deployment: models run inside customer's cloud account — data never leaves. On-prem: full air-gapped operation possible. CAVEAT: SaaS API logs retained for 30 days for abuse monitoring (can be reduced contractually).",
    trainingDataUse:
      "Customer data is NOT used for model training (contractual commitment). Enterprise API data not used for model improvement. Fine-tuned models are customer-specific and isolated. Clear data usage policy published.",
    subprocessors:
      "SaaS: AWS, Google Cloud (infrastructure). VPC/on-prem: no subprocessors — runs on customer infrastructure. Published subprocessor list for SaaS tier.",
    dpaDetails:
      "DPA available for enterprise customers. EU SCCs for international transfers. GDPR compliance documentation provided. Data residency guarantees available for VPC deployment.",
    slaDetails:
      "Enterprise SLA: 99.9% uptime for production API. Priority support with dedicated account team. Custom SLAs available for VPC deployments.",
    dataPortability:
      "Models available via standard API (OpenAI-compatible endpoints). Fine-tuned models exportable in some deployment modes. No vendor lock-in on data — customer data fully portable.",
    exitTerms:
      "Annual contracts standard. API-based integration means low switching costs. Fine-tuned model weights may have transfer restrictions depending on license. Data deletion on request.",
    ipTerms:
      "Customer retains all IP in generated outputs and fine-tuning data. Cohere retains IP in base models and platform.",
    certifications:
      "SOC 2 Type II. ISO 27001 (pending 2025). HIPAA BAA available. GDPR-compliant DPA. Annual third-party security audits.",
    encryptionInfo:
      "AES-256 at rest. TLS 1.2+ in transit. Customer-managed encryption keys for VPC deployments. Air-gapped deployment for maximum security.",
    accessControls:
      "API key management with granular permissions. SSO via SAML 2.0 for dashboard. Role-based access control. Audit logging. IP whitelisting available.",
    modelDocs:
      "Comprehensive model cards published for Command, Embed, and Rerank models. Technical documentation on model capabilities, limitations, and appropriate use cases. Benchmark results published.",
    explainability:
      "Rerank model provides relevance scores. Embed model provides similarity scores. RAG citations allow source verification. No deep XAI for generation models.",
    biasTesting:
      "Responsible AI principles published. Multilingual model tested across 100+ languages. Red-teaming conducted. No public bias audit reports.",
    aiActStatus:
      "General-purpose AI model provider — falls under GPAI provisions of EU AI Act. Likely subject to transparency obligations. Not yet classified as systemic risk (threshold: >10^25 FLOPs training compute). Active engagement with EU AI policy.",
    gdprStatus:
      "DPA available. VPC deployment enables full GDPR compliance with EU data residency. SaaS mode: data transfers to Canada/US covered by SCCs. Right to deletion supported.",
    euResidency:
      "Achievable via VPC deployment on EU cloud infrastructure (AWS Frankfurt, Google Cloud Belgium/Netherlands, Oracle Frankfurt). On-premise for full sovereignty. SaaS API: data processed outside EU.",
    deploymentModel: "hybrid",
    sourceModel: "closed-source",
    industrySlugs: ["financial-services", "telecommunications"],
    scores: {
      "eu-ai-act": "B",
      gdpr: "B+",
      dora: "B",
    },
  },

  // ── Adobe Firefly / Sensei ─────────────────────────────
  {
    slug: "adobe-firefly-sensei",
    vendor: "Adobe",
    name: "Adobe Firefly & Sensei AI",
    type: "Creative & Enterprise AI Platform",
    risk: "Limited",
    description:
      "Adobe's AI ecosystem: Firefly is a family of generative AI models for image generation, vector graphics, text effects, and video — trained exclusively on licensed Adobe Stock content, openly licensed content, and public domain material (no scraped web data). Sensei is the underlying AI/ML framework powering intelligent features across Creative Cloud, Experience Cloud, and Document Cloud. Key differentiator: commercially safe AI — trained only on properly licensed content, with IP indemnification for enterprise customers. Critical for creative teams needing legal certainty.",
    category: "Other",
    featured: false,
    capabilityType: "image-generation",
    vendorHq: "San Jose, California, USA",
    euPresence:
      "Strong EU presence. Major offices in London, Munich, Paris, Dublin, Bucharest, Stockholm. Adobe Experience Platform available with EU data residency (AWS Frankfurt). EMEA headquarters in London and Dublin. Long EU enterprise track record.",
    foundedYear: 1982,
    employeeCount: "30,000+",
    fundingStatus:
      "Public (NASDAQ: ADBE). Market cap ~$220B. Revenue ~$21B annually (FY2025). Highly profitable.",
    marketPresence: "Leader",
    customerCount: "300,000+ enterprise customers, 30M+ Creative Cloud subscribers",
    notableCustomers:
      "Unilever (creative production at scale)\nCoca-Cola (marketing content generation)\nPfizer (document intelligence)\nDeloitte (enterprise content management)\nT-Mobile (customer experience)\nIBM, Siemens, Mercedes-Benz, L'Oréal",
    customerStories:
      "Coca-Cola reduced creative production time by 60% using Firefly for campaign variations. Unilever uses Sensei for personalized marketing across 400+ brands. T-Mobile deployed Experience Cloud AI for real-time customer journey optimization.",
    useCases:
      "AI image generation (commercially safe, licensed training data)\nGenerative fill and extend in Photoshop\nText-to-image and text effects\nDocument intelligence and PDF automation\nMarketing personalization and content optimization\nCustomer journey analytics and prediction\nCreative asset management and tagging\nVideo editing assistance",
    dataStorage:
      "Adobe Experience Platform: EU data residency available (AWS Frankfurt). Creative Cloud: files stored in Adobe's cloud (US primary, EU available for enterprise). Document Cloud: EU data center option. Firefly: prompts and generations processed in Adobe's infrastructure.",
    dataProcessing:
      "Firefly models run in Adobe's cloud. Creative Cloud AI features process locally where possible (e.g., Neural Filters in Photoshop). Experience Cloud: real-time personalization processed in selected region. CAVEAT: Firefly generations are processed centrally — no EU-only processing guarantee for the generative AI models specifically.",
    trainingDataUse:
      "Firefly trained ONLY on Adobe Stock licensed content, openly licensed content, and public domain content — NOT on scraped web data or customer content. Customer content is NOT used for training. Content Credentials (C2PA) metadata attached to Firefly outputs for provenance tracking. This is a major differentiator for IP safety.",
    subprocessors:
      "AWS (primary cloud infrastructure). Microsoft Azure (select services). Published subprocessor list. Customer notification for changes.",
    dpaDetails:
      "Comprehensive DPA available. EU SCCs. BCRs (Binding Corporate Rules) approved by Irish DPC. GDPR compliance well-established (Adobe was early to adopt). Privacy Shield successor frameworks in place.",
    slaDetails:
      "Enterprise SLA: 99.9% uptime for Experience Cloud. Creative Cloud: 99.9% for business-critical services. Premium support available. Dedicated success manager for enterprise accounts.",
    dataPortability:
      "Creative files in standard formats (PSD, AI, PDF). Experience Cloud data exportable via APIs. Customer data fully portable. No lock-in on creative assets.",
    exitTerms:
      "Annual or multi-year enterprise agreements. Creative files portable in standard formats. Experience Cloud data export available. Reasonable termination terms.",
    ipTerms:
      "Customer retains full IP in all created content. Adobe provides IP indemnification for Firefly-generated content (commercial plan). Adobe retains IP in models and software. Content Credentials provide provenance tracking.",
    certifications:
      "SOC 2 Type II. ISO 27001. ISO 27018 (PII in cloud). FedRAMP (Moderate). HIPAA BAA (Document Cloud, Experience Cloud). PCI DSS (payment handling). CSA STAR. C5 (German BSI — for Experience Cloud). TISAX (automotive — Germany).",
    encryptionInfo:
      "AES-256 at rest. TLS 1.2+ in transit. Customer-managed keys available for Experience Platform. Adobe-managed key rotation.",
    accessControls:
      "SAML 2.0 SSO. SCIM provisioning. Role-based access control across all clouds. MFA. Admin Console with delegated administration. Audit logs. IP restrictions available.",
    modelDocs:
      "Firefly model cards published. Training data provenance documented (Adobe Stock + licensed content only). Content Credentials (C2PA) for AI-generated content transparency. Sensei model documentation available for Experience Cloud features.",
    explainability:
      "Content Credentials metadata shows AI involvement in creation. Experience Cloud provides decision explanations for personalization. Attribution AI shows contribution analysis. Limited deep XAI for creative AI features.",
    biasTesting:
      "Adobe AI Ethics committee active since 2018. Firefly tested for bias in image generation across demographics. Content authenticity initiative co-founded by Adobe. Regular responsible AI reviews.",
    aiActStatus:
      "Firefly image generation: limited risk (transparency obligations — met via Content Credentials). Experience Cloud personalization: minimal risk for most use cases. Adobe actively engaged in EU AI Act compliance — Content Credentials align well with AI Act transparency requirements.",
    gdprStatus:
      "Strong GDPR compliance — Adobe was early adopter. BCRs approved by Irish DPC. DPA available. Privacy by design documented. Data subject rights supported across all products. EU data residency available.",
    euResidency:
      "Experience Platform: EU data residency in Frankfurt. Creative Cloud enterprise: EU storage available. Document Cloud: EU option. CAVEAT: Firefly AI model inference may process outside EU — verify with Adobe for strict EU-only processing requirements.",
    deploymentModel: "cloud-only",
    sourceModel: "closed-source",
    industrySlugs: ["telecommunications", "manufacturing"],
    scores: {
      "eu-ai-act": "A-",
      gdpr: "A",
      dora: "B",
    },
  },

  // ── Zoom AI Companion ──────────────────────────────────
  {
    slug: "zoom-ai-companion",
    vendor: "Zoom",
    name: "Zoom AI Companion",
    type: "AI-Powered Meeting & Communication Intelligence",
    risk: "Limited",
    description:
      "AI assistant integrated across Zoom's platform — meeting summaries, smart recordings, email/chat message drafts, whiteboard ideation, and document creation. Uses a federated AI approach with multiple LLM providers (OpenAI, Anthropic, Meta) plus Zoom's own models. Included at no additional cost for paid Zoom plans. Key enterprise concern: federated model approach means data may be processed by multiple third-party AI providers unless enterprise controls are configured.",
    category: "Other",
    featured: false,
    capabilityType: "conversational-ai",
    vendorHq: "San Jose, California, USA",
    euPresence:
      "EU data center in Frankfurt (Germany) for meeting data. Amsterdam data center available. Zoom acquired Workvivo (Irish company) in 2023. Growing EU compliance posture. EU customer base includes major enterprises.",
    foundedYear: 2011,
    employeeCount: "8,000+",
    fundingStatus:
      "Public (NASDAQ: ZM). Market cap ~$25B. Revenue ~$4.6B annually (FY2025). Profitable.",
    marketPresence: "Leader",
    customerCount: "200,000+ enterprise customers",
    notableCustomers:
      "Deutsche Bank\nBNP Paribas\nRakuten\nToyota\nNASDAQ\nCapgemini\nWWF\nDelta Air Lines",
    customerStories:
      "Deutsche Bank deployed Zoom with EU data residency for 90,000+ employees. BNP Paribas uses Zoom Workplace with AI Companion for hybrid work. Capgemini uses Zoom across 350,000+ consultants globally.",
    useCases:
      "Meeting summarization and action item extraction\nSmart recording with chaptered highlights\nEmail and chat message drafting\nWhiteboard content generation and ideation\nDocument creation from meeting content\nReal-time meeting translation (32+ languages)\nScheduling and preparation assistance\nPost-meeting follow-up automation",
    dataStorage:
      "EU data residency available — Frankfurt and Amsterdam data centers. Customer selects data region. Meeting recordings stored in selected region. AI Companion data processing location depends on configuration. IMPORTANT: default AI processing may route to US — EU customers must explicitly configure EU data residency.",
    dataProcessing:
      "Federated AI approach: Zoom uses multiple AI providers (OpenAI, Anthropic, Meta's Llama) plus proprietary models. Meeting content processed by these providers for AI features. CAVEAT: federated approach means customer data flows to multiple third-party AI providers — enterprise admins should verify which providers are active and where they process data.",
    trainingDataUse:
      "Zoom updated ToS (Aug 2023, after controversy): customer audio, video, and chat content is NOT used for training AI models without explicit consent. AI Companion features use content only for the requested function (e.g., summary) and discard afterward. Enterprise customers have contractual guarantees.",
    subprocessors:
      "AWS (infrastructure). Oracle Cloud (infrastructure). OpenAI, Anthropic, Meta (AI model providers). Published subprocessor list. Customer notification for changes.",
    dpaDetails:
      "DPA available. EU SCCs for international transfers. GDPR compliance documented. Data residency agreements available. Privacy by design commitments.",
    slaDetails:
      "Enterprise SLA: 99.999% uptime commitment. Priority support for enterprise. Dedicated customer success. SLA credits for downtime.",
    dataPortability:
      "Meeting recordings downloadable in standard formats (MP4). Chat logs exportable. AI summaries downloadable as text. Admin data export via APIs. No lock-in on content.",
    exitTerms:
      "Annual or multi-year contracts. Content export available. Data deletion upon termination. Meeting recordings and transcripts portable.",
    ipTerms:
      "Customer retains all IP in meeting content, recordings, and transcripts. AI-generated summaries belong to customer. Zoom retains IP in platform and AI technology.",
    certifications:
      "SOC 2 Type II. ISO 27001. ISO 27017. ISO 27018. ISO 27701 (privacy). C5 (German BSI — achieved 2024). HIPAA BAA available. FedRAMP (Moderate for Zoom for Government). Common Criteria (EAL2+). TÜV Rheinland certified.",
    encryptionInfo:
      "AES-256 GCM encryption at rest. TLS 1.2+ in transit. End-to-end encryption (E2EE) available for meetings (optional — disables some AI features). Customer-managed keys available for enterprise (BYOK).",
    accessControls:
      "SAML 2.0 SSO. SCIM provisioning. Admin-controlled AI features (can disable AI Companion per user/group). MFA. Role-based admin controls. Granular meeting security settings. Audit logs and compliance archiving.",
    modelDocs:
      "AI Companion documentation published. Federated model approach described at high level. Specific model providers disclosed. Limited transparency on which model handles which task. No model cards published.",
    explainability:
      "Meeting summaries include timestamps linked to source content. Action items attributed to speakers. No deep explainability for AI drafting or ideation features.",
    biasTesting:
      "Responsible AI principles published. AI ethics advisory board established. Speech recognition tested across accents and languages. No public bias audit results for AI Companion specifically.",
    aiActStatus:
      "Meeting summarization: limited risk (transparency obligations). Real-time translation: limited risk. Admin controls to disable AI features support compliance. Zoom is engaging with EU AI Act requirements.",
    gdprStatus:
      "DPA available. EU data residency. Updated ToS after 2023 controversy — no training on customer data without consent. Right to deletion supported. DPIA guidance available.",
    euResidency:
      "EU data residency available (Frankfurt, Amsterdam). C5 certified. CAVEAT: AI Companion uses federated models (OpenAI, Anthropic, Meta) — verify that AI processing stays within EU. Default may route to US for AI inference. Enterprise customers should explicitly configure EU-only AI processing.",
    deploymentModel: "cloud-only",
    sourceModel: "closed-source",
    industrySlugs: ["financial-services", "telecommunications", "public-sector"],
    scores: {
      "eu-ai-act": "B",
      gdpr: "B+",
      dora: "B-",
    },
  },

  // ── Atlassian Intelligence ─────────────────────────────
  {
    slug: "atlassian-intelligence",
    vendor: "Atlassian",
    name: "Atlassian Intelligence",
    type: "AI-Powered Work Management & Collaboration",
    risk: "Minimal",
    description:
      "AI capabilities embedded across Atlassian's product suite — Jira (project management), Confluence (knowledge management), Bitbucket (code), and Jira Service Management (ITSM). Features include natural language to JQL conversion, issue summarization, Confluence page drafting, smart search, and virtual service agent. Uses OpenAI models with Atlassian's teamwork knowledge graph as context. Included in Premium and Enterprise plans at no additional cost.",
    category: "Other",
    featured: false,
    capabilityType: "conversational-ai",
    vendorHq: "Sydney, Australia",
    euPresence:
      "Strong EU presence. EU data residency available (Frankfurt, Dublin). Major offices in Amsterdam, Gdańsk, Munich, Bengaluru. Atlassian Cloud migrated to AWS with EU region options. European customer base includes major enterprises.",
    foundedYear: 2002,
    employeeCount: "12,000+",
    fundingStatus:
      "Public (NASDAQ: TEAM). Market cap ~$50B. Revenue ~$4.4B annually (FY2025). Profitable.",
    marketPresence: "Leader",
    customerCount: "300,000+ customers globally",
    notableCustomers:
      "BMW\nDeutsche Bahn\nSiemens\nDomino's\nNASA\nRedfin\nSamsung\nAudi\nLufthansa\nSpotify",
    customerStories:
      "BMW uses Jira and Confluence across 30,000+ engineers for automotive software development. Spotify manages product development for 600M+ users on Jira. Lufthansa digitized IT operations using Jira Service Management.",
    useCases:
      "Natural language search across Jira issues and Confluence pages\nAI-powered issue summarization and prioritization\nConfluence page drafting and content generation\nNatural language to JQL query conversion\nVirtual service agent for IT support (Jira Service Management)\nSmart definitions and term explanations from company knowledge\nCode review summaries (Bitbucket)\nAutomation rule suggestions",
    dataStorage:
      "Atlassian Cloud: EU data residency available — data stored in Frankfurt (AWS eu-central-1) or Dublin (AWS eu-west-1). Customer selects data residency realm at organization creation. Data residency applies to primary product data.",
    dataProcessing:
      "AI features use OpenAI models. Atlassian Intelligence sends context (issue descriptions, page content) to OpenAI for processing. Atlassian's trust layer filters sensitive data before sending to OpenAI. CAVEAT: AI processing via OpenAI may occur outside EU data residency realm — Atlassian states OpenAI does not retain or train on data, but processing location is not EU-guaranteed.",
    trainingDataUse:
      "Customer data is NOT used for training AI models. OpenAI contractually prohibited from using Atlassian customer data for training. AI inputs/outputs not retained by OpenAI beyond the request. Atlassian does not use customer data to improve its AI features without consent.",
    subprocessors:
      "AWS (primary infrastructure). OpenAI (AI model inference). Published subprocessor list. Customer notification for changes (30 days advance notice).",
    dpaDetails:
      "DPA available. EU SCCs for international transfers. GDPR compliance well-documented. Data residency agreements. Privacy-by-design principles published.",
    slaDetails:
      "Enterprise SLA: 99.9% uptime for Premium/Enterprise plans. Priority support with 1-hour response for critical issues (Premium Support). Dedicated Technical Account Manager for Enterprise.",
    dataPortability:
      "Full data export via Site Export (JSON format). REST APIs for programmatic data access. Jira and Confluence content portable in standard formats. Forge apps run on Atlassian's infrastructure.",
    exitTerms:
      "Monthly or annual billing. Data export via Site Export or API. Data deletion within 30 days of contract termination. Transition assistance available.",
    ipTerms:
      "Customer retains all IP in content created in Jira, Confluence, and other products. AI-generated content belongs to customer. Atlassian retains IP in platform and AI technology.",
    certifications:
      "SOC 2 Type II. SOC 3. ISO 27001. ISO 27018. ISO 27701 (privacy). CSA STAR Level 2. VPAT/WCAG 2.1 AA (accessibility). FedRAMP (Moderate — for Government tier). PCI DSS.",
    encryptionInfo:
      "AES-256 at rest. TLS 1.2+ in transit. Customer-managed encryption keys (CMEK) available for Enterprise plan. Atlassian manages key rotation.",
    accessControls:
      "SAML 2.0 SSO. SCIM provisioning. Organization-level admin controls. AI features can be enabled/disabled per product and per user group. MFA. IP allowlisting. Audit logs (Atlassian Access). Mobile app management.",
    modelDocs:
      "Atlassian Intelligence documentation published. OpenAI partnership disclosed. Trust layer architecture documented. Limited model-level transparency (defers to OpenAI). AI principles published.",
    explainability:
      "JQL suggestions show generated query for user review. Confluence AI shows draft with tracked changes. Issue summaries based on visible issue data. Limited deep explainability.",
    biasTesting:
      "Responsible technology principles published. AI features tested across languages and use cases. No public bias audit reports. Atlassian AI ethics team active.",
    aiActStatus:
      "Work management AI: minimal risk for most features. Virtual service agent: limited risk (transparency obligations met — bot clearly labeled). Content generation: limited risk. Atlassian tracking EU AI Act requirements.",
    gdprStatus:
      "DPA available. EU data residency (Frankfurt/Dublin). GDPR compliance documented. Right to deletion supported. DPIA resources available. Data Processing Addendum standard for all cloud customers.",
    euResidency:
      "Product data: EU residency in Frankfurt or Dublin. CAVEAT: AI features use OpenAI — processing may occur outside EU. Atlassian states OpenAI does not retain data, but real-time processing location not EU-guaranteed. Enterprise customers should evaluate AI data flow.",
    deploymentModel: "cloud-only",
    sourceModel: "closed-source",
    industrySlugs: ["financial-services", "telecommunications", "manufacturing"],
    scores: {
      "eu-ai-act": "B+",
      gdpr: "A-",
      dora: "B",
    },
  },

  // ── HubSpot AI ─────────────────────────────────────────
  {
    slug: "hubspot-ai",
    vendor: "HubSpot",
    name: "HubSpot AI",
    type: "AI-Powered CRM & Marketing Platform",
    risk: "Minimal",
    description:
      "AI features embedded across HubSpot's CRM platform — Marketing Hub (content generation, SEO), Sales Hub (email drafting, call summaries, deal forecasting), Service Hub (chatbot, ticket routing), and Content Hub (AI website builder). Uses a mix of OpenAI models and HubSpot-trained models. Breeze AI is the branded AI layer including Copilot (assistant), Agents (automation), and Intelligence (enrichment). Popular with SMBs and mid-market, growing into enterprise. Strong content marketing DNA.",
    category: "Other",
    featured: false,
    capabilityType: "conversational-ai",
    vendorHq: "Cambridge, Massachusetts, USA",
    euPresence:
      "EU data hosting available (Frankfurt, Germany via AWS). European offices in Dublin, London, Paris, Berlin, Ghent. Growing EU enterprise customer base. GDPR tools built into platform since 2018.",
    foundedYear: 2006,
    employeeCount: "8,000+",
    fundingStatus:
      "Public (NYSE: HUBS). Market cap ~$30B. Revenue ~$2.6B annually (FY2025). Profitable.",
    marketPresence: "Leader",
    customerCount: "228,000+ customers in 135+ countries",
    notableCustomers:
      "Trello (marketing automation)\nClassPass\nWWF\nSurveyMonkey\nDoordash\nEventbrite\nCasio Europe\nSuzuki",
    customerStories:
      "Casio Europe consolidated marketing and sales across 14 EU markets using HubSpot. WWF manages global donor engagement with HubSpot CRM. Eventbrite uses HubSpot for lifecycle marketing to 1M+ event creators.",
    useCases:
      "Marketing email and blog content generation\nSEO content strategy and topic suggestions\nSales email drafting and follow-up automation\nCall transcription and summarization\nDeal forecasting and pipeline analytics\nChatbot for customer support and lead qualification\nSocial media caption generation\nWebsite content creation (Content Hub AI)\nLead scoring and enrichment (Breeze Intelligence)",
    dataStorage:
      "EU data hosting available — Frankfurt (Germany) via AWS. US East (Virginia) default. Customer chooses region during portal setup. Product data stored in selected region. GDPR compliance tools built into platform.",
    dataProcessing:
      "AI features use OpenAI models and HubSpot-trained models. AI processing occurs in HubSpot's infrastructure. CAVEAT: AI feature processing location may differ from data hosting region — HubSpot states data sent to AI models is not retained for training, but processing location not explicitly EU-guaranteed.",
    trainingDataUse:
      "Customer data not used for training OpenAI models (contractual agreement). HubSpot may use anonymized/aggregated data to improve its own models. Customers can opt out of data improvement programs. AI-generated content belongs to customer.",
    subprocessors:
      "AWS (primary infrastructure). Google Cloud (select services). OpenAI (AI model inference). Published subprocessor list. Email notification for changes.",
    dpaDetails:
      "DPA available and automatically included for all customers. EU SCCs. GDPR compliance documented extensively. Data processing agreement covers all AI features.",
    slaDetails:
      "Enterprise SLA: 99.99% uptime commitment. Premium support available. Dedicated customer success manager for Enterprise. SLA credits for downtime.",
    dataPortability:
      "Full data export via CRM export tools. REST API access to all data. Integration marketplace (1,500+ apps). Standard data formats (CSV, JSON). No vendor lock-in on CRM data.",
    exitTerms:
      "Monthly or annual contracts. Data export available at any time via export tools and API. Data deletion within 90 days of contract termination.",
    ipTerms:
      "Customer retains all IP in CRM data and content. AI-generated content belongs to customer. HubSpot retains IP in platform and AI models.",
    certifications:
      "SOC 2 Type II. SOC 3. ISO 27001. ISO 27701 (privacy). CSA STAR Level 2. GDPR-specific compliance documentation. Annual third-party penetration testing.",
    encryptionInfo:
      "AES-256 at rest. TLS 1.2+ in transit. Field-level encryption for sensitive data. HubSpot manages encryption keys (no customer-managed keys currently).",
    accessControls:
      "SAML 2.0 SSO (Enterprise). MFA. Role-based permissions with granular field-level access. IP restrictions. Audit logs. Partitioning by team. SCIM provisioning (Enterprise).",
    modelDocs:
      "Breeze AI documentation published. AI feature descriptions for each Hub. Limited model-level transparency. AI principles and responsible AI commitments published.",
    explainability:
      "Deal forecasting shows contributing factors. Lead scoring shows scoring criteria. AI content generation shows prompts used. Limited deep XAI.",
    biasTesting:
      "AI ethics principles published. Limited public information on bias testing. Content generation tested for appropriateness. No public bias audit reports.",
    aiActStatus:
      "CRM AI features: minimal risk. Content generation: limited risk (transparency via labeling). Lead scoring: minimal risk (human oversight maintained). AI chatbot: limited risk. HubSpot monitoring EU AI Act developments.",
    gdprStatus:
      "Strong GDPR compliance — built GDPR tools into platform early (2018). DPA automatic for all customers. EU data hosting in Frankfurt. Consent management, right to deletion, data portability all supported natively. Cookie management built in.",
    euResidency:
      "EU data hosting available (Frankfurt). Product data stays in EU. CAVEAT: AI processing via OpenAI may occur outside EU region. HubSpot working on EU-contained AI processing but not fully guaranteed yet.",
    deploymentModel: "cloud-only",
    sourceModel: "closed-source",
    industrySlugs: ["telecommunications"],
    scores: {
      "eu-ai-act": "B+",
      gdpr: "A-",
    },
  },

  // ── Zendesk AI ─────────────────────────────────────────
  {
    slug: "zendesk-ai",
    vendor: "Zendesk",
    name: "Zendesk AI",
    type: "AI-Powered Customer Service Platform",
    risk: "Limited",
    description:
      "AI capabilities integrated into Zendesk's customer service platform — AI agents (autonomous bots), agent copilot (real-time assistance), intelligent triage (auto-categorize, prioritize, route tickets), and generative AI for responses. Uses purpose-built CX AI models trained on Zendesk's dataset of 18B+ customer service interactions. Advanced AI add-on available for $50/agent/month. Key strength: pre-trained on real customer service data across industries, so works out of the box without training.",
    category: "Other",
    featured: false,
    capabilityType: "conversational-ai",
    vendorHq: "San Francisco, USA (subsidiary of Zendesk Inc., private since 2022)",
    euPresence:
      "EU data center in Frankfurt (Germany). Dublin office. Multiple EU enterprise customers. EU data locality available for account data. Strong GDPR compliance posture.",
    foundedYear: 2007,
    employeeCount: "6,000+",
    fundingStatus:
      "Private since November 2022 — acquired by consortium led by Hellman & Friedman and Permira for $10.2B. Previously NASDAQ-listed.",
    marketPresence: "Leader",
    customerCount: "100,000+ customers globally",
    notableCustomers:
      "Siemens\nShopify\nGroup PSA (Stellantis)\nRevolut\nTUI Group\nN26\nBolt\nGlovo\nWise\nFreeNow",
    customerStories:
      "Siemens handles 30,000+ monthly support tickets using Zendesk AI triage. Revolut automates 70%+ of customer queries with Zendesk AI agents. TUI Group manages travel support across 20+ EU markets on Zendesk.",
    useCases:
      "AI agents for automated customer resolution\nAgent copilot for real-time response suggestions\nIntelligent triage (auto-categorize, prioritize, route)\nGenerative AI for response drafting\nKnowledge base article generation\nSentiment analysis on customer interactions\nWorkflow automation\nQuality assurance and agent performance analytics",
    dataStorage:
      "EU data center available (Frankfurt, AWS eu-central-1). US data center (AWS us-east). Customer selects region during setup. EU data locality ensures account data stays in EU. Service data stored in selected region.",
    dataProcessing:
      "Zendesk AI models: purpose-built CX models hosted by Zendesk — processing in selected region. Generative AI features: use OpenAI models (processing location not guaranteed EU). CAVEAT: generative AI add-on may process data outside EU even if account data is EU-hosted. Zendesk working on EU-local generative AI processing.",
    trainingDataUse:
      "Zendesk's base CX models trained on aggregate, anonymized service interaction data from across the Zendesk platform (18B+ interactions). Customer data used for model improvement only with customer consent (Advanced Data Privacy add-on available to opt out). Generative AI: OpenAI does not train on Zendesk data per contract.",
    subprocessors:
      "AWS (primary infrastructure). OpenAI (generative AI features). GoodData (analytics). Published subprocessor list. 30-day advance notice for changes.",
    dpaDetails:
      "DPA available. EU SCCs. GDPR compliance well-documented. Advanced Data Privacy and Protection add-on for enhanced controls. Data processing agreement standard for all customers.",
    slaDetails:
      "Enterprise SLA: 99.9% uptime. Priority support with 1-hour response (Premier plan). Dedicated account team for enterprise. SLA credits for downtime.",
    dataPortability:
      "Full data export via JSON/CSV. REST API access. Integration marketplace (1,500+ apps). Customer data fully portable. Ticket history exportable.",
    exitTerms:
      "Annual or multi-year contracts. Full data export available. Data deletion within 60 days of termination. Transition assistance for enterprise customers.",
    ipTerms:
      "Customer retains all IP in support content and customer data. AI-generated responses belong to customer. Zendesk retains IP in models and platform.",
    certifications:
      "SOC 2 Type II. ISO 27001. ISO 27018. ISO 27701 (privacy). HIPAA BAA available. FedRAMP (Moderate). PCI DSS Level 1. CSA STAR. C5 (German BSI). HDS (French Health Data Hosting).",
    encryptionInfo:
      "AES-256 at rest. TLS 1.2+ in transit. Customer-managed encryption keys (CMEK) available. Advanced encryption options in data protection add-on.",
    accessControls:
      "SAML 2.0 SSO. SCIM provisioning. Role-based access control with custom roles. MFA. IP restrictions. Audit logs. Agent workspace permissions. Sandbox environments for testing.",
    modelDocs:
      "AI documentation published covering triage, agents, and copilot. CX-specific model approach described. Limited transparency on underlying model architecture. Zendesk AI principles published.",
    explainability:
      "Triage shows predicted intent, sentiment, and language with confidence scores. Agent copilot shows reasoning behind suggestions. AI agent shows matched knowledge articles. Good operational transparency for CX use case.",
    biasTesting:
      "CX models tested across industries and languages. Sentiment analysis validated across demographics. No public bias audit reports. Responsible AI principles documented.",
    aiActStatus:
      "Customer service AI: limited risk (transparency obligations — bots clearly labeled). Triage and routing: minimal risk (human oversight maintained). Generative AI responses: limited risk. Zendesk aligned with EU AI Act transparency requirements.",
    gdprStatus:
      "Strong GDPR compliance. DPA standard. EU data center. Advanced Data Privacy add-on for enhanced controls. Right to deletion, data portability, consent management supported. EU representative appointed.",
    euResidency:
      "EU data locality available (Frankfurt). Account and service data in EU. CAVEAT: generative AI features (OpenAI) may process outside EU. Purpose-built CX models more likely to stay in-region. Verify generative AI processing location.",
    deploymentModel: "cloud-only",
    sourceModel: "closed-source",
    industrySlugs: ["financial-services", "telecommunications"],
    scores: {
      "eu-ai-act": "B+",
      gdpr: "A-",
      dora: "B",
    },
  },

  // ── Freshworks Freddy AI ───────────────────────────────
  {
    slug: "freshworks-freddy-ai",
    vendor: "Freshworks",
    name: "Freshworks Freddy AI",
    type: "AI-Powered Customer & Employee Service",
    risk: "Limited",
    description:
      "AI capabilities across Freshworks' suite — Freshdesk (customer support), Freshsales (CRM), Freshservice (ITSM), and Freshchat (messaging). Freddy AI offers three layers: Self Service (AI agents for customers), Copilot (agent assistance), and Insights (analytics). Uses a combination of proprietary models and Azure OpenAI. Key positioning: affordable alternative to Salesforce/Zendesk for mid-market companies. Freddy AI Copilot available on Pro and Enterprise plans.",
    category: "Other",
    featured: false,
    capabilityType: "conversational-ai",
    vendorHq: "San Mateo, California, USA (founded in Chennai, India)",
    euPresence:
      "EU data center in Frankfurt (Germany). Berlin office. Growing EU customer base, particularly in mid-market. EU data residency available for all products.",
    foundedYear: 2010,
    employeeCount: "5,500+",
    fundingStatus:
      "Public (NASDAQ: FRSH). Market cap ~$6B. Revenue ~$720M annually (FY2025). Approaching profitability.",
    marketPresence: "Challenger",
    customerCount: "68,000+ customers globally",
    notableCustomers:
      "Bridgestone (EU operations)\nPhilips\nHeineken\nDAF Trucks\nSolvay\nDecathlon\nMedia Markt\nKLM Royal Dutch Airlines",
    customerStories:
      "Philips uses Freshservice for IT service management across EU operations. Heineken deployed Freshdesk for customer support across multiple EU markets. Decathlon uses Freddy AI bots for multilingual customer service.",
    useCases:
      "AI-powered customer support chatbots\nTicket auto-categorization and routing\nAgent assist with suggested responses\nSales lead scoring and deal insights\nIT service management automation\nKnowledge base article suggestions\nCustomer sentiment analysis\nWorkflow automation with AI triggers",
    dataStorage:
      "EU data center in Frankfurt (AWS eu-central-1). US, India, and Australia data centers also available. Customer selects region during account setup. Data stored in selected region.",
    dataProcessing:
      "Freddy AI uses Azure OpenAI (Microsoft-hosted) and Freshworks' proprietary models. Azure OpenAI processes in Azure's infrastructure with zero data retention policy. CAVEAT: Azure OpenAI region may differ from Freshworks' data hosting region — verify EU-only AI processing for strict residency requirements.",
    trainingDataUse:
      "Customer data not used for training AI models (Azure OpenAI zero data retention). Freshworks does not use individual customer data for model training without consent. Aggregated, anonymized data may be used for product improvement.",
    subprocessors:
      "AWS (primary infrastructure). Microsoft Azure (Azure OpenAI for AI features). Published subprocessor list. Customer notification for changes.",
    dpaDetails:
      "DPA available. EU SCCs for international transfers. GDPR compliance documented. Standard data processing terms included in enterprise contracts.",
    slaDetails:
      "Enterprise SLA: 99.9% uptime. Priority support with 4-hour response (Enterprise). Business hours support for lower tiers. SLA credits available.",
    dataPortability:
      "Data export via CSV/JSON. REST APIs for all products. Marketplace integrations (1,000+). Customer data portable in standard formats.",
    exitTerms:
      "Monthly or annual contracts. Data export available via tools and API. Data deletion within 30 days of termination. No excessive exit fees.",
    ipTerms:
      "Customer retains all IP in content and data. AI-generated responses belong to customer. Freshworks retains IP in platform and AI technology.",
    certifications:
      "SOC 2 Type II. ISO 27001. ISO 27017. ISO 27018. HIPAA BAA available. GDPR-compliant DPA. CSA STAR. Annual penetration testing.",
    encryptionInfo:
      "AES-256 at rest. TLS 1.2+ in transit. Field-level encryption for sensitive data. Freshworks manages encryption keys.",
    accessControls:
      "SAML 2.0 SSO. SCIM provisioning (Enterprise). Role-based access control. MFA. IP whitelisting. Audit logs. Agent-level permissions.",
    modelDocs:
      "Freddy AI documentation available. AI feature descriptions per product. Limited model-level transparency. Responsible AI principles published.",
    explainability:
      "Ticket categorization shows confidence scores. Lead scoring shows contributing factors. AI suggestions show source knowledge articles. Limited deep XAI.",
    biasTesting:
      "Responsible AI commitments published. Limited public information on bias testing. AI features tested across languages. No public bias audit reports.",
    aiActStatus:
      "Customer service AI: limited risk (transparency obligations — bots labeled). Ticket routing and scoring: minimal risk. Generative AI responses: limited risk. Freshworks tracking EU AI Act requirements.",
    gdprStatus:
      "DPA available. EU data center (Frankfurt). GDPR compliance documented. Right to deletion supported. Data portability tools available. Consent management features in CRM.",
    euResidency:
      "EU data hosting in Frankfurt. Product data in EU. CAVEAT: Freddy AI uses Azure OpenAI — processing may occur outside EU depending on Azure region configuration. Verify AI processing location.",
    deploymentModel: "cloud-only",
    sourceModel: "closed-source",
    industrySlugs: ["telecommunications"],
    scores: {
      "eu-ai-act": "B",
      gdpr: "B+",
    },
  },

  // ── Monday.com AI ──────────────────────────────────────
  {
    slug: "monday-ai",
    vendor: "monday.com",
    name: "monday AI",
    type: "AI-Powered Work Management Platform",
    risk: "Minimal",
    description:
      "AI capabilities integrated into monday.com's work operating system — AI assistant for task creation, formula generation, text composition, email drafting, and workflow automation. Also offers AI blocks in monday WorkForms and dashboards. Uses OpenAI models. Positioned as work management for teams (project management, CRM, dev, marketing). AI features available on Pro plan and above. Growing rapidly in EU mid-market and enterprise.",
    category: "Other",
    featured: false,
    capabilityType: "conversational-ai",
    vendorHq: "Tel Aviv, Israel",
    euPresence:
      "EU data residency available (Frankfurt, Germany). London office. Growing EU enterprise customer base. GDPR compliance tooling built into platform. Listed on NASDAQ and Tel Aviv Stock Exchange.",
    foundedYear: 2012,
    employeeCount: "2,200+",
    fundingStatus:
      "Public (NASDAQ: MNDY). Market cap ~$14B. Revenue ~$1B annually (2025). Profitable.",
    marketPresence: "Challenger",
    customerCount: "225,000+ customers globally",
    notableCustomers:
      "Canva\nOscar Health\nNHSBT (UK National Health Service Blood and Transplant)\nHolt Cat\nUber\nCoca-Cola\nUnilever\nCarrefour\nPhilips",
    customerStories:
      "Carrefour uses monday.com for project management across EU retail operations. Philips manages cross-functional programs on monday.com. Unilever coordinates marketing campaigns across brands.",
    useCases:
      "AI task generation from natural language descriptions\nFormula builder (natural language to column formulas)\nEmail composition and summarization\nProject status summarization\nText generation for updates and documentation\nWorkflow automation suggestions\nData analysis and dashboard insights\nWork form creation with AI assistance",
    dataStorage:
      "EU data residency available (Frankfurt, AWS eu-central-1). US (Virginia) default. Customer can request EU data residency during setup. Multi-region available for Enterprise. All customer data stored in selected region.",
    dataProcessing:
      "AI features use OpenAI models via API. Data sent to OpenAI for AI processing. monday.com states OpenAI does not retain data beyond the request. CAVEAT: AI processing via OpenAI occurs outside EU data center — even if data is hosted in EU, AI feature usage sends data to OpenAI's infrastructure.",
    trainingDataUse:
      "Customer data NOT used for training AI models. OpenAI contractually prohibited from training on monday.com customer data. AI inputs/outputs not retained by OpenAI. monday.com does not use customer data to improve AI features without consent.",
    subprocessors:
      "AWS (primary infrastructure). OpenAI (AI features). Google Cloud (select analytics). Published subprocessor list. Customer notification for changes.",
    dpaDetails:
      "DPA available. EU SCCs for international transfers. GDPR compliance documented. Privacy-by-design approach. Standard data processing terms.",
    slaDetails:
      "Enterprise SLA: 99.9% uptime. Priority support for Enterprise. Dedicated success manager. SLA credits available.",
    dataPortability:
      "Data export via Excel/CSV. REST API and GraphQL API for data access. Integration marketplace (200+ apps). Board data fully portable.",
    exitTerms:
      "Monthly or annual contracts. Full data export available. Data deletion within 30 days of contract termination. No excessive exit barriers.",
    ipTerms:
      "Customer retains all IP in work data and content. AI-generated content belongs to customer. monday.com retains IP in platform and AI features.",
    certifications:
      "SOC 2 Type II. SOC 3. ISO 27001. ISO 27018. ISO 27701 (privacy). HIPAA BAA available. GDPR-compliant DPA. CSA STAR Level 2.",
    encryptionInfo:
      "AES-256 at rest. TLS 1.2+ in transit. monday.com manages encryption. No customer-managed keys currently.",
    accessControls:
      "SAML 2.0 SSO. SCIM provisioning. Role-based access with board/workspace permissions. MFA. IP restrictions (Enterprise). Audit log. Session management. Guest access controls.",
    modelDocs:
      "AI assistant documentation published. OpenAI usage disclosed. Limited model-level transparency. AI terms of service published.",
    explainability:
      "Formula builder shows generated formula for user review. Task suggestions show context. Limited deep explainability. User can review and edit all AI-generated content before applying.",
    biasTesting:
      "Responsible AI principles referenced in terms. Limited public information on bias testing. No public bias audit reports.",
    aiActStatus:
      "Work management AI: minimal risk. Content generation: limited risk (human review maintained). Formula generation: minimal risk. No high-risk use cases in standard product.",
    gdprStatus:
      "DPA available. EU data residency (Frankfurt). GDPR compliance documented. Right to deletion supported. Data portability tools available. Cookie management built in.",
    euResidency:
      "EU data hosting available (Frankfurt). Board and workspace data in EU. CAVEAT: AI features use OpenAI — processing occurs outside EU data center. monday.com working on EU-local AI processing. For strict EU data residency, AI features may need to be disabled.",
    deploymentModel: "cloud-only",
    sourceModel: "closed-source",
    industrySlugs: ["telecommunications", "manufacturing"],
    scores: {
      "eu-ai-act": "B",
      gdpr: "B+",
    },
  },
];

// ─── Seed Runner ───────────────────────────────────────────

async function main() {
  console.log("Enriching AI system profiles (Batch 5)...\n");

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
