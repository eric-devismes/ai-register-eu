/**
 * Seed French translations for the most visible DB content.
 * Demonstrates the translation system working end-to-end.
 *
 * Run: npx tsx src/data/seed-translations-fr.ts
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function upsertTranslation(entityType: string, entityId: string, locale: string, field: string, value: string) {
  await prisma.translation.upsert({
    where: { entityType_entityId_locale_field: { entityType, entityId, locale, field } },
    update: { value },
    create: { entityType, entityId, locale, field, value },
  });
}

async function main() {
  console.log("Seeding French translations...\n");

  // ─── Industries ────────────────────────────────────────
  const industries = await prisma.industry.findMany();
  const industryNames: Record<string, string> = {
    "financial-services": "Services financiers",
    "healthcare": "Sant\u00e9",
    "insurance": "Assurance",
    "public-sector": "Secteur public",
    "manufacturing": "Industrie manufacturi\u00e8re",
    "telecommunications": "T\u00e9l\u00e9communications",
    "energy-utilities": "\u00c9nergie et services publics",
    "human-resources": "Ressources humaines",
  };

  for (const ind of industries) {
    const frName = industryNames[ind.slug];
    if (frName) {
      await upsertTranslation("industry", ind.id, "fr", "name", frName);
      console.log(`  \u2713 Industry: ${ind.name} \u2192 ${frName}`);
    }
  }

  // ─── Frameworks ────────────────────────────────────────
  const frameworks = await prisma.regulatoryFramework.findMany();
  const frameworkTranslations: Record<string, { name?: string; description?: string }> = {
    "eu-ai-act": {
      description: "Cadre r\u00e9glementaire complet fond\u00e9 sur les risques pour les syst\u00e8mes d'IA, couvrant les pratiques interdites, les exigences pour les syst\u00e8mes \u00e0 haut risque et les obligations de transparence.",
    },
    "gdpr": {
      name: "RGPD",
      description: "R\u00e8glement g\u00e9n\u00e9ral sur la protection des donn\u00e9es r\u00e9gissant le traitement des donn\u00e9es personnelles, le consentement, les droits des personnes concern\u00e9es et les transferts transfrontaliers.",
    },
    "dora": {
      description: "Loi sur la r\u00e9silience op\u00e9rationnelle num\u00e9rique garantissant que les entit\u00e9s financi\u00e8res peuvent r\u00e9sister aux perturbations et menaces li\u00e9es aux TIC.",
    },
    "eba-eiopa-guidelines": {
      description: "Lignes directrices sectorielles des autorit\u00e9s bancaires et d'assurance europ\u00e9ennes sur l'utilisation de l'IA dans les services financiers.",
    },
    "mdr-ivdr": {
      description: "R\u00e8glements sur les dispositifs m\u00e9dicaux et diagnostics in vitro couvrant les dispositifs m\u00e9dicaux et outils de diagnostic aliment\u00e9s par l'IA.",
    },
    "national-ai-strategies": {
      name: "Strat\u00e9gies nationales IA",
      description: "Cadres de gouvernance et strat\u00e9gies nationales en mati\u00e8re d'IA au niveau des \u00c9tats membres de l'UE.",
    },
  };

  for (const fw of frameworks) {
    const tr = frameworkTranslations[fw.slug];
    if (tr) {
      if (tr.name) await upsertTranslation("framework", fw.id, "fr", "name", tr.name);
      if (tr.description) await upsertTranslation("framework", fw.id, "fr", "description", tr.description);
      console.log(`  \u2713 Framework: ${fw.name}`);
    }
  }

  // ─── AI Systems (top 6 featured) ───────────────────────
  const systems = await prisma.aISystem.findMany({ where: { featured: true }, take: 6 });
  const systemTranslations: Record<string, { description?: string; type?: string }> = {
    "microsoft-azure-openai-service": {
      description: "Acc\u00e8s de niveau entreprise aux mod\u00e8les OpenAI (GPT-4o, DALL-E, Whisper) via le cloud Azure avec s\u00e9curit\u00e9, contr\u00f4les de conformit\u00e9 et filtrage de contenu. Copilot int\u00e8gre l'IA dans Microsoft 365.",
      type: "Plateforme de mod\u00e8les fondamentaux",
    },
    "google-gemini-vertex-ai": {
      description: "IA multimodale (texte, image, vid\u00e9o, code) via Vertex AI pour les d\u00e9ploiements entreprise et int\u00e9gr\u00e9e dans Google Workspace. Mod\u00e8les Gemini avec r\u00e9gions de donn\u00e9es UE.",
      type: "Plateforme de mod\u00e8les fondamentaux + Cloud IA",
    },
    "anthropic-claude-enterprise": {
      description: "Mod\u00e8les de langage ax\u00e9s sur la s\u00e9curit\u00e9 avec IA Constitutionnelle. Version entreprise avec SSO/SCIM, contr\u00f4les administrateur, contexte 200K+ et acc\u00e8s API.",
      type: "Plateforme de mod\u00e8les fondamentaux",
    },
    "mistral-ai": {
      description: "Mod\u00e8les fondamentaux d'origine europ\u00e9enne. Le Chat pour les consommateurs, Mistral Platform pour l'API, Mistral Forge pour le d\u00e9ploiement sur site. Souverainet\u00e9 des donn\u00e9es UE la plus forte de tout fournisseur de LLM.",
      type: "Plateforme de mod\u00e8les fondamentaux (souveraine UE)",
    },
    "amazon-bedrock-aws": {
      description: "Service g\u00e9r\u00e9 donnant acc\u00e8s \u00e0 plusieurs mod\u00e8les fondamentaux (Claude, Llama, Mistral, Cohere, Titan) via une API unifi\u00e9e avec garde-fous, ajustement fin et RAG.",
      type: "Plateforme IA multi-mod\u00e8les",
    },
    "salesforce-agentforce-einstein": {
      description: "Agents IA autonomes pour le CRM : qualification de leads, r\u00e9solution de cas, int\u00e9gration de clients. La couche de confiance Einstein emp\u00eache les fuites de donn\u00e9es vers les LLM.",
      type: "IA CRM / IA agentique",
    },
  };

  for (const sys of systems) {
    const tr = systemTranslations[sys.slug];
    if (tr) {
      if (tr.description) await upsertTranslation("system", sys.id, "fr", "description", tr.description);
      if (tr.type) await upsertTranslation("system", sys.id, "fr", "type", tr.type);
      console.log(`  \u2713 System: ${sys.vendor} ${sys.name}`);
    }
  }

  console.log("\nDone! French translations seeded.");
}

main()
  .catch((e) => { console.error("Seed failed:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
