#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * i18n-check — Enforces the Publishing Translation Gate.
 *
 * Rules (see AGENTS.md "Publishing Workflow: Translation Gate"):
 *   1. Every leaf key in en.json exists in every other locale dictionary.
 *   2. No empty values.
 *   3. Values identical to English are considered untranslated (allow via glossary).
 *   4. Placeholder tokens ({name}, {count}) match between English and translations.
 *   5. Reports content (src/data/reports/{locale}.json) exists for every locale.
 *   6. Priority pages export generateMetadata (not hardcoded `export const metadata`).
 *   7. JSX text in scanned files must go through t() or be in the allowlist.
 *
 * Run: node scripts/i18n-check.js
 * Exit code 1 on any violation.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const DICT_DIR = path.join(ROOT, "src", "dictionaries");
const REPORTS_DIR = path.join(ROOT, "src", "data", "reports");
const SCAN_PATHS_FILE = path.join(__dirname, "i18n-scan-paths.txt");
const ALLOWLIST_FILE = path.join(__dirname, "i18n-allowlist.txt");
const GLOSSARY_FILE = path.join(__dirname, "i18n-glossary.json");

// Must mirror `activeLocales` in src/lib/i18n.ts.
// Inactive locales keep their .json files on disk but the gate ignores them.
const ACTIVE_LOCALES = ["en", "fr", "de", "es", "it"];

// ─── Helpers ─────────────────────────────────────────────────────────

function loadJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function loadLines(p) {
  if (!fs.existsSync(p)) return [];
  return fs
    .readFileSync(p, "utf8")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"));
}

function discoverLocales() {
  // Only gate active locales. Inactive ones stay on disk but skip the gate —
  // they'd otherwise flag thousands of missing-key errors while paused.
  const onDisk = fs
    .readdirSync(DICT_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""));
  return ACTIVE_LOCALES.filter((l) => onDisk.includes(l)).sort();
}

/** Recursively enumerate leaf key paths (a.b.c) in a nested object. */
function leafKeys(obj, prefix = "") {
  const out = [];
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      out.push(...leafKeys(v, key));
    } else {
      out.push(key);
    }
  }
  return out;
}

function getByPath(obj, dotted) {
  return dotted.split(".").reduce((acc, k) => (acc == null ? undefined : acc[k]), obj);
}

/** Extract {placeholder} tokens (ignores {{…}} doubled, and {0}). */
function placeholders(str) {
  if (typeof str !== "string") return [];
  const matches = str.match(/\{[a-zA-Z][a-zA-Z0-9_]*\}/g) || [];
  return Array.from(new Set(matches)).sort();
}

/** Walk a directory recursively, returning .tsx files. */
function walkTsx(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkTsx(p));
    else if (entry.name.endsWith(".tsx")) out.push(p);
  }
  return out;
}

// ─── Violation tracking ──────────────────────────────────────────────
//
// "error"   — blocks the build (prebuild gate + CI).
// "warning" — prints visibly but does not fail.
//
// Rationale: missing keys, empty values, placeholder mismatches, missing
// metadata, and hardcoded JSX are structural — they can't be fixed by
// DeepL alone. English-identical values flag *quality* (untranslated
// strings) and are warnings so the build can pass while the backfill
// backlog is worked down.

const groups = new Map();
const SEVERITY = {
  "setup": "error",
  "dictionary:missing-file": "error",
  "dictionary:missing-key": "error",
  "dictionary:empty": "error",
  "dictionary:placeholders": "error",
  "dictionary:extra-key": "warning",
  "dictionary:untranslated": "warning",
  "reports:missing-source": "error",
  "reports:missing-locale": "error",
  "reports:missing-slug": "error",
  "metadata:hardcoded": "error",
  "jsx:hardcoded-english": "error",
};

function record(rule, msg) {
  if (!groups.has(rule)) groups.set(rule, []);
  groups.get(rule).push(msg);
}

// ─── Rule 1–4: Dictionary parity ────────────────────────────────────

