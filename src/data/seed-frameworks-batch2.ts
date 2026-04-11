/**
 * Regulatory Framework Enrichment — Batch 2: NIS2, ISO 42001, NIST AI RMF
 *
 * Adds three new frameworks critical for enterprise AI procurement:
 * - NIS2 Directive: cybersecurity requirements affecting AI tool selection
 * - ISO 42001: AI management system standard
 * - NIST AI RMF: US framework with global relevance
 *
 * Run with: npx tsx src/data/seed-frameworks-batch2.ts
 * Safe to run multiple times (uses upsert on slug).
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// ─── New Framework Definitions ─────────────────────────────

const frameworks = [
  // ── NIS2 Directive ─────────────────────────────────────────
  {
    slug: "nis2",
    name: "NIS2 Directive",
    description:
      "The Network and Information Security Directive 2 (EU 2022/2555) is the EU's updated cybersecurity legislation. It expands the scope of the original NIS Directive to cover more sectors and imposes stricter security requirements, incident reporting obligations, and supply chain risk management. Directly impacts AI tool procurement as organizations must ensure their AI vendors meet cybersecurity standards.",
    content: `## NIS2 Directive — Cybersecurity Requirements for AI Procurement

### Overview

The NIS2 Directive (Directive (EU) 2022/2555) replaces the original NIS Directive (2016/1148) with significantly expanded scope and stricter requirements. It applies to a much broader range of organizations and introduces harmonized cybersecurity standards across the EU.

**Key change from NIS1**: The scope expanded from ~100 operators per member state to potentially tens of thousands of organizations. If your organization uses AI tools in critical operations, NIS2 almost certainly applies.

### Who Must Comply

**Essential Entities** (Article 3(1)) — stricter supervision:
- Energy (electricity, oil, gas, hydrogen, district heating)
- Transport (air, rail, water, road)
- Banking and financial market infrastructure
- Health (hospitals, labs, pharma manufacturing)
- Drinking water and wastewater
- Digital infrastructure (DNS, TLD, cloud, data centers, CDNs, trust services)
- ICT service management (B2B — MSPs and MSSPs)
- Public administration (central government)
- Space

**Important Entities** (Article 3(2)) — lighter supervision:
- Postal and courier services
- Waste management
- Chemicals manufacturing
- Food production and distribution
- Manufacturing (medical devices, electronics, machinery, motor vehicles)
- Digital providers (online marketplaces, search engines, social networks)
- Research organizations

### Size Threshold

Applies to medium and large organizations: **50+ employees OR €10M+ annual turnover**. Some entities apply regardless of size (DNS, TLD registries, trust services, sole providers of essential services).

### Key Requirements for AI Tool Procurement

**1. Risk Management (Article 21)**
Organizations must implement technical, operational, and organizational measures proportionate to the risks. When procuring AI tools, this means:
- Risk assessment of AI vendor security posture
- Evaluation of AI tool vulnerability to adversarial attacks
- Assessment of AI supply chain risks (training data, model provenance)

**2. Supply Chain Security (Article 21(2)(d))**
This is the critical article for AI procurement:
- Assess cybersecurity practices of AI tool vendors
- Include security requirements in AI vendor contracts
- Monitor supply chain risks continuously
- Evaluate dependencies on non-EU AI providers

**3. Incident Handling (Article 23)**
Strict reporting timelines for significant incidents:
- **24 hours**: Early warning to CSIRT/competent authority
- **72 hours**: Full incident notification with assessment
- **1 month**: Final report with root cause analysis
- AI-related security incidents (data poisoning, model theft, adversarial attacks) fall under these timelines

**4. Business Continuity (Article 21(2)(c))**
- Backup management and disaster recovery for AI-dependent processes
- Crisis management procedures when AI tools are compromised
- Vendor lock-in risk assessment for critical AI systems

**5. Cyber Hygiene and Training (Article 21(2)(g))**
- Staff training on AI-specific security risks
- Awareness of AI-generated phishing and deepfakes
- Secure configuration practices for AI deployments

### Penalties

**Essential entities**: Up to €10,000,000 or 2% of global annual turnover (whichever is higher)
**Important entities**: Up to €7,000,000 or 1.4% of global annual turnover (whichever is higher)

Management bodies can be held **personally liable** and temporarily banned from exercising management functions (Article 32(5)).

### Implementation Timeline

- **16 January 2023**: NIS2 entered into force
- **17 October 2024**: Transposition deadline for member states
- **17 April 2025**: Member states must establish list of essential/important entities
- **17 October 2027**: Commission reviews the directive

**Status (April 2026)**: Most member states have transposed NIS2 into national law. Some delays in implementation acts for specific sectors. National CSIRTs are operational.

### NIS2 ↔ DORA Overlap

For financial sector entities, DORA (Regulation 2022/2554) is considered *lex specialis* — it takes precedence over NIS2 for ICT risk management. However:
- NIS2 still applies to financial entities for general cybersecurity governance
- AI tools used outside ICT-specific contexts may fall under NIS2 rather than DORA
- Organizations must comply with both where scopes overlap

### NIS2 ↔ EU AI Act Interaction

- AI systems classified as high-risk under the EU AI Act may also trigger NIS2 obligations
- Cybersecurity of AI systems is explicitly referenced in the AI Act (Article 15)
- Organizations deploying high-risk AI in NIS2 sectors face dual compliance requirements
- The EU AI Office and ENISA coordinate on AI cybersecurity guidance

### What This Means for Your AI Procurement

**Before selecting an AI vendor, verify**:
1. Vendor's cybersecurity certifications (ISO 27001, SOC 2, C5)
2. Incident response procedures and notification capabilities
3. Supply chain transparency (sub-processors, data centers, model training infrastructure)
4. Business continuity guarantees and SLAs
5. EU data processing location and data sovereignty controls
6. Vendor's own NIS2 compliance status (if they're a digital infrastructure provider)`,
    badgeType: "EU",
    criteriaCount: 21,
    effectiveDate: "Oct 2024",
    issuingAuthority: "European Parliament & Council of the EU",
    enforcementType: "Legal — Binding directive requiring national transposition",
    maxPenalty:
      "Up to €10M or 2% of global annual turnover for essential entities; €7M or 1.4% for important entities. Personal liability for management.",
    applicableRegions: "All EU/EEA member states (national transposition required)",
    purpose:
      "Establish a high common level of cybersecurity across the EU by setting minimum security requirements, incident reporting obligations, and supply chain risk management for essential and important entities.",
    officialUrl:
      "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32022L2555",
    industrySlugs: [
      "financial-services",
      "healthcare",
      "energy",
      "telecommunications",
      "manufacturing",
      "public-sector",
    ],
  },

  // ── ISO 42001 ──────────────────────────────────────────────
  {
    slug: "iso-42001",
    name: "ISO/IEC 42001:2023",
    description:
      "The world's first international standard for AI Management Systems (AIMS). Published December 2023, ISO/IEC 42001 provides a framework for organizations developing, providing, or using AI systems to manage risks and demonstrate responsible AI practices. Certification is increasingly required in enterprise procurement.",
    content: `## ISO/IEC 42001:2023 — AI Management System Standard

### Overview

ISO/IEC 42001:2023 is the first international management system standard specifically for Artificial Intelligence. Published in December 2023, it provides requirements for establishing, implementing, maintaining, and continuously improving an AI Management System (AIMS) within organizations.

It follows the Annex SL high-level structure common to ISO 9001 (quality), ISO 27001 (information security), and ISO 14001 (environmental management), making integration straightforward for organizations already certified to these standards.

### Why It Matters for AI Procurement

ISO 42001 certification is rapidly becoming a differentiator in enterprise AI procurement:
- **Trust signal**: Demonstrates vendor has systematic AI risk management
- **EU AI Act alignment**: Maps to many AI Act requirements (Article 9 risk management, Article 15 accuracy/robustness)
- **Procurement shortcut**: Reduces due diligence burden — certified vendors have already addressed key concerns
- **Board-level assurance**: Provides auditable evidence of responsible AI governance

### Key Requirements

**4. Context of the Organization**
- Understand stakeholder needs and expectations regarding AI
- Determine the scope of the AI management system
- Identify AI-related risks and opportunities

**5. Leadership**
- Top management commitment to responsible AI
- AI policy establishment and communication
- Organizational roles and responsibilities for AI governance

**6. Planning**
- AI risk assessment methodology
- AI risk treatment plans
- Objectives for AI system performance, fairness, transparency, and safety

**7. Support**
- Competence requirements for AI practitioners
- Awareness of AI policy and responsibilities
- Communication of AI-related information to stakeholders
- Documented information management

**8. Operation**
- AI system lifecycle management
- AI impact assessment (pre-deployment)
- Data management for AI (quality, bias, provenance)
- Third-party AI component management
- AI system development, testing, and validation
- AI system deployment and monitoring

**9. Performance Evaluation**
- Monitoring and measurement of AI system performance
- Internal audit of AIMS
- Management review of AI governance effectiveness

**10. Improvement**
- Nonconformity management and corrective action
- Continual improvement of AIMS

### Annex A — AI Controls Reference

ISO 42001 includes a set of controls (similar to ISO 27001 Annex A) specifically for AI:

- **A.2**: AI Policy
- **A.3**: Internal organization for AI
- **A.4**: Resources for AI systems
- **A.5**: Assessing impacts of AI systems
- **A.6**: AI system lifecycle
- **A.7**: Data for AI systems (quality, labeling, bias management)
- **A.8**: AI transparency and information provision
- **A.9**: AI system use and third-party relationships
- **A.10**: Relationships with interested parties

### Annex B — AI Risk Sources

Comprehensive catalogue of AI-specific risk sources:
- Training data risks (bias, poisoning, quality degradation)
- Model risks (hallucination, drift, adversarial vulnerability)
- Deployment risks (misuse, unintended consequences, scalability failures)
- Societal risks (discrimination, job displacement, democratic manipulation)
- Environmental risks (energy consumption, resource usage)

### Certification Process

1. **Gap analysis**: Compare current practices against ISO 42001 requirements
2. **Implementation**: Build or enhance AIMS documentation and processes
3. **Internal audit**: Verify readiness before external audit
4. **Stage 1 audit**: Documentation review by certification body
5. **Stage 2 audit**: On-site assessment of AIMS effectiveness
6. **Certification**: 3-year certificate with annual surveillance audits

**Typical timeline**: 6-12 months from start to certification
**Cost**: Varies by organization size — €15,000-€100,000+ including consulting and audit fees

### ISO 42001 and the EU AI Act

While ISO 42001 certification is not explicitly required by the EU AI Act, it provides strong alignment:

| EU AI Act Requirement | ISO 42001 Mapping |
|---|---|
| Risk management system (Art. 9) | Clauses 6, 8 + Annex B |
| Data governance (Art. 10) | Clause 8 + Annex A.7 |
| Technical documentation (Art. 11) | Clauses 7.5, 8 |
| Transparency (Art. 13) | Annex A.8 |
| Human oversight (Art. 14) | Clause 8 (operational planning) |
| Accuracy, robustness, security (Art. 15) | Clause 9 + Annex A.6 |
| Quality management system (Art. 17) | Full AIMS (Clauses 4-10) |

The European Commission has indicated that harmonized standards mapped to ISO 42001 may create a presumption of conformity for certain AI Act obligations.

### What to Ask Your AI Vendor

1. "Are you ISO 42001 certified, or working toward certification?"
2. "Can you provide your Statement of Applicability for ISO 42001 controls?"
3. "How does your AIMS address training data governance and bias management?"
4. "What is your AI impact assessment process for new features/models?"
5. "How do you handle third-party AI components in your supply chain?"`,
    badgeType: "Sector",
    criteriaCount: 38,
    effectiveDate: "Dec 2023",
    issuingAuthority: "International Organization for Standardization (ISO) & International Electrotechnical Commission (IEC)",
    enforcementType: "Voluntary standard — increasingly expected in enterprise procurement",
    maxPenalty:
      "No direct penalties (voluntary standard). However, lack of certification may disqualify vendors from enterprise procurement processes. EU AI Act may reference ISO 42001-aligned harmonized standards for presumption of conformity.",
    applicableRegions: "Global — applicable in all jurisdictions",
    purpose:
      "Provide organizations that develop, provide, or use AI systems with a structured approach to managing AI-specific risks while balancing innovation with responsible governance.",
    officialUrl: "https://www.iso.org/standard/81230.html",
    industrySlugs: [
      "financial-services",
      "healthcare",
      "manufacturing",
      "telecommunications",
      "public-sector",
    ],
  },

  // ── NIST AI RMF ────────────────────────────────────────────
  {
    slug: "nist-ai-rmf",
    name: "NIST AI Risk Management Framework",
    description:
      "The US National Institute of Standards and Technology AI Risk Management Framework (AI RMF 1.0) provides voluntary guidance for managing AI risks. While US-originated, it has global relevance for multinational enterprises and is referenced by EU organizations for complementary risk management approaches.",
    content: `## NIST AI Risk Management Framework (AI RMF 1.0)

### Overview

Published January 2023, the NIST AI RMF is a voluntary framework designed to help organizations manage risks associated with AI systems throughout their lifecycle. It is complementary to the EU AI Act — while the AI Act is binding law, NIST AI RMF provides practical risk management methodology.

**Why EU organizations care**: Many EU enterprises operate globally and need frameworks that work across jurisdictions. NIST AI RMF provides practical tools that map well to EU AI Act requirements while also satisfying US regulatory expectations.

### Framework Structure

The AI RMF consists of two parts:

**Part 1: Foundational Information**
- Defines AI risk concepts and context
- Identifies characteristics of trustworthy AI:
  - **Valid and reliable**: Performs as intended
  - **Safe**: Does not endanger life, health, property, or environment
  - **Secure and resilient**: Resistant to attacks and recovers from failures
  - **Accountable and transparent**: Clear governance and explainable decisions
  - **Explainable and interpretable**: Users understand AI outputs
  - **Privacy-enhanced**: Protects personal data and autonomy
  - **Fair — with harmful bias managed**: Mitigates discriminatory impacts

**Part 2: Core Framework (GOVERN, MAP, MEASURE, MANAGE)**

### GOVERN Function

Establish and maintain AI risk management governance:

- **GOVERN 1**: Organizational policies for AI risk management
- **GOVERN 2**: Accountability structures and roles
- **GOVERN 3**: Workforce diversity and AI literacy
- **GOVERN 4**: Organizational culture of AI risk awareness
- **GOVERN 5**: Processes for ongoing monitoring and review
- **GOVERN 6**: Policies for AI third-party and supply chain management

### MAP Function

Contextualize risks related to AI systems:

- **MAP 1**: Intended purpose, context, and scope of AI system
- **MAP 2**: Categorize and classify AI systems by risk
- **MAP 3**: AI-specific risks and potential benefits
- **MAP 4**: Risks across the AI lifecycle (design, development, deployment, operation)
- **MAP 5**: Stakeholder engagement for risk identification

### MEASURE Function

Analyze, assess, benchmark, and monitor AI risks:

- **MEASURE 1**: Metrics for AI system performance and trustworthiness
- **MEASURE 2**: AI system evaluation methods and tools
- **MEASURE 3**: Mechanisms to track AI system behavior over time
- **MEASURE 4**: Measurement of AI system impacts

### MANAGE Function

Allocate resources to address mapped and measured risks:

- **MANAGE 1**: AI risk treatment strategies
- **MANAGE 2**: Contingency plans for AI system failures
- **MANAGE 3**: AI system decommissioning procedures
- **MANAGE 4**: Documentation and communication of risk management actions

### NIST AI RMF ↔ EU AI Act Mapping

| NIST AI RMF | EU AI Act | Alignment |
|---|---|---|
| GOVERN (governance) | Art. 9 (risk management system) | Strong |
| MAP (risk context) | Art. 6 + Annex III (classification) | Moderate |
| MEASURE (assessment) | Art. 9(2) (risk assessment) | Strong |
| MANAGE (treatment) | Art. 9(4-8) (mitigation measures) | Strong |
| Trustworthy AI characteristics | Art. 8-15 (requirements) | Strong |
| Third-party management (GOVERN 6) | Art. 25 (importer obligations) | Moderate |

### NIST AI RMF Playbook

NIST also published an AI RMF Playbook with suggested actions for each subcategory. Key practical guidance:

**For AI Procurement**:
- Establish vendor AI risk assessment checklists aligned to MAP function
- Include AI-specific security requirements in RFPs (GOVERN 6)
- Require vendors to document AI system limitations and failure modes (MAP 3)
- Define measurable performance thresholds for AI outputs (MEASURE 1)
- Contractually require incident notification for AI failures (MANAGE 2)

### Generative AI Profile

In July 2024, NIST released a companion document: **NIST AI 600-1 Generative AI Profile**. This maps additional risks specific to generative AI:

- **CBRN risk**: Misuse for chemical/biological/radiological/nuclear weapon development
- **Confabulation**: Generation of false but plausible information (hallucination)
- **Data privacy**: Training data memorization and disclosure
- **Environmental impact**: Energy consumption of large model training/inference
- **Information integrity**: Deepfakes, misinformation at scale
- **Intellectual property**: Copyright and licensing of training data
- **Obscene/degrading content**: Generation of harmful content
- **Value chain risks**: Dependencies on foundation model providers

### What This Means for Your AI Procurement

NIST AI RMF is a practical complement to EU AI Act compliance:

1. **Use MAP function** to classify AI tools by risk before procurement
2. **Use MEASURE function** to define acceptance criteria for AI vendor evaluations
3. **Use GOVERN 6** to structure AI vendor management programs
4. **Reference Generative AI Profile** when evaluating LLM-based tools
5. **Cross-reference with ISO 42001** for management system certification alignment`,
    badgeType: "Sector",
    criteriaCount: 24,
    effectiveDate: "Jan 2023",
    issuingAuthority: "National Institute of Standards and Technology (NIST), U.S. Department of Commerce",
    enforcementType: "Voluntary framework — no binding force, but widely referenced in procurement",
    maxPenalty:
      "No penalties (voluntary framework). However, US federal agencies are expected to use AI RMF per Executive Order 14110. Multinational enterprises increasingly reference it in global AI governance.",
    applicableRegions: "United States (origin) — globally referenced and applied",
    purpose:
      "Provide organizations with a flexible, structured approach to managing AI-specific risks, promoting trustworthy and responsible AI development, deployment, and use.",
    officialUrl: "https://www.nist.gov/artificial-intelligence/ai-risk-management-framework",
    industrySlugs: [
      "financial-services",
      "healthcare",
      "manufacturing",
      "telecommunications",
    ],
  },
];

// ─── Policy Statements for New Frameworks ──────────────────

const policyStatements = [
  // NIS2 statements
  {
    frameworkSlug: "nis2",
    sectionTitle: "Supply Chain Security",
    statements: [
      {
        statement:
          "Organizations must assess cybersecurity risks in their AI supply chain, including evaluation of vendor security practices, sub-processor management, and third-party component integrity.",
        commentary:
          "Article 21(2)(d) directly impacts AI procurement. Every AI vendor contract should include security requirements, incident notification clauses, and right-to-audit provisions. This is not optional — NIS2 makes supply chain security a legal obligation.",
        sortOrder: 1,
      },
      {
        statement:
          "Significant cybersecurity incidents affecting AI systems must be reported to the national CSIRT within 24 hours (early warning), 72 hours (full notification), and 1 month (final report).",
        commentary:
          "Article 23 reporting timelines are strict. AI-specific incidents include: adversarial attacks compromising model integrity, training data breaches, model theft, and AI system failures causing operational disruption. Ensure your AI vendors have incident detection and reporting capabilities.",
        sortOrder: 2,
      },
    ],
  },
  {
    frameworkSlug: "nis2",
    sectionTitle: "Risk Management Measures",
    statements: [
      {
        statement:
          "Essential and important entities must implement risk-based cybersecurity measures including policies on risk analysis, incident handling, business continuity, supply chain security, and vulnerability management.",
        commentary:
          "Article 21(1) requires a holistic approach. AI tools introduce unique risks: model poisoning, adversarial inputs, data exfiltration via AI queries. Your cybersecurity risk assessment must explicitly cover AI-specific threat vectors.",
        sortOrder: 1,
      },
      {
        statement:
          "Management bodies of essential and important entities must approve cybersecurity risk-management measures, oversee their implementation, and can be held personally liable for infringements.",
        commentary:
          "Article 20 introduces personal accountability for board members. This means AI tool procurement decisions are no longer just IT decisions — board members must understand and approve the cybersecurity implications of AI deployments.",
        sortOrder: 2,
      },
    ],
  },
  {
    frameworkSlug: "nis2",
    sectionTitle: "Governance and Accountability",
    statements: [
      {
        statement:
          "Member states must ensure that management bodies of essential and important entities undergo regular cybersecurity training, and that similar training is offered to employees.",
        commentary:
          "Article 20(2) training requirement extends to AI literacy. Staff must understand AI-specific security risks: prompt injection, data leakage through AI chatbots, deepfake attacks, and social engineering using AI-generated content.",
        sortOrder: 1,
      },
    ],
  },

  // ISO 42001 statements
  {
    frameworkSlug: "iso-42001",
    sectionTitle: "AI Risk Assessment",
    statements: [
      {
        statement:
          "Organizations shall establish and maintain an AI risk assessment process that identifies AI-specific risk sources, analyzes the likelihood and impact of AI-related risks, and evaluates risk levels against defined criteria.",
        commentary:
          "Clause 6.1 and Annex B provide a comprehensive AI risk taxonomy. Unlike general risk frameworks, ISO 42001 explicitly addresses AI-unique risks: hallucination, bias amplification, model drift, training data poisoning, and unintended emergent behaviors.",
        sortOrder: 1,
      },
      {
        statement:
          "The AI impact assessment shall consider potential adverse effects on individuals, groups, and society, including impacts on human rights, safety, fairness, privacy, and the environment.",
        commentary:
          "Annex A.5 goes beyond technical risk to societal impact. This aligns with the EU AI Act's fundamental rights impact assessment (Article 27) and positions ISO 42001 as a practical implementation framework for EU AI Act obligations.",
        sortOrder: 2,
      },
    ],
  },
  {
    frameworkSlug: "iso-42001",
    sectionTitle: "Data Governance for AI",
    statements: [
      {
        statement:
          "Organizations shall establish processes for managing data used in AI systems, including data quality assessment, data labeling practices, bias detection and mitigation, and data provenance documentation.",
        commentary:
          "Annex A.7 addresses the foundation of trustworthy AI: data. Poor data governance is the root cause of most AI failures. ISO 42001 requires systematic data management covering sourcing, cleaning, labeling, validation, and ongoing monitoring for drift.",
        sortOrder: 1,
      },
    ],
  },
  {
    frameworkSlug: "iso-42001",
    sectionTitle: "AI Transparency and Communication",
    statements: [
      {
        statement:
          "Organizations shall provide appropriate information about AI systems to interested parties, including the purpose and intended use of the AI system, known limitations, and mechanisms for feedback and redress.",
        commentary:
          "Annex A.8 directly maps to EU AI Act transparency obligations (Articles 13 and 52). Organizations certified to ISO 42001 should have processes to communicate AI system capabilities, limitations, and risks to users and affected parties.",
        sortOrder: 1,
      },
    ],
  },

  // NIST AI RMF statements
  {
    frameworkSlug: "nist-ai-rmf",
    sectionTitle: "GOVERN — AI Risk Governance",
    statements: [
      {
        statement:
          "Organizations should establish governance structures including policies, processes, procedures, and practices that address AI risks throughout the AI system lifecycle.",
        commentary:
          "GOVERN function is the foundation. Without clear AI governance, risk management becomes ad-hoc. Key practical step: designate an AI risk owner at the senior leadership level who is accountable for AI portfolio risk across the organization.",
        sortOrder: 1,
      },
      {
        statement:
          "Organizations should establish policies and procedures for managing AI risks associated with third-party AI components, data, and services throughout the AI value chain.",
        commentary:
          "GOVERN 6 addresses the reality that most enterprise AI is procured, not built in-house. This subcategory provides practical guidance for vendor assessment, contract requirements, and ongoing monitoring of AI supply chain risks.",
        sortOrder: 2,
      },
    ],
  },
  {
    frameworkSlug: "nist-ai-rmf",
    sectionTitle: "MAP — Risk Contextualization",
    statements: [
      {
        statement:
          "AI systems should be mapped for their intended purposes, potential misuses, and the broader sociotechnical context in which they operate, including impacts on individuals, communities, and society.",
        commentary:
          "MAP function prevents the common mistake of evaluating AI tools in isolation. Understanding context is critical: an AI chatbot has different risk profiles in customer service vs. healthcare diagnosis vs. financial advice. Context determines control requirements.",
        sortOrder: 1,
      },
    ],
  },
  {
    frameworkSlug: "nist-ai-rmf",
    sectionTitle: "MEASURE — Risk Assessment",
    statements: [
      {
        statement:
          "Organizations should employ a variety of quantitative and qualitative methods to measure AI risks, including testing for bias, evaluating robustness, assessing interpretability, and monitoring for performance degradation.",
        commentary:
          "MEASURE function moves beyond checklist compliance to evidence-based risk assessment. Practical AI metrics include: accuracy by demographic subgroup (fairness), performance under adversarial inputs (robustness), and explanation fidelity (interpretability). Define these metrics before procurement.",
        sortOrder: 1,
      },
    ],
  },
  {
    frameworkSlug: "nist-ai-rmf",
    sectionTitle: "MANAGE — Risk Treatment",
    statements: [
      {
        statement:
          "Organizations should develop and implement risk treatment strategies including risk avoidance, mitigation, transfer, and acceptance, with appropriate documentation and communication of residual risks.",
        commentary:
          "MANAGE function is where governance becomes operational. For AI procurement: risk transfer (via vendor SLAs and insurance), risk mitigation (via technical controls and human oversight), and risk acceptance (documented and board-approved) should all be explicitly addressed in vendor contracts.",
        sortOrder: 1,
      },
    ],
  },
];

// ─── Seed Runner ───────────────────────────────────────────

async function main() {
  console.log("Seeding new regulatory frameworks (Batch 2)...\n");

  // Upsert frameworks
  for (const fw of frameworks) {
    const { industrySlugs, ...data } = fw;

    const framework = await prisma.regulatoryFramework.upsert({
      where: { slug: data.slug },
      update: data,
      create: { ...data, published: true },
    });

    // Connect industries
    if (industrySlugs?.length) {
      const industries = await prisma.industry.findMany({
        where: { slug: { in: industrySlugs } },
      });
      await prisma.regulatoryFramework.update({
        where: { id: framework.id },
        data: {
          industries: {
            set: industries.map((i) => ({ id: i.id })),
          },
        },
      });
    }

    console.log(`  ✓ Framework: ${data.name}`);
  }

  // Upsert sections and policy statements
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

    console.log(`    ✓ Section: ${item.sectionTitle} (${item.statements.length} statements)`);
  }

  console.log(`\nDone — seeded ${frameworks.length} frameworks with policy statements.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
