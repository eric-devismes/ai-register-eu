#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * i18n-translate — Backfills dictionary + report translations via DeepL.
 *
 * For each target locale:
 *   - Dictionary: fills keys that are missing, empty, or English-identical.
 *   - Reports: regenerates src/data/reports/{locale}.json from en.json when
 *     slugs are missing (does NOT overwrite existing translations).
 *
 * Honors scripts/i18n-glossary.json (do-not-translate terms).
 * Idempotent: re-running produces no diff when everything is already translated.
 *
 * Requires DEEPL_API_KEY in environment (loaded from .env.local).
 * Run: node scripts/i18n-translate.js
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const DICT_DIR = path.join(ROOT, "src", "dictionaries");
const REPORTS_DIR = path.join(ROOT, "src", "data", "reports");
const GLOSSARY_FILE = path.join(__dirname, "i18n-glossary.json");

// Load .env.local if present (simple parser, no new dep)
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
    if (!process.env[key]) process.env[key] = val;
  }
}

// ─── Locale mapping — keep in sync with src/lib/i18n.ts ──────────────
const DEEPL_LOCALE_MAP = {
  en: "EN-GB",
  fr: "FR",
  de: "DE",
  es: "ES",
  it: "IT",
  nl: "NL",
  pl: "PL",
  ro: "RO",
  pt: "PT-PT",
  cs: "CS",
  el: "EL",
  hu: "HU",
  sv: "SV",
  bg: "BG",
};

// ─── Helpers ─────────────────────────────────────────────────────────

function loadJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function writeJson(p, obj) {
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + "\n");
}

function discoverLocales() {
  return fs
    .readdirSync(DICT_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""));
}

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

// ─── DeepL client ────────────────────────────────────────────────────

let translator = null;
let FALLBACK_MODE = false; // true when no DEEPL_API_KEY — copies English as stub

async function initDeepL() {
  loadEnvLocal();
  const apiKey = process.env.DEEPL_API_KEY;
  const wantFallback = process.argv.includes("--fallback");
  if (!apiKey && !wantFallback) {
    console.error(
      "\u2717 DEEPL_API_KEY is not set. Either set it in .env.local, or\n" +
        "  run `node scripts/i18n-translate.js --fallback` to fill missing\n" +
        "  keys with English placeholders (unblocks the build; quality\n" +
        "  follow-up required).",
    );
    process.exit(2);
  }
  if (!apiKey) {
    FALLBACK_MODE = true;
    console.log("⚠ No DEEPL_API_KEY — running in FALLBACK mode (English placeholders).\n");
    return;
  }
  const { Translator } = await import("deepl-node");
  translator = new Translator(apiKey);
}

/**
 * Translate a single string.
 * Protects {placeholder} tokens via DeepL's tagHandling (XML-like mode).
 */
