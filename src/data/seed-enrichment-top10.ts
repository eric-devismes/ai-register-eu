/**
 * Content Enrichment — Top 10 AI Systems (Batch 1)
 *
 * Massively enriched profiles with enterprise procurement intelligence:
 * detailed capabilities, honest assessments, stakeholder-relevant intel,
 * updated pricing, certifications, and social proof.
 *
 * Run with: npx tsx src/data/seed-enrichment-top10.ts
 *
 * Safe to run multiple times (uses upsert on slug).
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// ─── Enriched Vendor Profiles ───────────────────────────────

const systems = [
  // 1. OpenAI GPT-4 / GPT-4o / GPT-5
  {
    slug: "openai-gpt4",
    vendor: "OpenAI",
    name: "GPT-4o / GPT-5 Platform",
    type: "Foundation Model Platform",
    risk: "High",
    description:
      "The most widely adopted enterprise LLM platform. GPT-4o handles text, image, audio, and video. ChatGPT Enterprise offers unlimited usage with admin controls. Strongest brand recognition but weaker EU compliance posture than EU-native alternatives. Azure OpenAI provides better EU data residency controls at 15-40% higher cost.",
    category: "Financial",
    featured: true,
    capabilityType: "generative-ai",
    vendorHq: "San Francisco, USA",
    euPresence:
      "Yes via Azure — EU data centers in Frankfurt, Paris, Sweden, Netherlands. OpenAI direct: EU data residency launched Feb 2025 (new projects only). OpenAI Ireland Limited is data controller for EEA users.",
    foundedYear: 2015,
    employeeCount: "7,200-7,700 (early 2026)",
    fundingStatus: "Private — raised ~$168B total across 12 rounds. Latest: $122B (Apr 2026, led by SoftBank). Valued at ~$852B. Revenue ~$20B annualized (2025). Transitioning from nonprofit to for-profit (controversial).",
    marketPresence: "Leader",
    customerCount: "1,000,000+ business customers (as of 2025)",
    notableCustomers:
      "Morgan Stanley (wealth management knowledge base)\nBBVA (4,000+ custom GPTs across the organization)\nModerna (drug development workflows)\nCarlyle (multi-agent due diligence — 50% faster)\nPayPal, Cisco, Canva, T-Mobile, Target, Booking.com, Amgen",
    customerStories:
      "BBVA deployed 4,000+ custom GPTs organization-wide. Carlyle built multi-agent due diligence cutting development time 50%. Morgan Stanley uses GPT-4 for wealth management knowledge retrieval across 16,000 advisors.",
    useCases:
      "Document drafting, summarization, and translation\nCustomer service automation and chatbots\nCode generation and review (Codex/GPT-4)\nData analysis and business intelligence\nContent creation at scale\nMultimodal processing (images, audio, video)\nCustom GPTs for departmental workflows\nRealtime voice API for call centers",
    dataStorage:
      "OpenAI direct: EU data residency (storage) available since Feb 2025 — new API projects only, existing projects cannot migrate. January 2026 expansion added in-region GPU inference (end-to-end EU processing, not just storage) with zero data retention. Azure OpenAI: EU Data Zone Standard (EUR) ensures all data stays within EU member states. Regions: Sweden Central (primary), West Europe, France Central.",
    dataProcessing:
      "OpenAI direct: EU inference residency since Jan 2026 = data stored AND processed in-region with zero retention. Azure: stricter controls with VNETs, private endpoints, specific region locking (e.g., Germany-only). Azure total cost runs 15-40% higher than direct due to support plans, networking, and data transfer.",
    trainingDataUse:
      "Business/Enterprise/API: customer data NOT used for model training — contractually guaranteed. Consumer ChatGPT: conversations may be used unless opted out. Warning on reasoning models (o1/o3): internal reasoning tokens billed as output — a short visible answer can consume 5-10x more tokens than displayed.",
    subprocessors:
      "OpenAI direct: limited disclosure. Azure: Microsoft subsidiaries with published subprocessor list and change notifications. Key difference: Azure provides more transparent sub-processor management.",
    dpaDetails:
      "DPA available covering GDPR Art. 28 requirements. EU Standard Contractual Clauses (SCCs) for cross-border transfers. For API usage, OpenAI acts as processor. Note: Italian Garante fined OpenAI EUR 15M (Dec 2024) for GDPR violations on consumer ChatGPT — subsequently overturned on appeal.",
    slaDetails:
      "ChatGPT Enterprise: included in contract. API: rate limits vary by tier. Azure OpenAI: 99.9% uptime SLA with financial credits. No published SLA for direct OpenAI API.",
    dataPortability:
      "API-based access in standard formats. Azure: full export via Azure portal. ChatGPT Enterprise: conversation and custom GPT export. Warning: reasoning model outputs may not be fully portable due to internal chain-of-thought architecture.",
    exitTerms:
      "ChatGPT Enterprise: 150-seat minimum, annual commitment (~$108K/yr floor). Contract exit at renewal. Azure: standard Microsoft enterprise terms. Data deletion confirmed post-termination.",
    ipTerms:
      "Customer retains all IP in inputs and outputs. Clear in enterprise terms. Copyright shield available (Microsoft/Azure only).",
    certifications:
      "SOC 2 Type II (Security, Availability, Confidentiality, Privacy — covers API, Enterprise, Team). ISO 27001:2022. ISO 27701:2019 (privacy). ISO 27017:2015 (cloud security). ISO 27018:2019 (PII in cloud). HIPAA BAA available. No EU-specific C5 or ENS certification — unlike Google which obtained C5 for Gemini.",
    encryptionInfo:
      "AES-256 at rest. TLS 1.2+ in transit. Azure: customer-managed keys via Azure Key Vault. OpenAI direct: limited key management options compared to Azure.",
    accessControls:
      "ChatGPT Enterprise: SSO/SAML, SCIM provisioning, admin console, domain verification, audit logs, custom data retention. API: API key management, organization settings. Azure: full IAM, conditional access, MFA, VPC isolation, comprehensive audit via Azure Monitor.",
    modelDocs:
      "System cards published for GPT-4, GPT-4o, o1. Technical reports available. Model behavior documentation. Azure: Transparency Notes and responsible AI documentation.",
    explainability:
      "No per-decision feature attribution for LLM outputs. Content filtering with reason codes (Azure AI Content Safety). Reasoning models (o1/o3) show chain-of-thought but internal reasoning tokens are not fully transparent. No SHAP/LIME equivalent for generative outputs.",
    biasTesting:
      "Red teaming program. Annual responsible AI reports. Azure: Responsible AI dashboard and fairness assessments via Azure ML. External safety evaluations published. No public bias testing specific to EU language/cultural contexts.",
    aiActStatus:
      "GPT models likely classified as General-Purpose AI (GPAI) under AI Act, triggering transparency and documentation requirements. OpenAI has not published a specific AI Act compliance statement. Azure: Microsoft has published EU AI Act guidance with proactive compliance program.",
    gdprStatus:
      "DPA available with SCCs. OpenAI Ireland Limited designated as EEA data controller. HIPAA BAA available. Italian GDPR fine (2024) was overturned on appeal. Stronger GDPR posture through Azure than direct.",
    euResidency:
      "Direct API: EU storage residency since Feb 2025 (new projects only). January 2026: in-region GPU inference added — data now processed AND stored in EU end-to-end for EU-residency projects. Azure: full EU data residency with Data Zone Standard (EUR). EU Data Boundary program rolling out. For maximum EU control, Azure OpenAI with regional deployment (e.g., Germany-only) recommended.",
    deploymentModel: "cloud-only",
    sourceModel: "closed-source",
    industrySlugs: [
      "financial-services",
      "healthcare",
      "insurance",
      "public-sector",
      "manufacturing",
      "telecommunications",
    ],
    scores: {
      "eu-ai-act": "B",
      gdpr: "B+",
      dora: "B",
      "eba-eiopa-guidelines": "B",
    },
  },

  // 2. Anthropic Claude
  {
    slug: "anthropic-claude-enterprise",
    vendor: "Anthropic",
    name: "Claude Enterprise",
    type: "Foundation Model Platform",
    risk: "High",
    description:
      "Safety-first foundation model with Constitutional AI. Best-in-class for coding (80.9% SWE-bench), writing quality, and long-context tasks (1M tokens as of March 2026). No EU entity — EU deployment requires AWS Bedrock or GCP Vertex AI for data residency. Strong certifications including rare ISO 42001 (AI Management Systems). Enterprise plan requires 70-user minimum.",
    category: "Financial",
    featured: true,
    capabilityType: "generative-ai",
    vendorHq: "San Francisco, USA",
    euPresence:
      "No EU legal entity or subsidiary. Available via AWS Bedrock (Frankfurt, Paris, Stockholm + 3 EU regions) and GCP Vertex AI (10 EU regions). EU representative not appointed under Art. 27(2) GDPR — Anthropic cites exemption. Irish DPC is competent supervisory authority. M365 Copilot integration: Claude was added as an M365 Copilot subprocessor (Jan 2026) but is EXCLUDED from Microsoft's EU Data Boundary by default — EU tenants must explicitly opt out to prevent EU data leaving the boundary.",
    foundedYear: 2021,
    employeeCount: "1,100+ (2025), growing to ~2,500+ (2026)",
    fundingStatus:
      "Private — raised $67B+ across 17 rounds. Latest: Series G $30B (Feb 2026). Valued at $380B post-money. Investors: Google, Amazon, Spark Capital, Salesforce Ventures.",
    marketPresence: "Leader",
    customerCount: "Not publicly disclosed — significant enterprise adoption",
    notableCustomers:
      "GitLab (DevSecOps integration)\nNotion (early adopter of Claude Managed Agents)\nDoorDash\nIntuit\nPfizer\nSalesforce\nAsana\nReplit\nHebbia",
    customerStories:
      "GitLab integrated Claude for DevSecOps workflows. 54% enterprise developer market share for Claude Code. Revenue approaching $14B run rate (early 2026).",
    useCases:
      "Document analysis and summarization (1M token context window — standard as of March 2026)\nCode generation and review (strongest coding benchmarks)\nResearch and data extraction\nCustomer support automation\nContent creation and editing\nComplex reasoning and multi-step analysis\nEnterprise agents via Claude Cowork (Feb 2026)\nMCP-powered tool integrations",
    dataStorage:
      "Direct API: US-based by default. 'inference_geo' parameter supports only 'us' and 'global' — with 'global', inference may run in Europe but is NOT guaranteed. Workspace data storage is US-only. Via AWS Bedrock: Frankfurt, Paris, Stockholm + 3 EU regions. Via GCP Vertex AI: 10 EU regions. Both guarantee data stays within EU borders.",
    dataProcessing:
      "Direct API: no guaranteed EU processing. Additional regions planned but no timeline. Practical recommendation: use AWS Bedrock EU inference profiles or GCP Vertex AI EU regional endpoints for EU data residency. Do NOT rely on direct API for GDPR-sensitive workloads.",
    trainingDataUse:
      "Customer data NOT used for model training on commercial plans — contractually guaranteed. No retention for API calls. Consumer free tier: conversations may be used for training unless opted out.",
    subprocessors:
      "AWS and GCP as infrastructure providers. Anthropic subprocessor list available on request. Minimal sub-processor footprint compared to Microsoft/Google.",
    dpaDetails:
      "DPA automatically incorporated into Commercial Terms of Service. Includes Standard Contractual Clauses (SCCs) for EU transfers. Gap: Anthropic does NOT appoint an EU representative under Art. 27(2) GDPR, citing exemption.",
    slaDetails:
      "99.5% API uptime target. Enterprise SLAs negotiable. Note: Claude Code users report hitting quota limits faster than expected — Anthropic acknowledged this as top-priority issue.",
    dataPortability:
      "API-based access. No proprietary lock-in to Anthropic format. Conversation export available. MCP (Model Context Protocol) is open standard — partially mitigates lock-in. However, Claude Marketplace centralizes billing and partner relationships.",
    exitTerms:
      "Enterprise: 70-user minimum, 12-month contract. Data deleted upon termination. No long-term retention. SCIM requires Enterprise tier (not available on Team plan). PRICING CHANGE (April 15, 2026): Anthropic switched from flat fee (~$200/user/month) to usage-based billing — $20/seat/month base + standard API rates on top. Could triple costs for heavy users vs. prior flat-rate plans. Evaluate TCO carefully before renewal.",
    ipTerms: "Customer retains all IP in inputs and outputs.",
    certifications:
      "SOC 2 Type II. ISO 27001:2022. ISO/IEC 42001:2023 (AI Management Systems — rare, few vendors have this). HIPAA BAA available. No EU-specific C5 or ENS certification.",
    encryptionInfo: "AES-256 at rest. TLS 1.2+ in transit.",
    accessControls:
      "SSO/SAML: Team and Enterprise plans. SCIM 2.0: Enterprise only (70-user minimum, 12-month contract — excludes smaller orgs). RBAC, MFA, API key management. Audit logging: Enterprise plan only.",
    modelDocs:
      "Model cards for Claude 4 family (Opus, Sonnet, Haiku). Constitutional AI methodology documented. Responsible Scaling Policy published. Model behavior and safety evaluations transparent.",
    explainability:
      "Chain-of-thought reasoning visible in outputs. Strong instruction following for generating explanations. No formal feature attribution tooling (no SHAP/LIME equivalent). Better natural language explanations than competitors.",
    biasTesting:
      "Red teaming program. Responsible Scaling Policy. External safety evaluations. No published bias testing specific to EU language/cultural contexts.",
    aiActStatus:
      "No public AI Act compliance statement. ISO 42001 certification provides alignment with AI Act governance requirements. Claude models likely classified as GPAI. No proactive self-classification published.",
    gdprStatus:
      "DPA with SCCs available. No EU representative appointed. Irish DPC as competent authority. For GDPR-sensitive workloads, cloud marketplace (Bedrock/Vertex) is the recommended deployment path.",
    euResidency:
      "Direct API: NO guaranteed EU processing. Via AWS Bedrock or GCP Vertex AI: full EU data residency with guaranteed in-region processing. This is the only viable path for EU-regulated enterprises.",
    deploymentModel: "cloud-only",
    sourceModel: "closed-source",
    industrySlugs: [
      "financial-services",
      "healthcare",
      "public-sector",
      "telecommunications",
    ],
    scores: {
      "eu-ai-act": "B-",
      gdpr: "B",
      dora: "C+",
      "eba-eiopa-guidelines": "B-",
    },
  },

  // 3. Mistral AI — EU-native
  {
    slug: "mistral-ai",
    vendor: "Mistral AI",
    name: "Mistral Platform / Le Chat",
    type: "Foundation Model Platform (EU-Sovereign)",
    risk: "High",
    description:
      "The strongest EU-sovereign AI option. Paris-headquartered, French law governs, all data processed in EU by default. Open-weight models (Mistral Small 4, Ministral 3, Mixtral) enable on-prem deployment with zero vendor lock-in. $400M ARR as of January 2026, $13.8B valuation, and $830M raised to build a 44 MW Paris data center — fastest-growing EU-native AI company. Significantly cheaper than OpenAI/Anthropic on API pricing. Weaker enterprise tooling and smaller ecosystem compared to US competitors. Key partner for EU government sovereign AI initiatives.",
    category: "Public Sector",
    featured: true,
    capabilityType: "generative-ai",
    vendorHq: "Paris, France",
    euPresence:
      "EU-native — headquartered in Paris, France. All infrastructure EU-based. French law governs all contracts. CNIL is supervisory authority. Partnerships with Scaleway, OVHcloud (EU cloud providers).",
    foundedYear: 2023,
    employeeCount: "862+ (Feb 2026)",
    fundingStatus:
      "Private — raised ~$3.88B+ total: equity (~$3.05B across 7 rounds) + $830M debt financing (March 30, 2026, for new Paris data center). Current valuation: $13.8B (March 2026). ARR: $400M run-rate as of January 2026 (up from ~$20M in early 2025). ASML invested $1.5B (owns 11%). Key investors: Andreessen Horowitz, General Catalyst, Lightspeed, BPI France, NVIDIA, DST Global, BNP Paribas, Xavier Niel. Accenture multi-year strategic partnership (February 2026).",
    marketPresence: "Challenger",
    customerCount: "Revenue tripled within 100 days of Le Chat enterprise launch (mid-2025)",
    notableCustomers:
      "CMA CGM (EUR 100M five-year deal — 6 engineers embedded, 1M emails/week processed)\nBNP Paribas (global markets, sales, customer support)\nAXA (140,000+ employees with secure AI)\nStellantis (in-car AI assistants)\nVeolia (environmental optimization)\nFrench Ministry of Armed Forces\nFrance Travail (government employment agency)\nLuxembourg (sovereign data initiative)\nASML, Ericsson, European Space Agency",
    customerStories:
      "CMA CGM signed EUR 100M five-year deal with 6 Mistral engineers embedded in Marseille, processing 1M emails/week for claims and logistics. AXA deployed to 140,000+ employees. BNP Paribas uses for global markets and customer support. French Ministry of Armed Forces runs models on French soil.",
    useCases:
      "Sovereign AI for EU government and public sector\nMultilingual document processing (strong in EU languages)\nEnterprise chatbots and assistants (Le Chat)\nOn-premises AI for regulated industries (via open-weight models)\nCode generation (Codestral — competitive with Copilot)\nCustom model fine-tuning on proprietary data\nRAG and knowledge retrieval\nAgent workflows (Mistral Agents)",
    dataStorage:
      "Primary: Sweden and Ireland via GCP (both EU). Mistral Compute (June 2025): 18,000 NVIDIA chips hosted in France, reducing GCP dependence. New Paris data center (March 2026): 13,800 NVIDIA GB300 NVL72 GPUs, 44 MW capacity — funded by $830M debt raise; eliminates GCP dependency for flagship model inference. On-premises via open-weight models (Mistral Small 4, Ministral 3, Mistral Large 3, Mixtral). Cloud provider Koyeb acquired (Feb 2026) for serverless GPU infrastructure. Partners: Scaleway, OVHcloud — EU-sovereign cloud. US processing added Feb 2025 as opt-in only.",
    dataProcessing:
      "EU by default — no opt-in required. US processing is opt-in (added Feb 2025, triggered CNIL GDPR complaint — outcome pending). On-prem option for complete data control and air-gapped environments. Not subject to US CLOUD Act — material differentiator for EU government and regulated-industry procurement.",
    trainingDataUse:
      "API/Platform: customer data not used for model training. On-prem: customer has full control. Open-weight models: customer fine-tunes on own data with zero sharing.",
    subprocessors:
      "Primarily EU-based subprocessors. Scaleway and OVHcloud as sovereign cloud partners. No US hyperscaler dependency for core platform.",
    dpaDetails:
      "GDPR-compliant DPA under French law. EU-native terms — no SCCs needed (no cross-border transfer). CNIL is directly competent authority. Strongest GDPR positioning of any foundation model provider.",
    slaDetails:
      "Platform SLA available for enterprise customers. On-prem: customer-managed. Le Chat: consumer-grade availability.",
    dataPortability:
      "Open-weight models freely downloadable and self-hostable — ultimate portability. API output in standard formats. Zero vendor lock-in with open-weight deployment. Can run on any infrastructure.",
    exitTerms:
      "Open-weight models = no vendor lock-in whatsoever. Can switch to self-hosted at any time. Platform data deleted on termination. Lowest exit cost of any foundation model provider.",
    ipTerms:
      "Customer retains all IP. Open-weight models freely usable under Apache 2.0 or Mistral Research License depending on model.",
    certifications:
      "SOC 2 Type II. ISO 27001. ISO 27701 (privacy). HDS (Hébergeur de Données de Santé — French health data hosting) in progress. ANSSI qualification in progress. Trust center at trust.mistral.ai.",
    encryptionInfo: "AES-256 at rest. TLS 1.3 in transit.",
    accessControls:
      "API key management. SSO for enterprise tier. Audit logs. On-prem: customer controls all access management.",
    modelDocs:
      "Model cards published for all models. Open-weight models allow full inspection of architecture and weights. Technical reports and benchmarks published. Strongest transparency of any major LLM provider due to open-weight approach.",
    explainability:
      "Open-weight models enable customer-side analysis, probing, and custom explainability tooling. No built-in explainability platform yet. Community tools available for open-weight model interpretation.",
    biasTesting:
      "Safety evaluations published. Multilingual benchmarks covering EU languages. Red teaming conducted. Open-weight models allow independent third-party bias auditing — not possible with closed-source competitors.",
    aiActStatus:
      "Active participant in EU AI Act regulatory discussions. French government strategic AI partner. Well-positioned for GPAI compliance due to EU-native status and transparency (open weights). Co-drafted industry position papers on AI Act implementation.",
    gdprStatus:
      "EU-native — GDPR-compliant by design. No cross-border data transfer issues. CNIL engagement. DPO appointed. Strongest GDPR story of any foundation model provider.",
    euResidency:
      "Native EU. All data stays in EU by default. On-prem deployment eliminates all residency concerns. Strongest data sovereignty guarantee in the foundation model market.",
    deploymentModel: "hybrid",
    sourceModel: "open-weights",
    industrySlugs: [
      "public-sector",
      "financial-services",
      "healthcare",
      "manufacturing",
    ],
    scores: {
      "eu-ai-act": "A-",
      gdpr: "A",
      dora: "B+",
      "eba-eiopa-guidelines": "B+",
    },
  },

  // 4. Microsoft Azure OpenAI / Copilot
  {
    slug: "microsoft-azure-openai-service",
    vendor: "Microsoft",
    name: "Azure OpenAI Service / Copilot",
    type: "Foundation Model Platform + Productivity AI",
    risk: "High",
    description:
      "Enterprise-grade access to OpenAI models (GPT-4o, GPT-5, o1) through Azure cloud with enterprise security, compliance controls, and content filtering. Copilot embeds AI across Microsoft 365 (Word, Excel, Teams, Outlook). Strongest enterprise integration story — if you're a Microsoft shop, this is the path of least resistance. Better EU compliance than direct OpenAI (EU Data Boundary, C5 cert). Premium pricing: Azure OpenAI costs 15-40% more than direct OpenAI.",
    category: "Financial",
    featured: true,
    capabilityType: "generative-ai",
    vendorHq: "Redmond, USA",
    euPresence:
      "Yes — extensive EU subsidiary network. Data centers in Amsterdam, Dublin, Frankfurt, Paris, Sweden. EU Data Boundary program. Largest EU cloud infrastructure of any provider.",
    foundedYear: 1975,
    employeeCount: "228,000+",
    fundingStatus: "Public (NASDAQ: MSFT). Market cap ~$3T+.",
    marketPresence: "Leader",
    customerCount: "400M+ Microsoft 365 users. Azure: millions of enterprise customers.",
    notableCustomers:
      "95% of Fortune 500 use Azure. Copilot adopted by Accenture, BP, Dow, EY, KPMG, Lumen, Visa.\nAzure OpenAI: Deutsche Bank, HSBC, Siemens, BMW, Volvo, Maersk (EU enterprises).",
    customerStories:
      "Accenture deployed Copilot to 100,000+ employees. Deutsche Bank uses Azure OpenAI for document processing. Siemens integrates Azure AI across manufacturing. BMW uses Azure for predictive quality.",
    useCases:
      "Document drafting and summarization (Copilot in Word)\nEmail and meeting management (Copilot in Outlook/Teams)\nData analysis and reporting (Copilot in Excel)\nCode generation and review (GitHub Copilot)\nCustomer service automation\nProcess automation via Copilot Studio agents\nEnterprise search (Microsoft Search + AI)\nSecurity operations (Security Copilot)",
    dataStorage:
      "EU regions: Netherlands, Ireland, Germany, France, Sweden. Customer selects region. EU Data Boundary ensures processing and storage in EU. Most comprehensive EU data residency of any US hyperscaler.",
    dataProcessing:
      "Inference in customer-selected EU region. Abuse monitoring can be disabled for approved enterprise customers. Copilot for M365: data processed within Microsoft 365 EU boundary. Azure OpenAI: full VPC isolation available.",
    trainingDataUse:
      "Customer data NOT used for training — contractually guaranteed across all enterprise services. Prompts/completions not stored beyond 30 days (configurable to 0). Copilot: no data shared with OpenAI.",
    subprocessors:
      "Microsoft subsidiaries globally. Published subprocessor list with change notifications. Strongest sub-processor transparency of any provider.",
    dpaDetails:
      "GDPR-compliant DPA in Microsoft Product Terms. Covers Art. 28 requirements comprehensively. EU SCCs included. Binding Corporate Rules approved by Irish DPC.",
    slaDetails:
      "99.9% uptime SLA for Azure OpenAI. 99.9% for Microsoft 365. Financial credits for breaches. Strongest SLA guarantees in the market.",
    dataPortability:
      "Full data export via Azure APIs and portal in standard formats. Microsoft 365: data export tools available. Graph API for programmatic access. Migration tools for moving between cloud providers.",
    exitTerms:
      "30-day post-termination data retrieval. Data deletion confirmed. Microsoft 365: data retention per contract. Copilot pricing (2026): Standalone add-on $30/user/month for existing M365 subscribers; bundled plans from $42.50/user/month. Enterprise minimum: 300-seat commitment. New M365 E7 'Frontier Suite' at $99/user/month (annual, from May 1, 2026) bundles M365 E5 + Copilot + Agent 365 + Entra Suite — 15% discount vs. buying separately. M365 suite pricing increases effective July 1, 2026 across Business/Enterprise/Frontline tiers.",
    ipTerms:
      "Customer retains all IP in inputs and outputs. Copilot Copyright Commitment — Microsoft assumes legal risk for copyright claims on Copilot outputs.",
    certifications:
      "ISO 27001, ISO 27018, ISO 27017, SOC 2 Type II, SOC 3, C5 (Germany — BSI certified), ENS (Spain), CSA STAR, FedRAMP High, HIPAA BAA, HDS (France), ISO/IEC 42001:2023 (AI Management Systems — achieved July 2025 for Azure AI Foundry Models and Security Copilot). 100+ compliance offerings — most of any cloud provider.",
    encryptionInfo:
      "AES-256 at rest with customer-managed keys (Azure Key Vault). TLS 1.2+ in transit. Double encryption option. Confidential computing available.",
    accessControls:
      "SSO/SAML via Entra ID (Azure AD), RBAC, MFA, conditional access, Privileged Identity Management, comprehensive audit logs, VPC isolation, Private Link.",
    modelDocs:
      "Model cards published for GPT-4, GPT-4o, DALL-E. Transparency notes. System cards. Azure AI documentation comprehensive. Responsible AI Impact Assessment template provided.",
    explainability:
      "Content filtering explanations. Azure AI Content Safety reason codes. No per-decision feature attribution for LLM outputs. Azure ML: SHAP/LIME for traditional ML models.",
    biasTesting:
      "Responsible AI dashboard. Fairness assessments via Azure ML. Red teaming. Annual Responsible AI Report. Responsible AI Standard published. Most comprehensive responsible AI tooling of any provider.",
    aiActStatus:
      "Published EU AI Act guidance and compliance roadmap. Self-classification guidance for specific use cases. Proactive compliance program. Most mature AI Act preparation of any US vendor.",
    gdprStatus:
      "Comprehensive. DPA, DPO appointed, DPIA templates. EU representative designated. Binding Corporate Rules approved. EU Data Boundary program. Strongest GDPR posture of any US hyperscaler.",
    euResidency:
      "Full EU data residency. EU Data Boundary program ensures data stays in EU. Sovereign cloud offerings (EU sovereign landing zone). C5 and ENS certified. Best EU compliance of any US cloud AI provider.",
    deploymentModel: "cloud-only",
    sourceModel: "closed-source",
    industrySlugs: [
      "financial-services",
      "healthcare",
      "public-sector",
      "manufacturing",
      "insurance",
      "telecommunications",
    ],
    scores: {
      "eu-ai-act": "B+",
      gdpr: "A-",
      dora: "B+",
      "eba-eiopa-guidelines": "B+",
    },
  },

  // 5. Google Gemini / Vertex AI
  {
    slug: "google-gemini-vertex-ai",
    vendor: "Google Cloud",
    name: "Gemini / Vertex AI",
    type: "Foundation Model Platform + Cloud AI",
    risk: "High",
    description:
      "Multimodal AI (text, image, video, code) via Vertex AI for enterprise and embedded across Google Workspace. Gemini models with 1M+ token context window — largest in the market. Strong for organizations already in the Google ecosystem. Sovereign Controls for EU. Obtained BSI C5 certification for Gemini — ahead of OpenAI on EU-specific compliance.",
    category: "Financial",
    featured: true,
    capabilityType: "generative-ai",
    vendorHq: "Mountain View, USA",
    euPresence:
      "Yes — EU subsidiary, data centers in Belgium, Netherlands, Germany, Finland. Sovereign Controls and Assured Workloads for EU available.",
    foundedYear: 1998,
    employeeCount: "180,000+ (Alphabet)",
    fundingStatus: "Public (NASDAQ: GOOGL). Market cap ~$2T+.",
    marketPresence: "Leader",
    customerCount: "Millions of Google Workspace users. GCP: growing enterprise base.",
    notableCustomers:
      "Deutsche Bank, Renault, Airbus, Carrefour, LVMH (EU enterprises)\nWayfair, Uber, Mercedes-Benz, Best Buy, Dun & Bradstreet",
    customerStories:
      "Deutsche Bank uses Vertex AI for document processing. Renault uses Gemini for engineering documentation. Carrefour uses Google AI for retail optimization.",
    useCases:
      "Enterprise search and knowledge management\nDocument analysis and generation\nCode assistance (Gemini Code Assist)\nCustomer support chatbots\nData analytics and visualization\nMultimodal content processing (1M+ context)\nGoogle Workspace AI integration\nCustom model fine-tuning on Vertex AI",
    dataStorage:
      "EU regions: Belgium (europe-west1), Netherlands (europe-west4), Germany (europe-west3), Finland (europe-north1). Customer selects region.",
    dataProcessing:
      "Vertex AI processes in customer-selected region. Some Workspace AI features may process outside EU — check specific feature documentation. Sovereign Controls available for strictest requirements.",
    trainingDataUse:
      "Vertex AI: customer data not used for training by default. Workspace: data not used for Gemini training (enterprise terms). Clear contractual guarantees.",
    subprocessors: "Google subsidiaries. Published subprocessor list with notifications.",
    dpaDetails:
      "GDPR-compliant Cloud DPA. EU SCCs included. Comprehensive Art. 28 coverage.",
    slaDetails:
      "99.9% for Vertex AI and Workspace. Financial SLA credits.",
    dataPortability:
      "BigQuery export, API-based data retrieval, standard formats. Open-source tools (TensorFlow, JAX) reduce lock-in.",
    exitTerms: "60-day data retrieval post-termination.",
    ipTerms: "Customer retains IP in outputs generated via Vertex AI.",
    certifications:
      "ISO 27001, ISO 27017, ISO 27018, SOC 2 Type II, SOC 3, C5 (BSI Germany — obtained for Gemini specifically), HDS (France). FedRAMP High.",
    encryptionInfo:
      "AES-256 at rest with customer-managed keys (Cloud KMS). TLS 1.3 in transit. Confidential Computing available.",
    accessControls:
      "SSO/SAML, Google Cloud IAM, RBAC, MFA, VPC Service Controls, audit logs, Organization Policies.",
    modelDocs:
      "Gemini model cards published. Technical reports. AI Principles documentation since 2018 — longest track record of any provider.",
    explainability:
      "Vertex AI Explanations (feature attribution for traditional ML). Grounding with Google Search for citation. No formal XAI for generative outputs.",
    biasTesting:
      "Responsible AI practices documented since 2018. Model evaluation tools. Annual AI Principles report. Fairness indicators for ML models.",
    aiActStatus:
      "Published EU AI Act compliance guidance. Active engagement with EU regulators. C5 certification for Gemini demonstrates proactive EU compliance.",
    gdprStatus:
      "DPA available. DPO appointed. EU representative designated. DPIA support documentation. Strong regulatory engagement.",
    euResidency:
      "Sovereign Controls and Assured Workloads for EU. C5 certified for Gemini (ahead of OpenAI). Regional processing guaranteed in Vertex AI.",
    deploymentModel: "cloud-only",
    sourceModel: "closed-source",
    industrySlugs: [
      "financial-services",
      "healthcare",
      "telecommunications",
      "manufacturing",
    ],
    scores: {
      "eu-ai-act": "B+",
      gdpr: "B+",
      dora: "B",
      "eba-eiopa-guidelines": "B+",
    },
  },
];

// ─── Seed runner ────────────────────────────────────────────

async function main() {
  console.log("Enriching top AI system profiles...\n");

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
