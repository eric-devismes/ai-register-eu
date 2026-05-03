#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * i18n-translate — Backfills dictionary + report translations via Anthropic Claude.
 *
 * For each target locale (fr, de, es, it):
 *   - Dictionary: fills keys that are missing, empty, or English-identical.
 *   - Reports: regenerates src/data/reports/{locale}.json from en.json when
 *     fields are missing or English-identical (does NOT overwrite human edits).
 *
 * Honors scripts/i18n-glossary.json (do-not-translate terms).
 * Idempotent: re-running produces no diff when everything is already translated.
 * Uses prompt caching: the per-locale system prompt (style guide + glossary +
 * worked examples) is cached across batch calls.
 *
 * Requires ANTHROPIC_API_KEY in environment (loaded from .env.local).
 * Run: node scripts/i18n-translate.js
 *
 * Flags:
 *   --locale=fr         Only translate the given locale (default: all targets)
 *   --reports-only      Skip dictionaries
 *   --dicts-only        Skip reports
 *   --dry-run           Show what would change without calling the API
 *   --model=ID          Override model (default: claude-opus-4-7)
 */

const fs = require("fs");
const path = require("path");
const Anthropic = require("@anthropic-ai/sdk").default;

const ROOT = path.join(__dirname, "..");
const DICT_DIR = path.join(ROOT, "src", "dictionaries");
const REPORTS_DIR = path.join(ROOT, "src", "data", "reports");
const GLOSSARY_FILE = path.join(__dirname, "i18n-glossary.json");

// Must mirror `activeLocales` in src/lib/i18n.ts
const ACTIVE_LOCALES = ["en", "fr", "de", "es", "it"];
const TARGET_LOCALES = ACTIVE_LOCALES.filter((l) => l !== "en");

const LOCALE_NAMES = {
  fr: "French",
  de: "German",
  es: "Spanish",
  it: "Italian",
};

// ─── .env.local loader ──────────────────────────────────────────────
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
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key] && val) process.env[key] = val;
  }
}

// ─── CLI args ────────────────────────────────────────────────────────
function parseArgs() {
  const args = {
    locales: TARGET_LOCALES,
    reports: true,
    dicts: true,
    dryRun: false,
    model: "claude-opus-4-7",
  };
  for (const a of process.argv.slice(2)) {
    if (a.startsWith("--locale=")) {
      const l = a.slice("--locale=".length);
      if (!TARGET_LOCALES.includes(l)) {
        console.error(`Unknown locale: ${l}. Allowed: ${TARGET_LOCALES.join(", ")}`);
        process.exit(1);
      }
      args.locales = [l];
    } else if (a === "--reports-only") {
      args.dicts = false;
    } else if (a === "--dicts-only") {
      args.reports = false;
    } else if (a === "--dry-run") {
      args.dryRun = true;
    } else if (a.startsWith("--model=")) {
      args.model = a.slice("--model=".length);
    } else if (a === "--fallback") {
      console.error(
        "✗ --fallback is not supported by the Claude-based translator.\n" +
          "  Set ANTHROPIC_API_KEY in .env.local and re-run, or pass --dry-run\n" +
          "  to see what would change.",
      );
      process.exit(1);
    } else {
      console.error(`Unknown flag: ${a}`);
      process.exit(1);
    }
  }
  return args;
}

// ─── JSON helpers ────────────────────────────────────────────────────
function flatten(obj, prefix = "") {
  const out = {};
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const v = obj[key];
    if (v && typeof v === "object" && !Array.isArray(v)) {
      Object.assign(out, flatten(v, fullKey));
    } else {
      out[fullKey] = v;
    }
  }
  return out;
}

function setByPath(obj, dotted, value) {
  const parts = dotted.split(".");
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const k = parts[i];
    if (typeof cur[k] !== "object" || cur[k] === null || Array.isArray(cur[k])) {
      cur[k] = {};
    }
    cur = cur[k];
  }
  cur[parts[parts.length - 1]] = value;
}

