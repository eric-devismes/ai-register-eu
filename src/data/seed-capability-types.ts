/**
 * Seed: AI Capability Meta-Taxonomy
 *
 * Classifies all AI systems by their core technology type using
 * standardised meta categories that non-technical users can understand.
 *
 * Categories:
 *   - generative-ai:         LLM-based text/code/image/video generation
 *   - supervised-ml:         Classification, prediction, regression, credit scoring
 *   - unsupervised-ml:       Clustering, anomaly detection, pattern discovery
 *   - conversational-ai:     Chatbots, virtual agents, dialogue systems
 *   - autonomous-agents:     Multi-step workflows without human oversight
 *   - search-retrieval:      Semantic search, RAG, knowledge discovery
 *   - computer-vision:       Image/video analysis, OCR, visual inspection
 *   - decision-intelligence: Recommendations, scoring, optimisation
 *   - nlp:                   Text analytics, sentiment, entity extraction
 *   - ai-infrastructure:     Model serving, vector DBs, training data platforms
 *   - cybersecurity-ai:      Threat detection, SOC automation, endpoint security
 *
 * Run: npx tsx src/data/seed-capability-types.ts
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// slug → capabilityType mapping (based on actual DB slugs)
const capabilityMap: Record<string, string> = {
  // ── Generative AI (LLM-based) ─────────────────────────
  "aleph-alpha-luminous":              "generative-ai",
  "anthropic-claude-api":              "generative-ai",
  "anthropic-claude-enterprise":       "generative-ai",
  "cohere-enterprise":                 "generative-ai",
  "deepseek-r1":                       "generative-ai",
  "deepmind-gemini-ultra":             "generative-ai",
  "github-copilot-enterprise":         "generative-ai",
  "google-gemini-vertex-ai":           "generative-ai",
  "meta-llama-enterprise":             "generative-ai",
  "microsoft-azure-openai-service":    "generative-ai",
  "mistral-large-2":                   "generative-ai",
  "mistral-ai":                        "generative-ai",
  "notion-ai":                         "generative-ai",
  "openai-chatgpt-enterprise":         "generative-ai",
  "perplexity-ai-enterprise":          "generative-ai",
  "servicenow-now-assist":             "generative-ai",
  "writer-enterprise-ai":              "generative-ai",
  "xai-grok-enterprise":               "generative-ai",
  "stability-ai-sdxl":                 "generative-ai",
  "runway-ai-video":                   "generative-ai",
  "elevenlabs-enterprise":             "generative-ai",
  "synthesia-ai-video":                "generative-ai",

  // ── Supervised ML / Predictive ─────────────────────────
  "zest-ai":                           "supervised-ml",
  "aslyce-fraud-ai":                   "supervised-ml",
  "fico-platform":                     "supervised-ml",
  "c3ai-enterprise":                   "supervised-ml",
  "workday-ai-talent":                 "supervised-ml",

  // ── Decision Intelligence ──────────────────────────────
  "palantir-aip":                      "decision-intelligence",
  "tempus-ai-health":                  "decision-intelligence",
  "oracle-fusion-ai":                  "decision-intelligence",
  "snowflake-cortex-ai":               "decision-intelligence",
  "databricks-mosaic-ai":              "decision-intelligence",
  "sap-joule-enterprise":              "decision-intelligence",
  "sap-joule":                         "decision-intelligence",

  // ── Autonomous Agents / RPA ────────────────────────────
  "uipath-maestro":                    "autonomous-agents",
  "agentforce-einstein-ai":            "autonomous-agents",
  "salesforce-agentforce-einstein":    "autonomous-agents",

  // ── Conversational AI ──────────────────────────────────
  "ibm-watsonx":                       "conversational-ai",
  "verint-ai":                         "conversational-ai",
  "hirevue-ai":                        "conversational-ai",

  // ── Search & Retrieval ─────────────────────────────────
  "glean-enterprise-search":           "search-retrieval",

  // ── Cybersecurity AI ───────────────────────────────────
  "darktrace":                         "cybersecurity-ai",
  "crowdstrike-falcon-ai":             "cybersecurity-ai",
  "palo-alto-networks-cortex-xsiam":   "cybersecurity-ai",
  "axon-ai-evidence":                  "cybersecurity-ai",

  // ── AI Infrastructure ──────────────────────────────────
  "amazon-bedrock-aws":                "ai-infrastructure",
  "nvidia-nim-enterprise":             "ai-infrastructure",
  "qdrant-vector-db":                  "ai-infrastructure",
  "scale-ai-enterprise":               "ai-infrastructure",

  // ── Life Sciences AI ───────────────────────────────────
  "deepmind-isomorphic":               "decision-intelligence",
  "veeva-vault-ai":                    "decision-intelligence",

  // ── On-Device AI ───────────────────────────────────────
  "apple-intelligence-enterprise":     "generative-ai",

  // ── HR / Workforce AI ──────────────────────────────────
  "workday-illuminate-ai":             "supervised-ml",
};

async function main() {
  console.log("Seeding AI capability types...\n");

  let updated = 0;
  let skipped = 0;

  for (const [slug, capabilityType] of Object.entries(capabilityMap)) {
    try {
      const result = await prisma.aISystem.updateMany({
        where: { slug },
        data: { capabilityType },
      });
      if (result.count > 0) {
        console.log(`  ✓ ${slug} → ${capabilityType}`);
        updated++;
      } else {
        console.log(`  – ${slug} (not found, skipped)`);
        skipped++;
      }
    } catch (err) {
      console.error(`  ✗ ${slug}: ${err}`);
    }
  }

  console.log(`\nDone: ${updated} updated, ${skipped} skipped`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
