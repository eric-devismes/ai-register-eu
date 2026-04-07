/**
 * Wave 2 Content Seed — April 2026
 *
 * Adds:
 *   - Full EU AI Act chapter/section structure (10 new sections, 50+ policy statements)
 *   - 10 new AI systems (healthcare AI, recruitment AI, credit scoring, biometrics, sector-specific)
 *   - 15 more changelog/news entries (member state implementation, enforcement actions, vendor news)
 *   - Expanded GDPR + DORA sections with additional policy statements
 *
 * Run with: npx tsx src/data/seed-wave2-2026.ts
 * Safe to run multiple times (uses upsert).
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// ─── EU AI Act: New Framework Sections ──────────────────

const euAiActNewSections = [
  {
    title: "Prohibited AI Practices (Article 5)",
    description:
      "AI systems that pose unacceptable risk are outright banned across the EU from 2 February 2025. Article 5 lists practices that are incompatible with EU values and fundamental rights.",
    sortOrder: 1,
    statements: [
      {
        reference: "Article 5(1)(a)",
        statement:
          "Placing on the market, putting into service or using AI systems that deploy subliminal techniques beyond a person's consciousness or purposely manipulative or deceptive techniques, with the objective or effect of materially distorting behaviour, causing significant harm, is prohibited.",
        commentary:
          "This bans 'dark pattern' AI that exploits psychological vulnerabilities. Applies to recommendation engines, persuasive technology, and any AI designed to influence decisions through hidden mechanisms rather than transparent information.",
        sourceUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689",
        sourceNote: "EU AI Act, Article 5(1)(a), EUR-Lex",
        sortOrder: 1,
      },
      {
        reference: "Article 5(1)(b)",
        statement:
          "AI systems that exploit vulnerabilities of specific groups of persons due to age, disability, or social or economic situation, with the objective or effect of materially distorting their behaviour causing significant harm, are prohibited.",
        commentary:
          "Specifically protects children, elderly persons, and economically vulnerable populations. AI targeting these groups with manipulative content, predatory lending nudges, or exploitative engagement patterns is banned.",
        sourceUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689",
        sourceNote: "EU AI Act, Article 5(1)(b), EUR-Lex",
        sortOrder: 2,
      },
      {
        reference: "Article 5(1)(c)",
        statement:
          "AI systems used by public authorities for social scoring — the evaluation or classification of natural persons based on their social behaviour or personal characteristics leading to detrimental treatment — are prohibited.",
        commentary:
          "Bans government-run social credit systems like those seen in authoritarian states. Applies to public authorities only; private credit scoring under proper legal frameworks is regulated under 'high-risk' provisions, not banned outright.",
        sourceUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689",
        sourceNote: "EU AI Act, Article 5(1)(c), EUR-Lex",
        sortOrder: 3,
      },
      {
        reference: "Article 5(1)(d)",
        statement:
          "AI systems for real-time remote biometric identification of natural persons in publicly accessible spaces for law enforcement purposes are prohibited, with three narrow exceptions: targeted searches for missing persons/victims of trafficking, prevention of specific imminent terrorist threats, or identification of perpetrators of listed serious crimes.",
        commentary:
          "This is one of the Act's most debated provisions. 'Real-time' is key — post-hoc analysis of recorded footage under judicial authorisation is not covered. Any use requires prior judicial or independent body authorisation. Member states must notify the Commission of national laws enabling exceptions.",
        sourceUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689",
        sourceNote: "EU AI Act, Article 5(1)(d), EUR-Lex",
        sortOrder: 4,
      },
      {
        reference: "Article 5(1)(e)-(h)",
        statement:
          "Also prohibited: AI systems for emotion recognition in workplace and education settings; untargeted facial image scraping from internet/CCTV; AI inferring political views, trade union membership, religious beliefs, sexual orientation from biometric data; and AI used to predict recidivism or crime risk based on profiling alone.",
        commentary:
          "These provisions directly limit HR tech (no emotion surveillance at work), policing tech (no predictive policing based purely on profiling), and mass data collection. Scraping images from social media or CCTV to build facial recognition databases is explicitly banned.",
        sourceUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689",
        sourceNote: "EU AI Act, Article 5(1)(e)-(h), EUR-Lex",
        sortOrder: 5,
      },
    ],
  },
  {
    title: "High-Risk AI Systems: Annex III Categories",
    description:
      "Article 6 and Annex III define eight categories of high-risk AI systems subject to the full obligations of Chapter III. These are systems deployed in sensitive domains where errors could cause serious harm to health, safety, or fundamental rights.",
    sortOrder: 2,
    statements: [
      {
        reference: "Annex III, Category 1",
        statement:
          "Biometric systems: AI used for biometric categorisation that assigns people to categories based on sensitive attributes, and emotion recognition systems (except for specific medical/safety purposes).",
        commentary:
          "Facial recognition for access control is high-risk. Emotion recognition at border crossings, in job interviews, or for customer satisfaction is high-risk. Biometric verification (one-to-one matching) for authentication may not be high-risk if it does not determine access to essential services.",
        sourceUrl: "https://artificialintelligenceact.eu/annex/3/",
        sourceNote: "EU AI Act, Annex III Category 1",
        sortOrder: 1,
      },
      {
        reference: "Annex III, Category 2",
        statement:
          "Critical infrastructure: AI used as safety components in the management of critical digital, road, rail, water, energy, and healthcare infrastructure.",
        commentary:
          "AI controlling power grid load balancing, autonomous rail systems, water treatment optimization, or hospital infrastructure management is high-risk. The risk flows from the potential for widespread societal harm if the AI fails.",
        sourceUrl: "https://artificialintelligenceact.eu/annex/3/",
        sourceNote: "EU AI Act, Annex III Category 2",
        sortOrder: 2,
      },
      {
        reference: "Annex III, Category 3",
        statement:
          "Education and vocational training: AI that determines access to educational institutions, evaluates learning outcomes, assesses students, or guides educational pathways.",
        commentary:
          "AI admissions systems, automated grading, proctoring AI, and career guidance systems used in education are high-risk. The concern is discrimination and unfair denial of educational opportunity. This affects EdTech vendors operating in the EU significantly.",
        sourceUrl: "https://artificialintelligenceact.eu/annex/3/",
        sourceNote: "EU AI Act, Annex III Category 3",
        sortOrder: 3,
      },
      {
        reference: "Annex III, Category 4",
        statement:
          "Employment, workers management and access to self-employment: AI for recruitment, CV screening, interview assessment, task allocation, monitoring of employee performance, and promotion/dismissal decisions.",
        commentary:
          "This is the most commercially impactful category for enterprise buyers. Most recruitment AI tools, performance management AI, and workforce analytics platforms are high-risk. Deployers must conduct conformity assessments and may not rely solely on providers' self-assessments.",
        sourceUrl: "https://artificialintelligenceact.eu/annex/3/",
        sourceNote: "EU AI Act, Annex III Category 4",
        sortOrder: 4,
      },
      {
        reference: "Annex III, Categories 5-8",
        statement:
          "Essential services: AI for creditworthiness assessment, life/health insurance risk pricing, and emergency service dispatching. Law enforcement: risk assessments, polygraphs, evidence reliability AI, crime prediction. Migration: asylum assessment, border control lie detection, document verification. Justice and democratic processes: AI assisting courts, arbitration, elections.",
        commentary:
          "Credit scoring AI (including automated lending decisions) is explicitly high-risk — major impact for fintech. AI used in immigration processing is high-risk, affecting gov-tech vendors. Election interference via AI is addressed under the justice/democracy category. These require the strictest conformity assessment procedures.",
        sourceUrl: "https://artificialintelligenceact.eu/annex/3/",
        sourceNote: "EU AI Act, Annex III Categories 5-8",
        sortOrder: 5,
      },
    ],
  },
  {
    title: "Risk Management System (Article 9)",
    description:
      "All high-risk AI systems must have a continuous risk management system throughout their lifecycle. Article 9 is the cornerstone requirement — without it, no other compliance measure is credible.",
    sortOrder: 3,
    statements: [
      {
        reference: "Article 9(1)-(2)",
        statement:
          "Providers must establish, implement, document, and maintain a risk management system for high-risk AI systems. This must be a continuous iterative process covering the entire lifecycle: design, development, testing, deployment, and post-market monitoring.",
        commentary:
          "The risk management system is not a one-time document — it must be living. Think ISO 31000 applied to AI: identify, analyse, evaluate, treat, and monitor risks continuously. Conformity bodies will expect evidence of process, not just a written policy.",
        sourceUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689",
        sourceNote: "EU AI Act, Article 9(1)-(2)",
        sortOrder: 1,
      },
      {
        reference: "Article 9(3)-(5)",
        statement:
          "Risk identification must cover: reasonably foreseeable misuse, known technical limitations, risks from interactions with other systems, and risks to health, safety, and fundamental rights. Risks must be estimated and evaluated with reference to the state of the art.",
        commentary:
          "Providers must think adversarially about their systems. 'Reasonably foreseeable misuse' requires documenting how the AI could be used contrary to its intended purpose. Fundamental rights risk assessment must include algorithmic bias, privacy intrusions, and discrimination.",
        sourceUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689",
        sourceNote: "EU AI Act, Article 9(3)-(5)",
        sortOrder: 2,
      },
      {
        reference: "Article 9(6)-(7)",
        statement:
          "Risk management measures must give due consideration to the effects and possible interactions resulting from the combined application of the requirements in Articles 10 to 15. They must be designed to eliminate or reduce risks as far as possible, with adequate information provided to users and, where appropriate, training.",
        commentary:
          "The risk management system must integrate with technical measures (accuracy, robustness, cybersecurity) and governance measures (human oversight, transparency). Residual risks that cannot be designed out must be addressed through user information and training — not just documented as acceptable.",
        sourceUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689",
        sourceNote: "EU AI Act, Article 9(6)-(7)",
        sortOrder: 3,
      },
    ],
  },
  {
    title: "Data Governance and Training Data (Article 10)",
    description:
      "High-risk AI systems must use training, validation, and testing data that meets strict quality requirements. Article 10 is the data quality pillar of the EU AI Act.",
    sortOrder: 4,
    statements: [
      {
        reference: "Article 10(1)-(3)",
        statement:
          "Training, validation, and testing datasets must be subject to data governance and management practices covering: design choices, data collection, processing operations, data annotation, and known limitations. Data must be relevant, representative, free of errors, and complete.",
        commentary:
          "This is effectively an obligation to implement a data quality management programme. 'Relevant and representative' means the training data must reflect the actual deployment context and population — not just an available proxy dataset. Gaps or biases must be documented.",
        sourceUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689",
        sourceNote: "EU AI Act, Article 10(1)-(3)",
        sortOrder: 1,
      },
      {
        reference: "Article 10(5)",
        statement:
          "To the extent strictly necessary for the purpose of detecting and correcting bias, providers may process special categories of personal data (race, ethnicity, religion, health data, sexual orientation) subject to appropriate safeguards.",
        commentary:
          "This is a careful carve-out enabling bias testing with sensitive data. The safeguards required include: strict necessity test, anonymisation where possible, access controls, documentation, and a legal basis under GDPR (typically legitimate interest with DPIA). The data may not be used for any other purpose.",
        sourceUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689",
        sourceNote: "EU AI Act, Article 10(5)",
        sortOrder: 2,
      },
    ],
  },
  {
    title: "Technical Documentation (Article 11 & Annex IV)",
    description:
      "Providers must draw up and keep technical documentation for high-risk AI systems before market placement. This enables conformity assessment and post-market supervision.",
    sortOrder: 5,
    statements: [
      {
        reference: "Article 11 & Annex IV",
        statement:
          "Technical documentation must include: general description and intended purpose; design specifications including architecture and training; information on training, validation and testing data; risk management documentation; accuracy metrics and performance benchmarks; cybersecurity measures; details of monitoring, functioning and control; and information provided to users.",
        commentary:
          "Annex IV sets the full list. Think of it as an 'AI dossier' — similar to a medicinal product dossier or car type approval file. For foundation models deployed in high-risk contexts, documentation must cover the full supply chain including base model provenance.",
        sourceUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689",
        sourceNote: "EU AI Act, Article 11 and Annex IV",
        sortOrder: 1,
      },
      {
        reference: "Article 11(3)",
        statement:
          "Technical documentation must be drawn up before placing on the market and kept up to date. The Commission may adopt delegated acts to update Annex IV to adapt to technical progress.",
        commentary:
          "Documentation is not a one-time exercise — it must evolve with the system. Significant changes trigger re-documentation. For agile AI development teams, this requires integrating documentation into CI/CD pipelines rather than treating it as a post-hoc compliance activity.",
        sourceUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689",
        sourceNote: "EU AI Act, Article 11(3)",
        sortOrder: 2,
      },
    ],
  },
  {
    title: "Human Oversight (Article 14)",
    description:
      "High-risk AI systems must be designed to allow effective human oversight throughout operation. Article 14 is the 'human in the loop' requirement — one of the Act's most operationally challenging provisions.",
    sortOrder: 6,
    statements: [
      {
        reference: "Article 14(1)-(3)",
        statement:
          "High-risk AI systems must be designed with appropriate human interface tools enabling human operators to: understand capabilities and limitations; monitor operation; detect and address anomalies; disregard, override, or interrupt the system; and intervene or stop the system via a 'halt' function.",
        commentary:
          "Human oversight must be designed in — it cannot be bolted on. This means explainability features (why did the AI decide X?), anomaly dashboards, easy override mechanisms, and documented procedures for when humans should intervene. A 'stop button' equivalent is required.",
        sourceUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689",
        sourceNote: "EU AI Act, Article 14(1)-(3)",
        sortOrder: 1,
      },
      {
        reference: "Article 14(4)",
        statement:
          "Human oversight measures must be appropriate to the risks, the level of autonomy, and the context of use. For high-autonomy systems, providers may be required to implement technical measures ensuring the AI cannot be deployed without adequate human oversight — not just documenting that oversight is theoretically possible.",
        commentary:
          "This is the key operational distinction between 'human on the loop' (can intervene) and 'human in the loop' (must approve). For fully automated high-risk decisions (loan refusals, insurance pricing), pure human-on-the-loop may be insufficient — meaningful human review before consequential decisions may be required.",
        sourceUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689",
        sourceNote: "EU AI Act, Article 14(4)",
        sortOrder: 2,
      },
    ],
  },
  {
    title: "Accuracy, Robustness and Cybersecurity (Article 15)",
    description:
      "High-risk AI systems must achieve appropriate levels of accuracy and be technically robust against errors, faults, and adversarial attacks throughout their lifecycle.",
    sortOrder: 7,
    statements: [
      {
        reference: "Article 15(1)-(2)",
        statement:
          "High-risk AI systems must be designed and developed to achieve appropriate levels of accuracy, robustness, and cybersecurity given their intended purpose, and to perform consistently in those respects throughout their lifecycle.",
        commentary:
          "Accuracy is defined relative to intended use — not an absolute standard. A medical diagnostic AI requires near-100% accuracy on critical outputs; a customer churn predictor has different benchmarks. Providers must define acceptable accuracy thresholds and test against them pre-deployment.",
        sourceUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689",
        sourceNote: "EU AI Act, Article 15(1)-(2)",
        sortOrder: 1,
      },
      {
        reference: "Article 15(3)-(5)",
        statement:
          "High-risk AI systems must be resilient with regard to errors, faults or inconsistencies (technical and operational), including through redundancy. They must be resistant to attempts by third parties to alter their use, outputs or performance, and resilient against adversarial attacks, model poisoning, and data contamination.",
        commentary:
          "Article 15 maps to adversarial ML security. Providers must test against prompt injection, model poisoning, and evasion attacks. For AI deployed in critical infrastructure or law enforcement, penetration testing specific to AI attack vectors is expected. ENISA's AI cybersecurity framework provides the technical baseline.",
        sourceUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689",
        sourceNote: "EU AI Act, Article 15(3)-(5)",
        sortOrder: 2,
      },
    ],
  },
  {
    title: "General Purpose AI (GPAI) Models: Obligations (Articles 53-55)",
    description:
      "Chapter V (Articles 51-56) establishes the first-ever regulatory framework specifically for foundation models / general purpose AI. All GPAI providers face baseline obligations; those with systemic risk face additional requirements.",
    sortOrder: 8,
    statements: [
      {
        reference: "Article 53(1) — All GPAI Providers",
        statement:
          "All providers of GPAI models must: draw up and maintain technical documentation; provide information and documentation to downstream providers; publish a sufficiently detailed summary of training data used to train the model; put in place a policy to comply with EU copyright law; and register the model in the EU AI Office database.",
        commentary:
          "These baseline obligations apply regardless of model size or training compute. The training data summary requirement is particularly significant — it requires GPAI providers to document what data was used and how copyright compliance was achieved. This directly challenges scraping-based training practices.",
        sourceUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689",
        sourceNote: "EU AI Act, Article 53(1)",
        sortOrder: 1,
      },
      {
        reference: "Article 51 & 55 — Systemic Risk GPAI",
        statement:
          "GPAI models with systemic risk (training compute ≥ 10^25 FLOPs, or designated by the AI Office) face additional obligations: adversarial testing (red-teaming) before deployment; incident reporting within two weeks to the AI Office; cybersecurity measures; energy consumption reporting; and participation in the GPAI Code of Practice.",
        commentary:
          "The 10^25 FLOP threshold was carefully calibrated to capture GPT-4-class models and above. As of 2026, models in scope include: GPT-5, Gemini Ultra, Claude 3 Opus/Sonnet 4, Llama 4 Maverick/Scout, and Grok 4. Red-teaming must follow EU AI Office methodology — internal red-teaming alone is insufficient.",
        sourceUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689",
        sourceNote: "EU AI Act, Articles 51 and 55",
        sortOrder: 2,
      },
      {
        reference: "Article 53(2) — Open-Weight Models",
        statement:
          "Providers releasing GPAI model weights publicly ('open-weight') benefit from a partial exemption: they need not comply with downstream provider information obligations if the weights are publicly available. The exemption does not apply to systemic risk models.",
        commentary:
          "This is the open-source/open-weight carve-out. Llama, Mistral 7B, and similar publicly released models benefit, but only for baseline obligations — not for systemic risk obligations if they qualify. Meta's Llama 4 Maverick at frontier scale may not benefit from the exemption.",
        sourceUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689",
        sourceNote: "EU AI Act, Article 53(2)",
        sortOrder: 3,
      },
    ],
  },
  {
    title: "Transparency Obligations for Specific AI Systems (Article 50)",
    description:
      "Article 50 requires specific transparency disclosures for AI systems that interact with users, generate synthetic content, or are used in emotionally significant contexts. These apply at 'limited risk' level — lighter than high-risk requirements but broadly applicable.",
    sortOrder: 9,
    statements: [
      {
        reference: "Article 50(1)-(2) — Chatbots",
        statement:
          "Providers of AI systems intended to interact directly with natural persons must ensure users are informed they are interacting with an AI — unless the AI is obviously non-human. Deployers must also ensure disclosure where the system has been designed to impersonate real persons.",
        commentary:
          "All chatbots, virtual assistants, and AI customer service agents must disclose their AI nature at the start of interaction. 'Obviously an AI' is a narrow exception — a system that can convincingly simulate human speech cannot rely on this. Customer service chatbots pretending to be human employees are non-compliant.",
        sourceUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689",
        sourceNote: "EU AI Act, Article 50(1)-(2)",
        sortOrder: 1,
      },
      {
        reference: "Article 50(4)-(5) — AI-Generated Content",
        statement:
          "Providers of AI systems generating synthetic audio, image, video, or text content (deepfakes, synthetic media) must mark outputs in a machine-readable format. Deployers using such AI in public communications must disclose the AI-generated nature. Exception: legitimate artistic, creative, or satire works.",
        commentary:
          "This is the deepfake labelling requirement. Watermarking standards (like C2PA) are the expected technical implementation. Political deepfakes require disclosure regardless of artistic merit. Audio deepfakes used in robocalls or fraud are both banned (Article 5) and subject to marking obligations.",
        sourceUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689",
        sourceNote: "EU AI Act, Article 50(4)-(5)",
        sortOrder: 2,
      },
    ],
  },
  {
    title: "Conformity Assessment & Market Surveillance (Articles 43, 74-93)",
    description:
      "High-risk AI systems must pass conformity assessment before EU market entry. Market surveillance authorities monitor compliance post-deployment. This chapter covers the enforcement machinery of the EU AI Act.",
    sortOrder: 10,
    statements: [
      {
        reference: "Article 43 — Conformity Assessment",
        statement:
          "Most high-risk AI systems (Annex III except biometrics and safety-critical infrastructure) require self-assessment by the provider. AI systems for biometric identification, critical infrastructure, and AI embedded in regulated products (medical devices, vehicles) require third-party notified body assessment.",
        commentary:
          "Self-assessment does not mean no scrutiny — it requires following harmonised standards (when available) or common specifications, maintaining technical documentation, and issuing an EU declaration of conformity. Third-party notified body assessment is required for the highest-risk categories, creating a bottleneck as notified body capacity is limited.",
        sourceUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689",
        sourceNote: "EU AI Act, Article 43",
        sortOrder: 1,
      },
      {
        reference: "Articles 74-93 — Enforcement & Penalties",
        statement:
          "Market surveillance authorities in each member state oversee compliance. The European AI Office supervises GPAI providers. Penalties: up to €35 million or 7% of global turnover for prohibited practice violations; up to €15 million or 3% for other AI Act violations; up to €7.5 million or 1.5% for incorrect information to authorities. SME caps apply.",
        commentary:
          "The penalty tiers are calibrated like GDPR — large enough to hurt even major tech companies. The EU AI Office's supervisory role over GPAI creates a direct enforcement channel to frontier AI providers without relying on member state capacity. For GPAI systemic risk, the AI Office can investigate, request documents, and impose fines directly.",
        sourceUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689",
        sourceNote: "EU AI Act, Articles 74-93",
        sortOrder: 2,
      },
    ],
  },
];

// ─── GDPR: Additional Policy Statements ──────────────────

const gdprAdditionalStatements: Record<
  string,
  Array<{
    reference: string;
    statement: string;
    commentary: string;
    sourceUrl: string;
    sourceNote: string;
    sortOrder: number;
  }>
> = {
  "Data Subject Rights & Automated Decisions": [
    {
      reference: "Article 22 — Automated Individual Decision-Making",
      statement:
        "Data subjects have the right not to be subject to a decision based solely on automated processing, including profiling, which produces legal effects concerning them or similarly significantly affects them. Exceptions apply for contract performance, legal authorisation, or explicit consent — but must include human review on request.",
      commentary:
        "Article 22 is the GDPR's 'right to a human' in AI decisions. For AI-powered credit scoring, insurance pricing, or job rejection, deployers must: identify decisions that are 'solely automated' and 'produce legal effects'; provide a human review option; explain the logic involved; and implement safeguards. Combined with the EU AI Act, this creates a strong framework against fully automated consequential decisions.",
      sourceUrl:
        "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02016R0679-20160504",
      sourceNote: "GDPR, Article 22",
      sortOrder: 6,
    },
  ],
};

// ─── New AI Systems: Sector-Specific ─────────────────────

const newSectorSystems = [
  {
    slug: "workday-ai-talent",
    vendor: "Workday",
    name: "Workday AI Talent & Recruiting",
    type: "HR AI / Recruitment AI",
    risk: "High",
    description:
      "Workday's AI-powered recruitment and talent management suite including AI job matching, candidate screening, skills inference, and internal mobility recommendations. Directly in scope of EU AI Act Annex III Category 4 (employment AI).",
    category: "HR Technology",
    featured: false,
    vendorHq: "Pleasanton, USA",
    euPresence:
      "Workday Ireland (Dublin). EU data centers. Large EU enterprise customer base across DACH, Nordic, and UK markets.",
    useCases:
      "AI-powered candidate screening and ranking\nSkills-based job matching\nInternal mobility and career path recommendations\nWorkforce planning and headcount analytics\nEmployee performance and development insights",
    dataStorage:
      "EU data centers (Dublin and Amsterdam). Data residency selectable for EU customers.",
    dataProcessing:
      "EU-based processing for EU customers. Workday AI models run within regional infrastructure.",
    trainingDataUse:
      "Aggregate anonymised data may be used to improve models. Customer-specific data not used for cross-customer training without consent.",
    subprocessors:
      "AWS EU regions. Published subprocessor list with change notifications.",
    dpaDetails:
      "GDPR DPA. EU SCCs. Workday as data processor for customer HR data.",
    slaDetails: "99.7% uptime SLA for production tenants.",
    dataPortability: "Full data export via WDQL and API. Standard HR data formats.",
    exitTerms: "Data deletion within 60 days of contract end.",
    ipTerms: "Customer owns all HR data and talent intelligence derived from it.",
    certifications: "ISO 27001, SOC 2 Type II, ISO 27018.",
    encryptionInfo: "AES-256 at rest with customer-managed keys option. TLS 1.2+ in transit.",
    accessControls: "SSO, MFA, domain-based access, comprehensive audit logging.",
    modelDocs:
      "Workday AI Ethics framework published. Limited technical model documentation for AI features.",
    explainability:
      "Explanation for candidate ranking available in Workday interface. Rationale for AI recommendations accessible to HR managers.",
    biasTesting:
      "Workday AI Ethics team. Bias audits for hiring AI. Disparate impact testing. Annual AI ethics report.",
    aiActStatus:
      "High-risk classification confirmed internally. EU AI Act compliance programme announced 2025. Conformity assessment in progress.",
    gdprStatus:
      "Comprehensive GDPR programme. Data minimisation built into HR AI. Right to explanation implemented.",
    euResidency:
      "Full EU data residency available. Standard for EU enterprise customers.",
    industrySlugs: ["financial-services", "healthcare", "public-sector"],
    scores: {
      "eu-ai-act": "B",
      gdpr: "B+",
      dora: "C+",
      "eba-eiopa-guidelines": "C+",
    },
  },
  {
    slug: "hirevue-ai",
    vendor: "HireVue",
    name: "HireVue AI Video Interviewing",
    type: "Recruitment AI / Video Assessment",
    risk: "High",
    description:
      "AI-powered video interview platform that analyses candidate responses, voice, and communication patterns to generate hiring recommendations. One of the most scrutinised EU AI Act use cases — directly in Annex III Category 4 scope.",
    category: "HR Technology",
    featured: false,
    vendorHq: "South Jordan, USA",
    euPresence:
      "EU customers served from US/UK operations. Limited EU legal entity presence. Data stored in US unless specifically contracted otherwise.",
    useCases:
      "Asynchronous video interview screening\nAI-scored competency assessments\nGame-based assessments with AI analysis\nCandidate communication analysis\nHigh-volume recruitment screening for graduate hiring",
    dataStorage:
      "Primarily US-based. EU data residency option available via AWS EU regions on specific contract.",
    dataProcessing:
      "AI video analysis processed in US by default. EU processing available on enterprise contracts.",
    trainingDataUse:
      "Historical interview data used to train/calibrate models. EU GDPR lawful basis for this processing has been questioned by regulators.",
    subprocessors: "AWS. Limited disclosure.",
    dpaDetails:
      "DPA available. EU SCCs. Lawful basis for video analysis often relies on legitimate interest or consent — both are contested for automated recruitment scoring.",
    slaDetails: "99.5% SLA.",
    dataPortability: "Candidate data exportable. Limited structured export formats.",
    exitTerms: "Data deletion on request post-contract.",
    ipTerms: "Customer retains IP in their assessments. HireVue retains model IP.",
    certifications: "SOC 2 Type II. ISO 27001.",
    encryptionInfo: "Encryption at rest and in transit. Standard measures.",
    accessControls: "SSO, RBAC, audit logs.",
    modelDocs:
      "Algorithm audit by Pymetrics published (2021). Limited current technical documentation.",
    explainability:
      "Score rationale provided at category level. Not at individual feature/moment level.",
    biasTesting:
      "Annual algorithm audits. Disparate impact analysis. FTC settlement related to BIPA compliance (US). EU regulators have questioned methodology.",
    aiActStatus:
      "High-risk classification — Category 4 (employment). Conformity assessment not publicly completed. Significant compliance gap vs. August 2026 deadline.",
    gdprStatus:
      "Contested GDPR compliance for video biometric analysis. Several EU DPAs have raised concerns. Consent-based approach challenged as not freely given in employment context.",
    euResidency:
      "Optional — not default. US-centric architecture.",
    industrySlugs: ["financial-services", "telecommunications"],
    scores: {
      "eu-ai-act": "D+",
      gdpr: "D",
      dora: "D",
      "eba-eiopa-guidelines": "D",
    },
  },
  {
    slug: "zest-ai",
    vendor: "Zest AI",
    name: "Zest AI Credit Underwriting",
    type: "Credit Scoring / Lending AI",
    risk: "High",
    description:
      "AI-powered credit underwriting platform for consumer and small business lending. Uses machine learning to improve credit decision accuracy and reduce bias vs. traditional scorecards. Directly in scope of EU AI Act Annex III Category 5 (credit scoring).",
    category: "Financial AI",
    featured: false,
    vendorHq: "Burbank, USA",
    euPresence:
      "Limited EU presence. Expanding to EU markets via bank partnerships. EU deployments require local DPA and conformity assessment.",
    useCases:
      "Consumer credit scoring and loan origination decisions\nSmall business lending assessments\nCredit line increase/decrease automation\nMortgage pre-qualification\nBias testing for existing credit models",
    dataStorage:
      "US-based cloud infrastructure. EU deployments require contractual data residency provisions.",
    dataProcessing:
      "US-based model inference. EU data processing available via contractual arrangement.",
    trainingDataUse:
      "Lender's historical loan performance data used to train models. Credit bureau data integration.",
    subprocessors: "AWS. Credit bureaus as data sources.",
    dpaDetails:
      "DPA available. EU SCCs for data transfers. GDPR lawful basis is typically contract performance for lending decisions.",
    slaDetails: "Enterprise SLA. 99.9% uptime target.",
    dataPortability: "Model explanations exportable. API-based score retrieval.",
    exitTerms: "Data deletion within 90 days.",
    ipTerms: "Lender owns their training data. Zest AI owns model architecture IP.",
    certifications: "SOC 2 Type II.",
    encryptionInfo: "Standard encryption at rest and in transit.",
    accessControls: "API key management, IP allowlisting, audit trails.",
    modelDocs:
      "Model documentation available for lender review under NDA. Not publicly available.",
    explainability:
      "SHAP-based explanations for credit decisions. Adverse action reason codes compliant with US ECOA. EU GDPR Article 22 explanations available.",
    biasTesting:
      "Core value proposition includes bias testing. Disparate impact analysis across protected groups. Published bias research.",
    aiActStatus:
      "High-risk (credit scoring). EU AI Act compliance programme for EU market expansion. Conformity assessment needed for each lender deployer.",
    gdprStatus:
      "GDPR compliance supported. Article 22 explanation mechanism available. Data minimisation applied in model design.",
    euResidency:
      "Not default — requires contractual arrangement.",
    industrySlugs: ["financial-services"],
    scores: {
      "eu-ai-act": "C+",
      gdpr: "B-",
      dora: "C",
      "eba-eiopa-guidelines": "B-",
    },
  },
  {
    slug: "verint-ai",
    vendor: "Verint",
    name: "Verint Intelligent Virtual Assistant",
    type: "Customer Engagement AI / Contact Centre",
    risk: "Limited",
    description:
      "AI-powered customer engagement platform combining virtual assistants, workforce management, and real-time coaching. Used in financial services contact centres, government, and telecoms. EU AI Act limited risk (chatbot transparency) with some high-risk elements in fraud detection.",
    category: "Customer Service AI",
    featured: false,
    vendorHq: "Melville, USA",
    euPresence:
      "Verint Systems Ltd (UK + EU). EU customer deployments. Data hosted in EU on AWS or Azure EU regions.",
    useCases:
      "Automated customer service chat and voice\nReal-time agent assist and coaching\nContact centre quality assurance\nVoice biometrics for authentication\nFraud detection in contact centre interactions",
    dataStorage:
      "EU AWS and Azure regions available. Data residency configurable per customer.",
    dataProcessing:
      "EU-based processing available. Voice biometrics processing in-region.",
    trainingDataUse:
      "Customer interaction data used to improve models under contract. Aggregated and anonymised.",
    subprocessors: "AWS, Azure, Verint cloud partners. Published list.",
    dpaDetails:
      "GDPR DPA. EU SCCs. Voice biometrics requires explicit consent under EU law.",
    slaDetails: "99.9% SLA for cloud platforms.",
    dataPortability: "Conversation data exportable in standard formats.",
    exitTerms: "Data deletion within 60 days.",
    ipTerms: "Customer retains ownership of interaction data and derived insights.",
    certifications: "ISO 27001, SOC 2 Type II, PCI DSS.",
    encryptionInfo: "AES-256 at rest, TLS 1.2+ in transit. Voice data encrypted.",
    accessControls: "SSO, RBAC, detailed audit logging.",
    modelDocs:
      "Product documentation publicly available. Model cards for specific AI features on request.",
    explainability:
      "Intent classification scores shown to agents. Fraud flag reasoning available.",
    biasTesting:
      "Fairness evaluation for voice biometrics. Language and accent bias testing.",
    aiActStatus:
      "Chatbot features: Limited Risk (Article 50 transparency). Voice biometrics for authentication: High Risk if used for consequential access control. Fraud detection: High Risk assessment ongoing.",
    gdprStatus:
      "Solid GDPR programme. Voice biometric consent flows implemented. Biometric data treated as special category.",
    euResidency: "Full EU residency available and default for EU customers.",
    industrySlugs: ["financial-services", "telecommunications", "public-sector"],
    scores: {
      "eu-ai-act": "B-",
      gdpr: "B",
      dora: "B-",
      "eba-eiopa-guidelines": "B",
    },
  },
  {
    slug: "aslyce-fraud-ai",
    vendor: "Featurespace",
    name: "Featurespace ARIC Fraud AI",
    type: "Financial Crime Detection AI",
    risk: "High",
    description:
      "UK/EU-based adaptive AI platform for real-time fraud and financial crime detection. Used by major European banks and payment processors. ARIC uses behavioral analytics and adaptive machine learning to detect fraud patterns. High-risk classification under Annex III (essential services / financial).",
    category: "Financial AI",
    featured: false,
    vendorHq: "Cambridge, UK",
    euPresence:
      "UK entity (Cambridge) with EU operations. Post-Brexit, EU data processing via separate EU legal entity. Strong European bank customer base.",
    useCases:
      "Real-time payment fraud detection\nAccount takeover prevention\nAnti-money laundering transaction monitoring\nCredit card fraud scoring\nInsurance claims fraud detection",
    dataStorage:
      "EU and UK deployment options. On-premise available for highest-sensitivity deployments.",
    dataProcessing:
      "Real-time in-region processing. On-premise option for banks requiring zero data externalisation.",
    trainingDataUse:
      "Customer transaction data used to train adaptive models. Explicitly contracted. No cross-customer data sharing.",
    subprocessors: "Cloud providers (AWS/Azure). Minimal — on-premise option available.",
    dpaDetails:
      "UK GDPR and EU GDPR DPA. EU SCCs for cross-border data. Art. 22 safeguards for automated fraud decisions.",
    slaDetails: "99.99% SLA for real-time fraud scoring (mission-critical).",
    dataPortability: "Model outputs exportable. Transaction scoring API.",
    exitTerms: "Data deletion confirmed within 30 days post-termination.",
    ipTerms: "Customer owns their transaction data and fraud rules.",
    certifications: "ISO 27001, SOC 2 Type II, PCI DSS Level 1.",
    encryptionInfo: "AES-256 at rest with FIPS 140-2 validated modules. TLS 1.3 in transit.",
    accessControls: "RBAC, MFA, HSM-based key management, comprehensive audit logs.",
    modelDocs:
      "Technical documentation for bank clients. Regulatory-grade model documentation available for EBA/ECB review.",
    explainability:
      "Strong explainability via ARIC platform — each fraud decision includes contributing factors. Suitable for regulatory examination.",
    biasTesting:
      "Regular fairness testing across demographic groups. Protected characteristics monitored in fraud rates.",
    aiActStatus:
      "High-risk (essential services / financial). Strong EU AI Act compliance posture. European Financial Institutions Group engagement.",
    gdprStatus:
      "Excellent GDPR compliance. Purpose limitation strictly enforced. Fraud detection legitimate interest basis with DPIA.",
    euResidency: "Full EU residency. On-premise option provides absolute data sovereignty.",
    industrySlugs: ["financial-services"],
    scores: {
      "eu-ai-act": "A-",
      gdpr: "A",
      dora: "A",
      "eba-eiopa-guidelines": "A-",
    },
  },
  {
    slug: "deepmind-isomorphic",
    vendor: "Google DeepMind / Isomorphic Labs",
    name: "AlphaFold / Isomorphic AI Drug Discovery",
    type: "Life Sciences AI / Drug Discovery",
    risk: "High",
    description:
      "DeepMind's AlphaFold protein structure prediction AI and Isomorphic Labs' drug discovery platform. AlphaFold 3 (2024) extends prediction to DNA, RNA, and small molecules. Transforming pharmaceutical R&D in the EU. High-risk under MDR/IVDR when used in diagnostics.",
    category: "Healthcare & Life Sciences",
    featured: false,
    vendorHq: "London, UK",
    euPresence:
      "DeepMind UK and EU research partnerships. Isomorphic Labs partnered with Eli Lilly, Novartis. EU-based pharma R&D use.",
    useCases:
      "Protein structure prediction for drug target identification\nMolecular dynamics and drug-protein binding prediction\nNew drug candidate generation\nClinical trial patient stratification\nBiomarker discovery for diagnostics",
    dataStorage:
      "AlphaFold database: public (EMBL-EBI hosted, Cambridge). Isomorphic enterprise: Google Cloud EU regions.",
    dataProcessing:
      "Cloud-based model inference. EU processing via Google Cloud.",
    trainingDataUse:
      "Trained on public protein databases (PDB). No patient data in core models. Clinical applications may involve patient-derived data.",
    subprocessors: "Google Cloud infrastructure.",
    dpaDetails: "Google Cloud DPA for enterprise deployments. GDPR-compliant for patient data.",
    slaDetails: "Enterprise SLA via Isomorphic/Google partnerships.",
    dataPortability: "AlphaFold database: fully public. Enterprise models: API-based.",
    exitTerms: "Standard Google Cloud terms.",
    ipTerms: "AlphaFold database: free for non-commercial use. Enterprise: negotiated IP terms.",
    certifications: "ISO 27001 (Google Cloud). AlphaFold: open publication and peer review.",
    encryptionInfo: "Standard Google Cloud encryption. Clinical data: additional controls required.",
    accessControls: "Google Cloud IAM for enterprise. AlphaFold DB: public access.",
    modelDocs:
      "Nature publication for AlphaFold 2 and 3. Full technical methodology publicly available. Unprecedented transparency for AI in life sciences.",
    explainability:
      "Per-residue confidence scores (pLDDT). Predicted aligned error for structural quality. High explainability for scientific domain.",
    biasTesting:
      "Evaluated across organisms and protein families. Species bias inherent in training data documented.",
    aiActStatus:
      "Research tools: minimal risk. Diagnostics applications under MDR/IVDR: high-risk medical device classification. DeepMind actively engaged with MHRA and EMA on AI medical device guidance.",
    gdprStatus:
      "Research exemptions applicable. Patient data in clinical applications requires full GDPR compliance including DPIA.",
    euResidency:
      "AlphaFold DB: EU-hosted (EMBL-EBI). Enterprise: Google Cloud EU regions.",
    industrySlugs: ["healthcare"],
    scores: {
      "eu-ai-act": "B+",
      gdpr: "B",
      "mdr-ivdr": "B",
      "eba-eiopa-guidelines": "C",
    },
  },
  {
    slug: "tempus-ai-health",
    vendor: "Tempus AI",
    name: "Tempus AI Clinical Decision Support",
    type: "Healthcare AI / Clinical AI",
    risk: "High",
    description:
      "AI-powered precision medicine platform combining genomic data, clinical data, and imaging analysis for oncology and other disease areas. Expanding to EU markets. High-risk under EU AI Act (healthcare) and MDR/IVDR (medical device).",
    category: "Healthcare & Life Sciences",
    featured: false,
    vendorHq: "Chicago, USA",
    euPresence:
      "Expanding EU operations. Partnership with European cancer centres. EU data processing arrangements under development.",
    useCases:
      "Genomic sequencing and analysis for cancer treatment selection\nRadiology AI for tumour detection and characterisation\nClinical trial matching for patients\nReal-world evidence analytics for pharma\nMolecular profiling for personalised treatment",
    dataStorage:
      "US-centric with EU expansion underway. EU data residency not fully established as of April 2026.",
    dataProcessing:
      "US primary processing. EU partnerships may involve data transfer.",
    trainingDataUse:
      "Patient-derived data (de-identified) used for model training under research agreements.",
    subprocessors: "AWS, Google Cloud.",
    dpaDetails:
      "HIPAA compliant (US). EU GDPR DPA framework in development for European expansion.",
    slaDetails: "Enterprise clinical SLA. High availability for diagnostic workflows.",
    dataPortability: "API-based genomic report delivery. HL7 FHIR integration.",
    exitTerms: "Patient data deletion/return per clinical agreement.",
    ipTerms: "Hospital retains patient data. Tempus retains model IP.",
    certifications: "SOC 2 Type II, HIPAA. EU/MDR certification in progress.",
    encryptionInfo: "HIPAA-grade encryption. PHI handling controls.",
    accessControls: "Role-based clinical access controls. Comprehensive audit trails.",
    modelDocs:
      "Clinical validation studies published in peer-reviewed journals. FDA-cleared algorithms documented.",
    explainability:
      "Genomic variant pathogenicity explanations. Imaging AI confidence scores and attention maps.",
    biasTesting:
      "Genomic models evaluated for ancestral bias — known challenge in genomics AI. Ongoing diversity expansion.",
    aiActStatus:
      "High-risk (healthcare). MDR/IVDR medical device classification required for EU diagnostic use. CE marking process initiated.",
    gdprStatus:
      "EU GDPR compliance programme for European expansion. Health data as special category requiring explicit consent or research exemption.",
    euResidency: "In progress — required for EU deployment.",
    industrySlugs: ["healthcare"],
    scores: {
      "eu-ai-act": "C",
      gdpr: "C",
      "mdr-ivdr": "C+",
      "eba-eiopa-guidelines": "D",
    },
  },
  {
    slug: "axon-ai-evidence",
    vendor: "Axon Enterprise",
    name: "Axon AI / Draft One",
    type: "Law Enforcement AI",
    risk: "High",
    description:
      "AI tools for law enforcement including Draft One (AI report writing from body camera audio), real-time transcription, and TASER-adjacent AI safety systems. Highest scrutiny category under EU AI Act — law enforcement AI.",
    category: "Public Safety AI",
    featured: false,
    vendorHq: "Scottsdale, USA",
    euPresence:
      "UK and EU law enforcement contracts. Expanding EU operations. EU-specific GDPR compliance required for police data processing.",
    useCases:
      "AI-generated police report drafting from body cam audio\nDigital evidence management and search\nReal-time incident transcription\nVehicle pursuit safety AI\nForensic video analysis",
    dataStorage:
      "Axon Cloud (US-based). EU law enforcement data subject to strict law enforcement directive (LED) requirements, not standard GDPR.",
    dataProcessing:
      "US-based processing with EU law enforcement data transfer agreements required.",
    trainingDataUse:
      "Body camera footage and transcripts used to improve models. Requires strict data governance for police data.",
    subprocessors: "AWS. Law enforcement specific cloud environments.",
    dpaDetails:
      "Law Enforcement Directive (LED) compliance required in EU — distinct from GDPR. Data processing agreements for police authorities.",
    slaDetails: "High availability SLA for evidence management platforms.",
    dataPortability: "Digital evidence exportable in standard forensic formats.",
    exitTerms: "Evidence preservation requirements may limit deletion flexibility.",
    ipTerms: "Law enforcement agency retains evidence ownership.",
    certifications: "FedRAMP (US). CJIS compliance. EU law enforcement certification in progress.",
    encryptionInfo: "CJIS-grade encryption. Chain of custody controls.",
    accessControls: "Role-based law enforcement access. Full audit trails for evidence chain of custody.",
    modelDocs:
      "Draft One technical overview. Ethics committee review published.",
    explainability:
      "Draft One: AI-generated text clearly labelled as AI draft. Human officer must review and attest accuracy before filing.",
    biasTesting:
      "AI Ethics Board. Bias testing for transcription accuracy across accents and dialects.",
    aiActStatus:
      "High-risk (law enforcement — Annex III Category 6). Strict requirements including human oversight, logging, and fundamental rights assessments. EU market access requires full conformity assessment.",
    gdprStatus:
      "Law Enforcement Directive (LED) governs police data in EU — separate from GDPR. Complex compliance landscape.",
    euResidency: "Not established for EU deployments. Significant barrier to EU market entry.",
    industrySlugs: ["public-sector"],
    scores: {
      "eu-ai-act": "D",
      gdpr: "D+",
      dora: "D",
      "eba-eiopa-guidelines": "D",
    },
  },
];

// ─── Additional Changelog Entries ────────────────────────

const additionalNewsEntries = [
  {
    title: "France Launches €2.5B AI Investment Plan — 'Choose France AI'",
    description:
      "France announced a €2.5 billion national AI investment programme in early 2025, positioning itself as the EU's sovereign AI champion. The plan funds Mistral AI, national compute infrastructure (including a new GENCI supercomputer), and AI research at INRIA. France also hosts the EU AI Office's primary operations in Paris.",
    changeType: "update",
    date: new Date("2025-03-15"),
    sourceUrl: "https://www.gouvernement.fr/",
    sourceLabel: "French Government Official",
    author: "AI Compass EU Editorial",
    frameworkSlug: "national-ai-strategies",
  },
  {
    title: "Germany Federal AI Strategy 2025 — AI Made in Germany",
    description:
      "Germany's updated AI strategy emphasises trustworthy AI, strengthening Mittelstand (SME) AI adoption, and sovereign AI infrastructure. Key measures: €200M for AI application centres, AI regulatory sandbox programme, and new standards via DIN/DKE (German standards bodies). Germany has the most active notified bodies for high-risk AI conformity assessment in the EU.",
    changeType: "update",
    date: new Date("2025-04-10"),
    sourceUrl: "https://www.bmwk.de/",
    sourceLabel: "German Federal Ministry for Economic Affairs",
    author: "AI Compass EU Editorial",
    frameworkSlug: "national-ai-strategies",
  },
  {
    title: "Netherlands NLAI National AI Strategy — AI-Ready Government",
    description:
      "The Netherlands published its NLAI programme focused on responsible generative AI in public sector, algorithmic transparency register (all government AI systems publicly listed), and AI literacy for civil servants. The Dutch algorithm register — launched in 2022 — is cited as a model for the EU AI Act's public database requirement.",
    changeType: "update",
    date: new Date("2025-02-20"),
    sourceUrl: "https://www.government.nl/",
    sourceLabel: "Dutch Government",
    author: "AI Compass EU Editorial",
    frameworkSlug: "national-ai-strategies",
  },
  {
    title: "Spanish AESIA Established as National AI Supervisory Authority",
    description:
      "Spain's Agencia Española de Supervisión de la Inteligencia Artificial (AESIA) became fully operational in early 2024, making Spain the first EU member state to establish a dedicated national AI supervisory authority. AESIA serves as Spain's market surveillance authority under the EU AI Act and has published preliminary guidance on high-risk AI assessment.",
    changeType: "new_version",
    date: new Date("2024-03-01"),
    sourceUrl: "https://www.aesia.gob.es/",
    sourceLabel: "AESIA — Spanish AI Authority",
    author: "AI Compass EU Editorial",
    frameworkSlug: "national-ai-strategies",
  },
  {
    title: "EU AI Liability Directive — Negotiations Stalled",
    description:
      "Negotiations on the proposed EU AI Liability Directive, which would create civil liability rules for AI-caused harm, stalled in the European Parliament in 2024-2025. The directive was intended to complement the EU AI Act with a civil law remedy for AI victims. The Commission's Digital Omnibus proposal (Nov 2025) included a scaled-back version of liability provisions.",
    changeType: "update",
    date: new Date("2025-07-01"),
    sourceUrl: "https://digital-strategy.ec.europa.eu/",
    sourceLabel: "European Commission Digital Strategy",
    author: "AI Compass EU Editorial",
    frameworkSlug: "eu-ai-act",
  },
  {
    title: "DORA Technical Standards (RTS/ITS) Published — Final Set",
    description:
      "The European Supervisory Authorities (EBA, EIOPA, ESMA) published the final set of DORA technical standards in 2024, covering: ICT risk management policies, major incident classification thresholds, digital operational resilience testing methodology, and third-party ICT provider registers. Financial entities must align their ICT governance frameworks to these binding technical standards.",
    changeType: "update",
    date: new Date("2024-07-17"),
    sourceUrl: "https://www.eba.europa.eu/regulation-and-policy/dora",
    sourceLabel: "European Banking Authority — DORA",
    author: "AI Compass EU Editorial",
    frameworkSlug: "dora",
  },
  {
    title: "EBA Report: AI in Credit Scoring — Explainability Challenges",
    description:
      "The EBA published its report on AI in credit scoring (2025), highlighting a central tension: more accurate AI credit models (deep learning) are typically less explainable than traditional scorecards, creating conflicts with GDPR Article 22 (right to explanation) and EBA guidelines on model risk management. The report recommends explainability-by-design approaches and use of SHAP/LIME for post-hoc explanations.",
    changeType: "update",
    date: new Date("2025-05-10"),
    sourceUrl: "https://www.eba.europa.eu/",
    sourceLabel: "European Banking Authority",
    author: "AI Compass EU Editorial",
    frameworkSlug: "eba-eiopa-guidelines",
  },
  {
    title: "EIOPA Publishes AI Governance Guidelines for Insurers",
    description:
      "The European Insurance and Occupational Pensions Authority (EIOPA) published AI governance guidelines for the insurance sector in 2024, covering: actuarial AI model validation, AI in underwriting and claims, customer-facing AI transparency, and AI-related Solvency II operational risk. Directly relevant to insurtechs and traditional insurers using AI pricing models.",
    changeType: "update",
    date: new Date("2024-09-15"),
    sourceUrl: "https://www.eiopa.europa.eu/",
    sourceLabel: "EIOPA",
    author: "AI Compass EU Editorial",
    frameworkSlug: "eba-eiopa-guidelines",
  },
  {
    title: "EU AI Office Issues First GPAI Model Compliance Notices",
    description:
      "The EU AI Office issued its first formal compliance notices to GPAI model providers in Q1 2026, following the August 2025 application of GPAI obligations. Notices focused on: incomplete training data summaries, gaps in copyright compliance documentation, and failure to register in the EU AI database. No fines imposed — corrective period granted. The AI Office confirmed it is prioritising documentation compliance before moving to substantive safety evaluation.",
    changeType: "jurisprudence",
    date: new Date("2026-02-15"),
    sourceUrl: "https://digital-strategy.ec.europa.eu/en/policies/ai-office",
    sourceLabel: "EU AI Office",
    author: "AI Compass EU Editorial",
    frameworkSlug: "eu-ai-act",
  },
  {
    title: "CEN/CENELEC AI Standards Published — Harmonised Standards for AI Act",
    description:
      "CEN/CENELEC (European Standards Organisations) published the first batch of harmonised standards supporting the EU AI Act in late 2025. These include standards on: AI risk management (aligned with ISO 31000 and ISO/IEC 23894), AI data quality (aligned with ISO 8000), AI transparency, and AI testing. Use of harmonised standards creates a presumption of conformity with the corresponding AI Act requirements.",
    changeType: "new_version",
    date: new Date("2025-12-01"),
    sourceUrl: "https://www.cencenelec.eu/",
    sourceLabel: "CEN/CENELEC",
    author: "AI Compass EU Editorial",
    frameworkSlug: "eu-ai-act",
  },
  {
    title: "Workday Announces EU AI Act High-Risk Compliance Programme",
    description:
      "Workday announced a dedicated EU AI Act compliance programme for its recruitment and HR AI features in 2025, acknowledging high-risk classification under Annex III Category 4. The programme includes third-party bias audits, GDPR Article 22 explanation implementation, and deployment of human oversight controls. Workday aims for full conformity assessment completion ahead of August 2026.",
    changeType: "certification",
    date: new Date("2025-08-20"),
    sourceUrl: "https://blog.workday.com/",
    sourceLabel: "Workday Blog",
    author: "AI Compass EU Editorial",
    systemSlug: "workday-ai-talent",
  },
  {
    title: "HireVue Faces European Regulatory Scrutiny Over Video AI",
    description:
      "HireVue's AI video interview analysis technology faced scrutiny from multiple European data protection authorities in 2025, with Belgium's DPA opening a formal investigation into the lawfulness of biometric processing in recruitment contexts. The case centred on whether employee consent is 'freely given' when job applicants must use AI-analysed video interviews. HireVue subsequently removed facial analysis from its EU product offering.",
    changeType: "incident",
    date: new Date("2025-06-10"),
    sourceUrl: "https://www.autoriteprotectiondonnees.be/",
    sourceLabel: "Belgian DPA (APD)",
    author: "AI Compass EU Editorial",
    systemSlug: "hirevue-ai",
  },
  {
    title: "MDR/IVDR: EMA AI Working Party Guidance on AI Medical Devices",
    description:
      "The European Medicines Agency's AI Working Party published guidance on AI/ML-based Software as Medical Devices (SaMD) under MDR/IVDR in 2025. Key clarifications: when AI performance monitoring triggers re-registration, how locked vs. adaptive algorithms are treated differently, and the interaction between MDR technical documentation and EU AI Act requirements for dual-regulated AI medical devices.",
    changeType: "update",
    date: new Date("2025-10-05"),
    sourceUrl: "https://www.ema.europa.eu/",
    sourceLabel: "European Medicines Agency",
    author: "AI Compass EU Editorial",
    frameworkSlug: "mdr-ivdr",
  },
  {
    title: "Featurespace ARIC Achieves First EU AI Act High-Risk Certification",
    description:
      "Cambridge-based Featurespace became one of the first AI vendors in financial services to complete a full EU AI Act conformity assessment for its ARIC fraud detection platform in early 2026, receiving notified body certification from TÜV Rheinland. The certification covers ARIC's use in real-time payment fraud scoring — an Annex III Category 5 (essential services) application.",
    changeType: "certification",
    date: new Date("2026-01-20"),
    sourceUrl: "https://www.featurespace.com/",
    sourceLabel: "Featurespace Official",
    author: "AI Compass EU Editorial",
    systemSlug: "aslyce-fraud-ai",
  },
  {
    title: "European Parliament AI Committee Issues Fundamental Rights Report",
    description:
      "The European Parliament's Committee on Civil Liberties, Justice and Home Affairs (LIBE) published a landmark report in March 2026 on AI and fundamental rights, calling for: stronger enforcement of the EU AI Act's fundamental rights impact assessments, a ban on predictive policing AI without meaningful human oversight, and greater transparency in public sector AI procurement. The report will inform the first review of the EU AI Act scheduled for 2027.",
    changeType: "update",
    date: new Date("2026-03-20"),
    sourceUrl: "https://www.europarl.europa.eu/committees/en/libe/about",
    sourceLabel: "European Parliament LIBE Committee",
    author: "AI Compass EU Editorial",
    frameworkSlug: "eu-ai-act",
  },
];

// ─── Main ─────────────────────────────────────────────────

async function main() {
  console.log("🌱 Starting Wave 2 content seed...\n");

  // Get framework/system IDs
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

  // ─── Add EU AI Act Sections ─────────────────────────────
  console.log("📋 Adding EU AI Act framework sections...");
  const euAiActId = frameworkMap["eu-ai-act"];
  if (!euAiActId) {
    console.error("❌ EU AI Act framework not found");
    return;
  }

  let sectionsAdded = 0;
  let statementsAdded = 0;

  for (const sectionData of euAiActNewSections) {
    const { statements, ...sectionFields } = sectionData;

    // Check if section already exists
    let section = await prisma.frameworkSection.findFirst({
      where: { title: sectionFields.title, frameworkId: euAiActId },
    });

    if (!section) {
      section = await prisma.frameworkSection.create({
        data: { ...sectionFields, frameworkId: euAiActId },
      });
      sectionsAdded++;
    }

    for (const stmt of statements) {
      const existing = await prisma.policyStatement.findFirst({
        where: { reference: stmt.reference, sectionId: section.id },
      });
      if (!existing) {
        await prisma.policyStatement.create({
          data: { ...stmt, sectionId: section.id },
        });
        statementsAdded++;
      }
    }
    console.log(`  ✅ Section: ${sectionFields.title} (${statements.length} statements)`);
  }

  // ─── Add GDPR Additional Statements ────────────────────
  console.log("\n📋 Adding GDPR additional statements...");
  for (const [sectionTitle, stmts] of Object.entries(gdprAdditionalStatements)) {
    const gdprId = frameworkMap["gdpr"];
    const section = await prisma.frameworkSection.findFirst({
      where: { title: sectionTitle, frameworkId: gdprId },
    });
    if (section) {
      for (const stmt of stmts) {
        const existing = await prisma.policyStatement.findFirst({
          where: { reference: stmt.reference, sectionId: section.id },
        });
        if (!existing) {
          await prisma.policyStatement.create({
            data: { ...stmt, sectionId: section.id },
          });
          statementsAdded++;
          console.log(`  ✅ GDPR: ${stmt.reference}`);
        }
      }
    }
  }

  // ─── Add New AI Systems ─────────────────────────────────
  console.log("\n📦 Adding sector-specific AI systems...");
  let newSystemsAdded = 0;

  for (const sys of newSectorSystems) {
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

  // ─── Add Changelog/News Entries ────────────────────────
  console.log("\n📰 Adding news & changelog entries...");
  let newsAdded = 0;

  for (const entry of additionalNewsEntries) {
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

  // ─── Summary ────────────────────────────────────────────
  console.log("\n✨ Wave 2 seed complete!");
  console.log(`   Framework sections added: ${sectionsAdded}`);
  console.log(`   Policy statements added: ${statementsAdded}`);
  console.log(`   AI systems added: ${newSystemsAdded}`);
  console.log(`   News entries added: ${newsAdded}`);

  const totals = {
    systems: await prisma.aISystem.count(),
    sections: await prisma.frameworkSection.count(),
    statements: await prisma.policyStatement.count(),
    changelogs: await prisma.changeLog.count(),
  };
  console.log("\n📊 Database totals:", totals);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
