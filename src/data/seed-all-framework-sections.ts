/**
 * Seed Script — Populate ALL regulatory frameworks with structured sections & policy statements.
 *
 * Run with: npx tsx src/data/seed-all-framework-sections.ts
 * Safe to run multiple times (deletes existing sections first, then recreates).
 *
 * Covers: GDPR, DORA, EBA/EIOPA Guidelines, MDR/IVDR, National AI Strategies
 * (EU AI Act was seeded separately in seed-framework-meta.ts)
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// ─── Types ───────────────────────────────────────────────

interface Statement {
  reference: string;
  statement: string;
  commentary: string;
  sortOrder: number;
}

interface Section {
  title: string;
  description: string;
  sortOrder: number;
  statements: Statement[];
}

interface FrameworkSeed {
  slug: string;
  sections: Section[];
}

// ─── GDPR ────────────────────────────────────────────────

const gdpr: FrameworkSeed = {
  slug: "gdpr",
  sections: [
    {
      title: "Core Data Protection Principles",
      description: "Article 5 establishes the fundamental principles that govern all personal data processing. These principles underpin every other GDPR requirement.",
      sortOrder: 1,
      statements: [
        { reference: "Article 5(1)(a)", statement: "Personal data must be processed lawfully, fairly, and in a transparent manner in relation to the data subject.", commentary: "Every AI system processing personal data needs a documented lawful basis, must not be deceptive, and must inform users clearly about how their data is used. For AI, transparency is particularly challenging \u2014 you must explain not just that data is processed, but how automated decisions are made.", sortOrder: 1 },
        { reference: "Article 5(1)(b)", statement: "Personal data must be collected for specified, explicit, and legitimate purposes and not further processed in a manner incompatible with those purposes.", commentary: "Data collected for one purpose (e.g., customer service) cannot be repurposed for AI model training without a compatible legal basis. This is a common compliance gap \u2014 organisations often train AI models on data originally collected for a different purpose.", sortOrder: 2 },
        { reference: "Article 5(1)(c)", statement: "Personal data must be adequate, relevant, and limited to what is necessary in relation to the purposes for which they are processed (data minimisation).", commentary: "AI systems often benefit from more data, but GDPR requires the opposite: use the minimum data necessary. Organisations must justify every data field used in their AI models and remove unnecessary personal data through anonymisation or pseudonymisation.", sortOrder: 3 },
        { reference: "Article 5(2)", statement: "The controller shall be responsible for, and be able to demonstrate compliance with, all data protection principles (accountability).", commentary: "You must document everything: why you process data, how your AI works, what safeguards exist, and how you ensure compliance. In an audit, 'we think we comply' is not enough \u2014 you need evidence.", sortOrder: 4 },
      ],
    },
    {
      title: "Data Subject Rights & Automated Decisions",
      description: "Articles 15-22 give individuals specific rights regarding their personal data, with Article 22 providing critical protections against purely automated decision-making.",
      sortOrder: 2,
      statements: [
        { reference: "Article 15", statement: "Data subjects have the right to obtain confirmation of whether personal data concerning them is being processed, and access to that data, including the purposes, categories, recipients, and retention period.", commentary: "If a customer asks 'what data do you have on me and how does your AI use it?', you must provide a comprehensive answer. This includes explaining the logic involved in any automated processing and its significance.", sortOrder: 1 },
        { reference: "Article 17", statement: "The data subject shall have the right to obtain erasure of personal data without undue delay where the data is no longer necessary, consent is withdrawn, or processing is unlawful (right to be forgotten).", commentary: "If a customer requests erasure, you must delete their data from AI training datasets, inference pipelines, and any derived models. This is technically complex for ML models \u2014 you may need to retrain models after erasure requests.", sortOrder: 2 },
        { reference: "Article 20", statement: "The data subject shall have the right to receive personal data in a structured, commonly used, and machine-readable format, and to transmit it to another controller (data portability).", commentary: "Customers can request all their data in a portable format and take it to a competitor. Your AI system must support structured data export. This applies to data the customer provided directly and data generated through their use of the service.", sortOrder: 3 },
        { reference: "Article 22(1)", statement: "The data subject shall have the right not to be subject to a decision based solely on automated processing, including profiling, which produces legal effects or similarly significantly affects them.", commentary: "This is the most important GDPR provision for AI. If your AI system makes decisions that significantly affect people (credit scoring, hiring, insurance pricing), you cannot rely solely on the AI output. A human must meaningfully review the decision. 'Rubber stamping' does not constitute meaningful human intervention.", sortOrder: 4 },
        { reference: "Article 22(3)", statement: "Where automated decisions are permitted (by contract or consent), the controller must implement suitable safeguards, including the right to obtain human intervention, to express a point of view, and to contest the decision.", commentary: "Even when automated decisions are allowed, you must provide: (1) a way for the person to request human review, (2) a mechanism to express their view, and (3) a process to challenge the decision. Build these into your product from day one.", sortOrder: 5 },
      ],
    },
    {
      title: "Privacy by Design & Data Processing Agreements",
      description: "Article 25 requires privacy to be built into systems from the start. Article 28 governs the relationship between data controllers and processors, including AI vendors.",
      sortOrder: 3,
      statements: [
        { reference: "Article 25(1)", statement: "The controller shall implement appropriate technical and organisational measures, such as pseudonymisation, designed to implement data protection principles effectively, both at the time of determining the means for processing and at the time of the processing itself.", commentary: "Privacy must be embedded into your AI system design, not bolted on afterwards. This means pseudonymisation, encryption, access controls, and audit logging must be part of the architecture from the start. Retrofitting compliance is far more expensive than building it in.", sortOrder: 1 },
        { reference: "Article 28(1)", statement: "The controller shall use only processors providing sufficient guarantees to implement appropriate technical and organisational measures so that processing meets GDPR requirements.", commentary: "When you engage an AI vendor, you are a controller and they are your processor. You must verify their compliance before signing. This means reviewing their DPA, security certifications, data handling practices, and subprocessor chain \u2014 exactly what AI Compass EU assessments evaluate.", sortOrder: 2 },
        { reference: "Article 28(3)", statement: "Processing by a processor shall be governed by a contract that sets out the subject-matter, duration, nature, purpose, type of data, categories of data subjects, and obligations and rights of the controller.", commentary: "Your AI vendor contract must include a GDPR-compliant DPA covering all mandatory clauses. The processor must: act only on documented instructions, ensure staff confidentiality, implement security measures, assist with DPIAs, allow audits, and delete/return data on termination. Non-compliance can cost up to 2% of global turnover.", sortOrder: 3 },
      ],
    },
    {
      title: "Data Protection Impact Assessments",
      description: "Article 35 requires organisations to assess the impact of high-risk data processing operations before they begin, particularly relevant for AI systems.",
      sortOrder: 4,
      statements: [
        { reference: "Article 35(1)", statement: "Where a type of processing, in particular using new technologies, is likely to result in a high risk to the rights and freedoms of natural persons, the controller shall carry out an assessment of the impact of the envisaged processing operations.", commentary: "Almost every AI system processing personal data will require a DPIA. 'New technologies' explicitly includes AI/ML. The DPIA must be completed before deployment, not after. It is a living document that must be updated when processing changes.", sortOrder: 1 },
        { reference: "Article 35(3)(a)", statement: "A DPIA is always required for systematic and extensive evaluation of personal aspects based on automated processing, including profiling, on which decisions are based that produce legal effects or similarly significantly affect the natural person.", commentary: "If your AI profiles individuals or makes consequential decisions, a DPIA is mandatory \u2014 no exceptions. This includes credit scoring, automated hiring, insurance risk assessment, and personalised pricing. Document: what data you use, what risks it creates, and how those risks are mitigated.", sortOrder: 2 },
      ],
    },
    {
      title: "International Transfers & Breach Notification",
      description: "Chapter V governs cross-border data transfers. Articles 33-34 set strict timelines for breach notification.",
      sortOrder: 5,
      statements: [
        { reference: "Article 44", statement: "Any transfer of personal data to a third country or international organisation shall take place only if the conditions in Chapter V are complied with, ensuring that the level of protection is not undermined.", commentary: "If your AI vendor processes data outside the EU (common with US cloud providers), you need a valid transfer mechanism: adequacy decision, SCCs with a Transfer Impact Assessment, or Binding Corporate Rules. Post-Schrems II, this is heavily scrutinised.", sortOrder: 1 },
        { reference: "Article 46(2)(c)", statement: "Standard Contractual Clauses adopted by the Commission provide appropriate safeguards for international data transfers.", commentary: "SCCs are the most common transfer mechanism for AI vendors. But signing SCCs is not enough \u2014 you must also conduct a Transfer Impact Assessment (TIA) to verify that the recipient country's laws do not undermine the protections. For US transfers, assess the impact of US surveillance laws on your data.", sortOrder: 2 },
        { reference: "Article 33", statement: "The controller shall notify the personal data breach to the supervisory authority within 72 hours of becoming aware of it, unless the breach is unlikely to result in a risk to rights and freedoms.", commentary: "You have 72 hours from discovery to report a breach. This means your AI vendor must notify you immediately upon detecting a breach so you can meet the deadline. Ensure your DPA includes a vendor notification timeline (ideally 24-48 hours) that gives you time to assess and report.", sortOrder: 3 },
      ],
    },
  ],
};

// ─── DORA ────────────────────────────────────────────────

const dora: FrameworkSeed = {
  slug: "dora",
  sections: [
    {
      title: "ICT Risk Management Framework",
      description: "Articles 5-16 require financial entities to establish a comprehensive ICT risk management framework with board-level governance, covering identification, protection, detection, response, and recovery.",
      sortOrder: 1,
      statements: [
        { reference: "Article 5", statement: "The management body shall define, approve, oversee, and be responsible for the implementation of all arrangements related to the ICT risk management framework. Members must maintain sufficient knowledge and skills to understand ICT risk.", commentary: "ICT risk is a board-level responsibility, not just an IT issue. Board members must personally understand the ICT risks their AI systems introduce. This means regular training and briefings, not delegation to the CTO. Budget allocation for digital resilience must be approved at board level.", sortOrder: 1 },
        { reference: "Article 6", statement: "Financial entities shall have a sound, comprehensive, and well-documented ICT risk management framework that includes strategies, policies, procedures, protocols, and tools necessary to protect all information and ICT assets.", commentary: "This is not optional guidance \u2014 it is a mandatory, documented framework. It must include a digital operational resilience strategy, information security objectives, ICT architecture documentation, incident detection mechanisms, and testing plans. The framework must be reviewed at least annually.", sortOrder: 2 },
        { reference: "Article 8", statement: "Financial entities shall identify, classify, and adequately document all ICT-supported business functions, information assets, and ICT assets, including those that support critical or important functions.", commentary: "You must maintain a complete inventory of all AI/ICT systems, map their dependencies, and identify which ones support critical business functions. This includes third-party AI services. If you cannot map your AI dependencies, you cannot manage the risk.", sortOrder: 3 },
        { reference: "Article 11", statement: "Financial entities shall put in place ICT business continuity policies and ICT response and recovery plans, including backup policies and restoration procedures with estimated recovery times.", commentary: "What happens if your AI vendor goes down? You need documented backup plans, tested failover procedures, and defined RPO/RTO targets. For AI systems supporting critical functions (trading, payments, fraud detection), recovery must be rapid and tested regularly.", sortOrder: 4 },
      ],
    },
    {
      title: "ICT Incident Reporting",
      description: "Articles 17-23 establish mandatory processes for detecting, classifying, managing, and reporting ICT-related incidents to competent authorities.",
      sortOrder: 2,
      statements: [
        { reference: "Article 17", statement: "Financial entities shall define, establish, and implement an ICT-related incident management process to detect, manage, and notify ICT-related incidents.", commentary: "You need a formal incident management process specifically for ICT incidents, separate from general operational incidents. This must include early warning indicators, escalation procedures, and designated response teams. AI system failures (hallucinations, bias incidents, data leaks) must be captured by this process.", sortOrder: 1 },
        { reference: "Article 18", statement: "ICT-related incidents shall be classified based on: criticality of services affected, number of affected clients, duration and service downtime, geographical spread, data losses, and economic impact.", commentary: "Not all incidents are equal. Use these seven criteria to classify severity consistently. An AI system producing biased outputs affecting thousands of customers is a major incident. An AI chatbot being slow for five minutes is not. Your classification framework must be pre-defined, not improvised during a crisis.", sortOrder: 2 },
        { reference: "Article 19", statement: "Financial entities shall report major ICT-related incidents to the relevant competent authority, including initial notification, intermediate reports, and a final report with root cause analysis.", commentary: "Major incidents require a structured reporting sequence to your national regulator. The initial notification must be filed rapidly. Intermediate reports provide updates. The final report must include root cause analysis and remediation steps. Ensure your AI vendors can provide incident data quickly enough for you to meet reporting deadlines.", sortOrder: 3 },
      ],
    },
    {
      title: "Digital Operational Resilience Testing",
      description: "Articles 24-27 require regular testing of ICT systems, including threat-led penetration testing (TLPT) for significant financial entities.",
      sortOrder: 3,
      statements: [
        { reference: "Article 24", statement: "Financial entities shall establish, maintain, and review a sound and comprehensive digital operational resilience testing programme as an integral part of the ICT risk management framework.", commentary: "Testing is not optional. Your programme must include annual vulnerability assessments, scenario-based testing, and source code reviews. AI systems must be included in scope \u2014 test for adversarial inputs, model manipulation, and data poisoning, not just traditional IT vulnerabilities.", sortOrder: 1 },
        { reference: "Article 26", statement: "Financial entities identified as significant shall carry out threat-led penetration testing (TLPT) at least every three years, covering critical or important functions on live production systems.", commentary: "TLPT is advanced red teaming on your production systems. It must be performed by certified, independent testers (internal testers can participate but externals must be engaged). AI systems supporting critical functions (fraud detection, credit decisions) must be in scope. This is expensive but mandatory for significant entities.", sortOrder: 2 },
      ],
    },
    {
      title: "ICT Third-Party Risk Management",
      description: "Articles 28-44 govern how financial entities manage risks from ICT service providers, including AI vendors. Critical providers are subject to direct EU oversight.",
      sortOrder: 4,
      statements: [
        { reference: "Article 28", statement: "Financial entities shall manage ICT third-party risk as an integral component of the ICT risk management framework, maintaining a register of all contractual arrangements with ICT third-party service providers.", commentary: "Every AI vendor contract must be documented in your ICT third-party register. You must distinguish which vendors support critical functions and assess concentration risk (over-dependence on a single provider). If your primary AI vendor fails, do you have alternatives?", sortOrder: 1 },
        { reference: "Article 30", statement: "Contracts with ICT providers must include: clear service descriptions, data processing locations, service level descriptions, audit and inspection rights, termination rights, and exit strategies ensuring no disruption to compliance.", commentary: "Your AI vendor contracts must include every provision listed in Article 30. Pay special attention to: data processing locations (EU residency), audit rights (you must be able to inspect the vendor), and exit strategies (can you migrate away without business disruption?). Non-compliant contracts must be remediated.", sortOrder: 2 },
        { reference: "Articles 31-44", statement: "The European Supervisory Authorities may designate critical ICT third-party service providers and establish a direct oversight framework with a Lead Overseer who can conduct inspections and issue recommendations.", commentary: "Major AI/cloud providers (Microsoft, AWS, Google) may be designated as critical ICT providers under DORA. If your AI vendor is designated, they face direct EU oversight. This is positive for compliance but means your vendor relationship is subject to regulatory scrutiny. Ensure your vendor can demonstrate compliance.", sortOrder: 3 },
      ],
    },
    {
      title: "Information Sharing",
      description: "Article 45 enables financial entities to exchange cyber threat intelligence within trusted communities.",
      sortOrder: 5,
      statements: [
        { reference: "Article 45", statement: "Financial entities may exchange cyber threat information and intelligence among themselves within trusted communities, provided that such sharing complies with data protection rules and protects business confidentiality.", commentary: "You are encouraged (not required) to participate in threat intelligence sharing about AI-related risks. This could include sharing information about adversarial attacks on AI models, prompt injection vulnerabilities, or AI-specific fraud patterns. Join relevant ISACs and industry groups to stay informed.", sortOrder: 1 },
      ],
    },
  ],
};

// ─── EBA/EIOPA Guidelines ────────────────────────────────

const ebaEiopa: FrameworkSeed = {
  slug: "eba-eiopa-guidelines",
  sections: [
    {
      title: "Model Risk Management",
      description: "AI/ML models used in financial services must be subject to the same rigorous risk management framework as traditional statistical models, with additional controls for complexity.",
      sortOrder: 1,
      statements: [
        { reference: "EBA Report on ML for IRB", statement: "Institutions using ML models for regulatory capital purposes must ensure all relevant stakeholders have appropriate knowledge of the model's functioning, and the model is subject to the same model risk management framework as traditional models.", commentary: "If you use AI for credit risk, you cannot treat it as a black box. Model validators, auditors, and senior management must understand how the model works. The same validation, monitoring, and periodic review standards that apply to traditional scorecards apply to ML models \u2014 plus additional requirements for complexity.", sortOrder: 1 },
        { reference: "EBA Follow-up Report", statement: "Model risk must be assessed as part of the supervisory review (SREP), including assessment of IRB model deficiency as part of credit risk evaluation.", commentary: "Your AI models will be reviewed by supervisors during the SREP process. If models are deficient, this directly impacts your capital requirements. Document model limitations, known biases, and compensating controls. Supervisors will challenge model complexity if explainability is insufficient.", sortOrder: 2 },
        { reference: "EBA/EIOPA Joint", statement: "Documentation must be comprehensive enough for independent third parties to understand the model's design, limitations, and performance characteristics.", commentary: "A model that only its creator can understand is not acceptable in financial services. Documentation must enable an independent validator or auditor to reproduce, challenge, and assess the model. This includes training data descriptions, feature engineering, hyperparameter choices, and performance metrics.", sortOrder: 3 },
      ],
    },
    {
      title: "Data Governance",
      description: "Training and operational data for AI systems must meet strict quality, representativeness, and documentation standards.",
      sortOrder: 2,
      statements: [
        { reference: "EBA/EIOPA Data Guidelines", statement: "AI training data must be complete, accurate, representative, and free of bias. Data governance policies must address data quality, lineage, and preprocessing steps.", commentary: "Financial AI models are only as good as their data. You must document: where training data comes from (lineage), how it was cleaned and transformed (preprocessing), whether it is representative of the population you serve, and what biases may exist. Historical data reflecting past discrimination will produce discriminatory models.", sortOrder: 1 },
        { reference: "EBA/EIOPA Data Guidelines", statement: "Special attention must be paid to bias in historical data that could lead to discriminatory outcomes in credit, insurance, or employment decisions.", commentary: "If your historical lending data shows lower approval rates for certain demographics, training an AI on that data will perpetuate the discrimination. You must actively test for and mitigate such biases. This may require synthetic data augmentation, fairness constraints, or post-processing adjustments.", sortOrder: 2 },
      ],
    },
    {
      title: "Explainability & Transparency",
      description: "AI outputs must be explainable at two levels: technically for supervisors, and plainly for consumers affected by AI-driven decisions.",
      sortOrder: 3,
      statements: [
        { reference: "EBA/EIOPA Explainability", statement: "Outputs must be explainable at two levels: to supervisory authorities (technical, global explanation of model behaviour) and to clients/consumers (clear, comprehensible explanations of individual decisions).", commentary: "You need two explanation layers. For regulators: technical model documentation, feature importance, performance metrics. For customers: plain-language reasons why their loan was denied, their premium was increased, or their claim was flagged. 'The AI decided' is never an acceptable explanation to a consumer.", sortOrder: 1 },
        { reference: "EBA/EIOPA Explainability", statement: "Black-box models require additional compensating controls and monitoring. Regular assessment must determine whether model complexity is justified relative to the explainability trade-off.", commentary: "Using a deep learning model instead of a simpler, explainable model requires justification. Can you demonstrate that the complex model provides significantly better outcomes? If a logistic regression achieves 95% of the performance of a neural network but is fully explainable, regulators will question why you chose opacity.", sortOrder: 2 },
      ],
    },
    {
      title: "Consumer Protection",
      description: "AI must not lead to unfair, discriminatory, or exclusionary outcomes. Clear redress mechanisms must be available.",
      sortOrder: 4,
      statements: [
        { reference: "EIOPA AI Opinion", statement: "AI must not lead to unfair, discriminatory, or exclusionary outcomes for consumers. Insurers must adopt a client-centric approach with ethical corporate culture, staff training, and bias reduction policies.", commentary: "Consumer fairness is not just a legal requirement \u2014 it is a business imperative. If your AI system systematically disadvantages certain customer groups, you face regulatory action, reputational damage, and litigation. Build fairness testing into your model development lifecycle, not just as a post-deployment check.", sortOrder: 1 },
        { reference: "EIOPA AI Opinion", statement: "Clear redress mechanisms must be available when AI-driven decisions adversely affect consumers, including the right to challenge decisions and receive human review.", commentary: "Every consumer affected by an AI decision must have a clear path to challenge it. This means: a complaints process, access to human reviewers who can override AI decisions, and transparent communication about what information influenced the decision. The redress process itself must not be automated.", sortOrder: 2 },
      ],
    },
    {
      title: "Governance & Oversight",
      description: "Board-level accountability for AI strategy, with risk-based governance proportionate to the complexity and impact of AI systems.",
      sortOrder: 5,
      statements: [
        { reference: "EIOPA AI Opinion", statement: "Responsible AI use requires risk-based and proportionate governance and risk management systems, covering fairness, ethics, data governance, documentation, transparency, human oversight, accuracy, robustness, and cybersecurity.", commentary: "AI governance is not a single checklist \u2014 it is a comprehensive management system. The level of governance must be proportionate to the risk: a chatbot answering FAQs needs lighter governance than an AI system approving mortgage applications. But even low-risk AI needs basic documentation and oversight.", sortOrder: 1 },
        { reference: "EIOPA/EBA/ESMA Joint", statement: "The EBA, ESMA, and EIOPA serve as enforcement authorities for AI Act obligations in the financial sector. Board-level accountability for AI strategy and risk appetite is required.", commentary: "The European Supervisory Authorities will directly enforce AI Act requirements for financial firms. Your board must have a documented AI strategy and defined risk appetite. AI is not just an IT project \u2014 it requires the same governance as any other material business risk.", sortOrder: 2 },
      ],
    },
  ],
};

// ─── MDR/IVDR ────────────────────────────────────────────

const mdrIvdr: FrameworkSeed = {
  slug: "mdr-ivdr",
  sections: [
    {
      title: "Software as Medical Device (SaMD) Classification",
      description: "MDR Rule 11 and IVDR Annex VIII define how AI-powered software is classified based on the severity of decisions it supports.",
      sortOrder: 1,
      statements: [
        { reference: "MDR Rule 11 (Annex VIII)", statement: "Software intended to provide information used for diagnosis or therapeutic decisions is classified based on the severity of potential harm: Class IIa (non-serious conditions), Class IIb (serious deterioration), or Class III (death or irreversible harm).", commentary: "If your AI software influences clinical decisions, it is a medical device and must be classified. A radiology AI that flags potential tumours is at least Class IIb. An AI diagnosing heart attacks from ECGs is Class III. Classification determines the level of regulatory scrutiny, including whether you need a Notified Body assessment.", sortOrder: 1 },
        { reference: "IVDR Annex VIII", statement: "In vitro diagnostic software using AI is classified under a four-tier system (A, B, C, D). AI-based IVD software typically falls into Class C or D. Companion diagnostics are elevated to Class C minimum.", commentary: "AI software used for laboratory diagnostics faces the IVDR classification system. Higher-risk diagnostics (companion diagnostics, genetic testing) require more rigorous conformity assessment. If your AI informs treatment selection, expect Class C or D classification with full Notified Body involvement.", sortOrder: 2 },
        { reference: "MDR/IVDR General", statement: "Classification depends on the manufacturer's intended purpose, not the software's technical capability. A technically identical AI system can be classified differently depending on its stated use.", commentary: "How you position and market your AI matters enormously. If you claim your software 'assists diagnosis', it is a medical device. If you claim it 'provides general health information', it may not be. But regulators will look at actual use, not just marketing claims. Be precise and honest in your intended purpose statement.", sortOrder: 3 },
      ],
    },
    {
      title: "Clinical Evaluation & Evidence",
      description: "AI-based medical devices must demonstrate clinical benefit through systematic evidence collection, not just technical performance metrics.",
      sortOrder: 2,
      statements: [
        { reference: "MDR Article 61", statement: "A clinical evaluation must be performed through systematic literature review, analysis of clinical data from studies or real-world evidence, and demonstration that AI outputs lead to measurable clinical benefit.", commentary: "Technical accuracy (sensitivity, specificity) is necessary but not sufficient. You must show that your AI actually improves patient outcomes compared to current practice. This requires prospective clinical studies or well-designed retrospective analyses. Regulators will not accept algorithmic benchmarks alone.", sortOrder: 1 },
        { reference: "MDR Clinical Evidence", statement: "For AI/ML-based SaMD, validation must demonstrate that outputs and the target clinical condition are scientifically associated, and that clinical accuracy translates to clinical benefit.", commentary: "An AI that detects patterns with 99% accuracy is meaningless if those patterns do not reliably indicate the target disease. You must demonstrate the clinical significance of your AI's outputs, including positive and negative predictive values in the intended use population.", sortOrder: 2 },
      ],
    },
    {
      title: "Post-Market Surveillance",
      description: "Active, ongoing monitoring of AI medical devices after they reach the market, with specific attention to model drift and performance degradation.",
      sortOrder: 3,
      statements: [
        { reference: "MDR Articles 83-86", statement: "Active post-market surveillance (PMS) processes must be established before product launch. Class IIb and III devices require annual Periodic Safety Update Reports (PSURs) and post-market clinical follow-up (PMCF).", commentary: "PMS for AI medical devices is not just collecting complaint reports. You must actively monitor: model performance over time, data distribution shifts (is the patient population changing?), false positive/negative rates in real-world use, and cybersecurity threats. A common audit finding is missing PMS at product launch.", sortOrder: 1 },
        { reference: "MDR PMS + AI", statement: "For AI systems: monitoring must specifically address model drift, data distribution shifts, and performance degradation over time. PMS data must feed back into risk management and design updates.", commentary: "AI models degrade. A model trained on 2023 data may perform poorly on 2026 patients if disease patterns, demographics, or clinical practices have changed. You must have automated monitoring for drift detection and a defined process for model retraining and revalidation when performance degrades.", sortOrder: 2 },
      ],
    },
    {
      title: "Quality Management System & Standards",
      description: "Medical device manufacturers must implement a quality management system complying with recognised standards for software development and risk management.",
      sortOrder: 4,
      statements: [
        { reference: "ISO 13485 / MDR Art 10", statement: "QMS compliance following ISO 13485 is effectively mandatory for all medical device manufacturers under MDR. It must cover design controls, document controls, supplier management, CAPA, and management review.", commentary: "ISO 13485 certification is the baseline for market access. Your AI development process must follow formal design controls: design inputs, design outputs, design reviews, design verification, and design validation. Agile development is possible but must be documented within the ISO 13485 framework.", sortOrder: 1 },
        { reference: "IEC 62304", statement: "IEC 62304 defines software lifecycle requirements and is the expected state of the art for software design control. It defines software safety classification and development process requirements.", commentary: "IEC 62304 is not legally mandatory but is effectively required as the harmonised standard. It defines three software safety classes (A, B, C) with increasing rigour. Most AI medical software falls into Class B or C, requiring comprehensive testing, traceability, and configuration management.", sortOrder: 2 },
      ],
    },
    {
      title: "Technical Documentation & AI Act Integration",
      description: "From 2026-2027, AI-enabled medical devices must comply with both MDR/IVDR and the EU AI Act simultaneously.",
      sortOrder: 5,
      statements: [
        { reference: "MDR Annex II-III + AI Act", statement: "Technical documentation must include: device description, design and manufacturing information, risk analysis (ISO 14971), clinical evaluation, and labelling. AI-enabled SaMD must also comply with EU AI Act requirements for high-risk AI systems.", commentary: "You face dual regulation. MDR/IVDR is the primary (lex specialis) regulation for medical devices, but the AI Act adds requirements on transparency, human oversight, and bias testing that MDR does not specifically address. Prepare for two sets of conformity assessments and technical documentation requirements.", sortOrder: 1 },
        { reference: "AI Act + MDR Integration", statement: "For medical devices with embedded AI, the MDR conformity assessment by a Notified Body will also cover AI Act requirements, creating a single assessment pathway. But AI Act obligations on transparency and human oversight are additive.", commentary: "The good news: one Notified Body assessment covers both regulations. The challenge: you must meet both sets of requirements simultaneously. AI Act adds specific obligations around training data documentation, bias testing, and ongoing monitoring that go beyond current MDR requirements. Start preparing now.", sortOrder: 2 },
      ],
    },
  ],
};

// ─── National AI Strategies ──────────────────────────────

const nationalStrategies: FrameworkSeed = {
  slug: "national-ai-strategies",
  sections: [
    {
      title: "France \u2014 Sovereign AI & Investment Leadership",
      description: "France has positioned itself as the EU's AI investment leader with a focus on sovereign compute infrastructure and a thriving startup ecosystem.",
      sortOrder: 1,
      statements: [
        { reference: "France AI Strategy Phase 3 (2025+)", statement: "France has committed \u20AC2.5 billion in public investment plus \u20AC109 billion in total commitments (public, private, international) for AI infrastructure, research, and adoption, announced at the February 2025 AI Action Summit.", commentary: "France's investment scale signals strategic intent to be Europe's AI hub. For enterprises, this means strong French AI infrastructure (Mistral AI, Scaleway) as alternatives to US cloud providers. French government contracts increasingly favour sovereign AI solutions \u2014 relevant for companies serving the French public sector.", sortOrder: 1 },
        { reference: "France Sovereign Compute", statement: "Major sovereign compute investments include Mistral AI's 18,000 NVIDIA Grace Blackwell Superchips and a \u20AC10 billion agreement for a 500,000-GPU supercomputer powered by nuclear energy (1 GW capacity by 2028).", commentary: "France is building AI compute capacity powered by its decarbonised nuclear grid, positioning 'Green AI Made in France' as a competitive advantage. For enterprises with sustainability commitments, French AI infrastructure offers a lower carbon footprint than data centres in countries reliant on fossil fuels.", sortOrder: 2 },
      ],
    },
    {
      title: "Germany \u2014 Trustworthy AI & Quality Standards",
      description: "Germany focuses on 'AI Made in Germany' as a global quality seal, emphasising trustworthiness, transparency, and SME adoption.",
      sortOrder: 2,
      statements: [
        { reference: "AI Made in Germany Strategy", statement: "Germany positions 'AI Made in Germany' as a global seal of quality for secure, ethical AI applications based on European values, with criteria covering transparency, legality, privacy, non-discrimination, and reliability.", commentary: "The 'AI Made in Germany' brand aims to differentiate on trust, not just performance. For enterprises evaluating AI vendors, a German-origin or German-certified AI solution carries implicit quality assurance. SAP and Siemens AI offerings benefit from this positioning.", sortOrder: 1 },
        { reference: "Germany Quality Infrastructure", statement: "Germany is developing a quality standard for low-risk AI systems with a digital assessment portal for independent AI quality demonstration, sovereign data spaces, and a dataset search engine for data sharing.", commentary: "Germany's approach creates practical tools: a self-assessment portal for AI quality, shared data spaces for training data, and quality standards. Enterprises operating in Germany should monitor these standards as they may become de facto requirements in procurement decisions, especially for public sector contracts.", sortOrder: 2 },
      ],
    },
    {
      title: "Netherlands \u2014 Responsible Generative AI Pioneer",
      description: "The Netherlands was among the first EU countries to publish a government-wide vision on generative AI, emphasising safety, equity, and continuous monitoring.",
      sortOrder: 3,
      statements: [
        { reference: "NL Generative AI Vision (Jan 2024)", statement: "The Netherlands published a government-wide vision on generative AI built on four core principles: safety, equity, human welfare and autonomy, and sustainability and prosperity.", commentary: "The Dutch approach is pragmatic and principles-based rather than prescriptive. For enterprises operating in the Netherlands, this means regulatory expectations around AI will focus on demonstrable safety and fairness outcomes rather than tick-box compliance. Show that your AI is safe and fair, not just that you filled in the forms.", sortOrder: 1 },
        { reference: "NL Risk-Based Approach", statement: "The Netherlands identifies high-impact AI use cases (public administration, law enforcement, healthcare diagnostics, financial decisions, critical infrastructure) requiring heightened scrutiny, alongside six action lines for government AI adoption.", commentary: "The Dutch government is actively experimenting with AI while maintaining oversight. For enterprises, this signals a supportive regulatory environment that welcomes innovation but will scrutinise high-impact applications closely. Financial services and healthcare AI face the most attention.", sortOrder: 2 },
      ],
    },
    {
      title: "Common Themes Across EU Member States",
      description: "Despite different approaches, EU member states share common priorities in their AI strategies that affect enterprise AI adoption.",
      sortOrder: 4,
      statements: [
        { reference: "EU Coordinated Plan on AI", statement: "All major EU countries are investing heavily in domestic compute capacity driven by data sovereignty concerns, with France, Germany, and the Netherlands collectively channelling over \u20AC4.2 billion in 2024-2025 into sovereign compute infrastructure.", commentary: "Sovereign AI infrastructure is a pan-European priority. For enterprises, this means EU-hosted AI compute options are expanding rapidly. If data sovereignty is a concern (and under GDPR and the AI Act, it should be), evaluate EU-native alternatives to US hyperscalers \u2014 the options are growing.", sortOrder: 1 },
        { reference: "EU Coordinated Plan on AI", statement: "National strategies consistently prioritise trustworthy AI (transparency, fairness, non-discrimination, human oversight), talent and education (35% of global AI Masters programmes are in the EU), and SME AI adoption.", commentary: "The EU's competitive positioning for AI is trust, not raw compute power. Enterprises adopting AI should align with this: invest in explainability, fairness, and documentation. Companies that can demonstrate trustworthy AI practices will have a competitive advantage in EU public procurement and regulated industries.", sortOrder: 2 },
      ],
    },
  ],
};

// ─── Main Seed Function ──────────────────────────────────

async function seedFramework(fw: FrameworkSeed) {
  const framework = await prisma.regulatoryFramework.findUnique({ where: { slug: fw.slug } });
  if (!framework) {
    console.log(`  \u2717 ${fw.slug} not found in database, skipping`);
    return;
  }

  // Delete existing sections (cascade deletes statements)
  await prisma.frameworkSection.deleteMany({ where: { frameworkId: framework.id } });

  for (const section of fw.sections) {
    const { statements, ...sectionData } = section;
    const created = await prisma.frameworkSection.create({
      data: { ...sectionData, frameworkId: framework.id },
    });

    for (const stmt of statements) {
      await prisma.policyStatement.create({
        data: { ...stmt, sectionId: created.id },
      });
    }

    console.log(`    \u2713 ${section.title} (${statements.length} statements)`);
  }
}

async function main() {
  console.log("Seeding all framework sections & policy statements...\n");

  console.log("GDPR:");
  await seedFramework(gdpr);

  console.log("\nDORA:");
  await seedFramework(dora);

  console.log("\nEBA/EIOPA Guidelines:");
  await seedFramework(ebaEiopa);

  console.log("\nMDR/IVDR:");
  await seedFramework(mdrIvdr);

  console.log("\nNational AI Strategies:");
  await seedFramework(nationalStrategies);

  console.log("\nDone! All frameworks populated.");
}

main()
  .catch((e) => { console.error("Seed failed:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