function checkDictionaries() {
  const glossary = fs.existsSync(GLOSSARY_FILE) ? loadJson(GLOSSARY_FILE) : { doNotTranslate: [] };
  const allowEnglishIdentical = new Set(glossary.doNotTranslate || []);

  const locales = discoverLocales();
  if (!locales.includes("en")) {
    record("setup", "Missing src/dictionaries/en.json (source of truth)");
    return;
  }

  const en = loadJson(path.join(DICT_DIR, "en.json"));
  const enKeys = leafKeys(en);

  for (const locale of locales) {
    if (locale === "en") continue;
    const dictPath = path.join(DICT_DIR, `${locale}.json`);
    if (!fs.existsSync(dictPath)) {
      record("dictionary:missing-file", `${locale}.json does not exist`);
      continue;
    }
    const dict = loadJson(dictPath);

    // Rule 1: key parity
    for (const key of enKeys) {
      const val = getByPath(dict, key);
      if (val === undefined || val === null) {
        record("dictionary:missing-key", `${locale}.json is missing "${key}"`);
        continue;
      }

      // Rule 2: empty values
      if (typeof val === "string" && val.trim() === "") {
        record("dictionary:empty", `${locale}.json "${key}" is empty`);
        continue;
      }

      // Rule 3: English-identical (likely untranslated)
      const enVal = getByPath(en, key);
      if (
        typeof val === "string" &&
        typeof enVal === "string" &&
        val === enVal &&
        !allowEnglishIdentical.has(val) &&
        val.length > 2 &&
        // Skip single-word ALLCAPS acronyms (EU, AI, GDPR, etc.)
        !/^[A-Z0-9\s.&-]+$/.test(val)
      ) {
        record(
          "dictionary:untranslated",
          `${locale}.json "${key}" is identical to English: "${val.slice(0, 60)}${val.length > 60 ? "…" : ""}"`
        );
      }

      // Rule 4: placeholder parity
      if (typeof val === "string" && typeof enVal === "string") {
        const a = placeholders(enVal);
        const b = placeholders(val);
        if (a.join("|") !== b.join("|")) {
          record(
            "dictionary:placeholders",
            `${locale}.json "${key}" placeholders ${JSON.stringify(b)} do not match en ${JSON.stringify(a)}`
          );
        }
      }
    }

    // Extra keys present in locale but not in en — warn (non-blocking currently)
    const localeKeys = leafKeys(dict);
    for (const k of localeKeys) {
      if (!enKeys.includes(k)) {
        record("dictionary:extra-key", `${locale}.json has key "${k}" not present in en.json`);
      }
    }
  }
}

// ─── Rule 5: Reports content parity ─────────────────────────────────

function checkReports() {
  const locales = discoverLocales();
  const enReportPath = path.join(REPORTS_DIR, "en.json");
  if (!fs.existsSync(enReportPath)) {
    record(
      "reports:missing-source",
      `src/data/reports/en.json missing — run restructure step`
    );
    return;
  }
  const en = loadJson(enReportPath);
  const enSlugs = Array.isArray(en) ? en.map((r) => r.slug) : [];

  for (const locale of locales) {
    if (locale === "en") continue;
    const p = path.join(REPORTS_DIR, `${locale}.json`);
    if (!fs.existsSync(p)) {
      record(
        "reports:missing-locale",
        `src/data/reports/${locale}.json missing — run \`npm run i18n:translate\``
      );
      continue;
    }
    const dict = loadJson(p);
    const slugs = Array.isArray(dict) ? dict.map((r) => r.slug) : [];
    for (const slug of enSlugs) {
      if (!slugs.includes(slug)) {
        record(
          "reports:missing-slug",
          `${locale}.json missing report "${slug}"`
        );
      }
    }
  }
}

// ─── Rule 6: Metadata locale-awareness on priority pages ────────────

const PRIORITY_METADATA_PAGES = [
  "src/app/[lang]/page.tsx",
  "src/app/[lang]/database/page.tsx",
  "src/app/[lang]/pricing/page.tsx",
  "src/app/[lang]/about/page.tsx",
  "src/app/[lang]/methodology/page.tsx",
  "src/app/[lang]/reports/page.tsx",
  "src/app/[lang]/regulations/page.tsx",
  "src/app/[lang]/industries/page.tsx",
  "src/app/[lang]/contact/page.tsx",
  "src/app/[lang]/pricing/success/page.tsx",
  "src/app/[lang]/pricing/cancel/page.tsx",
  "src/app/[lang]/ai-act/page.tsx",
];

