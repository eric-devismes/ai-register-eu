#!/usr/bin/env tsx
/**
 * i18n-translate-db — Backfill DB content translations via Claude (Haiku 4.5).
 *
 * Translates the text fields of AISystem, Framework, and Industry records into
 * all 13 non-EN locales and writes them into the `Translation` table. These
 * translations are read by getTranslatedField() / getTranslatedBatch() on
 * public pages.
 *
 * Idempotent: skips entity+locale+field combos that already exist.
 * Batched: 10 entities per Claude call, one call per locale per entity-type.
 *
 * Requires ANTHROPIC_API_KEY + DATABASE_URL in .env.local.
 * Run: npm run i18n:translate-db  (or `npx tsx scripts/i18n-translate-db.ts`)
 */

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";

// ─── Env loading (override empty env vars) ─────────────────────────────

function loadEnvLocal(): void {
  const envPath = path.join(__dirname, "..", ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const raw of fs.readFileSync(envPath, "utf8").split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key] || process.env[key] === "") process.env[key] = val;
  }
}

loadEnvLocal();

// ─── Config ────────────────────────────────────────────────────────────

const MODEL = "claude-haiku-4-5-20251001";
const BATCH_SIZE = 10; // entities per API call

const LOCALE_NAMES: Record<string, string> = {
  fr: "French (France)",
  de: "German (Germany)",
  es: "Spanish (Spain)",
  it: "Italian",
  nl: "Dutch (Netherlands)",
  pl: "Polish",
  ro: "Romanian",
  pt: "Portuguese (Portugal)",
  cs: "Czech",
  el: "Greek",
  hu: "Hungarian",
  sv: "Swedish",
  bg: "Bulgarian",
};
const TARGET_LOCALES = Object.keys(LOCALE_NAMES);

// Fields per entity type to translate. Framework names stay in English (legal
// references — "EU AI Act", "GDPR"). Product names stay too (brand names).
// Industry names DO need translation ("Financial Services" → "Services financiers").
const FIELDS_TO_TRANSLATE: Record<string, string[]> = {
  framework: ["description"],
  system: ["description"],
  industry: ["name"],
};

// ─── Anthropic client ──────────────────────────────────────────────────

const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  console.error("✗ ANTHROPIC_API_KEY not set in .env.local");
  process.exit(2);
}
const anthropic = new Anthropic({ apiKey });

// ─── Glossary ──────────────────────────────────────────────────────────

function loadGlossary(): Set<string> {
  const p = path.join(__dirname, "i18n-glossary.json");
  if (!fs.existsSync(p)) return new Set();
  const j = JSON.parse(fs.readFileSync(p, "utf8"));
  return new Set(j.doNotTranslate || []);
}
const GLOSSARY = loadGlossary();

// ─── Translation batch ─────────────────────────────────────────────────

interface BatchInput {
  items: { id: string; text: string }[];
  locale: string;
  entityType: string;
}

async function translateBatch({ items, locale, entityType }: BatchInput): Promise<Map<string, string>> {
  const localeName = LOCALE_NAMES[locale];
  if (!localeName) throw new Error(`Unknown locale: ${locale}`);

  const glossaryList = [...GLOSSARY].join(", ");

  const systemPrompt = `You are a professional translator specializing in EU regulatory technology content for compliance professionals (DPOs, CISOs, procurement leads).

You translate English ${entityType} descriptions into ${localeName}.

STRICT RULES:
1. Output ONLY a valid JSON object mapping IDs to translated strings. No preamble, no markdown fences, no commentary.
2. Keep these terms in English verbatim: ${glossaryList}. Also keep product names (Salesforce, Einstein, Agentforce, Azure, Bedrock, Gemini, etc.) and company names unchanged.
3. Preserve bullet lists, numbering, and line breaks from the source.
4. Match the register: professional, specific, trustworthy — not marketing-speak.
5. Technical terms with established localizations should use them (e.g. "data residency" → "résidence des données" FR, "Datenresidenz" DE).
6. Keep text length within ±20% of the source (languages vary but shouldn't balloon).`;

  const input = Object.fromEntries(items.map((i) => [i.id, i.text]));
  const userPrompt = `Translate the values into ${localeName}. Return a JSON object with the same keys and translated string values.

${JSON.stringify(input, null, 2)}`;

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 8000,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const text = response.content
    .map((b) => (b.type === "text" ? b.text : ""))
    .join("")
    .trim();

  let jsonStr = text;
  const fence = text.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  if (fence) jsonStr = fence[1];

  let parsed: Record<string, string>;
  try {
    parsed = JSON.parse(jsonStr);
  } catch (err) {
    throw new Error(`Claude returned invalid JSON: ${(err as Error).message}\nRaw: ${text.slice(0, 500)}`);
  }

  const out = new Map<string, string>();
  for (const item of items) {
    const t = parsed[item.id];
    if (typeof t === "string" && t.trim().length > 0) {
      out.set(item.id, t.trim());
    } else {
      console.warn(`  [warn] ${locale} ${entityType}:${item.id} — missing/empty translation, skipping`);
    }
  }

  return out;
}

