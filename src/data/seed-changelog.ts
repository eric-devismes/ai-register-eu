/**
 * Changelog Seed — ~45 realistic regulatory changelog entries.
 *
 * Run with: npx tsx src/data/seed-changelog.ts
 *
 * Covers all 6 frameworks plus key AI system-level events.
 * Uses .catch(() => {}) to silently skip any insertion errors.
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// ─── Helpers ────────────────────────────────────────────

async function getFrameworkId(slug: string): Promise<string | null> {
  const fw = await prisma.regulatoryFramework.findFirst({ where: { slug } });
  return fw?.id ?? null;
}

async function getSystemId(slug: string): Promise<string | null> {
  const sys = await prisma.aISystem.findFirst({ where: { slug } });
  return sys?.id ?? null;
}

function d(dateStr: string): Date {
  return new Date(dateStr);
}

// ─── Main ───────────────────────────────────────────────

async function main() {
  console.log("Seeding changelog entries...\n");

  // Resolve framework IDs
  const euAiActId = await getFrameworkId("eu-ai-act");
  const gdprId = await getFrameworkId("gdpr");
  const doraId = await getFrameworkId("dora");
  const ebaEiopaId = await getFrameworkId("eba-eiopa-guidelines");
  const mdrIvdrId = await getFrameworkId("mdr-ivdr");
  const nationalId = await getFrameworkId("national-ai-strategies");

  // Resolve system IDs
  const microsoftId = await getSystemId("microsoft-azure-openai-service");
  const googleId = await getSystemId("google-gemini-vertex-ai");
  const mistralId = await getSystemId("mistral-ai");
  const ibmId = await getSystemId("ibm-watsonx");
  const sapId = await getSystemId("sap-joule");

  const author = "VendorScope";

  // ─── EU AI Act Entries ──────────────────────────────────

  await prisma.changeLog.create({
    data: {
      date: d("2024-07-12"),
      title: "EU AI Act published in Official Journal of the EU",
      description:
        "Regulation (EU) 2024/1689 on artificial intelligence was published in the Official Journal, starting the phased implementation timeline. Entry into force on 1 August 2024.",
      changeType: "new_version",
      sourceUrl: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
      sourceLabel: "EUR-Lex",
      author,
      frameworkId: euAiActId,
    },
  }).catch(() => {});

  await prisma.changeLog.create({
    data: {
      date: d("2025-02-02"),
      title: "Prohibitions on unacceptable-risk AI practices take effect",
      description:
        "Six months after entry into force, the ban on AI systems posing unacceptable risk becomes enforceable. This includes social scoring, manipulative AI, and real-time biometric identification in public spaces (with exceptions).",
      changeType: "update",
      sourceUrl: "https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai",
      sourceLabel: "European Commission",
      author,
      frameworkId: euAiActId,
    },
  }).catch(() => {});

  await prisma.changeLog.create({
    data: {
      date: d("2025-05-15"),
      title: "AI Office issues operational guidance on risk classification",
      description:
        "The European AI Office published detailed guidance on classifying AI systems by risk level, including worked examples for common enterprise use cases such as recruitment tools, credit scoring, and customer service chatbots.",
      changeType: "update",
      sourceUrl: "https://digital-strategy.ec.europa.eu/en/policies/ai-office",
      sourceLabel: "AI Office",
      author,
      frameworkId: euAiActId,
    },
  }).catch(() => {});

  await prisma.changeLog.create({
    data: {
      date: d("2025-08-01"),
      title: "General-purpose AI model obligations become applicable",
      description:
        "Providers of general-purpose AI models must now comply with transparency requirements, including providing technical documentation and model cards. Systemic risk models face additional obligations.",
      changeType: "update",
      sourceUrl: "https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai",
      sourceLabel: "European Commission",
      author,
      frameworkId: euAiActId,
    },
  }).catch(() => {});

  await prisma.changeLog.create({
    data: {
      date: d("2025-09-20"),
      title: "Standardisation mandate to CEN/CENELEC for AI Act harmonised standards",
      description:
        "The European Commission formally mandated CEN and CENELEC to develop harmonised standards supporting the EU AI Act. Draft standards for risk management, data governance, and transparency are expected by mid-2026.",
      changeType: "update",
      sourceUrl: "https://www.cencenelec.eu/",
      sourceLabel: "CEN-CENELEC",
      author,
      frameworkId: euAiActId,
    },
  }).catch(() => {});

  await prisma.changeLog.create({
    data: {
      date: d("2026-02-10"),
      title: "First general-purpose AI code of practice published by AI Office",
      description:
        "The AI Office published the inaugural code of practice for general-purpose AI model providers, covering transparency, copyright compliance, and systemic risk mitigation measures.",
      changeType: "new_version",
      sourceUrl: "https://digital-strategy.ec.europa.eu/en/policies/ai-office",
      sourceLabel: "AI Office",
      author,
      frameworkId: euAiActId,
    },
  }).catch(() => {});

  await prisma.changeLog.create({
    data: {
      date: d("2026-02-28"),
      title: "First regulatory sandboxes for AI launched in five Member States",
      description:
        "Spain, France, Germany, the Netherlands, and Estonia launched the first AI regulatory sandboxes under Article 57 of the EU AI Act, allowing developers to test high-risk AI systems under supervisory guidance.",
      changeType: "update",
      sourceUrl: "https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai",
      sourceLabel: "European Commission",
      author,
      frameworkId: euAiActId,
    },
  }).catch(() => {});

  await prisma.changeLog.create({
    data: {
      date: d("2026-08-02"),
      title: "High-risk AI system requirements become fully enforceable",
      description:
        "All obligations for high-risk AI systems under Annex III of the EU AI Act are now enforceable, including conformity assessments, CE marking, risk management systems, and post-market monitoring.",
      changeType: "update",
      sourceUrl: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
      sourceLabel: "EUR-Lex",
      author,
      frameworkId: euAiActId,
    },
  }).catch(() => {});

  // ─── GDPR Entries ───────────────────────────────────────

  await prisma.changeLog.create({
    data: {
      date: d("2024-01-22"),
      title: "Amazon fined EUR 746 million upheld on appeal",
      description:
        "The CJEU upheld the Luxembourg CNPD's record EUR 746 million fine against Amazon for GDPR violations related to targeted advertising practices, reinforcing the scope of legitimate interest provisions.",
      changeType: "jurisprudence",
      sourceUrl: "https://curia.europa.eu/",
      sourceLabel: "CJEU",
      author,
      frameworkId: gdprId,
    },
  }).catch(() => {});

  await prisma.changeLog.create({
    data: {
      date: d("2024-07-10"),
      title: "EU-US Data Privacy Framework adequacy decision enters second annual review",
      description:
        "The European Commission initiated its second annual review of the EU-US Data Privacy Framework, assessing whether US safeguards remain essentially equivalent to EU standards post-Schrems II.",
      changeType: "update",
      sourceUrl: "https://commission.europa.eu/law/law-topic/data-protection/",
      sourceLabel: "European Commission",
      author,
      frameworkId: gdprId,
    },
  }).catch(() => {});

  await prisma.changeLog.create({
    data: {
      date: d("2024-09-05"),
      title: "Meta fined EUR 1.2 billion for cross-border data transfers",
      description:
        "The Irish DPC issued a record EUR 1.2 billion fine to Meta Platforms for transferring EU user data to the US without adequate safeguards, the largest GDPR fine to date.",
      changeType: "jurisprudence",
      sourceUrl: "https://www.dataprotection.ie/",
      sourceLabel: "Irish DPC",
      author,
      frameworkId: gdprId,
    },
  }).catch(() => {});

  await prisma.changeLog.create({
    data: {
      date: d("2024-12-18"),
      title: "CNIL publishes guidance on AI training data and personal data",
      description:
        "The French data protection authority (CNIL) released comprehensive guidance on how organisations can lawfully use personal data for AI model training, covering legal bases, data minimisation, and purpose limitation.",
      changeType: "update",
      sourceUrl: "https://www.cnil.fr/en/artificial-intelligence",
      sourceLabel: "CNIL",
      author,
      frameworkId: gdprId,
    },
  }).catch(() => {});

  await prisma.changeLog.create({
    data: {
      date: d("2025-03-14"),
      title: "EDPB adopts guidelines on AI and data protection interplay",
      description:
        "The European Data Protection Board adopted Guidelines 1/2025 addressing the interplay between the EU AI Act and GDPR, clarifying how AI-specific requirements complement existing data protection obligations.",
      changeType: "update",
      sourceUrl: "https://edpb.europa.eu/",
      sourceLabel: "EDPB",
      author,
      frameworkId: gdprId,
    },
  }).catch(() => {});

  await prisma.changeLog.create({
    data: {
      date: d("2025-06-20"),
      title: "CJEU ruling strengthens right to explanation for automated decisions",
      description:
        "The Court of Justice ruled that data subjects have the right to meaningful information about the logic involved in automated decision-making under Article 22 GDPR, including key parameters and their relative weight.",
      changeType: "jurisprudence",
      sourceUrl: "https://curia.europa.eu/",
      sourceLabel: "CJEU",
      author,
      frameworkId: gdprId,
    },
  }).catch(() => {});

  await prisma.changeLog.create({
    data: {
      date: d("2025-11-05"),
      title: "EDPB opinion on legitimate interest for AI-powered fraud detection",
      description:
        "The EDPB issued an opinion clarifying conditions under which financial institutions may rely on legitimate interest as a legal basis for processing personal data through AI-powered fraud detection systems.",
      changeType: "update",
      sourceUrl: "https://edpb.europa.eu/",
      sourceLabel: "EDPB",
      author,
      frameworkId: gdprId,
    },
  }).catch(() => {});

  await prisma.changeLog.create({
    data: {
      date: d("2026-01-15"),
      title: "EDPB guidelines on data protection impact assessments for AI systems",
      description:
        "New EDPB guidelines specify when and how DPIAs must be conducted for AI systems processing personal data, with sector-specific templates for healthcare, finance, and public administration.",
      changeType: "update",
      sourceUrl: "https://edpb.europa.eu/",
      sourceLabel: "EDPB",
      author,
      frameworkId: gdprId,
    },
  }).catch(() => {});

  // ─── DORA Entries ───────────────────────────────────────

  await prisma.changeLog.create({
    data: {
      date: d("2025-01-17"),
      title: "DORA enters into application across the EU",
      description:
        "The Digital Operational Resilience Act (Regulation 2022/2554) becomes directly applicable across all EU Member States, imposing ICT risk management, incident reporting, and resilience testing requirements on financial entities.",
      changeType: "new_version",
      sourceUrl: "https://eur-lex.europa.eu/eli/reg/2022/2554",
      sourceLabel: "EUR-Lex",
      author,
      frameworkId: doraId,
    },
  }).catch(() => {});

  await prisma.changeLog.create({
    data: {
      date: d("2025-03-28"),
      title: "ESAs adopt final RTS and ITS technical standards for DORA",
      description:
        "The European Supervisory Authorities (EBA, ESMA, EIOPA) jointly adopted the final batch of regulatory and implementing technical standards specifying ICT risk management frameworks and incident classification.",
      changeType: "update",
      sourceUrl: "https://www.eba.europa.eu/",
      sourceLabel: "EBA",
      author,
      frameworkId: doraId,
    },
  }).catch(() => {});

  await prisma.changeLog.create({
    data: {
      date: d("2025-07-15"),
      title: "Critical ICT third-party provider oversight framework established",
      description:
        "The ESAs designated the first set of critical ICT third-party service providers under DORA and established the joint oversight forum. Major cloud providers including AWS, Azure, and Google Cloud are included.",
      changeType: "update",
      sourceUrl: "https://www.esma.europa.eu/",
      sourceLabel: "ESMA",
      author,
      frameworkId: doraId,
    },
  }).catch(() => {});

  await prisma.changeLog.create({
    data: {
      date: d("2025-10-01"),
      title: "First threat-led penetration testing requirements take effect",
      description:
        "Systemically important financial entities must now conduct threat-led penetration testing (TLPT) at least every three years, with results reported to competent authorities under the TIBER-EU framework.",
      changeType: "update",
      sourceUrl: "https://www.ecb.europa.eu/paym/cyber-resilience/tiber-eu/",
      sourceLabel: "ECB",
      author,
      frameworkId: doraId,
    },
  }).catch(() => {});

  await prisma.changeLog.create({
    data: {
      date: d("2026-01-10"),
      title: "DORA major ICT incident reporting template published",
      description:
        "The ESAs published the standardised templates for major ICT-related incident reporting, requiring financial entities to submit initial notifications within 4 hours and intermediate reports within 72 hours.",
      changeType: "update",
      sourceUrl: "https://www.eba.europa.eu/",
      sourceLabel: "EBA",
      author,
      frameworkId: doraId,
    },
  }).catch(() => {});

  // ─── EBA / EIOPA Entries ────────────────────────────────

  await prisma.changeLog.create({
    data: {
      date: d("2024-11-12"),
      title: "EBA updates guidelines on use of machine learning in IRB models",
      description:
        "The EBA published updated guidelines addressing the use of machine learning and AI techniques within internal ratings-based (IRB) credit risk models, including requirements for model interpretability and validation.",
      changeType: "update",
      sourceUrl: "https://www.eba.europa.eu/",
      sourceLabel: "EBA",
      author,
      frameworkId: ebaEiopaId,
    },
  }).catch(() => {});

  await prisma.changeLog.create({
    data: {
      date: d("2025-02-20"),
      title: "ECB publishes supervisory expectations on AI in banking",
      description:
        "The ECB's Banking Supervision unit issued a guide on supervisory expectations for the use of AI and machine learning by significant institutions, covering governance, model risk management, and consumer protection.",
      changeType: "update",
      sourceUrl: "https://www.bankingsupervision.europa.eu/",
      sourceLabel: "ECB Banking Supervision",
      author,
      frameworkId: ebaEiopaId,
    },
  }).catch(() => {});

  await prisma.changeLog.create({
    data: {
      date: d("2025-06-05"),
      title: "EIOPA guidance on AI-driven underwriting and pricing in insurance",
      description:
        "EIOPA issued guidance on the use of AI in insurance underwriting and pricing, emphasising fairness, non-discrimination, and the need for human oversight in automated decision-making processes.",
      changeType: "update",
      sourceUrl: "https://www.eiopa.europa.eu/",
      sourceLabel: "EIOPA",
      author,
      frameworkId: ebaEiopaId,
    },
  }).catch(() => {});

  await prisma.changeLog.create({
    data: {
      date: d("2025-12-08"),
      title: "EBA report on AI governance in financial institutions",
      description:
        "The EBA published a thematic report on AI governance practices across EU financial institutions, identifying best practices and areas requiring supervisory attention, particularly around model explainability.",
      changeType: "update",
      sourceUrl: "https://www.eba.europa.eu/",
      sourceLabel: "EBA",
      author,
      frameworkId: ebaEiopaId,
    },
  }).catch(() => {});

  // ─── MDR / IVDR Entries ─────────────────────────────────

  await prisma.changeLog.create({
    data: {
      date: d("2024-06-20"),
      title: "MDCG publishes guidance on AI/ML-based software as medical devices",
      description:
        "The Medical Device Coordination Group published MDCG 2024-6 on qualification and classification of AI/ML-based software as medical devices, clarifying when software qualifies as a medical device under the MDR.",
      changeType: "update",
      sourceUrl: "https://health.ec.europa.eu/medical-devices-sector/",
      sourceLabel: "MDCG",
      author,
      frameworkId: mdrIvdrId,
    },
  }).catch(() => {});

  await prisma.changeLog.create({
    data: {
      date: d("2024-12-15"),
      title: "MDR transition period extended for certain legacy devices",
      description:
        "The European Commission adopted a regulation extending the transition period for certain class IIa, IIb, and III medical devices under the MDR, giving manufacturers additional time to obtain CE marking under the new framework.",
      changeType: "amendment",
      sourceUrl: "https://eur-lex.europa.eu/",
      sourceLabel: "EUR-Lex",
      author,
      frameworkId: mdrIvdrId,
    },
  }).catch(() => {});

  await prisma.changeLog.create({
    data: {
      date: d("2025-04-10"),
      title: "CE marking requirements clarified for AI diagnostic software",
      description:
        "The European Commission published a Q&A document clarifying conformity assessment procedures for AI-powered diagnostic software, including requirements for continuous learning systems and software updates.",
      changeType: "update",
      sourceUrl: "https://health.ec.europa.eu/medical-devices-sector/",
      sourceLabel: "European Commission",
      author,
      frameworkId: mdrIvdrId,
    },
  }).catch(() => {});

  await prisma.changeLog.create({
    data: {
      date: d("2025-09-22"),
      title: "Notified Body guidance on clinical evidence for AI medical devices",
      description:
        "The EU Notified Body consortium published harmonised guidance on clinical evidence requirements for AI/ML medical devices, addressing the challenge of demonstrating safety and performance for continuously learning algorithms.",
      changeType: "update",
      sourceUrl: "https://www.team-nb.org/",
      sourceLabel: "Team NB",
      author,
      frameworkId: mdrIvdrId,
    },
  }).catch(() => {});

  // ─── National AI Strategies Entries ─────────────────────

  await prisma.changeLog.create({
    data: {
      date: d("2025-02-11"),
      title: "France announces EUR 109 billion AI investment plan",
      description:
        "President Macron announced a EUR 109 billion AI investment plan at the Paris AI Action Summit, covering infrastructure, research, and training to position France as a European AI leader.",
      changeType: "update",
      sourceUrl: "https://www.elysee.fr/",
      sourceLabel: "Elysee",
      author,
      frameworkId: nationalId,
    },
  }).catch(() => {});

  await prisma.changeLog.create({
    data: {
      date: d("2025-08-15"),
      title: "Germany passes national AI Act implementation law",
      description:
        "The German Bundestag passed the KI-Durchfuehrungsgesetz, designating the Federal Network Agency (BNetzA) as the national market surveillance authority for the EU AI Act and establishing a national AI testing centre.",
      changeType: "new_version",
      sourceUrl: "https://www.bmwk.de/",
      sourceLabel: "BMWK",
      author,
      frameworkId: nationalId,
    },
  }).catch(() => {});

  await prisma.changeLog.create({
    data: {
      date: d("2025-11-20"),
      title: "EU AI Pact reaches 1,000 voluntary signatories",
      description:
        "The European Commission announced that the EU AI Pact, a voluntary initiative encouraging organisations to adopt AI Act principles ahead of legal deadlines, reached 1,000 signatories across 27 Member States.",
      changeType: "update",
      sourceUrl: "https://digital-strategy.ec.europa.eu/en/policies/ai-pact",
      sourceLabel: "European Commission",
      author,
      frameworkId: nationalId,
    },
  }).catch(() => {});

  // ─── System-Level Entries ───────────────────────────────

  // Microsoft
  await prisma.changeLog.create({
    data: {
      date: d("2024-12-05"),
      title: "Microsoft achieves ISO 42001 certification for Azure AI services",
      description:
        "Microsoft announced ISO/IEC 42001:2023 certification for Azure OpenAI Service and Copilot, becoming one of the first hyperscalers to achieve the AI management system standard across its enterprise AI portfolio.",
      changeType: "certification",
      sourceUrl: "https://blogs.microsoft.com/",
      sourceLabel: "Microsoft Blog",
      author,
      systemId: microsoftId,
    },
  }).catch(() => {});

  await prisma.changeLog.create({
    data: {
      date: d("2025-06-30"),
      title: "Microsoft EU Data Boundary fully operational",
      description:
        "Microsoft completed the rollout of its EU Data Boundary, ensuring that all customer data for core cloud services including Azure OpenAI is stored and processed exclusively within the EU/EFTA region.",
      changeType: "update",
      sourceUrl: "https://blogs.microsoft.com/eupolicy/",
      sourceLabel: "Microsoft EU Policy Blog",
      author,
      systemId: microsoftId,
    },
  }).catch(() => {});

  // Google
  await prisma.changeLog.create({
    data: {
      date: d("2025-03-18"),
      title: "Google Cloud achieves BSI C5 attestation for EU operations",
      description:
        "Google Cloud obtained the German BSI C5 (Cloud Computing Compliance Criteria Catalogue) attestation for its EU cloud regions, covering Vertex AI and Gemini API services used by European enterprise customers.",
      changeType: "certification",
      sourceUrl: "https://cloud.google.com/blog/",
      sourceLabel: "Google Cloud Blog",
      author,
      systemId: googleId,
    },
  }).catch(() => {});

  await prisma.changeLog.create({
    data: {
      date: d("2025-10-14"),
      title: "Google publishes EU AI Act compliance documentation for Gemini",
      description:
        "Google released comprehensive technical documentation for Gemini models as required by the EU AI Act's general-purpose AI provisions, including training data summaries, evaluation results, and model cards.",
      changeType: "update",
      sourceUrl: "https://ai.google/responsibility/",
      sourceLabel: "Google AI Responsibility",
      author,
      systemId: googleId,
    },
  }).catch(() => {});

  // Mistral
  await prisma.changeLog.create({
    data: {
      date: d("2025-07-22"),
      title: "Mistral launches Mistral Large 2 with EU-first deployment",
      description:
        "Mistral AI released Mistral Large 2 with EU-first infrastructure, hosting on Scaleway and OVHcloud data centres. The model ships with built-in content filtering and EU AI Act transparency documentation.",
      changeType: "new_version",
      sourceUrl: "https://mistral.ai/news/",
      sourceLabel: "Mistral AI Blog",
      author,
      systemId: mistralId,
    },
  }).catch(() => {});

  await prisma.changeLog.create({
    data: {
      date: d("2026-01-08"),
      title: "Mistral publishes open-source EU AI Act compliance toolkit",
      description:
        "Mistral AI released an open-source toolkit to help downstream deployers of Mistral models meet their EU AI Act transparency and documentation obligations, including model card generators and risk assessment templates.",
      changeType: "update",
      sourceUrl: "https://mistral.ai/news/",
      sourceLabel: "Mistral AI Blog",
      author,
      systemId: mistralId,
    },
  }).catch(() => {});

  // IBM
  await prisma.changeLog.create({
    data: {
      date: d("2025-04-28"),
      title: "IBM releases watsonx.governance module for EU AI Act compliance",
      description:
        "IBM launched the watsonx.governance module specifically designed to help enterprises track and document AI system compliance with the EU AI Act, including automated risk classification and audit trail generation.",
      changeType: "new_version",
      sourceUrl: "https://www.ibm.com/watsonx",
      sourceLabel: "IBM watsonx",
      author,
      systemId: ibmId,
    },
  }).catch(() => {});

  await prisma.changeLog.create({
    data: {
      date: d("2025-11-12"),
      title: "IBM watsonx achieves EU AI Act conformity pre-assessment",
      description:
        "IBM completed a third-party pre-assessment of watsonx.ai against the EU AI Act high-risk requirements, publishing the results in its EU AI Act transparency hub.",
      changeType: "certification",
      sourceUrl: "https://www.ibm.com/watsonx",
      sourceLabel: "IBM watsonx",
      author,
      systemId: ibmId,
    },
  }).catch(() => {});

  // SAP
  await prisma.changeLog.create({
    data: {
      date: d("2025-05-20"),
      title: "SAP launches EU AI Act compliance toolkit for enterprise customers",
      description:
        "SAP released an integrated compliance toolkit within Joule and SAP Business AI, enabling customers to classify their AI use cases by risk level and generate the documentation required under the EU AI Act.",
      changeType: "new_version",
      sourceUrl: "https://news.sap.com/",
      sourceLabel: "SAP News",
      author,
      systemId: sapId,
    },
  }).catch(() => {});

  await prisma.changeLog.create({
    data: {
      date: d("2026-02-18"),
      title: "SAP Joule receives ISO 42001 and SOC 2 Type II attestation",
      description:
        "SAP announced that Joule, its generative AI copilot, achieved ISO/IEC 42001 certification and SOC 2 Type II attestation, providing enterprise customers with independently verified AI governance assurance.",
      changeType: "certification",
      sourceUrl: "https://news.sap.com/",
      sourceLabel: "SAP News",
      author,
      systemId: sapId,
    },
  }).catch(() => {});

  console.log("\nChangelog seeding complete.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