function findKeysToTranslate(enFlat, targetFlat, glossarySet) {
  const out = {};
  for (const key of Object.keys(enFlat)) {
    const enVal = enFlat[key];
    if (typeof enVal !== "string" || !enVal.trim()) continue;
    if (glossarySet.has(enVal.trim())) continue; // do-not-translate term
    const tgtVal = targetFlat[key];
    if (typeof tgtVal === "string" && tgtVal.trim() && tgtVal !== enVal) continue; // already translated
    out[key] = enVal;
  }
  return out;
}

// ─── Placeholder validation ──────────────────────────────────────────
function placeholders(s) {
  if (typeof s !== "string") return [];
  return Array.from(new Set(s.match(/\{[a-zA-Z][a-zA-Z0-9_]*\}/g) || [])).sort();
}

function placeholdersMatch(en, tr) {
  return placeholders(en).join("|") === placeholders(tr).join("|");
}

// ─── System prompt builder ───────────────────────────────────────────
//
// Designed to pass the Opus 4.7 prompt-cache minimum (4096 tokens) so the
// glossary + style guide is cached across many batch calls per locale.
// Without that, every batch pays full input cost.

const LOCALE_NOTES = {
  fr: `Use the formal register ("vous", never "tu") throughout. Use European French (français de France), not Canadian French. Match the regulatory vocabulary used by the CNIL and EU institutions in their French publications: "responsable du traitement", "sous-traitant", "personne concernée", "fournisseur" (provider), "déployeur" (deployer), "système d'IA à haut risque", "obligations de transparence". Prefer concise constructions; avoid the over-passive voice common in literal translations from English. Do not capitalize common nouns mid-sentence.`,
  de: `Use formal register ("Sie") throughout. Match the regulatory vocabulary used by the EDSA, BfDI, and German-language EU publications: "Verantwortlicher" (controller), "Auftragsverarbeiter" (processor), "betroffene Person" (data subject), "Anbieter" (provider), "Betreiber" (deployer), "Hochrisiko-KI-System", "Transparenzpflichten". Prefer compound nouns where natural in German; avoid Anglicisms when a clear German equivalent exists. Capitalize all common nouns (German rule). Do not anglicize spellings ("Compliance" can stay; "Plattform" not "Platform").`,
  es: `Use formal register ("usted") throughout. Use European Spanish (español de España), not Latin American variants. Match the regulatory vocabulary used by the AEPD and Spanish-language EU institutions: "responsable del tratamiento", "encargado del tratamiento", "interesado", "proveedor" (provider), "responsable del despliegue" (deployer), "sistema de IA de alto riesgo", "obligaciones de transparencia". Use Iberian conventions (formal "usted", not "ustedes" for impersonal addresses).`,
  it: `Use formal register ("Lei") throughout. Match the regulatory vocabulary used by the Garante and Italian-language EU institutions: "titolare del trattamento", "responsabile del trattamento", "interessato", "fornitore" (provider), "operatore" / "deployer" (deployer), "sistema di IA ad alto rischio", "obblighi di trasparenza". Italian regulatory texts often retain English terms in parentheses for technical concepts — use sparingly, only where the Italian equivalent is genuinely ambiguous.`,
};

