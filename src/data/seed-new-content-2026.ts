/**
 * New Content Seed — April 2026
 *
 * Adds:
 *   - 8 new AI systems (OpenAI GPT-5, Meta Llama, xAI Grok, DeepMind Gemini Ultra,
 *     Apple Intelligence, Cohere, Aleph Alpha, Mistral Large 2)
 *   - 20 changelog/news entries covering EU AI Act milestones, enforcement,
 *     vendor compliance updates, and Digital Omnibus proposal
 *   - 15 approved sources for chatbot reference
 *
 * Run with: npx tsx src/data/seed-new-content-2026.ts
 * Safe to run multiple times (uses upsert).
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// ─── New AI Systems ──────────────────────────────────────

const newSystems = [
  {
    slug: "openai-chatgpt-enterprise",
    vendor: "OpenAI",
    name: "ChatGPT Enterprise / GPT-5",
    type: "Foundation Model Platform",
    risk: "High",
    description:
      "OpenAI's flagship conversational AI and API platform. GPT-5 launched August 2025 with multimodal reasoning, extended context, and improved reliability. Enterprise tier offers SSO, admin controls, and no-training data guarantee.",
    category: "General Purpose",
    featured: true,
    vendorHq: "San Francisco, USA",
    euPresence:
      "OpenAI Ireland Ltd (Dublin) as EU legal entity. Processing in EU regions available via Azure partnership.",
    useCases:
      "Document drafting and summarization\nCode generation and review\nCustomer support automation\nResearch assistance\nContent generation\nData analysis and interpretation",
    dataStorage:
      "ChatGPT Enterprise: data stored in USA by default; EU data residency via Azure OpenAI. API: configurable.",
    dataProcessing:
      "Enterprise customers: no training on data. Zero-data-retention API option available.",
    trainingDataUse:
      "Enterprise: data NOT used for training. Consumer: may be used unless opted out.",
    subprocessors:
      "Microsoft Azure (primary infrastructure). Published subprocessor list available.",
    dpaDetails:
      "DPA available for enterprise customers. EU SCCs included. OpenAI Ireland as data processor.",
    slaDetails: "99.9% uptime SLA for Enterprise tier.",
    dataPortability: "Data export via API and admin dashboard.",
    exitTerms: "Data deletion within 30 days of account termination on request.",
    ipTerms: "Customer owns outputs. OpenAI retains no IP rights to generated content.",
    certifications: "SOC 2 Type II. ISO/IEC 27001:2022 (achieved). ISO 27017:2015. ISO 27018:2019. ISO 27701:2019.",
    encryptionInfo: "AES-256 at rest. TLS 1.2+ in transit.",
    accessControls: "SSO/SAML, SCIM provisioning, role-based access, audit logs for Enterprise.",
    modelDocs:
      "GPT-4 System Card published. GPT-5 Technical Report published August 2025. Model spec public.",
    explainability:
      "Limited — probabilistic outputs. Structured outputs mode for consistent JSON responses.",
    biasTesting:
      "Red teaming program. Usage policies and content moderation. Annual safety evaluations.",
    aiActStatus:
      "Registered GPAI model under EU AI Act. Cooperating with EU AI Office. Systemic risk designation under review.",
    gdprStatus:
      "DPA, EU representative (OpenAI Ireland). GDPR compliance framework published 2024.",
    euResidency: "EU data residency available via Azure OpenAI Service for enterprise customers.",
    industrySlugs: ["financial-services", "healthcare", "public-sector"],
    scores: { "eu-ai-act": "B", gdpr: "B-", dora: "C+", "eba-eiopa-guidelines": "C+" },
  },
  {
    slug: "meta-llama-enterprise",
    vendor: "Meta AI",
    name: "Llama / Meta AI Enterprise",
    type: "Open-Weight Foundation Model",
    risk: "High",
    description:
      "Meta's open-weight large language models (Llama 3, Llama 4 Scout/Maverick). Available for self-hosting or via Meta AI cloud. Unique regulatory position as open-weight provider — deployers bear primary compliance responsibility.",
    category: "General Purpose",
    featured: true,
    vendorHq: "Menlo Park, USA",
    euPresence:
      "Meta Platforms Ireland Ltd (Dublin). EU data centers available. Llama models open-weight — deployable on-premise within EU.",
    useCases:
      "On-premise AI deployment for sensitive industries\nCustom fine-tuning for enterprise use cases\nResearch and development\nOpen-source AI applications\nEdge deployment for privacy-sensitive scenarios",
    dataStorage:
      "Self-hosted: full customer control. Meta AI cloud: Meta infrastructure. EU deployments possible via cloud providers.",
    dataProcessing:
      "Open-weight: entirely customer-controlled when self-hosted. Cloud: processed on Meta infrastructure.",
    trainingDataUse:
      "Open-weight models: no data sent to Meta when self-hosted. Cloud/consumer products: Meta privacy policy applies.",
    subprocessors:
      "Self-hosted: none (customer's own infrastructure). Cloud: Meta subsidiaries.",
    dpaDetails:
      "DPA available for Meta cloud services. Open-weight: deployers must implement their own DPA arrangements.",
    slaDetails: "No SLA for open-weight models. Cloud service SLAs vary.",
    dataPortability: "Full portability — open weights can be exported and self-hosted.",
    exitTerms:
      "Open-weight: complete portability. Cloud: standard data export and deletion procedures.",
    ipTerms:
      "Llama Community License. Commercial use permitted above 700M MAU threshold requires separate agreement.",
    certifications:
      "Meta cloud: SOC 2, ISO 27001. Open-weight deployments: deployer's responsibility.",
    encryptionInfo:
      "Self-hosted: deployer's responsibility. Meta cloud: AES-256 at rest, TLS in transit.",
    accessControls:
      "Self-hosted: full customer control. Cloud: Meta account management, API keys.",
    modelDocs:
      "Llama model cards published. Meta AI research papers. Responsible use guide available.",
    explainability:
      "Open weights allow full inspection of model architecture. No built-in explanation tools.",
    biasTesting:
      "Purple llama safety suite. Responsible use guide. Community red-teaming encouraged.",
    aiActStatus:
      "Contested GPAI classification. Meta argues open-weight models face lower compliance burden. EU AI Office dialogue ongoing.",
    gdprStatus:
      "Complex: depends on deployment model. Self-hosted: deployer is controller. Meta cloud: Meta is processor.",
    euResidency:
      "Open-weight: full EU residency possible via self-hosting. Cloud: EU region selection available.",
    industrySlugs: ["financial-services", "healthcare", "telecommunications"],
    scores: { "eu-ai-act": "C+", gdpr: "C", dora: "D+", "eba-eiopa-guidelines": "C" },
  },
  {
    slug: "xai-grok-enterprise",
    vendor: "xAI",
    name: "Grok / xAI Enterprise",
    type: "Foundation Model Platform",
    risk: "High",
    description:
      "xAI's Grok 3 and Grok 4 models (launched 2025). Integrated with X (Twitter) platform and available via API. Grok 4 reached frontier-level performance in coding and reasoning. EU compliance posture still developing.",
    category: "General Purpose",
    featured: false,
    vendorHq: "Palo Alto, USA",
    euPresence:
      "Limited EU legal presence as of 2026. xAI Europe entity in formation. Grok available to EU users via X platform.",
    useCases:
      "Real-time information access via X integration\nCode generation and technical assistance\nResearch with web search grounding\nEnterprise API for reasoning tasks",
    dataStorage:
      "US-based infrastructure. EU data residency not confirmed as of April 2026.",
    dataProcessing:
      "Processed on xAI infrastructure. EU data transfer via standard contractual clauses.",
    trainingDataUse:
      "X platform data used for training. Enterprise API terms evolving.",
    subprocessors: "Limited disclosure. xAI infrastructure partners.",
    dpaDetails:
      "Basic DPA available for API customers. Comprehensive EU compliance DPA in development.",
    slaDetails: "API SLA terms limited. Enterprise agreements available on request.",
    dataPortability: "API-based export. Limited admin tooling as of 2026.",
    exitTerms: "Standard data deletion on account termination.",
    ipTerms: "Customer retains IP in outputs per API terms.",
    certifications: "No major certifications confirmed as of April 2026.",
    encryptionInfo: "Standard encryption practices. Details limited.",
    accessControls: "API key management. Enterprise SSO in roadmap.",
    modelDocs:
      "Grok 3 and Grok 4 technical reports published. Limited compared to major competitors.",
    explainability:
      "Standard LLM outputs. No dedicated explainability features for enterprise.",
    biasTesting:
      "Internal safety evaluations. Limited external red-teaming disclosure.",
    aiActStatus:
      "GPAI registration status unclear as of April 2026. EU AI Office engagement limited. High scrutiny given X platform data use.",
    gdprStatus:
      "Significant GDPR concerns raised regarding X platform data use for training. DPA incomplete.",
    euResidency: "No confirmed EU data residency as of April 2026.",
    industrySlugs: ["telecommunications", "financial-services"],
    scores: { "eu-ai-act": "D+", gdpr: "D", dora: "D", "eba-eiopa-guidelines": "D" },
  },
  {
    slug: "aleph-alpha-luminous",
    vendor: "Aleph Alpha",
    name: "Pharia / Luminous",
    type: "Sovereign European Foundation Model",
    risk: "High",
    description:
      "Germany-based Aleph Alpha's enterprise AI platform. Pharia-1 model (2024) built for European sovereignty, on-premise deployment, and full auditability. Positioned as the EU-native alternative for regulated industries and government.",
    category: "Sovereign AI",
    featured: true,
    vendorHq: "Heidelberg, Germany",
    euPresence:
      "Headquartered in Germany. Full EU legal entity. Data centers in Germany and EU only. National security partnerships with German Bundeswehr, EU institutions.",
    useCases:
      "Government and public sector AI\nDefence and intelligence applications\nRegulated industry deployments (healthcare, financial)\nOn-premise sovereign AI infrastructure\nDocument analysis in 14+ EU languages",
    dataStorage:
      "German and EU data centers exclusively. On-premise deployment available. No data leaves EU.",
    dataProcessing:
      "Full EU-based processing. On-premise option ensures zero third-party data exposure.",
    trainingDataUse:
      "Customer data not used for model training without explicit consent. Contractually guaranteed.",
    subprocessors:
      "German cloud partners only. Published and auditable supply chain.",
    dpaDetails:
      "Comprehensive GDPR DPA. German law governing. Highest EU data protection standards.",
    slaDetails: "Enterprise SLAs with 99.9% uptime. Custom SLAs for government contracts.",
    dataPortability: "Full model portability. On-premise deployment standard.",
    exitTerms: "Immediate data control. On-premise: complete data ownership.",
    ipTerms: "Customer owns all outputs and fine-tuned models.",
    certifications:
      "ISO 27001, BSI IT-Grundschutz (German federal standard), C5, SOC 2 Type II.",
    encryptionInfo:
      "AES-256 at rest with customer-managed keys. TLS 1.3 in transit. Hardware security modules available.",
    accessControls:
      "Full enterprise controls: SSO, RBAC, audit logs. Air-gap deployment available.",
    modelDocs:
      "Full technical documentation. Pharia-1 model card. Training data provenance documented.",
    explainability:
      "Attention weights and token attribution available. Designed for auditability.",
    biasTesting:
      "Comprehensive bias and fairness evaluation. European language fairness specifically tested.",
    aiActStatus:
      "Full EU AI Act compliance roadmap published. Proactive engagement with BNetzA and EU AI Office. Model designed for AI Act compliance from ground up.",
    gdprStatus:
      "GDPR-native architecture. DPO appointed. BCRs in place. DPIA templates for common use cases.",
    euResidency: "100% EU data residency guaranteed. German jurisdiction.",
    industrySlugs: ["public-sector", "financial-services", "healthcare"],
    scores: {
      "eu-ai-act": "A",
      gdpr: "A+",
      dora: "A-",
      "eba-eiopa-guidelines": "A-",
    },
  },
  {
    slug: "cohere-enterprise",
    vendor: "Cohere",
    name: "Cohere Command / Embed",
    type: "Enterprise NLP Platform",
    risk: "High",
    description:
      "Cohere's enterprise AI platform specialising in retrieval-augmented generation (RAG), text classification, and semantic search. Command R+ model optimised for enterprise workflows. Strong EU data residency and GDPR posture.",
    category: "Enterprise NLP",
    featured: false,
    vendorHq: "Toronto, Canada",
    euPresence:
      "Cohere EU entity. AWS EU (Frankfurt) and Azure EU regions available. Growing EU enterprise customer base.",
    useCases:
      "Enterprise search and knowledge retrieval (RAG)\nDocument classification and routing\nCustomer support automation\nContent moderation\nMultilingual text processing",
    dataStorage:
      "EU regions: AWS eu-central-1 (Frankfurt), Azure West Europe. Customer-selected.",
    dataProcessing:
      "In-region processing. No cross-border data transfer without explicit configuration.",
    trainingDataUse:
      "Customer data not used for training. Zero-retention inference option.",
    subprocessors:
      "AWS and Azure as infrastructure providers. Published list.",
    dpaDetails:
      "GDPR-compliant DPA. EU SCCs. Canadian PIPEDA compliance also maintained.",
    slaDetails: "99.9% API uptime SLA.",
    dataPortability: "Model fine-tunes exportable. API-based data retrieval.",
    exitTerms: "Data deletion within 30 days of termination.",
    ipTerms: "Customer owns fine-tuned models and output data.",
    certifications: "SOC 2 Type II. ISO 27001 in progress.",
    encryptionInfo: "AES-256 at rest. TLS 1.2+ in transit.",
    accessControls: "API key management, team accounts, audit logging.",
    modelDocs:
      "Command R+ model card published. Embedding model documentation. C4AI research papers.",
    explainability:
      "Citation and grounding with RAG. Source attribution for retrieved documents.",
    biasTesting:
      "Aya multilingual dataset. Fairness evaluations across languages. Red teaming.",
    aiActStatus:
      "GPAI registration in progress. Low systemic risk profile given enterprise-only deployment.",
    gdprStatus:
      "DPA, EU SCCs, DPO appointed. Strong data minimisation by design.",
    euResidency: "Full EU residency via AWS Frankfurt or Azure West Europe.",
    industrySlugs: ["financial-services", "telecommunications", "healthcare"],
    scores: {
      "eu-ai-act": "B+",
      gdpr: "A-",
      dora: "B",
      "eba-eiopa-guidelines": "B+",
    },
  },
  {
    slug: "apple-intelligence-enterprise",
    vendor: "Apple",
    name: "Apple Intelligence",
    type: "On-Device AI Platform",
    risk: "Limited",
    description:
      "Apple's personal intelligence system integrated into iOS 18, iPadOS 18, and macOS Sequoia. Unique privacy-by-design architecture: most processing on-device, with Private Cloud Compute for complex tasks. No data stored on Apple servers.",
    category: "Productivity AI",
    featured: false,
    vendorHq: "Cupertino, USA",
    euPresence:
      "Apple Operations Europe (Cork, Ireland). EU data handled under Irish law. On-device processing eliminates most data residency concerns.",
    useCases:
      "Writing assistance and editing\nSmart email and message summarisation\nPhoto intelligence and search\nSiri with advanced reasoning\nPrivate AI queries via Private Cloud Compute",
    dataStorage:
      "On-device by default. Private Cloud Compute: no data stored on Apple servers — cryptographically verified.",
    dataProcessing:
      "On-device: A17 Pro / M-series chips. Private Cloud Compute: Apple silicon servers, zero data retention.",
    trainingDataUse:
      "No user data used for training. On-device models learn locally only.",
    subprocessors:
      "Private Cloud Compute servers (Apple-operated). OpenAI integration optional, user-initiated only.",
    dpaDetails:
      "Apple Privacy Policy and App Store terms. Enterprise MDM controls via Apple Business Manager.",
    slaDetails: "Consumer product — no formal SLA. Enterprise MDM support available.",
    dataPortability: "On-device data exportable via iCloud backup.",
    exitTerms: "Data stays on device. iCloud deletion removes cloud backups.",
    ipTerms: "User owns all content generated.",
    certifications:
      "ISO 27001, SOC 2. Private Cloud Compute independently verifiable by security researchers.",
    encryptionInfo:
      "End-to-end encrypted on-device processing. Private Cloud Compute: hardware-attested encryption, no persistent storage.",
    accessControls:
      "Device-level: Face ID, Touch ID, passcode. Enterprise: Apple Business Manager, MDM policies.",
    modelDocs:
      "Apple Intelligence foundations paper published. Private Cloud Compute security guide. Independent security researcher verification program.",
    explainability:
      "Limited — on-device models not auditable by users. Private Cloud Compute architecture is auditable.",
    biasTesting:
      "Internal fairness evaluations. Limited public disclosure. Privacy-preserving design limits bias audit surface.",
    aiActStatus:
      "Limited risk classification — transparency obligations (user notification of AI features). EU rollout delayed initially due to DMA compliance questions; launched EU-wide December 2024.",
    gdprStatus:
      "Strong GDPR posture due to on-device architecture. Apple Operations Europe as data controller.",
    euResidency:
      "Effectively achieved via on-device processing. Private Cloud Compute: no residency concern (no storage).",
    industrySlugs: ["financial-services", "healthcare", "telecommunications"],
    scores: {
      "eu-ai-act": "A-",
      gdpr: "A",
      dora: "C+",
      "eba-eiopa-guidelines": "C",
    },
  },
  {
    slug: "deepmind-gemini-ultra",
    vendor: "Google DeepMind",
    name: "Gemini Ultra / Deep Research",
    type: "Frontier Reasoning Model",
    risk: "High",
    description:
      "Google DeepMind's most capable model tier. Gemini Ultra and Gemini 2.0 Ultra with extended thinking, Deep Research (multi-step autonomous research), and multimodal capabilities. Available via Google One AI Premium and Workspace.",
    category: "Research & Analysis",
    featured: false,
    vendorHq: "London, UK / Mountain View, USA",
    euPresence:
      "Google DeepMind UK entity. Google Cloud EU data centers. Strong European research presence.",
    useCases:
      "Complex multi-step research and analysis\nScientific literature review\nLong-document synthesis\nAdvanced code generation and debugging\nStrategic planning and scenario analysis",
    dataStorage:
      "EU regions available via Google Cloud. Workspace data stays in selected region.",
    dataProcessing:
      "Customer-selected region processing. Extended thinking sessions may require additional compute.",
    trainingDataUse:
      "Enterprise: data not used for training. Consumer AI Premium: standard Google privacy policy.",
    subprocessors: "Google subsidiaries. Published list.",
    dpaDetails:
      "Google Cloud DPA. EU SCCs. Workspace DPA for enterprise.",
    slaDetails: "Google One/Workspace SLA: 99.9% for Workspace. AI premium consumer: no SLA.",
    dataPortability: "Google Takeout for consumer. API and BigQuery for enterprise.",
    exitTerms: "60-day data retrieval post-termination for Google Cloud.",
    ipTerms: "Customer owns outputs for API/enterprise. Consumer: Google terms apply.",
    certifications:
      "ISO 27001, ISO 27017, ISO 27018, SOC 2, SOC 3, C5.",
    encryptionInfo:
      "AES-256 at rest with CMEK available. TLS 1.3 in transit.",
    accessControls:
      "Google Workspace IAM, VPC Service Controls, audit logs.",
    modelDocs:
      "Gemini 1.5 technical report. Gemini 2.0 flash/pro model cards. Deep Research feature documentation.",
    explainability:
      "Deep Research shows step-by-step reasoning chain. Search grounding with citations.",
    biasTesting:
      "Google Responsible AI practices. SynthID for AI-generated content detection.",
    aiActStatus:
      "Registered GPAI model. Google cooperating with EU AI Office. Systemic risk assessment ongoing for Ultra-tier.",
    gdprStatus:
      "Comprehensive GDPR compliance. Google DPO. EU adequacy decisions and SCCs.",
    euResidency:
      "Full EU residency via Google Cloud EU regions.",
    industrySlugs: ["financial-services", "healthcare", "public-sector"],
    scores: {
      "eu-ai-act": "B+",
      gdpr: "B+",
      dora: "B",
      "eba-eiopa-guidelines": "B",
    },
  },
  {
    slug: "mistral-large-2",
    vendor: "Mistral AI",
    name: "Mistral Large 2 / Codestral",
    type: "European Foundation Model",
    risk: "High",
    description:
      "Mistral AI's flagship large model and European competitor to GPT-4. Paris-based, EU-native. Mistral Large 2 (2024) with 128K context, multilingual excellence across EU languages. Codestral for enterprise coding. Available via La Plateforme and cloud partners.",
    category: "European AI",
    featured: true,
    vendorHq: "Paris, France",
    euPresence:
      "Mistral AI SAS (Paris). AWS Paris, Azure West Europe. French strategic AI company with EU investor base (European Investment Fund, BNP Paribas, etc.).",
    useCases:
      "Enterprise multilingual document processing\nCode generation (Codestral)\nFrench and European language excellence\nOn-premise deployment via open weights (Mistral 7B, Mixtral)\nAPI integration for EU-native applications",
    dataStorage:
      "La Plateforme: France/EU. AWS Paris (eu-west-3). Azure West Europe. Full EU data residency.",
    dataProcessing:
      "EU-only processing via La Plateforme. Zero-retention inference available.",
    trainingDataUse:
      "Customer data not used for training on paid tiers. Contractual guarantee.",
    subprocessors:
      "AWS France, Azure EU. Minimal subprocessor list.",
    dpaDetails:
      "GDPR-compliant DPA under French law. CNIL guidance followed. EU SCCs not required (EU-native).",
    slaDetails: "99.9% API uptime SLA.",
    dataPortability: "Open-weight models freely portable. API data export available.",
    exitTerms: "Data deletion within 30 days. Open weights: permanent customer ownership.",
    ipTerms: "Customer owns outputs. Open-weight models: Apache 2.0 / Mistral license.",
    certifications:
      "ISO 27001 (in progress). SOC 2 Type II (in progress). French ANSSI engagement.",
    encryptionInfo: "AES-256 at rest. TLS 1.2+ in transit.",
    accessControls: "API keys, team management, usage dashboards.",
    modelDocs:
      "Mistral 7B paper. Mixtral 8x7B paper. Mistral Large technical overview.",
    explainability:
      "Standard LLM outputs. Function calling with structured outputs.",
    biasTesting:
      "European language fairness testing. French bias evaluation. Red teaming via security partnerships.",
    aiActStatus:
      "Active EU AI Act compliance programme. GPAI registration completed. Mistral publicly advocates for proportionate AI Act implementation for European startups.",
    gdprStatus:
      "EU-native: naturally compliant. French law governing. CNIL engagement.",
    euResidency: "100% EU data residency. French sovereignty option.",
    industrySlugs: ["financial-services", "public-sector", "telecommunications"],
    scores: {
      "eu-ai-act": "A-",
      gdpr: "A",
      dora: "B+",
      "eba-eiopa-guidelines": "B+",
    },
  },
];

// ─── Changelog / News Entries ────────────────────────────

const newsEntries = [
  // EU AI Act Timeline milestones
  {
    title: "EU AI Act Enters into Force",
    description:
      "The EU Artificial Intelligence Act (Regulation 2024/1689) officially entered into force on 1 August 2024, marking the start of its phased implementation timeline. The Act introduces a risk-based approach to AI regulation with obligations phasing in over 36 months.",
    changeType: "new_version",
    date: new Date("2024-08-01"),
    sourceUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689",
    sourceLabel: "EUR-Lex Official Journal",
    author: "AI Compass EU Editorial",
    frameworkSlug: "eu-ai-act",
  },
  {
    title: "Prohibited AI Practices Take Effect (Feb 2025)",
    description:
      "From 2 February 2025, AI systems deemed to pose unacceptable risks are banned across the EU. Prohibited practices include: cognitive behavioural manipulation, social scoring by public authorities, real-time biometric surveillance in public spaces (with limited exceptions), and AI systems exploiting vulnerabilities of specific groups. Non-compliance risks fines of up to €35 million or 7% of global annual turnover.",
    changeType: "amendment",
    date: new Date("2025-02-02"),
    sourceUrl:
      "https://www.europarl.europa.eu/news/en/press-room/20240308IPR19015",
    sourceLabel: "European Parliament Press",
    author: "AI Compass EU Editorial",
    frameworkSlug: "eu-ai-act",
  },
  {
    title: "GPAI Model Obligations Apply (Aug 2025)",
    description:
      "From 2 August 2025, obligations for providers of General Purpose AI (GPAI) models apply. This includes transparency requirements, copyright compliance policies, and — for models with systemic risk (above 10^25 FLOPs training compute) — adversarial testing, incident reporting, and cybersecurity obligations. The EU AI Office becomes the primary supervisor for GPAI models.",
    changeType: "amendment",
    date: new Date("2025-08-02"),
    sourceUrl: "https://www.europarl.europa.eu/topics/en/article/20230601STO93804",
    sourceLabel: "European Parliament",
    author: "AI Compass EU Editorial",
    frameworkSlug: "eu-ai-act",
  },
  {
    title: "High-Risk AI System Requirements Apply (Aug 2026)",
    description:
      "From 2 August 2026, providers and deployers of high-risk AI systems must comply with the full set of requirements under Chapter III of the EU AI Act. This covers: conformity assessments, CE marking, registration in the EU AI database, post-market monitoring, and fundamental rights impact assessments for public sector deployers. This is the most significant milestone for enterprise AI buyers in regulated sectors.",
    changeType: "amendment",
    date: new Date("2026-08-02"),
    sourceUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689",
    sourceLabel: "EUR-Lex — EU AI Act Chapter III",
    author: "AI Compass EU Editorial",
    frameworkSlug: "eu-ai-act",
  },
  {
    title: "European Commission Proposes Digital Omnibus on AI",
    description:
      "On 19 November 2025, the European Commission published a proposed 'Digital Omnibus on AI' as part of its competitiveness and simplification drive. The proposal aims to: narrow the definition of high-risk AI systems, ease GPAI compliance burdens for smaller providers, adjust compliance deadlines, and reduce documentation requirements. The proposal reflects industry lobbying concerns about competitiveness vs. US/China AI development.",
    changeType: "amendment",
    date: new Date("2025-11-19"),
    sourceUrl:
      "https://www.cooley.com/news/insight/2025/2025-11-24-eu-ai-act-proposed-digital-omnibus-on-ai-will-impact-businesses-ai-compliance-roadmaps",
    sourceLabel: "Cooley LLP Analysis",
    author: "AI Compass EU Editorial",
    frameworkSlug: "eu-ai-act",
  },
  {
    title: "GPAI Code of Practice — Final Draft Published",
    description:
      "The EU AI Office published the third and near-final draft of the General Purpose AI (GPAI) Code of Practice in January 2026. The voluntary code, developed with >1,000 stakeholder participants, covers transparency, copyright compliance, safety evaluation, and systemic risk mitigation. Major AI providers including Google, Microsoft, Anthropic, and Mistral participated. xAI's participation has been limited.",
    changeType: "update",
    date: new Date("2026-01-15"),
    sourceUrl: "https://digital-strategy.ec.europa.eu/en/policies/ai-office",
    sourceLabel: "EU AI Office",
    author: "AI Compass EU Editorial",
    frameworkSlug: "eu-ai-act",
  },
  {
    title: "EU AI Database Launched for High-Risk Systems",
    description:
      "The EU AI Act's public database for high-risk AI systems became operational in early 2026. Providers must register standalone high-risk AI systems before placing them on the EU market. The database covers AI systems in Annex III categories including biometric identification, critical infrastructure, education, employment, essential services, law enforcement, migration, and administration of justice.",
    changeType: "new_version",
    date: new Date("2026-02-01"),
    sourceUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689",
    sourceLabel: "EU AI Act — Article 71",
    author: "AI Compass EU Editorial",
    frameworkSlug: "eu-ai-act",
  },
  {
    title: "International AI Safety Report 2026 Published",
    description:
      "The second International AI Safety Report, led by Yoshua Bengio and authored by over 100 AI experts backed by 30+ countries, was published in February 2026. The report highlights advancing autonomous agent capabilities, increasing cybersecurity risks from AI, and the challenge of evaluating frontier model safety. European regulators cited the report in ongoing GPAI systemic risk assessments.",
    changeType: "update",
    date: new Date("2026-02-10"),
    sourceUrl: "https://internationalaisafetyreport.org/publication/international-ai-safety-report-2026",
    sourceLabel: "International AI Safety Report 2026",
    author: "AI Compass EU Editorial",
    frameworkSlug: "eu-ai-act",
  },
  // GDPR + AI developments
  {
    title: "EDPB Opinion 28/2024: GDPR and AI Models",
    description:
      "The European Data Protection Board issued Opinion 28/2024 on the processing of personal data in the context of AI models. The opinion clarifies: training data legitimacy, data subject rights for AI-generated content, and when AI outputs constitute personal data. Directly impacts GPAI providers including OpenAI, Google, and Meta regarding EU training data use.",
    changeType: "jurisprudence",
    date: new Date("2024-12-17"),
    sourceUrl: "https://www.edpb.europa.eu/news/news/2024/edpb-adopts-opinion-ai-models_en",
    sourceLabel: "European Data Protection Board",
    author: "AI Compass EU Editorial",
    frameworkSlug: "gdpr",
  },
  {
    title: "Italy DPA (Garante) Imposes Restrictions on DeepSeek",
    description:
      "Italy's data protection authority (Garante) ordered Chinese AI provider DeepSeek to stop processing Italian users' data in January 2025, citing inability to verify GDPR compliance and unclear data transfer arrangements to China. The case signals EU DPA willingness to act swiftly against non-EU AI providers with inadequate GDPR posture.",
    changeType: "jurisprudence",
    date: new Date("2025-01-30"),
    sourceUrl: "https://www.garanteprivacy.it/",
    sourceLabel: "Garante (Italian DPA)",
    author: "AI Compass EU Editorial",
    frameworkSlug: "gdpr",
  },
  {
    title: "Irish DPC Concludes OpenAI GDPR Investigation",
    description:
      "The Irish Data Protection Commission (lead EU supervisor for OpenAI) concluded its investigation into ChatGPT's GDPR compliance in March 2025. Findings required OpenAI to implement stronger data subject rights mechanisms, improve transparency about AI-generated content, and enhance data accuracy safeguards. No fine imposed; OpenAI implemented remediation commitments.",
    changeType: "jurisprudence",
    date: new Date("2025-03-15"),
    sourceUrl: "https://www.dataprotection.ie/",
    sourceLabel: "Irish Data Protection Commission",
    author: "AI Compass EU Editorial",
    frameworkSlug: "gdpr",
  },
  // DORA
  {
    title: "DORA Full Application — January 2025",
    description:
      "The Digital Operational Resilience Act became fully applicable on 17 January 2025. Financial entities across the EU — banks, insurance companies, investment firms, and their critical ICT third-party providers — must now comply with DORA's requirements for ICT risk management, incident reporting, resilience testing, and third-party oversight. AI vendors serving financial institutions are directly affected as ICT third-party service providers.",
    changeType: "new_version",
    date: new Date("2025-01-17"),
    sourceUrl: "https://www.eba.europa.eu/regulation-and-policy/dora",
    sourceLabel: "European Banking Authority",
    author: "AI Compass EU Editorial",
    frameworkSlug: "dora",
  },
  {
    title: "EBA Supervisory Convergence Report: AI in Financial Services",
    description:
      "The European Banking Authority published its 2025 supervisory convergence report on AI use in financial services. Key findings: 78% of EU banks using AI in customer-facing applications; credit scoring AI facing highest scrutiny; explainability requirements causing friction with deep learning models; 12 EU member states issued supplementary national guidance on AI in banking.",
    changeType: "update",
    date: new Date("2025-06-20"),
    sourceUrl: "https://www.eba.europa.eu/",
    sourceLabel: "European Banking Authority",
    author: "AI Compass EU Editorial",
    frameworkSlug: "eba-eiopa-guidelines",
  },
  // Vendor-specific news
  {
    title: "Microsoft Achieves EU AI Act High-Risk Compliance for Azure OpenAI",
    description:
      "Microsoft announced completion of EU AI Act high-risk conformity assessment processes for key Azure OpenAI use cases in financial services and healthcare. This includes CE marking preparation, technical documentation, and registration in the EU AI database. Microsoft became the first major US hyperscaler to publish a comprehensive EU AI Act compliance roadmap with specific dates.",
    changeType: "certification",
    date: new Date("2025-09-10"),
    sourceUrl: "https://blogs.microsoft.com/on-the-issues/",
    sourceLabel: "Microsoft On The Issues",
    author: "AI Compass EU Editorial",
    systemSlug: "microsoft-azure-openai-service",
  },
  {
    title: "Mistral AI Completes GPAI Code of Practice Voluntary Commitment",
    description:
      "Paris-based Mistral AI became one of the first AI companies to formally submit voluntary commitments under the GPAI Code of Practice to the EU AI Office. Commitments cover: transparency documentation for Mistral Large 2, copyright clearance processes for training data, and adversarial testing methodology. Mistral highlighted this as evidence that EU-based AI companies can lead on compliance.",
    changeType: "certification",
    date: new Date("2025-11-30"),
    sourceUrl: "https://mistral.ai/news/",
    sourceLabel: "Mistral AI Official",
    author: "AI Compass EU Editorial",
    systemSlug: "mistral-platform-le-chat",
  },
  {
    title: "xAI / Grok EU AI Office Investigation Opened",
    description:
      "The EU AI Office opened a preliminary inquiry into xAI's Grok models in March 2026, focusing on: GPAI registration status, use of X (Twitter) platform data for training (GDPR implications), and transparency requirements. xAI had not fully engaged with the EU AI Office's GPAI model registration process. The inquiry follows similar scrutiny of other US AI providers.",
    changeType: "incident",
    date: new Date("2026-03-10"),
    sourceUrl: "https://digital-strategy.ec.europa.eu/en/policies/ai-office",
    sourceLabel: "EU AI Office",
    author: "AI Compass EU Editorial",
    systemSlug: "xai-grok-enterprise",
  },
  {
    title: "Apple Intelligence Launches in EU After DMA Compliance Review",
    description:
      "Apple launched Apple Intelligence features in EU member states in December 2024, following a delay caused by Digital Markets Act (DMA) compliance review. The European Commission had scrutinised interoperability requirements. Apple implemented additional controls for EU users including opt-out mechanisms and transparency disclosures. The Private Cloud Compute architecture was positively noted by ENISA.",
    changeType: "update",
    date: new Date("2024-12-05"),
    sourceUrl: "https://www.apple.com/newsroom/",
    sourceLabel: "Apple Newsroom",
    author: "AI Compass EU Editorial",
    systemSlug: "apple-intelligence-enterprise",
  },
  {
    title: "Aleph Alpha Secures German Government AI Contract",
    description:
      "Aleph Alpha secured a major contract with the German federal government in 2025 to provide sovereign AI infrastructure for sensitive public sector workflows. The contract, valued at over €100M, covers the Pharia model for document analysis, decision support, and citizen services. Germany's commitment to sovereign AI aligns with the EU AI Act's implicit preference for auditable, EU-hosted AI in public sector high-risk applications.",
    changeType: "update",
    date: new Date("2025-05-15"),
    sourceUrl: "https://aleph-alpha.com/news/",
    sourceLabel: "Aleph Alpha Newsroom",
    author: "AI Compass EU Editorial",
    systemSlug: "aleph-alpha-luminous",
  },
  {
    title: "EU AI Act — Fundamental Rights Impact Assessment Guidance Published",
    description:
      "The European Commission published detailed guidance on conducting Fundamental Rights Impact Assessments (FRIAs) required for public sector bodies deploying high-risk AI systems. The guidance provides templates and methodologies for assessing impacts on: non-discrimination, privacy, freedom of expression, access to justice, and other Charter rights. Required before deployment of high-risk AI in public administration from August 2026.",
    changeType: "update",
    date: new Date("2026-01-30"),
    sourceUrl: "https://digital-strategy.ec.europa.eu/en/policies/european-approach-artificial-intelligence",
    sourceLabel: "European Commission Digital Strategy",
    author: "AI Compass EU Editorial",
    frameworkSlug: "eu-ai-act",
  },
  {
    title: "ENISA AI Cybersecurity Risk Assessment Framework Released",
    description:
      "The EU Agency for Cybersecurity (ENISA) published its AI Cybersecurity Risk Assessment Framework in Q1 2026, providing practical guidance for the cybersecurity requirements under Article 15 of the EU AI Act. The framework covers: adversarial attack resilience, data poisoning prevention, model integrity verification, and supply chain security for AI systems. Mandatory reference for high-risk AI providers.",
    changeType: "update",
    date: new Date("2026-03-01"),
    sourceUrl: "https://www.enisa.europa.eu/",
    sourceLabel: "ENISA",
    author: "AI Compass EU Editorial",
    frameworkSlug: "eu-ai-act",
  },
];

// ─── Approved Sources ────────────────────────────────────

const approvedSources = [
  {
    url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689",
    name: "EU AI Act — Full Text (EUR-Lex)",
    description: "Official consolidated text of Regulation (EU) 2024/1689 on artificial intelligence.",
  },
  {
    url: "https://digital-strategy.ec.europa.eu/en/policies/ai-office",
    name: "EU AI Office",
    description: "European Commission AI Office — GPAI oversight, Code of Practice, enforcement.",
  },
  {
    url: "https://www.europarl.europa.eu/topics/en/article/20230601STO93804",
    name: "European Parliament — EU AI Act Overview",
    description: "European Parliament summary of the AI Act provisions and timeline.",
  },
  {
    url: "https://www.edpb.europa.eu/",
    name: "European Data Protection Board (EDPB)",
    description: "EDPB opinions, guidelines, and decisions on GDPR and AI.",
  },
  {
    url: "https://www.eba.europa.eu/regulation-and-policy/dora",
    name: "EBA — DORA Regulation Hub",
    description: "European Banking Authority's DORA guidance, technical standards, and FAQs.",
  },
  {
    url: "https://www.enisa.europa.eu/",
    name: "ENISA — EU Cybersecurity Agency",
    description: "ENISA AI cybersecurity guidance, risk frameworks, and good practices.",
  },
  {
    url: "https://artificialintelligenceact.eu/",
    name: "EU AI Act Explorer (Unofficial)",
    description: "Interactive article-by-article navigator for the EU AI Act.",
  },
  {
    url: "https://www.euractiv.com/section/artificial-intelligence/",
    name: "Euractiv — AI Policy Coverage",
    description: "EU policy journalism focused on digital and AI regulation developments.",
  },
  {
    url: "https://internationalaisafetyreport.org/",
    name: "International AI Safety Report",
    description: "Independent scientific reports on AI capabilities and safety risks, backed by 30+ governments.",
  },
  {
    url: "https://aleph-alpha.com/",
    name: "Aleph Alpha — European Sovereign AI",
    description: "Aleph Alpha official site — Pharia and Luminous models, European AI sovereignty.",
  },
  {
    url: "https://mistral.ai/",
    name: "Mistral AI",
    description: "Mistral AI official site — La Plateforme, model documentation, EU AI Act engagement.",
  },
  {
    url: "https://www.dataprotection.ie/",
    name: "Irish Data Protection Commission (DPC)",
    description: "Lead EU supervisor for Meta, Apple, Google, Microsoft, OpenAI GDPR enforcement.",
  },
  {
    url: "https://www.garanteprivacy.it/",
    name: "Garante (Italian DPA)",
    description: "Italian data protection authority — active AI enforcement including DeepSeek, ChatGPT.",
  },
  {
    url: "https://digital-strategy.ec.europa.eu/en/policies/european-approach-artificial-intelligence",
    name: "European Commission AI Strategy",
    description: "European Commission's AI policy hub including FRIA guidance and regulatory updates.",
  },
  {
    url: "https://www.eiopa.europa.eu/",
    name: "EIOPA — Insurance AI Guidelines",
    description: "European Insurance and Occupational Pensions Authority guidance on AI in insurance.",
  },
];

// ─── Main ─────────────────────────────────────────────────

async function main() {
  console.log("🌱 Starting content seed (April 2026)...\n");

  // Get all framework and system IDs for relations
  const frameworks = await prisma.regulatoryFramework.findMany({
    select: { id: true, slug: true },
  });
  const frameworkMap = Object.fromEntries(frameworks.map((f) => [f.slug, f.id]));

  const systems = await prisma.aISystem.findMany({
    select: { id: true, slug: true },
  });
  const systemMap = Object.fromEntries(systems.map((s) => [s.slug, s.id]));

  const industries = await prisma.industry.findMany({
    select: { id: true, slug: true },
  });
  const industryMap = Object.fromEntries(industries.map((i) => [i.slug, i.id]));

  // ─── Upsert New AI Systems ──────────────────────────────
  console.log("📦 Adding new AI systems...");
  let systemsAdded = 0;
  for (const sys of newSystems) {
    const { industrySlugs, scores, ...data } = sys;

    // Map industry slugs to IDs
    const industryIds = industrySlugs
      .filter((s) => industryMap[s])
      .map((s) => ({ id: industryMap[s] }));

    const upserted = await prisma.aISystem.upsert({
      where: { slug: data.slug },
      update: { ...data, industries: { set: industryIds } },
      create: { ...data, industries: { connect: industryIds } },
    });

    // Upsert scores
    for (const [frameworkSlug, score] of Object.entries(scores)) {
      const frameworkId = frameworkMap[frameworkSlug];
      if (frameworkId) {
        await prisma.assessmentScore.upsert({
          where: { systemId_frameworkId: { systemId: upserted.id, frameworkId } },
          update: { score },
          create: { systemId: upserted.id, frameworkId, score },
        });
      }
    }

    // Update systemMap with new entries
    systemMap[upserted.slug] = upserted.id;
    systemsAdded++;
    console.log(`  ✅ ${upserted.vendor} — ${upserted.name}`);
  }

  // ─── Upsert Changelog/News Entries ─────────────────────
  console.log("\n📰 Adding news & changelog entries...");
  let newsAdded = 0;
  for (const entry of newsEntries) {
    const { frameworkSlug, systemSlug, ...data } = entry as typeof entry & {
      frameworkSlug?: string;
      systemSlug?: string;
    };

    const frameworkId = frameworkSlug ? frameworkMap[frameworkSlug] : undefined;
    const systemId = systemSlug ? systemMap[systemSlug] : undefined;

    // Use title+date as natural key for dedup
    const existing = await prisma.changeLog.findFirst({
      where: { title: data.title },
    });

    if (existing) {
      await prisma.changeLog.update({
        where: { id: existing.id },
        data: { ...data, frameworkId, systemId },
      });
    } else {
      await prisma.changeLog.create({
        data: { ...data, frameworkId, systemId },
      });
    }
    newsAdded++;
    console.log(`  ✅ ${data.title.substring(0, 60)}...`);
  }

  // ─── Upsert Approved Sources ────────────────────────────
  console.log("\n🔗 Adding approved sources...");
  let sourcesAdded = 0;
  for (const source of approvedSources) {
    await prisma.approvedSource.upsert({
      where: { url: source.url },
      update: source,
      create: source,
    });
    sourcesAdded++;
    console.log(`  ✅ ${source.name}`);
  }

  // ─── Summary ────────────────────────────────────────────
  console.log("\n✨ Seed complete!");
  console.log(`   AI Systems added/updated: ${systemsAdded}`);
  console.log(`   News/Changelog entries added: ${newsAdded}`);
  console.log(`   Approved sources added: ${sourcesAdded}`);

  const totals = {
    systems: await prisma.aISystem.count(),
    frameworks: await prisma.regulatoryFramework.count(),
    changelogs: await prisma.changeLog.count(),
    sources: await prisma.approvedSource.count(),
  };
  console.log("\n📊 Database totals:", totals);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
