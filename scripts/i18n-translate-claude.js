#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * i18n-translate-claude — Dictionary backfill via Anthropic Claude (Haiku 4.5).
 *
 * Replaces the DeepL-based translator for projects without a DeepL key.
 * Drop-in semantics:
 *   - Skips keys already translated (idempotent).
 *   - Protects {placeholder} tokens exactly.
 *   - Respects scripts/i18n-glossary.json (do-not-translate terms).
 *   - NEVER falls back to English — fails loudly if the API errors.
 *
 * Batch strategy: groups ~30 keys per API call (JSON in, JSON out), one batch
 * per locale. ~100x cheaper round-trips vs per-key calls.
 *
 * Requires ANTHROPIC_API_KEY (from .env.local). Run: node scripts/i18n-translate-claude.js
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const DICT_DIR = path.join(ROOT, "src", "dictionaries");
const GLOSSARY_FILE = path.join(__dirname, "i18n-glossary.json");
const MODEL = "claude-haiku-4-5-20251001";
const BATCH_SIZE = 25; // keys per API call — balances context, quality, cost

// ─── Locale → human-readable name (what Claude understands best) ───────
const LOCALE_NAMES = {
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

// ─── Env loader (same as DeepL script) ─────────────────────────────────

function loadEnvLocal() {
  const envPath = path.join(ROOT, ".env.local");
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
    // Override empty env vars (bash may pre-seed them empty)
    if (!process.env[key] || process.env[key] === "") process.env[key] = val;
  }
}

// ─── Dict helpers ──────────────────────────────────────────────────────

function loadJson(p) { return JSON.parse(fs.readFileSync(p, "utf8")); }
function writeJson(p, obj) { fs.writeFileSync(p, JSON.stringify(obj, null, 2) + "\n"); }

function leafKeys(obj, prefix = "") {
  const out = [];
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) out.push(...leafKeys(v, key));
    else out.push(key);
  }
  return out;
}

function getByPath(obj, dotted) {
  return dotted.split(".").reduce((acc, k) => (acc == null ? undefined : acc[k]), obj);
}

function setByPath(obj, dotted, value) {
  const parts = dotted.split(".");
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const k = parts[i];
    if (cur[k] == null || typeof cur[k] !== "object") cur[k] = {};
    cur = cur[k];
  }
  cur[parts[parts.length - 1]] = value;
}

function discoverLocales() {
  return fs.readdirSync(DICT_DIR).filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, ""));
}

// ─── Placeholder handling ──────────────────────────────────────────────

const PLACEHOLDER_RE = /\{([a-zA-Z][a-zA-Z0-9_]*)\}/g;

function countPlaceholders(s) {
  const found = [];
  let m;
  const re = new RegExp(PLACEHOLDER_RE);
  while ((m = re.exec(s)) !== null) found.push(m[1]);
  return found.sort();
}

function placeholdersMatch(a, b) {
  const pa = countPlaceholders(a);
  const pb = countPlaceholders(b);
  return pa.length === pb.length && pa.every((v, i) => v === pb[i]);
}

// ─── Anthropic client ──────────────────────────────────────────────────

let client = null;

async function initAnthropic() {
  loadEnvLocal();
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("✗ ANTHROPIC_API_KEY is not set in .env.local. Cannot translate.");
    process.exit(2);
  }
  const Anthropic = (await import("@anthropic-ai/sdk")).default;
  client = new Anthropic({ apiKey });
}

// ─── Translation batch call ────────────────────────────────────────────

/**
 * Translate a batch of {key: englishText} into the target locale.
 * Returns {key: translatedText}.
 */
async function translateBatch(batch, targetLocale, glossaryTerms) {
  const localeName = LOCALE_NAMES[targetLocale];
  if (!localeName) throw new Error(`Unknown locale: ${targetLocale}`);

  const glossaryList = [...glossaryTerms].join(", ");

  const systemPrompt = `You are a professional translator specializing in EU regulatory and technology content for compliance professionals (DPOs, CISOs, procurement leads).

You translate from English to ${localeName}.

STRICT RULES:
1. Output ONLY a valid JSON object mapping keys to translated strings. No preamble, no markdown fences, no commentary.
2. Preserve {placeholder} tokens EXACTLY — do not translate, reorder the name, or remove them.
3. Keep these terms in English verbatim (brand names, acronyms, legal references): ${glossaryList}.
4. Preserve Markdown formatting (**bold**, *italic*, [link text](url), \`code\`, lists, newlines).
5. Match the register of the source: professional, concise, trustworthy. Not marketing-speak.
6. For very short UI strings (buttons, labels), use the standard localized UI term a native user expects (e.g., "Sign in" → "Se connecter" in French, not a literal translation).
7. Keep capitalization conventions of the target language (German nouns capitalized, etc.).
8. If a value is a single brand/acronym from the glossary, return it unchanged.`;

  const userPrompt = `Translate the values of this JSON object into ${localeName}. Return a JSON object with the same keys and translated string values.

${JSON.stringify(batch, null, 2)}`;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 8000,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const text = response.content.map((b) => (b.type === "text" ? b.text : "")).join("").trim();

  // Strip markdown fences if the model adds them despite instruction
  let jsonStr = text;
  const fence = text.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  if (fence) jsonStr = fence[1];

  let parsed;
  try {
    parsed = JSON.parse(jsonStr);
  } catch (err) {
    throw new Error(`Claude returned invalid JSON for ${targetLocale}: ${err.message}\nRaw: ${text.slice(0, 500)}`);
  }

  // Validate: every key in batch must be present, placeholder parity preserved
  const errors = [];
  for (const key of Object.keys(batch)) {
    if (!(key in parsed)) {
      errors.push(`missing key: ${key}`);
      continue;
    }
    if (typeof parsed[key] !== "string") {
      errors.push(`non-string value for ${key}: ${typeof parsed[key]}`);
      continue;
    }
    if (!placeholdersMatch(batch[key], parsed[key])) {
      errors.push(
        `placeholder mismatch for ${key}: EN=${JSON.stringify(countPlaceholders(batch[key]))} vs ${targetLocale}=${JSON.stringify(countPlaceholders(parsed[key]))}`
      );
    }
  }
  if (errors.length > 0) {
    throw new Error(`Validation failed for ${targetLocale}:\n  ` + errors.slice(0, 5).join("\n  "));
  }

  return {
    translations: parsed,
    usage: response.usage,
  };
}

