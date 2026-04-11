/**
 * Regulatory Framework Enrichment — Deep content update
 *
 * Massively enriches the EU AI Act framework content with:
 * - Full enforcement timeline (2024-2027)
 * - Prohibited practices detail (Article 5)
 * - GPAI requirements (Articles 53-55)
 * - High-risk categories (Annex III)
 * - Penalty structure (Article 99)
 * - EU AI Office role
 * - National implementation status
 * - Enterprise compliance deadlines
 *
 * Also enriches GDPR, DORA, and other frameworks with procurement-relevant intel.
 *
 * Run with: npx tsx src/data/seed-framework-enrichment.ts
 * Safe to run multiple times (uses upsert on slug).
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// ─── Framework Content Updates ──────────────────────────────

const frameworkUpdates = [
  {
    slug: "eu-ai-act",
    content: `# EU AI Act (Regulation 2024/1689)

The world's first comprehensive legal framework for artificial intelligence. Entered into force **1 August 2024** with staggered enforcement through 2027.

## Enforcement Timeline

| Date | What applies |
|---|---|
| **2 Feb 2025** | Prohibited AI practices (Article 5) — already enforceable |
| **2 Aug 2025** | GPAI model obligations, governance (AI Office, AI Board), penalty regime |
| **2 Aug 2026** | High-risk AI system obligations (Annex III), transparency obligations (Article 50) |
| **2 Aug 2027** | Legacy GPAI models and Annex I high-risk systems |

## Risk Categories

- **Unacceptable Risk** — Banned outright (Article 5). 8 prohibited categories including social scoring, real-time biometric surveillance, emotion inference in workplaces, untargeted facial scraping.
- **High Risk** — Strict requirements (Annex III). Covers: biometrics, critical infrastructure, education, employment/recruitment, credit scoring, law enforcement, migration, justice.
- **Limited Risk** — Transparency obligations (Article 50). Users must know they're interacting with AI. AI-generated content must be labelled.
- **Minimal Risk** — No specific requirements. Voluntary codes of conduct.

## Prohibited Practices (Article 5) — In Force Now

Eight categories banned outright since 2 February 2025:
1. Subliminal/manipulative techniques causing significant harm
2. Exploitation of vulnerabilities (age, disability, socio-economic situation)
3. Social scoring leading to detrimental treatment
4. Individual criminal risk prediction based on profiling alone
5. Untargeted facial image scraping from internet/CCTV
6. Emotion inference in workplaces/education (except medical/safety)
7. Biometric categorisation by sensitive attributes (race, religion, orientation)
8. Real-time remote biometric identification in public spaces by law enforcement (narrow exceptions)

**Fine for violations: up to EUR 35M or 7% of global turnover.**

## GPAI Requirements (Articles 53-55) — In Force Since Aug 2025

All General-Purpose AI model providers must:
- Maintain technical documentation (training methods, data sources, evaluations)
- Publish a summary of training data content using the Commission's template
- Comply with EU Copyright Directive (opt-out mechanisms for rights holders)
- Share information with downstream providers integrating their models

**Models with systemic risk** (>10^25 FLOPs) must additionally: perform adversarial testing, assess and mitigate systemic risks, track and report serious incidents, ensure adequate cybersecurity.

The GPAI Code of Practice (final version July 2025) covers transparency, copyright, and safety. Adherence creates a presumption of compliance.

## High-Risk Categories (Annex III) — Enforceable Aug 2026

1. **Biometrics** — remote identification, categorisation, emotion recognition
2. **Critical infrastructure** — safety components in digital infrastructure, transport, utilities
3. **Education** — admissions, evaluation, monitoring, cheating detection
4. **Employment** — recruitment, CV screening, interviews, promotion, termination, task allocation, performance monitoring
5. **Essential services** — public benefits eligibility, credit scoring, life/health insurance risk assessment, emergency dispatch
6. **Law enforcement** — risk assessment, polygraphs, evidence evaluation, crime prediction, profiling
7. **Migration/asylum** — risk assessment, application examination, border surveillance
8. **Justice/democracy** — AI assisting courts, influencing elections/referendums

## Penalties (Article 99)

| Violation | Max Fine | % Turnover |
|---|---|---|
| Prohibited practices (Art. 5) | EUR 35,000,000 | 7% |
| High-risk/GPAI obligations | EUR 15,000,000 | 3% |
| False information to authorities | EUR 7,500,000 | 1% |

SMEs/startups: the lower amount applies (not higher), providing proportionality.

## EU AI Office

Established February 2024 within DG CONNECT. 125+ staff. Exclusive supervisor of GPAI model obligations. Key outputs: GPAI Code of Practice (July 2025), prohibited practices guidelines (Feb 2025), GPAI provider guidelines (July 2025). Enforcement powers for GPAI activate August 2026.

## National Implementation

- **Spain (AESIA)**: only fully operational regulatory sandbox, hosting 12 high-risk systems
- **5 Member States** actively implementing sandboxes
- **16 Member States** have not yet communicated plans
- Each state must have at least one sandbox operational by August 2026

## What Enterprises Should Do NOW

1. **Build an AI systems inventory** — catalogue all AI deployed or in development
2. **Classify by risk level** — prohibited / high-risk / limited / minimal
3. **Gap analysis** against high-risk requirements (Articles 8-15)
4. **Establish AI governance** — roles, responsibilities, cross-functional oversight
5. **Implement human oversight** for high-risk use cases
6. **Train staff** on AI literacy (Article 4 — already required since Feb 2025)
7. **Prepare technical documentation** and conformity assessment processes

**Deadline: 2 August 2026 — 4 months away.**`,
    criteriaCount: 65,
    purpose:
      "Establish a comprehensive, risk-based regulatory framework for AI systems in the EU, ensuring safety, fundamental rights protection, and innovation. The AI Act classifies AI systems by risk level and imposes proportional requirements — from outright bans on manipulative AI to transparency obligations for chatbots.",
  },

  {
    slug: "gdpr",
    content: `# GDPR (General Data Protection Regulation)

The EU's flagship data privacy law since May 2018. Applies to any organisation processing personal data of EU residents, regardless of where the organisation is based.

## Why It Matters for AI Procurement

Every AI tool that processes personal data must comply with GDPR. This includes:
- Customer data fed into AI chatbots
- Employee data used by HR AI tools
- User analytics processed by recommendation engines
- Training data that may contain personal information

## Core Principles (Article 5)

1. **Lawfulness, fairness, transparency** — you need a legal basis for processing
2. **Purpose limitation** — data collected for one purpose can't be repurposed without consent
3. **Data minimisation** — only collect what's strictly necessary
4. **Accuracy** — keep data up to date, correct inaccuracies
5. **Storage limitation** — don't keep data longer than needed
6. **Integrity and confidentiality** — protect data with appropriate security
7. **Accountability** — you must demonstrate compliance, not just claim it

## Key Rights for AI Context

- **Right to explanation** (Article 22) — individuals have the right not to be subject to decisions based solely on automated processing, including profiling. This directly impacts AI-powered credit scoring, recruitment, and insurance.
- **Right to access** — users can request what data you hold and how it's processed
- **Right to erasure** ("right to be forgotten") — users can demand deletion
- **Right to data portability** — users can take their data elsewhere
- **Right to object** — users can object to profiling

## AI-Specific Considerations

- **Article 22**: Automated decision-making with legal effects requires explicit consent OR must be necessary for a contract. Human review must be available.
- **Article 35**: Data Protection Impact Assessment (DPIA) mandatory for high-risk processing — most enterprise AI deployments qualify.
- **Article 28**: Data Processing Agreements (DPA) required with every AI vendor processing personal data.
- **Articles 44-49**: Cross-border transfers require adequacy decisions, SCCs, or BCRs. Critical for US-based AI vendors.

## What to Ask AI Vendors

1. Where is my data processed and stored? (EU residency?)
2. Is my data used for model training? (Must be opt-out at minimum)
3. Do you have a DPA that covers Article 28 requirements?
4. What sub-processors handle my data?
5. How do you handle data subject access/deletion requests?
6. What's your breach notification process? (72-hour rule)
7. Do you support DPIA with documentation?

## Penalties

- Up to EUR 20M or 4% of global annual turnover (whichever is higher)
- EUR 10M or 2% for lesser violations
- Notable fine: Italian Garante fined OpenAI EUR 15M (Dec 2024) for GDPR violations on consumer ChatGPT — later overturned on appeal`,
    criteriaCount: 38,
    purpose:
      "Protect the fundamental right to privacy for EU residents by regulating how organisations collect, process, store, and transfer personal data. For AI procurement, GDPR determines where your data can go, what vendors can do with it, and what rights your users retain.",
  },

  {
    slug: "dora",
    content: `# DORA (Digital Operational Resilience Act)

Applies to financial entities across the EU since **17 January 2025**. Covers banks, insurance companies, investment firms, payment institutions, and their critical ICT third-party service providers.

## Why It Matters for AI Procurement

If you're a financial institution buying AI tools, DORA adds a layer of ICT risk management requirements on top of GDPR and the AI Act. Your AI vendors may be designated as **Critical ICT Third-Party Service Providers (CTPPs)** — SAP was designated in November 2025.

## Five Pillars

### 1. ICT Risk Management (Articles 5-16)
- Board-level accountability for ICT risk
- Comprehensive ICT risk management framework
- Asset classification and risk assessment
- Business continuity and disaster recovery
- Annual review and testing

### 2. ICT Incident Reporting (Articles 17-23)
- Classify incidents by severity (major, significant, cyber)
- Report major incidents to competent authority within tight timelines
- Root cause analysis and remediation tracking
- Information sharing with relevant parties

### 3. Digital Operational Resilience Testing (Articles 24-27)
- Regular vulnerability assessments and scenario testing
- **Threat-Led Penetration Testing (TLPT)** every 3 years for significant entities
- Testing must cover critical ICT services including AI platforms
- Results reported to competent authority

### 4. ICT Third-Party Risk Management (Articles 28-44)
- **Register of all ICT third-party arrangements** — including AI vendors
- Pre-contractual due diligence and risk assessment
- Mandatory contract clauses: data location, audit rights, exit strategy
- Concentration risk monitoring
- Exit strategies and transition plans

### 5. Information Sharing (Article 45)
- Voluntary participation in cyber threat intelligence sharing
- Trusted communities for threat information exchange

## What to Ask AI Vendors (DORA-specific)

1. Are you designated as a CTPP? (Triggers additional ESA oversight)
2. Can you provide full sub-contractor chain visibility?
3. What are your incident reporting capabilities and timelines?
4. Do your contracts include DORA-mandated clauses (audit rights, data location, exit)?
5. Can you support our TLPT testing requirements?
6. What is your business continuity / disaster recovery posture?
7. What concentration risk do you represent? (How many financial clients depend on you?)

## Penalties

Determined by national competent authorities. ESAs can impose periodic penalty payments on CTPPs of up to 1% of average daily global turnover.`,
    criteriaCount: 32,
    purpose:
      "Ensure financial entities can withstand, respond to, and recover from ICT-related disruptions and threats. For AI procurement in financial services, DORA requires comprehensive vendor risk management, incident reporting, resilience testing, and contractual safeguards.",
  },
];

// ─── New framework sections (EU AI Act timeline) ────────────

const newSections = [
  {
    frameworkSlug: "eu-ai-act",
    sections: [
      {
        title: "Prohibited AI Practices (Article 5)",
        description:
          "Eight categories of AI systems banned outright in the EU since 2 February 2025. Violations carry fines up to EUR 35M or 7% of global turnover.",
        sortOrder: 0,
        statements: [
          {
            reference: "Article 5(1)(a)-(b)",
            statement:
              "AI systems that deploy subliminal techniques or exploit vulnerabilities of specific groups (age, disability, socio-economic situation) to materially distort behaviour causing significant harm are prohibited.",
            commentary:
              "If your AI tool could manipulate users into decisions they wouldn't otherwise make — especially vulnerable users — it's banned. This covers dark patterns in AI-driven marketing, predatory pricing algorithms, and manipulative chatbot behaviours.",
            sortOrder: 0,
          },
          {
            reference: "Article 5(1)(c)-(d)",
            statement:
              "Social scoring systems and individual criminal risk prediction based solely on profiling are prohibited.",
            commentary:
              "No AI system can rate individuals based on social behaviour over time in ways that lead to detrimental treatment. Criminal risk prediction must be based on objective facts linked to criminal activity, not profiling alone.",
            sortOrder: 1,
          },
          {
            reference: "Article 5(1)(e)-(h)",
            statement:
              "Untargeted facial scraping, workplace emotion inference, biometric categorisation by sensitive attributes, and real-time remote biometric identification in public spaces are prohibited (with narrow law enforcement exceptions).",
            commentary:
              "If you're evaluating AI tools for HR, security, or identity — check that they don't use any of these banned techniques. Emotion detection in employee monitoring tools is explicitly banned except for medical/safety purposes.",
            sortOrder: 2,
          },
        ],
      },
      {
        title: "GPAI Model Obligations (Articles 53-55)",
        description:
          "Requirements for General-Purpose AI model providers, in force since August 2025. Covers transparency, copyright, and systemic risk.",
        sortOrder: 1,
        statements: [
          {
            reference: "Article 53",
            statement:
              "All GPAI providers must maintain technical documentation, publish training data summaries, comply with EU Copyright Directive, and share information with downstream providers.",
            commentary:
              "When evaluating GPT-4, Claude, Gemini, Mistral or any foundation model — ask for their Article 53 compliance documentation. The GPAI Code of Practice (July 2025) provides the template. Adherence creates a presumption of compliance.",
            sortOrder: 0,
          },
          {
            reference: "Article 55",
            statement:
              "GPAI models with systemic risk (>10^25 FLOPs or designated by Commission) must perform adversarial testing, assess systemic risks, report serious incidents, and ensure cybersecurity.",
            commentary:
              "GPT-4, Claude Opus, Gemini Ultra, and Mistral Large likely qualify. Ask vendors: have you been designated as systemic risk? What adversarial testing have you performed? What's your incident reporting process?",
            sortOrder: 1,
          },
        ],
      },
      {
        title: "High-Risk AI Requirements (Articles 8-15)",
        description:
          "Full compliance framework for high-risk AI systems. Enforceable from 2 August 2026. Covers risk management, data governance, documentation, human oversight, accuracy, and robustness.",
        sortOrder: 2,
        statements: [
          {
            reference: "Articles 8-9",
            statement:
              "High-risk AI systems must implement a risk management system — continuous, iterative process covering identification, analysis, estimation, and evaluation of risks. Must include testing and validation.",
            commentary:
              "Ask AI vendors: do you have a documented risk management system for your AI? Can you demonstrate continuous risk monitoring? This is not a one-time checklist — it's an ongoing process that must cover the entire lifecycle.",
            sortOrder: 0,
          },
          {
            reference: "Article 10",
            statement:
              "Training, validation, and testing data must meet quality criteria: relevance, representativeness, accuracy, completeness. Bias examination and mitigation required.",
            commentary:
              "Data governance is where most AI systems fail compliance. Ask: what data was used to train the model? How was bias examined? Are there demographic gaps? What about EU language representation?",
            sortOrder: 1,
          },
          {
            reference: "Articles 13-14",
            statement:
              "High-risk AI must be transparent (Article 13) and enable human oversight (Article 14). Users must understand the system's capabilities and limitations. Human intervention must be possible.",
            commentary:
              "The AI Act requires a 'kill switch' and audit trail. A human must be able to override or stop the AI's decisions. Ask vendors: can a human reviewer override AI recommendations? Is there an audit log of all AI decisions?",
            sortOrder: 2,
          },
        ],
      },
      {
        title: "Enforcement Timeline & Compliance Deadlines",
        description:
          "Staggered enforcement from 2024-2027. Key deadline for enterprises: 2 August 2026 for Annex III high-risk systems.",
        sortOrder: 3,
        statements: [
          {
            reference: "Article 113",
            statement:
              "Full timeline: Prohibited practices (Feb 2025), GPAI obligations (Aug 2025), high-risk Annex III (Aug 2026), legacy systems (Aug 2027).",
            commentary:
              "Enterprises have until 2 August 2026 — 4 months away — to comply with high-risk requirements. Start NOW: build your AI inventory, classify systems by risk, conduct gap analysis, establish governance, train staff on AI literacy (already required since Feb 2025).",
            sortOrder: 0,
          },
          {
            reference: "Article 99",
            statement:
              "Fines: EUR 35M / 7% turnover for prohibited practices, EUR 15M / 3% for high-risk/GPAI violations, EUR 7.5M / 1% for false information. SMEs get the lower cap.",
            commentary:
              "The penalty regime is already active. While high-risk enforcement starts Aug 2026, prohibited practices fines have been applicable since Feb 2025. The AI Office has 125+ staff and enforcement powers for GPAI from Aug 2026.",
            sortOrder: 1,
          },
        ],
      },
    ],
  },
];

// ─── Seed runner ────────────────────────────────────────────

async function main() {
  console.log("Enriching regulatory frameworks...\n");

  // 1. Update framework content
  for (const fw of frameworkUpdates) {
    await prisma.regulatoryFramework.update({
      where: { slug: fw.slug },
      data: {
        content: fw.content,
        criteriaCount: fw.criteriaCount,
        purpose: fw.purpose,
      },
    });
    console.log(`  ✓ Updated content: ${fw.slug}`);
  }

  // 2. Add new sections and statements for EU AI Act
  for (const item of newSections) {
    const framework = await prisma.regulatoryFramework.findUnique({
      where: { slug: item.frameworkSlug },
    });
    if (!framework) continue;

    for (const section of item.sections) {
      const { statements, ...sectionData } = section;

      // Upsert section by title + framework
      const existingSection = await prisma.frameworkSection.findFirst({
        where: {
          frameworkId: framework.id,
          title: sectionData.title,
        },
      });

      let sectionRecord;
      if (existingSection) {
        sectionRecord = await prisma.frameworkSection.update({
          where: { id: existingSection.id },
          data: sectionData,
        });
      } else {
        sectionRecord = await prisma.frameworkSection.create({
          data: {
            ...sectionData,
            frameworkId: framework.id,
          },
        });
      }

      // Upsert statements
      for (const stmt of statements) {
        const existingStmt = await prisma.policyStatement.findFirst({
          where: {
            sectionId: sectionRecord.id,
            reference: stmt.reference,
          },
        });

        if (existingStmt) {
          await prisma.policyStatement.update({
            where: { id: existingStmt.id },
            data: stmt,
          });
        } else {
          await prisma.policyStatement.create({
            data: {
              ...stmt,
              sectionId: sectionRecord.id,
            },
          });
        }
      }

      console.log(`  ✓ Section: ${sectionData.title} (${statements.length} statements)`);
    }
  }

  console.log("\nDone — frameworks enriched.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
