/**
 * Framework Enrichment — Batch 2: EU AI Act Timeline + GDPR Procurement Checklist
 *
 * Adds deeper content to existing frameworks:
 * - EU AI Act: 2024-2027 enforcement timeline, prohibited practices detail
 * - GDPR: practical procurement compliance checklist
 * - Cross-framework mappings: GDPR↔AI Act, DORA↔NIS2
 *
 * Run with: npx tsx src/data/seed-framework-enrichment-batch2.ts
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
  // ── EU AI Act: Enforcement Timeline ──────────────────────
  {
    frameworkSlug: "eu-ai-act",
    sectionTitle: "Enforcement Timeline (2024-2027)",
    statements: [
      {
        statement:
          "1 August 2024: EU AI Act entered into force (Regulation 2024/1689). The 24-month transition period begins for most provisions.",
        commentary:
          "The AI Act was published in the Official Journal on 12 July 2024 and entered into force on 1 August 2024. While most obligations don't apply immediately, organizations should start compliance preparations now — the timeline is tight for complex AI systems already in production.",
        sortOrder: 1,
      },
      {
        statement:
          "2 February 2025: Prohibited AI practices banned (Chapter II). AI systems posing unacceptable risk can no longer be placed on the EU market or used.",
        commentary:
          "The first hard deadline. Prohibited practices include: social scoring by public authorities, real-time remote biometric identification in public spaces (with narrow exceptions), emotion recognition in workplaces and education, untargeted facial image scraping, AI that exploits vulnerabilities of age/disability/social situation, and subliminal manipulation techniques. Organizations must audit their AI portfolio immediately.",
        sortOrder: 2,
      },
      {
        statement:
          "2 August 2025: Obligations for General-Purpose AI (GPAI) model providers apply (Chapter V). National competent authorities must be designated.",
        commentary:
          "GPAI providers (OpenAI, Google, Anthropic, Mistral, etc.) must: publish technical documentation, comply with EU copyright law, publish training data summaries. Systemic risk models (>10^25 FLOPs) face additional obligations: adversarial testing, incident monitoring, cybersecurity measures. EU AI Office oversees GPAI compliance. Member states must designate competent authorities.",
        sortOrder: 3,
      },
      {
        statement:
          "2 August 2026: Full application of high-risk AI system requirements (Chapter III). Conformity assessment procedures, registration in EU database, and quality management systems mandatory.",
        commentary:
          "The big deadline. High-risk AI systems must: implement risk management systems (Article 9), ensure data governance (Article 10), maintain technical documentation (Article 11), enable logging (Article 12), provide transparency to users (Article 13), allow human oversight (Article 14), meet accuracy/robustness/cybersecurity standards (Article 15). Conformity assessments required before market placement.",
        sortOrder: 4,
      },
      {
        statement:
          "2 August 2027: Full application for high-risk AI systems that are safety components of products already covered by EU harmonization legislation (Annex I, Section A).",
        commentary:
          "Extended timeline for AI embedded in already-regulated products: medical devices (MDR/IVDR), machinery, toys, lifts, equipment for explosive atmospheres, radio equipment, civil aviation, motor vehicles, and marine equipment. These AI systems go through existing sectoral conformity assessment procedures with AI Act requirements integrated.",
        sortOrder: 5,
      },
    ],
  },

  // ── EU AI Act: Prohibited Practices Detail ───────────────
  {
    frameworkSlug: "eu-ai-act",
    sectionTitle: "Prohibited AI Practices (Article 5)",
    statements: [
      {
        statement:
          "AI systems that deploy subliminal, manipulative, or deceptive techniques to materially distort behavior, causing significant harm to individuals, are prohibited.",
        commentary:
          "Article 5(1)(a). Covers dark patterns in AI: chatbots designed to manipulate purchase decisions, AI-generated content designed to deceive, and systems that exploit cognitive biases. 'Significant harm' includes financial, psychological, and physical harm. Review your AI-powered marketing, sales, and customer interaction tools.",
        sortOrder: 1,
      },
      {
        statement:
          "AI systems that exploit vulnerabilities due to age, disability, or social/economic situation to materially distort behavior, causing significant harm, are prohibited.",
        commentary:
          "Article 5(1)(b). Protects vulnerable groups. AI systems targeting elderly people with confusing interfaces, children with addictive features, or economically disadvantaged people with predatory pricing are banned. Audit AI tools that interact with or affect vulnerable populations.",
        sortOrder: 2,
      },
      {
        statement:
          "AI systems that evaluate or classify individuals based on social behavior or personal characteristics, leading to detrimental or disproportionate treatment (social scoring), are prohibited.",
        commentary:
          "Article 5(1)(c). Bans social scoring by public AND private entities (broader than original draft which only covered public authorities). Includes: AI-based credit scoring using social media behavior, employee ranking based on non-work personal characteristics, and customer classification leading to service discrimination. Review any AI scoring system for social scoring elements.",
        sortOrder: 3,
      },
      {
        statement:
          "Real-time remote biometric identification systems in publicly accessible spaces for law enforcement purposes are prohibited, with narrow exceptions for targeted search of missing persons, prevention of imminent terrorist threats, and identification of suspects of serious crimes.",
        commentary:
          "Article 5(1)(h). The most debated provision. Near-total ban on real-time facial recognition in public spaces for law enforcement. Exceptions require prior judicial authorization (or urgent ex-post authorization within 48 hours). Does NOT ban: biometric verification (1:1 matching, e.g., phone unlock), private space biometrics, or biometric categorization for access control.",
        sortOrder: 4,
      },
      {
        statement:
          "Untargeted scraping of facial images from the internet or CCTV footage to create facial recognition databases is prohibited.",
        commentary:
          "Article 5(1)(e). Directly targets companies like Clearview AI. Any AI vendor whose facial recognition model was trained on scraped internet images is non-compliant. Due diligence required: ask your AI vendor about training data provenance for any biometric or image recognition features.",
        sortOrder: 5,
      },
      {
        statement:
          "AI systems that infer emotions of individuals in the workplace or educational institutions are prohibited, except for medical or safety reasons.",
        commentary:
          "Article 5(1)(f). Bans emotion recognition AI in workplaces and schools. This includes: AI analyzing facial expressions in video calls, voice tone analysis for employee sentiment, and student attention monitoring. Exceptions: detecting drowsy drivers (safety), detecting pain in patients (medical). Review any HR tech, proctoring, or employee monitoring AI for emotion inference.",
        sortOrder: 6,
      },
    ],
  },

  // ── GDPR: Procurement Compliance Checklist ──────────────
  {
    frameworkSlug: "gdpr",
    sectionTitle: "AI Procurement Compliance Checklist",
    statements: [
      {
        statement:
          "Before procuring any AI tool that processes personal data, conduct a Data Protection Impact Assessment (DPIA) under Article 35 — mandatory when processing involves new technologies and is likely to result in high risk to individuals.",
        commentary:
          "A DPIA is legally required for AI tools that: profile individuals, process special categories of data, make automated decisions with legal effects, systematically monitor public areas, or process large-scale personal data. Start the DPIA before procurement, not after deployment. Document: purpose, necessity, proportionality, risks to data subjects, and mitigation measures.",
        sortOrder: 1,
      },
      {
        statement:
          "Establish a valid legal basis under Article 6 for each AI processing activity. Consent, legitimate interest, and contractual necessity are the most common bases — each has specific requirements for AI.",
        commentary:
          "Legitimate interest (Art 6(1)(f)) is common for AI but requires a balancing test. Consent (Art 6(1)(a)) must be freely given, specific, informed, and unambiguous — and withdrawable at any time. For AI: can you still operate the system if a user withdraws consent? If not, consent may not be the right basis. Never rely on one legal basis for all AI processing — map each data flow individually.",
        sortOrder: 2,
      },
      {
        statement:
          "Ensure a Data Processing Agreement (DPA) under Article 28 is in place with every AI vendor processing personal data on your behalf, covering: subject matter, duration, nature and purpose, types of personal data, categories of data subjects, and obligations of the processor.",
        commentary:
          "A DPA is not optional — it's a legal requirement. Key clauses to verify: sub-processor notification and approval rights, data deletion/return on contract end, audit rights, data breach notification (without undue delay, ideally within 24-48 hours), and prohibition on processing data for vendor's own purposes. Template DPAs from vendors are a starting point — negotiate terms that protect your interests.",
        sortOrder: 3,
      },
      {
        statement:
          "Verify the AI vendor's international data transfer mechanisms under Chapter V (Articles 44-49). Standard Contractual Clauses (SCCs), adequacy decisions, or Binding Corporate Rules (BCRs) must be in place for any transfer outside the EEA.",
        commentary:
          "Post-Schrems II, SCCs alone may not be sufficient — you must conduct a Transfer Impact Assessment (TIA) evaluating the destination country's surveillance laws. Practical checks: Where does the AI vendor process data? Where do sub-processors process data? Does the vendor have EU data residency? Can you contractually restrict processing to the EU? US vendors with EU-US Data Privacy Framework (DPF) certification have an adequacy basis — verify DPF status at dataprivacyframework.gov.",
        sortOrder: 4,
      },
      {
        statement:
          "Implement data subject rights workflows for AI processing under Articles 15-22: right of access, rectification, erasure, restriction, data portability, objection, and the right not to be subject to solely automated decision-making.",
        commentary:
          "Article 22 is critical for AI: individuals have the right not to be subject to decisions based solely on automated processing that produce legal effects or similarly significant effects. Safeguards required: right to obtain human intervention, right to express their point of view, right to contest the decision. Verify your AI vendor supports these workflows — can you override AI decisions? Can you explain how a decision was reached?",
        sortOrder: 5,
      },
      {
        statement:
          "Apply data minimization (Article 5(1)(c)) and purpose limitation (Article 5(1)(b)) principles to all AI processing — collect only the personal data strictly necessary for the specified AI purpose, and do not repurpose data without a compatible legal basis.",
        commentary:
          "AI systems are data-hungry by design — this creates tension with GDPR minimization. Practical approach: define the minimum data set required for acceptable AI performance; document why each data field is necessary; implement technical controls (anonymization, pseudonymization, aggregation) to reduce personal data exposure; and review regularly whether all collected data is still necessary as models improve.",
        sortOrder: 6,
      },
      {
        statement:
          "Ensure AI vendor transparency under Article 13-14: data subjects must be informed about AI processing, including the existence of automated decision-making, meaningful information about the logic involved, and the significance and envisaged consequences.",
        commentary:
          "Privacy notices must be updated when deploying AI tools. Inform users: that AI is being used, what data feeds the AI, the logic of automated decisions (in understandable terms), and the consequences. For employee-facing AI: works councils or employee representatives may need to be consulted. For customer-facing AI: update terms of service and privacy policies before deployment.",
        sortOrder: 7,
      },
    ],
  },

  // ── Cross-Framework: GDPR ↔ AI Act Mapping ──────────────
  {
    frameworkSlug: "eu-ai-act",
    sectionTitle: "GDPR ↔ AI Act Compliance Mapping",
    statements: [
      {
        statement:
          "AI Act Article 9 (Risk Management) maps to GDPR Article 35 (DPIA): both require systematic risk assessment before deploying AI systems that process personal data. A single integrated assessment can satisfy both requirements.",
        commentary:
          "Practical approach: combine your DPIA and AI Act risk management system into one process. The AI Act risk management system (Article 9) requires: identification and analysis of known and foreseeable risks, estimation and evaluation of risks, and adoption of risk management measures. GDPR's DPIA covers similar ground from a data protection angle. One assessment, two compliance outputs.",
        sortOrder: 1,
      },
      {
        statement:
          "AI Act Article 10 (Data Governance) maps to GDPR Articles 5, 25 (Data Principles, Data Protection by Design): both require data quality, purpose limitation, and data minimization. The AI Act adds AI-specific requirements on training data representativeness and bias detection.",
        commentary:
          "Key overlap: GDPR data minimization + AI Act training data quality. Key difference: the AI Act explicitly requires testing for bias in training data (Article 10(2)(f)) and allows processing special categories of data for bias monitoring (Article 10(5)) — something GDPR generally restricts. This is a notable expansion: you can process sensitive data specifically to detect and correct AI bias, under appropriate safeguards.",
        sortOrder: 2,
      },
      {
        statement:
          "AI Act Article 14 (Human Oversight) maps to GDPR Article 22 (Automated Decision-Making): both require meaningful human involvement in AI decisions affecting individuals. The AI Act goes further by specifying technical measures for human oversight.",
        commentary:
          "GDPR Article 22 gives individuals the right not to be subject to solely automated decisions with legal/significant effects. AI Act Article 14 requires deployers to: understand system capabilities and limitations, interpret outputs correctly, decide not to use the system or override outputs, and intervene or halt the system. For high-risk AI: human oversight is a design requirement, not just a process requirement.",
        sortOrder: 3,
      },
    ],
  },

  // ── DORA: Vendor Assessment Template ─────────────────────
  {
    frameworkSlug: "dora",
    sectionTitle: "AI Vendor Assessment Template (Article 28-30)",
    statements: [
      {
        statement:
          "Before entering into a contractual arrangement with an ICT third-party service provider, financial entities shall assess whether the arrangement covers the use of ICT services supporting critical or important functions, and if so, apply enhanced due diligence requirements.",
        commentary:
          "Article 28(1) requires a risk-based assessment before procurement. For AI vendors: classify each AI tool as supporting critical/important functions or not. Critical functions include: customer-facing decision systems, fraud detection, credit scoring, AML, and core banking. AI tools supporting these require the full DORA vendor assessment.",
        sortOrder: 1,
      },
      {
        statement:
          "Contractual arrangements with ICT third-party providers supporting critical or important functions shall include: (a) clear descriptions of all functions and services; (b) quantitative and qualitative performance targets; (c) notice periods and reporting obligations for incidents; (d) business continuity measures; (e) termination rights and exit strategies.",
        commentary:
          "Article 30(2) mandates specific contractual clauses. AI vendor contract checklist: 1) Define AI service scope with measurable SLAs (uptime, latency, accuracy). 2) Set performance benchmarks with consequences for underperformance. 3) Require incident notification within 24 hours. 4) Document failover and disaster recovery for AI-dependent processes. 5) Include exit provisions with minimum 6-month transition support and data return in standard formats.",
        sortOrder: 2,
      },
      {
        statement:
          "Financial entities shall ensure the right to access, inspect, and audit the ICT third-party service provider, and shall agree on the exercise of those rights in the contractual arrangement.",
        commentary:
          "Article 30(3)(e) establishes audit rights. For AI vendors: negotiate the right to audit AI model performance, data handling practices, and security controls. Include: on-site inspection rights (or pooled audit arrangements), access to SOC 2/ISO 27001 reports, right to commission third-party penetration testing, and access to AI model performance metrics. Pooled audits (multiple customers sharing one audit) are explicitly permitted to reduce vendor burden.",
        sortOrder: 3,
      },
      {
        statement:
          "Contractual arrangements shall include provisions on data access, recovery, and return in the event of insolvency, resolution, or discontinuation of operations of the ICT third-party service provider.",
        commentary:
          "Article 30(2)(g) addresses worst-case scenarios. For AI vendors: ensure your contract covers: data return within 30 days of termination, data format requirements (standard, machine-readable), escrow arrangements for critical AI models, and transition plans if the vendor fails. This is especially critical for AI vendors — if your fraud detection AI vendor goes bankrupt, you need your data and model configurations back immediately.",
        sortOrder: 4,
      },
      {
        statement:
          "Financial entities shall maintain and update a register of information on all contractual arrangements with ICT third-party service providers, distinguishing between those supporting critical or important functions and those that do not.",
        commentary:
          "Article 28(3) requires a central register. Build an AI vendor register that includes: vendor name and jurisdiction, services provided, criticality classification, contract details (start/end, renewal terms), subcontractor chains, data processing locations, incident history, and last audit date. This register must be available to competent authorities on request. Update it whenever you add or change an AI vendor.",
        sortOrder: 5,
      },
      {
        statement:
          "Financial entities shall assess the concentration risk arising from ICT third-party service provider arrangements, considering the substitutability of the provider, the potential impact of disruptions, and the provider's systemic importance.",
        commentary:
          "Article 29 addresses concentration risk — critical for AI. If all your AI tools run on one cloud provider (e.g., Azure) or use one model provider (e.g., OpenAI), you have concentration risk. Assessment checklist: 1) Map all AI vendors to their underlying infrastructure providers. 2) Identify single points of failure. 3) Evaluate substitutability — can you switch within 30 days? 4) Consider geographic concentration — are all vendors US-based? 5) Document mitigation strategies (multi-cloud, multi-model approaches).",
        sortOrder: 6,
      },
    ],
  },

  // ── Cross-Framework: DORA ↔ NIS2 Overlap ────────────────
  {
    frameworkSlug: "nis2",
    sectionTitle: "DORA ↔ NIS2 Overlap Guidance",
    statements: [
      {
        statement:
          "For financial sector entities, DORA (Regulation 2022/2554) is lex specialis — it takes precedence over NIS2 for ICT risk management. However, NIS2 applies to financial entities for general cybersecurity governance outside the ICT-specific scope.",
        commentary:
          "Article 4 of NIS2 explicitly recognizes DORA as sector-specific legislation. Financial entities must comply with DORA for ICT risk management, incident reporting, testing, and third-party risk. NIS2 still applies for: general cybersecurity governance measures, non-ICT supply chain security, physical security of network/information systems, and cross-sector incident coordination.",
        sortOrder: 1,
      },
      {
        statement:
          "Incident reporting under DORA (24h initial, 72h intermediate, 1 month final) mirrors NIS2 timelines but is reported to financial supervisors (ECB, EBA, ESMA) rather than CSIRTs. Financial entities do not need to dual-report to both.",
        commentary:
          "Key difference: DORA incidents go to financial supervisory authorities; NIS2 incidents go to national CSIRTs. For financial entities, DORA reporting satisfies the NIS2 requirement (no double-reporting needed). However, non-ICT cybersecurity incidents at financial entities may still fall under NIS2 reporting. When in doubt: report to both — over-reporting is always safer than under-reporting.",
        sortOrder: 2,
      },
      {
        statement:
          "ICT third-party risk management under DORA (Articles 28-30) is more prescriptive than NIS2 supply chain requirements. Financial entities procuring AI tools should follow DORA's specific contractual requirements rather than NIS2's general supply chain provisions.",
        commentary:
          "DORA Article 30 mandates specific contractual clauses with ICT providers: service descriptions with quantitative/qualitative performance targets, data access/recovery/return rights, notification obligations for incidents and subcontracting, exit strategies with mandatory transition periods, and audit/inspection rights. NIS2 Article 21(2)(d) is more general. For AI procurement in financial services: use DORA Article 30 requirements as your contract baseline — they're more specific and enforceable.",
        sortOrder: 3,
      },
    ],
  },
];

// ─── Seed Runner ───────────────────────────────────────────

async function main() {
  console.log("Enriching existing regulatory frameworks (Batch 2)...\n");

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

  console.log("\nDone — enriched existing frameworks with new sections.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
