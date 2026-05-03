/**
 * Platform Deep Dives: Microsoft 365 Copilot & Salesforce Agentforce
 * April 2026
 *
 * Same approach as ServiceNow: map every AI capability to underlying tech,
 * real use case, EU risk classification, and enterprise deployment guidance.
 *
 * Run with: npx tsx src/data/seed-platform-deep-m365-sfdc.ts
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// ─── Microsoft 365 Copilot — Updated System Record ────────

const m365CopilotProfile = {
  slug: "microsoft-azure-openai-service",
  // Updating the existing Azure OpenAI record to also cover M365 Copilot
  vendor: "Microsoft",
  name: "Microsoft 365 Copilot / Azure OpenAI Service / Copilot Studio",
  type: "Enterprise AI Platform (Productivity + Custom AI + Agents)",
  risk: "High",
  description:
    "Microsoft's three-layer enterprise AI ecosystem: (1) Microsoft 365 Copilot — AI co-pilot embedded across Word, Excel, PowerPoint, Outlook, Teams, SharePoint; powered by GPT-4o/GPT-5 via Azure OpenAI, grounded in Microsoft Graph (your org's data); (2) Azure OpenAI Service — API access to OpenAI models for custom AI development; (3) Copilot Studio — low-code/no-code platform for building custom AI agents and chatbots. EU data boundary programme covers M365 Copilot. Most widely deployed enterprise AI platform in the EU.",
  category: "Enterprise Productivity AI",
  featured: true,
  vendorHq: "Redmond, USA",
  euPresence:
    "Microsoft Ireland Operations Ltd (Dublin) as EU entity. EU Data Boundary programme provides EU data residency for M365 commercial customers. Data centres in Amsterdam, Dublin, Frankfurt, Paris, and Stockholm. Largest EU enterprise AI vendor by deployment scale.",
  useCases:
    "Word — AI Drafting & Document Generation [GenAI: LLM writes first drafts from prompts | EU Risk: Minimal | Note: author reviews; no individual impact]\n" +
    "Word — Document Summarisation [GenAI: LLM condenses long documents | EU Risk: Minimal | Note: content understanding, no decisions]\n" +
    "Excel — Natural Language Data Analysis [GenAI + Formula AI: 'which products grew fastest?' answered from your data | EU Risk: Minimal-Limited | Note: outputs data insights; consequential financial decisions made by humans]\n" +
    "Excel — AI Formula Generation [Code LLM: generates complex formulas from plain English | EU Risk: Minimal | Note: developer productivity; no individual impact]\n" +
    "PowerPoint — Presentation Generation from Brief [GenAI: creates slide deck from Word doc or prompt | EU Risk: Minimal | Note: productivity tool]\n" +
    "Outlook — Email Drafting & Tone Rewrite [GenAI: drafts replies, adjusts tone | EU Risk: Minimal | Note: user reviews before send]\n" +
    "Outlook — Inbox Prioritisation (Prioritise My Inbox) [ML + LLM hybrid: ranks emails by importance with rationale | EU Risk: Limited | Note: influences which communications get attention — important for regulated comms; human always decides]\n" +
    "Outlook — Thread Summarisation [GenAI: condenses long email threads | EU Risk: Minimal | Note: purely informational]\n" +
    "Teams — Meeting Intelligent Recap [STT + GenAI: transcribes meeting, extracts action items, summary | EU Risk: Limited | Note: processes personal voice data; employee monitoring considerations if systematic]\n" +
    "Teams — Real-Time Meeting Q&A [GenAI RAG: answers 'what was discussed?' during live meeting | EU Risk: Limited | Note: voice/conversation data; consent/transparency to participants]\n" +
    "Teams — Copilot for Team Chats [GenAI: summarises chat threads, drafts replies | EU Risk: Minimal | Note: productivity]\n" +
    "SharePoint — AI-Powered Document Search [RAG: semantic search and Q&A over company documents | EU Risk: Minimal-Limited | Note: access controls must be respected; Copilot respects existing SharePoint permissions]\n" +
    "SharePoint — Content Generation from Templates [GenAI: creates documents from org templates + prompts | EU Risk: Minimal]\n" +
    "Viva Insights — Employee Productivity Analytics [ML/analytics: anonymised/aggregated work pattern analysis | EU Risk: HIGH if individual-level | Note: Article 5(1)(f) employee monitoring boundary; ONLY safe if genuinely aggregated with minimum 10-person groups — individual-level productivity scoring is prohibited]\n" +
    "Viva Learning — AI Personalised Learning Paths [ML recommendation: suggests learning content based on role/skills | EU Risk: Limited | Note: employment development tool; becomes high-risk if feeds into promotion/career decisions]\n" +
    "GitHub Copilot — AI Code Completion [Code LLM: autocompletes and generates code in IDE | EU Risk: Minimal | Note: developer productivity; code review by developer]\n" +
    "GitHub Copilot — Code Review AI [LLM: reviews PR diffs, flags issues | EU Risk: Minimal-Limited | Note: if AI code review influences performance reviews → Category 4 concern]\n" +
    "Copilot Studio — Custom Chatbot Builder [Low-code GenAI agent builder | EU Risk: DEPENDS on use case | Note: chatbots for internal FAQ = Limited; chatbots making consequential decisions = High risk]\n" +
    "Copilot Studio — Autonomous Agents (Power Automate + Copilot) [Agentic AI: multi-step workflow execution across M365 and third-party systems | EU Risk: VARIES by action scope | Note: agents executing HR actions, financial approvals, or customer decisions without human gate = high-risk]\n" +
    "Azure OpenAI API — Custom AI Application Development [Foundation model API for custom apps | EU Risk: INHERITS from application | Note: the API is infrastructure; the application determines risk classification]\n" +
    "Defender/Security Copilot — Threat Intelligence [GenAI + RAG: synthesises security signals, drafts incident reports | EU Risk: Limited | Note: analyst tool; automated action requires human approval]\n" +
    "Purview — AI-Classified Data Governance [ML: classifies sensitive data in M365 environment | EU Risk: Limited | Note: data management tool; enables other compliance controls]",
  dataStorage:
    "EU Data Boundary: commercial M365 customers in EU/EEA have data stored in EU data centres (Amsterdam, Dublin, Frankfurt, Paris, Stockholm). Copilot prompts and responses stored in EU boundary. Azure OpenAI: customer-selected EU regions. Microsoft Graph data (emails, docs, chats) stays in EU boundary for EU tenants.",
  dataProcessing:
    "EU Data Boundary: M365 Copilot inference processed within EU boundary for EU commercial customers. Azure OpenAI: EU regions available (Sweden Central, France Central, West Europe, North Europe). Some Copilot features (Safety Evaluations, Abuse Monitoring for specific services) may use US-based processing — opt-out available for approved enterprise customers.",
  trainingDataUse:
    "M365 Copilot: prompts, responses, and Microsoft Graph data NOT used to train OpenAI foundation models. Confirmed by Microsoft Product Terms. Azure OpenAI: customer data not used for training. Opt-out from abuse monitoring data use available.",
  subprocessors:
    "OpenAI (model hosting via Azure partnership — under Microsoft DPA, not OpenAI directly). Microsoft subsidiaries globally. LinkedIn (Viva features). Published subprocessor list.",
  dpaDetails:
    "GDPR DPA via Microsoft Product Terms (covers all M365 and Azure services). EU Data Boundary commitments. EU SCCs not required for M365 EU commercial customers (processing stays in EU). DPO appointed. BCRs in place. EU representative: Microsoft Ireland.",
  slaDetails:
    "99.9% uptime SLA for M365 Commercial. Azure OpenAI: 99.9% SLA. Copilot features subject to underlying service SLAs.",
  dataPortability:
    "Full Microsoft 365 data exportable via Compliance Center. Azure data: full API and portal export. Copilot interaction history exportable for e-discovery.",
  exitTerms:
    "Data deletion within 90 days post-subscription end. Microsoft 365 Compliance Center provides deletion confirmation.",
  ipTerms:
    "Customer owns all content created with Copilot. Microsoft Copyright Commitment: Microsoft defends commercial customers against copyright claims arising from Copilot output.",
  certifications:
    "ISO 27001, ISO 27017, ISO 27018, SOC 2 Type II, SOC 3, C5 (Germany), ENS (Spain), IRAP, HDS (France healthcare). EU Data Boundary independently audited.",
  encryptionInfo:
    "AES-256 at rest with customer-managed keys (Azure Key Vault) available. TLS 1.2+ in transit. Customer Lockbox for privileged access control.",
  accessControls:
    "Microsoft Entra ID (Azure AD), SSO/SAML, SCIM, MFA, Conditional Access, RBAC at service and data level. Copilot respects existing M365 permissions — can only access what the user can already access. Comprehensive audit logging via Purview.",
  modelDocs:
    "Azure OpenAI model cards published for GPT-4o, GPT-5 family. M365 Copilot system prompt and grounding architecture documented. GitHub Copilot model card. Responsible AI Standard published.",
  explainability:
    "M365 Copilot: shows source documents/emails used to generate responses (citations). Excel AI: explains formula logic. Copilot Studio: agent action trace visible to admins. Azure OpenAI: SHAP/interpretability tools available via Azure ML integration.",
  biasTesting:
    "Microsoft Responsible AI team. Red team adversarial testing. Fairness evaluation tools in Azure ML. Annual Responsible AI Transparency Report. M365 Copilot content safety layers applied.",
  aiActStatus:
    "Mixed risk profile: productivity features (Word, Excel, Outlook) are Minimal/Limited risk. Viva Insights individual productivity tracking is HIGH risk if used for employment decisions. Copilot Studio agents executing consequential workflows are HIGH risk depending on action scope. Microsoft published EU AI Act compliance guidance in 2025. Azure OpenAI registered as GPAI model under EU AI Act. M365 Copilot covered by Microsoft's EU AI Act compliance programme.",
  gdprStatus:
    "Industry-leading GDPR posture. EU Data Boundary contractually guarantees EU processing for EU commercial customers. DPO appointed. BCRs in place. Purview provides GDPR rights management (erasure, access, portability). DPIAs supported via Microsoft documentation.",
  euResidency:
    "Full EU residency via EU Data Boundary for all M365 commercial services including Copilot. Azure OpenAI: EU regions available and selectable. Standard for EU enterprise customers.",
  assessedAt: new Date("2026-04-07"),
  assessmentNote:
    "Assessment covers Microsoft 365 Copilot, Azure OpenAI Service, GitHub Copilot, and Copilot Studio. Risk classification varies significantly: productivity features are Minimal/Limited; Viva Insights at individual level and agentic Copilot Studio workflows in HR/financial/customer domains are High. EU Data Boundary is the strongest EU sovereignty commitment among US hyperscalers. Key risk area: Microsoft Copilot Copyright Commitment does not eliminate all IP risk — verify specifically for your jurisdiction.",
};

// ─── Salesforce Agentforce — Updated System Record ────────

const salesforceProfile = {
  slug: "agentforce-einstein-ai",
  vendor: "Salesforce",
  name: "Agentforce / Einstein AI / Einstein 1 Platform",
  type: "Enterprise CRM AI + Autonomous Agent Platform",
  risk: "Limited",
  description:
    "Salesforce's comprehensive CRM AI platform combining three layers: (1) Einstein AI — predictive and analytical ML embedded across Sales Cloud, Service Cloud, Marketing Cloud, and Commerce Cloud; (2) Einstein Copilot (now rebranded Agentforce) — generative AI assistant using Atlas Reasoning Engine with access to CRM data via Einstein Trust Layer; (3) Agentforce Agents — autonomous AI agents that handle end-to-end customer and employee workflows. EU compliance: Hyperforce EU data residency, Einstein Trust Layer for data governance, no-training-on-customer-data guarantee.",
  category: "CRM AI Platform",
  featured: true,
  vendorHq: "San Francisco, USA",
  euPresence:
    "Salesforce EMEA Limited (London/Dublin). Hyperforce EU: infrastructure fully hosted on AWS EU or Azure EU with EU data residency. Growing EU enterprise customer base across financial services, manufacturing, and public sector.",
  useCases:
    "Sales Cloud — Lead Scoring (Einstein Scoring) [Predictive ML: scores leads by likelihood to convert based on CRM history | EU Risk: Limited | Note: commercial decision support; no individual rights impact unless used for credit/essential services]\n" +
    "Sales Cloud — Opportunity Health Score [Predictive ML: scores deal risk and pipeline health | EU Risk: Minimal | Note: internal sales analytics]\n" +
    "Sales Cloud — AI-Generated Call Summaries (Einstein Conversation Insights) [STT + GenAI: transcribes sales calls, extracts action items, next steps | EU Risk: Limited | Note: voice data; customer and rep consent for recording; may constitute monitoring if used for rep performance assessment]\n" +
    "Sales Cloud — AI Email Generation (Einstein GPT for Email) [GenAI: drafts personalised sales emails using CRM context | EU Risk: Minimal | Note: rep reviews before send]\n" +
    "Service Cloud — Case Classification & Routing (Einstein Case Classification) [Predictive ML: classifies incoming cases and routes to correct queue | EU Risk: Limited | Note: operational routing; no individual rights impact]\n" +
    "Service Cloud — AI Article Recommendations [ML: surfaces relevant knowledge articles to agents | EU Risk: Minimal | Note: agent productivity]\n" +
    "Service Cloud — Case Summarisation (Einstein GPT for Service) [GenAI: summarises case history for agents | EU Risk: Limited | Note: processes customer personal data; DPA applies]\n" +
    "Service Cloud — AI-Drafted Agent Replies [GenAI: drafts customer responses for agent review | EU Risk: Limited | Note: agent reviews before send; Article 50 if customer needs to know AI is involved]\n" +
    "Service Cloud — Agentforce Service Agent (Autonomous) [Agentic AI: handles end-to-end customer service queries including account actions | EU Risk: HIGH if making consequential account decisions | Note: autonomous customer-facing agents making account changes = high-risk if consequential (account restrictions, refunds, entitlements)]\n" +
    "Marketing Cloud — Einstein Engagement Scoring [Predictive ML: scores customer propensity to engage with marketing | EU Risk: Limited | Note: marketing optimisation; GDPR consent for marketing required separately]\n" +
    "Marketing Cloud — AI Personalised Content (Einstein Content Selection) [ML recommendation: selects personalised content/offers for each customer | EU Risk: Limited | Note: personalisation; GDPR Article 6 lawful basis for profiling required]\n" +
    "Marketing Cloud — Predictive Send Time Optimisation [ML: predicts optimal email send time per customer | EU Risk: Minimal | Note: operational optimisation]\n" +
    "Marketing Cloud — AI Segmentation (Einstein Segmentation) [Unsupervised ML: discovers customer segments for targeting | EU Risk: Limited | Note: GDPR profiling; legitimate interest or consent basis needed]\n" +
    "Commerce Cloud — Product Recommendations [Collaborative filtering ML: personalised product recommendations | EU Risk: Minimal | Note: standard e-commerce personalisation; GDPR consent for profiling]\n" +
    "Agentforce — Custom AI Agents (Atlas Reasoning Engine) [Agentic AI with reasoning: multi-step task completion across CRM + external systems | EU Risk: DEPENDS on action | Note: agents drafting quotes = Limited; agents making credit decisions or restricting services = High]\n" +
    "Agentforce — Sales Development Rep (SDR) Agent [Autonomous AI that qualifies leads, schedules meetings | EU Risk: Limited-High | Note: autonomous commercial outreach; GDPR consent for commercial comms; if influencing hiring SDR decisions → Category 4]\n" +
    "Field Service — Intelligent Appointment Booking [ML scheduling: optimises field engineer dispatch | EU Risk: Limited-High | Note: HIGH if scheduling decisions affect worker pay/hours/terms as per EU AI Act Category 4]\n" +
    "Tableau — AI-Powered Analytics (Einstein Discovery) [AutoML: finds statistical patterns, predicts outcomes, explains drivers | EU Risk: Limited | Note: decision support; analyst acts on insights]\n" +
    "Slack — AI Summaries & Channel Intelligence [GenAI: summarises Slack channels, threads, and calls | EU Risk: Limited | Note: employee communication data; transparency to employees; may approach monitoring boundary if systematic]",
  dataStorage:
    "Hyperforce EU: Salesforce infrastructure deployed on AWS EU (Frankfurt) or Azure EU (Netherlands). All customer data stored in EU for Hyperforce EU customers. Einstein Trust Layer ensures prompts and CRM data do not leave Salesforce's controlled environment during AI processing.",
  dataProcessing:
    "Hyperforce EU: all processing in EU. Einstein Trust Layer: prompts to LLMs are processed via Einstein Trust Layer which strips PII, applies dynamic grounding, and does not retain prompts. LLM calls routed through Salesforce's Azure OpenAI EU deployment for Hyperforce EU customers.",
  trainingDataUse:
    "Einstein Trust Layer contractual guarantee: customer data NOT used to train Salesforce or third-party LLMs. Prompts masked before routing to external models. Einstein predictive models (lead scoring etc.) trained on individual customer's own CRM data — no cross-customer training.",
  subprocessors:
    "AWS EU and Azure EU (Hyperforce infrastructure). Azure OpenAI EU (LLM inference via Einstein Trust Layer). Published subprocessor list.",
  dpaDetails:
    "GDPR DPA. Salesforce EMEA as EU data processor. EU SCCs. Hyperforce EU eliminates most third-country transfer concerns. DPO appointed.",
  slaDetails: "99.9% SLA for Sales Cloud, Service Cloud (Enterprise/Unlimited editions).",
  dataPortability: "Full CRM data exportable via Data Export Service and API.",
  exitTerms: "Data export before contract end; deletion within 30 days post-export.",
  ipTerms: "Customer owns all CRM data and AI-generated content produced from it.",
  certifications: "ISO 27001, ISO 27017, ISO 27018, SOC 2 Type II, SOC 3, C5, HDS (France), EU Cloud Code of Conduct Level 2 (Agentforce — 2025).",
  encryptionInfo:
    "AES-256 at rest with Shield Platform Encryption (customer-managed keys). TLS 1.2+ in transit. Einstein Trust Layer adds additional tokenisation layer for LLM-bound data.",
  accessControls:
    "Salesforce SSO/SAML, MFA, IP allowlisting, Object/Field-Level Security, sharing rules, comprehensive Audit Trail. Agentforce agent permissions granularly controlled via Agent Actions permissions.",
  modelDocs:
    "Einstein Trust Layer architecture whitepaper published. Atlas Reasoning Engine technical overview. Einstein AI model documentation per cloud product. Agentforce system card.",
  explainability:
    "Einstein Discovery: full explanation of drivers for predictions ('why is this opportunity at risk?'). Lead Scoring: score factors displayed. Agentforce: agent action trace visible to admins. Case summaries and reply drafts show source data.",
  biasTesting:
    "Salesforce Trusted AI Principles. Einstein fairness evaluations. Racial equity audit of Einstein AI products conducted independently (2021 — pre-Agentforce). Agentforce bias testing in development as of 2026.",
  aiActStatus:
    "Mixed risk: Einstein predictive features (lead scoring, case routing) are Limited risk. Agentforce Service Agents making autonomous consequential decisions are HIGH risk. Field Service scheduling affecting worker terms is HIGH risk (Annex III Category 4). Salesforce published EU AI Act guidance in 2025. Einstein Trust Layer cited as key technical control for EU AI Act technical documentation. Conformity assessment programme in progress for high-risk use cases.",
  gdprStatus:
    "Strong GDPR posture. Hyperforce EU + Einstein Trust Layer = market-leading data governance for CRM AI. DPO, EU entity, EU SCCs. Profiling activities (segmentation, personalisation) require separate GDPR lawful basis managed by the customer as controller.",
  euResidency:
    "Full EU residency via Hyperforce EU programme. AWS Frankfurt or Azure Netherlands. Standard for EU enterprise contracts.",
  assessedAt: new Date("2026-04-07"),
  assessmentNote:
    "Assessment covers Einstein AI (predictive), Einstein Copilot/Agentforce (generative), and Agentforce Agents (autonomous). Risk classification varies: CRM analytics and agent-assist features are Limited/Minimal; autonomous Agentforce agents making consequential customer or employment decisions are High risk. Einstein Trust Layer is a genuine differentiator for GDPR and EU AI Act compliance — review architecture documentation. Field Service scheduling for employee-affecting decisions needs legal review against Annex III Category 4.",
};

// ─── New Framework Sections ──────────────────────────────

const platformSections = [
  {
    frameworkSlug: "eu-ai-act",
    title: "Platform Intelligence: Microsoft 365 Copilot — Capability Map & EU Risk",
    description:
      "Microsoft 365 Copilot is the most widely deployed enterprise AI in the EU. Its compliance profile is generally strong — but specific features, particularly Viva Insights and autonomous Copilot Studio agents, require careful risk classification.",
    sortOrder: 31,
    statements: [
      {
        reference: "M365 Copilot Core: The EU Data Boundary Guarantee",
        statement:
          "Microsoft's EU Data Boundary (EDB) is the strongest contractual EU data residency commitment from a US hyperscaler: commercial M365 customers in EU/EEA have their data (including Copilot prompts and responses) stored and processed within EU data centres. Prompts, responses, and Microsoft Graph data accessed by Copilot are NOT used to train foundation LLMs. This is confirmed in Microsoft Product Terms. The EDB covers Word, Excel, PowerPoint, Outlook, Teams, and SharePoint Copilot features.",
        commentary:
          "Enterprise implication: Microsoft 365 Copilot is the productivity AI with the simplest GDPR compliance path for EU enterprises — the EU Data Boundary effectively means you don't need to worry about Article 44-49 transfer mechanisms for the core M365 suite. Caveat: some features (Bing grounding, external connectors) may involve data leaving the EU boundary — check your Copilot configuration. Verify via Microsoft Admin Center that your tenant is correctly mapped to an EU region before deploying Copilot broadly.",
        sourceUrl: "https://learn.microsoft.com/en-us/microsoft-365/copilot/microsoft-365-copilot-privacy",
        sourceNote: "Microsoft 365 Copilot Privacy Documentation; EU Data Boundary Programme",
        sortOrder: 1,
      },
      {
        reference: "M365 Copilot Risk Boundary: Viva Insights and Performance Monitoring",
        statement:
          "Microsoft Viva Insights provides AI-driven workplace analytics. The compliance line is clear: aggregated, anonymised insights (minimum group size 10) are Limited risk. Individual-level productivity scoring or behavioural analytics that are visible to managers and could influence performance reviews or employment decisions is HIGH risk (EU AI Act Annex III Category 4) and potentially a prohibited practice (Article 5(1)(f) — emotion/behaviour monitoring in the workplace if it involves inferring psychological states from communication patterns).",
        commentary:
          "Enterprise deployment red lines: Viva Insights 'personal insights' dashboards (visible only to the employee themselves) are fine. Manager dashboards showing individual employee meeting ratios, after-hours work, response times as individual-level data are in a grey zone. If that data feeds into performance reviews or promotion decisions, it is definitively high-risk. Microsoft's default configuration uses aggregated minimums — check if your IT team has configured individual-level reporting, which would require reclassification and works council consultation.",
        sourceUrl: "https://learn.microsoft.com/en-us/viva/insights/",
        sourceNote: "Microsoft Viva Insights documentation; EU AI Act Article 5(1)(f), Annex III Category 4",
        sortOrder: 2,
      },
      {
        reference: "M365 Copilot: Copilot Studio and Autonomous Agents — Risk Escalation",
        statement:
          "Copilot Studio enables building custom AI agents and chatbots with minimal code. Most Studio-built bots are Limited risk (FAQ chatbots, information retrieval). Risk escalates to HIGH when agents: (a) make autonomous decisions about customer accounts (restrictions, approvals, refusals); (b) process employee HR requests with binding outcomes; (c) execute financial transactions without human approval; (d) interact with vulnerable individuals in essential services contexts. The agent's action scope — not its AI sophistication — determines the risk classification.",
        commentary:
          "Copilot Studio is the most powerful and least-governed part of the M365 AI ecosystem. Enterprise governance gap: most organisations lack a formal review process for Copilot Studio agents built by business teams ('citizen developers'). Recommendation: implement a Copilot Studio agent registry and risk review gate — any agent that can take actions (not just retrieve information) must be reviewed against Annex III before deployment. Treat it like deploying a new SaaS application, not creating a Word macro.",
        sourceUrl: "https://learn.microsoft.com/en-us/microsoft-copilot-studio/",
        sourceNote: "Microsoft Copilot Studio documentation; EU AI Act Articles 5, 6, Annex III",
        sortOrder: 3,
      },
      {
        reference: "M365 Copilot: Teams Meeting Intelligence — Employee Monitoring Boundary",
        statement:
          "Copilot in Teams records, transcribes, and summarises meetings — including extracting what each participant said and what actions were assigned to whom. This is a powerful productivity feature that also constitutes monitoring of employee communications. GDPR requirements: participants must be informed that meetings are being recorded and AI-processed; data retention periods must be set; employees' rights to access their own data apply. EU AI Act: systematic AI analysis of employee communications to derive productivity insights approaches the prohibited 'emotion recognition in workplace' and 'employee behaviour monitoring' boundaries if used for performance assessment.",
        commentary:
          "Enterprise policy requirement: define a clear Teams Copilot policy covering: mandatory notification to all meeting participants (including guests) before AI recording starts; retention period for transcripts and summaries (recommend 90 days maximum for routine meetings, longer only with specific purpose); explicit prohibition on using meeting AI data for individual performance assessment without separate consent/works council agreement. Without this policy, widespread Teams Copilot deployment is a GDPR compliance risk.",
        sourceUrl: "https://learn.microsoft.com/en-us/microsoftteams/copilot-teams-transcription",
        sourceNote: "Microsoft Teams Copilot documentation; GDPR Article 88; EDPB guidelines on employee monitoring",
        sortOrder: 4,
      },
    ],
  },
  {
    frameworkSlug: "eu-ai-act",
    title: "Platform Intelligence: Salesforce Agentforce — Capability Map & EU Risk",
    description:
      "Salesforce has three AI layers with very different risk profiles. Einstein predictive AI is mature and lower-risk. Agentforce autonomous agents are powerful but require careful scope design to stay in the Limited risk zone.",
    sortOrder: 32,
    statements: [
      {
        reference: "Einstein AI vs Agentforce: Understanding the Two Risk Tiers",
        statement:
          "Salesforce's AI has two distinct tiers with very different compliance implications. Tier 1 — Einstein Predictive AI: ML models trained on your CRM data providing scores, recommendations, and classifications. These inform human decisions and are generally Limited risk. Examples: Lead Score (probability to convert), Case Classification (routing), Opportunity Health (deal risk). Tier 2 — Agentforce Autonomous Agents: agents using Atlas Reasoning Engine to understand intent, plan actions, and execute multi-step tasks across CRM and integrated systems without continuous human oversight. Risk depends entirely on what actions the agent is authorised to take.",
        commentary:
          "Enterprise design principle: start with Agentforce in 'augmentation' mode before 'automation' mode. In augmentation mode, agents draft, suggest, and prepare — humans approve and execute. This keeps you in Limited risk territory for most use cases. In automation mode, agents execute independently — this is only low-risk for truly operational, reversible, low-stakes tasks (creating a meeting invite, updating a field). For anything consequential (account restriction, refund authorisation, contract modification), require explicit human approval as a configured Agentforce step.",
        sourceUrl: "https://www.salesforce.com/uk/agentforce/",
        sourceNote: "Salesforce Agentforce documentation; EU AI Act risk analysis",
        sortOrder: 1,
      },
      {
        reference: "Einstein Trust Layer: The Technical Compliance Architecture",
        statement:
          "Einstein Trust Layer (ETL) is Salesforce's critical EU compliance architecture for Agentforce. ETL sits between your CRM data and the external LLM: (1) Dynamic Grounding — retrieves only the relevant CRM data for each prompt; (2) PII Masking — automatically identifies and masks personally identifiable information in prompts before sending to LLM; (3) Toxicity Detection — filters harmful outputs before returning to user; (4) Zero Data Retention — prompts are not retained by the LLM provider after response; (5) Audit Trail — every Agentforce prompt, response, and action is logged.",
        commentary:
          "This is Salesforce's answer to GDPR Article 25 (privacy by design). The ETL's PII masking means that even when Agentforce processes customer or employee data, the actual personal data identifiers are masked before reaching the external LLM. From a GDPR perspective, this significantly reduces the personal data exposure risk in the AI processing chain. For EU AI Act technical documentation, the ETL architecture is the key evidence for your data governance controls (Article 10) and logging obligations (Article 12). Make sure you document ETL configuration in your high-risk AI system technical files.",
        sourceUrl: "https://help.salesforce.com/s/articleView?id=einstein_trust_layer.htm",
        sourceNote: "Salesforce Einstein Trust Layer documentation; EU AI Act Articles 10, 12, 26",
        sortOrder: 2,
      },
      {
        reference: "Agentforce for Service: The EU High-Risk Boundary for Customer Service AI",
        statement:
          "Agentforce Service Agents can autonomously handle end-to-end customer service interactions including account actions. The EU AI Act high-risk boundary: an Agentforce agent that collects customer issue information and drafts a response for agent review is Limited risk. An Agentforce agent that independently decides to: issue a refund, restrict an account, deny a service request, or change subscription terms without human review — is HIGH risk under Annex III Category 5 (essential services). For regulated industries (banking, insurance, utilities), autonomous customer-facing decisions about service access are almost always high-risk.",
        commentary:
          "Architectural recommendation: for regulated industry Salesforce deployments, build Agentforce service agents on a 'recommend and confirm' pattern for consequential actions. Agent handles resolution steps autonomously up to the point of account action → triggers a brief human confirmation step for any action that modifies account status, financial terms, or service entitlements. This one architectural gate keeps the agent in Limited risk territory while preserving most of the productivity benefit. Salesforce's own implementation guides for financial services and utilities use exactly this pattern.",
        sourceUrl: "https://www.salesforce.com/uk/agentforce/service-agent/",
        sourceNote: "Salesforce Agentforce Service Agent; EU AI Act Annex III Category 5",
        sortOrder: 3,
      },
    ],
  },
];

// ─── Changelog Entries ────────────────────────────────────

const platformNews = [
  {
    title: "Microsoft 365 Copilot Chat Added to EU Data Boundary (Sep 2025)",
    description:
      "Microsoft updated its Product Terms effective September 1 2025 to include Microsoft 365 Copilot Chat (formerly Bing Chat Enterprise) under Core Online Services with EU Data Boundary commitments. This means Copilot Chat conversations for EU commercial tenants are now processed and stored within the EU. Microsoft also introduced EU Data Act terms, clarifying data portability and switching obligations. These changes strengthen M365's compliance positioning significantly for EU enterprise procurement.",
    changeType: "update",
    date: new Date("2025-09-01"),
    sourceUrl: "https://www.schneider.im/microsoft-updates-privacy-security-terms-microsoft-365-copilot-chat-and-eu-data-act/",
    sourceLabel: "Schneider IT Management — Microsoft EU Data Act Terms",
    author: "VendorScope Editorial",
    systemSlug: "microsoft-azure-openai-service",
  },
  {
    title: "Salesforce Agentforce Generally Available — Atlas Reasoning Engine",
    description:
      "Salesforce launched Agentforce GA with the Atlas Reasoning Engine powering autonomous AI agents across Sales Cloud, Service Cloud, and the broader Salesforce Customer 360 platform. Atlas combines retrieval, reasoning, and action execution in a multi-step loop. The Einstein Trust Layer provides data governance including PII masking for EU compliance. Agentforce quickly became Salesforce's fastest-growing product, with over 1,000 enterprise customers in the first quarter. EU compliance guidance published alongside GA.",
    changeType: "new_version",
    date: new Date("2024-10-29"),
    sourceUrl: "https://www.salesforce.com/uk/news/press-releases/2024/09/17/agentforce/",
    sourceLabel: "Salesforce Newsroom",
    author: "VendorScope Editorial",
    systemSlug: "agentforce-einstein-ai",
  },
  {
    title: "Microsoft 365 Copilot — EU AI Act Compliance Guidance Published",
    description:
      "Microsoft published detailed EU AI Act compliance guidance for M365 Copilot in 2025, including risk classification guidance per feature, technical documentation templates for deployers, and guidance on human oversight configurations. Microsoft confirmed M365 Copilot productivity features (Word, Excel, Outlook, Teams summaries) are Limited or Minimal risk. Viva Insights at individual level and Copilot Studio autonomous agents require deployer risk assessment. The EU Data Boundary programme covers AI Act Article 10 data governance requirements.",
    changeType: "update",
    date: new Date("2025-07-15"),
    sourceUrl: "https://learn.microsoft.com/en-us/microsoft-365/copilot/",
    sourceLabel: "Microsoft Learn — M365 Copilot Documentation",
    author: "VendorScope Editorial",
    systemSlug: "microsoft-azure-openai-service",
  },
  {
    title: "Salesforce Hyperforce EU — All Enterprise CRM Data Stays in EU",
    description:
      "Salesforce's Hyperforce EU programme ensures all Customer 360 data (Sales, Service, Marketing, Commerce Clouds) is hosted on AWS EU (Frankfurt) or Azure EU (Netherlands) for EU enterprise customers. Combined with Einstein Trust Layer's PII masking for AI processing, Salesforce claims the most complete EU data sovereignty architecture for a CRM platform. Hyperforce EU customers benefit from EU Data Residency addendum in Salesforce contracts.",
    changeType: "update",
    date: new Date("2025-04-01"),
    sourceUrl: "https://www.salesforce.com/eu/trust/hyperforce/",
    sourceLabel: "Salesforce Hyperforce EU",
    author: "VendorScope Editorial",
    systemSlug: "agentforce-einstein-ai",
  },
];

// ─── Main ──────────────────────────────────────────────────

async function main() {
  console.log("🌱 Starting M365 Copilot + Salesforce Agentforce deep-dive seed...\n");

  const frameworks = await prisma.regulatoryFramework.findMany({ select: { id: true, slug: true } });
  const frameworkMap = Object.fromEntries(frameworks.map((f) => [f.slug, f.id]));

  const industries = await prisma.industry.findMany({ select: { id: true, slug: true } });
  const industryMap = Object.fromEntries(industries.map((i) => [i.slug, i.id]));

  // ─── Update System Records ──────────────────────────────
  console.log("📦 Updating system records...");

  const industryIds = ["financial-services", "healthcare", "public-sector", "telecommunications"]
    .filter((s) => industryMap[s]).map((s) => ({ id: industryMap[s] }));

  for (const { assessedAt, assessmentNote, ...profile } of [
    { ...m365CopilotProfile, assessedAt: new Date("2026-04-07"), assessmentNote: m365CopilotProfile.assessmentNote },
    { ...salesforceProfile, assessedAt: new Date("2026-04-07"), assessmentNote: salesforceProfile.assessmentNote },
  ]) {
    const upserted = await prisma.aISystem.upsert({
      where: { slug: profile.slug },
      update: { ...profile, assessedAt, assessmentNote, industries: { set: industryIds } },
      create: { ...profile, assessedAt, assessmentNote, industries: { connect: industryIds } },
    });
    console.log(`  ✅ Updated: ${upserted.vendor} — ${upserted.name}`);
  }

  const allSystems = await prisma.aISystem.findMany({ select: { id: true, slug: true } });
  const systemMap = Object.fromEntries(allSystems.map((s) => [s.slug, s.id]));

  // ─── Add Framework Sections ─────────────────────────────
  console.log("\n📋 Adding platform intelligence sections...");
  let sectionsAdded = 0;
  let statementsAdded = 0;

  for (const sec of platformSections) {
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
    console.log(`  ✅ ${sectionFields.title} (${statements.length} statements)`);
  }

  // ─── Add News ───────────────────────────────────────────
  console.log("\n📰 Adding news entries...");
  let newsAdded = 0;

  for (const entry of platformNews) {
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

  console.log("\n✨ Platform deep-dives complete!");
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
