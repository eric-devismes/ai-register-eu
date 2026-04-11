/**
 * Content Enrichment — Batch 2 (SAP, ServiceNow, Workday, IBM, Salesforce, Palantir)
 *
 * Run with: npx tsx src/data/seed-enrichment-batch2.ts
 * Safe to run multiple times (uses upsert on slug).
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const systems = [
  // 1. SAP Joule / Business AI
  {
    slug: "sap-joule",
    vendor: "SAP",
    name: "Joule / SAP Business AI",
    type: "ERP AI / Business Process AI",
    risk: "Limited",
    description:
      "AI assistant embedded across S/4HANA, SuccessFactors, and BTP. EU-native (Walldorf, Germany) with C5 attestation — the only major ERP vendor headquartered in the EU. 400+ Business AI use cases, 2,100 Joule Skills, 40 Joule Agents. Bidirectional integration with Microsoft 365 Copilot. Pricing is opaque (AI Units model criticized by CIO Magazine). Joule is NOT available for on-premise S/4HANA and not on the roadmap. Designated as Critical ICT Third-Party Service Provider under DORA (Nov 2025).",
    category: "Financial",
    featured: true,
    capabilityType: "decision-intelligence",
    vendorHq: "Walldorf, Germany",
    euPresence:
      "EU-native — headquartered in Walldorf, Germany. ~110,000 employees globally. Data centers across the EU. Not subject to US CLOUD Act for EU operations.",
    foundedYear: 1972,
    employeeCount: "110,000+",
    fundingStatus:
      "Public (XETRA: SAP). Revenue EUR 36.8B (FY2025, +12.6% YoY). Market cap ~EUR 300B+.",
    marketPresence: "Leader",
    customerCount: "400,000+ customers in 190 countries",
    notableCustomers:
      "Volkswagen AG (though critical of Joule maturity)\nSartorius, Bitzer (AI/robotics PoCs)\nSAP internal (100+ Joule use cases)\nMost major European enterprises run SAP ERP",
    customerStories:
      "SAP deployed 100+ Joule use cases internally. Volkswagen AG reportedly found the technology lacking in maturity and cost-effectiveness (GuruFocus). 60% of companies transitioning to S/4HANA consider themselves not ready to manage Joule (CIO).",
    useCases:
      "Financial planning and analysis\nPayroll automation (4x faster claimed)\nSupply chain optimization\nHR talent management via SuccessFactors\nProcurement automation\nCustom AI agents via Joule Studio\nBidirectional Microsoft 365 Copilot integration\nEnterprise search across SAP modules",
    dataStorage:
      "EU data centers (Germany, Netherlands, France). RISE with SAP offers hyperscaler data center selection within EU. Data stays within SAP EU infrastructure for EU customers.",
    dataProcessing:
      "All processing in EU for EU customers. Joule AI is cloud-only — NOT available for on-premise S/4HANA (confirmed not on roadmap). DORA-designated as Critical ICT Third-Party Service Provider (Nov 2025).",
    trainingDataUse:
      "Customer data isolated. SAP AI ethics guidelines govern data use. No customer data used for training foundation models.",
    subprocessors:
      "SAP subsidiaries. EU-based infrastructure primarily. Published subprocessor list.",
    dpaDetails:
      "GDPR-embedded by design as EU-native company. DPA comprehensive under German data protection standards. No cross-border transfer issues for EU customers.",
    slaDetails:
      "99.7% for cloud services. Enterprise SLAs available. RISE with SAP includes managed SLA.",
    dataPortability:
      "SAP Integration Suite for data exchange. Standard APIs. S/4HANA data model is well-documented. However, deep ERP integration creates high switching costs.",
    exitTerms:
      "Pricing: Joule Base included free in SAP Cloud subscriptions. Premium AI via AI Units (EUR 5-10/unit, minimum ~100 units/year). Pricing criticized as opaque and difficult to predict (CIO Magazine).",
    ipTerms:
      "Customer retains IP in business data and configurations.",
    certifications:
      "ISO 27001, ISO 22301, BS 10012, SOC 1, SOC 2, C5 (BSI Germany — key differentiator), NIS2 aligned. Designated DORA Critical ICT Third-Party Service Provider.",
    encryptionInfo:
      "AES-256 at rest. TLS 1.2+ in transit. BYOK available via SAP Data Custodian.",
    accessControls:
      "SSO/SAML, RBAC, MFA, comprehensive authorization concepts. S/4HANA-grade access controls.",
    modelDocs:
      "AI use case documentation published. Responsible AI guidelines. Joule capabilities documented per module.",
    explainability:
      "Decision explanations for specific AI use cases (e.g., hiring recommendations in SuccessFactors, financial anomaly detection).",
    biasTesting:
      "SAP AI Ethics advisory panel. Bias testing for HR AI specifically in SuccessFactors. German AI standards contributor.",
    aiActStatus:
      "Active in EU AI Act discussions. German industry AI standards contributor. C5-attested. Best-positioned ERP vendor for AI Act compliance due to EU-native status.",
    gdprStatus:
      "EU-native. GDPR by design. DPO appointed. BSI-certified. Strongest GDPR posture of any enterprise platform vendor.",
    euResidency:
      "Native EU. German data protection standards. C5 attested. Strongest EU compliance of any ERP vendor. Not subject to US CLOUD Act.",
    deploymentModel: "hybrid",
    sourceModel: "closed-source",
    industrySlugs: [
      "financial-services",
      "manufacturing",
      "public-sector",
      "human-resources",
      "energy-utilities",
    ],
    scores: {
      "eu-ai-act": "A-",
      gdpr: "A",
      dora: "A-",
      "eba-eiopa-guidelines": "B+",
    },
  },

  // 2. ServiceNow Now Assist
  {
    slug: "servicenow-now-assist",
    vendor: "ServiceNow",
    name: "Now Assist / AI Agents",
    type: "ITSM AI / Workflow AI",
    risk: "Limited",
    description:
      "Generative AI deeply embedded across IT, HR, and customer service workflows. Dominant ITSM market position. ISO 42001 certified for AI management (rare). Now Assist ACV surpassed $600M, on track for $1B by FY26. Cloud-only — no on-prem option. Strong vendor lock-in: all AI investment is non-portable. EU data centers in Germany, Netherlands, Ireland. EU Cloud Code of Conduct compliant.",
    category: "Healthcare",
    featured: true,
    capabilityType: "conversational-ai",
    vendorHq: "Santa Clara, USA",
    euPresence:
      "Yes — EU subsidiary. Data centers in Germany (Dusseldorf, Frankfurt), Netherlands (Amsterdam), Ireland (Dublin), Switzerland (Geneva, Zurich). UK sovereign data center pair (London, Newport).",
    foundedYear: 2004,
    employeeCount: "29,000-33,000 (growing rapidly, ~33,127 by Mar 2026)",
    fundingStatus:
      "Public (NYSE: NOW). Revenue crossed $10B in 2024. Q4 2025 subscription revenue: $3.47B.",
    marketPresence: "Leader",
    customerCount: "8,100+ enterprise customers",
    notableCustomers:
      "ExxonMobil (AI for employee experience)\nStandard Chartered (AI Control Tower)\nMerck & Co. (security operations transformation)\n44 AI customers spending $1-10M annually on Now Assist\n528 customers generating $5M+ ACV\nLargest Now Assist deal: $20M+",
    customerStories:
      "ExxonMobil deployed Now Assist for employee experience across the organization. Standard Chartered built AI Control Tower with RaptorDB. Now Assist ACV grew 169% YoY to $800M. 21 deals included 5+ Now Assist products.",
    useCases:
      "IT incident summarization and auto-resolution\nKnowledge article generation\nVirtual agent conversations (IT, HR, CSM)\nHR case management automation\nChange request automation\nSecurity incident response (SecOps)\nAI Control Tower for centralized AI governance\nWorkflow mining and optimization",
    dataStorage:
      "EU data centers: Germany (Dusseldorf, Frankfurt), Netherlands (Amsterdam), Ireland (Dublin). Customer selects instance location. Instance-isolated architecture.",
    dataProcessing:
      "Processing in customer-selected data center region. Cloud-only — no on-premise deployment option. EU Cloud Code of Conduct assessed and compliant.",
    trainingDataUse:
      "Now Assist does not use customer data for model training. GenAI stack covered under SOC 2 Type 2 scope.",
    subprocessors:
      "ServiceNow subsidiaries. Published subprocessor list with notifications.",
    dpaDetails:
      "GDPR-compliant DPA. EU SCCs included. EU Cloud Code of Conduct Level 2 compliance.",
    slaDetails:
      "99.8% uptime SLA. Financial remedies for breaches. Enterprise SLAs negotiable.",
    dataPortability:
      "API-based data export (XML, JSON). Warning: all AI investment is non-portable — switching from ServiceNow means losing all AI customization, workflows, and trained models.",
    exitTerms:
      "Pricing: Now Assist is an add-on to ITSM/CSM/HRSD Pro or Enterprise. Estimated $50-100+/fulfiller/month. At 500 fulfillers, adds ~$300K-$600K/year. Consumption model with base Assist allocation + overage packs.",
    ipTerms:
      "Customer retains IP in data and configurations. Workflow definitions owned by customer.",
    certifications:
      "SOC 2 Type 2 (explicitly covers GenAI stack, AI/ML, and DART), SOC 1, ISO 27001 (since 2012), ISO 27018, ISO 27701, ISO 42001 (AI management — rare), EU Cloud Code of Conduct Level 2.",
    encryptionInfo:
      "AES-256 at rest. TLS 1.2 in transit. Column-level encryption available.",
    accessControls:
      "SSO/SAML, RBAC, MFA, IP whitelisting, comprehensive audit logs. AI Control Tower for centralized AI governance.",
    modelDocs:
      "Now Assist documentation. AI use case guides. GenAI Controller documentation for LLM selection and management.",
    explainability:
      "Incident summarization shows source references. Knowledge article grounding. AI Control Tower provides governance visibility.",
    biasTesting:
      "Limited public information on bias testing methodology. ISO 42001 certification implies structured AI risk management.",
    aiActStatus:
      "ISO 42001 certified — provides structured AI governance framework aligned with AI Act requirements. Classification as limited risk for ITSM use cases.",
    gdprStatus:
      "DPA available. DPO appointed. DPIA support. EU Cloud Code of Conduct compliance. Strong EU data center coverage.",
    euResidency:
      "EU data centers in Germany, Netherlands, Ireland. EU Cloud Code of Conduct compliant. UK sovereign pair available.",
    deploymentModel: "cloud-only",
    sourceModel: "closed-source",
    industrySlugs: [
      "telecommunications",
      "financial-services",
      "healthcare",
      "manufacturing",
    ],
    scores: {
      "eu-ai-act": "B+",
      gdpr: "B+",
      dora: "B",
      "eba-eiopa-guidelines": "B",
    },
  },

  // 3. Workday Illuminate AI
  {
    slug: "workday-illuminate-ai",
    vendor: "Workday",
    name: "Workday Illuminate AI",
    type: "HR AI / Finance AI",
    risk: "High",
    description:
      "ML-driven talent management, workforce planning, and financial reporting. HIGH-RISK under EU AI Act — HR recruitment AI is explicitly classified as high-risk. Active class action lawsuit (Mobley v. Workday, May 2025) alleging AI-based hiring discrimination by race, age, and disability. Court ruled AI vendors can be directly liable even without making final hiring decisions. Despite this, 70% customer AI adoption rate and ISO 42001 certified. EU Sovereign Cloud launching 2026. Invested $12M in AI Act compliance.",
    category: "HR",
    featured: true,
    capabilityType: "supervised-ml",
    vendorHq: "Pleasanton, USA",
    euPresence:
      "Yes — EU subsidiary (Dublin). EU Sovereign Cloud launching 2026 on AWS infrastructure, with EU-based personnel for operations, support, and maintenance.",
    foundedYear: 2005,
    employeeCount: "20,000-21,000",
    fundingStatus:
      "Public (NASDAQ: WDAY). Revenue $8.446B (FY2025, +16.4% YoY). Subscription revenue: $7.718B.",
    marketPresence: "Leader",
    customerCount: "10,500+ organizations, 70M+ users globally",
    notableCustomers:
      "AT&T, Bank of America, Comcast, Accenture, Salesforce\nWalmart, Apple, McKesson, CVS Health\n60%+ of Fortune 500\nWon 7 Fortune 500 customers in Q4 2025 (3 from Oracle/SAP)",
    customerStories:
      "Over 60% of Fortune 500 use Workday HCM. 70% customer AI adoption rate. Won 7 Fortune 500 customers in Q4 2025 including 3 switching from Oracle and SAP. However, Mobley v. Workday class action (May 2025) alleges AI hiring discrimination — court granted conditional class certification.",
    useCases:
      "Talent acquisition and AI-powered screening (HIGH RISK)\nPayroll automation\nWorkforce planning and optimization\nEmployee experience and engagement\nFinancial close automation\nSkills intelligence and career pathing\nCompensation benchmarking\nDiversity and inclusion analytics",
    dataStorage:
      "EU data centers via AWS. EU Sovereign Cloud (launching 2026): full EU data residency with all operations managed by EU-based personnel.",
    dataProcessing:
      "EU processing for EU customers. EU Sovereign Cloud ensures data center access, support, and maintenance by EU-based personnel only. Cloud-only — no on-premise option.",
    trainingDataUse:
      "Customer data used to train ML models with opt-out available. Workday has the largest proprietary dataset of workforce and financial data — key competitive advantage but also GDPR risk.",
    subprocessors:
      "Workday subsidiaries. AWS as infrastructure. Published subprocessor list.",
    dpaDetails:
      "GDPR-compliant DPA. EU SCCs. Invested $12M in EU AI Act compliance for HR AI high-risk requirements.",
    slaDetails: "99.7% uptime SLA. Enterprise SLAs available.",
    dataPortability:
      "Workday APIs and reports for data export. Flex Credits model for consumption. Pricing not publicly disclosed despite 'no hidden fees' messaging.",
    exitTerms:
      "Pricing: Flex Credits model (fungible consumption, renewed annually). Specific amounts not disclosed. Data export within 60 days. Transition assistance available.",
    ipTerms: "Customer retains IP in HR/financial data.",
    certifications:
      "ISO 27001 (since 2010), ISO 27018, ISO 42001 (AI management — via Schellman), SOC 2. NIST AI Risk Management Framework evaluation (via Coalfire).",
    encryptionInfo: "AES-256 at rest. TLS 1.2 in transit.",
    accessControls:
      "SSO/SAML, RBAC, MFA, security groups, audit reports.",
    modelDocs:
      "Workday AI documentation. ML model descriptions. Responsible AI practices published.",
    explainability:
      "Skill match explanations. Recommendation reasoning available. HiredScore features include candidate scoring explanations (required for AI Act compliance).",
    biasTesting:
      "CRITICAL: Mobley v. Workday class action (May 2025) alleges AI-based hiring discrimination by race, age, and disability. Court ruled AI vendors can be directly liable. Workday invested $12M in bias testing, explainability, and human review for EU AI Act compliance. HiredScore acquisition under scrutiny — court ordered disclosure of which customers enabled AI features.",
    aiActStatus:
      "HIGH-RISK classification for HR/recruitment AI under EU AI Act. Invested $12M in compliance (bias testing, explainability, human review). Maintaining European market access worth ~$500M annually. ISO 42001 + NIST AI RMF certified.",
    gdprStatus:
      "DPA available. DPO appointed. DPIA for HR processing. EU Sovereign Cloud launching 2026. Training data use with opt-out is a GDPR consideration.",
    euResidency:
      "EU Sovereign Cloud launching 2026 with full data residency. EU-based personnel for all operations. Built on AWS within EU.",
    deploymentModel: "cloud-only",
    sourceModel: "closed-source",
    industrySlugs: [
      "human-resources",
      "financial-services",
      "public-sector",
      "healthcare",
    ],
    scores: {
      "eu-ai-act": "B-",
      gdpr: "B",
      dora: "B-",
      "eba-eiopa-guidelines": "B",
    },
  },

  // 4. IBM watsonx
  {
    slug: "ibm-watsonx",
    vendor: "IBM",
    name: "watsonx",
    type: "Enterprise AI Platform",
    risk: "High",
    description:
      "The strongest on-premises LLM deployment option among major platforms. Full stack (watsonx.ai, .data, .governance) deployable on Red Hat OpenShift in customer data centers, air-gapped environments, or IBM Cloud EU regions. Granite models are open-source (Apache 2.0) — no vendor lock-in on the model layer. watsonx.governance for EU AI Act readiness. Historical baggage from Watson Health $4B writedown. Complex setup — not plug-and-play. Starting at $1,050/month for watsonx.ai Standard.",
    category: "Financial",
    featured: true,
    capabilityType: "ai-infrastructure",
    vendorHq: "Armonk, USA",
    euPresence:
      "Yes — extensive EU subsidiary network. IBM Cloud data centers in Frankfurt, London. On-premises via Red Hat OpenShift provides ultimate EU data control.",
    foundedYear: 1911,
    employeeCount: "160,000+ (consulting alone)",
    fundingStatus:
      "Public (NYSE: IBM). Revenue ~$62B (FY2024). watsonx launched May 2023. watsonx-specific revenue not broken out.",
    marketPresence: "Leader",
    customerCount: "Not disclosed for watsonx specifically",
    notableCustomers:
      "Samsung SDS (generative AI exploration)\nSAP (watsonx integration)\nOracle (watsonx Orchestrate on OCI)\nGroq (strategic inference partnership)\n80+ enterprise vendor integrations: Adobe, AWS, Microsoft, Salesforce, ServiceNow, Workday",
    customerStories:
      "SAP integrated watsonx into its platform. Oracle deployed watsonx Orchestrate on OCI. 80+ enterprise vendor integrations demonstrate platform breadth. However, Watson Health / Watson for Oncology history ($4B writedown) remains a trust concern.",
    useCases:
      "On-premises AI for regulated industries (strongest option)\nAI governance and compliance (watsonx.governance)\nCustom model training on proprietary data\nEnterprise search and knowledge retrieval\nDocument processing and automation\nCode generation (Granite Code models)\nConversational AI (watsonx Assistant)\nAI workflow orchestration (watsonx Orchestrate)",
    dataStorage:
      "IBM Cloud: Frankfurt, London + other EU regions. On-premises: full customer control via Red Hat OpenShift — data never leaves customer infrastructure. Air-gapped deployment supported.",
    dataProcessing:
      "On-premises via Red Hat OpenShift + Cloud Pak for Data — the strongest on-prem LLM story among major platforms. Requires GPUs (NVIDIA). Complete data sovereignty when deployed on-prem.",
    trainingDataUse:
      "Granite models: open-source (Apache 2.0), customer can inspect training methodology. Customer data for fine-tuning stays in customer environment. No data sharing with IBM for on-prem deployments.",
    subprocessors:
      "IBM subsidiaries. For on-prem: zero subprocessors (customer manages everything). Published list for cloud deployments.",
    dpaDetails:
      "GDPR-compliant DPA. EU SCCs. For on-prem deployments, no data processing agreement needed — customer is sole controller and processor.",
    slaDetails:
      "Cloud: IBM Cloud SLAs apply. On-prem: customer-managed. watsonx.ai Standard starts at $1,050/month. Enterprise tier requires custom quote.",
    dataPortability:
      "Granite models are Apache 2.0 — fully portable. Can run on any infrastructure. MLflow integration for model management. Open formats throughout.",
    exitTerms:
      "Pricing: watsonx.ai Standard from $1,050/month. watsonx Orchestrate from $500/month. Model inference from $0.10/M tokens (Granite). Enterprise pricing requires negotiation. 30% discount on first annual Standard subscription (limited time).",
    ipTerms:
      "Customer retains all IP. Granite models are Apache 2.0 — fully reusable. On-prem models are customer property.",
    certifications:
      "ISO 27001, ISO 27017, ISO 27018, ISO 27701, SOC 2 (IBM Cloud). Certifications across 170+ countries. C5 for some IBM Cloud services (not confirmed specifically for watsonx).",
    encryptionInfo:
      "AES-256 at rest. TLS 1.2+ in transit. IBM Key Protect and Hyper Protect Crypto Services for key management. On-prem: customer manages all encryption.",
    accessControls:
      "SSO/SAML, IAM, RBAC, MFA, audit logs. On-prem: integrated with customer's existing identity management (LDAP, AD).",
    modelDocs:
      "Granite model cards published. Open-source models allow full inspection. watsonx.governance provides model factsheets and lineage tracking. Technical documentation comprehensive.",
    explainability:
      "watsonx.governance: AI factsheets, model monitoring, drift detection, bias metrics. OpenScale for production model explainability. SHAP-based feature attribution available.",
    biasTesting:
      "watsonx.governance includes bias detection and mitigation tools. OpenScale for continuous bias monitoring. Fairness metrics tracked across protected attributes. However, historical Watson Health failures raise questions about AI quality assurance.",
    aiActStatus:
      "watsonx.governance specifically designed for AI Act compliance — model documentation, risk assessment, bias monitoring, audit trails. IBM is positioning governance as a key differentiator for regulated EU enterprises.",
    gdprStatus:
      "DPA available. DPO appointed. IBM Cloud EU data processing. On-prem: strongest possible GDPR posture (customer is sole controller). However, IBM is a US company subject to CLOUD Act for cloud deployments.",
    euResidency:
      "On-prem via Red Hat OpenShift: ultimate EU data sovereignty (customer controls everything). IBM Cloud: Frankfurt and other EU regions. Strongest on-prem option for EU-regulated enterprises.",
    deploymentModel: "hybrid",
    sourceModel: "open-source",
    industrySlugs: [
      "financial-services",
      "healthcare",
      "public-sector",
      "manufacturing",
      "insurance",
    ],
    scores: {
      "eu-ai-act": "B+",
      gdpr: "B+",
      dora: "B",
      "eba-eiopa-guidelines": "B+",
    },
  },

  // 5. Salesforce Agentforce / Einstein
  {
    slug: "salesforce-agentforce-einstein",
    vendor: "Salesforce",
    name: "Agentforce / Einstein AI",
    type: "CRM AI / Agentic AI",
    risk: "Limited",
    description:
      "Autonomous AI agents for CRM: lead scoring, case resolution, client onboarding. Einstein Trust Layer is the strongest native AI safety/governance layer among CRM platforms — prevents data leakage to LLMs. Agentforce ARR hit $800M (169% YoY). Hyperforce EU data residency with EU Cloud Code of Conduct Level 2 compliance. C5 (Germany) and ENS (Spain) certified. However: B2B sales agent deployments fail 77% of the time. Implementation takes 9-15 weeks vs. marketed 4-6 weeks. $2/conversation consumption pricing creates budget unpredictability.",
    category: "Financial",
    featured: true,
    capabilityType: "autonomous-agents",
    vendorHq: "San Francisco, USA",
    euPresence:
      "Yes — EU subsidiary. Hyperforce data centers in Frankfurt, Paris. EU Cloud Code of Conduct Level 2 compliance for Agentforce (achieved 2025).",
    foundedYear: 1999,
    employeeCount: "76,453 (FY2025), growing to ~83,334 (FY2026)",
    fundingStatus:
      "Public (NYSE: CRM). Revenue $37.9B (FY2025), $41.53B (FY2026). Agentforce ARR: $800M (169% YoY growth).",
    marketPresence: "Leader",
    customerCount: "150,000+ customers globally",
    notableCustomers:
      "Engine (travel — Agentforce in 12 days, projecting $2M savings)\n1-800Accountant (70% admin chat resolved by agents during tax season)\nSafari365 (62% case resolution)\n29,000 Agentforce deals closed total",
    customerStories:
      "Engine deployed Agentforce in 12 days projecting $2M savings. 1-800Accountant resolves 70% of admin chat via agents during tax season. However, Salesforce targeted 1 billion agents by 2025 but reached ~29,000 deals. B2B sales deployments fail 77% of the time.",
    useCases:
      "Autonomous lead qualification and scoring\nCustomer case resolution (62% automation reported)\nPersonalized marketing campaigns\nSales forecasting and pipeline intelligence\nKnowledge article generation\nClient onboarding automation\nData Cloud unification across channels\nCommerce AI for product recommendations",
    dataStorage:
      "EU data residency via Hyperforce (Frankfurt, Paris) on AWS infrastructure. Region-locked by code — data cannot exit EU boundary.",
    dataProcessing:
      "EU processing available. Einstein Trust Layer isolates customer data from external LLM providers — zero-data-retention with LLM partners. Prompt injection defense, toxicity detection, audit trails.",
    trainingDataUse:
      "Einstein Trust Layer ensures customer data is not used for external model training. Zero-data-retention guarantee with all LLM partners.",
    subprocessors:
      "Salesforce subsidiaries. AWS as Hyperforce infrastructure. Published subprocessor list.",
    dpaDetails:
      "GDPR-compliant DPA. EU SCCs. EU Cloud Code of Conduct Level 2 compliance (specifically for Agentforce).",
    slaDetails:
      "99.9% uptime SLA with financial remedies. Enterprise SLAs available.",
    dataPortability:
      "Data export via API and bulk export tools. Warning: deep CRM integration creates significant switching costs. All AI customization is non-portable.",
    exitTerms:
      "Pricing complex: Agentforce add-on $125/user/month (Enterprise); $150/user/month (industry clouds). All-in-one edition: $550/user/month. Consumption: $2/conversation. 6% price increase effective Aug 2025. Hidden costs: implementation $50K-$150K, training $2K-$5K/user, ongoing consulting $10K-$25K/month.",
    ipTerms:
      "Customer retains IP in data and generated outputs. Trust Layer audit trails maintained.",
    certifications:
      "ISO 27001/27017/27018, SOC 1, SOC 2, SOC 3, C5 (Germany), ENS (Spain), EU Cloud Code of Conduct Level 2 (for Agentforce specifically). Strongest EU certification portfolio among CRM vendors.",
    encryptionInfo:
      "AES-256 at rest. TLS 1.2 in transit. Shield Platform Encryption available. Einstein Trust Layer adds additional encryption for LLM interactions.",
    accessControls:
      "SSO/SAML, RBAC, MFA, field-level security, audit trail. Einstein Trust Layer adds prompt-level security controls.",
    modelDocs:
      "Einstein AI documentation. Trust Layer architecture published. Agentforce deployment guides.",
    explainability:
      "Einstein prediction explanations. Trust Layer transparency for all LLM interactions — audit logs show what data was sent, what response was received, and what was filtered.",
    biasTesting:
      "Bias detection in Einstein predictions. Fairness guidelines published. Trust Layer prevents certain types of biased outputs via toxicity filters.",
    aiActStatus:
      "Salesforce AI compliance program. Trusted AI Principles published. EU Cloud Code of Conduct Level 2 demonstrates proactive regulatory alignment. C5 + ENS certification.",
    gdprStatus:
      "DPA available. DPO appointed. EU data processing documented. Hyperforce EU residency contractually guaranteed. EU Cloud Code of Conduct compliance.",
    euResidency:
      "Hyperforce EU regions (Frankfurt, Paris). EU Cloud Code of Conduct Level 2 compliant. C5 and ENS certified. EU Operating Zone provides in-region support.",
    deploymentModel: "cloud-only",
    sourceModel: "closed-source",
    industrySlugs: [
      "financial-services",
      "insurance",
      "telecommunications",
      "healthcare",
    ],
    scores: {
      "eu-ai-act": "B+",
      gdpr: "A-",
      dora: "B",
      "eba-eiopa-guidelines": "B+",
    },
  },

  // 6. Palantir AIP
  {
    slug: "palantir-aip",
    vendor: "Palantir Technologies",
    name: "Palantir AIP",
    type: "Decision Intelligence Platform",
    risk: "High",
    description:
      "AI-powered operational intelligence connecting LLMs to enterprise data via the unique Ontology framework — creates a digital twin of the organization. Strongest on-prem/edge/air-gapped deployment of any AI platform (including military-grade IL-5/6). FedRAMP High authorized. 75% AIP Bootcamp conversion rate (0-to-production in 5 days). However: US company subject to CLOUD Act (fundamental tension for EU sovereignty). Deep government/defense ties raise privacy concerns. Ontology creates extreme vendor lock-in. Only 3,936 employees supporting rapidly growing customer base.",
    category: "Public Sector",
    featured: true,
    capabilityType: "decision-intelligence",
    vendorHq: "Denver, USA",
    euPresence:
      "Yes — EU/UK subsidiaries. Government contracts in several EU states (Germany police via Gotham, NATO). On-premises deployment means data stays in customer infrastructure. However, subject to US CLOUD Act — German politicians warned about constitutional and European legal risks.",
    foundedYear: 2003,
    employeeCount: "3,936 (2025) — remarkably small for revenue generated",
    fundingStatus:
      "Public (NYSE: PLTR). Revenue $4.475B (FY2025, +56% YoY). Total Contract Value record $2.76B Q3 2025 (+151% YoY). Revenue split: ~55% government, ~45% commercial (shifting toward commercial).",
    marketPresence: "Leader",
    customerCount: "571 US commercial enterprise customers (+49% YoY, Q3 2025)",
    notableCustomers:
      "US Army ($10B Enterprise Service Agreement over 10 years)\nUK Ministry of Defence (GBP 240M over 3 years)\nNATO (Maven Smart System)\nGerman police (Gotham)\nAmerican Airlines, bp, Novartis, Waste Management, Lumen, Walgreens, Lowe's, Lockheed Martin",
    customerStories:
      "US Army signed $10B 10-year deal. UK MoD: GBP 240M over 3 years with NATO interoperability. AIP Bootcamp converts 75% of prospects — 5-day engagement produces production-grade AI workflows. American Airlines, bp, Novartis are active commercial users.",
    useCases:
      "Government and defense decision support\nSupply chain optimization and disruption response\nManufacturing process control and quality\nDefense intelligence analysis\nStrategic planning and scenario modeling\nCrisis response coordination\nCommercial operations optimization\nRegulatory compliance and audit trail",
    dataStorage:
      "Customer-controlled deployment: on-premises, sovereign cloud, or edge. Data never leaves customer infrastructure for on-prem deployments. PFCS Forward extends to tactical edge on customer hardware.",
    dataProcessing:
      "Full on-premises: Apollo, Gotham, Foundry, AIP deployable in customer data centers. Air-gapped environments supported (military/intelligence). Edge deployment for field operations. Most flexible deployment model of any enterprise AI platform.",
    trainingDataUse:
      "Customer data stays within customer environment. LLMs integrated via AIP use customer-selected models. No data exfiltration to Palantir for on-prem deployments.",
    subprocessors:
      "Minimal for on-prem deployments (mostly self-contained). AWS/Azure as infrastructure for cloud option. Published list for PFCS.",
    dpaDetails:
      "Custom DPA for each government/enterprise client. Negotiated per contract. Note: US company subject to CLOUD Act — creates fundamental tension with EU data sovereignty under GDPR/Schrems II, even for on-prem deployments (Palantir employees may have access).",
    slaDetails:
      "Custom SLAs per contract. Government contracts include stringent availability requirements. Pricing not publicly listed — land-and-expand model. Contracts typically start in low millions and expand significantly.",
    dataPortability:
      "Ontology data exportable via APIs. Warning: Ontology framework is deeply proprietary — once built, switching costs are extremely high. This is the strongest vendor lock-in of any platform in this database.",
    exitTerms:
      "Negotiated per contract. Data deletion upon termination. However, rebuilding Ontology on a different platform is practically prohibitive.",
    ipTerms:
      "Customer retains IP in operational data. Ontology configurations may have joint IP considerations depending on contract.",
    certifications:
      "FedRAMP High Baseline (entire suite: AIP, Apollo, Foundry, Gotham). DoD Impact Level 5 and 6. ISO 27001/27017/27018. SOC 1, SOC 2 Type 2, SOC 3. PFCS Forward authorization for on-prem/edge. No C5 certification found.",
    encryptionInfo:
      "AES-256 at rest. TLS 1.2+ in transit. End-to-end encryption available. Military-grade security controls.",
    accessControls:
      "Fine-grained RBAC at every level (row, column, cell). Comprehensive audit trails. MFA. Designed for classified environments.",
    modelDocs:
      "Ontology architecture documented. Limited public model information (security reasons). AIP methodology white papers available.",
    explainability:
      "Ontology provides complete audit trails for AI decisions. Every action traced back through data lineage. Strongest traceability of any platform for compliance and audit purposes.",
    biasTesting:
      "Limited public information on bias testing methodology. Government deployments have their own evaluation frameworks.",
    aiActStatus:
      "Classification depends on use case — government decision-making likely high-risk. FedRAMP/IL-5/IL-6 compliance demonstrates security maturity. No specific EU AI Act statement published.",
    gdprStatus:
      "Custom DPA per client. On-prem provides strongest data control. However, as US company, subject to CLOUD Act — critics including German Green Party flagged 'significant constitutional and European legal risks.'",
    euResidency:
      "On-premises and sovereign cloud options provide physical EU residency. However, CLOUD Act exposure remains a legal concern regardless of data location.",
    deploymentModel: "hybrid",
    sourceModel: "closed-source",
    industrySlugs: [
      "public-sector",
      "manufacturing",
      "healthcare",
      "energy-utilities",
    ],
    scores: {
      "eu-ai-act": "C+",
      gdpr: "B-",
      dora: "B",
      "eba-eiopa-guidelines": "C+",
    },
  },
];

// ─── Seed runner ────────────────────────────────────────────

async function main() {
  console.log("Enriching batch 2 AI system profiles...\n");

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
        data: {
          industries: {
            set: industries.map((i) => ({ id: i.id })),
          },
        },
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