async function translateString(text, targetLang, glossaryTerms) {
  if (!text || !text.trim()) return text;
  if (FALLBACK_MODE) return text; // English placeholder
  // Skip translation if the entire text matches a glossary term
  if (glossaryTerms.has(text.trim())) return text;

  // Wrap placeholders in <x> tags so DeepL doesn't translate them
  let prepared = text.replace(
    /\{([a-zA-Z][a-zA-Z0-9_]*)\}/g,
    (_m, name) => `<x id="${name}">{${name}}</x>`
  );
  // Protect glossary terms as ignored spans
  for (const term of glossaryTerms) {
    if (term.length < 2) continue;
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    prepared = prepared.replace(
      new RegExp(`\\b${escaped}\\b`, "g"),
      `<x>${term}</x>`
    );
  }

  const result = await translator.translateText(prepared, "en", targetLang, {
    tagHandling: "xml",
    ignoreTags: ["x"],
  });
  const translated = Array.isArray(result) ? result[0].text : result.text;
  // Strip the <x> wrappers
  return translated.replace(/<x(?:\s+id="[^"]*")?>([^<]*)<\/x>/g, "$1");
}

// ─── Dictionary backfill ─────────────────────────────────────────────

async function backfillDictionary(locale, en, glossaryTerms) {
  const deeplLang = DEEPL_LOCALE_MAP[locale];
  if (!deeplLang) {
    console.warn(`  [warn] No DeepL mapping for "${locale}", skipping`);
    return 0;
  }
  const dictPath = path.join(DICT_DIR, `${locale}.json`);
  const dict = fs.existsSync(dictPath) ? loadJson(dictPath) : {};
  const keys = leafKeys(en);
  let translated = 0;

  for (const key of keys) {
    const enVal = getByPath(en, key);
    if (typeof enVal !== "string") continue;
    const current = getByPath(dict, key);
    const needsFill =
      current === undefined ||
      current === null ||
      (typeof current === "string" && (current.trim() === "" || current === enVal)) ;

    if (!needsFill) continue;
    // Don't "translate" glossary-whole strings — keep as English
    if (glossaryTerms.has(enVal.trim())) {
      setByPath(dict, key, enVal);
      continue;
    }
    try {
      const out = await translateString(enVal, deeplLang, glossaryTerms);
      setByPath(dict, key, out);
      translated++;
      if (translated % 20 === 0) process.stdout.write(`.`);
    } catch (err) {
      console.error(`\n  [error] ${locale} ${key}:`, err.message || err);
    }
  }
  writeJson(dictPath, dict);
  return translated;
}

// ─── Reports backfill ────────────────────────────────────────────────

async function backfillReports(locale, enReports, glossaryTerms) {
  if (!fs.existsSync(REPORTS_DIR)) return 0;
  const deeplLang = DEEPL_LOCALE_MAP[locale];
  if (!deeplLang) return 0;
  const outPath = path.join(REPORTS_DIR, `${locale}.json`);
  const existing = fs.existsSync(outPath) ? loadJson(outPath) : [];
  const byslug = new Map(existing.map((r) => [r.slug, r]));
  let translatedCount = 0;
  const out = [];

  for (const report of enReports) {
    if (byslug.has(report.slug)) {
      out.push(byslug.get(report.slug));
      continue;
    }
    // Translate full report
    process.stdout.write(`\n  [${locale}] translating report "${report.slug}"`);
    const tr = { ...report, autoTranslated: true };
    tr.title = await translateString(report.title, deeplLang, glossaryTerms);
    tr.subtitle = await translateString(report.subtitle, deeplLang, glossaryTerms);
    tr.sections = [];
    for (const section of report.sections) {
      const translatedSection = { id: section.id };
      translatedSection.heading = await translateString(
        section.heading,
        deeplLang,
        glossaryTerms
      );
      translatedSection.content = await translateString(
        section.content,
        deeplLang,
        glossaryTerms
      );
      tr.sections.push(translatedSection);
      process.stdout.write(".");
    }
    out.push(tr);
    translatedCount++;
  }
  writeJson(outPath, out);
  return translatedCount;
}

// ─── Main ────────────────────────────────────────────────────────────

async function main() {
  await initDeepL();
  const glossary = fs.existsSync(GLOSSARY_FILE) ? loadJson(GLOSSARY_FILE) : { doNotTranslate: [] };
  const glossaryTerms = new Set(glossary.doNotTranslate || []);

  const en = loadJson(path.join(DICT_DIR, "en.json"));
  const targetLocales = discoverLocales().filter((l) => l !== "en");

  console.log(`Backfilling dictionaries into ${targetLocales.length} locales…\n`);
  for (const locale of targetLocales) {
    process.stdout.write(`  [${locale}] `);
    const n = await backfillDictionary(locale, en, glossaryTerms);
    console.log(` ${n} key${n === 1 ? "" : "s"} translated`);
  }

  // Reports (optional — only if src/data/reports/en.json exists)
  const enReportsPath = path.join(REPORTS_DIR, "en.json");
  if (fs.existsSync(enReportsPath)) {
    console.log(`\nBackfilling reports into ${targetLocales.length} locales…`);
    const enReports = loadJson(enReportsPath);
    for (const locale of targetLocales) {
      const n = await backfillReports(locale, enReports, glossaryTerms);
      if (n > 0) console.log(`\n  [${locale}] ${n} report${n === 1 ? "" : "s"} translated`);
    }
  } else {
    console.log(`\n(Skipping reports backfill: src/data/reports/en.json not found)`);
  }

  console.log("\n\u2713 i18n-translate done");
}

main().catch((err) => {
  console.error("\u2717 i18n-translate failed:", err);
  process.exit(1);
});