function checkMetadata() {
  for (const rel of PRIORITY_METADATA_PAGES) {
    const abs = path.join(ROOT, rel);
    if (!fs.existsSync(abs)) continue; // home page has no metadata; fine
    const src = fs.readFileSync(abs, "utf8");
    const hasHardcoded = /export\s+const\s+metadata\s*(?::\s*Metadata)?\s*=/.test(src);
    const hasDynamic = /export\s+async\s+function\s+generateMetadata\s*\(/.test(src);
    if (hasHardcoded && !hasDynamic) {
      record(
        "metadata:hardcoded",
        `${rel} uses \`export const metadata\` — must use \`generateMetadata({ params })\` pulling from dictionary`
      );
    }
  }
}

// ─── Rule 7: JSX hardcoded English (heuristic) ──────────────────────
//
// Scans a curated list of paths (scripts/i18n-scan-paths.txt). Flags
// JSX text content that looks like English prose (3+ words, 15+ chars)
// not wrapped in t(). False positives go into scripts/i18n-allowlist.txt.

function checkHardcodedJsx() {
  const scanPaths = loadLines(SCAN_PATHS_FILE);
  if (scanPaths.length === 0) return;
  const allowlist = new Set(loadLines(ALLOWLIST_FILE));

  const files = [];
  for (const sp of scanPaths) {
    const abs = path.join(ROOT, sp);
    if (!fs.existsSync(abs)) continue;
    const stat = fs.statSync(abs);
    if (stat.isDirectory()) files.push(...walkTsx(abs));
    else if (abs.endsWith(".tsx")) files.push(abs);
  }

  // Matches a JSX text node with 3+ whitespace-separated alphabetic word groups,
  // 15+ chars, no braces (template/expression), no obvious t() call.
  // Example matches: >Upgrade to Pro — EUR 19/month<
  //                  >Click the link to access your account<
  const textNode = />\s*([A-Z][^<>{}\n]{14,})\s*</g;

  for (const abs of files) {
    const rel = path.relative(ROOT, abs);
    const src = fs.readFileSync(abs, "utf8");
    const lines = src.split("\n");
    let match;
    // Reset regex
    textNode.lastIndex = 0;
    while ((match = textNode.exec(src)) !== null) {
      const text = match[1].trim();
      // Skip if allowlisted
      if (allowlist.has(text)) continue;
      // Skip if it's a lone URL, number, or code-like
      if (/^https?:\/\//.test(text)) continue;
      if (/^[\d\s.,/-]+$/.test(text)) continue;
      // Require 3+ word groups (at least 2 spaces between letter runs)
      const wordCount = (text.match(/[A-Za-z][A-Za-z']+/g) || []).length;
      if (wordCount < 3) continue;
      // Find line number
      const offset = match.index;
      let lineNo = 1;
      let consumed = 0;
      for (let i = 0; i < lines.length; i++) {
        consumed += lines[i].length + 1;
        if (consumed > offset) {
          lineNo = i + 1;
          break;
        }
      }
      record(
        "jsx:hardcoded-english",
        `${rel}:${lineNo}  "${text.slice(0, 80)}${text.length > 80 ? "…" : ""}"`
      );
    }
  }
}

// ─── Main ────────────────────────────────────────────────────────────

function main() {
  checkDictionaries();
  checkReports();
  checkMetadata();
  checkHardcodedJsx();

  if (groups.size === 0) {
    console.log("\u2713 i18n-check passed: no violations");
    process.exit(0);
  }

  let errorTotal = 0;
  let warnTotal = 0;
  const RULE_HINTS = {
    "dictionary:missing-key": "Run `npm run i18n:translate` to auto-fill via DeepL.",
    "dictionary:empty": "Run `npm run i18n:translate` to fill empty keys.",
    "dictionary:untranslated": "Run `npm run i18n:translate` or add the term to scripts/i18n-glossary.json.",
    "dictionary:placeholders":
      "Translations must preserve placeholder tokens like {name}, {count} exactly.",
    "dictionary:extra-key":
      "Remove keys from locale dictionaries that are not in en.json, or add them to en.json first.",
    "dictionary:missing-file": "Create the missing dictionary file (run i18n:translate).",
    "reports:missing-source":
      "Move report content into src/data/reports/en.json (see AGENTS.md).",
    "reports:missing-locale": "Run `npm run i18n:translate` to auto-translate reports.",
    "reports:missing-slug": "Re-run `npm run i18n:translate` after adding new reports.",
    "metadata:hardcoded":
      "Convert to `export async function generateMetadata({ params })` and pull title/description from getDictionary(locale).",
    "jsx:hardcoded-english":
      "Wrap the text in t(\"key\"), add the key to en.json, or justify it in scripts/i18n-allowlist.txt.",
    setup: "Setup issue — see message.",
  };

  // Print errors first, warnings after.
  const sortedRules = Array.from(groups.keys()).sort((a, b) => {
    const sa = SEVERITY[a] === "error" ? 0 : 1;
    const sb = SEVERITY[b] === "error" ? 0 : 1;
    return sa - sb;
  });

  console.log("");
  for (const rule of sortedRules) {
    const msgs = groups.get(rule);
    const severity = SEVERITY[rule] || "error";
    const marker = severity === "error" ? "\u2717" : "!";
    console.log(`\n${marker} ${severity.toUpperCase()}  ${rule} (${msgs.length})`);
    if (RULE_HINTS[rule]) console.log(`   hint: ${RULE_HINTS[rule]}`);
    for (const m of msgs.slice(0, 30)) console.log(`   ${m}`);
    if (msgs.length > 30) console.log(`   … and ${msgs.length - 30} more`);
    if (severity === "error") errorTotal += msgs.length;
    else warnTotal += msgs.length;
  }
  console.log(`\n${errorTotal} error(s), ${warnTotal} warning(s)\n`);
  if (errorTotal > 0) {
    console.log("\u2717 i18n-check failed\n");
    process.exit(1);
  }
  console.log("\u2713 i18n-check passed (with warnings)\n");
  process.exit(0);
}

main();
