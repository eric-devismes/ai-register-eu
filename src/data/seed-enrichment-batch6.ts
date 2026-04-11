/**
 * Content Enrichment — Batch 6: Priority 3 Sector-Specific AI Systems
 *
 * Healthcare: Tempus AI, PathAI, Paige AI, Viz.ai
 * Legal: Harvey AI, CoCounsel (Thomson Reuters)
 * Finance: Bloomberg GPT, Kensho (S&P Global), Ayasdi (SymphonyAI)
 * Manufacturing: Cognite Data Fusion, Uptake
 * HR: Eightfold AI, Beamery, Phenom
 *
 * Run with: npx tsx src/data/seed-enrichment-batch6.ts
 * Safe to run multiple times (uses upsert on slug).
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// ─── System Profiles ──────────────────────────────────────

const systems = [
  // ══════════════════════════════════════════════════════════
  //  HEALTHCARE
  // ══════════════════════════════════════════════════════════

  // ── Tempus AI ──────────────────────────────────────────
  {
    slug: "tempus-ai",
    vendor: "Tempus AI",
    name: "Tempus AI (Clinical Genomics)",
    type: "Precision Medicine & Clinical AI Platform",
    risk: "High",
    description:
      "Clinical genomics and precision medicine platform combining molecular sequencing, clinical data, and AI to guide treatment decisions in oncology, neuropsychiatry, cardiology, and infectious disease. Operates one of the largest clinico-genomic databases in the world (>200 PB of data, >7 million de-identified patient records). Key products: Tempus xT/xF/xG genomic profiling, Tempus ONE AI assistant for oncologists, Tempus Hub for real-time clinical decision support, and Lens data analytics for pharma R&D. Unique value: connects molecular data to clinical outcomes at massive scale.",
    category: "Healthcare",
    featured: false,
    capabilityType: "decision-support",
    vendorHq: "Chicago, Illinois, USA",
    euPresence:
      "Limited direct EU presence. Tempus operates primarily in the US market. International expansion underway — presence in Japan, announced plans for European markets. No EU data centre confirmed. EU oncology centres would need to evaluate data residency implications carefully.",
    foundedYear: 2015,
    employeeCount: "2,500+",
    fundingStatus:
      "Public (NASDAQ: TEM). IPO June 2024 at ~$6.1B valuation. Revenue ~$700M (2024). Founded by Eric Lefkofsky (Groupon co-founder).",
    marketPresence: "Leader",
    customerCount: "2,000+ healthcare institutions",
    notableCustomers:
      "University of Chicago Medical Center\nNCI-designated cancer centres (40%+ use Tempus)\nAstraZeneca (pharma partnership)\nGSK (drug discovery)\nBristol-Myers Squibb (clinical trials)",
    customerStories:
      "AstraZeneca uses Tempus data to identify biomarker-driven patient populations for clinical trials. Multiple NCI-designated cancer centres use Tempus xT for comprehensive genomic profiling to guide treatment decisions in solid tumors.",
    useCases:
      "Comprehensive genomic profiling for cancer treatment selection\nBiomarker-driven clinical trial matching\nReal-world evidence generation for pharma\nClinical decision support for oncologists\nNeuropsychiatric pharmacogenomics\nCardiology risk prediction\nPopulation health analytics",
    dataStorage:
      "US-based data storage. Clinico-genomic data housed in Tempus infrastructure. De-identified datasets available for pharma partners. HIPAA-compliant environment.",
    dataProcessing:
      "Data processed in US. Genomic sequencing performed in Tempus CLIA/CAP-accredited labs in Chicago. AI models trained on de-identified data. Patient consent required for data use beyond clinical care.",
    trainingDataUse:
      "AI models trained on Tempus proprietary clinico-genomic database (de-identified). Patient data used for clinical care is separate from research use. Consent framework governs data licensing to pharma partners.",
    subprocessors:
      "AWS (cloud infrastructure). CLIA-accredited laboratory operations in-house. Specific subprocessor list not publicly disclosed for EU evaluation.",
    dpaDetails:
      "HIPAA BAA standard in US. EU DPA: would need to be negotiated for EU customers given primarily US operations. No published EU-specific DPA.",
    slaDetails:
      "Genomic report turnaround: 7-14 business days for comprehensive panels. Clinical decision support platform SLA: enterprise-grade uptime. Specific SLA terms not publicly disclosed.",
    dataPortability:
      "Genomic reports deliverable in standard formats (VCF, PDF). Integration with major EHR systems (Epic, Cerner). API access for enterprise customers.",
    exitTerms: "Contract terms not publicly disclosed. Data return procedures per HIPAA requirements.",
    ipTerms: "Tempus retains IP in AI models and platform. Clinical reports provided to ordering physicians. De-identified data licensed separately.",
    certifications:
      "CLIA-certified laboratory. CAP-accredited. HIPAA-compliant. SOC 2 Type II. NY State CLEP-approved. No EU-specific certifications published.",
    encryptionInfo: "AES-256 at rest. TLS 1.2+ in transit. HIPAA-grade security controls.",
    accessControls: "Role-based access. SSO integration. Audit logging. EHR-integrated authentication.",
    modelDocs: "Clinical validation studies published in peer-reviewed journals. Tempus ONE documentation for clinicians. Algorithm performance metrics shared with ordering providers.",
    explainability: "Genomic reports include evidence citations and clinical trial links. AI recommendations linked to published literature and treatment guidelines. Transparency in biomarker-outcome associations.",
    biasTesting: "Dataset representativeness is a known challenge — historically skewed toward US academic medical centres. Efforts to diversify patient demographics in training data. Published research on algorithmic fairness in genomics.",
    aiActStatus: "High-risk under EU AI Act (Annex III, point 5h — AI intended for medical purposes). Would require full conformity assessment if deployed in EU. Also subject to MDR as potential SaMD if used for diagnosis/treatment recommendations.",
    gdprStatus: "Not currently set up for EU GDPR compliance. US-centric data architecture. Would require significant adaptation for EU deployment including data residency, DPA, and DPIA.",
    euResidency: "Not available. All data processing currently US-based. EU residency would require infrastructure investment.",
    deploymentModel: "cloud",
    sourceModel: "closed-source",
    industrySlugs: ["healthcare"],
    scores: {
      "eu-ai-act": "C",
      gdpr: "C",
      "mdr-ivdr": "B",
    },
  },

  // ── PathAI ─────────────────────────────────────────────
  {
    slug: "pathai",
    vendor: "PathAI",
    name: "PathAI (Digital Pathology)",
    type: "AI-Powered Digital Pathology Platform",
    risk: "High",
    description:
      "AI-powered digital pathology platform for accurate diagnosis and biomarker quantification from tissue slides. Products include AISight (diagnostic decision support for pathologists), PathExplore (spatial biology for translational research), and biopharma tools for clinical trial pathology. Uses deep learning to analyse H&E-stained tissue and IHC slides, quantifying biomarkers like PD-L1, HER2, and Ki-67 with high precision. Key differentiator: combines AI diagnostics with a full-service pathology laboratory (PathAI Diagnostics).",
    category: "Healthcare",
    featured: false,
    capabilityType: "image-recognition",
    vendorHq: "Boston, Massachusetts, USA",
    euPresence:
      "Limited EU presence. Biopharma partnerships include EU pharma companies. No confirmed EU data residency or EU office. CE-IVDR marking status: AISight platform pursuing regulatory approval for EU market access.",
    foundedYear: 2016,
    employeeCount: "400+",
    fundingStatus:
      "Private — raised $400M+ total. Series D at ~$1.5B valuation. Backed by General Atlantic, Tiger Global, D1 Capital, Bristol-Myers Squibb.",
    marketPresence: "Challenger",
    customerCount: "50+ biopharma partners, multiple health systems",
    notableCustomers:
      "Bristol-Myers Squibb (immuno-oncology companion diagnostics)\nRoche/Genentech\nAstraZeneca\nNovartis\nPoplar Health (pathology network)",
    customerStories:
      "Bristol-Myers Squibb partnered with PathAI for AI-powered PD-L1 and TMB biomarker quantification across multiple immuno-oncology trials. Large pathology networks use AISight to standardize diagnostic quality across multiple sites.",
    useCases:
      "AI-assisted cancer diagnosis from H&E slides\nBiomarker quantification (PD-L1, HER2, Ki-67)\nClinical trial pathology standardization\nCompanion diagnostic development\nSpatial biology and translational research\nDigitized pathology workflow optimization",
    dataStorage: "US-based data storage. HIPAA-compliant infrastructure. Biopharma study data handled per specific study protocols.",
    dataProcessing: "Data processed in US. Whole slide images analysed in PathAI cloud. On-premise deployment options available for health systems.",
    trainingDataUse: "AI models trained on proprietary annotated pathology dataset curated by expert pathologists. Biopharma partner data used per contractual agreement. De-identification applied.",
    subprocessors: "AWS (primary infrastructure). CLIA-accredited laboratory operations for PathAI Diagnostics.",
    dpaDetails: "HIPAA BAA standard. EU DPA would need negotiation. No published EU-specific terms.",
    slaDetails: "Pathology report turnaround times per study protocol. Platform SLA for enterprise customers.",
    dataPortability: "Slide analysis results exportable. Integration with major LIS/LIMS systems. Standard pathology report formats.",
    exitTerms: "Contract terms not publicly disclosed.",
    ipTerms: "PathAI retains IP in AI models. Biopharma partners retain IP in study-specific findings per agreement.",
    certifications: "CLIA-certified laboratory (PathAI Diagnostics). CAP-accredited. HIPAA-compliant. SOC 2. CE-IVDR marking in progress for select products.",
    encryptionInfo: "AES-256 at rest. TLS 1.2+ in transit.",
    accessControls: "Role-based access. SSO. Audit trails. Study-level access controls for biopharma.",
    modelDocs: "Peer-reviewed publications on algorithm performance. Model cards for biopharma partners. Clinical validation data shared under NDA.",
    explainability: "Heatmap overlays showing regions of interest on slides. Quantitative biomarker scores with confidence intervals. Pathologist-interpretable outputs.",
    biasTesting: "Validation across multiple tissue types, staining protocols, and scanner manufacturers. Cross-site validation studies. Known limitation: performance varies with slide preparation quality.",
    aiActStatus: "High-risk under EU AI Act (medical device AI). Subject to MDR/IVDR as IVD software for diagnostic decision support. Would require Notified Body assessment for EU market access.",
    gdprStatus: "Primarily US-focused. EU compliance would require data residency and DPA framework adaptation.",
    euResidency: "Not currently available. On-premise deployment possible for EU health systems but cloud processing US-based.",
    deploymentModel: "cloud",
    sourceModel: "closed-source",
    industrySlugs: ["healthcare"],
    scores: {
      "eu-ai-act": "C",
      gdpr: "C",
      "mdr-ivdr": "B",
    },
  },

  // ── Paige AI ───────────────────────────────────────────
  {
    slug: "paige-ai",
    vendor: "Paige",
    name: "Paige AI (Cancer Diagnostics)",
    type: "AI-Powered Cancer Diagnostics",
    risk: "High",
    description:
      "First AI pathology product to receive FDA approval (De Novo, 2021) for clinical use. Paige Prostate detects cancer in prostate biopsies. Paige Breast, Paige Skin, and Paige Full Suite cover multiple cancer types. Built on a strategic partnership with Memorial Sloan Kettering Cancer Center (MSK), with exclusive access to MSK's vast digital pathology archive. Key differentiator: regulatory-first approach — the only pathology AI company with FDA-cleared products for primary diagnosis.",
    category: "Healthcare",
    featured: false,
    capabilityType: "image-recognition",
    vendorHq: "New York, New York, USA",
    euPresence:
      "CE-IVD marked (legacy directive) for Paige Prostate in EU markets. Transitioning to IVDR. Deployed in select European pathology laboratories. No dedicated EU data centre — deployment via cloud or on-premise at customer site.",
    foundedYear: 2017,
    employeeCount: "150+",
    fundingStatus:
      "Private — raised $250M+ total. Series C (2023). Backed by Goldman Sachs, BOND Capital, Casdin Capital, MSK. Valuation undisclosed.",
    marketPresence: "Niche Leader",
    customerCount: "Clinical deployment in 100+ pathology laboratories globally",
    notableCustomers:
      "Memorial Sloan Kettering Cancer Center (founding partner)\nHCA Healthcare (largest US hospital system)\nQuest Diagnostics\nLabCorp\nSelect European university hospitals",
    customerStories:
      "MSK uses Paige AI across multiple cancer types for research and clinical decision support. HCA Healthcare deployed Paige across its network to improve prostate cancer detection rates and reduce missed diagnoses.",
    useCases:
      "Primary cancer diagnosis in prostate, breast, and skin biopsies\nCancer detection quality assurance\nWorkflow prioritization (flagging suspicious slides)\nBiomarker expression analysis\nResearch pathology and cohort identification",
    dataStorage: "Cloud-based (Azure) or on-premise deployment. HIPAA-compliant. Data processing location depends on deployment model.",
    dataProcessing: "Whole slide images processed at point of deployment. Cloud option processes in Azure US regions. On-premise keeps data local.",
    trainingDataUse: "Models trained on MSK pathology archive (exclusive partnership). Patient consent per MSK IRB protocols. De-identified training data.",
    subprocessors: "Microsoft Azure (cloud). On-premise deployments have no cloud subprocessors.",
    dpaDetails: "HIPAA BAA standard. EU DPA available for European deployments. CE-IVD compliance documentation.",
    slaDetails: "Platform uptime SLA for cloud deployments. Analysis turnaround: near real-time (seconds per slide region).",
    dataPortability: "Results exportable to LIS systems. Standard diagnostic report formats. API integration available.",
    exitTerms: "Annual enterprise contracts. On-premise deployment allows full data control.",
    ipTerms: "Paige retains IP in AI models. Diagnostic outputs belong to deploying laboratory.",
    certifications: "FDA De Novo authorized (Paige Prostate, 2021). CE-IVD marked (legacy). ISO 13485 QMS. SOC 2 Type II. HIPAA-compliant. IVDR transition in progress.",
    encryptionInfo: "AES-256 at rest. TLS 1.3 in transit. Compliant with healthcare security standards.",
    accessControls: "Role-based access. Integration with hospital directory services. Audit logging. Multi-factor authentication.",
    modelDocs: "FDA submission documentation publicly referenced. Peer-reviewed clinical validation studies. Performance data: Paige Prostate showed 70% increase in cancer detection in clinical studies.",
    explainability: "Heatmap visualizations highlighting areas of concern on tissue slides. Confidence scores per region. Pathologist-interpretable outputs designed for clinical workflow integration.",
    biasTesting: "Validated across multiple pathology laboratories, scanner types, and tissue preparation protocols. Demographic representativeness of MSK training data assessed. Known limitation: performance variation with rare cancer subtypes.",
    aiActStatus: "High-risk under EU AI Act (Annex III — medical device AI). Subject to IVDR as IVD diagnostic software. CE-IVD marked under legacy directive; IVDR transition underway. Conformity assessment required by 2028 IVDR deadline.",
    gdprStatus: "CE-IVD compliance includes GDPR considerations for EU deployments. DPA framework established. On-premise deployment enables full GDPR compliance.",
    euResidency: "Available via on-premise deployment. Cloud option currently US-based Azure regions. EU cloud hosting under evaluation.",
    deploymentModel: "hybrid",
    sourceModel: "closed-source",
    industrySlugs: ["healthcare"],
    scores: {
      "eu-ai-act": "B",
      gdpr: "B",
      "mdr-ivdr": "A",
    },
  },

  // ── Viz.ai ─────────────────────────────────────────────
  {
    slug: "viz-ai",
    vendor: "Viz.ai",
    name: "Viz.ai (Vascular & Stroke Detection)",
    type: "AI-Powered Clinical Triage & Detection",
    risk: "High",
    description:
      "FDA-cleared AI platform for automated detection of time-sensitive vascular conditions — primarily large vessel occlusion (LVO) stroke, pulmonary embolism, aortic dissection, and intracranial hemorrhage from CT/CTA scans. Alerts the specialist care team in parallel with radiology read, reducing time-to-treatment in stroke and vascular emergencies. 37+ FDA-cleared algorithms across neurovascular, cardiovascular, and pulmonary conditions. Key differentiator: proven clinical outcome data showing reduced door-to-treatment times and improved patient survival.",
    category: "Healthcare",
    featured: false,
    capabilityType: "image-recognition",
    vendorHq: "San Francisco, California, USA",
    euPresence:
      "CE-marked for EU market. Active deployment in European hospitals including UK NHS trusts. European team and partnerships. Viz.ai algorithms available for EU clinical use under MDR.",
    foundedYear: 2016,
    employeeCount: "500+",
    fundingStatus:
      "Private — raised $250M+ total. Series D (2022). Backed by Insight Partners, Tiger Global, Greenoaks Capital. Acquired by Olympus Corporation for ~$1.5B (announced 2025).",
    marketPresence: "Leader",
    customerCount: "1,400+ hospitals globally",
    notableCustomers:
      "HCA Healthcare\nCommonSpirit Health\nAscension\nUK NHS trusts\nMajor European stroke centres\nUS Veterans Health Administration",
    customerStories:
      "Large health systems report 20-30 minute reduction in door-to-groin time for LVO stroke patients. UK NHS trusts deployed Viz LVO for hyperacute stroke pathway optimization. Clinical studies show 28% improvement in functional outcomes for Viz-detected stroke patients.",
    useCases:
      "Large vessel occlusion stroke detection and team notification\nPulmonary embolism detection from CT angiography\nAortic dissection detection\nIntracranial hemorrhage detection\nCare coordination and automated specialist alerts\nTime-to-treatment workflow optimization",
    dataStorage: "Cloud-based (AWS). US data in US regions. EU deployment available with EU data processing. HIPAA and GDPR-compliant options.",
    dataProcessing: "CT/CTA images processed in real-time. Cloud-based analysis with secure transmission from hospital PACS. Results delivered within minutes.",
    trainingDataUse: "Models trained on de-identified clinical imaging data. Patient consent per IRB protocols. Continuous performance monitoring from deployed sites.",
    subprocessors: "AWS (primary cloud). Integration with hospital PACS/EHR systems.",
    dpaDetails: "HIPAA BAA standard. GDPR DPA available for EU customers. CE-marking documentation includes data protection provisions.",
    slaDetails: "Near real-time analysis (< 5 minutes for stroke detection). High availability SLA for clinical-grade service. 24/7 monitoring.",
    dataPortability: "Results delivered to hospital PACS and EHR. HL7 FHIR integration. Standard DICOM workflows.",
    exitTerms: "Hospital-level contracts. Integration via standard protocols reduces lock-in.",
    ipTerms: "Viz.ai retains IP in algorithms. Clinical results provided to hospitals. De-identified data may be used for algorithm improvement per contract.",
    certifications: "37+ FDA 510(k) clearances. CE-marked (MDR). SOC 2 Type II. HIPAA-compliant. ISO 13485 QMS. ISO 27001.",
    encryptionInfo: "AES-256 at rest. TLS 1.2+ in transit. End-to-end encryption for clinical image transmission.",
    accessControls: "Hospital-level access control. Integration with hospital directories. Role-based notifications. Mobile app with biometric authentication.",
    modelDocs: "Extensive FDA submission documentation. 30+ peer-reviewed publications. Clinical validation across diverse patient populations. Performance metrics publicly available.",
    explainability: "Visual overlays highlighting detected pathology on CT images. Confidence scores for detections. Clear alert notifications to care team with relevant imaging.",
    biasTesting: "Validated across diverse patient demographics, scanner manufacturers, and imaging protocols. Multi-site clinical validation studies. Known limitation: performance requires adequate image quality.",
    aiActStatus: "High-risk under EU AI Act (Annex III — medical device AI). CE-marked under MDR. Already compliant with EU medical device requirements. Well-positioned for AI Act conformity assessment.",
    gdprStatus: "GDPR compliance framework established for EU deployments. DPA available. Data minimization applied — only processes relevant CT images.",
    euResidency: "Available for EU deployments. CE-marked product with EU data processing options.",
    deploymentModel: "cloud",
    sourceModel: "closed-source",
    industrySlugs: ["healthcare"],
    scores: {
      "eu-ai-act": "B+",
      gdpr: "B+",
      "mdr-ivdr": "A",
    },
  },

  // ══════════════════════════════════════════════════════════
  //  LEGAL
  // ══════════════════════════════════════════════════════════

  // ── Harvey AI ──────────────────────────────────────────
  {
    slug: "harvey-ai",
    vendor: "Harvey",
    name: "Harvey AI (Legal AI)",
    type: "AI Legal Assistant Platform",
    risk: "Limited",
    description:
      "AI platform purpose-built for legal professionals. Offers contract analysis, legal research, due diligence, litigation support, and regulatory compliance assistance. Built on OpenAI models fine-tuned for legal reasoning, with proprietary legal data and workflows. Key differentiator: designed specifically for law firms and legal departments with security controls meeting law firm confidentiality requirements. Handles complex legal reasoning, multi-jurisdictional analysis, and citation verification.",
    category: "Other",
    featured: false,
    capabilityType: "text-generation",
    vendorHq: "San Francisco, California, USA",
    euPresence:
      "Active in European legal market. Major UK and EU law firms among customers. London presence via legal market partnerships. EU data residency options under development.",
    foundedYear: 2022,
    employeeCount: "200+",
    fundingStatus:
      "Private — raised $300M+ total. Series C (2024) at $3B+ valuation. Backed by Sequoia Capital, Google Ventures, Kleiner Perkins, OpenAI Startup Fund.",
    marketPresence: "Leader",
    customerCount: "Law firms, corporate legal departments, and professional services firms",
    notableCustomers:
      "Allen & Overy (founding partner, now A&O Shearman)\nPwC (professional services)\nMacfarlanes\nMishcon de Reya\nO'Melveny & Myers\nLarge global law firms (names often confidential)",
    customerStories:
      "Allen & Overy was Harvey's first enterprise customer, deploying AI across its global practice for contract analysis, legal research, and client advisory. PwC rolled out Harvey to 4,000+ legal professionals across its global network. Law firms report 30-40% time savings on routine legal research tasks.",
    useCases:
      "Contract review and analysis\nLegal research and case law analysis\nDue diligence document review\nRegulatory compliance assessment\nLitigation support and brief drafting\nMulti-jurisdictional legal analysis\nM&A transaction support",
    dataStorage: "Cloud-based. Customer data isolated per-tenant. Azure infrastructure. Data residency options being expanded.",
    dataProcessing: "Processing via OpenAI API with enterprise-grade security. Customer data not used for model training. Tenant isolation enforced.",
    trainingDataUse: "Fine-tuned on licensed legal datasets. Customer data is NOT used for model training (strict contractual commitment — critical for law firm adoption). Attorney-client privilege protections built into architecture.",
    subprocessors: "Microsoft Azure (infrastructure). OpenAI (model inference — enterprise agreement). Specific subprocessor list available under NDA.",
    dpaDetails: "Enterprise DPA available. Strict confidentiality provisions required by law firm customers. Data handling meets attorney-client privilege requirements.",
    slaDetails: "Enterprise-grade uptime SLA. Response time targets for interactive queries. Priority support for enterprise customers.",
    dataPortability: "Outputs exportable in standard document formats. API integration with legal practice management systems.",
    exitTerms: "Annual enterprise contracts. Data deletion on termination. No lock-in on outputs.",
    ipTerms: "Customer retains all IP in outputs and uploaded documents. Harvey retains IP in platform and models.",
    certifications: "SOC 2 Type II. ISO 27001. GDPR-compliant DPA. Third-party security audits. Meets law firm outside counsel security requirements.",
    encryptionInfo: "AES-256 at rest. TLS 1.3 in transit. Customer-managed encryption keys available. Zero-retention on inference data.",
    accessControls: "SSO (SAML 2.0, OIDC). Role-based access. Ethical wall controls (matter-level isolation). Audit logging. Multi-factor authentication.",
    modelDocs: "Legal-specific model documentation. Performance benchmarks on legal reasoning tasks. Limitations disclosed (not a substitute for legal judgment).",
    explainability: "Citation of relevant case law and statutes. Source document references. Confidence indicators on legal analysis. Draft outputs clearly marked as AI-generated.",
    biasTesting: "Legal reasoning tested across jurisdictions. Bias testing on contractual analysis. Known limitation: training data skewed toward common law jurisdictions (US/UK).",
    aiActStatus: "Limited risk under EU AI Act (AI for professional legal work is not in Annex III high-risk list, unless used for access to justice decisions). Transparency obligations apply.",
    gdprStatus: "GDPR-compliant DPA. Data residency options under development. SCCs for international transfers. Working toward EU hosting option.",
    euResidency: "Under development. Currently processed via US/Azure infrastructure with enterprise security. EU-resident hosting planned.",
    deploymentModel: "cloud",
    sourceModel: "closed-source",
    industrySlugs: ["financial-services"],
    scores: {
      "eu-ai-act": "B",
      gdpr: "B",
    },
  },

  // ── CoCounsel (Thomson Reuters) ────────────────────────
  {
    slug: "cocounsel-thomson-reuters",
    vendor: "Thomson Reuters",
    name: "CoCounsel AI (Westlaw AI)",
    type: "AI Legal Research & Document Analysis",
    risk: "Limited",
    description:
      "AI-powered legal assistant integrated into Thomson Reuters' Westlaw legal research platform. Performs legal research, document review, contract analysis, and legal drafting. Built on a combination of GPT-4 and Thomson Reuters' proprietary legal content (the world's largest legal database). Key differentiator: grounded in verified legal content — citations verified against Westlaw's curated database, dramatically reducing hallucination risk compared to general-purpose LLMs. Integrated into the legal workflow most lawyers already use.",
    category: "Other",
    featured: false,
    capabilityType: "text-generation",
    vendorHq: "Toronto, Canada (Thomson Reuters HQ)",
    euPresence:
      "Strong EU/UK presence via Thomson Reuters. European offices in London, Dublin, Zurich, and multiple EU capitals. Westlaw UK/EU available with EU-relevant legal content. Thomson Reuters processes data in EU for EU customers. Long-established European legal content operation.",
    foundedYear: 2023,
    employeeCount: "Thomson Reuters: 26,000+ globally (CoCounsel team within)",
    fundingStatus:
      "Part of Thomson Reuters (NYSE: TRI). Market cap ~$80B. Revenue ~$7B annually. Thomson Reuters invested $100M+ annually in AI capabilities.",
    marketPresence: "Leader",
    customerCount: "Thomson Reuters serves 500,000+ legal professionals globally",
    notableCustomers:
      "Am Law 200 firms (majority use Westlaw)\nUK Magic Circle firms\nEuropean corporate legal departments\nGovernment legal agencies\nIn-house legal teams at Fortune 500 companies",
    customerStories:
      "Early CoCounsel adopters report 40-50% reduction in legal research time. Westlaw's citation verification reduces hallucination risk to near-zero for legal research outputs. Thomson Reuters' 2024 AI-Assisted Research Survey: 85% of CoCounsel users report improved research quality.",
    useCases:
      "Legal research with verified citations\nContract review and clause extraction\nLegal document drafting and editing\nCase law analysis and comparison\nRegulatory compliance research\nDue diligence document review\nDeposition preparation",
    dataStorage: "Thomson Reuters data centres (US, EU, Asia-Pacific). EU customers can be served from EU infrastructure. ISO 27001-certified facilities.",
    dataProcessing: "CoCounsel queries processed with enterprise isolation. Customer data not retained for training. Responses verified against Westlaw database.",
    trainingDataUse: "Built on Thomson Reuters' proprietary legal content (Westlaw database — curated legal content spanning 200+ years). Customer queries and data NOT used for model training. Editorial content maintained by 1,500+ attorney-editors.",
    subprocessors: "Microsoft Azure (AI infrastructure). Thomson Reuters own data centres (content hosting). OpenAI (model inference under enterprise agreement).",
    dpaDetails: "Thomson Reuters enterprise DPA. GDPR-compliant for EU customers. Data processing addendum available. Binding Corporate Rules (BCRs) approved by Irish DPC for international transfers.",
    slaDetails: "Enterprise-grade SLA consistent with Thomson Reuters Westlaw platform. 99.9% uptime target. 24/7 global support.",
    dataPortability: "Research outputs exportable. Integration with legal practice management systems. Standard document formats.",
    exitTerms: "Annual subscription. Data deletion on termination. No lock-in on research outputs. Westlaw content access separate from AI features.",
    ipTerms: "Customer retains IP in work product. Thomson Reuters retains IP in Westlaw content and AI platform.",
    certifications: "SOC 2 Type II. ISO 27001. ISO 27701 (privacy). GDPR-compliant. Thomson Reuters BCRs approved by Irish DPC. HIPAA BAA available for legal-health intersections.",
    encryptionInfo: "AES-256 at rest. TLS 1.2+ in transit. Enterprise key management.",
    accessControls: "SSO (SAML, OIDC). Role-based access. Matter-level security. Audit logging. Multi-factor authentication. Integration with law firm directory services.",
    modelDocs: "Thomson Reuters AI Principles published. Model performance documentation. Regular accuracy benchmarking against legal research standards.",
    explainability: "All legal research outputs include verified Westlaw citations. Source links to full case text. Confidence indicators. Clear disclosure that AI assists but does not replace legal judgment.",
    biasTesting: "Content curated by attorney-editors for accuracy. Jurisdictional coverage testing. Known limitation: English-language legal content most comprehensive; other jurisdictions vary.",
    aiActStatus: "Limited risk under EU AI Act (professional legal tool, not autonomous decision-making). Thomson Reuters actively monitoring AI Act compliance requirements. Transparency obligations met via clear AI disclosure.",
    gdprStatus: "Strong GDPR posture via Thomson Reuters BCRs. DPA available. EU data processing available. Data minimization applied to AI queries.",
    euResidency: "Available. Thomson Reuters operates EU data centres. EU legal content hosted and processed in EU. BCRs cover any necessary international transfers.",
    deploymentModel: "cloud",
    sourceModel: "closed-source",
    industrySlugs: ["financial-services"],
    scores: {
      "eu-ai-act": "B+",
      gdpr: "A",
    },
  },

  // ══════════════════════════════════════════════════════════
  //  FINANCE
  // ══════════════════════════════════════════════════════════

  // ── Bloomberg AI ───────────────────────────────────────
  {
    slug: "bloomberg-ai",
    vendor: "Bloomberg L.P.",
    name: "Bloomberg AI (BloombergGPT)",
    type: "Financial Data & AI Analytics Platform",
    risk: "Limited",
    description:
      "Bloomberg's AI capabilities embedded across the Bloomberg Terminal and data services. BloombergGPT was a purpose-built 50B parameter LLM trained on Bloomberg's proprietary financial data corpus (363B tokens of financial data + 345B tokens of general data). Bloomberg Terminal AI features include: natural language querying of financial data, automated earnings analysis, sentiment analysis across news/filings, and AI-assisted research. Key differentiator: decades of curated financial data providing unmatched financial domain knowledge.",
    category: "Other",
    featured: false,
    capabilityType: "text-generation",
    vendorHq: "New York, New York, USA",
    euPresence:
      "Strong EU presence. Major European offices in London (EMEA HQ), Frankfurt, Paris, Zurich, Milan, Madrid, Amsterdam, Stockholm. Bloomberg Terminal widely used by EU financial institutions. EU data processing capabilities through European infrastructure.",
    foundedYear: 1981,
    employeeCount: "20,000+",
    fundingStatus:
      "Private — owned by Michael Bloomberg. Revenue ~$13B annually. No external investors. Complete financial independence.",
    marketPresence: "Leader",
    customerCount: "325,000+ Terminal subscribers globally",
    notableCustomers:
      "Major global banks (Goldman Sachs, JPMorgan, Deutsche Bank, BNP Paribas)\nCentral banks (ECB, Federal Reserve, Bank of England)\nAsset managers (BlackRock, Vanguard, Amundi)\nHedge funds and sovereign wealth funds\nRegulatory authorities",
    customerStories:
      "Bloomberg Terminal is the standard platform for financial professionals globally. AI features are integrated into existing workflows rather than sold as standalone products. Earnings analysis AI reduces analyst research time by estimated 40%.",
    useCases:
      "Natural language financial data querying\nAutomated earnings analysis and summarization\nSentiment analysis across news and regulatory filings\nFixed income analytics and pricing\nESG data analysis and scoring\nRegulatory compliance monitoring\nPortfolio risk analytics",
    dataStorage: "Bloomberg data centres globally (US, EU, Asia). EU financial data processed in EU infrastructure. Strict client data segregation.",
    dataProcessing: "Terminal queries processed in Bloomberg infrastructure. Client proprietary data (portfolios, models) segregated. AI inference runs on Bloomberg compute.",
    trainingDataUse: "BloombergGPT trained on Bloomberg's proprietary 40+ year financial data corpus. Client-specific data NOT used for model training. Editorial content maintained by 2,700+ journalists and analysts.",
    subprocessors: "Bloomberg operates its own data centres and infrastructure. Minimal third-party dependency for core Terminal services.",
    dpaDetails: "Bloomberg enterprise agreement includes data protection provisions. GDPR-compliant for EU clients. Data handling governed by financial services regulatory requirements.",
    slaDetails: "Bloomberg Terminal: 99.99% uptime target (industry-leading). 24/7 global support. Dedicated account management for enterprise clients.",
    dataPortability: "Data feeds available via Bloomberg Data License and Enterprise Access Point. API access (BLPAPI). Standard financial data formats (FIX, FIXML).",
    exitTerms: "2-year Terminal contracts standard. Data accessible via API during contract. Portfolio data exportable.",
    ipTerms: "Bloomberg retains IP in data, analytics, and AI models. Client retains IP in proprietary portfolio data and research.",
    certifications: "SOC 2 Type II. ISO 27001. ISAE 3402. Financial services regulatory compliance (SEC, ESMA, FCA registered). GDPR-compliant.",
    encryptionInfo: "Military-grade encryption. Dedicated Bloomberg network (not internet-dependent for Terminal). AES-256. TLS 1.3.",
    accessControls: "Bloomberg Terminal biometric login (fingerprint). SSO for enterprise. Per-user entitlements. Comprehensive audit trails. Chinese wall controls for compliance.",
    modelDocs: "BloombergGPT research paper published (arXiv). AI feature documentation within Terminal. Limited external model documentation.",
    explainability: "Financial analytics include source data citations. News sentiment shows underlying article references. AI outputs contextualized within Bloomberg data framework.",
    biasTesting: "Financial data reflects market realities. BloombergGPT tested on financial NLP benchmarks. News sentiment algorithms tested for geographic and sectoral bias.",
    aiActStatus: "Limited risk under EU AI Act for most Terminal AI features. If used for credit scoring or investment decisions (Annex III), deployer obligations apply. Bloomberg as provider primarily supplies data/analytics tools.",
    gdprStatus: "Strong GDPR compliance posture. EU data processed in EU. Bloomberg entity in UK (post-Brexit). Standard Contractual Clauses and BCR-equivalent protections.",
    euResidency: "EU data processing available for EU clients. Bloomberg European infrastructure handles EU-specific data requirements. Compliant with ESMA and national supervisory authority requirements.",
    deploymentModel: "cloud",
    sourceModel: "closed-source",
    industrySlugs: ["financial-services"],
    scores: {
      "eu-ai-act": "B+",
      gdpr: "A",
      dora: "A",
    },
  },

  // ── Kensho (S&P Global) ────────────────────────────────
  {
    slug: "kensho-sp-global",
    vendor: "S&P Global (Kensho)",
    name: "Kensho AI (S&P Global)",
    type: "Financial Analytics AI Platform",
    risk: "Limited",
    description:
      "S&P Global's AI innovation hub. Kensho builds AI/ML solutions for financial data extraction, analysis, and linking across S&P Global's data assets (S&P Capital IQ, Platts, Market Intelligence). Key products: Kensho NERD (Named Entity Recognition), Kensho Extract (document data extraction), Kensho Classify (text classification), Kensho Scribe (speech-to-text for financial contexts), and Kensho Link (entity resolution across datasets). Acquired by S&P Global in 2018 for $550M — at the time the largest AI acquisition in history.",
    category: "Other",
    featured: false,
    capabilityType: "text-generation",
    vendorHq: "Cambridge, Massachusetts, USA (Kensho) / New York (S&P Global HQ)",
    euPresence:
      "Strong EU presence through S&P Global. European offices in London, Frankfurt, Paris, Stockholm, Madrid, and multiple other EU capitals. S&P Global serves EU financial institutions extensively. Kensho AI powers features across S&P Global products used by EU clients.",
    foundedYear: 2013,
    employeeCount: "Kensho: 200+ (within S&P Global: 35,000+)",
    fundingStatus:
      "Wholly owned subsidiary of S&P Global (NYSE: SPGI). S&P Global market cap ~$160B. Revenue ~$14B annually.",
    marketPresence: "Leader",
    customerCount: "S&P Global serves virtually all major financial institutions globally",
    notableCustomers:
      "Global investment banks\nCentral banks and regulatory authorities\nAsset management firms\nInsurance companies\nCorporate treasury departments\nRating agencies",
    customerStories:
      "Kensho NERD powers entity recognition across S&P Capital IQ, linking company mentions to structured financial data. Kensho Extract processes millions of financial documents annually, extracting structured data from unstructured filings.",
    useCases:
      "Automated financial document data extraction\nEntity recognition and resolution in financial text\nEarnings call transcription and analysis\nText classification for financial content\nData linking across disparate financial datasets\nRegulatory filing analysis\nESG data extraction and scoring",
    dataStorage: "S&P Global data centres (US, EU). Data residency per S&P Global infrastructure. ISO 27001-certified facilities.",
    dataProcessing: "Kensho AI processing embedded within S&P Global data products. Client-specific data processing per enterprise agreement.",
    trainingDataUse: "Models trained on S&P Global proprietary data assets (60+ years of financial data). Client data not used for model training without consent.",
    subprocessors: "AWS (primary cloud). S&P Global own infrastructure. Enterprise-grade security.",
    dpaDetails: "S&P Global enterprise DPA. GDPR-compliant. Data protection governed by S&P Global data governance framework.",
    slaDetails: "Enterprise-grade SLA per S&P Global platform standards. 99.9%+ uptime. Dedicated support.",
    dataPortability: "Data accessible via S&P Global APIs and data feeds. Standard financial data formats. Capital IQ and Market Intelligence export capabilities.",
    exitTerms: "S&P Global enterprise contracts. Data access during contract term. Standard financial data provider exit provisions.",
    ipTerms: "S&P Global retains IP in Kensho AI technology and data products. Client retains IP in proprietary analysis.",
    certifications: "SOC 2 Type II. ISO 27001. ISAE 3402. Financial regulatory compliance. GDPR-compliant.",
    encryptionInfo: "AES-256 at rest. TLS 1.2+ in transit. Enterprise key management.",
    accessControls: "SSO integration. Role-based access. Entitlement management. Audit logging. Compliance with financial services access control requirements.",
    modelDocs: "Kensho research papers published at NeurIPS, EMNLP, and other ML conferences. Documentation within S&P Global products. API documentation for data services.",
    explainability: "Entity recognition provides source text highlighting. Data extraction includes confidence scores. Classification provides category explanations.",
    biasTesting: "Financial data models tested across global markets. Language coverage testing for multi-language financial documents.",
    aiActStatus: "Limited risk for data extraction and analytics tools. If used in credit scoring or investment decision-making contexts (Annex III), deployer obligations apply.",
    gdprStatus: "GDPR-compliant through S&P Global data governance. DPA available. EU data processing. BCR-equivalent protections.",
    euResidency: "Available through S&P Global European infrastructure. EU financial data processed in EU.",
    deploymentModel: "cloud",
    sourceModel: "closed-source",
    industrySlugs: ["financial-services"],
    scores: {
      "eu-ai-act": "B+",
      gdpr: "A",
      dora: "B+",
    },
  },

  // ── Ayasdi / SymphonyAI ────────────────────────────────
  {
    slug: "symphonyai-sensa",
    vendor: "SymphonyAI",
    name: "SymphonyAI Sensa (AML/Financial Crime)",
    type: "AI-Powered Financial Crime Detection",
    risk: "High",
    description:
      "Enterprise AI platform for financial crime detection, anti-money laundering (AML), and regulatory compliance in banking and financial services. SymphonyAI acquired Ayasdi (topological data analysis pioneer) and NetReveal to build Sensa — a comprehensive financial crime platform. Uses unsupervised ML and network analysis to detect suspicious activity patterns that traditional rule-based systems miss. Key differentiator: reduces false positives by 60-80% compared to rule-based AML systems, dramatically cutting compliance costs while improving detection quality.",
    category: "Other",
    featured: false,
    capabilityType: "decision-support",
    vendorHq: "Palo Alto, California, USA",
    euPresence:
      "Strong EU presence. European offices in London, Amsterdam. NetReveal (acquired) had extensive European banking customer base. EU deployments support local data residency requirements. Significant customer base among European banks and financial institutions.",
    foundedYear: 2017,
    employeeCount: "3,000+ (SymphonyAI group)",
    fundingStatus:
      "Private — backed by Dr. Romesh Wadhwani (founder, sole investor). SymphonyAI group revenue estimated $500M+. No external institutional investors — provides long-term strategic stability.",
    marketPresence: "Leader",
    customerCount: "200+ financial institutions globally",
    notableCustomers:
      "HSBC (global AML programme)\nStandard Chartered Bank\nSociété Générale\nDeutsche Bank\nINNG Group\nNatWest Group\nLarge EU banks (names often confidential in AML context)",
    customerStories:
      "HSBC deployed SymphonyAI Sensa for enterprise-wide AML compliance, reporting 60%+ reduction in false positive alerts. European banks report significant cost savings in compliance operations while meeting 4AMLD/5AMLD/6AMLD requirements. Standard Chartered uses Sensa for cross-border transaction monitoring.",
    useCases:
      "Anti-money laundering (AML) transaction monitoring\nSanctions screening and watchlist management\nKnow Your Customer (KYC) automation\nSuspicious activity report (SAR) generation\nFraud detection and prevention\nCustomer risk scoring and due diligence\nRegulatory reporting automation",
    dataStorage: "On-premise or private cloud deployment standard for banking customers. EU data residency available. No data leaves customer environment in on-prem deployments.",
    dataProcessing: "Transaction data processed at customer site (on-prem) or in dedicated cloud environments. Real-time and batch processing modes. Data never commingled between customers.",
    trainingDataUse: "Base models trained on synthetic and anonymized financial crime patterns. Customer-specific models trained on-site with customer data that never leaves the customer environment. No data pooling across customers.",
    subprocessors: "On-premise: none (runs in customer data centre). Cloud: major cloud providers per customer choice. Customer maintains full data control.",
    dpaDetails: "Enterprise DPA standard for banking clients. GDPR-compliant. Data processing governed by banking regulatory requirements (DORA, EBA guidelines). DPA negotiated per customer.",
    slaDetails: "Enterprise SLA with 99.99% uptime targets for critical AML systems. 24/7 support. Defined response times for severity levels. Regulatory uptime requirements met.",
    dataPortability: "Standard regulatory report formats (SWIFT, FIU reporting). API integration with core banking systems. Data exportable in standard formats.",
    exitTerms: "Multi-year enterprise contracts standard in banking AML. Transition support provided. Data stays with customer (on-prem). Model configurations exportable.",
    ipTerms: "SymphonyAI retains IP in platform and base models. Customer retains IP in customer-specific model configurations and data. SAR reports and regulatory filings owned by customer.",
    certifications: "SOC 2 Type II. ISO 27001. PCI DSS where applicable. EBA/EIOPA compliance. GDPR-compliant. Annual penetration testing. Banking-grade security audits.",
    encryptionInfo: "AES-256 at rest. TLS 1.2+ in transit. HSM key management for banking deployments. Compliant with PCI DSS and banking security standards.",
    accessControls: "Bank-grade access controls. Integration with banking IAM systems. Role-based access with maker-checker workflows. Comprehensive audit trails for regulatory review.",
    modelDocs: "Model documentation meeting EBA model risk management requirements. Validation reports. Performance metrics (detection rates, false positive rates). Regulatory compliance documentation.",
    explainability: "Alert explanations showing why transactions were flagged. Network visualization of suspicious relationships. Case narratives auto-generated for investigators. Evidence chains for SAR filing.",
    biasTesting: "Tested across customer demographics to prevent discriminatory flagging. False positive analysis by customer segment. Compliance with fair lending and anti-discrimination requirements.",
    aiActStatus: "High-risk under EU AI Act (Annex III, point 5b — AI for creditworthiness assessment and credit scoring, and point 5a — biometric identification). AML/KYC AI may fall under high-risk categorisation. Strong governance already in place due to banking regulation.",
    gdprStatus: "GDPR-compliant. EU data residency via on-premise deployment. DPA standard. Processing of special categories of data (for AML purposes) governed by national AML legislation as legal basis.",
    euResidency: "Fully available via on-premise deployment in EU data centres. Customer controls all data. No data transfer to non-EU jurisdictions in on-prem mode.",
    deploymentModel: "on-premise",
    sourceModel: "closed-source",
    industrySlugs: ["financial-services"],
    scores: {
      "eu-ai-act": "B+",
      gdpr: "A",
      dora: "A",
      "eba-eiopa-guidelines": "A",
    },
  },

  // ══════════════════════════════════════════════════════════
  //  MANUFACTURING
  // ══════════════════════════════════════════════════════════

  // ── Cognite Data Fusion ────────────────────────────────
  {
    slug: "cognite-data-fusion",
    vendor: "Cognite",
    name: "Cognite Data Fusion (Industrial AI)",
    type: "Industrial Data & AI Platform",
    risk: "Limited",
    description:
      "Industrial DataOps and AI platform that contextualizes operational technology (OT) data, IT data, and engineering data into a unified industrial knowledge graph. Enables digital twins, predictive maintenance, process optimization, and industrial AI applications. Key products: Cognite Data Fusion (CDF) platform, Cognite Atlas AI (industrial LLM agents), and industry-specific solutions for energy, manufacturing, and utilities. Key differentiator: purpose-built for heavy industry with deep understanding of industrial data complexities (time series, P&IDs, 3D models, asset hierarchies).",
    category: "Other",
    featured: false,
    capabilityType: "decision-support",
    vendorHq: "Oslo, Norway",
    euPresence:
      "EU-native company (Norwegian). Headquarters in Oslo. Major offices in Austin, Tokyo, and Stavanger. EU/EEA data residency standard. Strong presence in Nordic and European energy and manufacturing sectors. Listed on Oslo Stock Exchange (COGN).",
    foundedYear: 2016,
    employeeCount: "700+",
    fundingStatus:
      "Public (Oslo Stock Exchange: COGN). IPO 2023. Revenue ~$200M ARR (2025). Backed initially by Aker group. Market cap ~$3B.",
    marketPresence: "Leader",
    customerCount: "100+ enterprise customers in heavy industry",
    notableCustomers:
      "Aker BP (strategic partner — 97% reduction in root cause analysis time)\nEquinor (digital twin operations)\nCelanese (49 plants on CDF)\nSiemens Energy\nSABIC\nMitsubishi Heavy Industries\nStatoil/Equinor\nBP",
    customerStories:
      "Aker BP achieved 97% reduction in root cause analysis time using CDF and Atlas AI. Celanese scaled data across 49 chemical plants into CDF, leveraging AI agents for troubleshooting. Equinor uses CDF for real-time digital twins of offshore platforms.",
    useCases:
      "Industrial digital twins\nPredictive maintenance\nProcess optimization\nEnergy efficiency and emissions monitoring\nAsset performance management\nSupply chain optimization in manufacturing\nIndustrial AI agent deployment (Atlas AI)\nSafety and environmental compliance monitoring",
    dataStorage: "Cloud-based on Azure and GCP. EU data residency standard (Azure Norway/Netherlands). Customer can choose deployment region. No data commingling between customers.",
    dataProcessing: "Industrial data processed in customer-chosen cloud region. Time series, 3D models, and sensor data ingested and contextualized. Real-time and batch processing.",
    trainingDataUse: "Atlas AI models use Cognite's industrial knowledge base. Customer-specific operational data stays within customer environment. No cross-customer data use without explicit consent.",
    subprocessors: "Microsoft Azure (primary). Google Cloud Platform. Published subprocessor list available.",
    dpaDetails: "GDPR-compliant DPA standard for all customers. Norwegian/EEA data governance framework. EU data processing by default for EU customers.",
    slaDetails: "Enterprise SLA: 99.9% uptime. Dedicated support for enterprise customers. Industrial-grade reliability requirements.",
    dataPortability: "Open APIs (REST, GraphQL). Data export in standard formats. No vendor lock-in on data — CDF is a data integration platform. OPC UA, MQTT, and standard industrial protocols supported.",
    exitTerms: "Annual enterprise contracts. Data fully portable via APIs. No lock-in — CDF is a middleware layer, not data ownership.",
    ipTerms: "Customer retains all IP in their operational data. Cognite retains IP in platform and Atlas AI models. Industrial insights derived from customer data owned by customer.",
    certifications: "SOC 2 Type II. ISO 27001. ISO 27017 (cloud security). ISO 27018 (cloud privacy). GDPR-compliant. Annual third-party audits. DNV verification for industrial safety contexts.",
    encryptionInfo: "AES-256 at rest. TLS 1.2+ in transit. Customer-managed encryption keys available. Network isolation options.",
    accessControls: "SSO (SAML 2.0, OIDC). Fine-grained RBAC. Asset-level access control. API key management. Audit logging. Industrial safety role integration.",
    modelDocs: "CDF platform documentation comprehensive. Atlas AI capabilities documented. Industrial use case playbooks published. Partner ecosystem documentation.",
    explainability: "Digital twin visualizations. Data lineage tracking. AI recommendations linked to sensor data and historical patterns. Root cause analysis with evidence chains.",
    biasTesting: "Industrial AI models validated against physical engineering principles. Cross-site validation for transferability. Known limitation: model performance depends on sensor data quality.",
    aiActStatus: "Limited risk for most industrial applications. If used for safety-critical systems in regulated industries, higher classification may apply. EU-native company well-positioned for AI Act compliance.",
    gdprStatus: "Strong GDPR posture as Norwegian/EEA company. GDPR by design. EU data residency default. DPA available. Minimal personal data processing (primarily operational/industrial data).",
    euResidency: "Default for EU customers. Oslo-headquartered. Azure Norway/Netherlands regions. Full EU/EEA data sovereignty.",
    deploymentModel: "cloud",
    sourceModel: "closed-source",
    industrySlugs: ["manufacturing", "energy"],
    scores: {
      "eu-ai-act": "A",
      gdpr: "A",
    },
  },

  // ── Uptake ─────────────────────────────────────────────
  {
    slug: "uptake-industrial-ai",
    vendor: "Uptake Technologies",
    name: "Uptake (Industrial Predictive Maintenance)",
    type: "Industrial AI & Asset Analytics",
    risk: "Limited",
    description:
      "Industrial AI platform specializing in predictive maintenance, asset performance management, and operational intelligence for heavy industries. Uses machine learning on sensor and operational data to predict equipment failures before they happen, optimize maintenance schedules, and reduce unplanned downtime. Originally focused on Caterpillar equipment (co-founded with backing from Caterpillar), now serves broader heavy industry including mining, energy, rail, and defence. Key differentiator: deep domain expertise in heavy equipment failure modes with pre-built failure pattern libraries.",
    category: "Other",
    featured: false,
    capabilityType: "decision-support",
    vendorHq: "Chicago, Illinois, USA",
    euPresence:
      "Limited direct EU presence. Serves European customers in mining and energy sectors. No confirmed EU data centre. International deployments handled through cloud partnerships.",
    foundedYear: 2014,
    employeeCount: "200+",
    fundingStatus:
      "Private — raised $250M+ total but significantly restructured. Peak valuation $2.3B (2017), since reduced after pivot. Current valuation undisclosed. Backed by Caterpillar, Baillie Gifford, GreatPoint Ventures, Revolution Growth.",
    marketPresence: "Niche",
    customerCount: "100+ industrial enterprise customers",
    notableCustomers:
      "Caterpillar (founding partner)\nBerkshire Hathaway Energy\nFortescue Metals Group\nUS Department of Defense\nMajor mining and energy companies",
    customerStories:
      "Caterpillar uses Uptake to predict component failures across its global fleet, reducing unplanned downtime. Mining customers report 10-25% reduction in maintenance costs and 20%+ improvement in equipment availability.",
    useCases:
      "Predictive maintenance for heavy equipment\nAsset performance management\nEquipment health monitoring\nMaintenance schedule optimization\nUnplanned downtime reduction\nFleet management analytics\nOperational efficiency optimization",
    dataStorage: "Cloud-based (AWS). US data centres primarily. Data residency options available by request.",
    dataProcessing: "Sensor data ingested from equipment IoT systems. ML models process time series data for failure prediction. Edge computing options for remote sites.",
    trainingDataUse: "Models trained on industrial failure pattern data accumulated across customer base (anonymized and aggregated). Pre-built failure pattern libraries for common equipment types. Customer-specific models fine-tuned on customer data.",
    subprocessors: "AWS (cloud infrastructure). IoT data ingestion partners.",
    dpaDetails: "Enterprise agreements per customer. GDPR DPA available for EU customers on request. Standard data protection provisions.",
    slaDetails: "Enterprise SLA for platform availability. Real-time alerting SLA for critical equipment predictions.",
    dataPortability: "API access to predictions and analytics. Integration with CMMS/EAM systems (SAP PM, IBM Maximo). Standard data export formats.",
    exitTerms: "Annual enterprise contracts. Equipment data owned by customer. Predictive model configurations per agreement.",
    ipTerms: "Uptake retains IP in platform and pre-built failure patterns. Customer retains IP in operational data. Derived insights per agreement.",
    certifications: "SOC 2 Type II. HIPAA-compliant (for healthcare equipment). FedRAMP authorization (US government). Standard security audits.",
    encryptionInfo: "AES-256 at rest. TLS 1.2+ in transit. Secure data transmission from remote/field equipment.",
    accessControls: "Role-based access. SSO. API key management. Site-level access controls. Audit logging.",
    modelDocs: "Equipment failure pattern documentation. Model performance metrics (precision, recall for failure predictions). Domain-specific documentation per industry.",
    explainability: "Failure predictions include contributing sensor signals and historical patterns. Maintenance recommendations explain the risk-cost tradeoff. Visual dashboards showing equipment health trends.",
    biasTesting: "Equipment models validated across different operating conditions and environments. Known limitation: model accuracy depends on sensor coverage and data quality at specific sites.",
    aiActStatus: "Limited risk for most predictive maintenance applications. If used in safety-critical infrastructure (energy, transport), higher scrutiny may apply under sector-specific regulation.",
    gdprStatus: "GDPR awareness but primarily US-focused. DPA available on request. Minimal personal data processing (primarily operational equipment data).",
    euResidency: "Not standard. Available on request via cloud region selection. No dedicated EU infrastructure.",
    deploymentModel: "cloud",
    sourceModel: "closed-source",
    industrySlugs: ["manufacturing", "energy"],
    scores: {
      "eu-ai-act": "B",
      gdpr: "B",
    },
  },

  // ══════════════════════════════════════════════════════════
  //  HR / TALENT
  // ══════════════════════════════════════════════════════════

  // ── Eightfold AI ───────────────────────────────────────
  {
    slug: "eightfold-ai",
    vendor: "Eightfold AI",
    name: "Eightfold AI (Talent Intelligence)",
    type: "AI-Powered Talent Intelligence Platform",
    risk: "High",
    description:
      "Talent intelligence platform using deep learning to match people to opportunities across the full talent lifecycle: recruitment, retention, upskilling, diversity, and workforce planning. Analyses skills and potential rather than job titles and credentials. Key products: Talent Acquisition (AI sourcing and matching), Talent Management (internal mobility and skills mapping), Talent Flex (contingent workforce), and Workforce Exchange (government employment services). Key differentiator: largest talent dataset globally (~1.5 billion professional profiles) powering skills-based matching that reduces bias from traditional hiring criteria.",
    category: "Other",
    featured: false,
    capabilityType: "decision-support",
    vendorHq: "Santa Clara, California, USA",
    euPresence:
      "EU presence with European customers. EU data processing available. GDPR-compliant infrastructure. Offices in India (Noida — R&D centre) and serving EU enterprises including public sector. EU data residency options available.",
    foundedYear: 2016,
    employeeCount: "800+",
    fundingStatus:
      "Private — raised $450M+ total. Series E (2021) at $2.1B valuation. Backed by SoftBank Vision Fund 2, General Catalyst, Capital One Ventures, Lightspeed Venture Partners.",
    marketPresence: "Leader",
    customerCount: "500+ enterprise customers",
    notableCustomers:
      "Bayer (global talent management)\nAirbus (workforce transformation)\nMicron Technology\nTata Communications\nVodafone\nCapital One\nHella/Forvia\nNHS (UK healthcare workforce)",
    customerStories:
      "Bayer deployed Eightfold across global operations for skills-based talent matching, reporting 30% improvement in time-to-fill. Airbus uses Eightfold for internal mobility, matching 85,000+ employees to reskilling opportunities. Vodafone reduced recruitment cycle time by 50% using AI-powered sourcing.",
    useCases:
      "AI-powered talent acquisition and matching\nInternal mobility and career pathing\nSkills gap analysis and workforce planning\nDiversity, equity, and inclusion hiring\nContingent workforce management\nEmployee retention prediction\nGovernment workforce development programmes",
    dataStorage: "Cloud-based. US and EU data centres available. EU data residency options for EU customers. GDPR-compliant data segregation.",
    dataProcessing: "Candidate and employee data processed per customer configuration. Skills inference from structured and unstructured data. EU processing available for EU customers.",
    trainingDataUse: "Deep learning models trained on aggregated, de-identified talent data (~1.5B profiles). Individual customer data not used for training other customers' models. Skills ontology derived from global talent patterns.",
    subprocessors: "AWS and Azure (cloud infrastructure). Third-party data enrichment services. Published subprocessor list for enterprise customers.",
    dpaDetails: "GDPR-compliant DPA. EU SCCs for international data transfers. Data processing impact assessment support. Dedicated privacy team.",
    slaDetails: "Enterprise SLA: 99.9% uptime. Priority support. Dedicated customer success management.",
    dataPortability: "API access. Integration with major HCM systems (Workday, SAP SuccessFactors, Oracle HCM). Standard data export formats. HRIS integration.",
    exitTerms: "Annual enterprise contracts. Data deletion on termination per GDPR. Candidate data return procedures defined.",
    ipTerms: "Customer retains all IP in HR data. Eightfold retains IP in platform and AI models. De-identified skills insights may be used to improve general models.",
    certifications: "SOC 2 Type II. ISO 27001. GDPR-compliant. OFCCP compliance support. EEOC compliance support. Annual third-party security audits.",
    encryptionInfo: "AES-256 at rest. TLS 1.2+ in transit. Customer-managed encryption keys available.",
    accessControls: "SSO (SAML, OIDC). Role-based access. Recruiter/manager/admin role separation. Audit logging. PII masking for diversity hiring workflows.",
    modelDocs: "Responsible AI documentation published. Skills taxonomy documentation. Model performance metrics for matching accuracy. Bias testing methodology published.",
    explainability: "Candidate matching explains which skills and experiences contributed to the match score. Skills gap analysis shows specific development areas. Interview recommendations include rationale.",
    biasTesting: "Explicit bias reduction is a core value proposition. AI designed to look at skills/potential rather than proxies (school names, company prestige). Regular bias audits. Publishes DEI outcomes data. NYC Local Law 144 audit completed.",
    aiActStatus: "High-risk under EU AI Act (Annex III, point 4a — AI for recruitment and selection of candidates). Must comply with full conformity assessment requirements: transparency, human oversight, bias testing, data governance. Already has strong governance due to US bias audit requirements.",
    gdprStatus: "GDPR-compliant. DPA available. EU data processing. Consent management for candidate data. Data subject rights workflows (access, deletion, portability). DPIA support.",
    euResidency: "Available. EU data centres for EU customer data. GDPR by design architecture.",
    deploymentModel: "cloud",
    sourceModel: "closed-source",
    industrySlugs: ["manufacturing", "telecommunications", "healthcare"],
    scores: {
      "eu-ai-act": "B+",
      gdpr: "A",
    },
  },

  // ── Beamery ────────────────────────────────────────────
  {
    slug: "beamery",
    vendor: "Beamery",
    name: "Beamery (Talent Lifecycle Management)",
    type: "AI Talent Lifecycle Platform",
    risk: "High",
    description:
      "Talent lifecycle management platform combining CRM, talent matching, and skills intelligence. Uses AI for candidate sourcing, engagement, skills assessment, internal mobility, and workforce planning. Key differentiator: EU-native company (London HQ) with GDPR built into the product from inception. TalentGPT feature provides generative AI for talent acquisition and management workflows. Positions as the talent data platform that helps enterprises understand, develop, and retain their workforce through skills-based intelligence.",
    category: "Other",
    featured: false,
    capabilityType: "decision-support",
    vendorHq: "London, United Kingdom",
    euPresence:
      "UK/EU-native. Headquartered in London. GDPR compliance built from inception. EU data processing standard. Serves major European enterprises. Strong European customer base and go-to-market.",
    foundedYear: 2014,
    employeeCount: "400+",
    fundingStatus:
      "Private — raised $220M+ total. Series D (2022). Backed by Ontario Teachers' Pension Plan, Workday Ventures, Index Ventures, M12 (Microsoft). UK-headquartered.",
    marketPresence: "Challenger",
    customerCount: "200+ enterprise customers",
    notableCustomers:
      "VMware (now Broadcom)\nAutodesk\nJohnson & Johnson\nUBS\nZurich Insurance\nAstraZeneca\nJaguar Land Rover\nSiemens",
    customerStories:
      "Johnson & Johnson uses Beamery for global talent CRM across 130,000+ employees and millions of candidate relationships. VMware deployed Beamery to build talent pools for hard-to-fill technical roles, reducing time-to-fill by 40%. European enterprises value Beamery's native GDPR compliance.",
    useCases:
      "Talent CRM and candidate relationship management\nAI-powered sourcing and talent matching\nInternal mobility and skills mapping\nWorkforce planning and skills gap analysis\nDiversity and inclusion recruitment\nCandidate engagement automation\nTalentGPT for generative AI in talent workflows",
    dataStorage: "Cloud-based. EU and US data centres. EU data residency standard for EU customers. GDPR-compliant infrastructure from day one.",
    dataProcessing: "Candidate and employee data processed per customer configuration. EU data processing for EU customers. Skills inference and matching.",
    trainingDataUse: "AI models trained on aggregated, anonymized talent patterns. Customer data not used for training other customers' models. TalentGPT uses controlled LLM integration with data isolation.",
    subprocessors: "AWS (primary). Published subprocessor list. GDPR subprocessor management process.",
    dpaDetails: "Comprehensive GDPR DPA standard for all customers. UK/EU privacy framework. Data processing addendum. Consent management built into platform.",
    slaDetails: "Enterprise SLA: 99.9% uptime. Priority support for enterprise tier. Dedicated customer success.",
    dataPortability: "API access. Integration with major ATS and HCM systems (Workday, SAP, Oracle). Standard HR data formats. GDPR portability rights supported.",
    exitTerms: "Annual enterprise contracts. Data deletion and return on termination per GDPR. No lock-in on candidate data.",
    ipTerms: "Customer retains all IP in HR and candidate data. Beamery retains IP in platform and models.",
    certifications: "SOC 2 Type II. ISO 27001. Cyber Essentials Plus (UK). GDPR-compliant. Annual penetration testing. Third-party security audits.",
    encryptionInfo: "AES-256 at rest. TLS 1.2+ in transit. Data isolation between customers.",
    accessControls: "SSO (SAML 2.0, OIDC). Role-based access. Recruiter/hiring manager/admin separation. Audit logging. Consent tracking.",
    modelDocs: "Responsible AI principles published. TalentGPT documentation. Skills taxonomy documentation.",
    explainability: "Talent match scores show contributing skills and experience factors. Skills gap analysis with specific development recommendations. Transparent matching criteria.",
    biasTesting: "Bias testing built into AI matching. GDPR-compliant bias monitoring. NYC Local Law 144 audit support. UK Equality Act 2010 compliance. DEI analytics dashboard.",
    aiActStatus: "High-risk under EU AI Act (Annex III, point 4a — recruitment AI). UK-headquartered but EU AI Act applies for EU-market deployment. Already strong governance due to UK/EU regulatory environment.",
    gdprStatus: "Excellent GDPR posture — UK/EU-native company with privacy by design. DPA standard. Consent management platform built-in. Data subject rights workflows. DPIA support. UK Adequacy Decision covers UK-EU transfers.",
    euResidency: "Standard for EU customers. EU data centres. GDPR by design from company founding.",
    deploymentModel: "cloud",
    sourceModel: "closed-source",
    industrySlugs: ["financial-services", "healthcare", "manufacturing"],
    scores: {
      "eu-ai-act": "A",
      gdpr: "A",
    },
  },

  // ── Phenom ─────────────────────────────────────────────
  {
    slug: "phenom-talent-experience",
    vendor: "Phenom",
    name: "Phenom (Talent Experience Platform)",
    type: "AI-Powered Talent Experience Platform",
    risk: "High",
    description:
      "Intelligent talent experience platform that personalizes the journey for candidates, employees, recruiters, and managers using AI. Key products: Career Site AI (personalised job recommendations), Chatbot (conversational recruiting), CRM (talent relationship management), Interview Intelligence, and Internal Mobility. Uses AI to match candidates to roles based on skills, predict employee flight risk, and automate recruiter workflows. Key differentiator: four-sided marketplace approach — optimises the experience for all talent stakeholders simultaneously, not just recruiters.",
    category: "Other",
    featured: false,
    capabilityType: "decision-support",
    vendorHq: "Ambler, Pennsylvania, USA",
    euPresence:
      "EU presence with EU data centres. GDPR compliance built into platform. Serves European enterprises. EU data residency available. Offices in India (Hyderabad — R&D centre) and Israel.",
    foundedYear: 2010,
    employeeCount: "1,800+",
    fundingStatus:
      "Private — raised $300M+ total. Series D (2021) at $1.3B valuation. Backed by Owl Ventures, GIC (Singapore sovereign fund), AXA Venture Partners, Dragoneer Investment Group.",
    marketPresence: "Leader",
    customerCount: "700+ enterprise customers",
    notableCustomers:
      "Southwest Airlines\nNewell Brands\nMercedes-Benz\nLenovo\nInfosys\nHertz\nLand O'Lakes\nYamaha\nOptum/UnitedHealth Group",
    customerStories:
      "Southwest Airlines uses Phenom for career site personalisation, reporting 2x increase in qualified applications. Mercedes-Benz deployed Phenom chatbot for candidate engagement across European markets in multiple languages. Lenovo uses Phenom for global internal mobility across 60,000+ employees.",
    useCases:
      "AI-personalised career sites\nConversational recruiting chatbots\nCandidate relationship management (CRM)\nInterview scheduling and intelligence\nInternal mobility and talent marketplace\nEmployee flight risk prediction\nRecruiter productivity automation\nDiversity sourcing",
    dataStorage: "Cloud-based. US and EU data centres. EU data residency available. SOC 2-compliant infrastructure.",
    dataProcessing: "Candidate and employee data processed per customer configuration. AI matching and personalization. EU processing for EU customers.",
    trainingDataUse: "AI models use aggregated talent patterns for skills matching. Customer data isolated. Career site personalisation based on customer-specific data. No cross-customer data sharing without consent.",
    subprocessors: "AWS (primary cloud). Published subprocessor list. Standard GDPR subprocessor management.",
    dpaDetails: "GDPR-compliant DPA available. EU SCCs for international transfers. Consent management integrated into platform. Cookie consent for career sites.",
    slaDetails: "Enterprise SLA: 99.9% uptime. 24/7 support for enterprise tier. Dedicated customer success.",
    dataPortability: "API access. Integration with major ATS systems (Workday, iCIMS, Taleo, SAP SuccessFactors). Standard data export formats. GDPR portability supported.",
    exitTerms: "Annual enterprise contracts. Data deletion on termination. No lock-in on candidate data. Career site migration support.",
    ipTerms: "Customer retains all IP in HR data and candidate information. Phenom retains IP in platform and AI models.",
    certifications: "SOC 2 Type II. ISO 27001. GDPR-compliant. CCPA-compliant. Annual security audits. Penetration testing.",
    encryptionInfo: "AES-256 at rest. TLS 1.2+ in transit. Data isolation between customers.",
    accessControls: "SSO (SAML, OIDC). Role-based access (recruiter, hiring manager, admin, candidate). Audit logging. MFA available.",
    modelDocs: "AI capabilities documentation. Chatbot configuration guides. Matching algorithm documentation for enterprise customers.",
    explainability: "Job recommendations explain matching factors (skills, location, experience). Chatbot interactions logged and reviewable. Recruiter dashboard shows candidate scoring rationale.",
    biasTesting: "AI matching designed to reduce bias from traditional hiring criteria. Diversity analytics and reporting. NYC Local Law 144 audit compliance. EEOC adverse impact analysis support.",
    aiActStatus: "High-risk under EU AI Act (Annex III, point 4a — recruitment AI). Chatbot interactions also require transparency under AI Act. Automated candidate screening and ranking require human oversight provisions.",
    gdprStatus: "GDPR-compliant. DPA available. EU data processing. Cookie consent for career sites. Data subject rights (access, deletion). Consent management for candidate data collection.",
    euResidency: "Available. EU data centres for EU customers. GDPR by design for career site and recruitment workflows.",
    deploymentModel: "cloud",
    sourceModel: "closed-source",
    industrySlugs: ["manufacturing", "healthcare", "telecommunications"],
    scores: {
      "eu-ai-act": "B",
      gdpr: "B+",
    },
  },
];

// ─── Industry slugs → IDs mapping helper ─────────────────

async function getIndustryMap() {
  const industries = await prisma.industry.findMany();
  const map: Record<string, string> = {};
  for (const ind of industries) {
    map[ind.slug] = ind.id;
  }
  return map;
}

// ─── Seed Runner ──────────────────────────────────────────

async function main() {
  console.log("Seeding Priority 3 sector-specific AI systems (Batch 6)...\n");

  const industryMap = await getIndustryMap();

  // Get all frameworks for score mapping
  const frameworks = await prisma.regulatoryFramework.findMany();
  const frameworkMap: Record<string, string> = {};
  for (const fw of frameworks) {
    frameworkMap[fw.slug] = fw.id;
  }

  for (const sys of systems) {
    const { industrySlugs, scores, ...systemData } = sys;

    // Upsert system
    const created = await prisma.aISystem.upsert({
      where: { slug: sys.slug },
      update: systemData,
      create: systemData,
    });

    // Connect industries
    const industryIds = industrySlugs
      .map((s) => industryMap[s])
      .filter(Boolean);
    if (industryIds.length > 0) {
      await prisma.aISystem.update({
        where: { id: created.id },
        data: {
          industries: {
            connect: industryIds.map((id) => ({ id })),
          },
        },
      });
    }

    // Upsert framework scores
    if (scores) {
      for (const [fwSlug, score] of Object.entries(scores)) {
        const fwId = frameworkMap[fwSlug];
        if (!fwId) continue;

        await prisma.assessmentScore.upsert({
          where: {
            systemId_frameworkId: {
              systemId: created.id,
              frameworkId: fwId,
            },
          },
          update: { score },
          create: {
            systemId: created.id,
            frameworkId: fwId,
            score,
          },
        });
      }
    }

    console.log(`  ✓ ${sys.vendor} — ${sys.name}`);
  }

  console.log(`\nDone — seeded ${systems.length} sector-specific AI systems.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
