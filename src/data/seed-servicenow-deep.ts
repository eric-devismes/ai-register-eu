/**
 * ServiceNow Deep Dive — AI Capabilities, Use Cases & EU Compliance
 * April 2026
 *
 * Approach: map every ServiceNow AI capability to its underlying technology,
 * the real-world use case it serves, EU AI Act risk classification,
 * and what enterprises need to know to deploy it legally in the EU.
 *
 * This updates the existing "Now Assist / AI Agents" system record
 * and adds a dedicated framework section for enterprise platform analysis.
 *
 * Run with: npx tsx src/data/seed-servicenow-deep.ts
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// ─── Full ServiceNow AI Profile Update ───────────────────

const servicenowFullProfile = {
  slug: "servicenow-now-assist",
  vendor: "ServiceNow",
  name: "Now Assist / AI Agents / Predictive Intelligence",
  type: "Enterprise AI Platform (ITSM/HRSD/CSM/SecOps/ITOM)",
  risk: "Limited", // varies by use case — see useCases
  description:
    "ServiceNow's comprehensive enterprise AI platform combining three distinct AI capability layers: (1) Predictive Intelligence — native ML for classification, clustering, and prediction on structured workflow data; (2) Now Assist — generative AI co-pilot features embedded across all ServiceNow modules powered by proprietary Apriel Nemotron 15B and third-party LLM options; (3) AI Agents — autonomous multi-step workflow execution using agentic AI with AI Agent Orchestrator and Fabric for cross-platform coordination. Covers ITSM, HRSD, CSM, SecOps, ITOM, GRC, and Field Service. Data sovereignty addressed through ServiceNow Protected Platform for the EU (SPP EU).",
  category: "Enterprise Platform AI",
  featured: true,
  vendorHq: "Santa Clara, USA",
  euPresence:
    "ServiceNow Netherlands B.V. (Amsterdam) as EU entity. ServiceNow Protected Platform for the EU (SPP EU) provides EU data residency with processing restricted within EU boundaries. EU data centres in Frankfurt, Amsterdam, and London. Significant EU enterprise customer base across public sector, financial services, and manufacturing.",
  useCases:
    "ITSM — Incident Classification & Routing [Predictive Intelligence: ML classification → routes incidents to correct team automatically | EU Risk: Limited | Note: no impact on individual rights, pure operational routing]\n" +
    "ITSM — Incident Summarisation [Now Assist GenAI: LLM-generated summary of incident history for agents | EU Risk: Limited | Note: Article 50 transparency applies if customer-facing]\n" +
    "ITSM — Resolution Notes Generation [Now Assist GenAI: auto-drafts resolution documentation from conversation | EU Risk: Minimal | Note: agent reviews before publishing]\n" +
    "ITSM — Anomaly Detection & Proactive Alerts [Predictive Intelligence: unsupervised ML clustering detects unusual patterns in metrics | EU Risk: Limited | Note: system-level, no individual impact]\n" +
    "ITSM — Change Risk Assessment [Predictive Intelligence: ML scores change risk based on historical failure patterns | EU Risk: Limited | Note: informs human decision, not automated approval]\n" +
    "ITSM — AI Agent for L1 Resolution [AI Agents: autonomous multi-step resolution of common IT issues (password reset, access provisioning) without human | EU Risk: Limited | Note: limited personal impact; user consent via self-service]\n" +
    "CSM — Case Summarisation [Now Assist GenAI: summarises customer case history for agents | EU Risk: Limited | Note: processes customer personal data — DPA and GDPR Article 28 apply]\n" +
    "CSM — AI-Drafted Customer Replies [Now Assist GenAI: context-aware reply drafts for agent approval | EU Risk: Limited | Note: agent reviews before sending; Article 50 if customer is informed they're dealing with AI]\n" +
    "CSM — Virtual Agent Chatbot [Now Assist GenAI + ML: conversational self-service for customer queries | EU Risk: Limited | Note: Article 50(1) AI disclosure required; not high-risk unless making consequential decisions]\n" +
    "CSM — Customer Sentiment Analysis [NLP/ML: analyses customer tone in interactions for escalation triggers | EU Risk: Limited | Note: workplace emotion detection ban applies to EMPLOYEES not customers; customer sentiment analysis is permitted]\n" +
    "HRSD — Case Summarisation [Now Assist GenAI: summarises HR case for HR agents | EU Risk: HIGH — Annex III Category 4 | Note: HR data is sensitive; GDPR special category may apply; human review mandatory]\n" +
    "HRSD — Now Assist for Employee Queries [GenAI: answers employee HR policy questions via conversational AI | EU Risk: Limited | Note: AI disclosure required; consequential decisions (e.g., leave entitlement) must have human override]\n" +
    "HRSD — AI-Assisted Onboarding Workflows [AI Agents: autonomous multi-step onboarding task orchestration | EU Risk: Limited-High depending on scope | Note: becomes high-risk if AI makes access/role assignment decisions affecting employment conditions]\n" +
    "HRSD — Employee Performance Case Routing [Predictive Intelligence: ML routes performance cases to correct HR team | EU Risk: HIGH — Annex III Category 4 | Note: performance management AI; FRIA may be needed for public bodies; works council rights triggered]\n" +
    "SecOps — Threat Intelligence Summarisation [Now Assist GenAI: synthesises threat intel reports for security analysts | EU Risk: Minimal | Note: analyst decision tool, not automated action]\n" +
    "SecOps — Alert Triage & Prioritisation [Predictive Intelligence: ML scores and prioritises security alerts | EU Risk: Limited | Note: system-level risk scoring; human analyst acts on it]\n" +
    "SecOps — AI Agent for Vulnerability Remediation [AI Agents: autonomous identification and assignment of patch tasks | EU Risk: Limited | Note: system-level action; no impact on individual rights]\n" +
    "ITOM — AIOps Event Correlation [Predictive Intelligence: ML correlates infrastructure alerts to identify root cause | EU Risk: Minimal | Note: operational AI, no personal data, no individual impact]\n" +
    "ITOM — Predictive Capacity Planning [ML forecasting: predicts infrastructure resource needs | EU Risk: Minimal | Note: operational forecasting]\n" +
    "GRC — Risk Scoring & Prioritisation [Predictive Intelligence: ML scores compliance and risk items by severity | EU Risk: Limited | Note: informs human risk officer decisions; no automated legal effect]\n" +
    "GRC — AI-Generated Policy Summaries [Now Assist GenAI: summarises regulatory documents and policies | EU Risk: Minimal | Note: document intelligence; human review before any compliance action]\n" +
    "Field Service — Intelligent Scheduling [ML optimisation: assigns work orders to field technicians based on skills, location, availability | EU Risk: HIGH — Annex III Category 4 if affects employment conditions | Note: if scheduling AI affects worker pay, hours, or terms — high-risk; if purely logistics optimisation — limited risk]",
  dataStorage:
    "ServiceNow Protected Platform for EU (SPP EU): all customer data stored and processed within EU boundaries (Frankfurt and Amsterdam data centres). Standard instances: US/EU customer choice. Apriel (Now LLM): model runs within ServiceNow infrastructure; with SPP EU, inference stays within EU.",
  dataProcessing:
    "SPP EU: processing restricted to EU with limited exceptions under customer control. Now Assist with third-party LLMs (GPT-4, Llama via BYO model): customer configures where these calls go — EU residency requires explicit configuration. Predictive Intelligence: runs on ServiceNow platform within customer's instance region.",
  trainingDataUse:
    "Predictive Intelligence models: trained on customer's own instance data (their historical incidents, tickets, HR cases) — no cross-customer training. Now Assist (Apriel): ServiceNow's proprietary model trained on enterprise workflow data — customer data not used to train shared Apriel model. BYO LLM option: customer's choice of model and data handling.",
  subprocessors:
    "AWS and Azure for infrastructure. Apriel: NVIDIA (model co-development). BYO LLM: customer-specified providers (OpenAI, Anthropic, Google, Meta). Published subprocessor list maintained.",
  dpaDetails:
    "GDPR DPA with ServiceNow Netherlands B.V. EU SCCs included. SPP EU provides enhanced GDPR posture. DPA covers all Now Platform processing including AI features. Specific AI processing addendum available for Now Assist.",
  slaDetails:
    "99.8% uptime SLA for production instances. Now Assist GenAI features subject to underlying model availability.",
  dataPortability:
    "Full data export via ServiceNow APIs (REST/GraphQL). Instance data exportable in standard formats. Predictive Intelligence models: configuration exportable but models retrained on customer data.",
  exitTerms:
    "Data deletion within 90 days post-contract. SPP EU: certified deletion within EU infrastructure.",
  ipTerms:
    "Customer owns all business data, case data, and workflow data. ServiceNow owns Apriel and Predictive Intelligence model IP. Customer-built custom models (via ML Builder) owned by customer.",
  certifications:
    "ISO 27001, ISO 27017, ISO 27018, SOC 2 Type II, SOC 3, FedRAMP (US), C5 (Germany), IRAP (Australia), ENS (Spain). SPP EU: additional EU sovereignty certifications.",
  encryptionInfo:
    "AES-256 at rest with customer-managed key option (ServiceNow Key Management Framework). TLS 1.3 in transit. SPP EU: encryption keys held within EU.",
  accessControls:
    "SSO/SAML, SCIM, MFA, role-based access control (RBAC) at table/field/record level. Comprehensive audit logs. Now Assist prompts and responses logged for admin review. AI Agent activity logged with full action trail.",
  modelDocs:
    "Apriel Nemotron 15B: co-developed with NVIDIA, announced Knowledge 2025. Purpose-built for enterprise service management reasoning. Technical overview published. Predictive Intelligence: documentation covers classification, clustering, similarity frameworks. Now Assist: model card-style documentation per module. BYO LLM: provider documentation applies.",
  explainability:
    "Predictive Intelligence: confidence scores on all predictions; 'why was this classified here?' explanations available. Now Assist: AI-generated content clearly marked as AI suggestions; agents see source context used to generate summary. AI Agents: full action audit trail — every step the agent took is logged and visible to administrators.",
  biasTesting:
    "Predictive Intelligence: customers can monitor classification accuracy by group in their own data. ServiceNow provides model performance dashboards. No published independent bias audit of Apriel as of Q1 2026. For high-risk HR use cases, customers responsible for bias testing their deployed configurations.",
  aiActStatus:
    "ServiceNow operates on a mixed risk profile: most ITSM/SecOps/ITOM AI features are Limited or Minimal risk. HR features (HRSD case routing, performance management, scheduling affecting employment) are HIGH risk under Annex III Category 4 — requiring deployer conformity assessment. ServiceNow announced EU AI Act compliance programme in 2025. SPP EU architecture supports technical documentation and human oversight requirements. Customers as deployers are responsible for FRIA and works council obligations.",
  gdprStatus:
    "Strong GDPR posture via SPP EU. DPA available. EU data residency standard for EU customers on SPP EU. HR AI processes sensitive employee data — requires specific GDPR lawful basis (legitimate interest + balancing test, or collective agreement in many EU countries). Now Assist processes conversation content — retention and purpose limitation policies must be configured.",
  euResidency:
    "Full EU residency via SPP EU (ServiceNow Protected Platform for the EU). Standard for security-conscious EU enterprise customers. Includes inference for Apriel model.",
  assessedAt: new Date("2026-04-07"),
  assessmentNote:
    "Assessment covers the full ServiceNow AI Platform including Predictive Intelligence, Now Assist (Apriel + BYO LLM), and AI Agents. Risk classification varies significantly by module and use case — see useCases field for per-feature classification. Overall platform rating reflects the common enterprise deployment profile (predominantly ITSM/CSM). Organisations deploying HRSD AI or Field Service scheduling AI should treat those specific features as high-risk.",
};

// ─── New Framework Sections: Platform AI Capability Analysis ─

const platformIntelligenceSections = [
  {
    frameworkSlug: "eu-ai-act",
    title: "Platform Intelligence: ServiceNow AI — Capability Map & EU Risk",
    description:
      "ServiceNow has three distinct AI layers, each with different underlying technology, use cases, and EU risk classifications. Understanding which layer you're using determines your compliance obligations.",
    sortOrder: 30,
    statements: [
      {
        reference: "Layer 1: Predictive Intelligence — ML on Workflow Data",
        statement:
          "Predictive Intelligence is ServiceNow's native, traditional machine learning capability. Underlying technology: supervised classification (multi-class ML models), unsupervised clustering, and similarity search — all trained on the customer's own historical ServiceNow data. No LLM involved. Key use cases: incident auto-classification to assignment groups, change risk scoring, alert anomaly detection, SLA breach prediction. EU risk: predominantly Limited or Minimal risk because these features optimise operational workflows rather than making decisions with legal effect on individuals.",
        commentary:
          "Enterprise value: Predictive Intelligence is the most mature and most deployed ServiceNow AI. Its compliance profile is straightforward — the models run on your data, within your instance, and make operational recommendations (not decisions). A typical well-configured ServiceNow implementation auto-classifies 60-80% of incidents correctly, reducing analyst triage time significantly. EU compliance action: ensure your Predictive Intelligence models are retrained when your data patterns change (post-market monitoring), and document the models in your AI system register. No conformity assessment needed for pure ITSM routing use cases.",
        sourceUrl: "https://www.servicenow.com/docs/r/intelligent-experiences/predictive-intelligence/predictive-intelligence.html",
        sourceNote: "ServiceNow Predictive Intelligence Documentation; EU AI Act Annex III risk analysis",
        sortOrder: 1,
      },
      {
        reference: "Layer 2: Now Assist — Generative AI Co-Pilot (Apriel + BYO LLM)",
        statement:
          "Now Assist is ServiceNow's generative AI layer — LLM-powered features embedded in every module. Two model options: (1) Apriel Nemotron 15B — ServiceNow's proprietary model, co-developed with NVIDIA, purpose-built for enterprise service management reasoning, runs within the ServiceNow platform and SPP EU boundary; (2) BYO LLM — bring your own model (GPT-4, Claude, Llama, Gemini) via Now LLM Gateway with customer-controlled data routing. Key capabilities: case/incident summarisation, AI-drafted replies, knowledge article generation, policy Q&A, code generation for Now Platform developers. EU risk: Limited risk for most deployments; becomes High risk if GenAI outputs directly drive decisions about individuals (HR cases, customer service with consequential outcomes).",
        commentary:
          "Enterprise architecture decision: Apriel vs BYO LLM. Apriel runs within SPP EU — simpler GDPR compliance, EU data residency, no third-party data transfer. BYO LLM gives you choice of frontier capability (GPT-5, Claude 4) but requires managing the GDPR transfer mechanism for each call. For sensitive EU deployments (healthcare, financial services, public sector), Apriel is the cleaner compliance choice. For maximum AI capability on non-sensitive tasks, BYO frontier model. For highest-sensitivity EU sovereign requirements, on-premise Llama 4 via Now LLM Gateway with your own EU infrastructure.",
        sourceUrl: "https://blogs.nvidia.com/blog/servicenow-apriel-nemotron/",
        sourceNote: "NVIDIA Blog — Apriel Nemotron 15B Launch; ServiceNow AI Platform documentation",
        sortOrder: 2,
      },
      {
        reference: "Layer 3: AI Agents — Autonomous Multi-Step Execution",
        statement:
          "AI Agents represent ServiceNow's most powerful and most regulated AI capability. These are autonomous agents that execute multi-step workflows without continuous human oversight — accessing multiple systems, making decisions, taking actions, and closing tasks. Key components: AI Agent Orchestrator (manages agent lifecycle), AI Agent Studio (build/configure agents), AI Agent Fabric (cross-platform agent coordination with Microsoft Copilot, Google, Salesforce etc.). Use cases: end-to-end IT service resolution, employee onboarding workflow, HR case processing, security incident response. EU risk: VARIES CRITICALLY by what the agent does. Operational agents (IT provisioning, software licence delivery) are Limited risk. Agents touching employment conditions, financial decisions, or consequential customer rights are HIGH risk or potentially prohibited.",
        commentary:
          "This is where most enterprises will have compliance gaps in 2026. An AI Agent that autonomously onboards an employee (provisions access, creates accounts, assigns roles) is taking consequential employment-related actions — and depending on what roles/access it determines, this edges into high-risk Annex III Category 4 territory. Before deploying AI Agents in HR, financial, or customer-consequential workflows, map every action the agent can take and classify each. Build human approval gates into agentic workflows for high-risk actions. The ServiceNow AI Agent action audit log is your compliance evidence — enable it and retain it.",
        sourceUrl: "https://www.servicenow.com/products/ai-agents.html",
        sourceNote: "ServiceNow AI Agents product documentation; EU AI Act Article 14 human oversight",
        sortOrder: 3,
      },
      {
        reference: "ServiceNow EU AI Act: The High-Risk Use Case Boundary",
        statement:
          "The critical compliance line in ServiceNow: ITSM/SecOps/ITOM AI is almost entirely Limited or Minimal risk — these optimise technology operations with no direct individual impact. HRSD and Field Service AI crosses into HIGH risk territory when: (a) AI routes, scores, or influences HR case outcomes affecting employees; (b) Field Service AI makes scheduling decisions that affect worker pay, hours, or terms; (c) AI Agent-driven onboarding assigns roles or access levels that determine employment conditions. Customer Service AI becomes high-risk when: the AI independently makes consequential decisions (account restrictions, claims, entitlements) rather than informing human agents.",
        commentary:
          "Practical decision matrix for ServiceNow deployers: ITSM AI → proceed with standard controls. CSM AI (inform/draft) → proceed with Article 50 disclosure. CSM AI (autonomous decisions) → high-risk regime applies. HRSD AI (summarisation/routing) → document as high-risk, implement human oversight, notify works council. HRSD AI (performance data, disciplinary, termination support) → full high-risk compliance including FRIA if public body. Field Service scheduling → legal advice needed on whether it affects employment conditions. AI Agents in HR/CSM decisions → treat as high-risk until legal classification is confirmed.",
        sourceUrl: "https://artificialintelligenceact.eu/annex/3/",
        sourceNote: "EU AI Act Annex III Categories 4 and 5; ServiceNow EU compliance programme",
        sortOrder: 4,
      },
      {
        reference: "ServiceNow SPP EU: What It Does and Doesn't Cover",
        statement:
          "ServiceNow Protected Platform for the EU (SPP EU) ensures: (1) customer instance data stored in EU data centres only; (2) AI inference (Apriel model) runs within EU boundary; (3) support access to data restricted to EU-based personnel; (4) encryption keys held within EU. What it does NOT cover: (a) BYO LLM calls route to the configured model provider's infrastructure — if you use GPT-4, that call goes to Azure/OpenAI even with SPP EU; (b) Integration Hub spokes that call external US APIs; (c) third-party apps from ServiceNow Store with their own data flows.",
        commentary:
          "SPP EU is the right baseline for EU enterprise deployments — it covers the core platform. But it is not a blanket EU data residency guarantee for everything that happens within ServiceNow. Review: which LLM model are you using with Now Assist (Apriel = EU-resident, GPT-4 = not)? Which Integration Hub spokes are active, and do they send personal data externally? Which ServiceNow Store apps are deployed? Build a data flow map — not just 'we have SPP EU' but a specific map of which data flows where. This is what an EU AI Act technical documentation or GDPR DPIA would require.",
        sourceUrl: "https://www.servicenow.com/content/dam/servicenow-assets/public/en-us/doc-type/resource-center/white-paper/wp-spp_european_union.pdf",
        sourceNote: "ServiceNow SPP EU White Paper; ServiceNow UK Blog on AI and Data Sovereignty",
        sortOrder: 5,
      },
      {
        reference: "ServiceNow vs Competitors: What Makes It Different for EU Compliance",
        statement:
          "ServiceNow's competitive differentiation for EU-regulated enterprises: (1) SPP EU data sovereignty — comparable to Microsoft Azure's EU Data Boundary and Oracle EURA, but native to the application layer rather than infrastructure; (2) Apriel as in-platform model — unlike Salesforce Agentforce (uses external LLMs by default) or SAP Joule (uses Azure OpenAI), Apriel keeps inference within ServiceNow's controlled environment; (3) AI Agent action audit trail — more granular than most competitors; (4) BYO LLM flexibility — enterprises can choose their model and data routing. Weakness vs competitors: Apriel (15B parameters) is smaller and less capable than frontier models (GPT-5, Claude 4, Gemini Ultra) — for tasks requiring deep reasoning, BYO frontier model is needed at the cost of data sovereignty.",
        commentary:
          "Procurement implication: ServiceNow is a strong choice for EU compliance when the core ITSM/HRSD platform is the primary use case and you configure SPP EU with Apriel. If your use case demands frontier-model capability (complex multi-step reasoning, code generation, sophisticated analysis), you will need BYO LLM, which reintroduces data residency questions. In that scenario, the architecture becomes: ServiceNow SPP EU + Azure OpenAI EU regions + GDPR DPA for the Azure/OpenAI component. This is manageable but requires deliberate configuration — it is not zero-effort compliance.",
        sourceUrl: "https://www.servicenow.com/uk/blogs/2025/ai-data-sovereignty-compliance",
        sourceNote: "ServiceNow sovereignty blog; Competitive AI platform analysis 2025",
        sortOrder: 6,
      },
    ],
  },
];

// ─── Changelog entries for ServiceNow ──────────────────────

const servicenowNewsEntries = [
  {
    title: "ServiceNow Launches Apriel Nemotron 15B — Enterprise AI Model with NVIDIA",
    description:
      "ServiceNow unveiled Apriel Nemotron 15B at Knowledge 2025, co-developed with NVIDIA. The model is purpose-built for enterprise service management reasoning — trained specifically on IT, HR, and customer service workflow patterns rather than general web data. Apriel powers Now Assist across all ServiceNow modules and is the default model for SPP EU deployments, ensuring AI inference stays within EU boundaries. The model supports agentic reasoning required for multi-step AI Agent workflows.",
    changeType: "new_version",
    date: new Date("2025-05-06"),
    sourceUrl: "https://blogs.nvidia.com/blog/servicenow-apriel-nemotron/",
    sourceLabel: "NVIDIA Blog — Apriel Nemotron 15B",
    author: "AI Compass EU Editorial",
    systemSlug: "servicenow-now-assist",
  },
  {
    title: "ServiceNow Unveils AI Agent Platform — Any AI, Any Model, Any Agent",
    description:
      "ServiceNow launched its reimagined AI Platform at Knowledge 2025, positioning ServiceNow as the orchestration hub for enterprise AI. Key innovations: AI Agent Orchestrator for managing multiple AI agents, AI Agent Studio for building custom agents, and AI Agent Fabric for cross-platform coordination (Microsoft Copilot, Google, Salesforce, Oracle integrations). Initial enterprise users include Adobe, Visa, Wells Fargo, and Aptiv. For EU compliance, AI Agents executing consequential workflows need careful mapping against EU AI Act Annex III risk categories.",
    changeType: "new_version",
    date: new Date("2025-05-07"),
    sourceUrl: "https://newsroom.servicenow.com/press-releases/details/2025/ServiceNow-Unveils-the-New-ServiceNow-AI-Platform-to-Put-Any-AI-Any-Agent-Any-Model-to-Work-Across-the-Enterprise/default.aspx",
    sourceLabel: "ServiceNow Newsroom",
    author: "AI Compass EU Editorial",
    systemSlug: "servicenow-now-assist",
  },
  {
    title: "ServiceNow Protected Platform for EU (SPP EU) — Data Sovereignty for AI",
    description:
      "ServiceNow's SPP EU programme ensures customer data and AI inference remain within EU boundaries. Key features: EU-only data centre processing (Frankfurt/Amsterdam), EU-based support staff access, EU-resident encryption key management, and Apriel model inference within EU. Designed in response to EU enterprise concerns about data sovereignty under GDPR and EU AI Act. SPP EU reduces — but does not eliminate — data residency considerations: BYO LLM calls and third-party integrations require separate configuration.",
    changeType: "update",
    date: new Date("2025-03-01"),
    sourceUrl: "https://www.servicenow.com/uk/blogs/2025/ai-data-sovereignty-compliance",
    sourceLabel: "ServiceNow UK Blog — AI and Data Sovereignty",
    author: "AI Compass EU Editorial",
    systemSlug: "servicenow-now-assist",
  },
  {
    title: "ServiceNow EU AI Act Compliance Programme Announced",
    description:
      "ServiceNow announced a formal EU AI Act compliance programme in 2025, acknowledging that HRSD and Field Service AI features may qualify as high-risk under Annex III Category 4. The programme includes: updated DPA with AI processing addendum, AI feature risk classification guidance for customers, and technical documentation support for deployers conducting conformity assessments. ServiceNow positioned its SPP EU and AI action audit trail as the technical foundation for EU AI Act compliance. Customer workshops launched in Q3 2025 across major EU markets.",
    changeType: "certification",
    date: new Date("2025-09-15"),
    sourceUrl: "https://www.servicenow.com/",
    sourceLabel: "ServiceNow Official",
    author: "AI Compass EU Editorial",
    systemSlug: "servicenow-now-assist",
  },
];

// ─── Main ─────────────────────────────────────────────────

async function main() {
  console.log("🌱 Starting ServiceNow deep-dive seed...\n");

  const frameworks = await prisma.regulatoryFramework.findMany({
    select: { id: true, slug: true },
  });
  const frameworkMap = Object.fromEntries(frameworks.map((f) => [f.slug, f.id]));

  const industries = await prisma.industry.findMany({
    select: { id: true, slug: true },
  });
  const industryMap = Object.fromEntries(industries.map((i) => [i.slug, i.id]));

  // ─── Update ServiceNow System Record ─────────────────────
  console.log("📦 Updating ServiceNow system record with full capability profile...");

  const industrySlugs = ["financial-services", "healthcare", "public-sector", "telecommunications"];
  const industryIds = industrySlugs.filter((s) => industryMap[s]).map((s) => ({ id: industryMap[s] }));

  const { assessedAt, assessmentNote, ...systemData } = servicenowFullProfile;

  const upserted = await prisma.aISystem.upsert({
    where: { slug: servicenowFullProfile.slug },
    update: {
      ...systemData,
      assessedAt,
      assessmentNote,
      industries: { set: industryIds },
    },
    create: {
      ...systemData,
      assessedAt,
      assessmentNote,
      industries: { connect: industryIds },
    },
  });
  console.log(`  ✅ Updated: ${upserted.vendor} — ${upserted.name}`);

  const systemMap: Record<string, string> = {};
  const allSystems = await prisma.aISystem.findMany({ select: { id: true, slug: true } });
  allSystems.forEach((s) => { systemMap[s.slug] = s.id; });

  // ─── Add Framework Sections ─────────────────────────────
  console.log("\n📋 Adding ServiceNow capability intelligence sections...");
  let sectionsAdded = 0;
  let statementsAdded = 0;

  for (const sec of platformIntelligenceSections) {
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
    console.log(`  ✅ ${sectionFields.title} (${statements.length} statements)`);
  }

  // ─── Add News Entries ───────────────────────────────────
  console.log("\n📰 Adding ServiceNow news entries...");
  let newsAdded = 0;

  for (const entry of servicenowNewsEntries) {
    const { systemSlug, ...data } = entry;
    const systemId = systemSlug ? systemMap[systemSlug] : undefined;

    const existing = await prisma.changeLog.findFirst({ where: { title: data.title } });
    if (existing) {
      await prisma.changeLog.update({ where: { id: existing.id }, data: { ...data, systemId } });
    } else {
      await prisma.changeLog.create({ data: { ...data, systemId } });
    }
    newsAdded++;
    console.log(`  ✅ ${data.title.substring(0, 60)}...`);
  }

  console.log("\n✨ ServiceNow deep-dive complete!");
  console.log(`   Sections: ${sectionsAdded} | Statements: ${statementsAdded} | News: ${newsAdded}`);

  const totals = {
    systems: await prisma.aISystem.count(),
    sections: await prisma.frameworkSection.count(),
    statements: await prisma.policyStatement.count(),
    changelogs: await prisma.changeLog.count(),
  };
  console.log("\n📊 Database totals:", totals);
}

main()
  .catch((e) => { console.error("❌", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
