/**
 * New AI Systems — Batch 1 (8 new systems not previously in database)
 *
 * Cohere, Adobe Firefly, Zoom AI Companion, Atlassian Intelligence,
 * Zendesk AI, HubSpot Breeze, Freshworks Freddy, Monday.com AI
 *
 * Run with: npx tsx src/data/seed-new-systems-batch1.ts
 * Safe to run multiple times (uses upsert on slug).
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const systems = [
  // 1. Cohere
  {
    slug: "cohere-enterprise",
    vendor: "Cohere",
    name: "Cohere Enterprise (Command R+)",
    type: "Enterprise LLM / RAG Platform",
    risk: "High",
    description:
      "Enterprise-focused LLM optimized for RAG and enterprise search. Only major LLM vendor offering full private/on-prem/air-gapped deployment with EU sovereign cloud option (SAP-Cohere EU AI Cloud, Nov 2025). ~85% of revenue from private deployments. $240M ARR growing 287% YoY. ISO 42001 certified. Models (Command R+, Embed, Rerank) purpose-built for retrieval-augmented generation — not general consumer chatbot. Smaller ecosystem than OpenAI/Anthropic but stronger enterprise deployment flexibility.",
    category: "Financial",
    featured: false,
    capabilityType: "search-retrieval",
    vendorHq: "Toronto, Canada",
    euPresence:
      "Yes — SAP-Cohere EU AI Cloud launched Nov 2025 for sovereign model deployment within EU borders. Full EU data residency via private deployment.",
    foundedYear: 2019,
    employeeCount: "814+",
    fundingStatus:
      "Private — ~$240M ARR (2025, +287% YoY). Raised $500M+ total. Investors include NVIDIA, Oracle, Salesforce Ventures.",
    marketPresence: "Challenger",
    customerCount: "Not publicly disclosed",
    notableCustomers:
      "SAP (strategic EU AI Cloud partnership)\nOracle (integration partner)\nEnterprise deployments across financial services and government (names typically under NDA)",
    customerStories:
      "SAP-Cohere EU AI Cloud launched Nov 2025 enabling sovereign model deployment in EU. ~85% of revenue comes from private/on-prem deployments — strongest enterprise deployment ratio of any LLM vendor.",
    useCases:
      "Enterprise search and knowledge retrieval (RAG)\nDocument analysis and extraction\nMultilingual content processing\nPrivate/air-gapped LLM deployment\nCustom model fine-tuning\nSemantic search (Embed + Rerank models)\nCompliance-sensitive AI workloads\nSovereign AI for government",
    dataStorage:
      "Customer-controlled: VPC, on-premises, or air-gapped deployment. SAP-Cohere EU AI Cloud for EU sovereign deployment. Cloud API also available.",
    dataProcessing:
      "On-prem/VPC: customer controls all processing. EU sovereign cloud via SAP partnership. No data leaves customer environment for private deployments.",
    trainingDataUse:
      "Private deployments: customer data never shared with Cohere. API: data not used for training (enterprise terms).",
    subprocessors: "Minimal for private deployments. Cloud: AWS/GCP infrastructure.",
    dpaDetails: "GDPR-compliant DPA available. EU sovereign deployment eliminates transfer concerns.",
    slaDetails: "Enterprise SLAs negotiable. API pricing: pay-per-token, custom enterprise rates.",
    dataPortability:
      "Models deployable on any infrastructure. No proprietary lock-in for private deployments. Standard API formats.",
    exitTerms: "Private deployment: customer controls everything. Low switching cost compared to SaaS-only vendors.",
    ipTerms: "Customer retains all IP in inputs and outputs.",
    certifications: "SOC 2 Type II, ISO 27001, ISO 42001 (AI management — rare).",
    encryptionInfo: "AES-256 at rest. TLS 1.2+ in transit. On-prem: customer-managed encryption.",
    accessControls: "API key management. VPC/on-prem: customer-managed access controls.",
    modelDocs: "Command R+ model cards published. Embed and Rerank documentation. Research papers.",
    explainability: "RAG grounding provides citation-based answers. Rerank scores for retrieval transparency.",
    biasTesting: "Safety evaluations published. Multilingual benchmarks.",
    aiActStatus: "ISO 42001 provides AI Act governance alignment. EU sovereign cloud demonstrates proactive compliance.",
    gdprStatus: "DPA available. Private/on-prem deployment: strongest GDPR posture. EU sovereign cloud via SAP.",
    euResidency: "SAP-Cohere EU AI Cloud for sovereign EU deployment. On-prem: ultimate data control.",
    deploymentModel: "hybrid",
    sourceModel: "closed-source",
    industrySlugs: ["financial-services", "public-sector", "healthcare"],
    scores: { "eu-ai-act": "B+", gdpr: "A-", dora: "B", "eba-eiopa-guidelines": "B+" },
  },

  // 2. Adobe Firefly / Sensei
  {
    slug: "adobe-firefly-sensei",
    vendor: "Adobe",
    name: "Adobe Firefly / Sensei",
    type: "Creative AI / Content Generation",
    risk: "Limited",
    description:
      "Enterprise creative AI for image generation, content creation, and design automation. IP-safe training data with Content Credentials — major differentiator for enterprises worried about copyright liability. Deep integration across Adobe suite (Photoshop, Illustrator, Express, Experience Cloud). Revenue $23.8B (FY2025). SaaS only — no on-prem. EU data residency guarantees unclear for AI features specifically. Locked into Adobe ecosystem.",
    category: "Financial",
    featured: false,
    capabilityType: "generative-ai",
    vendorHq: "San Jose, USA",
    euPresence: "Yes — EU subsidiary. Standard Contractual Clauses for EU-US transfers. No dedicated EU-only AI processing confirmed.",
    foundedYear: 1982,
    employeeCount: "31,360",
    fundingStatus: "Public (NASDAQ: ADBE). Revenue $23.8B (FY2025).",
    marketPresence: "Leader",
    customerCount: "Millions of Creative Cloud subscribers",
    notableCustomers:
      "Most Fortune 500 marketing/creative teams\nMedia companies, agencies, brands globally",
    customerStories:
      "IP-safe training data means enterprises can use Firefly outputs without copyright risk — unique differentiator. Content Credentials provide provenance tracking for AI-generated content.",
    useCases:
      "AI image generation (IP-safe)\nContent creation and variation at scale\nDesign automation in Photoshop/Illustrator\nMarketing asset personalization\nVideo editing assistance\nDocument processing (Acrobat AI)\nExperience Cloud personalization\nContent supply chain automation",
    dataStorage: "Adobe cloud infrastructure. SCCs for EU-US transfers.",
    dataProcessing: "SaaS processing. EU-specific AI processing not confirmed — gap for strict sovereignty.",
    trainingDataUse: "Firefly trained on Adobe Stock, openly licensed content, and public domain — IP-safe. Customer content NOT used for training.",
    subprocessors: "Adobe subsidiaries. AWS/Azure infrastructure.",
    dpaDetails: "GDPR-compliant DPA. EU SCCs. Binding Corporate Rules.",
    slaDetails: "Creative Cloud Enterprise SLAs. Firefly API: ~$0.02-0.10/image, ~$1,000/month enterprise minimum. 4,000 generative credits/month included. Prices rose 7-8% in 2025.",
    dataPortability: "Creative assets exportable in standard formats. Locked into Adobe tools for AI features.",
    exitTerms: "Creative Cloud subscription. Assets owned by customer. AI features non-portable.",
    ipTerms: "Customer retains IP. Adobe indemnifies for Firefly output IP claims (Content Credentials).",
    certifications: "SOC 2 Type II, SOC 3, ISO 27001, ISO 27017, ISO 27018, ISO 22301.",
    encryptionInfo: "AES-256 at rest. TLS 1.2+ in transit.",
    accessControls: "SSO/SAML, Admin Console, user management, audit logs.",
    modelDocs: "Firefly model documentation. Content Credentials specification. Transparency reports.",
    explainability: "Content Credentials provide provenance and AI disclosure for generated content.",
    biasTesting: "Adobe AI Ethics guidelines. Content moderation for generated images.",
    aiActStatus: "Content Credentials align with AI Act transparency requirements for AI-generated content.",
    gdprStatus: "DPA available. SCCs. BCR approved. EU-specific AI processing not confirmed.",
    euResidency: "SCCs for data transfers. No confirmed EU-only AI processing — gap for strict sovereignty requirements.",
    deploymentModel: "cloud-only",
    sourceModel: "closed-source",
    industrySlugs: ["telecommunications", "manufacturing"],
    scores: { "eu-ai-act": "B", gdpr: "B", dora: "C+", "eba-eiopa-guidelines": "C+" },
  },

  // 3. Zoom AI Companion
  {
    slug: "zoom-ai-companion",
    vendor: "Zoom",
    name: "Zoom AI Companion",
    type: "Meeting AI / Collaboration AI",
    risk: "Limited",
    description:
      "AI included at no extra cost in paid Zoom plans — meeting summaries, action items, smart compose, real-time translation. FedRAMP Moderate authorized. EU data residency via ZM+ deployment for EU-provisioned customers. Revenue $4.67B (FY2025). Standalone AI add-on: $10/user/month. Limited to Zoom ecosystem — narrow use case beyond meetings/communications.",
    category: "Healthcare",
    featured: false,
    capabilityType: "conversational-ai",
    vendorHq: "San Jose, USA",
    euPresence: "Yes — EU subsidiary. ZM+ deployment option for EU-provisioned customers uses European infrastructure.",
    foundedYear: 2011,
    employeeCount: "7,412",
    fundingStatus: "Public (NASDAQ: ZM). Revenue $4.67B (FY2025).",
    marketPresence: "Leader",
    customerCount: "300,000+ enterprise customers",
    notableCustomers: "Broad enterprise adoption across all industries. Specific AI Companion case studies limited.",
    customerStories: "AI Companion included free in paid plans — strong adoption driver. FedRAMP authorization enables government use.",
    useCases:
      "Meeting summaries and action items\nReal-time meeting translation\nSmart compose for chat/email\nMeeting scheduling optimization\nWhiteboard AI assistance\nPhone call summaries\nWorkflow automation\nCustom AI agents (paid add-on)",
    dataStorage: "ZM+ for EU customers uses European infrastructure. Standard: global processing.",
    dataProcessing: "ZM+: EU processing for EU-provisioned customers. Flexible data processing models (ZMO, ZM+, Federated).",
    trainingDataUse: "Zoom states AI Companion does not use customer data for training models.",
    subprocessors: "Zoom subsidiaries. Cloud infrastructure (AWS/Oracle).",
    dpaDetails: "GDPR-compliant DPA. EU SCCs.",
    slaDetails: "Included free in Pro/Business/Enterprise plans. Standalone: $10/user/month. Custom AI add-on: +$12/user/month.",
    dataPortability: "Meeting recordings and transcripts exportable. AI features non-portable.",
    exitTerms: "Meeting data owned by customer. AI features tied to Zoom subscription.",
    ipTerms: "Customer retains IP in meeting content.",
    certifications: "SOC 2 Type II, ISO 27001, FedRAMP Moderate (AI Companion JAB-authorized).",
    encryptionInfo: "AES-256 at rest. TLS 1.2+ in transit. End-to-end encryption for meetings.",
    accessControls: "SSO/SAML, RBAC, MFA, admin console, compliance archiving.",
    modelDocs: "AI Companion documentation. Limited model transparency.",
    explainability: "Meeting summaries show source context. Action items linked to meeting moments.",
    biasTesting: "Limited public information.",
    aiActStatus: "Limited risk for meeting AI. FedRAMP authorization demonstrates security maturity.",
    gdprStatus: "DPA available. ZM+ for EU customers. FedRAMP authorized.",
    euResidency: "ZM+ deployment for EU-provisioned customers. Flexible data processing models.",
    deploymentModel: "cloud-only",
    sourceModel: "closed-source",
    industrySlugs: ["telecommunications", "financial-services", "healthcare"],
    scores: { "eu-ai-act": "B-", gdpr: "B", dora: "C+", "eba-eiopa-guidelines": "C+" },
  },

  // 4. Atlassian Intelligence
  {
    slug: "atlassian-intelligence",
    vendor: "Atlassian",
    name: "Atlassian Intelligence",
    type: "DevOps / Collaboration AI",
    risk: "Limited",
    description:
      "AI embedded across Jira, Confluence, Bitbucket — natural language to JQL, automated summaries, code review. Requires Premium tier ($15.63/user/month post Oct 2025 increase). C5 certified — targets German public sector. Revenue $5.22B (FY2025). Cloud-only since Server/Data Center EOL. Rovo AI usage caps unclear. EU data residency expanding (Loom Germany data residency May 2026).",
    category: "Financial",
    featured: false,
    capabilityType: "generative-ai",
    vendorHq: "Sydney, Australia",
    euPresence: "Yes — EU subsidiary. EU data residency options. C5 certified for German public sector.",
    foundedYear: 2002,
    employeeCount: "13,813",
    fundingStatus: "Public (NASDAQ: TEAM). Revenue $5.22B (FY2025).",
    marketPresence: "Leader",
    customerCount: "300,000+ customers globally",
    notableCustomers: "Broad enterprise adoption. NASA, Toyota, Spotify, Samsung among known users of Atlassian products.",
    customerStories: "C5 certification achieved targeting German public sector adoption. AI features embedded natively in existing Jira/Confluence workflows.",
    useCases:
      "Natural language to JQL queries in Jira\nConfluence page summaries and drafts\nCode review suggestions in Bitbucket\nAutomated issue triage\nKnowledge base answers from Confluence\nRovo AI search across all Atlassian tools\nSprint planning assistance\nIncident management AI",
    dataStorage: "Atlassian Cloud. EU data residency options available. Loom Germany data residency May 2026.",
    dataProcessing: "Cloud processing in customer-selected region. Server/Data Center EOL means cloud-only.",
    trainingDataUse: "Atlassian states AI features do not use customer data for model training.",
    subprocessors: "Atlassian subsidiaries. AWS infrastructure.",
    dpaDetails: "GDPR-compliant DPA. EU SCCs.",
    slaDetails: "Included in Premium ($15.63/user/month) and Enterprise plans. Rovo AI: included with usage quotas, overages billed separately. Enterprise prices increased 7.5-10%.",
    dataPortability: "Jira/Confluence data exportable. AI features non-portable.",
    exitTerms: "Data export tools available. Server EOL forces cloud commitment.",
    ipTerms: "Customer retains IP in project data.",
    certifications: "SOC 2 Type II, ISO 27001, ISO 27018, C5 (German BSI), IRAP.",
    encryptionInfo: "AES-256 at rest. TLS 1.2+ in transit.",
    accessControls: "SSO/SAML, RBAC, MFA, organization-level controls, audit logs.",
    modelDocs: "Atlassian Intelligence documentation. Rovo AI guides.",
    explainability: "JQL translations show natural language mapping. Summaries reference source content.",
    biasTesting: "Limited public information.",
    aiActStatus: "Limited risk for DevOps/collaboration AI. C5 certification demonstrates EU compliance readiness.",
    gdprStatus: "DPA available. EU data residency. C5 certified.",
    euResidency: "EU data residency available. C5 certified. Loom Germany data residency May 2026.",
    deploymentModel: "cloud-only",
    sourceModel: "closed-source",
    industrySlugs: ["telecommunications", "financial-services", "manufacturing"],
    scores: { "eu-ai-act": "B", gdpr: "B+", dora: "B-", "eba-eiopa-guidelines": "B-" },
  },

  // 5. Zendesk AI
  {
    slug: "zendesk-ai",
    vendor: "Zendesk",
    name: "Zendesk AI",
    type: "Customer Service AI",
    risk: "Limited",
    description:
      "Mature AI triage and agent assist for customer service. Autonomous resolution bots. Suite plans $55-$209+/agent/month with Advanced AI add-on at $50/agent/month — real costs typically 2-3x base. EU data center in Dublin (AWS). Binding Corporate Rules approved. Private since 2022 acquisition — less financial transparency. Revenue ~$1.58B TTM. Strong compliance stack (HIPAA, PCI, BCR).",
    category: "Healthcare",
    featured: false,
    capabilityType: "conversational-ai",
    vendorHq: "San Francisco, USA",
    euPresence: "Yes — EU subsidiary. Dublin data center (AWS) for EEA hosting.",
    foundedYear: 2007,
    employeeCount: "4,000-5,000",
    fundingStatus: "Private — acquired 2022. Revenue ~$1.58B TTM (Mar 2026).",
    marketPresence: "Leader",
    customerCount: "100,000+ customers globally",
    notableCustomers: "Broad mid-market and enterprise adoption across industries.",
    customerStories: "Autonomous resolution bots handling tier-1 support. AI triage routes tickets with intent and sentiment analysis.",
    useCases:
      "AI-powered ticket triage and routing\nAutonomous resolution bots\nAgent assist with suggested responses\nKnowledge base AI answers\nSentiment and intent detection\nCustomer self-service automation\nWorkflow automation\nReporting and analytics AI",
    dataStorage: "Dublin (AWS) for EEA hosting. Data Center Location add-on for EU (included in Enterprise).",
    dataProcessing: "EU processing via Dublin data center. Available as add-on on Professional, included in Enterprise.",
    trainingDataUse: "Zendesk AI models trained on anonymized service interactions. Customer-specific data isolated.",
    subprocessors: "Zendesk subsidiaries. AWS infrastructure.",
    dpaDetails: "GDPR-compliant DPA. Binding Corporate Rules approved. EU-US Data Privacy Framework certified.",
    slaDetails: "Suite plans: $55-$209+/agent/month. Advanced AI add-on: $50/agent/month. Enterprise includes EU data center. Real costs 2-3x base after add-ons.",
    dataPortability: "API-based data export. Ticket data in standard formats.",
    exitTerms: "Data export available. AI customizations non-portable.",
    ipTerms: "Customer retains IP in support data.",
    certifications: "SOC 2 Type II, HIPAA (via BAA), PCI-DSS, EU-US Data Privacy Framework, GDPR BCR approved.",
    encryptionInfo: "AES-256 at rest. TLS 1.2+ in transit.",
    accessControls: "SSO/SAML, RBAC, MFA, IP restrictions, audit logs.",
    modelDocs: "Zendesk AI documentation. Automation guides.",
    explainability: "Intent and sentiment scores visible. Routing logic transparent.",
    biasTesting: "Limited public information on bias testing.",
    aiActStatus: "Limited risk for customer service AI.",
    gdprStatus: "DPA available. BCR approved. EU-US DPF certified. Dublin data center.",
    euResidency: "Dublin data center for EEA. BCR approved. EU-US DPF certified.",
    deploymentModel: "cloud-only",
    sourceModel: "closed-source",
    industrySlugs: ["telecommunications", "financial-services", "insurance"],
    scores: { "eu-ai-act": "B", gdpr: "B+", dora: "C+", "eba-eiopa-guidelines": "B-" },
  },

  // 6. HubSpot Breeze AI
  {
    slug: "hubspot-breeze-ai",
    vendor: "HubSpot",
    name: "HubSpot Breeze AI",
    type: "Marketing / Sales AI",
    risk: "Limited",
    description:
      "Unified CRM + AI across marketing, sales, and service. Breeze agents with audit trail. Pay-per-result pricing for AI agents. Frankfurt data center since 2021. Revenue $2.63B (FY2024). Credit-based pricing: Professional from $800/month (5,000 credits), Enterprise from $3,600/month. Mandatory onboarding $3-7K. HubSpot itself lacks ISO 27001 (relies on AWS) — certification gap for regulated enterprises.",
    category: "Financial",
    featured: false,
    capabilityType: "autonomous-agents",
    vendorHq: "Cambridge, MA, USA",
    euPresence: "Yes — EU subsidiary. Frankfurt data center available since 2021.",
    foundedYear: 2006,
    employeeCount: "8,900+",
    fundingStatus: "Public (NYSE: HUBS). Revenue $2.63B (FY2024). Q4 2025: $847M quarterly.",
    marketPresence: "Leader",
    customerCount: "228,000+ customers globally",
    notableCustomers: "Mid-market and SMB focused. Growing enterprise adoption.",
    customerStories: "Breeze AI agents with audit trail for marketing automation. Pay-per-result pricing model gaining traction.",
    useCases:
      "Marketing content generation and optimization\nLead scoring and prospecting (Breeze Prospecting Agent)\nEmail marketing AI personalization\nSales pipeline intelligence\nCustomer service chatbot\nSocial media AI assistant\nWorkflow automation\nReporting and analytics AI",
    dataStorage: "Frankfurt data center for EU customers. Migration tool available for existing customers.",
    dataProcessing: "EU processing via Frankfurt. SaaS-only.",
    trainingDataUse: "HubSpot states customer data not used for general model training.",
    subprocessors: "HubSpot subsidiaries. AWS infrastructure.",
    dpaDetails: "GDPR-compliant DPA. EU SCCs.",
    slaDetails: "Professional: from $800/month (5,000 credits). Enterprise: from $3,600-$4,700/month (10,000 credits). Extra credits: $45/month per 5,000. Mandatory onboarding: $3,000-$7,000.",
    dataPortability: "CRM data exportable in standard formats. API access.",
    exitTerms: "Data export available. CRM data portable. AI customizations non-portable.",
    ipTerms: "Customer retains IP in CRM data and content.",
    certifications: "SOC 2 Type II (via AWS). HIPAA support available. No ISO 27001 — relies on AWS infrastructure certification.",
    encryptionInfo: "AES-256 at rest. TLS 1.2+ in transit.",
    accessControls: "SSO/SAML, RBAC, MFA, audit logs.",
    modelDocs: "Breeze AI documentation. AI agent configuration guides.",
    explainability: "Breeze agents provide audit trails for actions taken.",
    biasTesting: "Limited public information.",
    aiActStatus: "Limited risk for marketing/sales AI.",
    gdprStatus: "DPA available. Frankfurt data center. SCCs. No ISO 27001 is a gap.",
    euResidency: "Frankfurt data center since 2021. EU processing available.",
    deploymentModel: "cloud-only",
    sourceModel: "closed-source",
    industrySlugs: ["telecommunications", "insurance"],
    scores: { "eu-ai-act": "B-", gdpr: "B", dora: "C", "eba-eiopa-guidelines": "C+" },
  },

  // 7. Freshworks Freddy AI
  {
    slug: "freshworks-freddy-ai",
    vendor: "Freshworks",
    name: "Freshworks Freddy AI",
    type: "IT / Customer Service AI (Mid-Market)",
    risk: "Limited",
    description:
      "IT and customer service AI for mid-market. Strongest certification stack in its segment (including FedRAMP, ISO 27001, ISO 27701, PCI-DSS). Aggressive pricing: Freddy Copilot $29/agent/month, Freddy AI Agent $49/100 sessions. Revenue $838.8M (FY2025, +16% YoY). 75,000+ customers but smaller scale than Zendesk/ServiceNow. Per-session pricing can spike unpredictably.",
    category: "Healthcare",
    featured: false,
    capabilityType: "conversational-ai",
    vendorHq: "San Mateo, USA (founded in Chennai, India)",
    euPresence: "Yes — EU data centers available.",
    foundedYear: 2010,
    employeeCount: "4,500+",
    fundingStatus: "Public (NASDAQ: FRSH). Revenue $838.8M (FY2025, +16% YoY). FY2026 guidance: $952-960M.",
    marketPresence: "Challenger",
    customerCount: "75,000+ customers. 8,000+ paying AI customers.",
    notableCustomers: "Mid-market focus. Broad adoption in IT support and customer service.",
    customerStories: "Freddy AI ARR at $25M with 8,000+ paying AI customers. Aggressive mid-market positioning with competitive pricing.",
    useCases:
      "IT service desk automation\nCustomer service chatbot\nTicket summarization and routing\nAgent assist with suggested responses\nKnowledge base AI\nWorkflow automation\nPredictive analytics\nSelf-service portal AI",
    dataStorage: "EU data centers available. US, EU, India, Australia data center options.",
    dataProcessing: "Customer-selected data center region.",
    trainingDataUse: "Customer data isolation. Enterprise terms available.",
    subprocessors: "Freshworks subsidiaries. AWS infrastructure.",
    dpaDetails: "GDPR-compliant DPA. EU-US Privacy Shield certified.",
    slaDetails: "Freddy Copilot: $29/agent/month. Freddy AI Agent: $49/100 sessions. Requires Pro ($49/agent/month) or Enterprise base plan.",
    dataPortability: "API-based data export. Standard formats.",
    exitTerms: "Data export available. AI customizations non-portable.",
    ipTerms: "Customer retains IP in support data.",
    certifications: "SOC 2 Type II, SOC 3, ISO 27001, ISO 27701, PCI-DSS, HIPAA, FedRAMP, CSA STAR Level 1, Cyber Essentials.",
    encryptionInfo: "AES-256 at rest. TLS 1.2+ in transit.",
    accessControls: "SSO/SAML, RBAC, MFA, audit logs, IP whitelisting.",
    modelDocs: "Freddy AI documentation. Integration guides.",
    explainability: "Ticket routing explanations. Agent suggestions with confidence scores.",
    biasTesting: "Limited public information.",
    aiActStatus: "Limited risk for IT/customer service AI. FedRAMP and strong certification stack.",
    gdprStatus: "DPA available. ISO 27701 (privacy). EU data centers. FedRAMP.",
    euResidency: "EU data centers available. ISO 27001/27701 certified.",
    deploymentModel: "cloud-only",
    sourceModel: "closed-source",
    industrySlugs: ["telecommunications", "insurance", "healthcare"],
    scores: { "eu-ai-act": "B-", gdpr: "B", dora: "C+", "eba-eiopa-guidelines": "C+" },
  },

  // 8. Monday.com AI
  {
    slug: "monday-ai",
    vendor: "Monday.com",
    name: "Monday AI (Sidekick)",
    type: "Work Management AI",
    risk: "Limited",
    description:
      "Work management platform with AI assistant (Sidekick, central since Jan 2026). Broadest ISO certification portfolio in its segment (7 ISO certifications including 27032 cybersecurity). DORA compliance documented — relevant for financial services. Revenue $1.23B (FY2025, +27% YoY). AI credits system still evolving. Data residency and HIPAA locked behind Enterprise tier. No on-prem option.",
    category: "Financial",
    featured: false,
    capabilityType: "generative-ai",
    vendorHq: "Tel Aviv, Israel",
    euPresence: "Yes — EU subsidiary. AWS EU data centers (Enterprise tier).",
    foundedYear: 2012,
    employeeCount: "3,155",
    fundingStatus: "Public (NASDAQ: MNDY). Revenue $1.23B (FY2025, +27% YoY).",
    marketPresence: "Challenger",
    customerCount: "225,000+ customers globally",
    notableCustomers: "Canva, Uber, Coca-Cola, Universal Music Group, Lionsgate among known users.",
    customerStories: "Sidekick AI assistant launched Jan 2026 as central AI feature. DORA compliance enables financial services adoption.",
    useCases:
      "Project management AI assistance\nTask automation and workflow optimization\nContent generation for project documentation\nData analysis and reporting\nResource planning AI\nFormula generation\nProject status summarization\nWorkflow template recommendations",
    dataStorage: "AWS EU data centers (Enterprise tier required for data residency).",
    dataProcessing: "SaaS processing. EU data residency on Enterprise tier.",
    trainingDataUse: "Customer data handling per enterprise agreement.",
    subprocessors: "Monday.com subsidiaries. AWS/GCP infrastructure.",
    dpaDetails: "GDPR-compliant DPA. DORA compliance documented.",
    slaDetails: "Pro: $19-30/seat/month. AI uses credit-based system. Enterprise required for data residency and HIPAA.",
    dataPortability: "API-based data export. Board data exportable.",
    exitTerms: "Data export available. AI features tied to platform.",
    ipTerms: "Customer retains IP in project data.",
    certifications: "SOC 1 Type II, SOC 2 Type II, SOC 3, ISO 27001, ISO 27017, ISO 27018, ISO 27032, ISO 27701, HIPAA, GDPR, CCPA. DORA compliance documented.",
    encryptionInfo: "AES-256 at rest. TLS 1.2+ in transit.",
    accessControls: "SSO/SAML, RBAC, MFA, audit logs, session management.",
    modelDocs: "Monday AI documentation. Sidekick user guides.",
    explainability: "AI actions provide context. Formula generation shows logic.",
    biasTesting: "Limited public information.",
    aiActStatus: "Limited risk for work management AI. Strong certification portfolio.",
    gdprStatus: "DPA available. ISO 27701. DORA compliant. EU data residency (Enterprise).",
    euResidency: "EU data residency available on Enterprise tier. DORA compliant.",
    deploymentModel: "cloud-only",
    sourceModel: "closed-source",
    industrySlugs: ["financial-services", "telecommunications", "manufacturing"],
    scores: { "eu-ai-act": "B-", gdpr: "B", dora: "B", "eba-eiopa-guidelines": "B-" },
  },
];

// ─── Seed runner ────────────────────────────────────────────

async function main() {
  console.log("Adding new AI systems (batch 1)...\n");

  for (const sys of systems) {
    const { industrySlugs, scores, ...data } = sys;

    const system = await prisma.aISystem.upsert({
      where: { slug: data.slug },
      update: data,
      create: data,
    });

    if (industrySlugs?.length) {
      const industries = await prisma.industry.findMany({
        where: { slug: { in: industrySlugs } },
      });
      await prisma.aISystem.update({
        where: { id: system.id },
        data: { industries: { set: industries.map((i) => ({ id: i.id })) } },
      });
    }

    if (scores) {
      for (const [frameworkSlug, score] of Object.entries(scores)) {
        const framework = await prisma.regulatoryFramework.findUnique({
          where: { slug: frameworkSlug },
        });
        if (framework) {
          await prisma.assessmentScore.upsert({
            where: {
              systemId_frameworkId: { systemId: system.id, frameworkId: framework.id },
            },
            update: { score },
            create: { systemId: system.id, frameworkId: framework.id, score },
          });
        }
      }
    }

    console.log(`  ✓ ${data.vendor} — ${data.name}`);
  }

  console.log(`\nDone — added ${systems.length} new systems.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
