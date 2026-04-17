/**
 * Generate the AI Compass EU Assessment Model & Vendor Reports document.
 *
 * Run: node scripts/generate-report.js
 * Output: AI-Compass-EU-Assessment-Model-v1.docx
 */

const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat,
  HeadingLevel, BorderStyle, WidthType, ShadingType, PageBreak, PageNumber,
  TableOfContents,
} = require("docx");

// ─── Colors ──────────────────────────────────────────────
const EU_BLUE = "003399";
const LIGHT_BLUE = "D6E4F0";
const LIGHT_GRAY = "F2F2F2";
const WHITE = "FFFFFF";
const BORDER = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const BORDERS = { top: BORDER, bottom: BORDER, left: BORDER, right: BORDER };
const CELL_MARGINS = { top: 60, bottom: 60, left: 100, right: 100 };

// Page width: A4 with 1" margins → content = 11906 - 2880 = 9026 DXA
const PAGE_W = 9026;

// ─── Helpers ─────────────────────────────────────────────

function heading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 200 },
    children: [new TextRun({ text, bold: true, size: 32, font: "Arial", color: EU_BLUE })],
  });
}

function heading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 160 },
    children: [new TextRun({ text, bold: true, size: 26, font: "Arial", color: EU_BLUE })],
  });
}

function heading3(text) {
  return new Paragraph({
    spacing: { before: 200, after: 120 },
    children: [new TextRun({ text, bold: true, size: 22, font: "Arial", color: "333333" })],
  });
}

function para(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 120 },
    children: [new TextRun({ text, size: 20, font: "Arial", ...opts })],
  });
}

function boldPara(label, value) {
  return new Paragraph({
    spacing: { after: 80 },
    children: [
      new TextRun({ text: label, bold: true, size: 20, font: "Arial" }),
      new TextRun({ text: value, size: 20, font: "Arial" }),
    ],
  });
}

function bulletItem(text, numbering) {
  return new Paragraph({
    numbering: { reference: numbering, level: 0 },
    spacing: { after: 60 },
    children: [new TextRun({ text, size: 20, font: "Arial" })],
  });
}

function emptyLine() {
  return new Paragraph({ spacing: { after: 120 }, children: [] });
}

function cell(text, opts = {}) {
  const width = opts.width || Math.floor(PAGE_W / 2);
  return new TableCell({
    borders: BORDERS,
    margins: CELL_MARGINS,
    width: { size: width, type: WidthType.DXA },
    shading: opts.shading ? { fill: opts.shading, type: ShadingType.CLEAR } : undefined,
    children: [
      new Paragraph({
        children: [new TextRun({
          text,
          size: opts.size || 18,
          font: "Arial",
          bold: opts.bold || false,
          color: opts.color || "333333",
        })],
      }),
    ],
  });
}

// ─── Question helper ─────────────────────────────────────

function questionBlock(qNum, question, options) {
  const items = [];
  items.push(new Paragraph({
    spacing: { before: 160, after: 80 },
    children: [
      new TextRun({ text: qNum + " ", bold: true, size: 20, font: "Arial", color: EU_BLUE }),
      new TextRun({ text: question, bold: true, size: 20, font: "Arial" }),
    ],
  }));
  for (const opt of options) {
    items.push(new Paragraph({
      spacing: { after: 40 },
      indent: { left: 360 },
      children: [new TextRun({ text: opt, size: 18, font: "Arial", color: "555555" })],
    }));
  }
  return items;
}

// ─── Score table for vendor reports ──────────────────────

function scoreTable(categories, frameworks) {
  const colW = [3200, 800, 800, 800, 800, 800, 800]; // ~8000 total
  const headerRow = new TableRow({
    children: [
      cell("Category", { width: colW[0], shading: EU_BLUE, color: WHITE, bold: true }),
      cell("Score", { width: colW[1], shading: EU_BLUE, color: WHITE, bold: true }),
      cell("AI Act", { width: colW[2], shading: EU_BLUE, color: WHITE, bold: true }),
      cell("GDPR", { width: colW[3], shading: EU_BLUE, color: WHITE, bold: true }),
      cell("DORA", { width: colW[4], shading: EU_BLUE, color: WHITE, bold: true }),
      cell("Sector", { width: colW[5], shading: EU_BLUE, color: WHITE, bold: true }),
      cell("Overall", { width: colW[6], shading: EU_BLUE, color: WHITE, bold: true }),
    ],
  });

  const rows = [headerRow];
  for (let i = 0; i < categories.length; i++) {
    const bg = i % 2 === 0 ? LIGHT_GRAY : WHITE;
    rows.push(new TableRow({
      children: [
        cell(categories[i].name, { width: colW[0], shading: bg }),
        cell(categories[i].score, { width: colW[1], shading: bg, bold: true }),
        cell("", { width: colW[2], shading: bg }),
        cell("", { width: colW[3], shading: bg }),
        cell("", { width: colW[4], shading: bg }),
        cell("", { width: colW[5], shading: bg }),
        cell("", { width: colW[6], shading: bg }),
      ],
    }));
  }

  // Framework totals row
  rows.push(new TableRow({
    children: [
      cell("FRAMEWORK SCORES", { width: colW[0], shading: LIGHT_BLUE, bold: true }),
      cell("", { width: colW[1], shading: LIGHT_BLUE }),
      cell(frameworks.aiAct, { width: colW[2], shading: LIGHT_BLUE, bold: true }),
      cell(frameworks.gdpr, { width: colW[3], shading: LIGHT_BLUE, bold: true }),
      cell(frameworks.dora, { width: colW[4], shading: LIGHT_BLUE, bold: true }),
      cell(frameworks.sector, { width: colW[5], shading: LIGHT_BLUE, bold: true }),
      cell(frameworks.overall, { width: colW[6], shading: LIGHT_BLUE, bold: true, color: EU_BLUE }),
    ],
  }));

  return new Table({
    width: { size: 8000, type: WidthType.DXA },
    columnWidths: colW,
    rows,
  });
}

// ─── Vendor Data ─────────────────────────────────────────

