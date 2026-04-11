/**
 * Framework Enrichment — Batch 3: EBA/EIOPA Model Risk Deep-Dive + MDR/IVDR SaMD Decision Tree
 *
 * Adds deeper content to existing frameworks:
 * - EBA/EIOPA: model risk management deep-dive (validation, monitoring, governance)
 * - MDR/IVDR: SaMD classification decision tree with practical guidance
 * - National AI Strategies: Spain, Italy, Nordics, Poland
 *
 * Run with: npx tsx src/data/seed-framework-enrichment-batch3.ts
 * Safe to run multiple times (checks for existing sections before creating).
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// ─── Policy Statements to Add ─────────────────────────────

const policyStatements = [
  // ══════════════════════════════════════════════════════════
  // EBA/EIOPA: Model Risk Management Deep-Dive
  // ══════════════════════════════════════════════════════════

  // ── Model Validation Requirements ──────────────────────
  {
    frameworkSlug: "eba-eiopa-guidelines",
    sectionTitle: "Model Validation Requirements for AI/ML",
    statements: [
      {
        statement:
          "AI/ML models used for regulatory purposes (IRB credit risk, Solvency II internal models) must undergo independent validation before deployment and at least annually thereafter. Validation must cover conceptual soundness, data quality, discriminatory power, stability, and calibration.",
        commentary:
          "Independent validation means the team validating the model must be separate from the team that built it. For AI models this is harder than traditional models — you need validators who understand ML techniques, not just statistics. Consider engaging specialist third-party validators if internal expertise is limited. Key metrics: Gini coefficient, KS statistic, PSI (Population Stability Index), and backtesting results.",
        sortOrder: 1,
      },
      {
        statement:
          "Challenger model analysis is required: the institution must demonstrate that the chosen AI/ML model provides material improvement over simpler, more interpretable alternatives to justify additional complexity and opacity.",
        commentary:
          "Regulators will ask: 'Why not use logistic regression?' You must quantify the performance gain from using ML (e.g., 15% improvement in default prediction accuracy) and weigh it against the loss of interpretability. Document the comparison formally — feature-for-feature — with the same data, same population, same time period. If a simple model performs comparably, regulators may reject the complex one.",
        sortOrder: 2,
      },
      {
        statement:
          "Model validation must include out-of-sample testing, out-of-time testing, and stress testing. AI models must be tested under adverse macroeconomic scenarios to ensure they remain stable and predictive during economic downturns.",
        commentary:
          "AI models trained during benign economic conditions often fail during stress periods — they've never 'seen' a recession. Your validation must include: out-of-time testing using crisis-period data (2008 financial crisis, COVID-19), sensitivity analysis to key input features, and stress scenarios defined by your regulator (EBA stress test scenarios). Document how model outputs change under stress.",
        sortOrder: 3,
      },
      {
        statement:
          "For ensemble models, random forests, and deep learning architectures: validation must assess individual component performance as well as the aggregate model. Feature importance analysis must be documented for all significant variables.",
        commentary:
          "A random forest with 500 trees is not validated by testing the forest alone — you must understand what individual trees and features contribute. Tools: SHAP values, permutation importance, partial dependence plots. For neural networks: layer-wise relevance propagation or attention weights. Regulators expect you to explain not just what the model predicts, but why, at both the global and individual decision level.",
        sortOrder: 4,
      },
    ],
  },

  // ── Ongoing Model Monitoring ───────────────────────────
  {
    frameworkSlug: "eba-eiopa-guidelines",
    sectionTitle: "Ongoing Model Monitoring & Performance Tracking",
    statements: [
      {
        statement:
          "Institutions must implement continuous monitoring of AI model performance with predefined trigger thresholds. When Population Stability Index (PSI) exceeds 0.25, or discriminatory power (Gini/AUC) degrades by more than 5 percentage points from validation, immediate investigation and remediation is required.",
        commentary:
          "Don't wait for annual validation to discover your model has drifted. Implement automated monitoring dashboards tracking: PSI for input features and model scores, Gini/AUC over rolling windows, actual-vs-predicted ratios, and concentration in score bands. Set traffic-light thresholds: green (stable), amber (investigate), red (remediate or decommission). Monthly reporting to model risk committee.",
        sortOrder: 1,
      },
      {
        statement:
          "Model inventory must be maintained with comprehensive metadata: model owner, development date, last validation date, risk tier, materiality assessment, known limitations, compensating controls, and planned retirement or replacement date.",
        commentary:
          "Every AI model in production needs an entry in your model inventory — no exceptions, including vendor models and third-party scoring APIs. For each model document: business purpose, risk tier (Tier 1 = material/regulatory, Tier 2 = significant, Tier 3 = low impact), data inputs, outputs consumed by which processes, and dependencies on other models. This inventory is the first thing supervisors request during inspections.",
        sortOrder: 2,
      },
      {
        statement:
          "Backtesting must compare model predictions against actual outcomes on a regular basis. For credit risk models: actual default rates vs. predicted PD, actual LGD vs. predicted LGD. Statistical tests (binomial test, traffic light approach) must be applied systematically.",
        commentary:
          "Backtesting is not optional analysis — it is a regulatory requirement under CRR Article 185. Apply the Basel traffic light approach: green zone (model is well-calibrated), yellow zone (model may need adjustment), red zone (model is unreliable, immediate action required). For AI models, also backtest at the segment level — a model that backtests well overall may be severely miscalibrated for specific sub-populations.",
        sortOrder: 3,
      },
      {
        statement:
          "Data drift monitoring must track changes in the distribution of input features over time. When the training data distribution diverges materially from current production data, model retraining or recalibration is required.",
        commentary:
          "AI models assume the future looks like the past. When input distributions shift (e.g., average loan size increases, customer demographics change, new product types emerge), model predictions become unreliable. Monitor: feature-level PSI, correlation stability between features, and the emergence of feature values outside the training range. COVID-19 demonstrated how rapidly distributions can shift — have a rapid-response retraining protocol ready.",
        sortOrder: 4,
      },
    ],
  },

  // ── AI Model Governance Framework ─────────────────────
  {
    frameworkSlug: "eba-eiopa-guidelines",
    sectionTitle: "AI Model Governance Framework",
    statements: [
      {
        statement:
          "A three-lines-of-defence model governance structure is required: First line (model development team) owns model performance and day-to-day monitoring. Second line (model validation/risk management) provides independent challenge. Third line (internal audit) assesses the entire model risk management framework.",
        commentary:
          "The three-lines model is non-negotiable for financial services AI. Common failure: first line both builds and validates the model (no independence). Second line must have the authority to reject or restrict models, and the expertise to challenge ML techniques. Third line must audit the governance process itself, not just individual models. Board-level model risk appetite must be defined and cascaded.",
        sortOrder: 1,
      },
      {
        statement:
          "Model risk appetite must be defined at board level and translated into operational limits: maximum number of models in production, materiality thresholds for enhanced governance, acceptable model risk concentration, and escalation procedures for model failures.",
        commentary:
          "Your board must answer: 'How much model risk are we willing to accept?' This translates into practical limits: no more than X Tier-1 models from a single vendor, mandatory human override for AI decisions above €Y threshold, maximum model age before mandatory rebuild, and defined fallback processes when models fail. Without board-level appetite, model risk management is directionless.",
        sortOrder: 2,
      },
      {
        statement:
          "Model change management must distinguish between material and non-material changes. Material changes (new features, architecture changes, retraining on fundamentally different data) require full re-validation. Non-material changes (hyperparameter tuning, minor data updates) require documented assessment but may follow a streamlined process.",
        commentary:
          "Not every model update needs full validation — but you must have a defined process to classify changes. Material change triggers: adding or removing features that account for >5% of predictive power, changing model architecture (e.g., logistic regression to gradient boosting), retraining after a structural break (COVID, regulation change), or changing the target variable definition. Document the assessment even for non-material changes — supervisors will check.",
        sortOrder: 3,
      },
      {
        statement:
          "Vendor AI models and third-party scoring services are subject to the same model risk management requirements as internally developed models. The institution remains fully responsible for the performance and compliance of vendor models used in regulatory processes.",
        commentary:
          "Using a vendor's AI model does not outsource your regulatory responsibility. You must: validate the vendor model independently (if the vendor won't share model internals, use outcome-based validation), monitor its performance in your specific portfolio, maintain the right to override or switch vendors, and document the vendor model in your model inventory. 'The vendor said it works' is not a defence during a supervisory review.",
        sortOrder: 4,
      },
    ],
  },

  // ══════════════════════════════════════════════════════════
  // MDR/IVDR: SaMD Classification Decision Tree
  // ══════════════════════════════════════════════════════════

  // ── SaMD Classification Decision Tree ──────────────────
  {
    frameworkSlug: "mdr-ivdr",
    sectionTitle: "SaMD Classification Decision Tree (MDR Rule 11)",
    statements: [
      {
        statement:
          "Step 1 — Is the software intended to provide information for a medical purpose? If the software's intended purpose is purely administrative (scheduling, billing, hospital logistics), it is NOT a medical device. If it provides information used to make clinical decisions about individual patients, proceed to Step 2.",
        commentary:
          "This is the most important decision point and the most commonly misunderstood. 'Intended purpose' is what you claim in your labelling and marketing materials, but regulators also consider actual use. Examples of NOT a medical device: hospital bed management, appointment scheduling, general wellness apps without clinical claims. Examples of IS a medical device: any software that analyses patient data to suggest diagnoses, treatment options, or risk predictions for individual patients.",
        sortOrder: 1,
      },
      {
        statement:
          "Step 2 — Does the software drive or influence a clinical decision, or does it only inform? If the software provides specific diagnostic conclusions, treatment recommendations, or risk stratification for individual patients, it DRIVES clinical decisions → higher classification. If it only displays, transfers, or stores medical data without interpretation, it may qualify as Class I or be exempt.",
        commentary:
          "The distinction between 'drives' and 'informs' is crucial. An AI that says 'This CT scan shows a 94% probability of pulmonary embolism — recommend CT angiography' DRIVES the decision. An AI that says 'CT scan received and stored successfully' INFORMS. Grey area: an AI that highlights regions of interest on a scan without a diagnostic conclusion — this is typically considered 'driving' because it directs the clinician's attention. When in doubt, classify higher.",
        sortOrder: 2,
      },
      {
        statement:
          "Step 3 — What is the clinical situation severity? Class IIa: decisions relating to non-serious conditions or non-critical monitoring (e.g., AI triaging dermatology images for low-risk skin conditions). Class IIb: decisions that could cause serious deterioration of health or surgical intervention (e.g., AI detecting diabetic retinopathy, cardiac arrhythmia detection). Class III: decisions where failure could cause death or irreversible harm (e.g., AI diagnosing stroke, detecting cancer, guiding radiotherapy).",
        commentary:
          "Classification follows clinical risk, not technical complexity. A simple threshold-based algorithm detecting cardiac arrest is Class III because failure = death. A sophisticated deep learning model recommending moisturizer for dry skin is Class IIa because failure = mild irritation. Practical rule: if a missed diagnosis could kill or permanently disable the patient, it's Class III. If it could cause serious but treatable harm, it's Class IIb. If it's unlikely to cause serious harm, it's Class IIa.",
        sortOrder: 3,
      },
      {
        statement:
          "Step 4 — Conformity assessment pathway. Class I: self-declaration (manufacturer's own conformity assessment). Class IIa: Notified Body assessment of technical documentation and QMS. Class IIb: full Notified Body assessment including design examination. Class III: full Notified Body assessment including design examination and clinical evidence review.",
        commentary:
          "The regulatory burden escalates sharply with classification. Class I SaMD (rare for AI): self-declare, register in EUDAMED, affix CE mark. Class IIa: Notified Body reviews your QMS and technical file — expect 6-12 months. Class IIb/III: Notified Body reviews everything including clinical evidence, design dossier, and may witness testing — expect 12-24 months. Current bottleneck: limited Notified Body capacity means long queues. Start the process early.",
        sortOrder: 4,
      },
      {
        statement:
          "Special case — Continuous Learning AI (CL-AI): If your AI model updates itself based on new data after deployment, each update that changes the intended purpose or clinical performance constitutes a 'significant change' requiring new conformity assessment. Locked algorithms with periodic manual updates follow standard change management.",
        commentary:
          "Continuously learning AI is the hardest regulatory challenge in medical devices. Current MDR does not explicitly address CL-AI, but the MDCG guidance (MDCG 2024-6) distinguishes between 'locked' algorithms (output is deterministic for a given input) and 'adaptive' algorithms (outputs change as the model learns). For now: deploy locked algorithms and update through controlled release cycles with re-validation. Fully autonomous CL-AI in clinical settings is not yet practically achievable under current regulation.",
        sortOrder: 5,
      },
      {
        statement:
          "Special case — IVDR classification: AI-based IVD software follows IVDR Annex VIII, not MDR Rule 11. Class A: low individual risk (general lab information systems). Class B: moderate risk (routine clinical chemistry interpretation). Class C: high risk (companion diagnostics, genetic variant classification, blood typing). Class D: highest risk (blood screening for transfusion-transmissible infections, detecting life-threatening communicable diseases).",
        commentary:
          "IVDR classification is separate from MDR. If your AI analyses lab results or pathology images, you're under IVDR, not MDR. Key difference: IVDR Class C and D require performance evaluation studies with clinical samples, not just software verification. Companion diagnostics (AI that determines if a patient will respond to a specific therapy) are automatically Class C minimum. The May 2022 IVDR transition created a backlog — legacy IVD software must be re-certified under the new classification.",
        sortOrder: 6,
      },
    ],
  },

  // ── Practical SaMD Compliance Checklist ─────────────────
  {
    frameworkSlug: "mdr-ivdr",
    sectionTitle: "SaMD Compliance Checklist for AI Developers",
    statements: [
      {
        statement:
          "Before development: define intended purpose with precision. State exactly what the software does, for which patient population, in which clinical context, and what clinical decisions it supports. Ambiguous intended purpose is the #1 cause of regulatory delays.",
        commentary:
          "Write your intended purpose as if it were a legal contract — because it is. Bad example: 'AI-powered clinical decision support.' Good example: 'Software that analyses chest X-ray images to detect and localise suspected pneumothorax in adult patients (≥18 years) in emergency department settings, providing a probability score and heatmap overlay to support radiologist review. Not intended for paediatric patients or CT images.' Every word in your intended purpose constrains your classification, clinical evidence requirements, and marketing claims.",
        sortOrder: 1,
      },
      {
        statement:
          "During development: implement IEC 62304 software lifecycle, ISO 14971 risk management, and IEC 62366-1 usability engineering from the start. Retrofitting these processes to an existing AI product costs 3-5x more than building them in from day one.",
        commentary:
          "Three standards you cannot avoid: IEC 62304 (software development process — defines what documentation you need at each stage), ISO 14971 (risk management — hazard analysis, risk estimation, risk control, residual risk evaluation), and IEC 62366-1 (usability — formative and summative usability testing with real clinical users). For AI: also consider ISO/IEC TR 24028 (AI trustworthiness) and ISO/IEC 23894 (AI risk management). Start with the risk management file — it drives everything else.",
        sortOrder: 2,
      },
      {
        statement:
          "For AI-specific requirements: document training data provenance, annotation quality, dataset representativeness (demographics, device types, clinical sites), bias analysis, and algorithmic architecture decisions. This becomes part of your technical documentation (MDR Annex II).",
        commentary:
          "Notified Bodies are increasingly scrutinising AI-specific elements. You must document: training dataset size and composition, annotation methodology and inter-rater agreement, demographic representation (age, sex, ethnicity, geography), data split strategy (train/validation/test), augmentation techniques, architecture selection rationale, hyperparameter tuning approach, and bias analysis across subgroups. Missing or inadequate AI documentation is a growing reason for Notified Body queries and delays.",
        sortOrder: 3,
      },
      {
        statement:
          "Clinical evidence strategy: for Class IIa, a well-designed equivalence-based clinical evaluation may suffice. For Class IIb/III, prospective clinical performance studies are typically required. Plan your clinical evidence strategy before starting development — it determines your timeline and budget.",
        commentary:
          "Clinical evidence is usually the longest lead-time item. Class IIa: you may demonstrate equivalence to a predicate device if you can show technical, biological, and clinical equivalence — but post-Schrems the bar for equivalence claims is high. Class IIb/III: expect to run a prospective multi-site clinical performance study with several hundred to several thousand cases. Budget: €200K-€2M+ depending on indication and geography. Timeline: 12-36 months for study design, ethics approval, enrolment, analysis, and reporting.",
        sortOrder: 4,
      },
    ],
  },

  // ══════════════════════════════════════════════════════════
  // National AI Strategies: Spain, Italy, Nordics, Poland
  // ══════════════════════════════════════════════════════════

  {
    frameworkSlug: "national-ai-strategies",
    sectionTitle: "Spain — National AI Strategy & Regulatory Sandbox",
    statements: [
      {
        statement:
          "Spain launched ENIA (Estrategia Nacional de Inteligencia Artificial) with €600M investment through 2025, focusing on AI adoption in SMEs, public services digitalisation, and the creation of the first EU AI Act regulatory sandbox (AESIA — Agencia Española de Supervisión de la Inteligencia Artificial).",
        commentary:
          "Spain was the first EU country to establish a dedicated AI supervisory authority (AESIA, operational since 2024). The regulatory sandbox allows companies to test AI systems under supervised conditions before full market deployment. For enterprises: if you're developing high-risk AI for the Spanish market, the sandbox offers a path to validate compliance before the 2026 deadline. AESIA is also expected to share sandbox findings with other EU supervisors, making Spanish sandbox participation valuable across the EU.",
        sortOrder: 1,
      },
      {
        statement:
          "Spain's regulatory sandbox (first pilot completed 2024) tested AI systems in healthcare, employment, and public administration. Key learnings: conformity assessment procedures need practical simplification, SMEs need proportionate requirements, and cross-border recognition of sandbox results is essential.",
        commentary:
          "The sandbox results are publicly shared and provide the most practical EU-level guidance on AI Act compliance available today. For enterprises: study the AESIA sandbox reports — they reveal what regulators actually look for during conformity assessment, which documentation gaps are most common, and where the regulatory burden falls hardest. Spain's experience will shape how other EU countries implement their own supervisory approaches.",
        sortOrder: 2,
      },
    ],
  },

  {
    frameworkSlug: "national-ai-strategies",
    sectionTitle: "Italy — Strategic AI Programme & G7 Leadership",
    statements: [
      {
        statement:
          "Italy's Strategic Programme for AI (2024-2026) commits €1 billion across public and private investment, with focus areas: public administration AI (tax, justice, healthcare), research excellence (AI4Italy national hub), and industrial AI adoption. Italy held the G7 presidency in 2024 and drove the G7 AI governance agenda.",
        commentary:
          "Italy's AI strategy combines domestic industrial policy with international standard-setting ambitions. The G7 Hiroshima AI Process, championed during Italy's presidency, established voluntary AI governance principles that align with but go beyond the EU AI Act. For enterprises operating in Italy: public sector AI procurement is accelerating, with the national digital agency (AgID) setting standards for AI use in government. The Italian AI market favours partnerships between large system integrators and AI startups.",
        sortOrder: 1,
      },
      {
        statement:
          "Italy designated ACN (Agenzia per la Cybersicurezza Nazionale) and AGCOM as AI Act competent authorities. The government emphasizes AI in Made in Italy industries: fashion, food, automotive, and precision manufacturing. Tax credits of up to 40% are available for AI-related R&D and capital investments.",
        commentary:
          "Two key implications for enterprises: (1) ACN's dual role in cybersecurity and AI supervision means AI systems will be scrutinized through a security-first lens — ensure your AI tools meet NIS2 and AI Act requirements simultaneously. (2) The 40% R&D tax credit makes Italy attractive for AI deployment projects — if you're evaluating where to pilot AI in Europe, Italy's incentive structure is among the most generous. AGCOM's role as market surveillance authority means consumer-facing AI will get particular attention.",
        sortOrder: 2,
      },
    ],
  },

  {
    frameworkSlug: "national-ai-strategies",
    sectionTitle: "Nordic Countries — Collaborative AI Leadership",
    statements: [
      {
        statement:
          "The Nordic-Baltic Declaration on AI (2018, updated 2023) established a collaborative approach: shared AI testbeds, cross-border data sharing agreements, joint procurement standards, and harmonised regulatory interpretation. Sweden, Denmark, Finland, Norway, and Iceland coordinate through the Nordic Council of Ministers.",
        commentary:
          "The Nordic approach is uniquely collaborative — five countries coordinating as a bloc within the EU framework. For enterprises: a product certified in one Nordic country is likely accepted across all five, creating an efficient market of 27 million people with high AI adoption rates and strong digital infrastructure. The Nordic AI market punches above its weight: Finland's AI accelerator programme alone has trained 1% of its population in AI fundamentals.",
        sortOrder: 1,
      },
      {
        statement:
          "Denmark's National AI Strategy (updated 2024) focuses on responsible AI in healthcare (genome sequencing, drug discovery) and green transition (energy optimisation, precision agriculture). Sweden invests heavily in AI-powered defense and autonomous systems through FOI and AI Sweden. Finland's AI 4.0 programme prioritises AI in education and public services, with mandatory AI literacy in the national curriculum.",
        commentary:
          "Each Nordic country has a distinct AI strength: Denmark = healthcare AI (MedTech is 4% of GDP), Sweden = industrial AI and defence, Finland = education AI and public sector digitalisation, Norway = energy AI and maritime autonomy. For enterprises: the Nordic market rewards purpose-driven AI with measurable societal benefit. 'AI for good' is not just marketing — it's a procurement criterion. Environmental sustainability claims must be substantiated with data.",
        sortOrder: 2,
      },
    ],
  },

  {
    frameworkSlug: "national-ai-strategies",
    sectionTitle: "Poland — Emerging AI Hub & Digital Transformation",
    statements: [
      {
        statement:
          "Poland's AI Policy (Polityka rozwoju AI w Polsce, updated 2024) targets €2 billion in AI investment by 2027 through public-private partnerships. Key focus areas: AI talent development (Poland has 300,000+ IT professionals, the largest pool in Central-Eastern Europe), AI-powered public services, and supporting Polish AI startups to scale across the EU single market.",
        commentary:
          "Poland is Europe's largest nearshoring destination for IT talent, and AI is rapidly becoming a specialisation. For enterprises: Polish AI development teams offer strong technical capability at significantly lower cost than Western Europe. The talent pool includes graduates from top technical universities (Warsaw Polytechnic, AGH Krakow, Wroclaw Tech). AI regulatory compliance is handled by UOKiK (competition authority) and UODO (data protection authority), both actively building AI enforcement capacity.",
        sortOrder: 1,
      },
      {
        statement:
          "Poland's GovTech programme is one of the most active in the EU, with AI applications in tax administration (KAS — AI for fraud detection), healthcare (e-Zdrowie digital health platform), and education (AI tutoring pilots). The government launched an AI regulatory sandbox for public sector AI in 2025.",
        commentary:
          "Poland's public sector AI adoption is accelerating faster than most Western EU countries. The tax authority's AI fraud detection system is considered one of Europe's most advanced. For enterprises: if you're selling AI to EU government customers, Poland is a receptive market with actual deployed use cases (not just pilot projects). The regulatory sandbox for public sector AI provides a testing environment similar to Spain's AESIA but focused specifically on government applications.",
        sortOrder: 2,
      },
    ],
  },
];

// ─── Seed Runner ───────────────────────────────────────────

async function main() {
  console.log("Enriching frameworks (Batch 3): EBA/EIOPA deep-dive + MDR/IVDR SaMD + National Strategies...\n");

  for (const item of policyStatements) {
    const framework = await prisma.regulatoryFramework.findUnique({
      where: { slug: item.frameworkSlug },
    });
    if (!framework) {
      console.warn(`  ✗ Framework not found: ${item.frameworkSlug}`);
      continue;
    }

    // Find or create section
    let section = await prisma.frameworkSection.findFirst({
      where: {
        frameworkId: framework.id,
        title: item.sectionTitle,
      },
    });

    if (!section) {
      const maxOrder = await prisma.frameworkSection.aggregate({
        where: { frameworkId: framework.id },
        _max: { sortOrder: true },
      });
      section = await prisma.frameworkSection.create({
        data: {
          title: item.sectionTitle,
          frameworkId: framework.id,
          sortOrder: (maxOrder._max.sortOrder || 0) + 1,
        },
      });
    }

    // Upsert statements
    for (const stmt of item.statements) {
      const existing = await prisma.policyStatement.findFirst({
        where: {
          sectionId: section.id,
          statement: stmt.statement,
        },
      });

      if (!existing) {
        await prisma.policyStatement.create({
          data: {
            sectionId: section.id,
            statement: stmt.statement,
            commentary: stmt.commentary,
            sortOrder: stmt.sortOrder,
          },
        });
      }
    }

    console.log(
      `    ✓ ${item.frameworkSlug} → ${item.sectionTitle} (${item.statements.length} statements)`
    );
  }

  console.log("\nDone — enriched EBA/EIOPA, MDR/IVDR, and National AI Strategies.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
