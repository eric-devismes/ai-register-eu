/**
 * Content Enrichment — Batch 3 (Bedrock, Databricks, Snowflake, UiPath, CrowdStrike,
 * Darktrace, Glean, GitHub Copilot, Palo Alto Cortex XSIAM)
 *
 * Run with: npx tsx src/data/seed-enrichment-batch3.ts
 * Safe to run multiple times (uses upsert on slug).
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const systems = [
  // 1. Amazon Bedrock
  {
    slug: "amazon-bedrock-aws",
    vendor: "Amazon Web Services",
    name: "Amazon Bedrock",
    type: "Multi-Model AI Platform",
    risk: "High",
    description:
      "Broadest model choice of any managed AI platform — Claude, Llama, Mistral, Cohere, Titan via unified API. 4-tier pricing (Flex, Standard, Priority, Reserved). 140+ compliance certifications including C5, ENS High. AWS European Sovereign Cloud launched Jan 2026 (Brandenburg, EUR 7.8B investment) with dedicated EU subsidiaries and EU-resident personnel only. Consumption costs hard to predict — requires AWS cost expertise.",
    category: "Financial",
    featured: true,
    capabilityType: "ai-infrastructure",
    vendorHq: "Seattle, USA",
    euPresence:
      "Yes — extensive EU subsidiary network. Data centers in Frankfurt, Ireland, Paris, Stockholm, Milan, Spain. AWS European Sovereign Cloud launched Jan 2026 (Brandenburg, Germany) — EUR 7.8B investment, dedicated EU subsidiaries, EU-resident personnel only.",
    foundedYear: 2006,
    employeeCount: "139,000+ (AWS)",
    fundingStatus:
      "Subsidiary of Amazon (NASDAQ: AMZN). AWS revenue ~$107B (2024), ~37% operating margin. Bedrock-specific revenue not disclosed.",
    marketPresence: "Leader",
    customerCount: "Millions of AWS enterprise customers",
    notableCustomers:
      "Robinhood\nSwisscom (early EU adopter, Zurich region)\nEpsilon\nCisco\nGenpact\nPwC Australia",
    customerStories:
      "Swisscom is notable as early EU Bedrock adopter using Zurich region. Multi-model approach lets customers switch between Claude, Llama, Mistral without infrastructure changes.",
    useCases:
      "Multi-model AI strategy (vendor diversification)\nDocument processing and extraction\nConversational AI with Guardrails\nCode generation (via CodeWhisperer/Q)\nKnowledge base creation (RAG)\nCustom model fine-tuning\nModel evaluation and comparison\nAgent workflows with tool use",
    dataStorage:
      "EU regions: Frankfurt, Ireland, Paris, Stockholm, Milan, Spain. AWS European Sovereign Cloud (Jan 2026): Brandenburg, Germany — data legally separated from US entity, EU-only personnel.",
    dataProcessing:
      "All inference in customer-selected region. Data does not leave the region. Sovereign Cloud provides legal separation from US AWS entity. Bedrock available on sovereign cloud.",
    trainingDataUse:
      "Customer data NOT used for training ANY model. Isolated per customer account. This applies across all model providers (Claude, Llama, Mistral, etc.).",
    subprocessors:
      "AWS infrastructure. Published subprocessor list with change notifications.",
    dpaDetails:
      "GDPR-compliant AWS DPA. EU SCCs comprehensive. 140+ certifications.",
    slaDetails:
      "99.9% uptime. Financial credits for breaches. 4-tier pricing: Flex (cheapest, best-effort), Standard (default), Priority (fastest), Reserved (committed 1-3 month terms). Batch processing at 50% discount.",
    dataPortability:
      "API-based. S3 export. Standard formats. Multi-model reduces vendor lock-in — can switch models without changing infrastructure.",
    exitTerms:
      "Data deleted after account closure. 90-day retrieval window. Multi-model approach means switching AI providers is relatively easy.",
    ipTerms: "Customer retains all IP in inputs/outputs.",
    certifications:
      "140+ compliance programs. ISO 27001, SOC 1/2/3, C5 (BSI Germany), ENS High (Spain), FedRAMP High, HIPAA, PCI DSS, ISO 27017, ISO 27018, ISO 27701. Most certified cloud AI platform.",
    encryptionInfo:
      "AES-256 at rest (AWS KMS, customer-managed keys). TLS 1.2+. VPC endpoints. Private Link available.",
    accessControls:
      "AWS IAM, SSO/SAML, MFA, RBAC, CloudTrail audit logs, VPC isolation, Private Link.",
    modelDocs:
      "Individual model cards (Claude, Llama, etc.). Bedrock documentation comprehensive. Guardrails documentation.",
    explainability:
      "Guardrails provide content filtering explanations and denied topic reasons. Model-specific explainability varies by provider.",
    biasTesting:
      "AWS Responsible AI guidance. SageMaker Clarify for custom model bias detection. Individual model providers handle foundation model bias testing.",
    aiActStatus:
      "AWS compliance program for EU AI Act. Shared responsibility model documented. Sovereign Cloud specifically designed for EU regulatory compliance.",
    gdprStatus:
      "Comprehensive. DPO appointed. EU representative designated. DPIA resources. Strongest DPA coverage of any cloud provider.",
    euResidency:
      "Full EU data residency via regional deployment. AWS European Sovereign Cloud (Jan 2026) provides strongest guarantee: dedicated EU entity, EU-only personnel, C5 attested.",
    deploymentModel: "cloud-only",
    sourceModel: "closed-source",
    industrySlugs: ["financial-services", "healthcare", "manufacturing", "public-sector"],
    scores: { "eu-ai-act": "B+", gdpr: "A-", dora: "A-", "eba-eiopa-guidelines": "B+" },
  },

  // 2. Databricks / Mosaic AI
  {
    slug: "databricks-mosaic-ai",
    vendor: "Databricks",
    name: "Databricks / Mosaic AI",
    type: "Data + AI Platform",
    risk: "Limited",
    description:
      "Lakehouse platform for enterprise AI/ML with open-source foundation (MLflow, Delta Lake, Apache Spark). Unity Catalog for unified data governance. Customer controls all data in their own cloud account — no vendor lock-in on data layer. $5.4B ARR growing 65% YoY, valued at $134B. AI products alone >$1B ARR. No C5 certification (blocks German public sector). DBU pricing opaque and hard to forecast.",
    category: "Financial",
    featured: false,
    capabilityType: "ai-infrastructure",
    vendorHq: "San Francisco, USA",
    euPresence:
      "Yes — EU subsidiary. EU workspaces via AWS (Frankfurt, Ireland) and Azure (West Europe, North Europe). Partnering with cloud providers on sovereign offerings but no independent sovereign deployment.",
    foundedYear: 2013,
    employeeCount: "12,300+",
    fundingStatus:
      "Private — valued at $134B. Revenue $5.4B ARR (Q4 FY2026, +65% YoY). AI products alone >$1B ARR. 700 customers >$1M ARR, 70 at >$10M ARR.",
    marketPresence: "Leader",
    customerCount: "20,000+ organizations. 60%+ Fortune 500.",
    notableCustomers:
      "Adidas\nAT&T\nBayer\nBlock\nMastercard\nRivian\nUnilever\n60%+ of Fortune 500",
    customerStories:
      "Adidas uses Databricks for data analytics and ML. Bayer for pharmaceutical research. 700 customers spending >$1M ARR demonstrates enterprise traction.",
    useCases:
      "Custom AI/ML model training on proprietary data\nData engineering pipelines at scale\nReal-time analytics and dashboards\nLLM fine-tuning with Mosaic AI\nFeature engineering and feature store\nMLOps and model lifecycle management\nUnified data governance (Unity Catalog)\nVector search and RAG pipelines",
    dataStorage:
      "EU workspaces via AWS/Azure EU regions. Customer controls all data in their own cloud account — Databricks processes data but doesn't store it outside the customer's environment.",
    dataProcessing:
      "Processing in customer-selected cloud region. Data stays in customer's cloud account. No independent sovereign cloud — depends on AWS/Azure sovereign offerings.",
    trainingDataUse:
      "Customer controls all training data. No data sharing with Databricks. Models trained on customer data are customer property.",
    subprocessors: "AWS/Azure as infrastructure. Published subprocessor list.",
    dpaDetails: "GDPR-compliant DPA. EU SCCs.",
    slaDetails:
      "99.95% for premium tier. DBU consumption pricing — AI workloads start ~$0.07/DBU. Enterprise contracts negotiated. Costs can be unpredictable.",
    dataPortability:
      "Open formats (Delta Lake/Parquet). No proprietary lock-in on data. MLflow open-source for model management. Strongest data portability of any AI platform.",
    exitTerms:
      "Data fully owned by customer in their cloud account. Models are customer property. Open-source tooling (MLflow, Spark) means skills and workflows are portable.",
    ipTerms: "Customer retains all IP. Models are customer property.",
    certifications:
      "SOC 1 Type II, SOC 2 Type II, ISO 27001/27017/27018, HIPAA, PCI DSS. No C5 attestation — gap for German public sector.",
    encryptionInfo: "AES-256 at rest (BYOK). TLS 1.2+ in transit.",
    accessControls:
      "SSO/SAML, Unity Catalog for unified data governance, RBAC, MFA, audit logs. Fine-grained access control at table/column/row level.",
    modelDocs:
      "Open-source MLflow provides full model lineage and documentation. Model registry with versioning. Experiment tracking.",
    explainability:
      "SHAP integration for feature importance. Model monitoring dashboards. Unity Catalog lineage tracking.",
    biasTesting:
      "ML fairness tools available via open-source ecosystem. Customer responsibility for bias testing on custom models.",
    aiActStatus:
      "Platform enables compliance — customer responsible for use case classification. Unity Catalog governance features support AI Act documentation requirements.",
    gdprStatus:
      "DPA available. DPIA support. Unity Catalog for data governance and access control. Customer controls data location.",
    euResidency:
      "EU workspaces via AWS/Azure. Customer data stays in customer's cloud account. Sovereign cloud story depends on cloud provider partner.",
    deploymentModel: "cloud-only",
    sourceModel: "open-source",
    industrySlugs: ["financial-services", "healthcare", "manufacturing", "insurance"],
    scores: { "eu-ai-act": "B", gdpr: "B+", dora: "B", "eba-eiopa-guidelines": "B" },
  },

  // 3. Snowflake Cortex AI
  {
    slug: "snowflake-cortex-ai",
    vendor: "Snowflake",
    name: "Snowflake Cortex AI",
    type: "Data Cloud AI / Analytics AI",
    risk: "Limited",
    description:
      "AI that runs on data that never leaves the customer's Snowflake account — zero data movement architecture. Tri-Secret Secure encryption (customer key + Snowflake key + cloud provider key). Horizon governance framework. Strong in financial services: 57% of Fortune 500 FS firms. Revenue $4.684B (FY2026). AI Credits pricing overhaul cut costs 61.5% on Azure West Europe. Launch partner for AWS European Sovereign Cloud.",
    category: "Financial",
    featured: false,
    capabilityType: "search-retrieval",
    vendorHq: "Bozeman, USA",
    euPresence:
      "Yes — EU subsidiary. EU regions on AWS and Azure (Frankfurt, Ireland, etc.). Launch partner for AWS European Sovereign Cloud.",
    foundedYear: 2012,
    employeeCount: "7,834 (2025), growing to ~9,060 (2026)",
    fundingStatus:
      "Public (NYSE: SNOW). Revenue $4.684B (FY2026, +29% YoY). 688 customers >$1M trailing-12-month product revenue.",
    marketPresence: "Leader",
    customerCount: "12,621 customers. 766 Forbes Global 2000 accounts.",
    notableCustomers:
      "JPMorgan Chase\nMorgan Stanley (Strategic Partner of Year 2025)\nAdobe\nPepsiCo\nNovartis\nUber\nAllianz\nComcast\n57% of Fortune 500 financial services firms",
    customerStories:
      "Morgan Stanley named Strategic Partner of Year 2025. JPMorgan Chase uses Cortex for analytics. 57% of Fortune 500 financial services firms use Snowflake. AI Credits pricing overhaul cut costs 61.5% for Azure West Europe customers.",
    useCases:
      "AI on enterprise data without moving it\nDocument AI for unstructured data processing\nCortex Search for semantic retrieval\nCortex Analyst for natural language SQL\nPredictive analytics on Snowflake data\nData classification and governance\nRAG pipelines within data boundary\nReal-time feature engineering",
    dataStorage:
      "Data stays in customer Snowflake account. Customer-chosen region. Never shared with third parties. No customer data used for model training.",
    dataProcessing:
      "Processing in customer-chosen region. Data never leaves Snowflake service boundary. Zero data movement architecture — AI comes to the data, not the other way around.",
    trainingDataUse:
      "Customer data NOT used for training. Stays in customer environment. Models process data in-place.",
    subprocessors: "AWS/Azure/GCP as infrastructure. Published subprocessor list.",
    dpaDetails: "GDPR-compliant DPA. EU SCCs.",
    slaDetails:
      "99.9% uptime SLA. Enterprise tier higher. Credit-based pricing. AI Credits decoupled from edition pricing (Apr 2026). Moderate workload: ~$2,012/month after pricing overhaul (down from ~$6,630).",
    dataPortability:
      "Standard SQL export. Parquet, CSV, JSON formats. Iceberg table format for open portability.",
    exitTerms: "Data fully owned by customer. Export anytime in standard formats.",
    ipTerms: "Customer retains all IP.",
    certifications:
      "SOC 2 Type II, SOC 1, ISO 27001, HIPAA, PCI DSS, FedRAMP Moderate, HITRUST. Tri-Secret Secure encryption. No C5 attestation listed.",
    encryptionInfo:
      "Tri-Secret Secure: customer-managed key + Snowflake key + cloud provider key = strongest encryption of any data platform. AES-256. TLS 1.2+.",
    accessControls:
      "SSO/SAML, RBAC, MFA, network policies, audit logs. Horizon governance framework for unified data access control.",
    modelDocs:
      "Cortex AI documentation. Model selection guidance. Cortex Analyst and Cortex Search documentation.",
    explainability:
      "Limited built-in explainability for LLM features. SQL-based transparency for Cortex Analyst queries.",
    biasTesting: "Limited public information. Customer responsibility for ML fairness on custom models.",
    aiActStatus:
      "Platform-level compliance. Customer responsible for use case classification. Horizon governance supports documentation requirements.",
    gdprStatus:
      "DPA available. DPIA support. Strong data governance via Horizon. Zero data movement = minimal GDPR surface area.",
    euResidency:
      "Strong — data never leaves customer account in chosen region. Launch partner for AWS European Sovereign Cloud. Tri-Secret Secure for key control.",
    deploymentModel: "cloud-only",
    sourceModel: "closed-source",
    industrySlugs: ["financial-services", "insurance", "telecommunications", "healthcare"],
    scores: { "eu-ai-act": "B", gdpr: "B+", dora: "B+", "eba-eiopa-guidelines": "B" },
  },

  // 4. CrowdStrike Falcon AI
  {
    slug: "crowdstrike-falcon-ai",
    vendor: "CrowdStrike",
    name: "CrowdStrike Falcon AI",
    type: "Endpoint Security / AI Security",
    risk: "Limited",
    description:
      "AI-native cybersecurity across endpoint, cloud, and identity with single lightweight agent architecture. MITRE ATT&CK leader. Charlotte AI for natural-language threat hunting. New sovereign EU partnership with Schwarz Digits/STACKIT — telemetry stays within EU. Revenue $3.95B (FY2025). July 2024 global outage (faulty update) remains a trust concern. Per-endpoint pricing: ~$60-185/device/year.",
    category: "Financial",
    featured: false,
    capabilityType: "cybersecurity-ai",
    vendorHq: "Austin, USA",
    euPresence:
      "Yes — EU subsidiary, Frankfurt data center. New partnership with Schwarz Digits/STACKIT provides sovereign EU-only infrastructure — telemetry and detection processing stays within EU.",
    foundedYear: 2011,
    employeeCount: "8,500+",
    fundingStatus:
      "Public (NASDAQ: CRWD). Revenue $3.95B (FY2025, subscription $3.76B). Ending ARR $4.24B.",
    marketPresence: "Leader",
    customerCount: "29,000+ subscription customers",
    notableCustomers:
      "Major banks, government agencies, Fortune 500 companies (specific names under NDA for security reasons)",
    customerStories:
      "MITRE ATT&CK evaluation leader. Sovereign EU partnership with Schwarz Digits/STACKIT (2025) for EU-only processing. However, July 2024 global outage remains a trust concern.",
    useCases:
      "Endpoint threat detection and response (EDR/XDR)\nCloud workload protection\nIdentity threat detection\nThreat hunting (Charlotte AI)\nIncident response automation\nAI workload security\nManaged detection and response\nVulnerability management",
    dataStorage:
      "EU cloud available (Frankfurt). Sovereign EU via STACKIT partnership — telemetry stays EU-only. Supports GDPR and EU Cyber Resilience Act.",
    dataProcessing:
      "EU processing via Frankfurt data center. STACKIT sovereign partnership ensures EU-only processing for telemetry and detection.",
    trainingDataUse:
      "Security telemetry used to improve threat models (aggregated, anonymized across customer base — this is how threat intelligence works).",
    subprocessors: "CrowdStrike subsidiaries. AWS/STACKIT infrastructure.",
    dpaDetails: "GDPR-compliant DPA. EU SCCs.",
    slaDetails:
      "99.99% cloud uptime SLA. Pricing: Falcon Go ~$60/device/yr, Enterprise ~$185/device/yr. Volume discounts at 500/1,000/5,000 thresholds.",
    dataPortability: "API-based data export. SIEM/SOAR integration.",
    exitTerms: "Sensor removal removes data collection. Historical data export available.",
    ipTerms: "Customer retains IP in security data.",
    certifications:
      "SOC 2 Type II, FedRAMP, MITRE ATT&CK evaluation leader. 99.99% uptime SLA.",
    encryptionInfo: "AES-256 at rest. TLS 1.2+ in transit.",
    accessControls: "SSO/SAML, RBAC, MFA, API key management, audit logs.",
    modelDocs: "Threat intelligence documentation. Charlotte AI methodology. MITRE ATT&CK mapping.",
    explainability: "Detection explanations with MITRE ATT&CK mapping across kill chain.",
    biasTesting: "N/A — security AI, different considerations than decision AI.",
    aiActStatus: "Security tools generally classified as limited risk under AI Act.",
    gdprStatus: "DPA available. DPO appointed. EU processing via Frankfurt + STACKIT sovereign.",
    euResidency: "Frankfurt data center + STACKIT sovereign EU partnership. Strong for GDPR/Cyber Resilience Act.",
    deploymentModel: "cloud-only",
    sourceModel: "closed-source",
    industrySlugs: ["financial-services", "public-sector", "telecommunications", "energy-utilities"],
    scores: { "eu-ai-act": "B", gdpr: "B+", dora: "B+", "eba-eiopa-guidelines": "B" },
  },

  // 5. Darktrace
  {
    slug: "darktrace",
    vendor: "Darktrace",
    name: "Darktrace / SECURE AI",
    type: "AI-Native Cybersecurity",
    risk: "Limited",
    description:
      "Self-learning AI using unsupervised ML — models normal behavior and detects anomalies without signatures or rules. On-premises appliance deployment keeps all data local. First cybersecurity firm to achieve ISO 42001 (responsible AI management, July 2025). Cambridge UK origin. Acquired by Thoma Bravo (Oct 2024) for $5.3B — now private, less financial transparency. ~10,000 customers. Targeting $1B revenue. High false-positive rates reported by some users.",
    category: "Financial",
    featured: false,
    capabilityType: "cybersecurity-ai",
    vendorHq: "Cambridge, UK",
    euPresence:
      "Yes — UK-based (post-Brexit), European origin. On-prem deployment keeps all data local — strongest data sovereignty for cybersecurity.",
    foundedYear: 2013,
    employeeCount: "2,400+",
    fundingStatus:
      "Private — acquired by Thoma Bravo (Oct 2024) for $5.3B. Revenue ~$545-550M pre-acquisition, targeting $1B post-acquisition.",
    marketPresence: "Challenger",
    customerCount: "~10,000 customers globally",
    notableCustomers:
      "Customer names generally under NDA for security reasons. ~10,000 organizations across all sectors.",
    customerStories:
      "First cybersecurity firm to achieve ISO 42001 (July 2025). Self-learning AI approach is unique — no signatures, no rules, learns normal behavior automatically.",
    useCases:
      "Network anomaly detection\nEmail security (Antigena Email)\nInsider threat detection\nCloud security monitoring\nOT/ICS security for industrial environments\nAutonomous Response (Antigena) — neutralize threats in real time\nZero-day threat detection\nCompliance monitoring",
    dataStorage:
      "On-premises option for complete data control — no cloud dependency. SaaS cloud option also available.",
    dataProcessing:
      "Can run fully on-prem. No data sent to Darktrace for on-prem deployments. Self-learning happens locally on customer data.",
    trainingDataUse:
      "Self-learning on customer data locally. Unsupervised ML learns normal patterns per environment. No data exfiltration.",
    subprocessors: "Minimal for on-prem. Published list for cloud.",
    dpaDetails: "GDPR-aligned. UK/EU DPA available. UK adequacy decision applies.",
    slaDetails: "Custom SLAs. On-prem: customer-managed availability.",
    dataPortability: "On-prem: customer controls all data. API export available.",
    exitTerms: "On-prem appliance removal. Data stays with customer.",
    ipTerms: "Customer retains security data.",
    certifications:
      "ISO 27001, ISO 27018, Cyber Essentials, ISO 42001 (AI management — first cybersecurity firm, July 2025).",
    encryptionInfo: "AES-256 at rest. TLS 1.2+ in transit.",
    accessControls: "RBAC, MFA, SSO integration, audit logs.",
    modelDocs: "Self-learning AI approach documented. White papers. Peer-reviewed publications.",
    explainability:
      "Anomaly explanations with behavioral context — shows what 'normal' looks like and why the detection deviated.",
    biasTesting: "N/A — unsupervised learning for security anomaly detection. ISO 42001 covers AI risk management.",
    aiActStatus:
      "Security tools generally limited risk. ISO 42001 certification demonstrates structured AI governance. UK regulatory focus.",
    gdprStatus: "GDPR-aligned. UK adequacy. DPA available. On-prem: strongest possible data control.",
    euResidency: "On-prem deployment provides strongest residency guarantee. UK-based company (UK adequacy post-Brexit).",
    deploymentModel: "hybrid",
    sourceModel: "closed-source",
    industrySlugs: ["financial-services", "energy-utilities", "public-sector", "manufacturing"],
    scores: { "eu-ai-act": "B+", gdpr: "A-", dora: "B+", "eba-eiopa-guidelines": "B" },
  },

  // 6. Palo Alto Networks Cortex XSIAM
  {
    slug: "palo-alto-cortex-xsiam",
    vendor: "Palo Alto Networks",
    name: "Cortex XSIAM",
    type: "SOC Automation / AI Security",
    risk: "Limited",
    description:
      "SOC automation platform consolidating SIEM, SOAR, XDR, and ASM into one. Fastest-growing product in PANW history — surpassed $1B cumulative bookings. Claims 10x faster threat investigation. Average customer spends $1M+ ARR. Parent revenue $9.2B (FY2025). Only ~470 customers — still proving enterprise scale. Extremely high price point limits adoption.",
    category: "Financial",
    featured: false,
    capabilityType: "cybersecurity-ai",
    vendorHq: "Santa Clara, USA",
    euPresence: "Yes — EU subsidiary. Multi-region cloud options available.",
    foundedYear: 2005,
    employeeCount: "16,068",
    fundingStatus:
      "Public (NASDAQ: PANW). Revenue $9.2B (FY2025, +15% YoY). XSIAM exceeded $1B cumulative bookings.",
    marketPresence: "Leader",
    customerCount: "~470 XSIAM customers (growing). 80,000+ PANW customers total.",
    notableCustomers:
      "Major financial institutions and government agencies (names under NDA for security). ~470 XSIAM-specific customers.",
    customerStories:
      "XSIAM surpassed $1B cumulative bookings — fastest-growing product in PANW history. Average deal size $1M+ ARR demonstrates enterprise-grade positioning.",
    useCases:
      "SOC automation and consolidation\nExtended detection and response (XDR)\nSecurity information and event management (SIEM replacement)\nSecurity orchestration (SOAR)\nAttack surface management (ASM)\nThreat intelligence correlation\nIncident investigation (10x faster claimed)\nCompliance reporting",
    dataStorage: "Multi-region cloud. Specific EU-only deployment details require direct engagement.",
    dataProcessing: "Cloud-based processing. Region selection available.",
    trainingDataUse: "Security telemetry aggregated for threat intelligence improvement.",
    subprocessors: "Palo Alto Networks subsidiaries. Cloud infrastructure providers.",
    dpaDetails: "GDPR-compliant DPA available.",
    slaDetails: "Enterprise SLAs. Average customer $1M+ ARR. No published list prices.",
    dataPortability: "API-based export. SIEM data exportable in standard formats.",
    exitTerms: "Enterprise contracts negotiated individually. Consolidation means switching back to multiple tools is complex.",
    ipTerms: "Customer retains security data.",
    certifications: "SOC 2 Type II, ISO 27001, FedRAMP (parent company). XSIAM-specific certifications in progress.",
    encryptionInfo: "AES-256 at rest. TLS 1.2+ in transit.",
    accessControls: "SSO/SAML, RBAC, MFA, comprehensive audit logs.",
    modelDocs: "XSIAM architecture documentation. Threat intelligence methodology.",
    explainability: "Automated investigation provides reasoning chains for detections. Incident correlation visualization.",
    biasTesting: "N/A — security AI.",
    aiActStatus: "Security tools generally limited risk.",
    gdprStatus: "DPA available. Multi-region deployment options.",
    euResidency: "Multi-region cloud available. Specific EU-only guarantees require direct engagement.",
    deploymentModel: "cloud-only",
    sourceModel: "closed-source",
    industrySlugs: ["financial-services", "telecommunications", "public-sector"],
    scores: { "eu-ai-act": "B-", gdpr: "B", dora: "B+", "eba-eiopa-guidelines": "B" },
  },

  // 7. GitHub Copilot Enterprise
  {
    slug: "github-copilot-enterprise",
    vendor: "GitHub (Microsoft)",
    name: "GitHub Copilot Enterprise",
    type: "AI Code Assistant",
    risk: "High",
    description:
      "~37–42% market share in AI code assistants (growing competition from Cursor at $2B ARR). Business: $19/user/month, Enterprise: $39/user/month (requires GitHub Enterprise Cloud). Business/Enterprise code NOT used for model training. Full EU data residency for both AI inference AND repository content available as of April 2026 (FedRAMP Moderate also added). EU region expanding to EFTA countries (Norway, Switzerland) May 1, 2026. Coding Agent not yet supported with data residency enabled.",
    category: "Financial",
    featured: false,
    capabilityType: "generative-ai",
    vendorHq: "San Francisco, USA (Microsoft subsidiary)",
    euPresence:
      "Via Microsoft EU infrastructure. GitHub Enterprise Cloud EU data residency available for repository content and metadata. EFTA expansion (Norway, Switzerland) May 2026.",
    foundedYear: 2008,
    employeeCount: "Part of Microsoft (228,000+ total)",
    fundingStatus:
      "Microsoft subsidiary. GitHub estimated $2B+ ARR. Copilot: 15M+ users. Microsoft parent revenue $245B+ (FY2025).",
    marketPresence: "Leader",
    customerCount: "15M+ Copilot users. 100M+ GitHub developers.",
    notableCustomers:
      "Fortune 500 engineering teams broadly\nAccenture\nShopify\nMercedes-Benz\nDuolingo",
    customerStories:
      "42% market share in AI code assistants. 15M+ users. Studies show 55% faster task completion. Used across most major tech companies and Fortune 500 engineering teams.",
    useCases:
      "Code completion and generation\nCode review and security scanning\nDocumentation generation\nTest writing and test-driven suggestions\nCode explanation and refactoring\nPull request summaries\nOrganization-specific knowledge bases (Enterprise)\nCoding Agent for autonomous tasks (Enterprise)",
    dataStorage:
      "Business/Enterprise: code processed but not stored by GitHub. EU data residency for repository content and metadata. EFTA expansion May 2026.",
    dataProcessing:
      "Full EU inference residency available as of April 13, 2026 — all AI inference processing stays within EU designated geography when data residency is enabled. Coding Agent not supported with data residency enabled (limitation). EFTA expansion (Norway, Switzerland) May 1, 2026.",
    trainingDataUse:
      "Business/Enterprise: code NOT used for training — contractually guaranteed. Individual/Free: code may be used for model improvement. Enterprise tier: private model fine-tuning with strict data isolation.",
    subprocessors: "Microsoft/OpenAI infrastructure. Published subprocessor list.",
    dpaDetails: "Microsoft DPA applies. GitHub-specific terms. EU SCCs.",
    slaDetails:
      "99.9% GitHub uptime SLA. Copilot Business: $19/user/month. Enterprise: $39/user/month (requires Enterprise Cloud). Premium requests: $0.04/request beyond 1,000/month.",
    dataPortability:
      "Code stays in customer repos. No lock-in on code itself. Copilot suggestions are ephemeral. Enterprise customizations (knowledge bases) may not be portable.",
    exitTerms: "Code fully owned by customer. Copilot is an add-on — removing it doesn't affect repositories.",
    ipTerms: "Customer retains all IP. Copyright filter available to block suggestions matching public code.",
    certifications: "SOC 2 Type II (Azure infrastructure), ISO 27001, FedRAMP Moderate (April 2026), HIPAA eligibility for Enterprise (with BAA).",
    encryptionInfo: "AES-256 at rest. TLS 1.2 in transit.",
    accessControls: "SSO/SAML, organization policies, seat management, audit logs. Enterprise: SCIM provisioning.",
    modelDocs: "Copilot documentation. Limited model card information (uses OpenAI models).",
    explainability: "Code suggestions with inline context. No formal explainability tooling for suggestions.",
    biasTesting: "Limited. Some analysis of code generation patterns across languages.",
    aiActStatus:
      "Classification depends on use case. High risk if used for security-critical code generation. General coding assistance likely limited risk.",
    gdprStatus: "Microsoft DPA. Business/Enterprise privacy protections. EU data residency partial.",
    euResidency:
      "Full EU data residency for both AI inference AND repository content/metadata available (April 2026). Enterprise/Business admins enable from Copilot settings. EFTA expansion (Norway, Switzerland) May 1, 2026. Coding Agent unsupported with data residency enabled — limitation for autonomous coding workflows.",
    deploymentModel: "cloud-only",
    sourceModel: "closed-source",
    industrySlugs: ["financial-services", "telecommunications", "manufacturing"],
    scores: { "eu-ai-act": "B-", gdpr: "B", dora: "C+", "eba-eiopa-guidelines": "B-" },
  },
];

// ─── Seed runner ────────────────────────────────────────────

async function main() {
  console.log("Enriching batch 3 AI system profiles...\n");

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

  console.log(`\nDone — enriched ${systems.length} systems.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