const vendors = [
  {
    num: 1, name: "Microsoft Azure OpenAI Service / Copilot",
    vendor: "Microsoft", hq: "Redmond, USA", euPresence: "Yes — subsidiaries across EU, data centers in Amsterdam, Dublin, Frankfurt",
    category: "Foundation Model Platform + Productivity AI",
    risk: "High (when used for HR, credit scoring, recruitment)",
    whatItDoes: "Enterprise-grade access to OpenAI models (GPT-4o, DALL-E, Whisper) through Azure cloud with enterprise security, compliance controls, and content filtering. Microsoft 365 Copilot embeds AI across Word, Excel, PowerPoint, Teams, and Outlook for productivity automation.",
    useCases: ["Document drafting and summarization (Copilot for M365)", "Customer service automation (Azure OpenAI + Bot Framework)", "Code generation and review (GitHub Copilot integration)", "Data analysis and reporting (Copilot in Excel/Power BI)", "Internal knowledge search and Q&A", "Process automation via Copilot Studio agents"],
    dataStorage: "EU regions available: Netherlands (Amsterdam), Ireland (Dublin), Germany (Frankfurt), France (Paris), Sweden",
    dataProcessing: "Inference in customer-selected EU region. Abuse monitoring may occur outside EU (can be disabled for approved customers)",
    trainingData: "Customer data NOT used for training — contractually guaranteed in Azure OpenAI terms. Prompts and completions not stored beyond 30 days for abuse monitoring",
    subprocessors: "Microsoft subsidiaries globally; published subprocessor list with change notifications",
    dpa: "GDPR-compliant DPA included in Microsoft Product Terms. Covers Art. 28 requirements. EU SCCs included",
    sla: "99.9% uptime SLA for Azure OpenAI. Financial credits for breaches",
    portability: "Data export via Azure APIs and portal. Standard formats available",
    exit: "30-day post-termination data retrieval period. Data deletion after",
    certs: "ISO 27001, ISO 27018, SOC 2 Type II, SOC 3, C5 (Germany), ENS (Spain), CSA STAR",
    encryption: "AES-256 at rest (customer-managed keys available via Azure Key Vault). TLS 1.2+ in transit",
    access: "SSO/SAML, Azure AD, RBAC, MFA, conditional access policies, comprehensive audit logs",
    modelDocs: "Model cards published for GPT-4, GPT-4o, DALL-E. Transparency notes available. System card for GPT-4o published",
    explainability: "Content filtering explanations. Azure AI Content Safety provides reason codes. No per-decision feature attribution for LLM outputs",
    biasTesting: "Responsible AI dashboard. Fairness assessments via Azure ML. Red teaming program. Annual Responsible AI Transparency Report",
    aiActClass: "Microsoft has published EU AI Act guidance. Self-classification available for specific use cases. Proactive compliance program",
    gdprCompliance: "DPA, DPO appointed, DPIA template available. EU representative designated. Binding Corporate Rules approved",
    euResidency: "Yes — full EU data residency available. EU Data Boundary program rolling out",
    scores: [
      { name: "1. Vendor Profile & EU Presence", score: "8/10" },
      { name: "2. Data Residency & Sovereignty", score: "8/10" },
      { name: "3. Security & Robustness", score: "9/10" },
      { name: "4. AI Transparency & Explainability", score: "7/10" },
      { name: "5. Bias, Fairness & Ethics", score: "7/10" },
      { name: "6. Contractual & Legal", score: "8/10" },
      { name: "7. Regulatory Compliance Posture", score: "8/10" },
      { name: "8. Operational & Multilingual", score: "7/10" },
    ],
    frameworks: { aiAct: "B+", gdpr: "A-", dora: "B+", sector: "B+", overall: "B+" },
  },
  {
    num: 2, name: "Google Gemini / Vertex AI",
    vendor: "Google Cloud", hq: "Mountain View, USA", euPresence: "Yes — EU subsidiary, data centers in Belgium, Netherlands, Germany, Finland",
    category: "Foundation Model Platform + Cloud AI",
    risk: "High (depending on use case)",
    whatItDoes: "Google's Gemini models provide multimodal AI capabilities (text, image, video, code) available via Google Cloud's Vertex AI platform for custom enterprise deployments, and embedded across Google Workspace as Gemini for Workspace.",
    useCases: ["Enterprise search and knowledge management", "Document analysis and generation", "Code assistance (Gemini Code Assist)", "Customer support chatbots", "Data analytics and visualization", "Multimodal content processing"],
    dataStorage: "EU regions: Belgium (europe-west1), Netherlands (europe-west4), Germany (europe-west3), Finland (europe-north1)",
    dataProcessing: "Vertex AI processes in customer-selected region. Workspace AI may process outside EU for some features",
    trainingData: "Vertex AI: customer data not used for training by default. Google Workspace: data not used for Gemini training (enterprise terms)",
    subprocessors: "Google subsidiaries; published subprocessor list",
    dpa: "GDPR-compliant Cloud DPA. EU SCCs included. Comprehensive Art. 28 coverage",
    sla: "99.9% for Vertex AI. 99.9% for Workspace. Financial SLA credits",
    portability: "BigQuery export, API-based data retrieval, standard formats",
    exit: "60-day data retrieval post-termination",
    certs: "ISO 27001, ISO 27017, ISO 27018, SOC 2 Type II, SOC 3, C5, BSI",
    encryption: "AES-256 at rest (customer-managed keys via Cloud KMS). TLS 1.3 in transit",
    access: "SSO/SAML, Google Cloud IAM, RBAC, MFA, VPC Service Controls, audit logs",
    modelDocs: "Gemini model cards published. Technical reports available. AI Principles documentation",
    explainability: "Vertex AI Explanations (feature attribution). Grounding with Google Search for factual responses",
    biasTesting: "Responsible AI practices documented. Model evaluation tools in Vertex AI. Annual AI Principles progress report",
    aiActClass: "Google has published EU AI Act compliance guidance. Active engagement with EU regulators",
    gdprCompliance: "DPA available, DPO appointed, EU representative designated. DPIA support documentation",
    euResidency: "Yes — Sovereign Controls and Assured Workloads for EU",
    scores: [
      { name: "1. Vendor Profile & EU Presence", score: "8/10" },
      { name: "2. Data Residency & Sovereignty", score: "7/10" },
      { name: "3. Security & Robustness", score: "9/10" },
      { name: "4. AI Transparency & Explainability", score: "7/10" },
      { name: "5. Bias, Fairness & Ethics", score: "7/10" },
      { name: "6. Contractual & Legal", score: "7/10" },
      { name: "7. Regulatory Compliance Posture", score: "7/10" },
      { name: "8. Operational & Multilingual", score: "8/10" },
    ],
    frameworks: { aiAct: "B+", gdpr: "B+", dora: "B", sector: "B+", overall: "B+" },
  },
  {
    num: 3, name: "Anthropic Claude Enterprise",
    vendor: "Anthropic", hq: "San Francisco, USA", euPresence: "No EU legal entity — available via AWS/GCP EU regions",
    category: "Foundation Model Platform",
    risk: "High (depending on use case)",
    whatItDoes: "Claude is a family of large language models built with a safety-first approach (Constitutional AI). Claude Enterprise offers SSO/SCIM, admin controls, expanded context windows (200K+), and API access for custom enterprise applications.",
    useCases: ["Document analysis and summarization", "Code generation and review", "Research and data extraction", "Customer support automation", "Content creation and editing", "Complex reasoning and analysis tasks"],
    dataStorage: "Via AWS (Frankfurt, Ireland, Paris, Stockholm) or GCP (Belgium, Netherlands, Germany) EU regions",
    dataProcessing: "Inference in customer-selected cloud region. No data sent to Anthropic servers for enterprise API",
    trainingData: "Customer data NOT used for training — contractually guaranteed. No data retention for API usage",
    subprocessors: "AWS and GCP as infrastructure providers. Anthropic's subprocessor list available",
    dpa: "DPA available for enterprise customers. EU SCCs included",
    sla: "99.5% API uptime target. Enterprise SLAs negotiable",
    portability: "API-based access — no proprietary data lock-in. Conversation export available",
    exit: "Data deleted upon termination. No long-term retention",
    certs: "SOC 2 Type II. ISO 27001 in progress",
    encryption: "AES-256 at rest. TLS 1.2+ in transit",
    access: "SSO/SCIM, RBAC, MFA for Enterprise tier. API key management. Audit logs",
    modelDocs: "Model cards published for Claude 3 family. Constitutional AI methodology documented. Usage policy published",
    explainability: "Chain-of-thought reasoning visible in responses. No formal feature attribution tool. Strong instruction following for explanation requests",
    biasTesting: "Red teaming program. Responsible Scaling Policy published. External safety evaluations. AIS safety levels framework",
    aiActClass: "No formal EU AI Act self-classification published. Awareness demonstrated through safety research",
    gdprCompliance: "DPA available. No EU DPO publicly identified. DPIA support not formally documented",
    euResidency: "Via cloud partners (AWS/GCP EU regions) — not directly from Anthropic",
    scores: [
      { name: "1. Vendor Profile & EU Presence", score: "4/10" },
      { name: "2. Data Residency & Sovereignty", score: "6/10" },
      { name: "3. Security & Robustness", score: "7/10" },
      { name: "4. AI Transparency & Explainability", score: "8/10" },
      { name: "5. Bias, Fairness & Ethics", score: "8/10" },
      { name: "6. Contractual & Legal", score: "6/10" },
      { name: "7. Regulatory Compliance Posture", score: "5/10" },
      { name: "8. Operational & Multilingual", score: "6/10" },
    ],
    frameworks: { aiAct: "B-", gdpr: "B-", dora: "C+", sector: "B-", overall: "B-" },
  },
  {
    num: 4, name: "Mistral AI (Le Chat / Mistral Platform)",
    vendor: "Mistral AI", hq: "Paris, France", euPresence: "Yes — EU-native company, headquartered in France",
    category: "Foundation Model Platform (EU-Sovereign)",
    risk: "High (depending on use case)",
    whatItDoes: "European-origin foundation model company offering Mistral Large, Mistral Medium, and specialized models. Le Chat is the consumer product. Mistral Platform provides API access. Mistral Forge enables on-premises deployment for full sovereignty.",
    useCases: ["Sovereign AI deployments for government", "Multilingual document processing (strong EU language support)", "Enterprise chatbots and assistants", "On-premises AI for regulated industries", "Code generation (Codestral)", "Custom model fine-tuning"],
    dataStorage: "EU data centers (France). On-premises deployment available via Mistral Forge",
    dataProcessing: "All processing in EU. On-prem option for complete data control",
    trainingData: "Customer data not used for training on API/Platform. On-prem: customer has full control",
    subprocessors: "Primarily EU-based infrastructure. Scaleway, OVHcloud as cloud partners",
    dpa: "GDPR-compliant DPA. EU-native terms. French law governs",
    sla: "Platform SLA available. On-prem: customer-managed",
    portability: "Open-weight models downloadable. API-based access. Full data portability",
    exit: "Open models — no vendor lock-in. Data deleted on termination for platform",
    certs: "SOC 2 in progress. ANSSI qualification in progress. ISO 27001 planned",
    encryption: "AES-256 at rest. TLS 1.3 in transit",
    access: "API key management. SSO available for enterprise. Audit logs",
    modelDocs: "Model cards published. Open-weight models allow inspection. Research papers published",
    explainability: "Open-weight models allow customer-side analysis. No built-in explanation tools yet",
    biasTesting: "Safety evaluations published. Multilingual evaluation benchmarks. Red teaming conducted",
    aiActClass: "Active participant in EU AI Act discussions. Compliance program in development. French government AI partner",
    gdprCompliance: "EU-native. GDPR-compliant by design. French DPA (CNIL) engagement",
    euResidency: "Yes — native EU. Strongest data sovereignty story of any foundation model provider",
    scores: [
      { name: "1. Vendor Profile & EU Presence", score: "10/10" },
      { name: "2. Data Residency & Sovereignty", score: "10/10" },
      { name: "3. Security & Robustness", score: "6/10" },
      { name: "4. AI Transparency & Explainability", score: "8/10" },
      { name: "5. Bias, Fairness & Ethics", score: "7/10" },
      { name: "6. Contractual & Legal", score: "7/10" },
      { name: "7. Regulatory Compliance Posture", score: "7/10" },
      { name: "8. Operational & Multilingual", score: "8/10" },
    ],
    frameworks: { aiAct: "B+", gdpr: "A", dora: "B", sector: "B+", overall: "B+" },
  },
  {
    num: 5, name: "Amazon Bedrock (AWS)",
    vendor: "Amazon Web Services", hq: "Seattle, USA", euPresence: "Yes — EU subsidiary, data centers in Ireland, Frankfurt, Paris, Stockholm, Milan, Zurich, Spain",
    category: "Multi-Model AI Platform",
    risk: "High (depending on use case and model selected)",
    whatItDoes: "Managed service providing access to multiple foundation models (Anthropic Claude, Meta Llama, Mistral, Cohere, Amazon Titan) through a unified API. Includes guardrails, fine-tuning, RAG, and agent capabilities.",
    useCases: ["Multi-model AI strategy (choose best model per task)", "Document processing and extraction", "Conversational AI with guardrails", "Code generation", "Knowledge base creation (RAG)", "Custom model fine-tuning"],
    dataStorage: "EU regions: Ireland, Frankfurt, Paris, Stockholm, Milan, Spain. Customer selects region",
    dataProcessing: "All inference in customer-selected region. Data does not leave the region",
    trainingData: "Customer data NOT used for training ANY model on Bedrock. Isolated per customer account",
    subprocessors: "AWS infrastructure. Published subprocessor list with notification process",
    dpa: "GDPR-compliant DPA (AWS GDPR DPA). EU SCCs. Comprehensive",
    sla: "99.9% uptime. Financial credits for breaches",
    portability: "API-based. S3 export. Standard formats. Multi-model = less lock-in",
    exit: "Data deleted after account closure. 90-day retrieval window",
    certs: "ISO 27001, SOC 2 Type II, C5, ENS, IRAP, FedRAMP High. 140+ compliance certifications",
    encryption: "AES-256 at rest (AWS KMS, customer-managed keys). TLS 1.2+ in transit. VPC endpoints",
    access: "AWS IAM, SSO/SAML, MFA, RBAC, CloudTrail audit logs, VPC isolation",
    modelDocs: "Individual model provider cards (Claude, Llama, etc.). AWS Bedrock documentation comprehensive",
    explainability: "Guardrails provide content filtering explanations. Model-specific explainability varies",
    biasTesting: "AWS Responsible AI guidance. Model-specific bias testing by providers. SageMaker Clarify for custom models",
    aiActClass: "AWS compliance program for EU AI Act. Shared responsibility model documented",
    gdprCompliance: "Comprehensive GDPR compliance. DPO appointed. EU representative. DPIA resources",
    euResidency: "Yes — full EU data residency. AWS European Sovereign Cloud launching",
    scores: [
      { name: "1. Vendor Profile & EU Presence", score: "8/10" },
      { name: "2. Data Residency & Sovereignty", score: "9/10" },
      { name: "3. Security & Robustness", score: "9/10" },
      { name: "4. AI Transparency & Explainability", score: "6/10" },
      { name: "5. Bias, Fairness & Ethics", score: "6/10" },
      { name: "6. Contractual & Legal", score: "8/10" },
      { name: "7. Regulatory Compliance Posture", score: "8/10" },
      { name: "8. Operational & Multilingual", score: "6/10" },
    ],
    frameworks: { aiAct: "B+", gdpr: "A-", dora: "A-", sector: "B", overall: "B+" },
  },
];