const EXAMPLES = {
  fr: [
    ['"Browse AI Database"', '"Explorer la base de données IA"'],
    [
      '"We will email {email} when your report is ready."',
      '"Nous enverrons un email à {email} dès que votre rapport sera prêt."',
    ],
    [
      '"Every claim is **sourced** and *dated*."',
      '"Chaque affirmation est **sourcée** et *datée*."',
    ],
    ['"Article 26 deployer obligations"', '"Obligations du déployeur (Article 26)"'],
    [
      '"VendorScope rates AI vendors against the EU AI Act."',
      "\"VendorScope évalue les fournisseurs d'IA au regard de l'EU AI Act.\"",
    ],
  ],
  de: [
    ['"Browse AI Database"', '"KI-Datenbank durchsuchen"'],
    [
      '"We will email {email} when your report is ready."',
      '"Wir senden eine E-Mail an {email}, sobald Ihr Bericht bereit ist."',
    ],
    ['"Every claim is **sourced** and *dated*."', '"Jede Aussage ist **quellenbasiert** und *datiert*."'],
    ['"Article 26 deployer obligations"', '"Pflichten des Betreibers (Artikel 26)"'],
    [
      '"VendorScope rates AI vendors against the EU AI Act."',
      '"VendorScope bewertet KI-Anbieter im Hinblick auf den EU AI Act."',
    ],
  ],
  es: [
    ['"Browse AI Database"', '"Explorar base de datos de IA"'],
    [
      '"We will email {email} when your report is ready."',
      '"Enviaremos un correo a {email} cuando su informe esté listo."',
    ],
    ['"Every claim is **sourced** and *dated*."', '"Cada afirmación está **referenciada** y *fechada*."'],
    [
      '"Article 26 deployer obligations"',
      '"Obligaciones del responsable del despliegue (Artículo 26)"',
    ],
    [
      '"VendorScope rates AI vendors against the EU AI Act."',
      '"VendorScope evalúa proveedores de IA frente al EU AI Act."',
    ],
  ],
  it: [
    ['"Browse AI Database"', '"Esplora database IA"'],
    [
      '"We will email {email} when your report is ready."',
      "\"Invieremo un'email a {email} non appena il rapporto sarà pronto.\"",
    ],
    ['"Every claim is **sourced** and *dated*."', '"Ogni affermazione è **basata su fonti** e *datata*."'],
    ['"Article 26 deployer obligations"', "\"Obblighi dell'operatore (Articolo 26)\""],
    [
      '"VendorScope rates AI vendors against the EU AI Act."',
      "\"VendorScope valuta i fornitori di IA rispetto all'EU AI Act.\"",
    ],
  ],
};

