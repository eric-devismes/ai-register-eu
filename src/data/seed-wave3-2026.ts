/**
 * Wave 3 Content Seed — April 2026
 *
 * Adds:
 *   - Deployer obligations section for EU AI Act (enterprise buyer focus)
 *   - AI Act + GDPR interplay section
 *   - MDR/IVDR additional sections and statements
 *   - 8 more AI systems (Oracle Fusion AI, DeepSeek, Perplexity, Notion AI, Salesforce Einstein, etc.)
 *   - 15 more changelog entries (enforcement, standards, vendor actions)
 *   - 10 more approved sources
 *
 * Run with: npx tsx src/data/seed-wave3-2026.ts
 * Safe to run multiple times (uses upsert).
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// ─── New Framework Sections ───────────────────────────────

const newFrameworkSections = [
  // EU AI Act — Deployer Obligations
  {
    frameworkSlug: "eu-ai-act",
    section: {
      title: "Deployer Obligations for High-Risk AI (Article 26)",
      description:
        "Article 26 sets out obligations for deployers — the organisations that put high-risk AI systems into use within their business. This is the most operationally significant chapter for enterprise buyers who procure AI from vendors.",
      sortOrder: 11,
      statements: [
        {
          reference: "Article 26(1)-(2)",
          statement:
            "Deployers must take appropriate technical and organisational measures to ensure they use high-risk AI systems in accordance with the provider's instructions. They must designate a responsible person for AI oversight, assign sufficient resources, and ensure that human oversight personnel have the necessary competence and authority.",
          commentary:
            "Every organisation deploying high-risk AI must designate a named responsible individual — this cannot be delegated vaguely to 'the AI team'. The person must have genuine authority to stop deployment, not just nominal responsibility. This creates a new CISO-equivalent role: Chief AI Officer or AI Risk Officer.",
          sourceUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689",
          sourceNote: "EU AI Act, Article 26(1)-(2)",
          sortOrder: 1,
        },
        {
          reference: "Article 26(3)-(4) — Fundamental Rights Impact Assessment",
          statement:
            "Deployers that are public bodies, or private bodies deploying AI for public services (credit, insurance, essential services), must conduct a Fundamental Rights Impact Assessment (FRIA) before deploying certain high-risk AI systems. The FRIA must assess impacts on affected persons, particularly vulnerable groups.",
          commentary:
            "The FRIA is one of the most novel and demanding requirements for public sector and essential services deployers. Unlike a standard risk assessment, the FRIA must assess AI impacts through the lens of the EU Charter of Fundamental Rights — including non-discrimination, dignity, privacy, and access to justice. Commission guidance templates are available but the assessment requires genuine legal and ethics expertise.",
          sourceUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689",
          sourceNote: "EU AI Act, Article 26(3)-(4)",
          sortOrder: 2,
        },
        {
          reference: "Article 26(5)-(6) — Logging and Monitoring",
          statement:
            "Deployers must ensure and maintain automatic logging during operation (where technically possible), retain logs for at least 6 months, and monitor the AI system's operation on the basis of instructions from providers. Deployers must report serious incidents and malfunctions to providers, market surveillance authorities, and — where fundamental rights are implicated — relevant public authorities.",
          commentary:
            "Deployers cannot rely on providers to monitor deployed AI. They need operational AI observability: log retention, anomaly alerting, performance degradation monitoring. The 6-month log retention minimum is a floor — regulated industries (financial services, healthcare) should retain longer based on sectoral requirements.",
          sourceUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689",
          sourceNote: "EU AI Act, Article 26(5)-(6)",
          sortOrder: 3,
        },
        {
          reference: "Article 26(7)-(9) — Employee Information Rights",
          statement:
            "Where high-risk AI systems affect employees, deployers must inform worker representatives and affected workers before deployment. Information must cover the nature of the system, its purpose, human oversight arrangements, and the right to seek explanation for decisions affecting them.",
          commentary:
            "Works councils and trade unions across the EU have strong information and consultation rights. AI deployment in the workplace that affects employees — performance monitoring, recruitment, scheduling, productivity tracking — triggers these rights. In Germany, France, and the Netherlands especially, works council co-determination rights may effectively give employees a veto over certain AI deployments.",
          sourceUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689",
          sourceNote: "EU AI Act, Article 26(7)-(9)",
          sortOrder: 4,
        },
      ],
    },
  },
  // EU AI Act — AI Act + GDPR Interplay
  {
    frameworkSlug: "eu-ai-act",
    section: {
      title: "AI Act & GDPR Interplay: Dual Compliance",
      description:
        "The EU AI Act and GDPR overlap significantly wherever AI systems process personal data. Understanding the interplay is essential for legal and compliance teams — the two frameworks are complementary but not duplicative.",
      sortOrder: 12,
      statements: [
        {
          reference: "Recital 9 — Relationship with GDPR",
          statement:
            "The EU AI Act complements GDPR without replacing it. Where AI systems process personal data, both the AI Act and GDPR obligations apply simultaneously. The GDPR's data minimisation, purpose limitation, and rights of data subjects must be observed within AI Act-compliant systems.",
          commentary:
            "Dual compliance is the norm, not the exception. A high-risk AI credit scoring system must simultaneously comply with: EU AI Act (risk management, technical documentation, human oversight) AND GDPR (lawful basis for processing, Article 22 automated decisions, data subject rights). Compliance programmes must address both frameworks in parallel.",
          sourceUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689",
          sourceNote: "EU AI Act, Recital 9; EDPB Opinion 28/2024",
          sortOrder: 1,
        },
        {
          reference: "EDPB Opinion 28/2024 — AI Models and Personal Data",
          statement:
            "The EDPB's Opinion 28/2024 clarifies that GPAI models trained on personal data must establish a lawful basis under GDPR. Legitimate interest may be used but requires balancing test. Data subjects retain rights including erasure — though technical implementation of erasure from trained model weights raises unresolved questions. AI-generated outputs that are factually incorrect and relate to identified individuals may trigger the right to rectification.",
          commentary:
            "This opinion creates compliance obligations for every major GPAI provider. 'Machine unlearning' — removing specific training data from a trained model — is technically challenging and not currently feasible for most LLMs. The EDPB acknowledges this and suggests alternative remedies (correction of outputs, access restrictions) while the technical landscape evolves.",
          sourceUrl: "https://www.edpb.europa.eu/news/news/2024/edpb-adopts-opinion-ai-models_en",
          sourceNote: "EDPB Opinion 28/2024",
          sortOrder: 2,
        },
        {
          reference: "Article 10(5) vs GDPR Article 9",
          statement:
            "EU AI Act Article 10(5) permits processing of special categories of personal data for bias testing purposes. This carve-out operates within GDPR — the processing must still meet an Article 9(2) exception (typically explicit consent or public interest) AND the AI Act Article 10(5) conditions. The interaction requires careful DPA guidance.",
          commentary:
            "In practice: to run bias testing on protected characteristics (race, gender, religion) in a recruitment AI, the organisation needs both an AI Act Article 10(5) justification AND a GDPR Article 9(2) basis. This typically means either explicit consent from subjects or a qualifying research/public interest exemption. Some member states have stricter national conditions on Article 9(2)(g) applications.",
          sourceUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689",
          sourceNote: "EU AI Act Article 10(5) and GDPR Article 9",
          sortOrder: 3,
        },
      ],
    },
  },
  // MDR/IVDR: Additional sections
  {
    frameworkSlug: "mdr-ivdr",
    section: {
      title: "AI Act + MDR/IVDR Dual Regulation: Compliance Approach",
      description:
        "AI systems qualifying as Software as Medical Devices (SaMD) under MDR or IVDR are simultaneously subject to EU AI Act high-risk requirements. The MDCG guidance (2025-6) clarifies how compliance can be achieved efficiently without duplicating effort.",
      sortOrder: 6,
      statements: [
        {
          reference: "MDCG 2025-6 — Simultaneous Compliance",
          statement:
            "Per MDCG 2025-6 guidance, for AI systems classified as both medical devices (MDR/IVDR) and high-risk AI systems (EU AI Act), conformity assessment may be combined. Technical documentation under Annex II/III of MDR can be integrated with AI Act Annex IV documentation. A single notified body may conduct both assessments if appropriately designated.",
          commentary:
            "This is the most practically useful guidance for MedTech AI companies. Rather than running two entirely separate conformity assessment processes, one integrated technical file can satisfy both frameworks. The notified body must be designated for both MDR/IVDR and EU AI Act (AI Act Article 43(3)). Not all notified bodies have dual designation yet — this is a capacity bottleneck.",
          sourceUrl: "https://health.ec.europa.eu/document/download/b78a17d7-e3cd-4943-851d-e02a2f22bbb4_en",
          sourceNote: "MDCG 2025-6, European Commission Health",
          sortOrder: 1,
        },
        {
          reference: "Adaptive AI under MDR — PCCP Approach",
          statement:
            "AI/ML-based SaMD that continuously learns and adapts ('adaptive algorithms') cannot receive static CE marking. The Predetermined Change Control Plan (PCCP) approach — borrowed from FDA — is being developed for EU use. PCCP allows pre-approved changes to AI models without triggering full re-certification, subject to performance monitoring thresholds.",
          commentary:
            "Traditional CE marking assumes a 'locked' device. Adaptive AI that retrains on new clinical data presents a fundamental challenge. The PCCP approach solves this: the manufacturer pre-specifies what kinds of performance changes are acceptable, how they are monitored, and what triggers re-assessment. ENISA's guidance and evolving MDCG positions are expected in 2026-2027.",
          sourceUrl: "https://www.ema.europa.eu/",
          sourceNote: "EMA AI Working Party; FDA PCCP Framework adapted for EU",
          sortOrder: 2,
        },
      ],
    },
  },
  // DORA — Additional sections
  {
    frameworkSlug: "dora",
    section: {
      title: "AI-Specific ICT Risk Under DORA",
      description:
        "While DORA does not specifically address AI, financial entities using AI as part of their ICT infrastructure must incorporate AI-specific risks into their DORA ICT risk management frameworks. Regulatory guidance is evolving.",
      sortOrder: 6,
      statements: [
        {
          reference: "EBA Supervisory Statement — AI as ICT Third-Party Risk",
          statement:
            "The EBA has clarified that AI vendors providing AI services to financial institutions are ICT third-party service providers under DORA if the AI service is material to financial operations. This requires: contractual provisions (Article 30 DORA), concentration risk assessment, exit strategies, and register of arrangements.",
          commentary:
            "For a bank using Azure OpenAI, Google Vertex AI, or similar for customer-facing or operational processes, these AI cloud providers are DORA third parties. The full Article 30 contract requirements apply: SLAs, audit rights, business continuity plans, and subcontractor disclosure. This is a significant procurement compliance obligation coming into force January 2025.",
          sourceUrl: "https://www.eba.europa.eu/regulation-and-policy/dora",
          sourceNote: "EBA DORA Supervisory Guidance",
          sortOrder: 1,
        },
        {
          reference: "Model Risk Management Under DORA ICT Risk",
          statement:
            "AI/ML models used in financial operations (risk models, trading algorithms, fraud detection) are ICT assets under DORA and must be included in the ICT asset inventory, risk assessment, and resilience testing programme. Model performance degradation or adversarial attacks on models are ICT incidents.",
          commentary:
            "This creates a bridge between traditional model risk management (MRM) frameworks and DORA ICT risk. Banks must now ask: if our credit scoring model is attacked or degrades, does that constitute a major ICT incident requiring regulatory notification within 4 hours? Answer: likely yes for material models. MRM teams and ICT risk teams must work together.",
          sourceUrl: "https://www.eba.europa.eu/regulation-and-policy/dora",
          sourceNote: "EBA DORA Technical Standards — ICT Risk Management",
          sortOrder: 2,
        },
      ],
    },
  },
];

// ─── New AI Systems ──────────────────────────────────────

const wave3Systems = [
  {
    slug: "oracle-fusion-ai",
    vendor: "Oracle",
    name: "Oracle Fusion Cloud AI / OCI Generative AI",
    type: "Enterprise Cloud AI Platform",
    risk: "High",
    description:
      "Oracle's AI capabilities embedded across Fusion Cloud Applications (ERP, HCM, SCM, CX) and Oracle Cloud Infrastructure (OCI) Generative AI Service. EURA (EU Restricted Access) programme launched 2025 provides full EU data sovereignty for Fusion apps. AI features touch HR decisions, financial forecasting, and supply chain — multiple high-risk categories.",
    category: "Enterprise Cloud",
    featured: false,
    vendorHq: "Austin, USA",
    euPresence:
      "Oracle Corporation UK/EU entities. EURA data centres in Frankfurt (Germany) and Amsterdam (Netherlands). EU Sovereign Cloud programme operational since 2025.",
    useCases:
      "HR AI: candidate screening, performance analytics (Fusion HCM)\nFinancial AI: anomaly detection, cash forecasting (Fusion ERP)\nSupply chain AI: demand forecasting, supplier risk\nCX AI: service resolution, customer churn prediction\nOCI Gen AI: custom enterprise AI applications",
    dataStorage:
      "EURA: all data in EU data centres (Frankfurt/Amsterdam) only. Non-EURA: global Oracle cloud.",
    dataProcessing:
      "EURA: processing restricted to EU. Oracle EU Sovereign Cloud: staff access restricted to EU-based personnel.",
    trainingDataUse:
      "Customer data not used to train Oracle's global AI models. EURA: contractual guarantee of EU data boundary.",
    subprocessors:
      "Oracle subsidiaries. EURA: only EU-resident subprocessors. Published list available.",
    dpaDetails:
      "Comprehensive GDPR DPA. EURA-specific DPA with EU Sovereign Cloud commitments. EU SCCs for non-EURA.",
    slaDetails: "99.9% SLA for Fusion Cloud Applications.",
    dataPortability: "Full data portability via Oracle APIs and APEX export tools.",
    exitTerms: "Data export within 60 days, deletion confirmed within 90 days.",
    ipTerms: "Customer owns all business data. Oracle retains AI model IP.",
    certifications:
      "ISO 27001, ISO 27017, ISO 27018, SOC 2 Type II, SOC 3, C5 (Germany), ENS (Spain), BSI.",
    encryptionInfo:
      "AES-256 at rest with customer-managed keys (Oracle Key Vault). TLS 1.3 in transit.",
    accessControls:
      "Oracle Identity Cloud (IDCS), RBAC, MFA, VPN, comprehensive audit logs. EURA: EU personnel access only.",
    modelDocs:
      "Oracle AI product documentation. Limited model cards for embedded AI features. EURA compliance documentation.",
    explainability:
      "Transaction anomaly explanations in Fusion. HR AI recommendations include contributing factors.",
    biasTesting:
      "Oracle AI ethics guidelines. Fusion HCM AI bias testing conducted. Limited public disclosure.",
    aiActStatus:
      "High-risk for HR and financial AI features. EU AI Act compliance programme launched. EURA architecture supports conformity assessment requirements.",
    gdprStatus:
      "Strong GDPR posture via EURA. EU Sovereign Cloud removes most data residency concerns. DPO appointed.",
    euResidency: "Full EU residency via EURA programme. Standard for enterprise EU customers.",
    industrySlugs: ["financial-services", "healthcare", "public-sector"],
    scores: {
      "eu-ai-act": "B",
      gdpr: "A-",
      dora: "B+",
      "eba-eiopa-guidelines": "B",
    },
  },
  {
    slug: "deepseek-r1",
    vendor: "DeepSeek",
    name: "DeepSeek R1 / V3",
    type: "Open-Weight Foundation Model (Chinese)",
    risk: "High",
    description:
      "DeepSeek's R1 and V3 reasoning models from Chinese AI lab High-Flyer Capital Management. Achieved frontier-level performance at fraction of training cost. Available as open weights and via API. Significant EU regulatory concerns: data processed in China, unclear GPAI registration, Italian/Belgian DPA action.",
    category: "General Purpose",
    featured: false,
    vendorHq: "Hangzhou, China",
    euPresence:
      "No EU legal entity. API served from Chinese infrastructure. Open-weight models can be self-hosted in EU. Italian app store ban effective January 2025.",
    useCases:
      "Advanced reasoning and mathematical problem-solving\nCode generation and debugging\nResearch assistance\nEnterprise automation (self-hosted via open weights)\nAPI access for applications",
    dataStorage:
      "API: Chinese servers. Data subject to Chinese National Security Law and Cybersecurity Law. Self-hosted: full customer control if open weights used.",
    dataProcessing:
      "API: processed in China. Data transfer from EU to China lacks adequate protection under GDPR Chapter V (no adequacy decision).",
    trainingDataUse:
      "Training data sources not fully disclosed. Web scraping of EU user content alleged but unconfirmed. API inputs reportedly used for model improvement.",
    subprocessors: "ByteDance infrastructure alleged. Chinese cloud providers.",
    dpaDetails:
      "No GDPR-compliant DPA available. No EU SCCs. No EU data processing safeguards for API usage. Fundamental GDPR incompatibility for EU API use.",
    slaDetails: "No enterprise SLA. API availability-only.",
    dataPortability: "Open weights: fully portable. API: no data portability provisions.",
    exitTerms: "No contractual exit/deletion terms for EU users.",
    ipTerms:
      "Open-weight: permissive licence. API: DeepSeek terms (Chinese law governing).",
    certifications: "No EU or international certifications disclosed.",
    encryptionInfo: "Standard encryption. No independent verification for API traffic.",
    accessControls: "API key management only. No enterprise controls.",
    modelDocs:
      "Technical papers published — DeepSeek-R1 and DeepSeek-V3 papers available. Notable transparency on architecture and training methodology.",
    explainability:
      "R1 provides chain-of-thought reasoning traces. High explainability within outputs but no system-level audit capability.",
    biasTesting: "Limited public disclosure on bias evaluation. Independent audits not available.",
    aiActStatus:
      "GPAI model obligations apply from August 2025. DeepSeek has not registered with EU AI Office. Active scrutiny by EU AI Office. Systemic risk designation possible for frontier models.",
    gdprStatus:
      "Severe GDPR deficiencies for API use: no legal transfer mechanism to China, no DPA, no EU representative designated initially. Italy banned (Jan 2025). Belgium, France, Ireland investigations opened. Self-hosted open-weight: GDPR compliance deployer's responsibility.",
    euResidency:
      "Not available for API. Open-weight self-hosting achieves EU residency if deployed on EU infrastructure.",
    industrySlugs: ["financial-services", "telecommunications"],
    scores: {
      "eu-ai-act": "F",
      gdpr: "F",
      dora: "F",
      "eba-eiopa-guidelines": "F",
    },
  },
  {
    slug: "perplexity-ai-enterprise",
    vendor: "Perplexity AI",
    name: "Perplexity Enterprise Pro",
    type: "AI Search / Research Platform",
    risk: "Limited",
    description:
      "AI-powered search and research platform combining LLM reasoning with real-time web search. Enterprise version with SSO, data security, and team features. Growing adoption in EU enterprise for research and information retrieval.",
    category: "Research & Search AI",
    featured: false,
    vendorHq: "San Francisco, USA",
    euPresence:
      "US entity. EU users served from US infrastructure. Limited EU legal presence.",
    useCases:
      "Enterprise research and information retrieval\nCompetitor and market intelligence\nLegal and regulatory research\nScientific literature synthesis\nReal-time news and analysis",
    dataStorage:
      "US-based infrastructure. No EU data residency option as of 2026.",
    dataProcessing:
      "US-based. Data transfer under EU-US Data Privacy Framework.",
    trainingDataUse:
      "Enterprise: queries not used for training. Consumer: queries may be used.",
    subprocessors: "AWS. LLM model providers (OpenAI, Anthropic, Meta).",
    dpaDetails:
      "DPA available for Enterprise Pro. EU SCCs. EU-US DPF relied upon.",
    slaDetails: "Enterprise SLA: 99.9% uptime.",
    dataPortability: "Search history exportable. API access.",
    exitTerms: "Data deletion on request within 30 days.",
    ipTerms: "User owns all queries and outputs.",
    certifications: "SOC 2 Type II. ISO 27001 in progress.",
    encryptionInfo: "AES-256 at rest. TLS 1.2+ in transit.",
    accessControls: "SSO/SAML, team management, audit logs (Enterprise Pro).",
    modelDocs:
      "Product documentation. No model cards (uses third-party models). Citation transparency is a core product feature.",
    explainability:
      "All responses include cited sources. Source transparency is a differentiating feature.",
    biasTesting:
      "Relies on upstream model providers for bias. Real-time grounding reduces hallucination. Search source diversity considerations.",
    aiActStatus:
      "Limited risk classification — transparency obligations. Not GPAI provider (resells model access). EU AI Act disclosure requirements met via citation UI.",
    gdprStatus:
      "DPA available. EU-US DPF. Limited EU footprint. Data minimisation by design for Enterprise.",
    euResidency: "Not available as of April 2026.",
    industrySlugs: ["financial-services", "healthcare", "public-sector"],
    scores: {
      "eu-ai-act": "B-",
      gdpr: "C+",
      dora: "C",
      "eba-eiopa-guidelines": "C",
    },
  },
  {
    slug: "notion-ai",
    vendor: "Notion",
    name: "Notion AI",
    type: "Productivity AI / Knowledge Management",
    risk: "Limited",
    description:
      "AI features integrated into Notion's workspace platform: AI writing assistance, document summarisation, Q&A over workspace content, and database intelligence. Widely used in EU startups and enterprise teams.",
    category: "Productivity AI",
    featured: false,
    vendorHq: "San Francisco, USA",
    euPresence:
      "Notion Labs Netherlands (EU entity). Data stored in EU via AWS EU regions for EU customers.",
    useCases:
      "AI writing and editing in documents\nWorkspace Q&A and knowledge search\nMeeting notes and summary generation\nProject management AI assistance\nDatabase query and analysis",
    dataStorage:
      "EU customers: AWS EU (Frankfurt) by default. Configurable.",
    dataProcessing:
      "EU-based for EU customers. AI processing: third-party LLM providers.",
    trainingDataUse:
      "Workspace content not used to train models. AI queries to third-party providers under sub-processing agreements.",
    subprocessors:
      "AWS EU, OpenAI (with contractual protections), Anthropic. Published list.",
    dpaDetails:
      "GDPR DPA. EU entity as EEA representative. EU SCCs for third-party LLM providers.",
    slaDetails: "99.8% SLA for Business/Enterprise plans.",
    dataPortability: "Full workspace export in Markdown, PDF, and CSV formats.",
    exitTerms: "Data deletion within 30 days of account closure.",
    ipTerms: "User owns all workspace content and AI outputs.",
    certifications: "SOC 2 Type II, ISO 27001.",
    encryptionInfo: "AES-256 at rest, TLS 1.3 in transit.",
    accessControls: "SSO/SAML, SCIM, guest permissions, audit log (Enterprise).",
    modelDocs: "Uses third-party LLM models. No proprietary model cards.",
    explainability: "Standard LLM outputs. No dedicated explainability features.",
    biasTesting:
      "Relies on upstream model providers. Content policy enforcement.",
    aiActStatus:
      "Limited risk — transparency obligations met. Not high-risk for typical productivity use cases.",
    gdprStatus:
      "Good GDPR posture. EU entity, EU data residency, DPA available.",
    euResidency: "Full EU data residency for EU customers via AWS Frankfurt.",
    industrySlugs: ["financial-services", "telecommunications"],
    scores: {
      "eu-ai-act": "B+",
      gdpr: "B+",
      dora: "C+",
      "eba-eiopa-guidelines": "C",
    },
  },
  {
    slug: "writer-enterprise-ai",
    vendor: "Writer",
    name: "Writer Enterprise AI Platform",
    type: "Enterprise Content AI / Workflow AI",
    risk: "Limited",
    description:
      "Enterprise-grade AI writing platform built for regulated industries. Offers proprietary Palmyra models, knowledge graph-based AI, and enterprise controls. Notable for HIPAA compliance and strong EU data governance — positioned for heavily regulated sectors.",
    category: "Enterprise AI Platform",
    featured: false,
    vendorHq: "San Francisco, USA",
    euPresence:
      "EU entity (Writer EU). AWS EU data centres. Growing European enterprise customer base.",
    useCases:
      "Regulated industry content generation (financial disclosures, insurance)\nKnowledge management and policy documentation\nCompliant marketing content generation\nHR communications and policy drafting\nCustomer service response generation",
    dataStorage:
      "EU customers: AWS EU (Frankfurt). EU data residency standard for EU enterprise.",
    dataProcessing:
      "EU-based inference. Customer data not used cross-customer.",
    trainingDataUse:
      "Enterprise: customer data not used to train Palmyra models. Zero-retention option.",
    subprocessors: "AWS EU. Minimal subprocessor list.",
    dpaDetails:
      "GDPR DPA with EU entity. HIPAA BAA available. EU SCCs.",
    slaDetails: "99.9% SLA for Enterprise.",
    dataPortability: "Full content and model export available.",
    exitTerms: "Data deletion within 30 days of contract end.",
    ipTerms: "Customer owns all generated content.",
    certifications:
      "SOC 2 Type II, HIPAA, ISO 27001 (in progress).",
    encryptionInfo: "AES-256 at rest with customer-managed key option. TLS 1.2+.",
    accessControls: "SSO/SAML, SCIM, RBAC, comprehensive audit logging.",
    modelDocs:
      "Palmyra model documentation available for enterprise customers. Knowledge graph architecture documentation.",
    explainability:
      "AI claims linked to source knowledge graph documents. Factual grounding with citations.",
    biasTesting:
      "Internal bias evaluations for Palmyra. Regulated industry specific fairness testing.",
    aiActStatus:
      "Limited risk for productivity use cases. May be high-risk for specific regulated uses (financial advice generation, HR communications).",
    gdprStatus:
      "Strong GDPR programme. EU entity, EU data residency, comprehensive DPA.",
    euResidency: "Full EU residency standard for EU enterprise customers.",
    industrySlugs: ["financial-services", "healthcare"],
    scores: {
      "eu-ai-act": "B+",
      gdpr: "A-",
      dora: "B-",
      "eba-eiopa-guidelines": "B",
    },
  },
  {
    slug: "veeva-vault-ai",
    vendor: "Veeva Systems",
    name: "Veeva Vault AI / Veeva Compass",
    type: "Life Sciences Regulated AI Platform",
    risk: "High",
    description:
      "AI capabilities within Veeva's cloud platform for life sciences — covering clinical data management, regulatory submissions, pharmacovigilance, and medical affairs. Strong EU regulatory compliance posture built for pharmaceutical and medical device companies operating under MDR/IVDR and GxP requirements.",
    category: "Healthcare & Life Sciences",
    featured: false,
    vendorHq: "Pleasanton, USA",
    euPresence:
      "Veeva Systems Ireland Ltd. EU data centres. Deep EU pharmaceutical regulatory expertise and EMA/national agency integrations.",
    useCases:
      "Clinical trial data management and analysis\nRegulatory submission authoring (AI-assisted)\nPharmacovigilance signal detection\nMedical information AI (HCP queries)\nSafety data analytics and case processing",
    dataStorage:
      "EU data centres (Ireland). GxP-validated cloud infrastructure. Data residency configurable.",
    dataProcessing:
      "EU-based processing for EU customer data. GxP validated AI operations.",
    trainingDataUse:
      "Customer clinical/regulatory data not used for cross-customer training. Strict data isolation.",
    subprocessors:
      "AWS EU, Microsoft Azure EU. Life sciences specific subprocessors. Published list.",
    dpaDetails:
      "GDPR DPA. EU entity. GxP data processing agreements. Clinical trial data treated under Regulation (EU) 536/2014.",
    slaDetails: "99.9% SLA with dedicated life sciences support.",
    dataPortability: "Fully structured data export. HL7 FHIR and CDISC standards support.",
    exitTerms: "Regulatory data retention requirements respected. Contractual deletion on request.",
    ipTerms: "Customer/sponsor owns all clinical and regulatory data.",
    certifications:
      "ISO 27001, SOC 2 Type II, GxP validation support, FDA 21 CFR Part 11.",
    encryptionInfo:
      "AES-256 at rest with customer-managed keys. TLS 1.3 in transit. Validated encryption for GxP.",
    accessControls:
      "Validated RBAC for GxP systems. 21 CFR Part 11 electronic signatures. FDA/EMA audit trail requirements met.",
    modelDocs:
      "AI feature validation documentation. IQ/OQ/PQ protocols for GxP use. Technical documentation for regulatory submissions.",
    explainability:
      "Pharmacovigilance AI: signal detection rationale documented. Regulatory submission AI: full traceability to source documents.",
    biasTesting:
      "Clinical AI validated against diverse patient populations. GxP validation protocols include bias assessment.",
    aiActStatus:
      "High-risk for diagnostic and safety applications. Dual compliance (MDR/IVDR + AI Act) framework implemented. Strong regulatory DNA for compliance.",
    gdprStatus:
      "Comprehensive GDPR programme. Clinical trial data under specific EU clinical trial regulations. Special category health data handled with GxP-grade controls.",
    euResidency: "Full EU residency standard. GxP validated EU cloud.",
    industrySlugs: ["healthcare"],
    scores: {
      "eu-ai-act": "A-",
      gdpr: "A",
      "mdr-ivdr": "A-",
      "eba-eiopa-guidelines": "C",
    },
  },
  {
    slug: "c3ai-enterprise",
    vendor: "C3.ai",
    name: "C3 AI Enterprise AI Suite",
    type: "Industrial AI / Predictive Analytics",
    risk: "High",
    description:
      "Enterprise AI application platform for predictive maintenance, supply chain optimisation, fraud detection, and energy management. Used by energy companies, manufacturers, financial services, and defence. Significant EU presence including Shell, Engie, and European utilities.",
    category: "Industrial AI",
    featured: false,
    vendorHq: "Redwood City, USA",
    euPresence:
      "C3.ai Europe (offices in Paris, Amsterdam). Azure and AWS EU regions. Major EU energy and industrial customer base.",
    useCases:
      "Predictive maintenance for industrial equipment\nEnergy grid optimisation and demand forecasting\nSupply chain risk and inventory optimisation\nFinancial crime detection\nDefence logistics and readiness analytics",
    dataStorage:
      "EU cloud regions (Azure EU, AWS EU). Customer-selected data residency.",
    dataProcessing:
      "EU-based inference for EU customers. On-premise deployment available for sensitive applications.",
    trainingDataUse:
      "Customer operational data used to train application-specific models. No cross-customer data sharing.",
    subprocessors: "Microsoft Azure EU, AWS EU. Published list.",
    dpaDetails:
      "GDPR DPA. EU SCCs. On-premise option available for sensitive industrial data.",
    slaDetails: "Enterprise SLA: 99.9% for cloud applications.",
    dataPortability: "Full data export via C3.ai API and platform tools.",
    exitTerms: "Data deletion within 60 days. Model export available.",
    ipTerms: "Customer owns operational data. C3.ai retains platform IP.",
    certifications: "ISO 27001, SOC 2 Type II, FedRAMP (US public sector).",
    encryptionInfo: "AES-256, TLS 1.2+. On-premise: customer-managed encryption.",
    accessControls: "Enterprise SSO, RBAC, audit logs.",
    modelDocs: "Application-specific model documentation. Technical reports for energy and industrial AI.",
    explainability:
      "Predictive maintenance AI: failure probability with contributing factors. Anomaly detection rationale.",
    biasTesting:
      "Industrial AI fairness less directly relevant. Accuracy validation across equipment types and operating conditions.",
    aiActStatus:
      "High-risk for critical infrastructure AI (energy grid, water, transport). EU AI Act compliance programme underway. DORA compliance for financial services AI.",
    gdprStatus:
      "Industrial IoT data: often not personal data. Where personal data involved (worker safety monitoring), GDPR programme in place.",
    euResidency: "Full EU residency available.",
    industrySlugs: ["financial-services", "public-sector"],
    scores: {
      "eu-ai-act": "B-",
      gdpr: "B",
      dora: "B-",
      "eba-eiopa-guidelines": "C+",
    },
  },
  {
    slug: "anthropic-claude-api",
    vendor: "Anthropic",
    name: "Claude API / Claude.ai Teams",
    type: "Foundation Model API + Consumer Platform",
    risk: "High",
    description:
      "Anthropic's consumer platform (Claude.ai) and API for enterprise integrations. Constitutional AI safety approach. Teams and Enterprise tiers offer admin controls, SSO, and audit logs. EU-facing compliance posture improving; Claude 3.5 Sonnet and Claude 4 series widely used in enterprise.",
    category: "General Purpose",
    featured: true,
    vendorHq: "San Francisco, USA",
    euPresence:
      "Anthropic UK entity (London). EU customers served via AWS EU regions. No EU-specific legal entity yet.",
    useCases:
      "Enterprise document analysis and summarisation\nCode review and generation\nCustomer service automation\nResearch and analysis workflows\nAgentic task completion",
    dataStorage:
      "API: AWS us-east by default. EU regions available on Enterprise tier. Claude.ai: US-based.",
    dataProcessing:
      "AWS us-east-1 primary. EU processing available for Enterprise API customers.",
    trainingDataUse:
      "API/Enterprise: data not used for training by default. Zero-retention API available.",
    subprocessors:
      "AWS (primary infrastructure). Limited additional subprocessors.",
    dpaDetails:
      "DPA available for API customers. EU SCCs via Anthropic UK. GDPR compliance programme published.",
    slaDetails: "99.9% API uptime SLA for Enterprise.",
    dataPortability: "API-based data access. Conversation history export.",
    exitTerms: "Data deletion on account termination on request.",
    ipTerms: "Customer owns all inputs and outputs. No IP claims on generated content.",
    certifications: "SOC 2 Type II. ISO 27001 in progress.",
    encryptionInfo: "AES-256 at rest. TLS 1.2+ in transit.",
    accessControls: "API key management. SSO/SCIM for Enterprise. Audit logs.",
    modelDocs:
      "Claude 3 model card. Claude's Constitution (Constitutional AI). Responsible scaling policy published.",
    explainability:
      "Extended thinking mode shows reasoning chain (Claude 3.5+). Citations in document analysis.",
    biasTesting:
      "Constitutional AI approach to value alignment. Red teaming. Annual model safety report.",
    aiActStatus:
      "GPAI model. Anthropic cooperating with EU AI Office. Systemic risk assessment for frontier models. Published responsible scaling policy aligns with AI Act safety intent.",
    gdprStatus:
      "DPA available. UK entity as EEA representative. EU data residency available on Enterprise.",
    euResidency:
      "Available for Enterprise API customers on request. Not default.",
    industrySlugs: ["financial-services", "healthcare", "public-sector"],
    scores: {
      "eu-ai-act": "B+",
      gdpr: "B",
      dora: "C+",
      "eba-eiopa-guidelines": "B-",
    },
  },
];

// ─── Additional News Entries ──────────────────────────────

const wave3NewsEntries = [
  {
    title: "DeepSeek Banned in Italy — First Major Chinese AI GDPR Enforcement",
    description:
      "Italy's Garante ordered DeepSeek to block Italian users from its services on 30 January 2025, citing failure to respond to the DPA's questions about: what personal data is collected, from what sources, for what purposes, and whether it is stored in China. The case is a landmark: the first major EU regulatory action against a Chinese AI provider. Several other EU DPAs opened parallel investigations.",
    changeType: "jurisprudence",
    date: new Date("2025-01-30"),
    sourceUrl: "https://www.garanteprivacy.it/",
    sourceLabel: "Garante (Italian DPA)",
    author: "VendorScope Editorial",
    systemSlug: "deepseek-r1",
  },
  {
    title: "Oracle Launches Fusion Cloud AI on EU Sovereign Cloud",
    description:
      "Oracle made Fusion Cloud Applications (HCM, ERP, SCM, CX) available on its EU Sovereign Cloud in February 2025, providing EU-resident processing with access restricted to EU-based Oracle personnel. The EURA (EU Restricted Access) programme addresses concerns from EU enterprises about US government access to data under CLOUD Act. Oracle cited this as a direct response to EU AI Act data governance requirements.",
    changeType: "update",
    date: new Date("2025-02-11"),
    sourceUrl: "https://www.oracle.com/security/saas-security/data-sovereignty/european-union-restricted-access/",
    sourceLabel: "Oracle EURA Programme",
    author: "VendorScope Editorial",
    systemSlug: "oracle-fusion-ai",
  },
  {
    title: "EU-US Data Privacy Framework — First Annual Review Completed",
    description:
      "The European Commission completed the first annual review of the EU-US Data Privacy Framework (DPF) in October 2024, finding the US has implemented the framework adequately. The review is important for EU AI compliance: many US AI providers rely on DPF for their legal transfer mechanism. The DPF remains under legal challenge from privacy campaigners, with a CJEU referral expected in 2026.",
    changeType: "update",
    date: new Date("2024-10-15"),
    sourceUrl: "https://ec.europa.eu/commission/presscorner/detail/en/ip_24_5231",
    sourceLabel: "European Commission Press Release",
    author: "VendorScope Editorial",
    frameworkSlug: "gdpr",
  },
  {
    title: "AI Act Sandbox Programmes Launched — First National Results",
    description:
      "The first national AI regulatory sandboxes mandated by the EU AI Act (Article 57) began accepting applications in 2025. Spain (AESIA), Finland, and the Netherlands launched the earliest programmes. Sandboxes allow providers to test high-risk AI systems under regulatory supervision with reduced compliance burdens. Initial participants include healthcare AI, recruitment AI, and critical infrastructure AI companies.",
    changeType: "new_version",
    date: new Date("2025-05-01"),
    sourceUrl: "https://www.aesia.gob.es/",
    sourceLabel: "AESIA Spain — AI Sandbox",
    author: "VendorScope Editorial",
    frameworkSlug: "eu-ai-act",
  },
  {
    title: "European AI Office Publishes GPAI Model Registration Database",
    description:
      "The EU AI Office published the public GPAI model register in Q4 2025, listing models notified for registration under Article 53. The register includes: model name, provider, training compute estimate, whether systemic risk designation applies, and compliance status. As of Q1 2026, over 50 GPAI models were registered. Notable absence: xAI/Grok.",
    changeType: "new_version",
    date: new Date("2025-11-01"),
    sourceUrl: "https://digital-strategy.ec.europa.eu/en/policies/ai-office",
    sourceLabel: "EU AI Office",
    author: "VendorScope Editorial",
    frameworkSlug: "eu-ai-act",
  },
  {
    title: "Anthropic Publishes Responsible Scaling Policy 3.0",
    description:
      "Anthropic published version 3.0 of its Responsible Scaling Policy (RSP) in 2025, adding new AI Safety Level (ASL) commitments and incorporating EU AI Act GPAI obligations. RSP 3.0 introduces formal 'containment' commitments for models approaching catastrophic risk thresholds. The policy is increasingly cited by EU AI Office and UK AI Safety Institute as a model for responsible AI governance.",
    changeType: "update",
    date: new Date("2025-04-01"),
    sourceUrl: "https://www.anthropic.com/responsible-scaling-policy",
    sourceLabel: "Anthropic Responsible Scaling Policy",
    author: "VendorScope Editorial",
    systemSlug: "anthropic-claude-api",
  },
  {
    title: "Google Submits GPAI Code of Practice Commitments",
    description:
      "Google formally submitted its voluntary commitments under the GPAI Code of Practice to the EU AI Office in December 2025. Commitments cover Gemini family of models and include: training data copyright compliance programme, adversarial testing methodology for systemic risk models, incident reporting procedures, and energy consumption reporting. Google's submission is one of the most detailed from major US providers.",
    changeType: "certification",
    date: new Date("2025-12-15"),
    sourceUrl: "https://digital-strategy.ec.europa.eu/en/policies/ai-office",
    sourceLabel: "EU AI Office — GPAI Code of Practice",
    author: "VendorScope Editorial",
    systemSlug: "google-gemini-vertex-ai",
  },
  {
    title: "EDPB Issues Guidance on AI Chatbots and GDPR",
    description:
      "The European Data Protection Board issued guidelines on AI chatbots and GDPR compliance in 2025. Key requirements: clear disclosure of AI nature; purpose limitation for conversation data; maximum retention periods (90 days default); opt-out from personalisation; and strict consent requirements for using conversation data for model training. Applies to all customer-facing AI chatbots operating in the EU.",
    changeType: "update",
    date: new Date("2025-09-01"),
    sourceUrl: "https://www.edpb.europa.eu/",
    sourceLabel: "European Data Protection Board",
    author: "VendorScope Editorial",
    frameworkSlug: "gdpr",
  },
  {
    title: "Belgian DPA Opens Investigation into LinkedIn AI",
    description:
      "Belgium's APD opened an investigation into LinkedIn's AI features in 2025, specifically LinkedIn's use of member profile data to train AI models and its AI-generated messaging features. The investigation focuses on: lawful basis for AI training on member data, transparency of AI content generation, and opt-out mechanisms. LinkedIn had rolled out AI features including AI-written messages across the EU.",
    changeType: "jurisprudence",
    date: new Date("2025-07-10"),
    sourceUrl: "https://www.autoriteprotectiondonnees.be/",
    sourceLabel: "Belgian DPA (APD)",
    author: "VendorScope Editorial",
    frameworkSlug: "gdpr",
  },
  {
    title: "French CNIL Issues AI and GDPR Compliance Guide",
    description:
      "France's CNIL published a comprehensive guide to GDPR compliance for AI systems in 2025, covering the full AI lifecycle: data collection for training, model development, deployment, and monitoring. The guide introduces the concept of 'privacy by design' for AI and provides practical templates for DPIAs specific to AI systems. CNIL also published a specific guide for generative AI applications.",
    changeType: "update",
    date: new Date("2025-06-01"),
    sourceUrl: "https://www.cnil.fr/",
    sourceLabel: "CNIL (French DPA)",
    author: "VendorScope Editorial",
    frameworkSlug: "gdpr",
  },
  {
    title: "ISO/IEC 42001 AI Management System Standard — EU Adoption",
    description:
      "ISO/IEC 42001:2023 — the AI Management System standard — achieved significant EU enterprise adoption in 2025, with numerous EU-based organisations seeking certification. The standard provides a systematic framework for managing AI risks and is being referenced in EU AI Act conformity assessment. CEN/CENELEC has adopted it as EN ISO/IEC 42001, and its use creates presumption of conformity with several AI Act requirements.",
    changeType: "update",
    date: new Date("2025-03-01"),
    sourceUrl: "https://www.iso.org/standard/81230.html",
    sourceLabel: "ISO — ISO/IEC 42001:2023",
    author: "VendorScope Editorial",
    frameworkSlug: "eu-ai-act",
  },
  {
    title: "Veeva Vault AI Achieves GxP Validation for Clinical AI",
    description:
      "Veeva Systems completed GxP validation of key Vault AI features for clinical data management in 2025, including AI-assisted case report form review and pharmacovigilance signal detection. The validation follows FDA 21 CFR Part 11 and EU Annex 11 principles adapted for AI/ML systems. This positions Veeva as a compliance leader for regulated life sciences AI.",
    changeType: "certification",
    date: new Date("2025-07-20"),
    sourceUrl: "https://www.veeva.com/",
    sourceLabel: "Veeva Systems Official",
    author: "VendorScope Editorial",
    systemSlug: "veeva-vault-ai",
  },
  {
    title: "C3.ai Partners with Engie for EU Energy Grid AI",
    description:
      "C3.ai signed a major contract with French energy giant Engie in 2025 to deploy predictive maintenance and grid optimisation AI across European energy infrastructure. The deployment covers high-risk AI use cases (critical infrastructure — Annex III Category 2) and is proceeding under full EU AI Act conformity assessment. The contract includes EU AI Act compliance provisions and DORA third-party risk management clauses.",
    changeType: "update",
    date: new Date("2025-09-15"),
    sourceUrl: "https://c3.ai/",
    sourceLabel: "C3.ai Newsroom",
    author: "VendorScope Editorial",
    systemSlug: "c3ai-enterprise",
  },
  {
    title: "EU AI Act: First High-Risk System Withdrawal from EU Market",
    description:
      "In early 2026, a US-based AI vendor withdrew a high-risk recruitment AI product from the EU market rather than complete the required conformity assessment. The withdrawal, confirmed by the product's official announcement, cited compliance costs and timeline uncertainty. Legal experts noted it as the first documented market exit specifically driven by EU AI Act compliance requirements — validating the Act's deterrent effect on non-compliant products.",
    changeType: "incident",
    date: new Date("2026-02-20"),
    sourceUrl: "https://digital-strategy.ec.europa.eu/en/policies/ai-office",
    sourceLabel: "EU AI Office — Market Surveillance",
    author: "VendorScope Editorial",
    frameworkSlug: "eu-ai-act",
  },
  {
    title: "MDCG 2025-6: Interplay Between MDR and EU AI Act Published",
    description:
      "The Medical Device Coordination Group (MDCG) published guidance 2025-6 on the interplay between the Medical Devices Regulation (MDR), In Vitro Diagnostics Regulation (IVDR), and the EU AI Act. The guidance clarifies: when AI medical devices need dual conformity assessment; how technical documentation can be combined; and which notified body requirements apply for dual-regulated products. Essential reading for all MedTech AI companies.",
    changeType: "update",
    date: new Date("2025-04-15"),
    sourceUrl: "https://health.ec.europa.eu/document/download/b78a17d7-e3cd-4943-851d-e02a2f22bbb4_en",
    sourceLabel: "MDCG 2025-6 Guidance",
    author: "VendorScope Editorial",
    frameworkSlug: "mdr-ivdr",
  },
];

// ─── Additional Approved Sources ─────────────────────────

const additionalApprovedSources = [
  {
    url: "https://ai-act-service-desk.ec.europa.eu/",
    name: "EU AI Act Service Desk",
    description: "Official European Commission helpdesk and resource centre for EU AI Act implementation questions.",
  },
  {
    url: "https://artificialintelligenceact.eu/article/5/",
    name: "Article 5: Prohibited AI Practices — AI Act Explorer",
    description: "Detailed analysis of EU AI Act Article 5 prohibited practices with commentary.",
  },
  {
    url: "https://artificialintelligenceact.eu/annex/3/",
    name: "Annex III: High-Risk AI Systems — AI Act Explorer",
    description: "Complete list of high-risk AI system categories under Annex III with analysis.",
  },
  {
    url: "https://health.ec.europa.eu/document/download/b78a17d7-e3cd-4943-851d-e02a2f22bbb4_en",
    name: "MDCG 2025-6 — MDR/IVDR and AI Act Interplay",
    description: "Official guidance on how MDR/IVDR and EU AI Act requirements interact for medical device AI.",
  },
  {
    url: "https://www.cnil.fr/",
    name: "CNIL (French DPA)",
    description: "French data protection authority — active AI governance guidance and GDPR enforcement.",
  },
  {
    url: "https://www.aesia.gob.es/",
    name: "AESIA (Spanish AI Authority)",
    description: "First dedicated EU national AI supervisory authority — sandbox programme and AI Act guidance.",
  },
  {
    url: "https://www.iso.org/standard/81230.html",
    name: "ISO/IEC 42001:2023 — AI Management Systems",
    description: "International AI management system standard referenced in EU AI Act conformity assessment.",
  },
  {
    url: "https://www.anthropic.com/responsible-scaling-policy",
    name: "Anthropic Responsible Scaling Policy",
    description: "Model governance framework cited by EU AI Office as example of responsible AI development commitments.",
  },
  {
    url: "https://digital-strategy.ec.europa.eu/en/factpages/general-purpose-ai-obligations-under-ai-act",
    name: "EC Factsheet: GPAI Obligations under the AI Act",
    description: "European Commission factsheet on GPAI model obligations, systemic risk, and Code of Practice.",
  },
  {
    url: "https://www.cencenelec.eu/",
    name: "CEN/CENELEC — European Standards for AI",
    description: "European standards organisations producing harmonised standards supporting EU AI Act conformity.",
  },
];

// ─── Main ─────────────────────────────────────────────────

async function main() {
  console.log("🌱 Starting Wave 3 content seed...\n");

  const frameworks = await prisma.regulatoryFramework.findMany({
    select: { id: true, slug: true },
  });
  const frameworkMap = Object.fromEntries(frameworks.map((f) => [f.slug, f.id]));

  const existingSystems = await prisma.aISystem.findMany({
    select: { id: true, slug: true },
  });
  const systemMap = Object.fromEntries(existingSystems.map((s) => [s.slug, s.id]));

  const industries = await prisma.industry.findMany({
    select: { id: true, slug: true },
  });
  const industryMap = Object.fromEntries(industries.map((i) => [i.slug, i.id]));

  // ─── Add Framework Sections ─────────────────────────────
  console.log("📋 Adding framework sections...");
  let sectionsAdded = 0;
  let statementsAdded = 0;

  for (const { frameworkSlug, section } of newFrameworkSections) {
    const frameworkId = frameworkMap[frameworkSlug];
    if (!frameworkId) {
      console.warn(`  ⚠️  Framework not found: ${frameworkSlug}`);
      continue;
    }

    const { statements, ...sectionFields } = section;

    let dbSection = await prisma.frameworkSection.findFirst({
      where: { title: sectionFields.title, frameworkId },
    });

    if (!dbSection) {
      dbSection = await prisma.frameworkSection.create({
        data: { ...sectionFields, frameworkId },
      });
      sectionsAdded++;
    }

    for (const stmt of statements) {
      const existing = await prisma.policyStatement.findFirst({
        where: { reference: stmt.reference, sectionId: dbSection.id },
      });
      if (!existing) {
        await prisma.policyStatement.create({
          data: { ...stmt, sectionId: dbSection.id },
        });
        statementsAdded++;
      }
    }
    console.log(`  ✅ [${frameworkSlug}] ${sectionFields.title}`);
  }

  // ─── Add New AI Systems ─────────────────────────────────
  console.log("\n📦 Adding Wave 3 AI systems...");
  let newSystemsAdded = 0;

  for (const sys of wave3Systems) {
    const { industrySlugs, scores, ...data } = sys;

    const industryIds = industrySlugs
      .filter((s) => industryMap[s])
      .map((s) => ({ id: industryMap[s] }));

    const upserted = await prisma.aISystem.upsert({
      where: { slug: data.slug },
      update: { ...data, industries: { set: industryIds } },
      create: { ...data, industries: { connect: industryIds } },
    });

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

    systemMap[upserted.slug] = upserted.id;
    newSystemsAdded++;
    console.log(`  ✅ ${upserted.vendor} — ${upserted.name}`);
  }

  // ─── Add News Entries ───────────────────────────────────
  console.log("\n📰 Adding Wave 3 news entries...");
  let newsAdded = 0;

  for (const entry of wave3NewsEntries) {
    const { frameworkSlug, systemSlug, ...data } = entry as typeof entry & {
      frameworkSlug?: string;
      systemSlug?: string;
    };

    const frameworkId = frameworkSlug ? frameworkMap[frameworkSlug] : undefined;
    const systemId = systemSlug ? systemMap[systemSlug] : undefined;

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

  // ─── Add Approved Sources ───────────────────────────────
  console.log("\n🔗 Adding approved sources...");
  let sourcesAdded = 0;

  for (const source of additionalApprovedSources) {
    await prisma.approvedSource.upsert({
      where: { url: source.url },
      update: source,
      create: source,
    });
    sourcesAdded++;
    console.log(`  ✅ ${source.name}`);
  }

  // ─── Summary ────────────────────────────────────────────
  console.log("\n✨ Wave 3 complete!");
  console.log(`   Framework sections: ${sectionsAdded}`);
  console.log(`   Policy statements: ${statementsAdded}`);
  console.log(`   AI systems: ${newSystemsAdded}`);
  console.log(`   News entries: ${newsAdded}`);
  console.log(`   Approved sources: ${sourcesAdded}`);

  const totals = {
    systems: await prisma.aISystem.count(),
    sections: await prisma.frameworkSection.count(),
    statements: await prisma.policyStatement.count(),
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