// Abbreviated vendors 6-20 (same structure, key data)
const vendorsShort = [
  { num: 6, name: "Salesforce Agentforce / Einstein AI", vendor: "Salesforce", hq: "San Francisco, USA", euPresence: "Yes — EU subsidiary, Hyperforce in Frankfurt/Paris", category: "CRM AI / Agentic AI", risk: "Limited to High", scores: [{ name: "1. Vendor Profile", score: "7/10" }, { name: "2. Data Residency", score: "7/10" }, { name: "3. Security", score: "8/10" }, { name: "4. Transparency", score: "6/10" }, { name: "5. Bias & Fairness", score: "6/10" }, { name: "6. Contractual", score: "7/10" }, { name: "7. Compliance", score: "7/10" }, { name: "8. Operational", score: "6/10" }], frameworks: { aiAct: "B", gdpr: "B+", dora: "B-", sector: "B", overall: "B" } },
  { num: 7, name: "SAP Joule / SAP Business AI", vendor: "SAP", hq: "Walldorf, Germany", euPresence: "Yes — EU-native, HQ in Germany", category: "ERP AI / Business Process AI", risk: "Limited to High", scores: [{ name: "1. Vendor Profile", score: "10/10" }, { name: "2. Data Residency", score: "9/10" }, { name: "3. Security", score: "8/10" }, { name: "4. Transparency", score: "6/10" }, { name: "5. Bias & Fairness", score: "6/10" }, { name: "6. Contractual", score: "8/10" }, { name: "7. Compliance", score: "8/10" }, { name: "8. Operational", score: "7/10" }], frameworks: { aiAct: "B+", gdpr: "A-", dora: "B+", sector: "B+", overall: "B+" } },
  { num: 8, name: "ServiceNow AI Agents / Now Assist", vendor: "ServiceNow", hq: "Santa Clara, USA", euPresence: "Yes — EU subsidiary, EU data centers", category: "ITSM AI / Workflow AI", risk: "Limited", scores: [{ name: "1. Vendor Profile", score: "7/10" }, { name: "2. Data Residency", score: "7/10" }, { name: "3. Security", score: "8/10" }, { name: "4. Transparency", score: "6/10" }, { name: "5. Bias & Fairness", score: "5/10" }, { name: "6. Contractual", score: "7/10" }, { name: "7. Compliance", score: "6/10" }, { name: "8. Operational", score: "6/10" }], frameworks: { aiAct: "B", gdpr: "B+", dora: "B", sector: "B", overall: "B" } },
  { num: 9, name: "Workday Illuminate AI", vendor: "Workday", hq: "Pleasanton, USA", euPresence: "Yes — EU subsidiary (Dublin), EU data centers", category: "HR AI / Finance AI", risk: "High (HR decision-making)", scores: [{ name: "1. Vendor Profile", score: "7/10" }, { name: "2. Data Residency", score: "7/10" }, { name: "3. Security", score: "8/10" }, { name: "4. Transparency", score: "6/10" }, { name: "5. Bias & Fairness", score: "7/10" }, { name: "6. Contractual", score: "7/10" }, { name: "7. Compliance", score: "7/10" }, { name: "8. Operational", score: "6/10" }], frameworks: { aiAct: "B", gdpr: "B+", dora: "B-", sector: "B", overall: "B" } },
  { num: 10, name: "Databricks (Mosaic AI)", vendor: "Databricks", hq: "San Francisco, USA", euPresence: "Yes — EU subsidiary, EU-hosted workspaces", category: "Data + AI Platform", risk: "Varies by use case", scores: [{ name: "1. Vendor Profile", score: "7/10" }, { name: "2. Data Residency", score: "8/10" }, { name: "3. Security", score: "8/10" }, { name: "4. Transparency", score: "7/10" }, { name: "5. Bias & Fairness", score: "6/10" }, { name: "6. Contractual", score: "7/10" }, { name: "7. Compliance", score: "6/10" }, { name: "8. Operational", score: "6/10" }], frameworks: { aiAct: "B", gdpr: "B+", dora: "B", sector: "B", overall: "B" } },
  { num: 11, name: "Palantir AIP", vendor: "Palantir Technologies", hq: "Denver, USA", euPresence: "Yes — EU/London subsidiary", category: "Decision Intelligence", risk: "High (government/defense)", scores: [{ name: "1. Vendor Profile", score: "6/10" }, { name: "2. Data Residency", score: "6/10" }, { name: "3. Security", score: "8/10" }, { name: "4. Transparency", score: "5/10" }, { name: "5. Bias & Fairness", score: "4/10" }, { name: "6. Contractual", score: "6/10" }, { name: "7. Compliance", score: "5/10" }, { name: "8. Operational", score: "5/10" }], frameworks: { aiAct: "C+", gdpr: "B-", dora: "C+", sector: "C+", overall: "C+" } },
  { num: 12, name: "Snowflake Cortex AI", vendor: "Snowflake", hq: "Bozeman, USA", euPresence: "Yes — EU subsidiary, EU regions", category: "Data Cloud AI", risk: "Limited", scores: [{ name: "1. Vendor Profile", score: "7/10" }, { name: "2. Data Residency", score: "9/10" }, { name: "3. Security", score: "8/10" }, { name: "4. Transparency", score: "5/10" }, { name: "5. Bias & Fairness", score: "5/10" }, { name: "6. Contractual", score: "7/10" }, { name: "7. Compliance", score: "6/10" }, { name: "8. Operational", score: "5/10" }], frameworks: { aiAct: "B-", gdpr: "B+", dora: "B", sector: "B-", overall: "B" } },
  { num: 13, name: "UiPath (Maestro + AgentBuilder)", vendor: "UiPath", hq: "New York, USA (founded Romania)", euPresence: "Yes — EU presence, Romanian heritage", category: "RPA / Agentic Automation", risk: "Limited", scores: [{ name: "1. Vendor Profile", score: "7/10" }, { name: "2. Data Residency", score: "7/10" }, { name: "3. Security", score: "7/10" }, { name: "4. Transparency", score: "7/10" }, { name: "5. Bias & Fairness", score: "5/10" }, { name: "6. Contractual", score: "7/10" }, { name: "7. Compliance", score: "6/10" }, { name: "8. Operational", score: "6/10" }], frameworks: { aiAct: "B", gdpr: "B", dora: "B-", sector: "B-", overall: "B" } },
  { num: 14, name: "GitHub Copilot Enterprise", vendor: "GitHub (Microsoft)", hq: "San Francisco, USA", euPresence: "Via Microsoft EU infrastructure", category: "AI Code Assistant", risk: "High (if used for security-critical code)", scores: [{ name: "1. Vendor Profile", score: "7/10" }, { name: "2. Data Residency", score: "6/10" }, { name: "3. Security", score: "7/10" }, { name: "4. Transparency", score: "6/10" }, { name: "5. Bias & Fairness", score: "5/10" }, { name: "6. Contractual", score: "7/10" }, { name: "7. Compliance", score: "5/10" }, { name: "8. Operational", score: "5/10" }], frameworks: { aiAct: "B-", gdpr: "B", dora: "C+", sector: "B-", overall: "B-" } },
  { num: 15, name: "CrowdStrike Falcon AI", vendor: "CrowdStrike", hq: "Austin, USA", euPresence: "Yes — EU subsidiary, Frankfurt data center", category: "Endpoint Security / AI Security", risk: "Limited (security tooling)", scores: [{ name: "1. Vendor Profile", score: "7/10" }, { name: "2. Data Residency", score: "7/10" }, { name: "3. Security", score: "9/10" }, { name: "4. Transparency", score: "5/10" }, { name: "5. Bias & Fairness", score: "4/10" }, { name: "6. Contractual", score: "7/10" }, { name: "7. Compliance", score: "6/10" }, { name: "8. Operational", score: "6/10" }], frameworks: { aiAct: "B-", gdpr: "B", dora: "B+", sector: "B-", overall: "B" } },
  { num: 16, name: "Darktrace", vendor: "Darktrace", hq: "Cambridge, UK", euPresence: "Yes — UK-based, European origin, on-prem deployment", category: "AI-Native Cybersecurity", risk: "Limited", scores: [{ name: "1. Vendor Profile", score: "8/10" }, { name: "2. Data Residency", score: "9/10" }, { name: "3. Security", score: "8/10" }, { name: "4. Transparency", score: "6/10" }, { name: "5. Bias & Fairness", score: "5/10" }, { name: "6. Contractual", score: "7/10" }, { name: "7. Compliance", score: "6/10" }, { name: "8. Operational", score: "5/10" }], frameworks: { aiAct: "B", gdpr: "B+", dora: "B+", sector: "B", overall: "B" } },
  { num: 17, name: "Glean", vendor: "Glean", hq: "Palo Alto, USA", euPresence: "Limited — EU hosting available, no EU legal entity confirmed", category: "Enterprise Knowledge Discovery / AI Search", risk: "Limited to High (processes internal data)", scores: [{ name: "1. Vendor Profile", score: "4/10" }, { name: "2. Data Residency", score: "5/10" }, { name: "3. Security", score: "7/10" }, { name: "4. Transparency", score: "5/10" }, { name: "5. Bias & Fairness", score: "4/10" }, { name: "6. Contractual", score: "6/10" }, { name: "7. Compliance", score: "4/10" }, { name: "8. Operational", score: "4/10" }], frameworks: { aiAct: "C+", gdpr: "B-", dora: "C", sector: "C+", overall: "C+" } },
  { num: 18, name: "FICO Platform", vendor: "FICO", hq: "Bozeman, USA", euPresence: "Yes — EU subsidiary, long EU banking history", category: "Financial Services AI / Credit Risk", risk: "High (credit scoring — explicitly in AI Act Annex III)", scores: [{ name: "1. Vendor Profile", score: "7/10" }, { name: "2. Data Residency", score: "7/10" }, { name: "3. Security", score: "8/10" }, { name: "4. Transparency", score: "8/10" }, { name: "5. Bias & Fairness", score: "7/10" }, { name: "6. Contractual", score: "8/10" }, { name: "7. Compliance", score: "8/10" }, { name: "8. Operational", score: "6/10" }], frameworks: { aiAct: "B+", gdpr: "A-", dora: "A-", sector: "A-", overall: "A-" } },
  { num: 19, name: "IBM watsonx", vendor: "IBM", hq: "Armonk, USA", euPresence: "Yes — EU subsidiary, Frankfurt data center, long EU enterprise history", category: "Enterprise AI Platform + AI Governance", risk: "Varies by deployment", scores: [{ name: "1. Vendor Profile", score: "8/10" }, { name: "2. Data Residency", score: "8/10" }, { name: "3. Security", score: "8/10" }, { name: "4. Transparency", score: "8/10" }, { name: "5. Bias & Fairness", score: "8/10" }, { name: "6. Contractual", score: "8/10" }, { name: "7. Compliance", score: "8/10" }, { name: "8. Operational", score: "6/10" }], frameworks: { aiAct: "A-", gdpr: "A-", dora: "B+", sector: "B+", overall: "B+" } },
  { num: 20, name: "Palo Alto Networks Cortex XSIAM", vendor: "Palo Alto Networks", hq: "Santa Clara, USA", euPresence: "Yes — EU subsidiary, EU cloud regions", category: "Network Security AI / SOC Automation", risk: "Limited", scores: [{ name: "1. Vendor Profile", score: "7/10" }, { name: "2. Data Residency", score: "7/10" }, { name: "3. Security", score: "9/10" }, { name: "4. Transparency", score: "5/10" }, { name: "5. Bias & Fairness", score: "4/10" }, { name: "6. Contractual", score: "7/10" }, { name: "7. Compliance", score: "6/10" }, { name: "8. Operational", score: "5/10" }], frameworks: { aiAct: "B-", gdpr: "B", dora: "B+", sector: "B-", overall: "B" } },
];