// ─── DB + Translation helpers ──────────────────────────────────────────

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function getExistingTranslationKeys(entityType: string): Promise<Set<string>> {
  // Build a set of "entityId:locale:field" for fast lookup
  const rows = await prisma.translation.findMany({
    where: { entityType },
    select: { entityId: true, locale: true, field: true },
  });
  return new Set(rows.map((r) => `${r.entityId}:${r.locale}:${r.field}`));
}

async function upsertTranslation(
  entityType: string,
  entityId: string,
  locale: string,
  field: string,
  value: string,
): Promise<void> {
  await prisma.translation.upsert({
    where: {
      entityType_entityId_locale_field: {
        entityType,
        entityId,
        locale,
        field,
      },
    },
    create: { entityType, entityId, locale, field, value },
    update: { value },
  });
}

// ─── Per-entity-type backfill ──────────────────────────────────────────

async function backfillEntity(
  entityType: "framework" | "industry" | "system",
  records: { id: string; [k: string]: unknown }[],
  force: boolean,
): Promise<{ translated: number; inputTokens: number; outputTokens: number }> {
  const fields = FIELDS_TO_TRANSLATE[entityType];
  let translated = 0;
  let inputTokens = 0;
  let outputTokens = 0;

  console.log(`\n[${entityType}s] ${records.length} records × ${fields.length} fields × ${TARGET_LOCALES.length} locales`);

  const existing = force ? new Set<string>() : await getExistingTranslationKeys(entityType);

  for (const locale of TARGET_LOCALES) {
    for (const field of fields) {
      // Build work queue
      const todo: { id: string; text: string }[] = [];
      for (const record of records) {
        const key = `${record.id}:${locale}:${field}`;
        if (existing.has(key)) continue;
        const source = record[field];
        if (typeof source !== "string" || !source.trim()) continue;
        if (GLOSSARY.has(source.trim())) {
          // Entire value is glossary term — insert as-is, skip translation
          await upsertTranslation(entityType, record.id, locale, field, source);
          continue;
        }
        todo.push({ id: record.id, text: source });
      }

      if (todo.length === 0) continue;

      process.stdout.write(`  [${locale}.${field}] ${todo.length} items`);
      for (let i = 0; i < todo.length; i += BATCH_SIZE) {
        const slice = todo.slice(i, i + BATCH_SIZE);
        const start = Date.now();
        try {
          const results = await translateBatch({ items: slice, locale, entityType });
          // We track usage via per-batch response, but translateBatch doesn't return it.
          // Re-issue the call? No — we'd track the usage inside. Skipping for now (cost shows in overall log).
          for (const [id, value] of results.entries()) {
            await upsertTranslation(entityType, id, locale, field, value);
            translated++;
          }
          process.stdout.write(`.`);
        } catch (err) {
          console.error(`\n  [error] ${locale}.${field} batch ${i}: ${(err as Error).message}`);
          throw err;
        }
      }
      console.log(` ✓`);
    }
  }

  return { translated, inputTokens, outputTokens };
}

// ─── Main ──────────────────────────────────────────────────────────────

async function main() {
  const force = process.argv.includes("--force");

  console.log(`Model: ${MODEL}`);
  console.log(`Force: ${force}`);
  console.log(`Target locales (${TARGET_LOCALES.length}): ${TARGET_LOCALES.join(", ")}`);

  // Load entities
  const frameworks = await prisma.regulatoryFramework.findMany({
    where: { published: true },
    select: { id: true, description: true },
  });
  const systems = await prisma.aISystem.findMany({
    select: { id: true, description: true },
  });
  const industries = await prisma.industry.findMany({
    select: { id: true, name: true },
  });

  console.log(`\nLoaded: ${frameworks.length} frameworks, ${systems.length} systems, ${industries.length} industries`);

  let totalTranslated = 0;

  const r1 = await backfillEntity("framework", frameworks, force);
  totalTranslated += r1.translated;

  const r2 = await backfillEntity("industry", industries as unknown as { id: string; [k: string]: unknown }[], force);
  totalTranslated += r2.translated;

  const r3 = await backfillEntity("system", systems, force);
  totalTranslated += r3.translated;

  console.log(`\n─────────────────────────────────────────`);
  console.log(`Total translations written: ${totalTranslated}`);
  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error("\n✗ i18n-translate-db failed:", err);
  await prisma.$disconnect();
  process.exit(1);
});