function buildSystemPrompt(locale, glossary) {
  const localeName = LOCALE_NAMES[locale];
  const examples = EXAMPLES[locale]
    .map(([en, tr], i) => `Example ${i + 1}:\n  EN: ${en}\n  ${locale.toUpperCase()}: ${tr}`)
    .join("\n\n");

  return [
    {
      type: "text",
      text: `You are a senior professional translator specialising in EU technology, data protection, and AI regulation. You are translating UI strings, marketing copy, and regulatory content for VendorScope — a B2B intelligence platform that rates AI vendors against EU compliance frameworks (AI Act, GDPR, DORA, NIS2). Your audience: Data Protection Officers, CISOs, procurement leads, and compliance professionals at European mid-cap and CAC 40 enterprises.

# Target language: ${localeName}

${LOCALE_NOTES[locale]}

# General translation rules

1. **Match register and tone.** This is a serious procurement-grade product. The voice is research-firm: incisive, sourced, decisive. Avoid casual phrasing, exclamation marks, hype words ("revolutionary", "game-changing"), and bureaucratese. Mirror the directness of the English source.
2. **Preserve placeholder tokens verbatim.** Tokens like \`{name}\`, \`{count}\`, \`{systemName}\`, \`{lang}\`, \`{date}\` MUST appear unchanged in the translation. Do not translate the inside of the braces. Do not add or remove placeholders. Do not add space inside braces.
3. **Preserve markdown and inline formatting.** \`**bold**\`, \`*italic*\`, \`\`code\`\`, \`[link](url)\`, headings (\`##\`), and HTML tags (\`<strong>\`, \`<em>\`, \`<a>\`) must remain structurally identical. Translate the text content inside them, not the markup.
4. **Preserve URLs, email addresses, file paths, and IDs unchanged.** Same for ISO codes (ISO 27001), regulation numbers (Article 26, Regulation (EU) 2024/1689), and dates in ISO format (2026-08-02).
5. **Use industry-standard regulatory vocabulary.** Where the EU has an official ${localeName} translation of a regulation (AI Act, GDPR, DORA), use the exact terms from the official ${localeName} text — not literal English translations.
6. **Length and density.** Match the source length within ±20%. UI strings (button labels, badges, table headers) MUST stay short — translate "Search" as one word in ${localeName}, not a phrase.
7. **Capitalization.** Follow ${localeName} conventions, not English. Do not capitalize every word in headings — use ${localeName} sentence case where convention requires it.
8. **Numbers and units.** Use ${localeName} number formatting (decimal separator, thousands separator) where it appears in user-facing copy, but leave numbers in tables, IDs, and code unchanged.
9. **No hallucinations.** Translate only what is in the source. Do not add explanations, footnotes, qualifiers, or extra context. If the source is ambiguous, mirror that ambiguity rather than inventing meaning.

# Do-not-translate glossary

These exact terms MUST appear unchanged in the ${localeName} translation. Do not translate them, do not inflect them, do not transliterate them:

${glossary.map((t) => `  - ${t}`).join("\n")}

# Worked examples

These illustrate the style. Use them as reference for register, length, and how to handle placeholders, markdown, and glossary terms — not as direct templates for unrelated strings.

${examples}

# Output format

You will receive a JSON object mapping arbitrary string keys to English source strings. Return ONLY a JSON object with the same keys mapping to ${localeName} translations.

- No preamble, no markdown fences, no explanation, no surrounding prose.
- The first character of your response MUST be \`{\`.
- The last character MUST be \`}\`.
- The set of keys in your output MUST be identical to the input keys — do not add, omit, rename, or reorder beyond what JSON allows.
- Every value MUST be a JSON string. Escape internal quotes and newlines as \\" and \\n.
- If a source string is too short or ambiguous to translate confidently, still produce your best ${localeName} rendering. Never return the English source unchanged unless it is a glossary term.`,
      cache_control: { type: "ephemeral" },
    },
  ];
}

// ─── Claude call (one batch) ─────────────────────────────────────────

// Pull JSON out of a possibly-fenced or possibly-prosey response.
function extractJsonString(text) {
  const trimmed = text.trim();
  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (fence) return fence[1];
  const first = trimmed.indexOf("{");
  const last = trimmed.lastIndexOf("}");
  if (first !== -1 && last > first) return trimmed.slice(first, last + 1);
  return trimmed;
}

async function callClaudeForBatch(client, model, system, messages) {
  const response = await client.messages.create({
    model,
    max_tokens: 16000,
    system,
    messages,
  });
  const text = response.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n");
  return { text, usage: response.usage, content: response.content };
}

