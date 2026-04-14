<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Publishing Workflow: Translation Gate

> **Core rule** — Every page, every feature, every piece of content MUST be published in ALL 14 supported locales simultaneously. Content is NOT published in English if it isn't published in every other language.

Enforcement is automated. The gate runs as `prebuild` (blocking local builds) and in `.github/workflows/i18n.yml` (blocking PR merges).

### Commands

- `npm run i18n:check` — validate translations. Exits 0 if clean, 1 on errors.
- `npm run i18n:translate` — backfill missing translations via DeepL. Requires `DEEPL_API_KEY` in `.env.local`.
- `node scripts/i18n-translate.js --fallback` — emergency stop-gap: copies English as placeholders when no API key is available (marks strings as untranslated in the check output). Follow up with a real DeepL backfill.

### Rules enforced

| Rule | Severity | What it catches |
| --- | --- | --- |
| `dictionary:missing-key` | error | Key exists in `en.json` but is absent in another locale. |
| `dictionary:empty` | error | Value is empty/whitespace. |
| `dictionary:placeholders` | error | `{token}` placeholders differ between en and translation. |
| `dictionary:missing-file` | error | A locale JSON file is missing. |
| `reports:missing-locale` / `:missing-slug` | error | `src/data/reports/{locale}.json` is missing a report present in `en.json`. |
| `metadata:hardcoded` | error | A priority page uses `export const metadata = {...}` with string literals instead of `generateMetadata({ params })` pulling from the dictionary. |
| `jsx:hardcoded-english` | error | A scanned file has a JSX text node with 3+ English words not wrapped in `t()`. |
| `dictionary:untranslated` | warning | Value is identical to English (likely needs DeepL). Does not block the build. |
| `dictionary:extra-key` | warning | Locale has a key not in `en.json`. |

### How to add a new UI string

1. Edit `src/dictionaries/en.json` — add the new key.
2. Use it in the component: `t("section.key")` (client) or pull from `getDictionary(locale)` (server).
3. `npm run i18n:translate` — DeepL fills the 13 other locales.
4. `npm run i18n:check` — confirm clean.
5. Commit **all 14 dictionary files together**.

If you're adding a string to a component or page that the JSX detector scans (`scripts/i18n-scan-paths.txt`), wrapping it in `t()` is mandatory — hardcoded JSX will fail the gate.

### How to add a new page

1. Use `generateMetadata({ params })` (not `export const metadata`) and pull from the dictionary via `getPageMetadata(locale, pageKey)` in `src/lib/i18n.ts`.
2. Add `meta.<pageKey>.title` and `meta.<pageKey>.description` to `en.json`.
3. If the page is prominent (home, database, pricing, about, etc.), add the path to `PRIORITY_METADATA_PAGES` in `scripts/i18n-check.js`.
4. For rendered UI, route every string through `t()` — no hardcoded JSX text.
5. Run backfill and commit all locales.

### How to add a new report

1. Edit `src/data/reports/en.json` — add the new entry.
2. `npm run i18n:translate` — DeepL generates all locale versions with `autoTranslated: true`.
3. The report detail page displays a "pending human review" banner for auto-translated content automatically.

### Glossary — `scripts/i18n-glossary.json`

Terms that should **never** be translated (brand names, acronyms, legal references the EU uses verbatim). Values equal to glossary terms are:
- not flagged as `dictionary:untranslated`
- protected during DeepL translation (wrapped in `<x>` ignore-tags)

Add terms only when you're sure they should stay in English across all 14 locales.

### Scan scope — `scripts/i18n-scan-paths.txt`

The JSX hardcoded-English detector scans only the paths listed here. It starts narrow (layout components) and expands page-by-page once the legacy English strings on each page have been moved to the dictionary. Adding a new path to the scan list without triaging its hardcoded strings will block the build.

### Allowlist — `scripts/i18n-allowlist.txt`

For rare JSX strings that must stay literal (e.g., intentional proper-noun mentions, debug strings). Prefer `t()` — target is under 50 allowlist entries total.

### Scope notes

Out of the gate's scope, for now:
- **Admin UI** (`src/app/admin/**`) — internal-only, English is acceptable.
- **API JSON payloads** (`src/app/api/**`) — data endpoints, not content.
- **AI-generated content** (business case, podium, RFP, chatbot) — locale-aware prompting is a separate workstream.
- **Seed data** (`src/data/seed-*.ts`) — flows through `translateContent()` via admin save.

### Follow-up translation debt

The initial rollout focuses on shared components, priority page metadata, and the reports pipeline. Individual page bodies (pricing, about, methodology, reports, regulations, industries, etc.) still contain ~20+ hardcoded English JSX strings that will need migration to `t()` before their paths are added to `i18n-scan-paths.txt`. Track in TODO.md.