// ─── Build the document ──────────────────────────────────

function buildVendorSection(v, numbering) {
  const items = [];
  items.push(new Paragraph({ children: [new PageBreak()] }));
  items.push(heading2(`${v.num}. ${v.name}`));

  // Summary line
  items.push(boldPara("Vendor: ", `${v.vendor} | HQ: ${v.hq}`));
  items.push(boldPara("EU Presence: ", v.euPresence));
  items.push(boldPara("Category: ", v.category));
  items.push(boldPara("Risk Classification: ", v.risk));

  if (v.whatItDoes) {
    items.push(emptyLine());
    items.push(heading3("What It Does"));
    items.push(para(v.whatItDoes));

    items.push(heading3("Key Use Cases"));
    for (const uc of v.useCases) items.push(bulletItem(uc, numbering));

    items.push(heading3("Data Handling"));
    items.push(boldPara("Storage: ", v.dataStorage));
    items.push(boldPara("Processing: ", v.dataProcessing));
    items.push(boldPara("Training data: ", v.trainingData));
    items.push(boldPara("Subprocessors: ", v.subprocessors));

    items.push(heading3("Contractual Commitments"));
    items.push(boldPara("DPA: ", v.dpa));
    items.push(boldPara("SLAs: ", v.sla));
    items.push(boldPara("Data portability: ", v.portability));
    items.push(boldPara("Exit terms: ", v.exit));

    items.push(heading3("Security Posture"));
    items.push(boldPara("Certifications: ", v.certs));
    items.push(boldPara("Encryption: ", v.encryption));
    items.push(boldPara("Access controls: ", v.access));

    items.push(heading3("AI Transparency"));
    items.push(boldPara("Model docs: ", v.modelDocs));
    items.push(boldPara("Explainability: ", v.explainability));
    items.push(boldPara("Bias testing: ", v.biasTesting));

    items.push(heading3("EU Compliance Status"));
    items.push(boldPara("AI Act: ", v.aiActClass));
    items.push(boldPara("GDPR: ", v.gdprCompliance));
    items.push(boldPara("EU residency: ", v.euResidency));
  }

  items.push(emptyLine());
  items.push(heading3("Preliminary Assessment"));
  items.push(para("Based on publicly available information only. Conservative scoring where data is limited.", { italics: true, color: "888888" }));
  items.push(emptyLine());
  items.push(scoreTable(v.scores, v.frameworks));

  return items;
}

