/**
 * Content Enrichment — Batch 7: Siemens Industrial Copilot (enrich existing)
 *
 * Enriches the existing Siemens Industrial Copilot profile with full enterprise intel card.
 *
 * Run with: npx tsx src/data/seed-enrichment-batch7-siemens.ts
 * Safe to run multiple times (uses upsert on slug).
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Enriching Siemens Industrial Copilot...\n");

  const enrichment = {
    name: "Siemens Industrial Copilot",
    type: "Industrial AI & Engineering Assistant",
    description:
      "Generative AI-powered assistant for engineering, manufacturing, and industrial operations. Built in partnership with Microsoft on Azure OpenAI, integrated into the Siemens Xcelerator digital platform. Key applications: engineering code generation (PLC programming in TIA Portal), product design assistance (NX CAD), factory simulation optimization (Tecnomatix), predictive maintenance via MindSphere IoT, and quality inspection. Key differentiator: EU-native industrial AI from Europe's largest industrial technology company, deeply integrated into operational technology (OT) environments that competitors cannot easily replicate. Understands industrial context — not just text, but P&IDs, PLC code, 3D models, and sensor data.",
    capabilityType: "decision-support",
    vendorHq: "Munich, Germany",
    euPresence:
      "EU-native company. Headquarters in Munich, Germany. Extensive European presence across all EU member states. Major R&D centres in Germany, Austria, Czech Republic, and across Europe. Manufacturing and operations in 30+ EU countries. Siemens Xcelerator cloud available in EU data centres. German/EU data governance standards built in. Listed on Frankfurt Stock Exchange (SIE) and XETRA.",
    foundedYear: 1847,
    employeeCount: "320,000+",
    fundingStatus:
      "Public (Frankfurt: SIE). Market cap ~€140B. Revenue ~€75B annually (FY2024). One of Europe's largest technology conglomerates. Siemens AG is the parent; Industrial Copilot spans Siemens Digital Industries and Siemens Xcelerator.",
    marketPresence: "Leader",
    customerCount: "350,000+ industrial customers globally",
    notableCustomers:
      "Schaeffler (manufacturing AI pilot partner)\nFresenius (pharmaceutical manufacturing)\nBMW (factory automation)\nVolkswagen Group (production optimization)\nBASF (chemical process optimization)\nAirbus (engineering design)\nThyssenKrupp\nBosch\nAudi",
    customerStories:
      "Schaeffler co-developed Industrial Copilot for PLC code generation, reducing engineering time by 60% for routine automation tasks. BMW uses Siemens digital twin technology with AI for factory layout optimization. Fresenius piloted Industrial Copilot for pharmaceutical manufacturing compliance documentation. Volkswagen Group uses Siemens Tecnomatix with AI for production line simulation and optimization.",
    useCases:
      "PLC code generation and optimization (TIA Portal integration)\nEngineering design assistance (NX CAD AI)\nFactory simulation and digital twin optimization\nPredictive maintenance via MindSphere IoT analytics\nQuality inspection and defect detection\nEnergy efficiency optimization in manufacturing\nSupply chain simulation\nCompliance documentation automation\nIndustrial safety monitoring",
    dataStorage:
      "Siemens Xcelerator cloud hosted in EU data centres (Azure Germany/Netherlands). On-premise deployment available for sensitive industrial environments. MindSphere IoT data stays in customer-chosen region. German data governance standards applied by default.",
    dataProcessing:
      "Azure OpenAI integration with enterprise-grade data isolation. Industrial data processed within Siemens Xcelerator environment. On-premise option for air-gapped factories and defence applications. Edge AI capabilities for real-time manufacturing floor decisions.",
    trainingDataUse:
      "Industrial Copilot uses Azure OpenAI models fine-tuned for industrial contexts. Customer production data NOT used for model training — strict contractual commitment. MindSphere IoT data governed by customer-specific data policies. Siemens industrial domain knowledge built into prompt engineering and context, not model retraining.",
    subprocessors:
      "Microsoft Azure (AI infrastructure, Azure OpenAI). Siemens own data centres for MindSphere and Xcelerator. Published subprocessor list per GDPR requirements.",
    dpaDetails:
      "Comprehensive GDPR DPA standard for all EU customers. German Federal Data Protection Act (BDSG) compliance. EU Model Clauses for international transfers. Siemens data protection framework audited annually. DPO appointed at group level.",
    slaDetails:
      "Enterprise SLA per Siemens Xcelerator platform. MindSphere: 99.9% uptime. Industrial Copilot SLA tied to Azure OpenAI availability. Dedicated support for enterprise customers. 24/7 support for critical manufacturing systems.",
    dataPortability:
      "Open industrial standards supported: OPC UA, MQTT, Profinet. Engineering data in standard formats (STEP, JT, NX). MindSphere APIs (REST). No vendor lock-in on operational data — interoperable with third-party industrial systems. Siemens is a founding member of Catena-X (automotive data space) and Manufacturing-X.",
    exitTerms:
      "Enterprise contracts with standard exit provisions. Operational data fully owned by customer. Engineering projects exportable in standard formats. MindSphere data exportable via API. Transition support available.",
    ipTerms:
      "Customer retains all IP in engineering designs, production data, and operational insights. Siemens retains IP in Industrial Copilot platform and pre-built industrial AI models. Joint IP provisions for co-development projects.",
    certifications:
      "ISO 27001 (information security). ISO 27017 (cloud security). ISO 27018 (cloud privacy). ISO 9001 (quality). IEC 62443 (industrial cybersecurity — critical differentiator). SOC 2 Type II. C5 (German cloud security standard — BSI). CE marking for industrial hardware. TÜV-certified where applicable. TISAX (automotive information security).",
    encryptionInfo:
      "AES-256 at rest. TLS 1.3 in transit. Hardware Security Modules (HSM) for key management. IEC 62443 compliant encryption for OT environments. Defence-grade security options for sensitive applications.",
    accessControls:
      "SSO (SAML 2.0, OIDC) via Siemens ID. Role-based access control aligned with industrial safety roles (operator, engineer, supervisor, admin). Multi-factor authentication. Integration with industrial directory services (Active Directory). OT/IT network segmentation. Audit logging per IEC 62443.",
    modelDocs:
      "Industrial Copilot capabilities documented within Siemens Xcelerator documentation. Use case playbooks for specific industries. Performance benchmarks for PLC code generation. Siemens AI Ethics Principles published.",
    explainability:
      "Generated PLC code includes comments and documentation. Engineering recommendations linked to simulation results and sensor data. Factory optimization suggestions show projected KPI impact. Predictive maintenance alerts explain contributing sensor patterns and failure mode analysis.",
    biasTesting:
      "Industrial AI models validated against physical engineering principles and safety standards. Cross-site validation for manufacturing AI transferability. Industrial safety testing per IEC 61508 where applicable. Less relevant for industrial AI (physical processes, not human decisions).",
    aiActStatus:
      "High-risk under EU AI Act for safety-critical industrial applications (Annex I, Section A — AI as safety component of machinery). Siemens actively engaged in EU AI Act implementation as member of European AI Alliance. Well-positioned as EU-native company with strong regulatory relationships. Lower risk classification for non-safety engineering assistance tools.",
    gdprStatus:
      "Excellent GDPR posture as German/EU-native company. GDPR by design. Group-level DPO. German BDSG compliance (stricter than GDPR baseline in some areas). Annual data protection audits. Binding Corporate Rules for intra-group transfers. Minimal personal data processing in industrial AI contexts.",
    euResidency:
      "Default. Munich-headquartered. EU data centres for all cloud services. German/EU data governance. Full data sovereignty for EU customers. Meets BSI C5 cloud security standard (German federal government requirement).",
    deploymentModel: "hybrid",
    sourceModel: "closed-source",
  };

  await prisma.aISystem.upsert({
    where: { slug: "siemens-industrial-copilot" },
    update: enrichment,
    create: { slug: "siemens-industrial-copilot", vendor: "Siemens", risk: "High", category: "Other", featured: false, ...enrichment },
  });

  console.log("  ✓ Siemens Industrial Copilot enriched with full enterprise intel card");
  console.log("\nDone.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
