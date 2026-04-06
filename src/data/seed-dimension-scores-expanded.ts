/**
 * Seed dimension scores for 8 additional AI systems across GDPR and EU AI Act.
 * Expands coverage beyond Azure OpenAI and Mistral AI.
 *
 * Run: npx tsx src/data/seed-dimension-scores-expanded.ts
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function upsertScore(systemId: string, sectionId: string, score: string, commentary: string) {
  await prisma.dimensionScore.upsert({
    where: { systemId_sectionId: { systemId, sectionId } },
    update: { score, commentary },
    create: { systemId, sectionId, score, commentary },
  });
}

async function main() {
  console.log("Seeding expanded dimension scores (8 systems)...\n");

  // ─── Load Regulatory Frameworks ────────────────────────
  const gdpr = await prisma.regulatoryFramework.findUnique({
    where: { slug: "gdpr" },
    include: { sections: { orderBy: { sortOrder: "asc" } } },
  });

  const aiAct = await prisma.regulatoryFramework.findUnique({
    where: { slug: "eu-ai-act" },
    include: { sections: { orderBy: { sortOrder: "asc" } } },
  });

  if (!gdpr) { console.error("GDPR framework not found"); return; }
  if (!aiAct) { console.error("EU AI Act framework not found"); return; }

  // ═══════════════════════════════════════════════════════
  // 1. OpenAI GPT-4
  // ═══════════════════════════════════════════════════════
  const openai = await prisma.aISystem.findUnique({ where: { slug: "openai-gpt-4" } });
  if (openai) {
    console.log("GDPR scores for OpenAI GPT-4:");
    const openaiGdpr: Record<string, { score: string; commentary: string }> = {
      "Core Data Protection Principles": {
        score: "B-",
        commentary: "OpenAI has improved its data processing transparency with updated privacy documentation and opt-out mechanisms for training data. However, the lack of granular purpose limitation controls and opaque data retention policies for API interactions leave gaps in demonstrating full Article 5 compliance. Enterprise API customers receive better transparency than consumer-tier users.",
      },
      "Data Subject Rights & Automated Decisions": {
        score: "B-",
        commentary: "OpenAI provides data export and deletion tools, but the process is not fully self-service and can involve manual requests with variable response times. Article 22 automated decision-making provisions are largely unaddressed at the platform level, placing the burden of human oversight entirely on deployers. There is no built-in explainability layer for model outputs.",
      },
      "Privacy by Design & Data Processing Agreements": {
        score: "B",
        commentary: "The Data Processing Addendum covers standard Article 28 requirements and incorporates EU SCCs for international transfers. OpenAI has introduced zero-data-retention options for API customers, which strengthens the privacy-by-design posture. However, the DPA terms have historically been updated unilaterally, and customer-managed encryption keys are not available.",
      },
      "Data Protection Impact Assessments": {
        score: "B",
        commentary: "OpenAI publishes system cards and safety evaluations for its models, which can support customer DPIAs. The GPT-4 system card provides useful risk information, though it is not structured as a formal DPIA template. Deployers must still conduct their own assessments, and OpenAI provides limited direct support for this process compared to enterprise-focused competitors.",
      },
      "International Transfers & Breach Notification": {
        score: "C+",
        commentary: "As a US-headquartered company, all data processed through OpenAI's API transits US infrastructure. While EU SCCs are in place, there is no EU data residency option and no commitment to an EU Data Boundary. This creates Schrems II exposure for EU customers. Breach notification commitments exist in the DPA but lack the specificity that enterprise customers expect.",
      },
    };

    for (const section of gdpr.sections) {
      const data = openaiGdpr[section.title];
      if (data) {
        await upsertScore(openai.id, section.id, data.score, data.commentary);
        console.log(`  ✓ ${section.title}: ${data.score}`);
      }
    }

    console.log("\nEU AI Act scores for OpenAI GPT-4:");
    const openaiAiAct: Record<string, { score: string; commentary: string }> = {
      "Risk Classification": {
        score: "B",
        commentary: "OpenAI has published detailed guidance on risk classification and use-case policies that restrict high-risk applications. The usage policies explicitly prohibit certain high-risk deployments. However, enforcement relies on post-hoc detection rather than pre-deployment classification tooling, and the boundary between general-purpose and high-risk use is not always clear to deployers.",
      },
      "Requirements for High-Risk AI Systems": {
        score: "B-",
        commentary: "GPT-4 system cards and technical reports provide substantial documentation on capabilities and limitations, but they do not map directly to Annex IV requirements. Logging and monitoring are available through the API but require customer implementation. Adversarial robustness testing is conducted internally, though red-team results are selectively published.",
      },
      "Transparency Obligations": {
        score: "B",
        commentary: "OpenAI is a leader in publishing model capabilities and safety research. System cards, usage policies, and the preparedness framework demonstrate commitment to transparency. However, Article 50 obligations around AI-generated content labelling depend entirely on deployer implementation, and there is no built-in watermarking or provenance mechanism for text outputs.",
      },
      "Governance & Enforcement": {
        score: "B-",
        commentary: "OpenAI has established a safety advisory group and published a preparedness framework for catastrophic risk. However, the governance structure has faced public scrutiny following leadership upheavals, and engagement with EU regulatory bodies is less mature than that of established enterprise vendors. The company lacks formal EU AI Office liaison arrangements.",
      },
    };

    for (const section of aiAct.sections) {
      const data = openaiAiAct[section.title];
      if (data) {
        await upsertScore(openai.id, section.id, data.score, data.commentary);
        console.log(`  ✓ ${section.title}: ${data.score}`);
      }
    }
  } else {
    console.warn("⚠ openai-gpt-4 not found, skipping");
  }

  // ═══════════════════════════════════════════════════════
  // 2. Google Vertex AI
  // ═══════════════════════════════════════════════════════
  const google = await prisma.aISystem.findUnique({ where: { slug: "google-vertex-ai" } });
  if (google) {
    console.log("\nGDPR scores for Google Vertex AI:");
    const googleGdpr: Record<string, { score: string; commentary: string }> = {
      "Core Data Protection Principles": {
        score: "B",
        commentary: "Google Cloud provides clear data processing documentation and has strong purpose limitation controls through IAM and organisational policies. Data minimisation is supported via configurable retention and deletion schedules. However, the complexity of Google's broader data ecosystem means customers must carefully configure boundaries to ensure telemetry and diagnostic data remain within scope.",
      },
      "Data Subject Rights & Automated Decisions": {
        score: "B-",
        commentary: "Vertex AI provides API-level data access and deletion capabilities, but exercising data subject rights across a complex ML pipeline requires significant customer effort. There are no built-in Article 22 safeguards for automated decisions made using Vertex AI models. Google's Model Garden documentation does not address explainability in the context of GDPR rights.",
      },
      "Privacy by Design & Data Processing Agreements": {
        score: "B+",
        commentary: "Google Cloud's DPA is comprehensive and covers Article 28 requirements with EU SCCs incorporated. Customer-Managed Encryption Keys (CMEK) and VPC Service Controls provide strong privacy-by-design controls. The DPA is standardised across Google Cloud, which simplifies procurement but limits customisation for specific regulatory needs.",
      },
      "Data Protection Impact Assessments": {
        score: "B",
        commentary: "Google publishes AI principles and model cards for its foundation models, which support DPIA processes. However, DPIA templates specific to Vertex AI deployments are not publicly available. The Responsible AI toolkit provides bias detection and fairness metrics, which can feed into DPIA risk assessments, but the mapping to GDPR requirements is left to the customer.",
      },
      "International Transfers & Breach Notification": {
        score: "B-",
        commentary: "EU regional deployment is available for Vertex AI workloads, and Google has committed to EU data residency through Assured Workloads. However, some support and operational access may involve non-EU Google staff, similar to other US hyperscalers. Google's breach notification commitments meet the 72-hour GDPR requirement, but the Schrems II exposure remains for any data that touches US-based infrastructure.",
      },
    };

    for (const section of gdpr.sections) {
      const data = googleGdpr[section.title];
      if (data) {
        await upsertScore(google.id, section.id, data.score, data.commentary);
        console.log(`  ✓ ${section.title}: ${data.score}`);
      }
    }

    console.log("\nEU AI Act scores for Google Vertex AI:");
    const googleAiAct: Record<string, { score: string; commentary: string }> = {
      "Risk Classification": {
        score: "B",
        commentary: "Google has published EU AI Act preparedness guides and provides use-case restrictions through Acceptable Use Policies. Vertex AI's model garden includes risk categorisation metadata for some models. However, the risk classification tooling is not yet integrated into the deployment workflow, requiring deployers to self-classify without structured platform support.",
      },
      "Requirements for High-Risk AI Systems": {
        score: "B",
        commentary: "Vertex AI provides model monitoring, logging via Cloud Audit Logs, and pipeline versioning that supports traceability. Model cards are published for PaLM and Gemini models. However, full Annex IV technical documentation is not publicly available, and human oversight mechanisms must be built by the customer on top of the platform.",
      },
      "Transparency Obligations": {
        score: "B",
        commentary: "Google publishes model cards, data cards, and transparency reports for its AI systems. The SynthID watermarking tool for images and text demonstrates investment in AI content provenance. However, transparency features are not uniformly applied across all Vertex AI models, and deployer-facing labelling guidance could be more prescriptive.",
      },
      "Governance & Enforcement": {
        score: "B",
        commentary: "Google has a well-established AI Principles framework and a dedicated Responsible AI team with published governance structures. The company engages with the EU AI Office and participates in standards development. However, past controversies around AI ethics board governance and researcher departures introduce reputational risk that may concern compliance-conscious deployers.",
      },
    };

    for (const section of aiAct.sections) {
      const data = googleAiAct[section.title];
      if (data) {
        await upsertScore(google.id, section.id, data.score, data.commentary);
        console.log(`  ✓ ${section.title}: ${data.score}`);
      }
    }
  } else {
    console.warn("⚠ google-vertex-ai not found, skipping");
  }

  // ═══════════════════════════════════════════════════════
  // 3. IBM watsonx
  // ═══════════════════════════════════════════════════════
  const ibm = await prisma.aISystem.findUnique({ where: { slug: "ibm-watsonx" } });
  if (ibm) {
    console.log("\nGDPR scores for IBM watsonx:");
    const ibmGdpr: Record<string, { score: string; commentary: string }> = {
      "Core Data Protection Principles": {
        score: "A-",
        commentary: "IBM has a long track record of enterprise data governance and GDPR compliance. watsonx.governance provides automated policy enforcement, lineage tracking, and purpose limitation controls that map directly to Article 5 principles. The only gap is that some advanced governance features require separate licensing, which can create inconsistent compliance postures across deployments.",
      },
      "Data Subject Rights & Automated Decisions": {
        score: "B+",
        commentary: "IBM watsonx includes built-in explainability tools (OpenScale) that directly support Article 22 compliance for automated decision-making. Data subject access and deletion requests can be managed through IBM Cloud APIs. The platform's focus on regulated industries means these capabilities are more mature than most competitors, though some require manual configuration.",
      },
      "Privacy by Design & Data Processing Agreements": {
        score: "A-",
        commentary: "IBM's DPA is one of the most comprehensive in the industry, with detailed sub-processor lists and notification mechanisms. watsonx supports customer-managed encryption keys (Keep Your Own Key), confidential computing via IBM Hyper Protect, and data isolation through dedicated tenancy. Privacy by design is embedded in the architecture, reflecting IBM's enterprise heritage.",
      },
      "Data Protection Impact Assessments": {
        score: "B+",
        commentary: "watsonx.governance includes AI factsheet capabilities that can auto-generate documentation supporting DPIAs. IBM provides DPIA guidance documentation specific to AI deployments. However, the DPIA process itself remains the customer's responsibility, and IBM's supporting materials are more enterprise-focused than regulator-ready.",
      },
      "International Transfers & Breach Notification": {
        score: "B+",
        commentary: "IBM Cloud offers EU-only deployment options with Frankfurt and London data centres. The EU Cloud designation restricts support access to EU-based personnel. Breach notification commitments are contractually specified and align with GDPR's 72-hour requirement. IBM's Binding Corporate Rules, approved by EU DPAs, provide an additional legal basis for any necessary international transfers.",
      },
    };

    for (const section of gdpr.sections) {
      const data = ibmGdpr[section.title];
      if (data) {
        await upsertScore(ibm.id, section.id, data.score, data.commentary);
        console.log(`  ✓ ${section.title}: ${data.score}`);
      }
    }

    console.log("\nEU AI Act scores for IBM watsonx:");
    const ibmAiAct: Record<string, { score: string; commentary: string }> = {
      "Risk Classification": {
        score: "A-",
        commentary: "IBM has proactively integrated EU AI Act risk classification into watsonx.governance, allowing organisations to tag and categorise AI use cases by risk tier. IBM's AI Alliance participation and public advocacy for AI regulation demonstrate genuine commitment. The platform provides structured risk assessment workflows, though they are not yet fully aligned with the final Act implementing measures.",
      },
      "Requirements for High-Risk AI Systems": {
        score: "A-",
        commentary: "watsonx.governance delivers comprehensive model lifecycle management, bias detection, drift monitoring, and audit trails that map well to Annex IV requirements. IBM's AI FactSheets provide structured technical documentation. The platform's enterprise focus means human oversight and quality management features are more mature than those of pure-play AI labs.",
      },
      "Transparency Obligations": {
        score: "B+",
        commentary: "IBM publishes detailed model cards and maintains transparency around training data provenance for its Granite model family. The AI FactSheets framework supports structured disclosure. However, watermarking and AI-generated content labelling capabilities are still emerging, and the transparency tooling is stronger for traditional ML models than for generative AI outputs.",
      },
      "Governance & Enforcement": {
        score: "A-",
        commentary: "IBM has one of the most mature AI governance programmes in the industry, with a dedicated AI Ethics Board, published governance frameworks, and active participation in EU standards bodies (CEN/CENELEC). The company has publicly committed to EU AI Act compliance timelines and maintains formal relationships with the EU AI Office.",
      },
    };

    for (const section of aiAct.sections) {
      const data = ibmAiAct[section.title];
      if (data) {
        await upsertScore(ibm.id, section.id, data.score, data.commentary);
        console.log(`  ✓ ${section.title}: ${data.score}`);
      }
    }
  } else {
    console.warn("⚠ ibm-watsonx not found, skipping");
  }

  // ═══════════════════════════════════════════════════════
  // 4. Salesforce Einstein GPT
  // ═══════════════════════════════════════════════════════
  const salesforce = await prisma.aISystem.findUnique({ where: { slug: "salesforce-einstein-gpt" } });
  if (salesforce) {
    console.log("\nGDPR scores for Salesforce Einstein GPT:");
    const salesforceGdpr: Record<string, { score: string; commentary: string }> = {
      "Core Data Protection Principles": {
        score: "B+",
        commentary: "Salesforce provides robust data governance controls within the CRM context, with field-level security, audit trails, and clear data processing purposes. The Einstein Trust Layer ensures that customer CRM data is not used to train foundation models, which is a strong purpose limitation control. However, the interplay between Salesforce's own data processing and third-party model providers introduces complexity.",
      },
      "Data Subject Rights & Automated Decisions": {
        score: "B",
        commentary: "Salesforce provides data export, deletion, and anonymisation tools natively within the CRM platform. For Einstein AI predictions, confidence scores are displayed but full model explainability is limited. Article 22 compliance for automated CRM decisions (lead scoring, next-best-action) requires careful customer configuration of human review workflows.",
      },
      "Privacy by Design & Data Processing Agreements": {
        score: "B+",
        commentary: "Salesforce's DPA is well-established and covers Article 28 requirements comprehensively. The Einstein Trust Layer implements a zero-retention architecture for prompts sent to third-party LLMs, which is a strong privacy-by-design measure. Salesforce Shield provides additional encryption, event monitoring, and field audit trail capabilities at additional cost.",
      },
      "Data Protection Impact Assessments": {
        score: "B",
        commentary: "Salesforce provides Trust and Compliance documentation that can support customer DPIAs. However, there are no AI-specific DPIA templates, and the documentation focuses on platform security rather than AI-specific risk assessment. The Einstein Trust Layer whitepaper provides useful input for DPIAs involving generative AI features.",
      },
      "International Transfers & Breach Notification": {
        score: "B",
        commentary: "Salesforce offers EU data residency through Hyperforce, with German and French data centre regions. The Einstein Trust Layer processes prompts within the customer's data residency region. However, some backend processing and support operations may still involve non-EU staff. Breach notification is contractually committed within GDPR timelines.",
      },
    };

    for (const section of gdpr.sections) {
      const data = salesforceGdpr[section.title];
      if (data) {
        await upsertScore(salesforce.id, section.id, data.score, data.commentary);
        console.log(`  ✓ ${section.title}: ${data.score}`);
      }
    }

    console.log("\nEU AI Act scores for Salesforce Einstein GPT:");
    const salesforceAiAct: Record<string, { score: string; commentary: string }> = {
      "Risk Classification": {
        score: "B",
        commentary: "Salesforce has published guidance on responsible AI use within the CRM context and restricts certain high-risk applications through its Acceptable Use Policy. Einstein AI features are clearly delineated by risk level in product documentation. However, the platform does not provide automated risk classification tooling for custom AI implementations built on the Salesforce platform.",
      },
      "Requirements for High-Risk AI Systems": {
        score: "B",
        commentary: "The Einstein Trust Layer provides audit logging, data masking, and toxicity detection that support high-risk system requirements. Salesforce's model cards for Einstein features document capabilities and limitations. However, for customer-built models on the platform, compliance with Annex IV documentation requirements falls entirely on the deployer.",
      },
      "Transparency Obligations": {
        score: "B+",
        commentary: "Salesforce has a strong track record of AI transparency through its Trusted AI principles and published ethics guidelines. Einstein predictions include confidence scores and, in some cases, feature attribution explanations. The company's commitment to not training on customer data is clearly communicated, which supports deployer transparency obligations.",
      },
      "Governance & Enforcement": {
        score: "B",
        commentary: "Salesforce maintains an Office of Ethical and Humane Use of Technology and has published comprehensive AI governance guidelines. The company participates in industry AI governance initiatives. However, engagement with EU-specific regulatory bodies is less visible than that of European-headquartered competitors, and formal EU AI Office liaison is still developing.",
      },
    };

    for (const section of aiAct.sections) {
      const data = salesforceAiAct[section.title];
      if (data) {
        await upsertScore(salesforce.id, section.id, data.score, data.commentary);
        console.log(`  ✓ ${section.title}: ${data.score}`);
      }
    }
  } else {
    console.warn("⚠ salesforce-einstein-gpt not found, skipping");
  }

  // ═══════════════════════════════════════════════════════
  // 5. SAP Business AI
  // ═══════════════════════════════════════════════════════
  const sap = await prisma.aISystem.findUnique({ where: { slug: "sap-business-ai" } });
  if (sap) {
    console.log("\nGDPR scores for SAP Business AI:");
    const sapGdpr: Record<string, { score: string; commentary: string }> = {
      "Core Data Protection Principles": {
        score: "A",
        commentary: "As a German-headquartered company, SAP has GDPR compliance woven into its corporate DNA. SAP Business AI benefits from SAP's mature data governance framework, with granular purpose limitation, data minimisation controls, and comprehensive audit logging built into the Business Technology Platform. SAP's privacy-by-default approach is among the strongest in the enterprise AI market.",
      },
      "Data Subject Rights & Automated Decisions": {
        score: "A-",
        commentary: "SAP provides robust data subject rights management through its Master Data Governance and Information Lifecycle Management tools. For automated decisions in HR (SuccessFactors) and procurement (Ariba), SAP has built explicit human oversight mechanisms. Article 22 safeguards are more mature here than in any other enterprise AI platform, though edge cases in custom AI scenarios still require deployer configuration.",
      },
      "Privacy by Design & Data Processing Agreements": {
        score: "A",
        commentary: "SAP's DPA is exemplary, governed by German law, with detailed sub-processor management and change notification procedures. The Business Technology Platform supports customer-managed encryption, dedicated tenancy, and strict network isolation. SAP's EU Access control ensures that only EU-based personnel access customer data, setting the standard for privacy by design in enterprise software.",
      },
      "Data Protection Impact Assessments": {
        score: "B+",
        commentary: "SAP provides comprehensive DPIA guidance and documentation for its AI features, particularly in high-risk domains like HR analytics and financial processing. The SAP AI Ethics Steering Committee reviews AI use cases internally. However, customer-specific DPIAs must still be conducted by the deployer, and SAP's templates could be more granular for complex multi-system deployments.",
      },
      "International Transfers & Breach Notification": {
        score: "A",
        commentary: "SAP's EU-native status means core processing stays within the EU by default. The EU Access option guarantees that all operational support is provided from within the EU. SAP operates its own data centres across multiple EU member states, eliminating dependency on US hyperscalers for sovereignty-sensitive workloads. Breach notification is contractually guaranteed within 24 hours, exceeding the GDPR 72-hour requirement.",
      },
    };

    for (const section of gdpr.sections) {
      const data = sapGdpr[section.title];
      if (data) {
        await upsertScore(sap.id, section.id, data.score, data.commentary);
        console.log(`  ✓ ${section.title}: ${data.score}`);
      }
    }

    console.log("\nEU AI Act scores for SAP Business AI:");
    const sapAiAct: Record<string, { score: string; commentary: string }> = {
      "Risk Classification": {
        score: "A-",
        commentary: "SAP has proactively mapped its AI use cases to EU AI Act risk categories and publishes this classification in product documentation. The SAP AI Ethics policy explicitly prohibits unacceptable-risk AI applications. SAP's enterprise focus on HR, finance, and supply chain means it has deep domain expertise in classifying high-risk AI use cases in these regulated sectors.",
      },
      "Requirements for High-Risk AI Systems": {
        score: "A-",
        commentary: "SAP Business AI includes comprehensive model monitoring, bias detection, and lineage tracking through SAP AI Launchpad. For high-risk applications in HR and finance, SAP provides pre-built human oversight mechanisms and audit trails. Technical documentation is extensive, though full alignment with Annex IV implementing measures is still being finalised as standards emerge.",
      },
      "Transparency Obligations": {
        score: "A-",
        commentary: "SAP publishes AI ethics guidelines, model transparency documentation, and maintains a public AI commitment to responsible innovation. AI-powered features in SAP applications are clearly labelled, and confidence scores are displayed where applicable. SAP's enterprise customers receive detailed documentation on model behaviour and limitations that supports their own transparency obligations.",
      },
      "Governance & Enforcement": {
        score: "A-",
        commentary: "SAP has established a Global AI Ethics Steering Committee and a dedicated AI governance function. As an EU-headquartered company, SAP engages directly with the EU AI Office and actively participates in CEN/CENELEC standards development. SAP's governance maturity in AI reflects decades of experience navigating EU regulatory frameworks for enterprise software.",
      },
    };

    for (const section of aiAct.sections) {
      const data = sapAiAct[section.title];
      if (data) {
        await upsertScore(sap.id, section.id, data.score, data.commentary);
        console.log(`  ✓ ${section.title}: ${data.score}`);
      }
    }
  } else {
    console.warn("⚠ sap-business-ai not found, skipping");
  }

  // ═══════════════════════════════════════════════════════
  // 6. Palantir AIP
  // ═══════════════════════════════════════════════════════
  const palantir = await prisma.aISystem.findUnique({ where: { slug: "palantir-palantir-aip" } });
  if (palantir) {
    console.log("\nGDPR scores for Palantir AIP:");
    const palantirGdpr: Record<string, { score: string; commentary: string }> = {
      "Core Data Protection Principles": {
        score: "B-",
        commentary: "Palantir's Foundry ontology layer provides strong data lineage and purpose limitation controls at a technical level. However, Palantir's defence and intelligence heritage raises concerns about proportionality of data processing. Data minimisation is architecturally supported but depends heavily on customer configuration, and Palantir's own processing practices for platform improvement are not fully transparent.",
      },
      "Data Subject Rights & Automated Decisions": {
        score: "C+",
        commentary: "Palantir AIP provides granular access controls and audit trails, but the platform's complexity makes exercising data subject rights operationally challenging. Article 22 safeguards for automated decisions are not built into the platform; deployers must implement human oversight layers independently. The opacity of AIP's decision logic in complex pipelines makes meaningful explanation of automated decisions difficult.",
      },
      "Privacy by Design & Data Processing Agreements": {
        score: "B",
        commentary: "Palantir offers dedicated instances and customer-managed encryption, providing strong technical privacy controls. The DPA covers Article 28 requirements, and Palantir has invested in EU sovereign cloud deployments. However, DPA terms are negotiated on a per-customer basis rather than standardised, and the company's historical resistance to public scrutiny around data practices remains a concern.",
      },
      "Data Protection Impact Assessments": {
        score: "C+",
        commentary: "Palantir provides some documentation to support customer DPIAs, but the company's approach to public transparency is limited. Given the sensitive nature of many Palantir deployments (law enforcement, defence), DPIAs are critically important but are managed almost entirely by customers. Palantir does not publish model cards or public risk assessments for its AI capabilities.",
      },
      "International Transfers & Breach Notification": {
        score: "C",
        commentary: "As a US-headquartered company with deep ties to US government agencies, Palantir faces significant Schrems II challenges. While EU-sovereign deployments are available, the company's contractual relationship with US intelligence agencies raises legitimate questions about data access risks. Breach notification commitments exist contractually but lack the transparency and specificity expected by EU data protection authorities.",
      },
    };

    for (const section of gdpr.sections) {
      const data = palantirGdpr[section.title];
      if (data) {
        await upsertScore(palantir.id, section.id, data.score, data.commentary);
        console.log(`  ✓ ${section.title}: ${data.score}`);
      }
    }

    console.log("\nEU AI Act scores for Palantir AIP:");
    const palantirAiAct: Record<string, { score: string; commentary: string }> = {
      "Risk Classification": {
        score: "C+",
        commentary: "Palantir's platform is frequently deployed in high-risk domains (law enforcement, border control, healthcare triage) but provides limited public guidance on EU AI Act risk classification. The company's product documentation does not clearly map use cases to the Act's risk tiers. Deployers in the public sector bear the full burden of risk classification with minimal vendor support.",
      },
      "Requirements for High-Risk AI Systems": {
        score: "C",
        commentary: "While Palantir Foundry provides robust logging, versioning, and audit capabilities, the AIP layer's integration of LLMs introduces opaque decision pathways that are difficult to document per Annex IV requirements. Human oversight is technically supported through the ontology layer, but the complexity of multi-model pipelines makes meaningful human review challenging. Technical documentation is primarily available under NDA, not publicly.",
      },
      "Transparency Obligations": {
        score: "C",
        commentary: "Palantir has historically prioritised secrecy over transparency, which is fundamentally at odds with EU AI Act transparency requirements. No public model cards or transparency reports are available for AIP's AI capabilities. The company's government-focused go-to-market means that transparency mechanisms are designed for classified environments rather than public accountability.",
      },
      "Governance & Enforcement": {
        score: "C+",
        commentary: "Palantir has established internal ethics and governance structures, including a Privacy and Civil Liberties team. However, the company's limited public engagement with EU AI regulatory bodies and its adversarial posture toward certain European government scrutiny create governance risk. Formal EU AI Office engagement is not publicly documented, and the company's lobbying positions on AI regulation have drawn criticism from civil society.",
      },
    };

    for (const section of aiAct.sections) {
      const data = palantirAiAct[section.title];
      if (data) {
        await upsertScore(palantir.id, section.id, data.score, data.commentary);
        console.log(`  ✓ ${section.title}: ${data.score}`);
      }
    }
  } else {
    console.warn("⚠ palantir-palantir-aip not found, skipping");
  }

  // ═══════════════════════════════════════════════════════
  // 7. FICO Platform
  // ═══════════════════════════════════════════════════════
  const fico = await prisma.aISystem.findUnique({ where: { slug: "fico-fico-platform" } });
  if (fico) {
    console.log("\nGDPR scores for FICO Platform:");
    const ficoGdpr: Record<string, { score: string; commentary: string }> = {
      "Core Data Protection Principles": {
        score: "A-",
        commentary: "FICO's decades of experience in regulated credit scoring have produced mature data governance practices. Purpose limitation and data minimisation are deeply embedded in the platform's scoring model architecture, where each variable must be justified. The company's heritage in financial services regulation means GDPR compliance is treated as a business requirement, not an afterthought.",
      },
      "Data Subject Rights & Automated Decisions": {
        score: "B+",
        commentary: "FICO is an industry leader in explainable AI, with reason codes and score factor explanations built into every credit scoring model. This directly supports Article 22 rights around meaningful information about automated decision logic. Data subject access is well-supported, though deletion rights can conflict with financial regulatory retention requirements, creating compliance tension.",
      },
      "Privacy by Design & Data Processing Agreements": {
        score: "A",
        commentary: "FICO's DPA reflects decades of financial services data protection experience and covers Article 28 requirements comprehensively. The platform architecture enforces data isolation between clients, supports customer-managed encryption, and provides detailed audit trails. Privacy by design is not just a feature but a core architectural principle reflecting credit bureau regulatory requirements.",
      },
      "Data Protection Impact Assessments": {
        score: "A-",
        commentary: "FICO provides structured risk assessment frameworks and model validation documentation that directly support DPIAs. The company's experience with consumer credit DPIA requirements means its documentation is more regulator-ready than most AI platforms. Model risk management practices inherited from Basel III compliance provide a strong foundation for AI-specific DPIAs.",
      },
      "International Transfers & Breach Notification": {
        score: "B+",
        commentary: "FICO operates EU-based infrastructure for European clients and maintains clear data residency commitments. The company's financial services clients demand strict data localisation, which has driven investment in EU processing capabilities. Breach notification procedures are well-established and align with both GDPR and financial services regulatory requirements. Some ancillary processing may still involve US-based infrastructure.",
      },
    };

    for (const section of gdpr.sections) {
      const data = ficoGdpr[section.title];
      if (data) {
        await upsertScore(fico.id, section.id, data.score, data.commentary);
        console.log(`  ✓ ${section.title}: ${data.score}`);
      }
    }

    console.log("\nEU AI Act scores for FICO Platform:");
    const ficoAiAct: Record<string, { score: string; commentary: string }> = {
      "Risk Classification": {
        score: "B+",
        commentary: "FICO's platform is primarily used in credit scoring and fraud detection, both of which fall clearly within the EU AI Act's high-risk categories (Annex III). The company acknowledges and embraces this classification, providing clear documentation of risk levels. However, newer generative AI features in the platform do not yet have the same level of risk classification maturity as the traditional scoring models.",
      },
      "Requirements for High-Risk AI Systems": {
        score: "A-",
        commentary: "FICO excels at high-risk system requirements due to its credit scoring heritage. Model validation, bias testing, documentation, and performance monitoring are industry-leading. The platform provides comprehensive audit trails, model versioning, and champion-challenger testing frameworks. These capabilities pre-date the EU AI Act and map well to Annex IV requirements, giving FICO a significant head start.",
      },
      "Transparency Obligations": {
        score: "A-",
        commentary: "FICO's explainable AI capabilities are among the best in the industry, with reason codes providing clear explanations for every decision. The company publishes detailed model documentation and has a long track record of regulatory transparency in financial services. FICO's Responsible AI initiative provides additional transparency frameworks specifically designed for AI Act compliance.",
      },
      "Governance & Enforcement": {
        score: "A-",
        commentary: "FICO's governance practices reflect decades of operating under strict financial services regulation across multiple jurisdictions. The company maintains formal model risk management frameworks aligned with SR 11-7 and EBA guidelines. Active participation in AI governance standards development and engagement with EU financial regulators provides strong institutional credibility for EU AI Act compliance.",
      },
    };

    for (const section of aiAct.sections) {
      const data = ficoAiAct[section.title];
      if (data) {
        await upsertScore(fico.id, section.id, data.score, data.commentary);
        console.log(`  ✓ ${section.title}: ${data.score}`);
      }
    }
  } else {
    console.warn("⚠ fico-fico-platform not found, skipping");
  }

  // ═══════════════════════════════════════════════════════
  // 8. Anthropic Claude
  // ═══════════════════════════════════════════════════════
  const anthropic = await prisma.aISystem.findUnique({ where: { slug: "anthropic-claude" } });
  if (anthropic) {
    console.log("\nGDPR scores for Anthropic Claude:");
    const anthropicGdpr: Record<string, { score: string; commentary: string }> = {
      "Core Data Protection Principles": {
        score: "B",
        commentary: "Anthropic provides clear documentation on data processing purposes and has published a comprehensive privacy policy. The company's Constitutional AI approach demonstrates genuine commitment to principled data handling. However, as a relatively young company, some data governance processes are still maturing, and transparency around training data composition and collection practices could be more detailed.",
      },
      "Data Subject Rights & Automated Decisions": {
        score: "B",
        commentary: "Anthropic provides data deletion mechanisms for API and consumer users, and the API's zero-retention mode ensures prompt data is not stored. However, exercising data subject rights for information already incorporated into model training is technically infeasible, which is an industry-wide challenge. Article 22 protections for automated decisions are not built into the platform and are the deployer's responsibility.",
      },
      "Privacy by Design & Data Processing Agreements": {
        score: "B+",
        commentary: "Anthropic's DPA covers Article 28 requirements and incorporates EU SCCs. The API offers zero-data-retention options by default for business customers, which is a strong privacy-by-design measure. The company's research on Constitutional AI and harmlessness training reflects genuine investment in privacy-respecting model behaviour. Customer-managed encryption is not yet available, which is a gap for enterprise deployments.",
      },
      "Data Protection Impact Assessments": {
        score: "B",
        commentary: "Anthropic publishes detailed model cards and responsible scaling policy documents that provide useful input for customer DPIAs. The Claude model card includes information on capabilities, limitations, and safety evaluations. However, Anthropic does not provide structured DPIA templates or direct DPIA support, and the documentation is research-oriented rather than regulator-ready.",
      },
      "International Transfers & Breach Notification": {
        score: "B-",
        commentary: "As a US-headquartered company, all Claude API processing occurs on US-based infrastructure (AWS and GCP). There is no EU data residency option currently available, creating Schrems II exposure for EU customers. While EU SCCs are in place, the absence of an EU data boundary commitment is a notable gap. Breach notification is contractually committed but the company's incident response track record is limited given its short operational history.",
      },
    };

    for (const section of gdpr.sections) {
      const data = anthropicGdpr[section.title];
      if (data) {
        await upsertScore(anthropic.id, section.id, data.score, data.commentary);
        console.log(`  ✓ ${section.title}: ${data.score}`);
      }
    }

    console.log("\nEU AI Act scores for Anthropic Claude:");
    const anthropicAiAct: Record<string, { score: string; commentary: string }> = {
      "Risk Classification": {
        score: "B+",
        commentary: "Anthropic has published detailed responsible scaling policies that include risk classification frameworks for AI capabilities. The company's approach to categorising model capabilities by risk level (ASL levels) is novel and forward-thinking. While not directly mapped to EU AI Act risk tiers, Anthropic's framework demonstrates sophisticated risk thinking that can be adapted to regulatory requirements.",
      },
      "Requirements for High-Risk AI Systems": {
        score: "B+",
        commentary: "Anthropic invests heavily in safety evaluations, red-teaming, and capability assessments that align with high-risk system requirements. Published evaluations include detailed testing methodologies and results. However, formal Annex IV technical documentation is not available, and the company's documentation style is research-paper oriented rather than compliance-document structured.",
      },
      "Transparency Obligations": {
        score: "A-",
        commentary: "Anthropic is an industry leader in AI safety transparency, publishing detailed model cards, safety research, and responsible scaling policies. The company's research contributions to interpretability and alignment are among the most substantive in the field. Claude's usage policies clearly disclose AI-generated content requirements. The main gap is the absence of built-in watermarking or content provenance mechanisms.",
      },
      "Governance & Enforcement": {
        score: "B",
        commentary: "Anthropic has established a Long-Term Benefit Trust governance structure and publishes its responsible scaling policy framework. The company engages with policymakers including EU institutions. However, as a relatively young company, its governance track record is short, and formal EU AI Office engagement and participation in CEN/CENELEC standards development are less established than those of legacy enterprise vendors.",
      },
    };

    for (const section of aiAct.sections) {
      const data = anthropicAiAct[section.title];
      if (data) {
        await upsertScore(anthropic.id, section.id, data.score, data.commentary);
        console.log(`  ✓ ${section.title}: ${data.score}`);
      }
    }
  } else {
    console.warn("⚠ anthropic-claude not found, skipping");
  }

  console.log("\nDone! Seeded dimension scores for 8 additional AI systems.");
}

main()
  .catch((e) => { console.error("Seed failed:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
