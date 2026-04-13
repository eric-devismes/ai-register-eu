# QA Bot — Defects Log

> Automatically maintained by the QA Bot scheduled task.
> Runs twice daily (8am, 8pm). Issues are logged, fixed by dev agent, and marked resolved.

---

## 2026-04-13 QA Run

### Critical
_None_

### Warning
- **Database page UI untranslated on /fr and /de** — Table headers, filter labels, CTAs ("Upgrade to Pro" ×75+), and footer counts all in English. Only nav/footer have localized strings. — https://ai-register-eu.vercel.app/fr/database
- **Regulation detail pages untranslated on /fr and /de** — All body text, section headers (incl. "What this means for your organisation" ×8), and version history in English. — https://ai-register-eu.vercel.app/fr/regulations/eu-ai-act
- **`/fr/regulations` hero heading in English** — "EU Compliance Frameworks" subtitle not translated. — https://ai-register-eu.vercel.app/fr/regulations
- **`<html lang="en">` hardcoded for all locales** — Root layout sets `lang="en"` even for /fr and /de pages. Architectural issue: root layout owns the `<html>` tag; locale layout is nested in `<body>`. Requires layout restructure to fix properly.
- **`/en/` prefix on regulation links from non-prefixed /regulations page** — Links on `/regulations` go to `/en/regulations/...`, creating canonical URL inconsistency.
- **FR homepage — risk level labels not translated** — "High Risk", "Limited Risk", "Minimal Risk" displayed in English. — https://ai-register-eu.vercel.app/fr

### Info
- **`/api/compare` correctly rejects GET with 405** — POST-only endpoint; behaviour is correct. — internal
- **Financial Services industry count (66) seems high** — May reflect over-broad tag mapping. — https://ai-register-eu.vercel.app/industries

### Fixed this run
- **`/regulations/ai-act` returned 404** — Added redirects in `next.config.ts`: `/regulations/ai-act` → `/en/regulations/eu-ai-act` and `/:lang/regulations/ai-act` → `/:lang/regulations/eu-ai-act`. ✅ Fixed (2026-04-13)
- **About page title "About AI Compass EU | AI Compass EU"** — Changed metadata title from "About AI Compass EU" to "About" so template renders "About | AI Compass EU". ✅ Fixed (2026-04-13)

---

## 2026-04-12 QA Run (Evening)

### Critical
_None_

### Warning
- **Broken locale links on /regulations page** — Framework cards linked to `/regulations/[slug]` (missing locale prefix), causing locale stripping when clicked. ✅ **Fixed** (2026-04-12): Updated `[lang]/regulations/page.tsx` to accept `params.lang` and use `/${lang}/regulations/${fw.slug}`.
- **Hardcoded `/en/` links in NewsfeedClient** — Framework and system links in the newsfeed tab were hardcoded to `/en/` regardless of current locale. ✅ **Fixed** (2026-04-12): Added `lang` prop to `NewsfeedClient`, passed from page params, and replaced hardcoded `/en/` with `/${lang}/`.
- **Database page UI entirely in English on /fr and /de** — Table headers, filter labels, CTAs ("Upgrade to Pro for full assessment" ×75), and system type descriptors all render in English. Significant localization gap. — https://ai-register-eu.vercel.app/de/database
- **~30-40% of German homepage untranslated** — StatsBar labels, some nav items ("Plans", "Database"), footer section headers, system description snippets all in English. — https://ai-register-eu.vercel.app/de
- **Page `<title>` not translated on localized pages** — `/fr`, `/de`, `/fr/database`, `/de/database` all show English title tags. — multiple pages

### Info
- **`/ratings` redirects to `/methodology`** — intentional (code comment: "content was duplicated"), but no canonical redirect label or SEO signal. — https://ai-register-eu.vercel.app/en/ratings
- **Duplicate site name in `<title>` tags** — Pages like `/database`, `/regulations`, `/industries`, `/newsfeed` had titles like "AI Database — AI Compass EU" while the root layout template appends "| AI Compass EU" again, resulting in "AI Database — AI Compass EU | AI Compass EU". ✅ **Fixed** (2026-04-12): Removed "— AI Compass EU" and "| AI Compass EU" suffixes from 18 page metadata titles.
- **Partial i18n on /de** — Several sections untranslated: "How It Works", "AI Compliance Intelligence" (newsletter CTA), and all 5 industry filter labels (Financial, Healthcare, Insurance, Public Sector, HR). — https://ai-register-eu.vercel.app/de ✅ **Fixed** (2026-04-12): Updated de.json with full German translations for `featured.*`, `howItWorks.*`, and `cta.*` keys.
- **`/api/compare` correctly rejects GET with 405** — POST works correctly. — internal

---

## 2026-04-11 QA Run

### Critical
_None_

### Warning
- **Partial i18n on /fr and /de** — system detail descriptions remain in English (database-driven content, not UI strings). Main UI, nav, headings, and CTAs are fully translated. AI system descriptions would need per-record translations. — https://ai-register-eu.vercel.app/fr

### Info
- **`/ratings` redirects to `/methodology`** — intentional (code comment: "content was duplicated"), but no canonical redirect label or SEO signal. Users searching for "ratings" may be confused. — https://ai-register-eu.vercel.app/en/ratings
- **CLAUDE.md has stale Pro price (€49/mo)** — actual price in code and live site is €19/mo. The CLAUDE.md planning doc was not updated when price was set. No user-facing issue. — internal
- **Several systems show N/A overall score** — e.g. Salesforce Agentforce on /database. Expected for incomplete assessments; worth monitoring for growth. — https://ai-register-eu.vercel.app/en/database
- **QA bot test script uses wrong field** — QA test for `/api/chat` was sending `{"message":"..."}` but API expects `{"question":"..."}`. API itself is functioning correctly. — internal QA script

### Fixed this run
- **CLAUDE.md stale price €49** — Fixed to €19/mo. Also fixed same stale price in seed-self-assessment.ts, chat context, business-case/podium/vendor-prep tier-gate CTAs. (2026-04-11)

---