// ─── Dictionary backfill ───────────────────────────────────────────────

async function backfillLocale(locale, en, glossaryTerms, { force = false } = {}) {
  const dictPath = path.join(DICT_DIR, `${locale}.json`);
  const dict = fs.existsSync(dictPath) ? loadJson(dictPath) : {};
  const keys = leafKeys(en);

  // Decide which keys need translation
  const toTranslate = {};
  for (const key of keys) {
    const enVal = getByPath(en, key);
    if (typeof enVal !== "string") continue;
    if (!enVal.trim()) continue;
    // Whole string is a glossary term → keep in English
    if (glossaryTerms.has(enVal.trim())) {
      setByPath(dict, key, enVal);
      continue;
    }
    const current = getByPath(dict, key);
    const needsFill = force ||
      current === undefined ||
      current === null ||
      (typeof current === "string" && (current.trim() === "" || current === enVal));
    if (needsFill) toTranslate[key] = enVal;
  }

  const total = Object.keys(toTranslate).length;
  if (total === 0) {
    console.log(`  [${locale}] already complete`);
    return { translated: 0, inputTokens: 0, outputTokens: 0 };
  }

  process.stdout.write(`  [${locale}] translating ${total} keys`);

  let translated = 0;
  let inputTokens = 0;
  let outputTokens = 0;
  const entries = Object.entries(toTranslate);

  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    const slice = entries.slice(i, i + BATCH_SIZE);
    const batch = Object.fromEntries(slice);
    try {
      const { translations, usage } = await translateBatch(batch, locale, glossaryTerms);
      for (const [k, v] of Object.entries(translations)) {
        setByPath(dict, k, v);
        translated++;
      }
      inputTokens += usage.input_tokens;
      outputTokens += usage.output_tokens;
      process.stdout.write(".");
    } catch (err) {
      console.error(`\n  [${locale}] batch failed at offset ${i}: ${err.message}`);
      // Save whatever we have so far, then rethrow to halt
      writeJson(dictPath, dict);
      throw err;
    }
  }

  writeJson(dictPath, dict);
  console.log(` ✓ ${translated} translated (in=${inputTokens} out=${outputTokens} tokens)`);
  return { translated, inputTokens, outputTokens };
}

// ─── Main ──────────────────────────────────────────────────────────────

async function main() {
  await initAnthropic();

  const force = process.argv.includes("--force");
  const singleLocale = process.argv.find((a) => a.startsWith("--locale="))?.split("=")[1];

  const glossary = fs.existsSync(GLOSSARY_FILE) ? loadJson(GLOSSARY_FILE) : { doNotTranslate: [] };
  const glossaryTerms = new Set(glossary.doNotTranslate || []);

  const en = loadJson(path.join(DICT_DIR, "en.json"));
  let targetLocales = discoverLocales().filter((l) => l !== "en");
  if (singleLocale) targetLocales = targetLocales.filter((l) => l === singleLocale);

  console.log(`Model: ${MODEL}`);
  console.log(`Batch size: ${BATCH_SIZE} keys`);
  console.log(`Force re-translate: ${force}`);
  console.log(`Target locales (${targetLocales.length}): ${targetLocales.join(", ")}\n`);

  let totalTranslated = 0;
  let totalIn = 0;
  let totalOut = 0;

  for (const locale of targetLocales) {
    const { translated, inputTokens, outputTokens } = await backfillLocale(locale, en, glossaryTerms, { force });
    totalTranslated += translated;
    totalIn += inputTokens;
    totalOut += outputTokens;
  }

  // Haiku 4.5 pricing: $1/M input, $5/M output (round)
  const costUsd = (totalIn / 1e6) * 1 + (totalOut / 1e6) * 5;
  console.log(`\n─────────────────────────────────────────`);
  console.log(`Done. Translated ${totalTranslated} keys across ${targetLocales.length} locales.`);
  console.log(`Tokens: input=${totalIn}, output=${totalOut}`);
  console.log(`Approx cost: $${costUsd.toFixed(3)}`);
}

main().catch((err) => {
  console.error("\n✗ i18n-translate-claude failed:", err.message || err);
  process.exit(1);
});
