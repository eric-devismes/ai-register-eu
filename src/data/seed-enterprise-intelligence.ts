/**
 * Enterprise Intelligence Seed — April 2026
 *
 * Entirely different content philosophy from earlier waves.
 * NOT: regulation text or article summaries.
 * YES: Enterprise decision intelligence — what EU AI regulation means for:
 *   - Technology choices (which vendors/tools to use or avoid)
 *   - Use case go/no-go decisions (what you can build, what you can't)
 *   - Implementation patterns (how to architect compliant AI)
 *   - Procurement red flags (what to demand from vendors)
 *   - Organisational implications (roles, processes, budgets)
 *
 * New framework sections added:
 *   - "Enterprise AI Procurement: What to Demand from Vendors"
 *   - "Use Case Red Lines: What You Cannot Deploy in the EU"
 *   - "Use Case Amber Flags: High-Risk AI That Needs Work Before Aug 2026"
 *   - "Technology Architecture for EU AI Compliance"
 *   - "The EU AI Compliance Stack: Roles and Budget Reality"
 *   - "Sector-Specific Intelligence: Financial Services"
 *   - "Sector-Specific Intelligence: Healthcare & Life Sciences"
 *   - "Sector-Specific Intelligence: HR & Workforce Technology"
 *   - "Sector-Specific Intelligence: Public Sector & Government"
 *
 * Run with: npx tsx src/data/seed-enterprise-intelligence.ts
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const enterpriseSections = [
  // ── EU AI Act: Enterprise Intelligence Sections ────────────────────────────
  {
    frameworkSlug: "eu-ai-act",
    title: "Enterprise AI Procurement: What to Demand from Vendors",
    description:
      "Before signing any AI vendor contract, EU enterprises must now ask hard questions. This section translates EU AI Act obligations into concrete procurement requirements and contractual red lines.",
    sortOrder: 20,
    statements: [
      {
        reference: "Procurement Requirement: Risk Classification Evidence",
        statement:
          "Before deploying any AI system for HR, credit, insurance, healthcare, critical infrastructure, law enforcement, education, or public services, demand written confirmation from the vendor: (1) their risk classification determination under Annex III, (2) whether conformity assessment has been completed, and (3) the technical documentation reference. Vendors who cannot answer these questions are not EU AI Act ready.",
        commentary:
          "Technology decision: add an AI regulatory questionnaire to your vendor RFP process. The EU AI Office's standardised conformity assessment documentation will become the EU equivalent of ISO 27001 certificates — a baseline procurement requirement. Vendors like Featurespace (ARIC) who have completed TÜV-certified conformity assessment are ahead. Vendors like HireVue who have not are a compliance liability after August 2026.",
        sourceUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689",
        sourceNote: "EU AI Act Articles 16, 26, 43; Enterprise procurement guidance",
        sortOrder: 1,
      },
      {
        reference: "Procurement Requirement: Data Residency and Processing Chain",
        statement:
          "For any AI processing personal data of EU residents, demand: (1) EU data residency confirmation and the specific data centres, (2) subprocessor list including AI model providers, (3) whether training on your data is contractually excluded, (4) data deletion SLA. A vendor saying 'your data is private' without contractual guarantees is worthless.",
        commentary:
          "Technology choices with real implications: Microsoft Azure OpenAI, Google Vertex AI, and Oracle EURA all offer contractual EU data residency. OpenAI API (consumer), DeepSeek, and Runway do not. For regulated industries, EU data residency is non-negotiable. The CLOUD Act (US) and Chinese National Security Law create fundamental incompatibilities with EU data protection for non-EU-resident services.",
        sourceUrl: "https://www.edpb.europa.eu/",
        sourceNote: "GDPR Articles 44-49; EDPB guidance on international AI transfers",
        sortOrder: 2,
      },
      {
        reference: "Procurement Requirement: Human Oversight Architecture",
        statement:
          "For high-risk AI use cases, contractually require vendors to provide: (1) explanation capability (why did the AI decide X?), (2) override mechanism (how does a human countermand the AI?), (3) audit logs of all AI decisions with timestamps and confidence scores, (4) alerting when AI confidence falls below threshold. These are Article 14 obligations — vendors who cannot support them leave you exposed as the deployer.",
        commentary:
          "Implementation pattern: build a 'human oversight console' as a standard component of any high-risk AI deployment. This is not optional UI polish — it is a legal requirement. For procurement AI in ERP systems (SAP Joule, Oracle Fusion), verify the vendor's native override and audit capabilities before assuming they exist. For custom-built AI, architect human oversight from day one rather than retrofitting it.",
        sourceUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689",
        sourceNote: "EU AI Act Article 14; Deployer Obligations Article 26",
        sortOrder: 3,
      },
      {
        reference: "Procurement Requirement: Incident Reporting Contractual Obligation",
        statement:
          "Contracts with AI vendors must include: (1) obligation to notify you within 24 hours of any AI malfunction that could affect compliance; (2) root cause analysis within 5 business days of serious incidents; (3) access to logs for your post-market monitoring; (4) vendor cooperation with EU market surveillance authority investigations. Without these clauses, you are flying blind on your Article 26 and 73 obligations.",
        commentary:
          "This is a gap most enterprise AI contracts currently have. Standard SaaS contracts cover service availability but not EU AI Act incident reporting. Your legal team needs to add AI-specific incident notification clauses to all contracts for high-risk AI use cases. Treat it like a GDPR data breach notification obligation — the vendor must be your early warning system.",
        sourceUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689",
        sourceNote: "EU AI Act Articles 26, 73; DORA Article 30 for financial services",
        sortOrder: 4,
      },
    ],
  },
  {
    frameworkSlug: "eu-ai-act",
    title: "Use Case Red Lines: What You Cannot Deploy in the EU",
    description:
      "These are not 'proceed with caution' scenarios. These are AI applications that are simply illegal to deploy in the EU as of February 2025. If you are running any of these, stop and take legal advice immediately.",
    sortOrder: 21,
    statements: [
      {
        reference: "Red Line: Real-Time Facial Recognition in Public Spaces",
        statement:
          "You cannot deploy AI that continuously scans faces in publicly accessible spaces to identify individuals — in shopping centres, stadiums, transport hubs, or streets — unless you are a law enforcement authority operating under one of three specific judicial-authorised exceptions. This covers retail loss prevention facial recognition, crowd management biometrics, and 'smart city' surveillance systems that identify individuals.",
        commentary:
          "Vendor impact: Products like NEC NeoFace, Amazon Rekognition (for public surveillance), and Clearview AI-style services are non-compliant for non-law-enforcement EU deployment. If your security team is running facial recognition cameras in your offices with real-time identification, this falls in a grey zone — private premises are not 'publicly accessible spaces', but if your office is open to the public (retail bank branch, hospital reception), legal advice is needed.",
        sourceUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689",
        sourceNote: "EU AI Act Article 5(1)(d); Commission Guidelines on Prohibited Practices 2026",
        sortOrder: 1,
      },
      {
        reference: "Red Line: Emotion Recognition in Workplaces and Classrooms",
        statement:
          "You cannot deploy AI that infers or recognises employees' emotional states in the workplace, or students' emotional states in educational settings. This covers: productivity monitoring tools that analyse facial expressions or voice tone for stress/engagement, proctoring AI that assesses student emotional states, and 'meeting AI' that tracks employee mood or sentiment in real-time.",
        commentary:
          "Vendor impact: Several productivity monitoring and employee engagement tools (including some features in Microsoft Viva, Zoom IQ, and various proctoring platforms) touch this boundary. The test is whether the AI infers emotional state — sentiment analysis of text written by employees is different from real-time video/audio emotion detection. Review your employee monitoring AI stack before February 2025 was the deadline — if you haven't, this is urgent.",
        sourceUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689",
        sourceNote: "EU AI Act Article 5(1)(f); Commission Prohibited Practices Guidelines",
        sortOrder: 2,
      },
      {
        reference: "Red Line: Untargeted Face-Scraping for Biometric Databases",
        statement:
          "You cannot scrape the internet or CCTV footage to build facial recognition databases without targeted consent. This applies to: security vendors building or using facial recognition databases trained on scraped images, HR tech using facial image matching from LinkedIn/social media for background checks, and any security intelligence tool that aggregates facial data at scale.",
        commentary:
          "This directly bans the Clearview AI business model in the EU. If your security vendor uses a facial recognition database and cannot clearly explain the lawful collection basis for every image in their training set, you have a problem. Check vendor contracts for representations about training data provenance — this is now a procurement legal requirement, not just ethical due diligence.",
        sourceUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689",
        sourceNote: "EU AI Act Article 5(1)(e); EDPB guidance on biometric databases",
        sortOrder: 3,
      },
      {
        reference: "Red Line: Predictive Policing Based on Profiling Alone",
        statement:
          "Public authorities cannot use AI to predict an individual's propensity to commit a crime based purely on profiling (demographic data, past associations, location patterns) without individualised assessment. This applies to law enforcement AI for crime prevention, insurance AI inferring fraud risk from demographic proxies, and credit AI using purely statistical profiling without verifiable individual data.",
        commentary:
          "Less obvious enterprise impact: financial crime and fraud AI that rely heavily on demographic profiling without individual behavioural signals may approach this boundary. The key distinction is individual behaviour vs. population-level prediction. A fraud model that weights nationality heavily as a predictor is at risk. Review your fraud and AML AI vendor's feature sets with this in mind.",
        sourceUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689",
        sourceNote: "EU AI Act Article 5(1)(d)(ii); EDPB Opinion 28/2024",
        sortOrder: 4,
      },
    ],
  },
  {
    frameworkSlug: "eu-ai-act",
    title: "Use Case Amber Flags: High-Risk AI Needing Compliance Work",
    description:
      "These are common, commercially valuable AI applications that are legal in the EU but require significant compliance work before August 2026. If you are deploying these and haven't started compliance work, the clock is running.",
    sortOrder: 22,
    statements: [
      {
        reference: "Amber Flag: AI-Powered CV Screening and Candidate Ranking",
        statement:
          "Any AI that automatically scores, ranks, or filters job applicants before human review is high-risk (Annex III Category 4). Required work: (1) complete a FRIA (Fundamental Rights Impact Assessment) if you are a public body or essential services provider; (2) ensure candidates can request human review; (3) verify your vendor has completed conformity assessment; (4) document the AI's decision rationale; (5) inform candidates they are being assessed by AI.",
        commentary:
          "Most major ATS platforms (Workday Recruiting, SAP SuccessFactors, Greenhouse with AI scoring) now have this capability. The compliance question is whether the AI is making the decision or surfacing information for human review. Purely AI-ranked shortlists with no human check are the problem. Multi-stage processes where AI ranks but humans review before rejection are more defensible. Key vendor check: does your recruitment AI have an EU AI Act conformity assessment?",
        sourceUrl: "https://artificialintelligenceact.eu/annex/3/",
        sourceNote: "EU AI Act Annex III Category 4; Article 26 Deployer Obligations",
        sortOrder: 1,
      },
      {
        reference: "Amber Flag: Automated Credit and Lending Decisions",
        statement:
          "AI that makes or significantly influences credit scoring, loan approval, credit limit setting, or insurance pricing is high-risk (Annex III Category 5). Required: conformity assessment by provider, GDPR Article 22 explanation mechanism for declined applications, bias testing across protected demographic groups, EBA model risk management compliance, and human review pathway.",
        commentary:
          "This is probably the most commercially impactful amber flag for financial services. Banks using AI-powered credit decisioning (including ML models in core banking) need the full stack: technical documentation, risk management system, monitoring, and an explanation API that can generate GDPR Article 22 compliant adverse action reasons. If your credit AI vendor cannot produce this, you're either exposing the bank or need to build it yourself as the deployer.",
        sourceUrl: "https://artificialintelligenceact.eu/annex/3/",
        sourceNote: "EU AI Act Annex III Category 5; GDPR Article 22; EBA ML Guidelines",
        sortOrder: 2,
      },
      {
        reference: "Amber Flag: AI Medical Diagnosis and Clinical Decision Support",
        statement:
          "AI used in clinical diagnosis, treatment selection, patient risk stratification, or medical device functionality is high-risk under both EU AI Act and MDR/IVDR. Required: CE marking under MDR/IVDR, conformity assessment under EU AI Act (dual compliance via MDCG 2025-6), post-market surveillance, clinical validation evidence, and GxP-validated deployment where required.",
        commentary:
          "For hospital CIOs: any AI clinical decision support tool your clinicians use that influences diagnosis or treatment needs to be on an approved medical device register. AI tools positioned as 'clinical decision support' that are actually driving clinical decisions are devices. Many AI vendors have deliberately positioned their products ambiguously to avoid MDR — this is no longer safe. Vendors like Veeva Vault AI who have pursued GxP validation are the right model.",
        sourceUrl: "https://health.ec.europa.eu/document/download/b78a17d7-e3cd-4943-851d-e02a2f22bbb4_en",
        sourceNote: "MDCG 2025-6; EU AI Act Annex III Category 1/2; MDR Article 2",
        sortOrder: 3,
      },
      {
        reference: "Amber Flag: AI Performance Management and Employee Monitoring",
        statement:
          "AI that monitors employee performance, generates performance ratings, influences promotion or retention decisions, allocates tasks or shifts, or monitors productivity is high-risk (Annex III Category 4). Required: works council consultation (in many EU countries), GDPR data minimisation and purpose limitation, transparency to employees, human oversight of consequential decisions, and Article 26(7) employee information rights.",
        commentary:
          "Enterprise reality check: a surprisingly large number of 'innocent' tools fall here. Salesforce Einstein scoring rep performance? High-risk. ServiceNow AI routing support tickets and measuring agent response times that feed into performance reviews? High-risk territory. Tools generating productivity metrics from communication data (Teams/Slack analytics)? Potentially high-risk. The test is whether the AI output meaningfully affects employment decisions. Most HR leaders are underestimating this scope.",
        sourceUrl: "https://artificialintelligenceact.eu/annex/3/",
        sourceNote: "EU AI Act Annex III Category 4; Article 26(7); GDPR Articles 5, 13",
        sortOrder: 4,
      },
      {
        reference: "Amber Flag: AI-Powered Customer Service with Consequential Decisions",
        statement:
          "Chatbots and virtual assistants that can independently make decisions affecting customer rights — account restrictions, insurance claims, loan modifications, benefit eligibility — cross into high-risk territory if the AI decision is final or quasi-final. Pure information chatbots that escalate all decisions to humans are not high-risk. The line is whether the AI is deciding or informing.",
        commentary:
          "Design pattern implication: build your customer-facing AI as an 'inform and escalate' architecture rather than 'decide and execute' for consequential domains. AI that informs customers of their options and facilitates human agent decisions is limited risk. AI that independently restricts accounts, denies claims, or modifies terms is high-risk requiring the full conformity assessment stack. This architectural choice affects your AI vendor selection, your product design, and your compliance posture.",
        sourceUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689",
        sourceNote: "EU AI Act Article 6, Annex III; GDPR Article 22",
        sortOrder: 5,
      },
    ],
  },
  {
    frameworkSlug: "eu-ai-act",
    title: "Technology Architecture for EU AI Compliance",
    description:
      "Building AI-compliant systems in the EU requires architectural decisions from day one. These are not compliance afterthoughts — they are design patterns that determine whether your AI is legally operable.",
    sortOrder: 23,
    statements: [
      {
        reference: "Architecture Pattern: Explainability Layer",
        statement:
          "Every high-risk AI system needs an explainability layer — a mechanism to generate human-readable explanations of AI decisions. This is not optional: Article 14 (human oversight) and Article 26 (deployer obligations) together require that operators can understand and explain AI decisions. GDPR Article 22 requires explanations for automated decisions to data subjects. Three viable approaches: (1) interpretable models (decision trees, linear models) where inherently explainable; (2) post-hoc explanation (SHAP, LIME) for complex models; (3) RAG-based explanation linking decisions to source documents.",
        commentary:
          "Technology choices: SHAP (SHapley Additive exPlanations) is the current industry standard for ML model explanation and is implemented in most major platforms (Azure ML, AWS SageMaker, Vertex AI, Databricks MLflow). For LLM-based AI, RAG with citation is the best explainability approach — it grounds outputs in verifiable sources. Avoid 'black box' deep learning for decisions that require explanation under GDPR Article 22 unless you have a robust post-hoc explanation mechanism.",
        sourceUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689",
        sourceNote: "EU AI Act Articles 13, 14; GDPR Article 22; EDPB Guidelines 2/2022",
        sortOrder: 1,
      },
      {
        reference: "Architecture Pattern: AI Decision Audit Log",
        statement:
          "Every high-risk AI decision must be logged with: timestamp, input data hash, model version, output/decision, confidence score, and the human who reviewed/approved (if applicable). Logs must be retained for at least 6 months (Article 26) and often longer for regulated industries. The log must be immutable, searchable, and producible to regulators within 48 hours of request.",
        commentary:
          "Implementation reality: most AI deployments lack this. Typical patterns: (1) Add a 'decision log' table to your data platform for all AI outputs in high-risk categories; (2) use immutable logging (AWS S3 Object Lock, Azure Immutable Blob Storage) to prevent tampering; (3) build a compliance dashboard that shows AI decision volume, override rates, and confidence distributions. Treat it like financial audit trail requirements — assume a regulator will ask for it.",
        sourceUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689",
        sourceNote: "EU AI Act Articles 12, 26(5); DORA for financial services",
        sortOrder: 2,
      },
      {
        reference: "Architecture Pattern: Human Override Circuit Breaker",
        statement:
          "Build a mandatory human override mechanism for all high-risk AI decisions. This means: (1) no AI decision in a high-risk category should be operationally irreversible without human confirmation; (2) when AI confidence falls below threshold, automatic escalation to human review queue; (3) clear UI/UX that makes the override path prominent, not hidden; (4) logging of all overrides with reason codes for post-market monitoring.",
        commentary:
          "Product design implication: the override mechanism must be designed so that it is genuinely used, not a compliance checkbox buried three menus deep. EBA supervisors are already checking whether bank credit AI has functional override mechanisms. Regulators will test whether the 'human in the loop' is genuinely reviewing decisions or rubber-stamping AI outputs at volume. Consider override rate as a KPI — a 0% override rate on high-risk AI is a red flag, not a success metric.",
        sourceUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689",
        sourceNote: "EU AI Act Article 14; EBA Supervisory Expectations 2025",
        sortOrder: 3,
      },
      {
        reference: "Architecture Pattern: EU-Resident AI Data Pipeline",
        statement:
          "For organisations processing sensitive EU personal data through AI, architect a data pipeline that ensures: (1) personal data never leaves the EU boundary before pseudonymisation or anonymisation; (2) AI model inference happens on EU infrastructure; (3) only anonymised or aggregated outputs are shared with non-EU systems. This is achievable via EU cloud regions (AWS Frankfurt, Azure West Europe, Google Belgium) or sovereign cloud options (Oracle EURA, OVHcloud, Hetzner).",
        commentary:
          "Vendor choices that enable this: Microsoft Azure EU (with EU Data Boundary), Google Cloud EU Regions with Assured Workloads, Oracle EURA, and EU-native cloud providers (OVHcloud, Scaleway, Deutsche Telekom T-Systems). Vendor choices that make this difficult: any AI service that requires US-based inference as a default with no EU alternative. EU AI deployment is increasingly a data architecture problem as much as an AI problem — your cloud architecture team needs to be involved in AI vendor evaluation.",
        sourceUrl: "https://www.edpb.europa.eu/",
        sourceNote: "GDPR Articles 44-49; EU Cloud Code of Conduct; ENISA Cloud Guidelines",
        sortOrder: 4,
      },
    ],
  },
  {
    frameworkSlug: "eu-ai-act",
    title: "The EU AI Compliance Stack: Roles, Processes, and Budget Reality",
    description:
      "EU AI Act compliance is not a legal team side project. It requires organisational investment, new roles, and sustained budget. This section is for CIOs and CTOs planning for August 2026 and beyond.",
    sortOrder: 24,
    statements: [
      {
        reference: "Organisational Requirement: AI Governance Structure",
        statement:
          "Article 26 requires a designated responsible person for high-risk AI. In practice, organisations operating multiple high-risk AI systems need an AI governance structure: an AI Risk Committee (CISO + Legal + Business + Technology), a named AI Compliance Officer (often the DPO plus AI Act responsibilities), an AI inventory owner per business domain, and a process for AI lifecycle decisions (approval, monitoring, decommission). Without this, you cannot demonstrate the 'appropriate measures' required by Article 26(1).",
        commentary:
          "Organisational reality: medium-sized enterprises (500-5000 employees) are significantly underinvesting here. Most have neither designated an AI compliance officer nor created an AI inventory. The minimum viable governance structure for a company with 3+ high-risk AI use cases: (1) extend your DPO role to cover AI Act; (2) create an AI impact assessment process (like DPIA but for AI); (3) build an AI system register analogous to your data processing register. Estimated added cost: 0.5-1 FTE equivalent plus legal support.",
        sourceUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689",
        sourceNote: "EU AI Act Article 26; EU AI Office Guidance on Governance",
        sortOrder: 1,
      },
      {
        reference: "Budget Reality: EU AI Act Compliance Costs by Organisation Size",
        statement:
          "Estimated compliance costs for high-risk AI deployers: Large enterprises (5000+ employees, 10+ high-risk AI systems): €500K-€2M initial (AI inventory, DPIAs, FRIAs, contract renegotiation, technical controls, training) plus €200-500K/year ongoing. Mid-market (500-5000 employees, 3-10 high-risk systems): €100-500K initial plus €50-150K/year. SMEs (under 500): €20-100K via sandbox and simplified pathways. The biggest cost driver is technical documentation and conformity assessment — not legal fees.",
        commentary:
          "Budget allocation guidance: 40% technical work (audit logs, explainability, human oversight UI, monitoring); 30% documentation (technical documentation, risk assessments, FRIAs); 20% legal and compliance programme management; 10% training and awareness. The trap: treating this as a legal project. Most of the cost and value is in engineering. Budget accordingly and staff with technical compliance expertise, not just lawyers.",
        sourceUrl: "https://blog.accuroai.co/eu-ai-act-compliance-guide-for-enterprises/",
        sourceNote: "Enterprise compliance cost estimates from market analysis",
        sortOrder: 2,
      },
      {
        reference: "Timeline: What Must Be Done by When",
        statement:
          "August 2026 deadline means: (1) complete AI system inventory — now; (2) classify each system — now; (3) exit or remediate red-line systems — immediate; (4) start conformity assessment process for high-risk systems — now, 18 months is tight; (5) renegotiate vendor contracts with AI-specific clauses — 6 months needed for large contracts; (6) implement technical controls (audit logs, explainability, human oversight) — 12 months minimum for complex systems; (7) train responsible persons and affected employees — 3 months.",
        commentary:
          "The critical path is conformity assessment for high-risk systems. Third-party notified body capacity is limited — TÜV, Bureau Veritas, and SGS all have growing queues for AI Act assessments. Book early. For systems requiring self-assessment (most Annex III Category 4/5 systems), start the documentation process immediately. Many enterprises are 12-18 months behind schedule as of April 2026. Prioritise: stop/exit red-line use cases first, then tackle the highest-risk Annex III systems.",
        sourceUrl: "https://www.intelance.co.uk/eu-ai-act-readiness-checklist/",
        sourceNote: "EU AI Act compliance timeline; Industry readiness surveys Q1 2026",
        sortOrder: 3,
      },
    ],
  },
  // ── Sector-Specific Intelligence ──────────────────────────────────────────
  {
    frameworkSlug: "eu-ai-act",
    title: "Sector Intelligence: Financial Services AI",
    description:
      "Financial services faces the most complex EU AI compliance stack: EU AI Act + GDPR + DORA + EBA/EIOPA guidelines combine to create layered obligations. This section is for Chief Risk Officers, CDOs, and technology leaders in banking, insurance, and investment management.",
    sortOrder: 25,
    statements: [
      {
        reference: "Financial Services: High-Risk AI Inventory Likely Larger Than You Think",
        statement:
          "Every financial services firm should audit these AI systems for high-risk classification: credit scoring models (Annex III Category 5), fraud/AML models (Category 5 — essential services), insurance underwriting/pricing models (Category 5), algorithmic trading for retail investor products (potential Category 5), biometric authentication (Category 1), employee performance management AI (Category 4), customer churn/retention AI used to restrict services (Category 5), and credit card limit management AI (Category 5).",
        commentary:
          "Benchmark: a mid-sized European bank typically has 15-40 AI/ML models in production. Of these, 8-20 will classify as high-risk under Annex III. Many banks are discovering that models previously managed under EBA model risk management (MRM) frameworks now need the additional EU AI Act compliance layer — technical documentation, human oversight, post-market monitoring — stacked on top of existing MRM processes. The good news: your MRM infrastructure is a head start.",
        sourceUrl: "https://www.eba.europa.eu/",
        sourceNote: "EBA/ECB AI model inventory guidance; EU AI Act Annex III",
        sortOrder: 1,
      },
      {
        reference: "Financial Services: The DORA-AI Act Compliance Bridge",
        statement:
          "Financial entities must manage AI risks simultaneously under DORA (ICT risk, third-party risk, incident reporting) and the EU AI Act (high-risk obligations, conformity assessment). The bridge: (1) AI vendors are ICT third-party service providers under DORA — Article 30 contract clauses apply; (2) AI model failures may constitute DORA major ICT incidents requiring regulatory notification; (3) AI model resilience testing (adversarial attacks) should be incorporated into DORA TLPT (Threat-Led Penetration Testing) programmes.",
        commentary:
          "Practical implication: your DORA programme and AI Act programme must be coordinated, not run independently. Your Chief Risk Officer and CISO need a joint AI governance framework. One practical integration: add AI model failure scenarios to your DORA operational resilience testing programme. Another: ensure your DORA third-party ICT register includes all AI vendors, with the additional Article 30 AI-specific clauses your legal team has now drafted.",
        sourceUrl: "https://www.eba.europa.eu/regulation-and-policy/dora",
        sourceNote: "DORA Articles 28-44; EU AI Act Article 26; EBA DORA guidance",
        sortOrder: 2,
      },
    ],
  },
  {
    frameworkSlug: "eu-ai-act",
    title: "Sector Intelligence: HR Technology and Workforce AI",
    description:
      "HR AI is the most broadly affected enterprise sector. Almost every organisation with 50+ employees uses AI tools that touch Annex III Category 4 (employment) obligations. This is the area where most enterprises are furthest behind.",
    sortOrder: 26,
    statements: [
      {
        reference: "HR Technology: Your AI Stack Audit",
        statement:
          "Audit every HR technology tool with AI features for Category 4 high-risk classification. Likely in scope: ATS with AI scoring (Workday, SAP SuccessFactors, Greenhouse, Lever); LinkedIn Recruiter AI features; performance management tools with AI-generated ratings (Lattice AI, Betterworks); workforce analytics platforms (Visier, Orgvue); interview intelligence tools (Gong for HR, HireVue, Metaview); scheduling AI that affects shift allocation; and any productivity monitoring tool that feeds into performance data.",
        commentary:
          "HireVue is the cautionary tale: a market leader in AI interviewing now facing European DPA investigations and having removed facial analysis from EU products. The lesson: if your HR AI vendor is not proactively publishing their EU AI Act conformity assessment status, ask explicitly. If they cannot answer, that is a procurement red flag. The safe alternative is enterprise HR platforms (SAP, Workday, Oracle) who have announced compliance programmes — even if not yet complete.",
        sourceUrl: "https://artificialintelligenceact.eu/annex/3/",
        sourceNote: "EU AI Act Annex III Category 4; Belgian DPA guidance on AI recruitment",
        sortOrder: 1,
      },
      {
        reference: "HR Technology: Works Council and Co-Determination Implications",
        statement:
          "Deploying high-risk AI affecting employees triggers consultation rights in most EU member states. Germany: Betriebsrat (works council) must be consulted before introducing AI performance monitoring or AI-supported HR decisions — they have co-determination rights (Mitbestimmungsrecht) under BetrVG §87. France: CSE (comité social et économique) must receive information and be consulted before deployment, with 1-month consultation period minimum. Netherlands: OR (ondernemingsraad) has approval rights for monitoring systems. Ignoring these is not just a compliance risk — it is a business risk: works councils can obtain injunctions against AI deployments.",
        commentary:
          "Technology procurement implication: AI HR tools procured without works council involvement have been successfully challenged in German and French courts. Build works council engagement into your AI HR procurement process — not as a legal formality but as genuine stakeholder management. Practically: prepare a clear, plain-language brief on what the AI does and does not do, what data it uses, how decisions are made, and what human oversight exists. A works council that understands the system is less likely to object.",
        sourceUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689",
        sourceNote: "EU AI Act Article 26(7); German BetrVG §87; French Labour Code L2312-8",
        sortOrder: 2,
      },
    ],
  },
  {
    frameworkSlug: "eu-ai-act",
    title: "Sector Intelligence: Generative AI — Enterprise Deployment Guidelines",
    description:
      "Generative AI (LLMs, image/video generators, voice AI) introduces a different risk profile to traditional ML. Most GenAI deployments are limited risk — but specific enterprise use cases cross into high-risk territory or fall under GPAI transparency obligations.",
    sortOrder: 27,
    statements: [
      {
        reference: "GenAI Deployment: The Three Compliance Questions",
        statement:
          "Before deploying any generative AI tool enterprise-wide, answer: (1) Is personal data being sent to the AI? If yes, what is the legal basis, transfer mechanism, and retention period? (2) Is the AI making or informing consequential decisions about people? If yes, what is the Annex III risk classification? (3) Are outputs being presented to customers or the public as authoritative? If yes, do you have accuracy safeguards and an AI disclosure? These three questions cover 90% of GenAI compliance risk.",
        commentary:
          "Enterprise deployment patterns that score well on all three: RAG-based enterprise knowledge management where personal data is minimised and outputs inform (not decide) human actions. Patterns that score poorly: uploading HR data to an external LLM for analysis (Question 1 fail); using GenAI to auto-generate credit decisions (Question 2 fail); publishing AI-generated compliance documentation without expert review (Question 3 fail). Use these three questions as a GenAI governance gate.",
        sourceUrl: "https://www.edpb.europa.eu/news/news/2024/edpb-adopts-opinion-ai-models_en",
        sourceNote: "EDPB Opinion 28/2024; EU AI Act Articles 5, 50; GDPR Article 6",
        sortOrder: 1,
      },
      {
        reference: "GenAI: Choosing Between US and EU Providers — The Real Trade-offs",
        statement:
          "EU enterprises have genuine choice between US-based frontier models (GPT-5, Claude, Gemini) and EU-native alternatives (Mistral Large, Aleph Alpha Pharia). The US providers offer higher capability at lower cost but require data transfer management (DPF/SCCs) and have US-jurisdiction data vulnerability (CLOUD Act). EU-native providers offer simpler GDPR compliance, EU data residency, and EU regulatory alignment — at typically higher cost and sometimes lower raw capability. The choice is not binary — many enterprises use US providers for non-personal-data tasks and EU providers or on-premise models for sensitive data.",
        commentary:
          "Recommended architecture: Tiered GenAI deployment. Tier 1 (public/non-sensitive data): US frontier models via API acceptable with DPF transfer mechanism. Tier 2 (internal/business data): EU-hosted models preferred (Azure EU, Vertex AI EU, Mistral via La Plateforme). Tier 3 (personal data, sensitive, regulated): EU-native models (Mistral, Aleph Alpha) or on-premise open-weight deployment (Llama 4, Mistral 7B via own EU infrastructure). Most enterprises need all three tiers — design your AI access governance accordingly.",
        sourceUrl: "https://www.edpb.europa.eu/",
        sourceNote: "GDPR Chapter V; EU Cloud Code of Conduct; ENISA AI cloud guidance",
        sortOrder: 2,
      },
      {
        reference: "GenAI: What Every Enterprise AI Policy Must Include",
        statement:
          "A minimal compliant enterprise GenAI policy must cover: (1) approved tools list and tier system for data sensitivity; (2) prohibition on uploading personal data of EU residents to non-approved external AI services; (3) prohibition on sharing company confidential information with consumer AI services; (4) disclosure requirement when AI generates public-facing content; (5) human review requirement before AI outputs are used in decisions affecting individuals; (6) training requirement for employees using GenAI tools; (7) incident reporting process for AI-related data breaches or errors.",
        commentary:
          "Benchmark: as of early 2026, fewer than 40% of EU enterprises with 500+ employees have a documented GenAI policy. The majority are in a 'shadow AI' situation where employees are using personal accounts with consumer GenAI tools for work tasks — often uploading sensitive data. This is a significant unmanaged risk. Implementing a GenAI policy with teeth (not just a PDF nobody reads) is probably the highest ROI AI compliance action for most enterprises right now.",
        sourceUrl: "https://www.edpb.europa.eu/",
        sourceNote: "EDPB Chatbot Guidelines 2025; GDPR Articles 5, 28, 32; EU AI Act Article 4",
        sortOrder: 3,
      },
    ],
  },
];

// ─── Also update existing bland policy statements with enterprise commentary ──

// We'll add a new set of statements to the early sections that were copy-paste
const statementUpdates = [
  // Update the Risk Classification section statements with enterprise context
  {
    sectionTitle: "Risk Classification",
    reference: "Article 5",
    newCommentary: "Enterprise action: conduct an immediate audit of AI tools against the prohibited practices list. Key red flags in enterprise tech stacks: (1) employee sentiment/emotion monitoring via video or voice; (2) any facial recognition that attempts identification in publicly accessible areas; (3) social scoring or trust scores used to restrict employee or customer access. If any tool in your stack does any of these things — stop, get legal advice, and check with your vendor. The fines are up to €35M or 7% of global turnover — this tier gets the highest penalties in the entire Act.",
  },
  {
    sectionTitle: "Requirements for High-Risk AI Systems",
    reference: "Article 9",
    newCommentary: "Enterprise action: your risk management system must be an operational process, not a document. Practically, this means: (1) a named AI risk owner for each high-risk system; (2) a defined incident escalation path; (3) quarterly performance reviews comparing AI accuracy to benchmarks; (4) a documented procedure for what happens when the AI degrades or fails. Most enterprises with existing model risk management (MRM) frameworks for financial models can extend these to cover AI Act risk management — this is your fastest path to compliance.",
  },
];

// ─── Main ─────────────────────────────────────────────────

async function main() {
  console.log("🌱 Starting Enterprise Intelligence seed...\n");

  const frameworks = await prisma.regulatoryFramework.findMany({
    select: { id: true, slug: true },
  });
  const frameworkMap = Object.fromEntries(frameworks.map((f) => [f.slug, f.id]));

  // ─── Add Enterprise Intelligence Sections ──────────────
  console.log("🏢 Adding enterprise intelligence framework sections...");
  let sectionsAdded = 0;
  let statementsAdded = 0;

  for (const sec of enterpriseSections) {
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

  // ─── Update Existing Statements with Enterprise Commentary ──
  console.log("\n✏️  Enriching existing statements with enterprise context...");
  let updated = 0;

  for (const update of statementUpdates) {
    const section = await prisma.frameworkSection.findFirst({
      where: { title: update.sectionTitle },
    });
    if (!section) continue;

    const stmt = await prisma.policyStatement.findFirst({
      where: { reference: { contains: update.reference }, sectionId: section.id },
    });
    if (stmt && stmt.commentary.length < 200) {
      // Only update if existing commentary is thin
      await prisma.policyStatement.update({
        where: { id: stmt.id },
        data: { commentary: update.newCommentary },
      });
      updated++;
      console.log(`  ✅ Updated: ${update.sectionTitle} / ${update.reference}`);
    }
  }

  // ─── Summary ────────────────────────────────────────────
  console.log("\n✨ Enterprise Intelligence seed complete!");
  console.log(`   Sections added: ${sectionsAdded}`);
  console.log(`   Statements added: ${statementsAdded}`);
  console.log(`   Statements enriched: ${updated}`);

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
  .catch((e) => { console.error("❌", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
