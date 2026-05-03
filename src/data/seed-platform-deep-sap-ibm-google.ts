/**
 * Platform Deep Dives: SAP Joule, IBM watsonx, Google Workspace Gemini
 * April 2026
 *
 * Same approach: commercial feature name → underlying AI capability →
 * real use case → EU risk classification → enterprise deployment guidance.
 *
 * Run with: npx tsx src/data/seed-platform-deep-sap-ibm-google.ts
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// ─── System Profile Updates ────────────────────────────────

const systemUpdates = [
  {
    slug: "sap-joule-enterprise",
    updates: {
      name: "SAP Joule / SuccessFactors AI / Business AI",
      type: "Enterprise ERP + HCM AI Copilot & Agents",
      description:
        "SAP's end-to-end enterprise AI platform built into every SAP cloud product. Three layers: (1) Joule Copilot — conversational AI assistant embedded in S/4HANA, SuccessFactors, Ariba, Concur, and BTP; (2) Joule AI Agents — autonomous agents handling multi-step HR, finance, and supply chain tasks; (3) Embedded AI — ML-powered features baked into every SAP module (intelligent robotic process automation, predictive analytics, document extraction). EU-native: headquartered in Germany, full EU data residency, designed for European regulatory compliance from the ground up.",
      useCases:
        "SuccessFactors — Joule HR Queries [ConvAI: employees ask HR policy questions in natural language | EU Risk: Limited | Note: informational; becomes high-risk if it gives binding HR rulings]\n" +
        "SuccessFactors — Joule Job Description Generator [GenAI: creates inclusive, standardised JDs from brief | EU Risk: Minimal | Note: HR author reviews and approves]\n" +
        "SuccessFactors — Joule Candidate Assessment Summary [GenAI: summarises interview feedback across reviewers | EU Risk: HIGH — Annex III Category 4 | Note: influences hiring decisions; human oversight mandatory; works council notification required]\n" +
        "SuccessFactors — Joule Performance Review Drafting [GenAI: drafts performance review narratives for manager review | EU Risk: HIGH — Annex III Category 4 | Note: employment consequence; manager must review/edit; Article 26(7) employee information rights]\n" +
        "SuccessFactors — AI-Powered Skills Inference [ML: infers employee skill profiles from work history and role data | EU Risk: HIGH — Annex III Category 4 | Note: affects career development and promotion; GDPR Article 22 if automated; works council rights]\n" +
        "SuccessFactors — Learning Path Recommendations [ML recommendation: suggests courses based on skills gaps and role | EU Risk: Limited | Note: development support; employee can ignore; no binding employment consequence]\n" +
        "SuccessFactors — Workforce Planning Analytics [Predictive ML: models headcount scenarios and skill demand | EU Risk: Limited | Note: management planning tool; no individual employment decisions]\n" +
        "S/4HANA — Joule Financial Close Assistant [GenAI + automation: guides finance teams through month-end close tasks | EU Risk: Minimal | Note: process guidance; human approves every financial posting]\n" +
        "S/4HANA — Anomaly Detection in Finance [ML: flags unusual transactions, duplicate payments, fraud patterns | EU Risk: Limited | Note: human reviews flagged items; not automated decision-making]\n" +
        "S/4HANA — Intelligent Accounts Payable [Document AI: extracts invoice data, matches to POs automatically | EU Risk: Minimal | Note: operational automation; exceptions routed to humans]\n" +
        "S/4HANA — Demand Forecasting [ML time series: predicts material and inventory needs | EU Risk: Minimal | Note: supply chain planning tool]\n" +
        "Ariba — Supplier Risk Intelligence [ML: scores supplier financial and ESG risk from external data | EU Risk: Limited | Note: procurement decision support; sourcing team acts on insights]\n" +
        "Ariba — Contract Intelligence [NLP: extracts obligations and risk clauses from contracts | EU Risk: Minimal | Note: legal review tool; lawyer reviews extractions]\n" +
        "Concur — AI Expense Anomaly Detection [ML: flags suspicious or policy-violating expenses | EU Risk: Limited | Note: finance/compliance tool; manager reviews flags]\n" +
        "BTP — AI Agent for Order Management [Agentic AI: end-to-end order processing without human intervention | EU Risk: Limited-High | Note: becomes high-risk if agent makes credit or payment terms decisions]\n" +
        "BTP — Document Information Extraction [ML/OCR: extracts structured data from unstructured documents | EU Risk: Minimal | Note: data entry automation]\n" +
        "Cross-module — Joule Agents for HR Processes [Agentic AI: autonomous onboarding, offboarding, leave workflows | EU Risk: HIGH if employment conditions affected | Note: access provisioning = limited; salary/role changes = high-risk]",
      aiActStatus:
        "Mixed risk profile. SuccessFactors HR AI (candidate assessment, performance review, skills inference, workforce scheduling) = HIGH risk under Annex III Category 4. Finance and supply chain AI = Limited/Minimal risk. SAP proactively announced EU AI Act compliance programme in 2025, acknowledging high-risk classification for HR features. As an EU-native (Germany-HQ) vendor, SAP has positioned compliance as competitive advantage. Conformity assessment for SuccessFactors AI HR features in progress, targeting completion Q3 2026.",
      assessmentNote:
        "SAP's EU-native HQ (Walldorf, Germany) gives it structural compliance advantages over US vendors: German law jurisdiction, ISO 27001 with C5 certification, and deep familiarity with European works council requirements. SuccessFactors HR AI features are HIGH risk and require deployer-side works council engagement in Germany, France, and Benelux. S/4HANA finance/supply chain AI is generally Limited/Minimal risk. Joule Agents need per-agent risk assessment depending on action scope.",
    },
  },
  {
    slug: "ibm-watsonx",
    updates: {
      name: "IBM watsonx (watsonx.ai / watsonx.data / watsonx.governance / Orchestrate)",
      type: "Enterprise AI Development Platform + Governance",
      description:
        "IBM's four-component enterprise AI platform: (1) watsonx.ai — AI studio for building, training, and deploying models including IBM Granite foundation models and open-source models (Llama, Mistral); (2) watsonx.data — open lakehouse data platform for AI data preparation and RAG at scale; (3) watsonx.governance — AI governance toolkit for monitoring model performance, bias, drift, and regulatory compliance; (4) watsonx Orchestrate — AI agent and automation orchestration. Unique EU compliance differentiator: watsonx.governance is purpose-built for AI regulatory compliance including EU AI Act technical documentation requirements.",
      useCases:
        "watsonx.ai — Custom Foundation Model Fine-Tuning [ML/GenAI: fine-tune Granite or open-source models on proprietary data | EU Risk: DEPENDS on application | Note: model development tool; risk classification based on downstream use case]\n" +
        "watsonx.ai — RAG Application Development [LLM + vector DB: build retrieval-augmented generation apps over enterprise data | EU Risk: Limited for knowledge management | Note: add EU residency and access controls for compliance]\n" +
        "watsonx.ai — Document Understanding [NLP: extract, classify, and summarise unstructured documents | EU Risk: Limited-High | Note: high-risk if documents contain personal data driving consequential decisions]\n" +
        "watsonx.ai — IBM Granite Code Assistant [Code LLM: AI code generation and completion | EU Risk: Minimal | Note: developer productivity; human reviews output]\n" +
        "watsonx.ai — Predictive Model Development [AutoML: build classification, regression, time-series models | EU Risk: INHERITS from use case | Note: credit scoring models built here = high-risk; marketing models = limited]\n" +
        "watsonx.data — Unified Data Lakehouse for AI [Data platform: unified structured/unstructured data for AI training | EU Risk: Minimal (infrastructure) | Note: GDPR data governance must be applied to data stored here]\n" +
        "watsonx.data — Federated Query Across Data Sources [Data federation: query multiple databases without data movement | EU Risk: Minimal | Note: reduces data duplication; supports data minimisation principle]\n" +
        "watsonx.governance — AI Lifecycle Governance [Monitoring platform: tracks all AI models across providers for drift, bias, performance | EU Risk: Minimal (governance tool) | Note: this IS the EU AI Act compliance infrastructure; enables Article 72 post-market monitoring]\n" +
        "watsonx.governance — Bias Detection & Fairness Monitoring [Automated fairness testing: monitors production AI for disparate impact across protected groups | EU Risk: Minimal | Note: enables compliance with EU AI Act Article 10 and GDPR anti-discrimination]\n" +
        "watsonx.governance — Model Risk Cards [Documentation: auto-generates technical documentation for deployed models | EU Risk: Minimal | Note: directly supports EU AI Act Annex IV technical documentation requirement]\n" +
        "watsonx.governance — Regulatory Compliance Tracking [Policy mapping: maps AI model behaviours to EU AI Act and GDPR requirements | EU Risk: Minimal | Note: compliance management tool]\n" +
        "watsonx Orchestrate — AI Agent Builder [Low-code agent platform: builds multi-step automation agents | EU Risk: DEPENDS on actions | Note: HR agents = high-risk; IT helpdesk agents = limited]\n" +
        "watsonx Orchestrate — Customer Service Agent [Agentic AI: handles customer queries with CRM/knowledge integration | EU Risk: Limited-High | Note: high-risk if makes consequential account decisions]\n" +
        "watsonx Orchestrate — HR Self-Service Agent [Agentic AI: answers HR policy questions, initiates HR transactions | EU Risk: HIGH — Annex III Category 4 | Note: HR data + potential employment consequences]\n" +
        "Industry Solutions — Financial Services (FSAI) [Pre-built models: credit risk, AML, fraud, regulatory reporting | EU Risk: HIGH — Annex III Category 5 | Note: financial decision AI; full conformity assessment required]\n" +
        "Industry Solutions — Healthcare AI [Clinical NLP: medical record analysis, clinical trial matching | EU Risk: HIGH — MDR/IVDR + EU AI Act | Note: dual compliance if diagnostic use]",
      aiActStatus:
        "IBM watsonx.governance is the most directly EU AI Act-aligned product in the market — purpose-built for AI lifecycle governance including EU AI Act Article 72 post-market monitoring, bias testing (Article 10), and technical documentation (Annex IV). IBM is uniquely positioned as both an AI platform provider AND an AI governance tool vendor. watsonx.ai applications have inherent risk based on downstream use case. Financial services and healthcare pre-built solutions are high-risk. IBM has published detailed EU AI Act compliance mappings for watsonx.governance. IBM Cloud EU regions provide data residency.",
      assessmentNote:
        "IBM's key differentiator: watsonx.governance. While competitors offer monitoring as an add-on, IBM built it as a first-class product specifically targeting regulated industries. For EU enterprises building custom AI and needing to comply with EU AI Act technical documentation and post-market monitoring requirements, watsonx.governance is worth evaluating as the compliance management layer — even if you use other vendors' models. IBM Granite models are open-source (Apache 2.0) and available on EU-hosted infrastructure.",
    },
  },
  {
    slug: "google-gemini-vertex-ai",
    updates: {
      name: "Google Workspace Gemini / Vertex AI / Gemini API",
      type: "Enterprise Productivity AI + Foundation Model Platform + Cloud AI",
      description:
        "Google's three-tier enterprise AI ecosystem: (1) Google Workspace with Gemini — AI features embedded across Gmail, Docs, Sheets, Slides, Meet, and Chat, powered by Gemini models; (2) Vertex AI — Google Cloud's enterprise ML/AI platform for building, training, and deploying custom AI (Gemini API, AutoML, Model Garden with 150+ models); (3) Google AI Studio / Gemini API — developer access to Gemini family of models. EU compliance: Google Cloud EU regions, Workspace data stays in EU for EU customers, Gemini grounding with Google Search, strong GPAI Code of Practice commitment.",
      useCases:
        "Gmail — Smart Reply & AI Drafting (Gemini in Gmail) [GenAI: contextual email drafts matching your tone from conversation history | EU Risk: Minimal | Note: user reviews before send; personalised to writing style]\n" +
        "Gmail — Thread Summarisation [GenAI: condenses long email threads to key points and actions | EU Risk: Minimal | Note: purely informational]\n" +
        "Gmail — Priority Inbox (ML ranking) [ML: ranks emails by importance with contextual signals | EU Risk: Limited | Note: important for regulated communication; human always decides]\n" +
        "Docs — Help Me Write [GenAI: drafts and rewrites document content from prompts | EU Risk: Minimal | Note: author reviews and publishes]\n" +
        "Docs — Document Summarisation [GenAI: condenses long documents | EU Risk: Minimal]\n" +
        "Docs — @ Mention AI Research [GenAI + Search: surfaces relevant people, files, meeting notes in context | EU Risk: Limited | Note: workplace data access; follows existing Workspace permissions]\n" +
        "Sheets — Help Me Organise [GenAI: creates tables and formulas from natural language | EU Risk: Minimal]\n" +
        "Sheets — Data Analysis with Gemini [GenAI: answers data questions, creates charts from plain English | EU Risk: Minimal-Limited | Note: becomes limited risk if outputs drive consequential business decisions]\n" +
        "Slides — Help Me Visualise [GenAI + Imagen: creates presentation content and AI-generated images | EU Risk: Minimal | Note: Article 50 labelling for AI-generated images if published externally]\n" +
        "Meet — Transcription & Smart Summaries [STT + GenAI: real-time transcription, meeting notes, action items | EU Risk: Limited | Note: voice data; participant notification required; employee monitoring considerations]\n" +
        "Meet — Translation in Meetings [ML translation: real-time spoken language translation | EU Risk: Minimal | Note: multilingual meeting support]\n" +
        "Chat — AI-Powered Search & Answers [RAG over Workspace: answers questions from Google Drive, Docs, Gmail | EU Risk: Limited | Note: powerful knowledge retrieval; access controls critical — Gemini respects existing permissions]\n" +
        "Google Vids — AI Video Creation [GenAI: creates videos from scripts/docs using stock footage and narration | EU Risk: Limited | Note: Article 50 synthetic media labelling if published externally]\n" +
        "Google NotebookLM — Research AI [RAG: deep research and Q&A over uploaded documents | EU Risk: Minimal for research | Note: enterprise: uploaded documents must comply with data handling policies]\n" +
        "Vertex AI — Gemini API for Custom Apps [Foundation model API: Gemini 3.1 Pro/Flash/Flash-Lite (2026) for custom enterprise AI; 3.1 Pro tops reasoning benchmarks (GPQA Diamond 94.3%); Flash-Lite at $0.25/M input tokens | EU Risk: INHERITS from application | Note: same compliance analysis as Azure OpenAI applies]\n" +
        "Vertex AI — AutoML [AutoML: trains custom ML models without deep ML expertise | EU Risk: INHERITS from use case | Note: credit scoring = high-risk; marketing = limited]\n" +
        "Vertex AI — Model Garden (150+ models) [Multi-model: access Gemini, Llama, Mistral, Claude on Google Cloud | EU Risk: INHERITS from application | Note: flexibility to pick EU-preferred models like Mistral]\n" +
        "Vertex AI — AI Search (RAG Enterprise) [RAG platform: enterprise-grade search over structured/unstructured data | EU Risk: Limited | Note: knowledge management; access controls critical]\n" +
        "Vertex AI — Agent Builder [Agentic AI: builds conversational and multi-step agents | EU Risk: DEPENDS on actions | Note: same risk analysis as Copilot Studio and Salesforce Agentforce agents]\n" +
        "Workspace — Work Insights [ML analytics: aggregated workplace productivity patterns | EU Risk: HIGH if individual-level | Note: same Viva Insights analysis applies — aggregated = limited; individual = high-risk]",
      aiActStatus:
        "Mixed risk profile. Workspace Gemini productivity features (Docs, Sheets, Gmail, Slides) = Minimal/Limited risk. Meet AI summaries and Work Insights at individual level = Limited to HIGH risk (employee monitoring boundary). Vertex AI applications inherit risk from use case — customer AI built on Vertex follows the same analysis as Azure OpenAI. Google registered Gemini family as GPAI models under EU AI Act. Systemic risk assessment ongoing for Gemini 3.1 Pro tier. Google submitted comprehensive GPAI Code of Practice commitments in December 2025. Vertex AI Assured Workloads enables EU data residency with enhanced compliance controls.",
      assessmentNote:
        "Google Workspace with Gemini is the direct competitor to Microsoft 365 Copilot. Key differences: Google Workspace data residency is configurable per region; Gemini's grounding with Google Search is a unique feature for real-time information. EU compliance posture is comparable to Microsoft but Microsoft EU Data Boundary has been independently audited longer. Vertex AI's Model Garden (150+ models) gives the most flexibility of any cloud AI platform — including running Mistral and Llama on EU infrastructure for sensitive data. Workspace Work Insights requires same governance as Microsoft Viva Insights.",
    },
  },
];

// ─── New Framework Sections ────────────────────────────────

const newSections = [
  {
    frameworkSlug: "eu-ai-act",
    title: "Platform Intelligence: SAP Joule — Capability Map & EU Risk",
    description:
      "SAP is the enterprise AI vendor with the strongest built-in EU compliance culture. But SuccessFactors HR AI is genuinely high-risk — and SAP is clear about that. Understanding the boundary between HR AI (high-risk) and ERP/SCM AI (minimal risk) is the critical compliance decision for SAP customers.",
    sortOrder: 33,
    statements: [
      {
        reference: "SAP Joule: The HR AI High-Risk Boundary",
        statement:
          "SAP SuccessFactors AI is the most commercially significant source of high-risk AI in SAP's portfolio. Features that are clearly HIGH risk (Annex III Category 4): candidate assessment summaries influencing hiring decisions; AI-generated performance review narratives used in performance ratings; skills inference models that affect promotion or development track assignment; workforce planning AI that influences redundancy or restructuring decisions. Features that are Limited risk: learning recommendation engines (employee can ignore); informational HR chatbot answering policy questions; administrative onboarding workflow automation that doesn't affect employment terms.",
        commentary:
          "Enterprise action for SAP SuccessFactors customers: conduct an audit of which Joule features are enabled and classify each against Annex III Category 4. For every high-risk feature: (1) document it in your AI system register; (2) conduct a FRIA if you're a public body; (3) notify your works council in DE/FR/NL/BE before deployment; (4) configure human oversight — managers must review and approve AI-generated performance content before it becomes part of the employee record; (5) implement an employee explanation mechanism (employees can ask why the AI scored them as it did). SAP provides configuration options to enforce human approval steps — use them.",
        sourceUrl: "https://help.sap.com/docs/successfactors-platform/setting-up-and-using-joule-in-sap-successfactors/use-cases-supported-in-joule",
        sourceNote: "SAP Help Portal — Joule Use Cases; EU AI Act Annex III Category 4",
        sortOrder: 1,
      },
      {
        reference: "SAP's EU-Native Compliance Advantage",
        statement:
          "SAP's Germany HQ is a genuine compliance differentiator. Unlike US vendors who retrofit EU compliance onto US-designed systems, SAP builds with German labour law, GDPR, and works council requirements as baseline assumptions. Practical implications: SAP EU Cloud (Germany, Netherlands, Ireland data centres) is standard; C5 certification (German federal cloud security standard) is native; DPA under German law with direct CNIL/BNetzA/BSI relationships. SAP was also the first major ERP vendor to publish a detailed EU AI Act compliance roadmap tied to specific SuccessFactors release dates.",
        commentary:
          "Procurement implication: if your EU compliance requirements are stringent (financial services, public sector, healthcare), SAP's structural EU-native compliance posture reduces your third-party risk compared to US-headquartered vendors. This advantage is most pronounced in HR AI (works council-sensitive features) and financial AI (EBA model risk management requirements). Counterpoint: SAP's AI capability in pure GenAI tasks (document drafting, summarisation) lags frontier models — for use cases requiring maximum GenAI sophistication, Joule with a BYO LLM option is worth evaluating.",
        sourceUrl: "https://news.sap.com/",
        sourceNote: "SAP EU AI Act Compliance Programme; C5 Certification",
        sortOrder: 2,
      },
    ],
  },
  {
    frameworkSlug: "eu-ai-act",
    title: "Platform Intelligence: IBM watsonx — Capability Map & EU Risk",
    description:
      "IBM watsonx is the only major enterprise AI platform where AI governance is a first-class product, not an afterthought. For enterprises building custom AI that must comply with EU AI Act Article 72 post-market monitoring and Annex IV technical documentation, watsonx.governance is the most complete solution available.",
    sortOrder: 34,
    statements: [
      {
        reference: "watsonx.governance: The EU AI Act Compliance Infrastructure Play",
        statement:
          "IBM watsonx.governance is purpose-built for what the EU AI Act requires from high-risk AI deployers: continuous post-market monitoring (Article 72), bias and fairness testing (Article 10), automated model documentation (Annex IV), and multi-provider model tracking. It monitors models deployed on any platform — Azure OpenAI, AWS SageMaker, Google Vertex AI, or IBM itself. For enterprises running AI from multiple vendors, watsonx.governance can serve as the central compliance monitoring layer regardless of where the AI runs.",
        commentary:
          "This is IBM's genuine differentiator. Other vendors tell you how compliant their platform is. IBM sells you the tools to prove your AI is compliant — to regulators, to auditors, to works councils. For a bank running 20+ AI models across multiple cloud providers, watsonx.governance as a cross-platform compliance layer is a legitimate procurement option. It generates the audit evidence that EU AI Act Article 26 deployer obligations require: decision logs, bias metrics, performance benchmarks, and documentation. The ROI case: avoided regulatory fine vs. watsonx.governance licence cost.",
        sourceUrl: "https://www.ibm.com/products/watsonx-governance",
        sourceNote: "IBM watsonx.governance product documentation; EU AI Act Articles 10, 26, 72",
        sortOrder: 1,
      },
      {
        reference: "IBM Granite Models: Open-Source, EU-Deployable Foundation Models",
        statement:
          "IBM Granite is a family of open-source foundation models (Apache 2.0 licence) covering language, code, time series, and scientific domains. Granite models can be deployed on IBM Cloud EU, on-premise, or on any EU cloud infrastructure — with full customer data control and no IBM data exposure. For EU enterprises requiring EU data sovereignty without depending on US hyperscalers, Granite + watsonx.ai on IBM Cloud Frankfurt provides a credible alternative to Azure OpenAI or Vertex AI with simpler GDPR compliance.",
        commentary:
          "Granite's open-source nature means: full model transparency (weights, training methodology, evaluation results all published); no vendor lock-in; deployable in air-gapped EU environments for highest-sensitivity use cases. Granite Code models are competitive for enterprise code generation. Granite language models are smaller than frontier models (7B-34B parameters) — suitable for domain-specific fine-tuning but not for complex multi-step reasoning requiring GPT-5/Claude 4 class capability. The right choice for structured enterprise tasks (document classification, data extraction, specialised Q&A) deployed with EU data residency requirements.",
        sourceUrl: "https://www.ibm.com/granite",
        sourceNote: "IBM Granite model documentation; Apache 2.0 licence",
        sortOrder: 2,
      },
    ],
  },
  {
    frameworkSlug: "eu-ai-act",
    title: "Platform Intelligence: Google Workspace Gemini — Capability Map & EU Risk",
    description:
      "Google Workspace with Gemini is Microsoft 365 Copilot's direct competitor. Compliance profile is comparable, with strong EU data residency via Workspace EU regions. The unique Vertex AI Model Garden gives EU enterprises the most model flexibility of any cloud platform.",
    sortOrder: 35,
    statements: [
      {
        reference: "Workspace Gemini vs M365 Copilot: The EU Compliance Comparison",
        statement:
          "Both Google Workspace Gemini and Microsoft 365 Copilot offer strong EU data residency, do not train on customer data, and have comparable GDPR postures. Key differences: (1) Data residency: Microsoft EU Data Boundary has been independently audited longer; Google Workspace EU residency is configurable but requires explicit admin configuration. (2) Model grounding: Gemini's optional Google Search grounding is powerful but involves external web calls — disable for sensitive data processing. (3) Meet AI vs Teams Copilot: functionally equivalent for transcription/summaries — same employee monitoring compliance analysis applies. (4) Vertex AI's 150+ model library gives more AI model flexibility than Azure; Azure has larger enterprise market share and more compliance documentation.",
        commentary:
          "Procurement decision guide: if your organisation is Google Workspace-native, Gemini is the natural AI layer — adding M365 Copilot on top creates data fragmentation. If Microsoft 365 is your productivity suite, Copilot is the simpler choice. If you need maximum AI model flexibility on EU cloud infrastructure (using Mistral, Llama, or custom models), Vertex AI Model Garden with Assured Workloads is the most flexible option. For regulated industries requiring independently audited EU data residency, Microsoft EU Data Boundary currently has more documented third-party audits.",
        sourceUrl: "https://workspace.google.com/intl/en/features/",
        sourceNote: "Google Workspace Gemini features; Vertex AI Assured Workloads; Microsoft EU Data Boundary comparison",
        sortOrder: 1,
      },
      {
        reference: "Vertex AI Model Garden: The EU Multi-Model Strategy",
        statement:
          "Vertex AI's Model Garden hosts 150+ models including Google's Gemini family (Gemini 3.1 Pro, Flash, Flash-Lite), Meta Llama, Mistral, Anthropic Claude, Cohere, and others — all accessible through a single Google Cloud API with unified billing, security, and compliance controls. For EU enterprises with a tiered AI architecture strategy (different models for different data sensitivity levels), Model Garden enables: Mistral Large 2 for EU-sensitive data (EU-native model), Llama 4 for on-premise-equivalent control, Gemini 3.1 Pro for complex tasks on de-identified data, and Gemini 3.1 Flash-Lite for high-volume low-cost tasks ($0.25/M input tokens).",
        commentary:
          "This is Vertex AI's strongest EU compliance card. Rather than betting your EU AI architecture on a single model provider, Model Garden lets you route different AI tasks to different models based on data sensitivity and capability requirements — all within Google Cloud EU regions. Practical architecture: sensitive HR or financial data → Mistral via Vertex AI EU; internal knowledge management → Gemini Flash EU; complex reasoning on anonymised data → Gemini Ultra EU. One DPA, one security configuration, multiple model options. No need for separate integrations with each model provider.",
        sourceUrl: "https://cloud.google.com/model-garden",
        sourceNote: "Google Vertex AI Model Garden documentation; EU Assured Workloads",
        sortOrder: 2,
      },
    ],
  },
];

// ─── News Entries ─────────────────────────────────────────

const newsEntries = [
  {
    title: "SAP SuccessFactors Joule HR AI — EU AI Act High-Risk Compliance Roadmap",
    description:
      "SAP published a detailed EU AI Act compliance roadmap for SuccessFactors AI features in 2025, explicitly acknowledging high-risk classification (Annex III Category 4) for AI-assisted hiring, performance management, and skills inference features. The roadmap specifies: Q2 2026 — conformity assessment documentation complete; Q3 2026 — human oversight configuration enforcement available in product; Q4 2026 — FRIA template and works council guidance published. SAP positioned this as evidence that EU-native vendors can lead on AI Act compliance.",
    changeType: "certification",
    date: new Date("2025-11-15"),
    sourceUrl: "https://news.sap.com/",
    sourceLabel: "SAP Newsroom",
    author: "VendorScope Editorial",
    systemSlug: "sap-joule-enterprise",
  },
  {
    title: "IBM watsonx.governance — EU AI Act Compliance Mapping Published",
    description:
      "IBM published a detailed mapping of watsonx.governance capabilities to EU AI Act requirements in 2025. The mapping covers: Article 9 risk management (continuous monitoring), Article 10 data governance (bias testing), Article 12 logging (model decision audit trail), Article 15 robustness (drift detection), Article 72 post-market monitoring (automated performance tracking), and Annex IV documentation (model risk cards). IBM positioned watsonx.governance as the compliance infrastructure layer for EU enterprises managing AI from any provider.",
    changeType: "update",
    date: new Date("2025-08-20"),
    sourceUrl: "https://www.ibm.com/products/watsonx-governance",
    sourceLabel: "IBM watsonx.governance",
    author: "VendorScope Editorial",
    systemSlug: "ibm-watsonx",
  },
  {
    title: "Google Workspace Gemini Included in Business/Enterprise Plans",
    description:
      "Google included Gemini AI features in all Workspace Business and Enterprise subscriptions from January 2025, removing the separate Gemini add-on requirement. EU enterprise customers on Business Standard/Plus and Enterprise tiers now get Gemini in Gmail, Docs, Sheets, Slides, and Meet without additional cost. This significantly accelerates enterprise Gemini adoption across the EU. Google confirmed EU data residency applies to Gemini processing for customers in EU Workspace regions.",
    changeType: "update",
    date: new Date("2025-01-15"),
    sourceUrl: "https://workspaceupdates.googleblog.com/2025/01/expanding-google-ai-to-more-of-google-workspace.html",
    sourceLabel: "Google Workspace Updates Blog",
    author: "VendorScope Editorial",
    systemSlug: "google-gemini-vertex-ai",
  },
  {
    title: "IBM Granite 3.0 — Open-Source EU-Deployable Foundation Models",
    description:
      "IBM released Granite 3.0 models in 2025, significantly improving capability across language (3B-8B parameter range), code, and time-series. Granite 3.0 models are Apache 2.0 licensed and available on Hugging Face, IBM Cloud, and on-premise deployment. For EU enterprises requiring open-source, auditable AI models with clear training data provenance (critical for EU AI Act Article 10 compliance), Granite's fully documented training methodology and data sourcing is a key advantage over proprietary models.",
    changeType: "new_version",
    date: new Date("2025-10-01"),
    sourceUrl: "https://www.ibm.com/granite",
    sourceLabel: "IBM Granite",
    author: "VendorScope Editorial",
    systemSlug: "ibm-watsonx",
  },
];

// ─── Main ──────────────────────────────────────────────────

async function main() {
  console.log("🌱 Starting SAP / IBM / Google Workspace deep-dive seed...\n");

  const frameworks = await prisma.regulatoryFramework.findMany({ select: { id: true, slug: true } });
  const frameworkMap = Object.fromEntries(frameworks.map((f) => [f.slug, f.id]));

  const industries = await prisma.industry.findMany({ select: { id: true, slug: true } });
  const industryMap = Object.fromEntries(industries.map((i) => [i.slug, i.id]));
  const defaultIndustryIds = ["financial-services", "healthcare", "public-sector"]
    .filter((s) => industryMap[s]).map((s) => ({ id: industryMap[s] }));

  // ─── Update System Records ──────────────────────────────
  console.log("📦 Updating system records...");

  for (const { slug, updates } of systemUpdates) {
    const updated = await prisma.aISystem.update({
      where: { slug },
      data: { ...updates, assessedAt: new Date("2026-04-07"), industries: { set: defaultIndustryIds } },
    });
    console.log(`  ✅ Updated: ${updated.vendor} — ${updated.name}`);
  }

  const allSystems = await prisma.aISystem.findMany({ select: { id: true, slug: true } });
  const systemMap = Object.fromEntries(allSystems.map((s) => [s.slug, s.id]));

  // ─── Add Framework Sections ─────────────────────────────
  console.log("\n📋 Adding platform intelligence sections...");
  let sectionsAdded = 0;
  let statementsAdded = 0;

  for (const sec of newSections) {
    const { frameworkSlug, statements, ...sectionFields } = sec;
    const frameworkId = frameworkMap[frameworkSlug];
    if (!frameworkId) continue;

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
      const exists = await prisma.policyStatement.findFirst({
        where: { reference: stmt.reference, sectionId: dbSection.id },
      });
      if (!exists) {
        await prisma.policyStatement.create({ data: { ...stmt, sectionId: dbSection.id } });
        statementsAdded++;
      }
    }
    console.log(`  ✅ ${sectionFields.title}`);
  }

  // ─── Add News ───────────────────────────────────────────
  console.log("\n📰 Adding news entries...");
  let newsAdded = 0;

  for (const entry of newsEntries) {
    const { systemSlug, ...data } = entry;
    const systemId = systemSlug ? systemMap[systemSlug] : undefined;
    const exists = await prisma.changeLog.findFirst({ where: { title: data.title } });
    if (exists) {
      await prisma.changeLog.update({ where: { id: exists.id }, data: { ...data, systemId } });
    } else {
      await prisma.changeLog.create({ data: { ...data, systemId } });
    }
    newsAdded++;
    console.log(`  ✅ ${data.title.substring(0, 60)}...`);
  }

  console.log("\n✨ SAP/IBM/Google deep-dive complete!");
  console.log(`   Sections: ${sectionsAdded} | Statements: ${statementsAdded} | News: ${newsAdded}`);

  const totals = {
    systems: await prisma.aISystem.count(),
    sections: await prisma.frameworkSection.count(),
    statements: await prisma.policyStatement.count(),
    changelogs: await prisma.changeLog.count(),
  };
  console.log("\n📊 Database totals:", totals);
}

main().catch((e) => { console.error("❌", e); process.exit(1); }).finally(() => prisma.$disconnect());