async function translateBatch(client, model, sourceObj, systemPrompt) {
  const userMsg = `Translate the values in the following JSON object. Return only the JSON object with the same keys. Make sure every internal double-quote inside a translated string is escaped as \\" and every newline as \\n — the response must be valid JSON.\n\n${JSON.stringify(sourceObj, null, 2)}`;

  const messages = [{ role: "user", content: userMsg }];

  // First attempt
  const first = await callClaudeForBatch(client, model, systemPrompt, messages);
  const totalUsage = { ...first.usage };
  const jsonStr1 = extractJsonString(first.text);
  let parsed = null;
  let parseErr = null;
  try {
    parsed = JSON.parse(jsonStr1);
  } catch (e) {
    parseErr = e;
  }

  // Retry once with the bad output as feedback
  if (!parsed) {
    console.log(
      `      [retry] JSON parse failed (${parseErr.message}). Asking the model to fix its previous response.`,
    );
    const retryMessages = [
      ...messages,
      { role: "assistant", content: first.content },
      {
        role: "user",
        content: `Your previous response was not valid JSON. Specifically: ${parseErr.message}\n\nReturn the same translations again, but as a strictly-valid JSON object. Escape every internal " as \\" and every newline as \\n. No prose, no markdown fences — just the JSON object starting with { and ending with }.`,
      },
    ];
    const retry = await callClaudeForBatch(client, model, systemPrompt, retryMessages);
    totalUsage.input_tokens += retry.usage.input_tokens || 0;
    totalUsage.output_tokens += retry.usage.output_tokens || 0;
    totalUsage.cache_creation_input_tokens += retry.usage.cache_creation_input_tokens || 0;
    totalUsage.cache_read_input_tokens += retry.usage.cache_read_input_tokens || 0;

    try {
      parsed = JSON.parse(extractJsonString(retry.text));
    } catch (e2) {
      // Both attempts failed — fall back to English placeholders for this batch
      // so the run continues and the user can re-run later.
      console.log(
        `      [fallback] Retry also produced invalid JSON (${e2.message}). Keeping English placeholders for this batch.`,
      );
      parsed = { ...sourceObj }; // English fallback
    }
  }

  return { translations: parsed, usage: totalUsage };
}

