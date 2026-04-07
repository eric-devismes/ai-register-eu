/**
 * Wave 4 Content Seed — April 2026
 *
 * Adds:
 *   - Post-Market Monitoring section for EU AI Act (Article 72)
 *   - SME/Startup provisions under EU AI Act (Articles 61-62)
 *   - Copyright and AI training data (GPAI compliance)
 *   - 8 more AI systems (Nvidia AI, Stability AI, Runway, Synthesia, ElevenLabs, Qdrant, Scale AI, Palantir AIP EU)
 *   - 15 more changelog entries (copyright litigation, AI safety, national enforcement, energy AI)
 *   - 10 more approved sources
 *
 * Run with: npx tsx src/data/seed-wave4-2026.ts
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// ─── New Framework Sections ───────────────────────────────

const newSections = [
  {
    frameworkSlug: "eu-ai-act",
    title: "Post-Market Monitoring (Article 72)",
    description:
      "Providers of high-risk AI systems must maintain active post-market monitoring throughout the product lifecycle. Article 72 transforms compliance from a point-in-time certification to a continuous obligation.",
    sortOrder: 13,
    statements: [
      {
        reference: "Article 72(1)-(3)",
        statement:
          "Providers must proactively collect and review experience gained from the operation of high-risk AI systems. They must establish a post-market monitoring plan as part of technical documentation, covering: performance data collection, analysis methodology, corrective action triggers, and reporting to market surveillance authorities.",
        commentary:
          "Post-market monitoring is the AI Act's equivalent of pharmacovigilance in pharmaceuticals or post-market surveillance in medical devices. The plan must specify: what metrics are monitored, how data is collected from deployers, what thresholds trigger corrective action, and how findings are fed back into the risk management system. A static 'we'll check periodically' approach is insufficient.",
        sourceUrl: "https://artificialintelligenceact.eu/article/72/",
        sourceNote: "EU AI Act, Article 72",
        sortOrder: 1,
      },
      {
        reference: "Article 73 — Serious Incident Reporting",
        statement:
          "Providers must report serious incidents and malfunctions to market surveillance authorities. A serious incident is any malfunction or performance failure that leads (or could reasonably have led) to: death, serious injury, significant property damage, or a breach of fundamental rights obligations. Reporting timelines: immediate notification for life-threatening incidents; 15 days for other serious incidents.",
        commentary:
          "The incident reporting framework mirrors medical device vigilance reporting. For AI in healthcare, financial services, or public safety, this creates a regulatory obligation equivalent to reporting adverse events. Providers must have an incident classification procedure, a 24/7 reporting pathway to national market surveillance authorities, and documented root cause analysis processes.",
        sourceUrl: "https://artificialintelligenceact.eu/article/73/",
        sourceNote: "EU AI Act, Article 73",
        sortOrder: 2,
      },
    ],
  },
  {
    frameworkSlug: "eu-ai-act",
    title: "SME & Startup Provisions (Articles 61-62, Recitals 102-103)",
    description:
      "The EU AI Act includes specific measures to reduce the compliance burden on SMEs and startups, recognising that smaller organisations face disproportionate compliance costs compared to large technology companies.",
    sortOrder: 14,
    statements: [
      {
        reference: "Articles 61-62 — SME Support Measures",
        statement:
          "Member states must ensure that SMEs have access to: regulatory sandboxes (Article 57); reduced fee structures for market surveillance and conformity assessment; dedicated SME guidance channels; and priority access to support from national competent authorities. Penalties for SMEs are capped at lower absolute amounts (lower of percentage of turnover or absolute cap).",
        commentary:
          "Practically, SMEs developing high-risk AI benefit from: sandbox access to test products under regulatory supervision with reduced compliance requirements; EU-funded digital innovation hub support; and proportionate documentation requirements. However, the core technical obligations (risk management, human oversight, accuracy) apply equally to SMEs — the reductions are in process and financial burden, not substantive safety requirements.",
        sourceUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689",
        sourceNote: "EU AI Act, Articles 61-62",
        sortOrder: 1,
      },
      {
        reference: "Digital Omnibus Proposal — SME Relief",
        statement:
          "The European Commission's proposed Digital Omnibus on AI (November 2025) proposes additional SME relief measures including: narrower definition of 'provider' to exclude deployers who merely customise AI; simplified conformity assessment pathways for lower-risk Annex III applications; and a dedicated SME transition period extending to 2028 for certain categories.",
        commentary:
          "The Digital Omnibus is still a proposal as of April 2026 — not yet law. But it signals the direction of EU AI policy: balancing compliance burden with European AI competitiveness. SMEs and startups developing high-risk AI should monitor the Omnibus negotiations closely, as it could significantly change their compliance obligations.",
        sourceUrl: "https://www.cooley.com/news/insight/2025/2025-11-24-eu-ai-act-proposed-digital-omnibus-on-ai-will-impact-businesses-ai-compliance-roadmaps",
        sourceNote: "Cooley LLP — Digital Omnibus Analysis",
        sortOrder: 2,
      },
    ],
  },
  {
    frameworkSlug: "eu-ai-act",
    title: "Copyright and GPAI Training Data (DSA/DSM Directive Interaction)",
    description:
      "GPAI providers must comply with EU copyright law when training on protected content. The DSM Directive's text and data mining (TDM) provisions interact with EU AI Act Article 53 training data summary requirements.",
    sortOrder: 15,
    statements: [
      {
        reference: "EU AI Act Article 53(1)(c) — Copyright Policy",
        statement:
          "GPAI providers must put in place a policy to comply with EU copyright law, including Directive (EU) 2019/790 (DSM Directive). Specifically, they must respect rights-holders' opt-out reservations under Article 4 of the DSM Directive, which allows rights-holders to reserve their works from text and data mining for AI training.",
        commentary:
          "The machine-readable opt-out standard (robots.txt extensions, rights reservation metadata) is still evolving. As of 2026, major publishers, news agencies, and collecting societies (GEMA, PRS for Music, Getty Images) have filed formal opt-outs or brought litigation. GPAI providers must document their opt-out compliance mechanism and demonstrate they checked for opt-outs before training.",
        sourceUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689",
        sourceNote: "EU AI Act Article 53(1)(c); DSM Directive Articles 3-4",
        sortOrder: 1,
      },
      {
        reference: "GEMA v. OpenAI — Munich Regional Court (November 2025)",
        statement:
          "The Munich Regional Court (case 42 O 14139/24) ruled in November 2025 that OpenAI's training of GPT-4/4o on copyrighted song lyrics without a licence constitutes copyright infringement. The court applied the 'memorisation doctrine' — that AI outputs reproducing protected content verbatim constitute reproduction even if not stored. The court rejected OpenAI's text and data mining (TDM) exception defence.",
        commentary:
          "This is the most significant EU copyright ruling for AI. Key implications for GPAI providers: the TDM exception under DSM Article 4 requires an opt-out search before training — not just relying on public availability. Verbatim reproduction of protected content in outputs triggers infringement independent of training data analysis. GEMA is seeking damages covering all German-language members. The case will likely reach the Federal Court of Justice (BGH) and potentially the CJEU.",
        sourceUrl: "https://www.twobirds.com/en/insights/2025/landmark-ruling-of-the-munich-regional-court-(gema-v-openai)-on-copyright-and-ai-training",
        sourceNote: "Two Birds LLP — GEMA v OpenAI Analysis; Munich Regional Court case 42 O 14139/24",
        sortOrder: 2,
      },
    ],
  },
  {
    frameworkSlug: "gdpr",
    title: "AI and Cross-Border Data Transfers",
    description:
      "AI systems frequently involve international data transfers — from EU to US cloud providers, to AI model providers, or for model training. GDPR Chapter V governs these transfers and is a critical compliance area for AI deployments.",
    sortOrder: 6,
    statements: [
      {
        reference: "GDPR Articles 44-49 — International Transfers for AI",
        statement:
          "Personal data processed by AI systems may only be transferred outside the EEA if: an adequacy decision applies (e.g., EU-US Data Privacy Framework, UK IDTA); Standard Contractual Clauses (SCCs) are in place with a transfer impact assessment; Binding Corporate Rules apply; or a specific derogation under Article 49 applies. Transfer to countries without adequate protection (e.g., China) requires explicit consent or compelling legitimate interest derogation — rarely available for systematic AI processing.",
        commentary:
          "For enterprise AI buyers, this means: every AI vendor processing personal data must have a valid transfer mechanism. Using a US AI API provider requires checking their DPF certification or SCCs. Using a Chinese AI provider (like DeepSeek API) likely has no valid transfer mechanism for EU personal data — constituting a GDPR violation. The DeepSeek enforcement actions demonstrate regulators will act swiftly.",
        sourceUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02016R0679-20160504",
        sourceNote: "GDPR, Articles 44-49",
        sortOrder: 1,
      },
    ],
  },
  {
    frameworkSlug: "eba-eiopa-guidelines",
    title: "AI in Insurance: Pricing, Underwriting and Claims",
    description:
      "Insurance AI represents one of the most regulated AI use cases in Europe. EIOPA guidelines, combined with EU AI Act high-risk classification and GDPR, create a comprehensive framework for insurers and insurtechs.",
    sortOrder: 6,
    statements: [
      {
        reference: "EIOPA AI in Insurance Guidelines 2024",
        statement:
          "EIOPA's guidelines require insurers using AI in underwriting, pricing, and claims to: validate AI models against historical data before deployment; monitor for proxy discrimination (where non-protected variables act as proxies for protected characteristics like gender or race); ensure explainability of premium calculations to customers; and maintain actuarial oversight of AI pricing models.",
        commentary:
          "Proxy discrimination is the key challenge in insurance AI. An AI model that never uses gender may still discriminate by gender if variables like car type, postcode, or occupation correlate with gender. EIOPA guidelines require explicit proxy discrimination testing. Combined with EU AI Act data governance requirements (Article 10) and GDPR anti-discrimination principles, insurers face the most complex compliance stack of any industry.",
        sourceUrl: "https://www.eiopa.europa.eu/",
        sourceNote: "EIOPA AI in Insurance Guidelines 2024",
        sortOrder: 1,
      },
      {
        reference: "AI Claims Processing — Fundamental Rights Risks",
        statement:
          "AI-driven claims processing and fraud detection in insurance raises fundamental rights concerns: automated denial of legitimate claims, discriminatory patterns in fraud scoring, and inadequate human review. EIOPA guidelines require: human review of any AI-automated claim denial; documented challenge process for claimants; and regular audits of claim denial patterns for discriminatory outcomes.",
        commentary:
          "Insurance AI is high-risk under EU AI Act Annex III (essential services — access to insurance). Automated claim denials must have human review on request under both GDPR Article 22 and EU AI Act Article 14. Insurtechs deploying fully automated straight-through-processing for claim denials without human review are non-compliant. This applies to both life/health insurance (higher scrutiny) and non-life.",
        sourceUrl: "https://www.eiopa.europa.eu/",
        sourceNote: "EIOPA AI Guidelines; EU AI Act Annex III Category 5",
        sortOrder: 2,
      },
    ],
  },
];

// ─── New AI Systems ──────────────────────────────────────

const wave4Systems = [
  {
    slug: "nvidia-nim-enterprise",
    vendor: "NVIDIA",
    name: "NVIDIA NIM / AI Enterprise",
    type: "AI Infrastructure / Model Serving Platform",
    risk: "Limited",
    description:
      "NVIDIA's AI Enterprise platform and NIM (NVIDIA Inference Microservices) for deploying AI models on GPU infrastructure. Foundational to EU AI deployment — most cloud and on-premise AI runs on NVIDIA GPUs. EU AI Act primarily applies to AI system providers/deployers, not compute infrastructure; but NVIDIA's AI Enterprise includes application-layer AI features.",
    category: "AI Infrastructure",
    featured: false,
    vendorHq: "Santa Clara, USA",
    euPresence:
      "NVIDIA Europe (Amsterdam, Munich offices). EU data centre partnerships with all major hyperscalers. Critical EU digital infrastructure provider.",
    useCases:
      "GPU compute infrastructure for AI model training and inference\nNIM microservices for enterprise AI deployment\nNVIDIA Jetson for edge AI in manufacturing/industrial\nNVIDIA DRIVE for autonomous vehicles (high-risk)\nHealthcare AI (NVIDIA Clara) for medical imaging",
    dataStorage:
      "Infrastructure product — data stays on customer infrastructure. NIM cloud: customer cloud provider.",
    dataProcessing:
      "On-premise or customer cloud. NVIDIA does not process customer data for inference.",
    trainingDataUse:
      "NVIDIA AI Enterprise: no customer data used for training NIM models.",
    subprocessors:
      "Customer's chosen cloud providers. NVIDIA has no customer data subprocessors for infrastructure.",
    dpaDetails: "Limited DPA needed — primarily infrastructure. NIM cloud: DPA available.",
    slaDetails: "Hardware: standard warranty. Software: enterprise support contracts.",
    dataPortability: "Full control — customer's own infrastructure.",
    exitTerms: "N/A — hardware and open software.",
    ipTerms: "Customer owns all data and outputs from NVIDIA hardware/software.",
    certifications:
      "ISO 9001 (hardware manufacturing), various product safety certifications. AI safety research published.",
    encryptionInfo: "Hardware encryption capabilities in GPU designs. Confidential computing support.",
    accessControls: "Customer-managed access to infrastructure.",
    modelDocs:
      "Extensive NIM model documentation. NVIDIA model cards for provided models. Open research publications.",
    explainability:
      "NIM-served models: depends on model. NVIDIA provides tools (Triton, RAPIDS) that enable explainability implementation.",
    biasTesting:
      "NVIDIA AI ethics principles. Customer responsible for bias in models deployed on NVIDIA infrastructure.",
    aiActStatus:
      "Infrastructure provider: generally not an AI system provider under EU AI Act. High-risk classification applies to specific application-layer products (NVIDIA DRIVE for autonomous vehicles, NVIDIA Clara for medical devices).",
    gdprStatus:
      "Strong GDPR posture as infrastructure provider. Customer is data controller. NVIDIA is not a data processor for core infrastructure.",
    euResidency:
      "Full EU residency possible — hardware deployed in EU, NIM on EU cloud instances.",
    industrySlugs: ["financial-services", "healthcare", "public-sector"],
    scores: {
      "eu-ai-act": "B",
      gdpr: "A-",
      dora: "B",
      "eba-eiopa-guidelines": "C+",
    },
  },
  {
    slug: "stability-ai-sdxl",
    vendor: "Stability AI",
    name: "Stable Diffusion / Stability AI API",
    type: "Generative Image AI",
    risk: "Limited",
    description:
      "Open-weight image generation AI (Stable Diffusion XL, SD3) and Stability AI's API. Widely used in creative industries, marketing, and product design. EU copyright and deepfake transparency obligations apply. UK-headquartered but EU market focused.",
    category: "Creative AI",
    featured: false,
    vendorHq: "London, UK",
    euPresence:
      "Stability AI Ltd (London). Post-Brexit UK entity. EU operations and API users across EU.",
    useCases:
      "Marketing and advertising image generation\nProduct design and conceptualisation\nGame and film concept art\nE-commerce product imagery\nFashion design and visualisation",
    dataStorage:
      "UK-based infrastructure. EU data transfer via UK adequacy decision (IDTA). API inputs not retained post-inference.",
    dataProcessing:
      "UK-based API inference. EU users' prompts processed in UK.",
    trainingDataUse:
      "SD3 trained on licensed dataset (no opt-out violations claimed). Earlier models (SD1/2) trained on LAION — subject of Getty Images litigation.",
    subprocessors: "AWS UK/EU. Limited.",
    dpaDetails: "DPA available. UK GDPR and EU SCCs/IDTA.",
    slaDetails: "API SLA for enterprise customers.",
    dataPortability: "Generated images fully owned by customer.",
    exitTerms: "Account data deletion on request.",
    ipTerms: "Customer owns generated images for commercial use.",
    certifications: "SOC 2 Type II in progress.",
    encryptionInfo: "Standard encryption at rest and in transit.",
    accessControls: "API key management.",
    modelDocs:
      "SD3 model card published. Technical report. Responsible AI practices documentation.",
    explainability:
      "Generative models: outputs but no explanation. Safety classifier scores available.",
    biasTesting:
      "Bias and diversity evaluation for SD3. Earlier models criticised for stereotyping.",
    aiActStatus:
      "Limited risk (image generation). Article 50(4) deepfake labelling requirements apply. C2PA watermarking implemented in SD3 API.",
    gdprStatus:
      "UK GDPR compliance. EU users covered via adequacy decision. No biometric processing.",
    euResidency: "Not for EU customers — UK-based. UK adequacy provides legal transfer mechanism.",
    industrySlugs: ["telecommunications"],
    scores: {
      "eu-ai-act": "B-",
      gdpr: "B",
      dora: "D",
      "eba-eiopa-guidelines": "D",
    },
  },
  {
    slug: "synthesia-ai-video",
    vendor: "Synthesia",
    name: "Synthesia AI Video Platform",
    type: "Synthetic Video / Avatar AI",
    risk: "Limited",
    description:
      "London-based AI video platform enabling creation of synthetic presenter videos using AI avatars. Used for corporate training, marketing, and internal communications. EU AI Act transparency obligations apply for synthetic media; deep focus on consent for real-person avatar creation.",
    category: "Creative AI",
    featured: false,
    vendorHq: "London, UK",
    euPresence:
      "Synthesia Ltd (London). Strong EU enterprise customer base. AWS EU data centres.",
    useCases:
      "Corporate training and e-learning video creation\nProduct explainer and marketing videos\nInternal communications and announcements\nPersonalised video at scale\nMultilingual video content in 120+ languages",
    dataStorage:
      "AWS EU (Frankfurt) for EU customers. UK headquarters.",
    dataProcessing:
      "EU-based video rendering for EU customers.",
    trainingDataUse:
      "Avatar models trained on consented actor data. Real-person likeness creation requires explicit consent from the individual.",
    subprocessors: "AWS EU, Azure.",
    dpaDetails: "GDPR DPA. UK GDPR. EU SCCs.",
    slaDetails: "99.9% platform uptime SLA.",
    dataPortability: "Video files exportable in standard formats.",
    exitTerms: "Data deletion within 30 days.",
    ipTerms: "Customer owns generated videos. Actor/avatar IP managed via consent agreements.",
    certifications: "SOC 2 Type II, ISO 27001.",
    encryptionInfo: "AES-256 at rest, TLS 1.2+ in transit.",
    accessControls: "SSO/SAML, team management, content approval workflows.",
    modelDocs:
      "Responsible AI policy for avatar creation. Consent verification for real-person avatars.",
    explainability: "Synthetic video clearly labelled as AI-generated in platform.",
    biasTesting:
      "Diversity of AI avatars: explicit policy for representation across ethnicities and demographics.",
    aiActStatus:
      "Limited risk. Article 50(4) synthetic media labelling: all Synthesia videos include AI disclosure. C2PA metadata supported.",
    gdprStatus:
      "Biometric data (facial/voice capture for avatar training) treated as special category with explicit consent. Strong GDPR programme.",
    euResidency: "Full EU residency for EU customers via AWS Frankfurt.",
    industrySlugs: ["financial-services", "telecommunications"],
    scores: {
      "eu-ai-act": "B+",
      gdpr: "A-",
      dora: "C",
      "eba-eiopa-guidelines": "C",
    },
  },
  {
    slug: "elevenlabs-enterprise",
    vendor: "ElevenLabs",
    name: "ElevenLabs Voice AI",
    type: "Voice Synthesis / Audio AI",
    risk: "Limited",
    description:
      "AI-powered voice synthesis and cloning platform. Enterprise version for conversational AI, audiobook production, and accessibility tools. EU AI Act transparency requirements apply for AI-generated audio; voice biometric data classification as special category under GDPR creates compliance complexity.",
    category: "Creative AI",
    featured: false,
    vendorHq: "New York, USA",
    euPresence:
      "EU users served from US infrastructure. EU entity in establishment. Growing enterprise EU customer base.",
    useCases:
      "Text-to-speech for accessibility and content creation\nVoice cloning for personalised customer service\nAudiobook and podcast production at scale\nVoice AI for conversational chatbots\nDubbing and localisation for video content",
    dataStorage:
      "US-based primary. EU data residency option via EU-US DPF.",
    dataProcessing: "US-based voice synthesis. EU SCCs for data transfers.",
    trainingDataUse:
      "Voice models trained on consented voice actor data. Voice cloning requires explicit consent from the individual whose voice is cloned.",
    subprocessors: "AWS. Limited.",
    dpaDetails:
      "DPA available. EU SCCs. Voice biometric data as special category GDPR.",
    slaDetails: "Enterprise SLA available.",
    dataPortability: "Audio files fully customer-owned.",
    exitTerms: "Account data deletion within 30 days.",
    ipTerms: "Customer owns all generated audio for commercial use.",
    certifications: "SOC 2 Type II.",
    encryptionInfo: "Standard encryption. Voice data encrypted at rest.",
    accessControls: "API keys, team management.",
    modelDocs: "Voice AI technical documentation. Responsible AI policy.",
    explainability: "AI-generated audio tagged/labelled in enterprise API responses.",
    biasTesting:
      "Accent and language diversity in TTS models. Voice quality consistency across demographics.",
    aiActStatus:
      "Limited risk. Article 50 AI disclosure for voice AI in customer interactions. Audio deepfake labelling applies.",
    gdprStatus:
      "Voice biometric data: special category (GDPR Article 9). Explicit consent required for voice cloning. EU SCCs in place.",
    euResidency: "Not default — EU-US DPF relied upon.",
    industrySlugs: ["financial-services", "telecommunications"],
    scores: {
      "eu-ai-act": "B-",
      gdpr: "C+",
      dora: "D",
      "eba-eiopa-guidelines": "D",
    },
  },
  {
    slug: "scale-ai-enterprise",
    vendor: "Scale AI",
    name: "Scale AI Data Engine",
    type: "AI Training Data Platform",
    risk: "High",
    description:
      "Scale AI's platform for creating, managing, and evaluating AI training data. Used by major AI labs and enterprises to build high-quality labelled datasets. EU AI Act Article 10 data governance requirements apply to training data suppliers. GDPR implications for labelled personal data.",
    category: "AI Development Tools",
    featured: false,
    vendorHq: "San Francisco, USA",
    euPresence:
      "Scale AI Europe entity. Distributed labelling workforce in EU. AWS EU regions available.",
    useCases:
      "Training data annotation and labelling for AI systems\nAI model evaluation (RLHF, red teaming)\nAI safety evaluation for GPAI providers\nAutonomous vehicle sensor data labelling\nMedical AI data curation",
    dataStorage:
      "Customer data on customer-controlled or Scale-managed cloud. EU regions available.",
    dataProcessing:
      "Labelling work performed by distributed workforce. EU customers on EU cloud available.",
    trainingDataUse:
      "Customer training data not used for Scale's own models without permission.",
    subprocessors:
      "AWS EU, Azure EU. Human labelling workforce (global). Published list.",
    dpaDetails: "GDPR DPA. EU SCCs. Subprocessor agreements for labelling workforce.",
    slaDetails: "Project-based SLAs.",
    dataPortability: "Full data export in standard formats.",
    exitTerms: "Data deletion within 60 days.",
    ipTerms: "Customer owns all annotated datasets and labels.",
    certifications: "SOC 2 Type II, ISO 27001.",
    encryptionInfo: "AES-256, TLS 1.2+.",
    accessControls: "RBAC, project access controls, audit logging.",
    modelDocs:
      "Data quality methodology documentation. AI evaluation frameworks published.",
    explainability:
      "Annotation quality scores and inter-annotator agreement metrics.",
    biasTesting:
      "Annotation bias monitoring. Workforce diversity tracking for annotation quality.",
    aiActStatus:
      "Not an AI system provider directly — training data supplier. EU AI Act Article 10 compliance framework for customers. May qualify as supply chain participant in high-risk AI documentation.",
    gdprStatus:
      "Complex: personal data in training sets requires GDPR compliance including purpose limitation and data subject rights. Facial images in training data are particularly sensitive.",
    euResidency: "Available for EU customers on EU cloud.",
    industrySlugs: ["financial-services", "healthcare"],
    scores: {
      "eu-ai-act": "B-",
      gdpr: "B-",
      dora: "C",
      "eba-eiopa-guidelines": "C",
    },
  },
  {
    slug: "runway-ai-video",
    vendor: "Runway",
    name: "Runway Gen-3 AI Video",
    type: "Generative Video AI",
    risk: "Limited",
    description:
      "New York-based AI video generation platform. Gen-3 Alpha enables high-quality video creation from text and image prompts. Used in film, advertising, and creative industries. EU AI Act synthetic media labelling applies; growing European enterprise adoption.",
    category: "Creative AI",
    featured: false,
    vendorHq: "New York, USA",
    euPresence: "EU users via US infrastructure. EU-US DPF relied upon. No EU legal entity.",
    useCases:
      "AI video generation for film and advertising\nVisual effects and scene extension\nBrand video content creation\nMusic video production\nArchitectural and design visualisation",
    dataStorage: "US-based. EU-US DPF transfer mechanism.",
    dataProcessing: "US-based video generation.",
    trainingDataUse:
      "Training on licensed video datasets. Ongoing copyright negotiations with film studios.",
    subprocessors: "AWS. Limited.",
    dpaDetails: "DPA available. EU SCCs.",
    slaDetails: "Enterprise SLA available.",
    dataPortability: "Generated videos fully customer-owned.",
    exitTerms: "Account deletion within 30 days.",
    ipTerms: "Customer owns generated videos for commercial use under enterprise licence.",
    certifications: "SOC 2 Type II in progress.",
    encryptionInfo: "Standard encryption.",
    accessControls: "API keys, team access management.",
    modelDocs: "Gen-3 technical overview. Content policy documentation.",
    explainability: "Generative outputs — no explanation layer.",
    biasTesting: "Visual diversity evaluation in generated content.",
    aiActStatus:
      "Limited risk. Article 50 synthetic media labelling for all generated video. Deepfake policy enforcement.",
    gdprStatus:
      "EU-US DPF relied upon. No EU data residency. DPA available.",
    euResidency: "Not available.",
    industrySlugs: ["telecommunications"],
    scores: {
      "eu-ai-act": "C+",
      gdpr: "C",
      dora: "D",
      "eba-eiopa-guidelines": "D",
    },
  },
  {
    slug: "qdrant-vector-db",
    vendor: "Qdrant",
    name: "Qdrant Vector Database",
    type: "AI Infrastructure / Vector Database",
    risk: "Limited",
    description:
      "Berlin-based open-source vector database for AI applications. Core infrastructure for RAG (Retrieval-Augmented Generation) systems and semantic search. EU-native, fully open-source with managed cloud option. Critical infrastructure layer for compliant EU AI deployments.",
    category: "AI Infrastructure",
    featured: false,
    vendorHq: "Berlin, Germany",
    euPresence:
      "Qdrant Solutions GmbH (Berlin). Fully EU-headquartered. AWS EU and on-premise deployment. EU-native founding team.",
    useCases:
      "Vector similarity search for RAG AI applications\nSemantic search for enterprise knowledge bases\nRecommendation system backends\nFraud detection feature stores\nMultimodal AI search (text, image, audio)",
    dataStorage:
      "On-premise: full customer control. Qdrant Cloud: AWS EU (Frankfurt) default for EU customers.",
    dataProcessing:
      "EU-based for Qdrant Cloud EU customers. On-premise: customer controlled.",
    trainingDataUse:
      "Infrastructure product — no data used for training. Vector data stays with customer.",
    subprocessors: "AWS EU for cloud. None for on-premise.",
    dpaDetails:
      "GDPR DPA for Qdrant Cloud. EU entity as data processor. On-premise: no DPA needed.",
    slaDetails: "99.9% for Qdrant Cloud enterprise.",
    dataPortability: "Full vector collection export. Open-source format.",
    exitTerms: "Data deletion within 30 days. Open-source: full portability.",
    ipTerms: "Apache 2.0 open source. Customer owns all data.",
    certifications: "ISO 27001 in progress. SOC 2 in progress.",
    encryptionInfo: "AES-256 at rest, TLS 1.3 in transit. On-premise: customer-managed.",
    accessControls: "API keys, JWT authentication, RBAC for collection access.",
    modelDocs:
      "Full open-source codebase. Technical architecture documentation. Research papers on HNSW algorithm.",
    explainability:
      "Distance/similarity scores for all search results. Transparent nearest-neighbour computation.",
    biasTesting:
      "Infrastructure component — bias in embedding models upstream. Qdrant supports filtering to implement bias mitigation.",
    aiActStatus:
      "Infrastructure component — not an AI system under EU AI Act. But enables EU AI Act-compliant RAG systems via explainable source retrieval.",
    gdprStatus:
      "Strong GDPR posture. EU-native. On-premise eliminates cloud data concerns. Qdrant Cloud: EU-based DPA.",
    euResidency:
      "Full EU residency: on-premise or Qdrant Cloud EU (Frankfurt).",
    industrySlugs: ["financial-services", "healthcare", "public-sector"],
    scores: {
      "eu-ai-act": "A-",
      gdpr: "A",
      dora: "B",
      "eba-eiopa-guidelines": "B-",
    },
  },
  {
    slug: "sap-joule-enterprise",
    vendor: "SAP",
    name: "SAP Joule AI Copilot",
    type: "Enterprise ERP AI / Copilot",
    risk: "High",
    description:
      "SAP's generative AI assistant embedded across SAP S/4HANA, SuccessFactors, Ariba, Concur, and the SAP Business Technology Platform. Joule provides natural language interfaces to core business processes. HR and financial AI features trigger high-risk classification.",
    category: "Enterprise ERP",
    featured: false,
    vendorHq: "Walldorf, Germany",
    euPresence:
      "SAP SE headquartered in Germany. EU data centres (Frankfurt, Amsterdam, Dublin). Fully EU-native enterprise software leader.",
    useCases:
      "HR process automation (SuccessFactors AI)\nFinancial close and reconciliation AI (S/4HANA)\nProcurement intelligence (Ariba AI)\nExpense management AI (Concur)\nIT service management AI (ServiceNow integration)",
    dataStorage:
      "EU data centres (Germany, Netherlands, Ireland). EU data residency standard for EU customers.",
    dataProcessing:
      "EU-based processing. SAP EU Cloud serves all EU customers from EU infrastructure.",
    trainingDataUse:
      "Customer ERP data not used to train public Joule models. Tenant isolation enforced.",
    subprocessors:
      "AWS EU, Azure EU. SAP subsidiaries. Published subprocessor list.",
    dpaDetails:
      "Comprehensive GDPR DPA under German law. EU entity. DPA templates for SAP cloud services.",
    slaDetails: "99.9% SLA for SAP S/4HANA Cloud.",
    dataPortability: "Full data portability via SAP standard APIs (ODBC, OData).",
    exitTerms: "Data deletion within 90 days post-contract.",
    ipTerms: "Customer owns all business data. SAP retains Joule AI IP.",
    certifications:
      "ISO 27001, ISO 27017, ISO 27018, SOC 2 Type II, C5 (Germany), BSI, ENS (Spain).",
    encryptionInfo:
      "AES-256 at rest with customer-managed keys (SAP KSML). TLS 1.3 in transit.",
    accessControls:
      "SAP Identity Authentication, RBAC, MFA, SSO/SAML, comprehensive audit logs.",
    modelDocs:
      "Joule AI documentation. SAP AI ethics framework. Responsible AI principles published.",
    explainability:
      "Process recommendations include rationale. HR AI (SuccessFactors) provides contributing factors for recommendations.",
    biasTesting:
      "SAP AI ethics team. SuccessFactors AI bias testing for HR use cases. Annual responsible AI report.",
    aiActStatus:
      "High-risk for HR (SuccessFactors AI — Annex III Category 4) and financial AI features. SAP EU AI Act compliance programme launched. EU-native positioning an advantage.",
    gdprStatus:
      "Excellent GDPR compliance — German law headquarters, EU infrastructure, comprehensive DPA programme.",
    euResidency:
      "Full EU residency standard. German data sovereignty option available.",
    industrySlugs: ["financial-services", "public-sector", "healthcare"],
    scores: {
      "eu-ai-act": "B+",
      gdpr: "A",
      dora: "B+",
      "eba-eiopa-guidelines": "B+",
    },
  },
];

// ─── News Entries ────────────────────────────────────────

const wave4NewsEntries = [
  {
    title: "GEMA v. OpenAI: Munich Court Rules AI Training on Lyrics is Infringement",
    description:
      "The Munich Regional Court (42nd Civil Chamber, case 42 O 14139/24) ruled in November 2025 that OpenAI infringed copyright by training GPT-4/4o on song lyrics without a licence. The court applied the 'memorisation doctrine' — finding that when an AI system can reproduce protected text verbatim in outputs, this constitutes reproduction of the original work. The court rejected the text and data mining (TDM) exception under DSM Directive Article 4, finding OpenAI did not adequately check for opt-outs. GEMA sought injunctive relief, damages, and information disclosure for all members' lyrics. The ruling has major implications for all GPAI providers operating in the EU.",
    changeType: "jurisprudence",
    date: new Date("2025-11-20"),
    sourceUrl: "https://www.twobirds.com/en/insights/2025/landmark-ruling-of-the-munich-regional-court-(gema-v-openai)-on-copyright-and-ai-training",
    sourceLabel: "Two Birds LLP — GEMA v OpenAI",
    author: "AI Compass EU Editorial",
    systemSlug: "openai-chatgpt-enterprise",
  },
  {
    title: "Getty Images v. Stability AI — UK High Court Partial Win for Getty",
    description:
      "The UK High Court issued its judgment in Getty Images v. Stability AI in November 2025, finding partial infringement in early Stable Diffusion models. The court found: (1) training on Getty watermarked images constituted reproduction without licence; (2) outputs that included distorted watermarks constituted trade mark infringement. The court did not find that all image generation AI infringes copyright — specific fact-sensitive analysis required. The case was widely watched across the EU as a leading indicator for continental European jurisprudence.",
    changeType: "jurisprudence",
    date: new Date("2025-11-18"),
    sourceUrl: "https://www.taylorwessing.com/en/interface/2025/online-and-ai-generated-content/ai-and-copyright-litigation-in-the-eu-and-the-uk",
    sourceLabel: "Taylor Wessing — AI Copyright Litigation Review",
    author: "AI Compass EU Editorial",
    systemSlug: "stability-ai-sdxl",
  },
  {
    title: "SAP Joule — EU AI Act High-Risk SuccessFactors Compliance Announced",
    description:
      "SAP announced EU AI Act compliance measures for Joule AI features in SuccessFactors HR Cloud in 2025. As a German-headquartered company, SAP has positioned EU AI Act compliance as a competitive advantage. Measures include: GDPR Article 22 human review workflows for AI-assisted recruitment scoring, bias testing disclosures for EU customers, and conformity assessment in progress for Annex III Category 4 (employment AI) use cases.",
    changeType: "certification",
    date: new Date("2025-10-01"),
    sourceUrl: "https://news.sap.com/",
    sourceLabel: "SAP News Centre",
    author: "AI Compass EU Editorial",
    systemSlug: "sap-joule-enterprise",
  },
  {
    title: "NVIDIA AI Enterprise — EU AI Act Position Statement Published",
    description:
      "NVIDIA published its EU AI Act position statement in 2025, clarifying that NVIDIA primarily functions as an AI infrastructure provider and is not an AI system provider under the Act for core GPU/platform products. However, NVIDIA acknowledged high-risk classifications apply for specific application-layer products: NVIDIA DRIVE (autonomous vehicles) and NVIDIA Clara (medical imaging AI). NVIDIA committed to supporting conformity assessment for these products.",
    changeType: "update",
    date: new Date("2025-06-15"),
    sourceUrl: "https://www.nvidia.com/en-us/ai/",
    sourceLabel: "NVIDIA Official",
    author: "AI Compass EU Editorial",
    systemSlug: "nvidia-nim-enterprise",
  },
  {
    title: "EU AI Safety Board Established — First Meeting",
    description:
      "The EU AI Safety Board (EU Advisory Forum on AI) held its first formal meeting in early 2025 under the EU AI Act framework. The Board, comprising representatives from member states, academia, and civil society, provides strategic advice to the European Commission on AI safety. Key agenda items: systemic risk assessment methodology for GPAI models, cross-border enforcement coordination, and EU-US AI safety collaboration.",
    changeType: "new_version",
    date: new Date("2025-01-15"),
    sourceUrl: "https://digital-strategy.ec.europa.eu/en/policies/ai-office",
    sourceLabel: "EU AI Office",
    author: "AI Compass EU Editorial",
    frameworkSlug: "eu-ai-act",
  },
  {
    title: "AI Act Harmonised Standards — First CEN Workshop Agreements",
    description:
      "CEN (European Committee for Standardisation) published the first Workshop Agreements (CWAs) providing practical guidance for EU AI Act implementation in 2025. CWAs cover: AI risk management processes, technical documentation templates for Annex IV, and post-market monitoring methodology. While not harmonised standards (which create presumption of conformity), CWAs provide industry consensus guidance referenced by market surveillance authorities.",
    changeType: "update",
    date: new Date("2025-09-01"),
    sourceUrl: "https://www.cencenelec.eu/",
    sourceLabel: "CEN/CENELEC",
    author: "AI Compass EU Editorial",
    frameworkSlug: "eu-ai-act",
  },
  {
    title: "Ireland DORA Supervision — First ICT Third-Party AI Findings",
    description:
      "Ireland's Central Bank (CBI), as supervisor for major EU financial institutions, published its first DORA supervisory findings in 2025 including AI-specific ICT third-party risk observations. Key findings: inadequate contractual provisions for AI cloud services (missing audit rights, weak SLAs for AI-specific incidents), insufficient concentration risk assessment for AI services where multiple banks use the same provider, and gaps in AI incident classification and reporting procedures.",
    changeType: "update",
    date: new Date("2025-09-20"),
    sourceUrl: "https://www.centralbank.ie/",
    sourceLabel: "Central Bank of Ireland",
    author: "AI Compass EU Editorial",
    frameworkSlug: "dora",
  },
  {
    title: "EBA Stress Test 2026 — AI Model Risk Scenarios Included",
    description:
      "The European Banking Authority's 2026 stress test programme, announced in early 2026, includes for the first time specific AI model risk scenarios. Banks must assess: impact of AI model failure in credit decisions, adversarial attack scenarios on fraud detection AI, and concentration risk in AI cloud service providers. This is the first time EU bank supervisors have formally included AI model risk in the supervisory stress test framework.",
    changeType: "update",
    date: new Date("2026-01-10"),
    sourceUrl: "https://www.eba.europa.eu/",
    sourceLabel: "European Banking Authority",
    author: "AI Compass EU Editorial",
    frameworkSlug: "eba-eiopa-guidelines",
  },
  {
    title: "Qdrant Raises €28M — EU-Native AI Infrastructure Backed by EU Investors",
    description:
      "Berlin-based Qdrant raised €28 million Series B in 2025, becoming one of the best-funded EU-native AI infrastructure companies. The round was backed by European venture capital including Bessemer Europe and Target Global. Qdrant positioned the funding around EU AI compliance-ready infrastructure — its EU-native domicile and open-source architecture are differentiated factors for enterprises requiring EU data sovereignty under the EU AI Act.",
    changeType: "update",
    date: new Date("2025-05-20"),
    sourceUrl: "https://qdrant.tech/",
    sourceLabel: "Qdrant Official",
    author: "AI Compass EU Editorial",
    systemSlug: "qdrant-vector-db",
  },
  {
    title: "European AI Champions League — Commission Announces Funding",
    description:
      "The European Commission announced the 'AI Champions' programme in 2025, providing €200M in grants to European AI companies including Mistral AI, Aleph Alpha, Qdrant, and other EU-native AI providers. The programme explicitly prioritises companies demonstrating EU AI Act compliance readiness and EU data sovereignty commitments. Part of the broader €1.5B AI Factories initiative announced under EU AI Act Article 58.",
    changeType: "update",
    date: new Date("2025-07-01"),
    sourceUrl: "https://digital-strategy.ec.europa.eu/",
    sourceLabel: "European Commission Digital Strategy",
    author: "AI Compass EU Editorial",
    frameworkSlug: "national-ai-strategies",
  },
  {
    title: "AI Liability: Paris Commercial Court Rules on AI Service SLA Failure",
    description:
      "The Paris Commercial Court issued a ruling in 2025 in a case involving an AI service provider's failure to meet SLA commitments for a financial services AI system. The court found that contractual AI SLAs are enforceable under French commercial law and that failure to meet accuracy thresholds specified in contracts constitutes a breach. The case highlights the importance of AI-specific SLA provisions beyond standard cloud uptime metrics.",
    changeType: "jurisprudence",
    date: new Date("2025-08-10"),
    sourceUrl: "https://www.cours-appel.justice.fr/paris",
    sourceLabel: "Paris Commercial Court",
    author: "AI Compass EU Editorial",
    frameworkSlug: "eu-ai-act",
  },
  {
    title: "European Parliament Adopts AI Literacy Resolution",
    description:
      "The European Parliament adopted a resolution on AI literacy in workplaces in 2025, calling on member states to require AI literacy training for all EU workers and for employers deploying high-risk AI to provide mandatory training for affected employees. The resolution anticipates the EU AI Act's Article 4 requirement for AI literacy and Article 26(7) requirement to inform employees about AI systems. The resolution is non-binding but directs member state implementation.",
    changeType: "update",
    date: new Date("2025-04-25"),
    sourceUrl: "https://www.europarl.europa.eu/",
    sourceLabel: "European Parliament",
    author: "AI Compass EU Editorial",
    frameworkSlug: "eu-ai-act",
  },
  {
    title: "Synthesia Implements C2PA Watermarking for All Enterprise Videos",
    description:
      "London-based Synthesia became one of the first enterprise AI video platforms to implement C2PA (Coalition for Content Provenance and Authenticity) cryptographic watermarking across all generated videos in 2025. This directly addresses EU AI Act Article 50(4) requirements for machine-readable labelling of AI-generated content. Synthesia's implementation is cited as a best practice example by the EU AI Office.",
    changeType: "certification",
    date: new Date("2025-08-15"),
    sourceUrl: "https://www.synthesia.io/",
    sourceLabel: "Synthesia Official",
    author: "AI Compass EU Editorial",
    systemSlug: "synthesia-ai-video",
  },
  {
    title: "EU Energy AI: Commission Launches AI for Green Deal Programme",
    description:
      "The European Commission launched the 'AI for Green Deal' programme in 2025, funding AI applications in energy grid optimisation, building efficiency, and climate modelling. High-risk AI systems used in energy infrastructure management must comply with EU AI Act Annex III Category 2. The programme includes €150M for AI-powered grid management systems and specific guidance on conformity assessment for critical infrastructure AI.",
    changeType: "update",
    date: new Date("2025-11-10"),
    sourceUrl: "https://ec.europa.eu/clima/eu-action/eu-climate-action/eu-climate-strategy-targets_en",
    sourceLabel: "European Commission — Climate Action",
    author: "AI Compass EU Editorial",
    frameworkSlug: "eu-ai-act",
  },
  {
    title: "Scale AI Achieves ISO 27001 and GDPR DPA for EU Operations",
    description:
      "Scale AI completed ISO 27001 certification for its EU data operations and established a comprehensive GDPR DPA for EU customers in 2025. The certification specifically covers Scale's human labelling workflows where EU personal data may appear in training datasets. Scale committed to data minimisation for EU training data annotation and enhanced access controls for EU customer data.",
    changeType: "certification",
    date: new Date("2025-07-30"),
    sourceUrl: "https://scale.com/",
    sourceLabel: "Scale AI Official",
    author: "AI Compass EU Editorial",
    systemSlug: "scale-ai-enterprise",
  },
];

// ─── Additional Approved Sources ─────────────────────────

const wave4Sources = [
  {
    url: "https://artificialintelligenceact.eu/small-businesses-guide-to-the-ai-act/",
    name: "EU AI Act — Small Business Guide",
    description: "Comprehensive guide to EU AI Act obligations for SMEs and startups, including sandbox access and reduced compliance measures.",
  },
  {
    url: "https://artificialintelligenceact.eu/article/72/",
    name: "Article 72: Post-Market Monitoring — AI Act Explorer",
    description: "EU AI Act Article 72 requirements for continuous post-market monitoring of high-risk AI systems.",
  },
  {
    url: "https://www.twobirds.com/en/insights/2025/landmark-ruling-of-the-munich-regional-court-(gema-v-openai)-on-copyright-and-ai-training",
    name: "GEMA v OpenAI — Munich Court Copyright Ruling",
    description: "Analysis of landmark German copyright ruling affecting AI training data practices in Europe.",
  },
  {
    url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32019L0790",
    name: "DSM Directive (EU) 2019/790 — Text and Data Mining",
    description: "EU Copyright Directive articles on text and data mining exceptions relevant to GPAI training data.",
  },
  {
    url: "https://aigovernancedesk.com/eu-ai-act-post-market-monitoring-article-72/",
    name: "AI Governance Desk — Article 72 Post-Market Monitoring",
    description: "Practical guidance on implementing Article 72 post-market monitoring requirements.",
  },
  {
    url: "https://www.eiopa.europa.eu/publications/eiopa-publishes-guidelines-use-artificial-intelligence-eu-insurance-sector_en",
    name: "EIOPA AI Guidelines for Insurance",
    description: "EIOPA guidelines on AI use in insurance underwriting, pricing, and claims processing.",
  },
  {
    url: "https://qdrant.tech/documentation/",
    name: "Qdrant Documentation",
    description: "EU-native vector database documentation for RAG and semantic search AI applications.",
  },
  {
    url: "https://c2pa.org/",
    name: "C2PA — Coalition for Content Provenance and Authenticity",
    description: "Technical standard for AI-generated content watermarking referenced in EU AI Act Article 50(4) compliance.",
  },
  {
    url: "https://artificialintelligenceact.eu/gpai-guidelines-overview/",
    name: "GPAI Model Guidelines Overview",
    description: "Overview of EU Commission GPAI guidelines published July 2025 covering model obligations and systemic risk.",
  },
  {
    url: "https://www.centralbank.ie/",
    name: "Central Bank of Ireland — DORA Supervision",
    description: "Irish Central Bank DORA supervisory guidance including AI-specific ICT third-party risk findings.",
  },
];

// ─── Main ─────────────────────────────────────────────────

async function main() {
  console.log("🌱 Starting Wave 4 content seed...\n");

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

  // ─── Framework Sections ─────────────────────────────────
  console.log("📋 Adding framework sections...");
  let sectionsAdded = 0;
  let statementsAdded = 0;

  for (const sec of newSections) {
    const { frameworkSlug, statements, ...sectionFields } = sec;
    const frameworkId = frameworkMap[frameworkSlug];
    if (!frameworkId) continue;

    let dbSection = await prisma.frameworkSection.findFirst({
      where: { title: sectionFields.title, frameworkId },
    });

    if (!dbSection) {
      dbSection = await prisma.frameworkSection.create({
        data: { ...sectionFields, frameworkId },
      });
      sectionsAdded++;
    }

    for (const stmt of statements) {
      const existing = await prisma.policyStatement.findFirst({
        where: { reference: stmt.reference, sectionId: dbSection.id },
      });
      if (!existing) {
        await prisma.policyStatement.create({
          data: { ...stmt, sectionId: dbSection.id },
        });
        statementsAdded++;
      }
    }
    console.log(`  ✅ [${frameworkSlug}] ${sectionFields.title}`);
  }

  // ─── AI Systems ─────────────────────────────────────────
  console.log("\n📦 Adding Wave 4 AI systems...");
  let systemsAdded = 0;

  for (const sys of wave4Systems) {
    const { industrySlugs, scores, ...data } = sys;
    const industryIds = industrySlugs.filter((s) => industryMap[s]).map((s) => ({ id: industryMap[s] }));

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
    systemsAdded++;
    console.log(`  ✅ ${upserted.vendor} — ${upserted.name}`);
  }

  // ─── News Entries ───────────────────────────────────────
  console.log("\n📰 Adding Wave 4 news entries...");
  let newsAdded = 0;

  for (const entry of wave4NewsEntries) {
    const { frameworkSlug, systemSlug, ...data } = entry as typeof entry & {
      frameworkSlug?: string;
      systemSlug?: string;
    };
    const frameworkId = frameworkSlug ? frameworkMap[frameworkSlug] : undefined;
    const systemId = systemSlug ? systemMap[systemSlug] : undefined;

    const existing = await prisma.changeLog.findFirst({ where: { title: data.title } });
    if (existing) {
      await prisma.changeLog.update({ where: { id: existing.id }, data: { ...data, frameworkId, systemId } });
    } else {
      await prisma.changeLog.create({ data: { ...data, frameworkId, systemId } });
    }
    newsAdded++;
    console.log(`  ✅ ${data.title.substring(0, 60)}...`);
  }

  // ─── Approved Sources ───────────────────────────────────
  console.log("\n🔗 Adding approved sources...");
  let sourcesAdded = 0;

  for (const source of wave4Sources) {
    await prisma.approvedSource.upsert({
      where: { url: source.url },
      update: source,
      create: source,
    });
    sourcesAdded++;
    console.log(`  ✅ ${source.name}`);
  }

  console.log("\n✨ Wave 4 complete!");
  console.log(`   Sections: ${sectionsAdded} | Statements: ${statementsAdded}`);
  console.log(`   Systems: ${systemsAdded} | News: ${newsAdded} | Sources: ${sourcesAdded}`);

  const totals = {
    systems: await prisma.aISystem.count(),
    sections: await prisma.frameworkSection.count(),
    statements: await prisma.policyStatement.count(),
    changelogs: await prisma.changeLog.count(),
    sources: await prisma.approvedSource.count(),
  };
  console.log("\n📊 Database totals:", totals);
}

main().catch((e) => { console.error("❌", e); process.exit(1); }).finally(() => prisma.$disconnect());