async function main() {
  console.log("Generating AI Compass EU Assessment Model document...");

  const allContent = [];

  // ─── Title Page ──────────────────────────────────────
  allContent.push(emptyLine());
  allContent.push(emptyLine());
  allContent.push(emptyLine());
  allContent.push(emptyLine());
  allContent.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    children: [new TextRun({ text: "AI COMPASS EU", size: 56, bold: true, font: "Arial", color: EU_BLUE })],
  }));
  allContent.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 400 },
    children: [new TextRun({ text: "Assessment Model v1.0", size: 36, font: "Arial", color: "555555" })],
  }));
  allContent.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    children: [new TextRun({ text: "Structured Questionnaire for EU AI Compliance Assessment", size: 24, font: "Arial", color: "777777" })],
  }));
  allContent.push(emptyLine());
  allContent.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "April 2026", size: 22, font: "Arial", color: "999999" })],
  }));
  allContent.push(emptyLine());
  allContent.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "CONFIDENTIAL DRAFT", size: 20, bold: true, font: "Arial", color: "CC0000" })],
  }));

  // Page break + TOC
  allContent.push(new Paragraph({ children: [new PageBreak()] }));
  allContent.push(heading1("Table of Contents"));
  allContent.push(new TableOfContents("Table of Contents", { hyperlink: true, headingStyleRange: "1-2" }));

  // ─── PART 1: Assessment Model ────────────────────────
  allContent.push(new Paragraph({ children: [new PageBreak()] }));
  allContent.push(heading1("PART 1: Assessment Framework"));

  allContent.push(heading2("1. Overview"));
  allContent.push(para("This model provides a standardized, weighted questionnaire used to evaluate AI systems against EU regulatory requirements. Each question has selectable answer options with point values (0-10). Scores are aggregated per regulatory framework and overall to produce letter grades from A+ (excellent) to D (poor)."));
  allContent.push(para("The assessment covers 8 categories with approximately 60 questions, mapping to 4 regulatory frameworks: EU AI Act, GDPR, DORA, and Sector-specific regulations."));

  allContent.push(heading2("2. Scoring Methodology"));
  allContent.push(para("Each question has 3-5 answer options worth 0 to 10 points. Questions are grouped into 8 weighted categories. Category scores are computed as the average of question scores within that category. Framework scores are computed as a weighted average of relevant category scores. The overall score is the average across all framework scores."));
  allContent.push(emptyLine());
  allContent.push(heading3("Grade Conversion Scale"));

  // Grade table
  const gradeData = [
    ["A+", "9.5 - 10.0", "Excellent"], ["A", "8.5 - 9.4", "Very Good"], ["A-", "7.5 - 8.4", "Good"],
    ["B+", "6.5 - 7.4", "Above Average"], ["B", "5.5 - 6.4", "Average"], ["B-", "4.5 - 5.4", "Below Average"],
    ["C+", "3.5 - 4.4", "Fair"], ["C", "2.5 - 3.4", "Poor"], ["C-", "1.5 - 2.4", "Very Poor"],
    ["D", "0.0 - 1.4", "Inadequate"],
  ];
  const gradeColW = [1500, 3500, 4000];
  const gradeRows = [
    new TableRow({ children: [
      cell("Grade", { width: gradeColW[0], shading: EU_BLUE, color: WHITE, bold: true }),
      cell("Score Range", { width: gradeColW[1], shading: EU_BLUE, color: WHITE, bold: true }),
      cell("Interpretation", { width: gradeColW[2], shading: EU_BLUE, color: WHITE, bold: true }),
    ]}),
    ...gradeData.map((row, i) => new TableRow({ children: [
      cell(row[0], { width: gradeColW[0], shading: i % 2 === 0 ? LIGHT_GRAY : WHITE, bold: true }),
      cell(row[1], { width: gradeColW[1], shading: i % 2 === 0 ? LIGHT_GRAY : WHITE }),
      cell(row[2], { width: gradeColW[2], shading: i % 2 === 0 ? LIGHT_GRAY : WHITE }),
    ]})),
  ];
  allContent.push(new Table({ width: { size: 9000, type: WidthType.DXA }, columnWidths: gradeColW, rows: gradeRows }));

  // ─── Questions ────────────────────────────────────────
  allContent.push(new Paragraph({ children: [new PageBreak()] }));
  allContent.push(heading2("3. Assessment Questionnaire"));

  // Category 1
  allContent.push(heading3("Category 1: Vendor Profile & EU Presence (Weight: 10%)"));
  allContent.push(para("Maps to: All frameworks"));
  allContent.push(...questionBlock("Q1.1", "Where is the vendor headquartered?", ["EU/EEA country (10)", "UK/Switzerland (7)", "US with EU subsidiary (5)", "US only (3)", "Other (1)"]));
  allContent.push(...questionBlock("Q1.2", "Does the vendor have a legal entity in the EU?", ["Yes, registered in EU (10)", "In process of establishing (5)", "No (0)"]));
  allContent.push(...questionBlock("Q1.3", "Does the vendor have a designated EU representative (per AI Act Art. 22)?", ["Yes, appointed (10)", "Planned (5)", "No (0)"]));
  allContent.push(...questionBlock("Q1.4", "What relevant certifications does the vendor hold?", ["ISO 27001 + SOC 2 Type II + ISO 42001 (10)", "ISO 27001 + SOC 2 Type II (8)", "SOC 2 Type II only (5)", "SOC 2 Type I only (3)", "None (0)"]));
  allContent.push(...questionBlock("Q1.5", "How many years has the vendor been operating?", ["10+ years (10)", "5-10 years (7)", "2-5 years (4)", "Under 2 years (2)"]));
  allContent.push(...questionBlock("Q1.6", "Does the vendor have dedicated EU customer support?", ["Yes, EU-based team with EU hours (10)", "Remote support during EU hours (6)", "US hours only (2)", "No dedicated support (0)"]));
  allContent.push(...questionBlock("Q1.7", "Does the vendor publicly disclose its subprocessors?", ["Yes, published list with change notifications (10)", "Available on request (5)", "Not disclosed (0)"]));

  // Category 2
  allContent.push(heading3("Category 2: Data Residency & Sovereignty (Weight: 15%)"));
  allContent.push(para("Maps to: GDPR, AI Act, DORA"));
  allContent.push(...questionBlock("Q2.1", "Where is customer data stored at rest?", ["EU/EEA only, customer-chosen region (10)", "EU/EEA default with option (8)", "EU/EEA available but not default (5)", "No EU option (0)"]));
  allContent.push(...questionBlock("Q2.2", "Where is customer data processed?", ["EU/EEA only (10)", "EU/EEA with fallback to non-EU (5)", "Processing may occur outside EU (2)", "Unknown (0)"]));
  allContent.push(...questionBlock("Q2.3", "Is customer data used for model training?", ["Never, contractually guaranteed (10)", "Opt-out available and clear (7)", "Opt-out unclear (4)", "Yes by default (0)"]));
  allContent.push(...questionBlock("Q2.4", "Where are subprocessors located?", ["All in EU/EEA (10)", "Majority EU with SCCs (7)", "Mix with safeguards (5)", "Non-adequate countries (2)", "Not disclosed (0)"]));
  allContent.push(...questionBlock("Q2.5", "Can the customer export all data?", ["Yes, full export with API (10)", "Export on request (7)", "Partial only (3)", "No export (0)"]));
  allContent.push(...questionBlock("Q2.6", "Are Standard Contractual Clauses in place?", ["N/A (all EU) (10)", "Yes, current EU SCCs (8)", "Older SCCs (4)", "No SCCs (0)"]));
  allContent.push(...questionBlock("Q2.7", "Data residency guarantees contractual?", ["Yes, in DPA with penalties (10)", "Yes, in DPA (7)", "Verbal only (3)", "No commitment (0)"]));

  // Category 3
  allContent.push(new Paragraph({ children: [new PageBreak()] }));
  allContent.push(heading3("Category 3: Security & Robustness (Weight: 15%)"));
  allContent.push(para("Maps to: AI Act, DORA, GDPR"));
  allContent.push(...questionBlock("Q3.1", "Encryption at rest?", ["AES-256 customer-managed keys (10)", "AES-256 vendor-managed (8)", "AES-128 (5)", "Not disclosed (0)"]));
  allContent.push(...questionBlock("Q3.2", "Encryption in transit?", ["TLS 1.3 (10)", "TLS 1.2 (7)", "Mixed/older (3)", "Not disclosed (0)"]));
  allContent.push(...questionBlock("Q3.3", "Penetration testing frequency?", ["Continuous + annual third-party (10)", "Annual third-party (7)", "Internal only (4)", "Not conducted (0)"]));
  allContent.push(...questionBlock("Q3.4", "Incident response plan?", ["Documented with SLA (10)", "Documented (7)", "Informal (3)", "None (0)"]));
  allContent.push(...questionBlock("Q3.5", "Breach notification timeframe?", ["24 hours (10)", "48 hours (8)", "72 hours / GDPR minimum (6)", "Longer/unspecified (2)"]));
  allContent.push(...questionBlock("Q3.6", "Adversarial/red team testing?", ["Regular internal + external (10)", "Internal only (6)", "Planned (3)", "No (0)"]));
  allContent.push(...questionBlock("Q3.7", "Access controls?", ["SSO/SAML + RBAC + MFA + audit logs (10)", "SSO + RBAC + MFA (8)", "Basic RBAC + MFA (5)", "Username/password (1)"]));
  allContent.push(...questionBlock("Q3.8", "Business continuity?", ["BCP/DR tested, RPO<1h, RTO<4h (10)", "Documented BCP/DR (7)", "Basic backup (3)", "None (0)"]));

  // Category 4
  allContent.push(heading3("Category 4: AI Transparency & Explainability (Weight: 15%)"));
  allContent.push(para("Maps to: AI Act, GDPR"));
  allContent.push(...questionBlock("Q4.1", "Model documentation publicly available?", ["Detailed model cards with training data info (10)", "Partial documentation (6)", "Under NDA only (3)", "None (0)"]));
  allContent.push(...questionBlock("Q4.2", "Can the system explain decisions?", ["Feature attribution + reasoning chain (10)", "Basic explanations (6)", "Output only (2)", "Black box (0)"]));
  allContent.push(...questionBlock("Q4.3", "Intended purpose and limitations disclosed?", ["Comprehensive with limitations (10)", "Basic documentation (6)", "Marketing only (2)", "Not documented (0)"]));
  allContent.push(...questionBlock("Q4.4", "Audit trails for AI decisions?", ["Full trail, immutable logs (10)", "Input/output logging (6)", "Basic logs (3)", "None (0)"]));
  allContent.push(...questionBlock("Q4.5", "Training data information?", ["Detailed documentation (10)", "High-level description (5)", "Not disclosed (0)"]));
  allContent.push(...questionBlock("Q4.6", "Human override supported?", ["Built-in override + escalation (10)", "Manual override possible (6)", "No override (0)"]));
  allContent.push(...questionBlock("Q4.7", "Model updates communicated?", ["Advance notification + changelog + opt-in (10)", "Post-update notification (5)", "No notification (0)"]));

  // Category 5
  allContent.push(new Paragraph({ children: [new PageBreak()] }));
  allContent.push(heading3("Category 5: Bias, Fairness & Ethics (Weight: 10%)"));
  allContent.push(para("Maps to: AI Act, GDPR"));
  allContent.push(...questionBlock("Q5.1", "Bias testing conducted?", ["Regular across protected characteristics, published (10)", "Regular internal (7)", "Ad-hoc (3)", "None (0)"]));
  allContent.push(...questionBlock("Q5.2", "Fairness metrics monitored?", ["Multiple metrics, continuous, with thresholds (10)", "Periodic monitoring (6)", "Basic only (3)", "None (0)"]));
  allContent.push(...questionBlock("Q5.3", "AI ethics policy or board?", ["Published policy + independent board (10)", "Published policy (6)", "Internal guidelines (3)", "None (0)"]));
  allContent.push(...questionBlock("Q5.4", "Training data diversity?", ["Documented across demographics/languages/geo (10)", "Some documentation (5)", "Not documented (0)"]));
  allContent.push(...questionBlock("Q5.5", "Customer-side bias detection tools?", ["Built-in dashboard (10)", "API/tools available (6)", "Guidance docs only (3)", "Nothing (0)"]));
  allContent.push(...questionBlock("Q5.6", "Bias incident reporting process?", ["Public channel + remediation + SLAs (10)", "Internal process (5)", "No formal process (0)"]));

  // Category 6
  allContent.push(heading3("Category 6: Contractual & Legal (Weight: 15%)"));
  allContent.push(para("Maps to: GDPR, DORA"));
  allContent.push(...questionBlock("Q6.1", "GDPR-compliant DPA available?", ["Negotiable, all Art. 28 requirements (10)", "Standard, take-it-or-leave-it (7)", "On request (4)", "No DPA (0)"]));
  allContent.push(...questionBlock("Q6.2", "Liability for AI errors?", ["Uncapped indemnification for breaches (10)", "Capped, reasonable (7)", "Very limited (3)", "None accepted (0)"]));
  allContent.push(...questionBlock("Q6.3", "Exit/termination provisions?", ["30-day notice + export + deletion cert (10)", "Reasonable terms (7)", "Lock-in with penalties (3)", "Restrictive (0)"]));
  allContent.push(...questionBlock("Q6.4", "Cyber insurance?", ["Disclosed, adequate coverage (10)", "Basic coverage (6)", "Not disclosed (2)", "No (0)"]));
  allContent.push(...questionBlock("Q6.5", "Uptime SLAs?", ["99.99% with penalties (10)", "99.9% with penalties (8)", "99.9% no penalties (5)", "No SLA (0)"]));
  allContent.push(...questionBlock("Q6.6", "Right-to-audit clauses?", ["Unrestricted including on-site (10)", "With reasonable notice (8)", "Third-party reports only (5)", "No audit rights (0)"]));
  allContent.push(...questionBlock("Q6.7", "IP rights for inputs/outputs?", ["Customer retains all, clear terms (10)", "Customer retains output IP (7)", "Mixed/unclear (3)", "Vendor claims rights (0)"]));

  // Category 7
  allContent.push(new Paragraph({ children: [new PageBreak()] }));
  allContent.push(heading3("Category 7: Regulatory Compliance Posture (Weight: 15%)"));
  allContent.push(para("Maps to: AI Act, GDPR, DORA"));
  allContent.push(...questionBlock("Q7.1", "AI Act risk classification done?", ["Published self-classification with justification (10)", "Internal available (6)", "Aware but not done (3)", "Not aware (0)"]));
  allContent.push(...questionBlock("Q7.2", "Conformity assessment performed?", ["By notified body (10)", "Self-assessment completed (7)", "In progress (4)", "Not started (0)"]));
  allContent.push(...questionBlock("Q7.3", "DPIA conducted?", ["Comprehensive, available to customers (10)", "Internal DPIA completed (7)", "Partial (3)", "Not conducted (0)"]));
  allContent.push(...questionBlock("Q7.4", "Post-market monitoring (AI Act Art. 72)?", ["Documented with regular reporting (10)", "Basic monitoring (5)", "Planned (2)", "No (0)"]));
  allContent.push(...questionBlock("Q7.5", "Registered in EU AI database?", ["Yes (10)", "In progress (5)", "Not registered (0)"]));
  allContent.push(...questionBlock("Q7.6", "DORA compliance?", ["Full compliance documented (10)", "Partial (6)", "Awareness only (3)", "Not assessed (0)"]));
  allContent.push(...questionBlock("Q7.7", "Compliance reporting for customers?", ["Dashboard + exportable reports (10)", "Basic documentation (6)", "On request (3)", "None (0)"]));
  allContent.push(...questionBlock("Q7.8", "DPO appointed?", ["EU-based DPO with published contact (10)", "DPO appointed (7)", "Privacy team, no DPO (3)", "None (0)"]));

  // Category 8
  allContent.push(heading3("Category 8: Operational Maturity & Multilingual (Weight: 5%)"));
  allContent.push(para("Maps to: General quality assessment"));
  allContent.push(...questionBlock("Q8.1", "EU language support?", ["All 24 EU languages (10)", "10+ languages (7)", "5-9 (4)", "Under 5 (2)", "English only (0)"]));
  allContent.push(...questionBlock("Q8.2", "Performance parity across languages?", ["Documented parity metrics (10)", "Mostly consistent (6)", "Significant variation (3)", "Not measured (0)"]));
  allContent.push(...questionBlock("Q8.3", "Admin interface in EU languages?", ["5+ EU languages (10)", "2-4 (6)", "English only (3)"]));
  allContent.push(...questionBlock("Q8.4", "Localized documentation?", ["Multiple EU languages (10)", "Some translations (5)", "English only (2)"]));
  allContent.push(...questionBlock("Q8.5", "Uptime track record (12 months)?", ["99.99%+ with status page (10)", "99.9-99.99% (7)", "99-99.9% (4)", "Below 99% (1)"]));

  // ─── Framework mapping ────────────────────────────────
  allContent.push(new Paragraph({ children: [new PageBreak()] }));
  allContent.push(heading2("4. Framework Score Mapping"));
  allContent.push(para("Each framework score is computed from a weighted combination of category scores:"));

  const fwColW = [2400, 1200, 1200, 1200, 1200, 1200];
  const fwRows = [
    new TableRow({ children: [
      cell("Category", { width: fwColW[0], shading: EU_BLUE, color: WHITE, bold: true }),
      cell("AI Act", { width: fwColW[1], shading: EU_BLUE, color: WHITE, bold: true }),
      cell("GDPR", { width: fwColW[2], shading: EU_BLUE, color: WHITE, bold: true }),
      cell("DORA", { width: fwColW[3], shading: EU_BLUE, color: WHITE, bold: true }),
      cell("Sector", { width: fwColW[4], shading: EU_BLUE, color: WHITE, bold: true }),
    ]}),
    ...["1. Vendor Profile|10%|5%|5%|10%", "2. Data Residency|15%|25%|15%|—", "3. Security|15%|—|30%|—", "4. Transparency|25%|15%|—|—", "5. Bias & Fairness|15%|10%|—|20%", "6. Contractual|—|25%|20%|—", "7. Compliance|20%|20%|30%|30%", "8. Operational|—|—|—|40%"].map((row, i) => {
      const cols = row.split("|");
      return new TableRow({ children: cols.map((c, j) => cell(c, { width: fwColW[j], shading: i % 2 === 0 ? LIGHT_GRAY : WHITE, bold: j === 0 })) });
    }),
  ];
  allContent.push(new Table({ width: { size: 8400, type: WidthType.DXA }, columnWidths: fwColW, rows: fwRows }));

  // ─── PART 2: Vendor Reports ───────────────────────────
  allContent.push(new Paragraph({ children: [new PageBreak()] }));
  allContent.push(heading1("PART 2: Top 20 Enterprise AI Systems"));
  allContent.push(para("Preliminary assessments based on publicly available information. Scores reflect what can be verified from vendor documentation, trust centers, compliance pages, and public certifications. Where information is not publicly available, scores are conservative."));
  allContent.push(para("These are draft assessments intended for internal use. Full verified assessments require direct vendor engagement.", { italics: true, color: "888888" }));

  // Detailed vendors (1-5)
  for (const v of vendors) {
    allContent.push(...buildVendorSection(v, "bullets"));
  }

  // Abbreviated vendors (6-20)
  for (const v of vendorsShort) {
    allContent.push(...buildVendorSection(v, "bullets"));
  }

  // ─── Create the document ──────────────────────────────
  const doc = new Document({
    styles: {
      default: { document: { run: { font: "Arial", size: 20 } } },
      paragraphStyles: [
        { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 32, bold: true, font: "Arial", color: EU_BLUE },
          paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
        { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 26, bold: true, font: "Arial", color: EU_BLUE },
          paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 1 } },
      ],
    },
    numbering: {
      config: [{
        reference: "bullets",
        levels: [{
          level: 0,
          format: LevelFormat.BULLET,
          text: "\u2022",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      }],
    },
    sections: [{
      properties: {
        page: {
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: "AI Compass EU", size: 16, font: "Arial", color: EU_BLUE, italics: true })],
          })],
        }),
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "AI Compass EU \u2014 Confidential Draft v1.0 \u2014 April 2026  |  Page ", size: 14, font: "Arial", color: "999999" }),
              new TextRun({ children: [PageNumber.CURRENT], size: 14, font: "Arial", color: "999999" }),
            ],
          })],
        }),
      },
      children: allContent,
    }],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync("/Users/ericdevismes/Documents/Claude-Work/PROJECTS/ai-register-eu/AI-Compass-EU-Assessment-Model-v1.docx", buffer);
  console.log("Done! Written to AI-Compass-EU-Assessment-Model-v1.docx");
}

main().catch(console.error);