// ─── Validate translated batch ───────────────────────────────────────
function validateBatch(source, translations, glossarySet) {
  const issues = [];
  const fixed = {};
  for (const key of Object.keys(source)) {
    const en = source[key];
    const tr = translations[key];
    if (typeof tr !== "string") {
      issues.push(`  [${key}] missing or non-string in response — keeping English source`);
      fixed[key] = en;
      continue;
    }
    if (!placeholdersMatch(en, tr)) {
      issues.push(
        `  [${key}] placeholder mismatch (en: ${JSON.stringify(placeholders(en))}, tr: ${JSON.stringify(placeholders(tr))}) — keeping English source`,
      );
      fixed[key] = en;
      continue;
    }
    fixed[key] = tr;
    // Glossary whole-word presence check (warning only — doesn't reject)
    for (const term of glossarySet) {
      if (typeof term !== "string" || term.length < 3) continue;
      const re = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`);
      if (re.test(en) && !tr.includes(term)) {
        issues.push(`  [${key}] glossary term "${term}" missing in translation`);
        break;
      }
    }
  }
  return { fixed, issues };
}

// ─── Dictionary translation ──────────────────────────────────────────
async function translateDictionary(client, model, locale, enDict, glossarySet, dryRun) {
  const targetPath = path.join(DICT_DIR, `${locale}.json`);
  const targetDict = fs.existsSync(targetPath)
    ? JSON.parse(fs.readFileSync(targetPath, "utf8"))
    : {};

  const enFlat = flatten(enDict);
  const targetFlat = flatten(targetDict);
  const toTranslate = findKeysToTranslate(enFlat, targetFlat, glossarySet);
  const keys = Object.keys(toTranslate);

  if (keys.length === 0) {
    console.log(`  [${locale}] dictionary up to date.`);
    return { count: 0, usage: emptyUsage() };
  }

  console.log(`  [${locale}] ${keys.length} dictionary keys to translate...`);
  if (dryRun) return { count: keys.length, usage: emptyUsage() };

  const systemPrompt = buildSystemPrompt(locale, Array.from(glossarySet));

  const BATCH_SIZE = 40;
  const totalUsage = emptyUsage();
  let translated = 0;

  for (let i = 0; i < keys.length; i += BATCH_SIZE) {
    const slice = keys.slice(i, i + BATCH_SIZE);
    const chunk = Object.fromEntries(slice.map((k) => [k, toTranslate[k]]));
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(keys.length / BATCH_SIZE);

    process.stdout.write(`    [${locale}] dict batch ${batchNum}/${totalBatches} (${slice.length} keys)...`);

    const { translations, usage } = await translateBatch(client, model, chunk, systemPrompt);
    addUsage(totalUsage, usage);

    const { fixed, issues } = validateBatch(chunk, translations, glossarySet);
    for (const key of Object.keys(fixed)) {
      setByPath(targetDict, key, fixed[key]);
      translated += 1;
    }

    process.stdout.write(
      ` cache_read=${usage.cache_read_input_tokens || 0}, create=${usage.cache_creation_input_tokens || 0}, in=${usage.input_tokens}, out=${usage.output_tokens}\n`,
    );
    for (const issue of issues) console.log(issue);

    // Persist progressively so a mid-run failure doesn't lose work
    fs.writeFileSync(targetPath, JSON.stringify(targetDict, null, 2) + "\n");
  }

  return { count: translated, usage: totalUsage };
}

// ─── Reports translation ─────────────────────────────────────────────
const REPORT_TRANSLATABLE_FIELDS = ["title", "subtitle", "readingTime"];
const SECTION_TRANSLATABLE_FIELDS = ["heading", "content"];

function collectReportKeys(enReports, targetReports, glossarySet) {
  const sourceMap = {};
  const targetBySlug = new Map(targetReports.map((r) => [r.slug, r]));

  for (const enReport of enReports) {
    const tgtReport = targetBySlug.get(enReport.slug);

    for (const field of REPORT_TRANSLATABLE_FIELDS) {
      const enVal = enReport[field];
      if (typeof enVal !== "string" || !enVal.trim()) continue;
      if (glossarySet.has(enVal.trim())) continue;
      const tgtVal = tgtReport ? tgtReport[field] : undefined;
      if (typeof tgtVal === "string" && tgtVal.trim() && tgtVal !== enVal) continue;
      sourceMap[`${enReport.slug}::report::${field}`] = enVal;
    }

    if (Array.isArray(enReport.sections)) {
      for (const enSec of enReport.sections) {
        const tgtSec =
          tgtReport && Array.isArray(tgtReport.sections)
            ? tgtReport.sections.find((s) => s && s.id === enSec.id)
            : undefined;
        for (const field of SECTION_TRANSLATABLE_FIELDS) {
          const enVal = enSec[field];
          if (typeof enVal !== "string" || !enVal.trim()) continue;
          if (glossarySet.has(enVal.trim())) continue;
          const tgtVal = tgtSec ? tgtSec[field] : undefined;
          if (typeof tgtVal === "string" && tgtVal.trim() && tgtVal !== enVal) continue;
          sourceMap[`${enReport.slug}::section::${enSec.id}::${field}`] = enVal;
        }
      }
    }
  }
  return sourceMap;
}

function applyReportTranslations(enReports, targetReports, translations) {
  const targetBySlug = new Map(targetReports.map((r) => [r.slug, r]));
  const result = [];

  for (const enReport of enReports) {
    let out = targetBySlug.get(enReport.slug);
    if (!out) {
      out = { ...enReport, autoTranslated: true };
      if (Array.isArray(enReport.sections)) {
        out.sections = enReport.sections.map((s) => ({ ...s }));
      }
    } else {
      // Keep stable fields in sync with en
      out.slug = enReport.slug;
      out.category = enReport.category;
      out.date = enReport.date;
      out.author = enReport.author;
      // Reconcile sections array, preserving existing translations
      if (Array.isArray(enReport.sections)) {
        const tgtBySecId = new Map(
          (Array.isArray(out.sections) ? out.sections : []).map((s) => [s.id, s]),
        );
        out.sections = enReport.sections.map((enSec) => tgtBySecId.get(enSec.id) || { ...enSec });
      }
      // Mark as auto-translated unless a human edited it (heuristic: if it was
      // already flagged, keep the flag; if not, set to true since we touched it)
      if (out.autoTranslated === undefined) out.autoTranslated = true;
    }

    for (const field of REPORT_TRANSLATABLE_FIELDS) {
      const k = `${enReport.slug}::report::${field}`;
      if (k in translations) out[field] = translations[k];
    }
    if (Array.isArray(out.sections)) {
      for (const sec of out.sections) {
        for (const field of SECTION_TRANSLATABLE_FIELDS) {
          const k = `${enReport.slug}::section::${sec.id}::${field}`;
          if (k in translations) sec[field] = translations[k];
        }
      }
    }

    result.push(out);
  }
  return result;
}

async function translateReports(client, model, locale, enReports, glossarySet, dryRun) {
  const targetPath = path.join(REPORTS_DIR, `${locale}.json`);
  const targetReports = fs.existsSync(targetPath)
    ? JSON.parse(fs.readFileSync(targetPath, "utf8"))
    : [];

  const sourceMap = collectReportKeys(enReports, targetReports, glossarySet);
  const keys = Object.keys(sourceMap);

  if (keys.length === 0) {
    console.log(`  [${locale}] reports up to date.`);
    return { count: 0, usage: emptyUsage() };
  }

  console.log(`  [${locale}] ${keys.length} report fields to translate...`);
  if (dryRun) return { count: keys.length, usage: emptyUsage() };

  const systemPrompt = buildSystemPrompt(locale, Array.from(glossarySet));

  // Section content is large (some sections > 3K tokens). Smaller batches.
  const BATCH_SIZE = 6;
  const totalUsage = emptyUsage();
  const allTranslations = {};

  for (let i = 0; i < keys.length; i += BATCH_SIZE) {
    const slice = keys.slice(i, i + BATCH_SIZE);
    const chunk = Object.fromEntries(slice.map((k) => [k, sourceMap[k]]));
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(keys.length / BATCH_SIZE);

    process.stdout.write(
      `    [${locale}] report batch ${batchNum}/${totalBatches} (${slice.length} fields)...`,
    );

    const { translations, usage } = await translateBatch(client, model, chunk, systemPrompt);
    addUsage(totalUsage, usage);

    const { fixed, issues } = validateBatch(chunk, translations, glossarySet);
    Object.assign(allTranslations, fixed);

    process.stdout.write(
      ` cache_read=${usage.cache_read_input_tokens || 0}, create=${usage.cache_creation_input_tokens || 0}, in=${usage.input_tokens}, out=${usage.output_tokens}\n`,
    );
    for (const issue of issues) console.log(issue);

    // Persist progressively
    const merged = applyReportTranslations(enReports, targetReports, allTranslations);
    fs.writeFileSync(targetPath, JSON.stringify(merged, null, 2) + "\n");
  }

  return { count: keys.length, usage: totalUsage };
}

// ─── Usage helpers ───────────────────────────────────────────────────
function emptyUsage() {
  return {
    input_tokens: 0,
    output_tokens: 0,
    cache_creation_input_tokens: 0,
    cache_read_input_tokens: 0,
  };
}

function addUsage(acc, u) {
  acc.input_tokens += u.input_tokens || 0;
  acc.output_tokens += u.output_tokens || 0;
  acc.cache_creation_input_tokens += u.cache_creation_input_tokens || 0;
  acc.cache_read_input_tokens += u.cache_read_input_tokens || 0;
}

function estimateCost(usage, model) {
  const PRICES = {
    "claude-opus-4-7": { input: 5, output: 25 },
    "claude-opus-4-6": { input: 5, output: 25 },
    "claude-sonnet-4-6": { input: 3, output: 15 },
    "claude-haiku-4-5": { input: 1, output: 5 },
  };
  const p = PRICES[model] || PRICES["claude-opus-4-7"];
  return (
    (usage.input_tokens * p.input) / 1_000_000 +
    (usage.cache_creation_input_tokens * p.input * 1.25) / 1_000_000 +
    (usage.cache_read_input_tokens * p.input * 0.1) / 1_000_000 +
    (usage.output_tokens * p.output) / 1_000_000
  );
}

// ─── Main ────────────────────────────────────────────────────────────
async function main() {
  loadEnvLocal();
  const args = parseArgs();

  if (!process.env.ANTHROPIC_API_KEY && !args.dryRun) {
    console.error(
      "✗ ANTHROPIC_API_KEY is not set. Add it to .env.local or export it,\n" +
        "  or run with --dry-run to see what would be translated.",
    );
    process.exit(1);
  }

  if (!fs.existsSync(GLOSSARY_FILE)) {
    console.error(`✗ Missing glossary at ${GLOSSARY_FILE}`);
    process.exit(1);
  }
  const glossary = JSON.parse(fs.readFileSync(GLOSSARY_FILE, "utf8"));
  const glossarySet = new Set(glossary.doNotTranslate || []);

  const enDictPath = path.join(DICT_DIR, "en.json");
  if (!fs.existsSync(enDictPath)) {
    console.error("✗ Missing src/dictionaries/en.json (source of truth)");
    process.exit(1);
  }
  const enDict = JSON.parse(fs.readFileSync(enDictPath, "utf8"));

  const enReportsPath = path.join(REPORTS_DIR, "en.json");
  const enReports = fs.existsSync(enReportsPath)
    ? JSON.parse(fs.readFileSync(enReportsPath, "utf8"))
    : null;

  const client = args.dryRun ? null : new Anthropic();
  const totalUsage = emptyUsage();
  let totalCount = 0;

  console.log(`\nUsing model: ${args.model}`);
  console.log(`Locales: ${args.locales.join(", ")}`);
  console.log(`Glossary terms: ${glossarySet.size}`);
  if (args.dryRun) console.log(`(dry-run mode — no API calls)`);

  if (args.dicts) {
    console.log(`\n=== Translating dictionaries ===`);
    for (const locale of args.locales) {
      const { count, usage } = await translateDictionary(
        client,
        args.model,
        locale,
        enDict,
        glossarySet,
        args.dryRun,
      );
      totalCount += count;
      addUsage(totalUsage, usage);
    }
  }

  if (args.reports && enReports) {
    console.log(`\n=== Translating reports ===`);
    for (const locale of args.locales) {
      const { count, usage } = await translateReports(
        client,
        args.model,
        locale,
        enReports,
        glossarySet,
        args.dryRun,
      );
      totalCount += count;
      addUsage(totalUsage, usage);
    }
  } else if (args.reports && !enReports) {
    console.log(`\n(Skipping reports: src/data/reports/en.json not found)`);
  }

  console.log(`\n=== Done ===`);
  console.log(`Translated: ${totalCount} fields/keys`);
  if (!args.dryRun) {
    console.log(
      `Tokens — input: ${totalUsage.input_tokens.toLocaleString()}, ` +
        `cache_create: ${totalUsage.cache_creation_input_tokens.toLocaleString()}, ` +
        `cache_read: ${totalUsage.cache_read_input_tokens.toLocaleString()}, ` +
        `output: ${totalUsage.output_tokens.toLocaleString()}`,
    );
    console.log(`Estimated cost: $${estimateCost(totalUsage, args.model).toFixed(4)}`);

    const totalIn =
      totalUsage.input_tokens +
      totalUsage.cache_creation_input_tokens +
      totalUsage.cache_read_input_tokens;
    if (totalIn > 0) {
      const cacheRate = ((totalUsage.cache_read_input_tokens / totalIn) * 100).toFixed(1);
      console.log(`Cache hit rate: ${cacheRate}% of input tokens`);
    }
  }
  console.log(`✓ i18n-translate done`);
}

main().catch((err) => {
  console.error("\n✗ Translation failed:", err.message);
  if (err instanceof Anthropic.APIError) {
    console.error(`  HTTP ${err.status} ${err.error?.error?.type || ""}`);
  }
  process.exit(1);
});
