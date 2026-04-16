# QA Bot — Defects Log

> Automatically maintained by the QA Bot scheduled task.
> Runs twice daily (8am, 8pm). Issues are logged, fixed by dev agent, and marked resolved.

---

## 2026-04-16 QA Run (Morning)

### Critical
_None this run._

### Warning
- **Newsfeed future-dated articles (Aug 2, 2026) still not labelled "Scheduled"** — Top items in the feed are dated Aug 2026 (EU AI Act enforcement milestones pre-seeded as future dates). No "Scheduled" or "Upcoming" badge shown — looks like stale/future content to users expecting live news. Ongoing from 2026-04-15. — https://ai-register-eu.vercel.app/en/newsfeed
- **Stats bar "80 AI tools" vs pricing page "100+"** — Homepage stats bar shows "80 AI tools rated"; Pro tier pricing card says "All 100+ AI systems". Ongoing trust/credibility gap for enterprise buyers who see both on the same visit. Ongoing from 2026-04-14.
- **FR/DE methodology pages ~95% untranslated** — `/fr/methodology` and `/de/methodology` display dimension names, grading scale, and assessment process entirely in English. Only footer and nav are localised. — https://ai-register-eu.vercel.app/fr/methodology
- **Footer `aiTransparencyTitle` / `aiTransparencyBody` untranslated in all non-English locales** — "AI Transparency Notice" and disclaimer body still in English on /fr, /de. Ongoing from 2026-04-14.

### Info
- **All main pages load 200** — /, /database, /regulations, /pricing, /about, /methodology, /resources, /industries, /newsfeed, /privacy all return 200. ✅
- **System detail pages load correctly** — Anthropic Claude Enterprise (B-), ChatGPT Enterprise (B-), Mistral Large (A-) all render with framework breakdown and evidence verification banner. ✅
- **Resources page** — All 8 resource cards link to legitimate EU official sources (EUR-Lex, EC, ENISA); no broken links detected. ✅
- **FR/DE system detail pages** — System detail page `/fr/systems/anthropic-claude-enterprise` loads with compliance scores intact; AI Transparency Notice section still English-only.
- **About page lacks team bios/credentials** — No named analysts or advisory board disclosed. Ongoing from 2026-04-14 run.
- **Pricing page Free tier wording confusing** — Free tier lists "10 most-used AI systems" then also "All 100+ AI systems" in the same feature list — contradictory. Needs copy clarification.

### Fixed this run
- **CookieConsent hardcoded English** — Cookie banner ("We use essential cookies only", "Accept all", "Privacy Policy") was hardcoded in English in `CookieConsent.tsx`. ✅ Fixed: moved 4 strings to `cookies.*` dictionary namespace, backfilled human-quality translations across all 13 non-English locales. Committed `90e2140`, deployed.

---

## 2026-04-15 QA Run (Evening)

### Critical
- **All `/[lang]/systems/[slug]` pages returning 500** — `PrismaClientKnownRequestError` P2021: `public.SystemClaim` table does not exist in production database. The evidence-backbone schema was added locally but never pushed to Neon. All system detail pages (Anthropic, OpenAI, Microsoft, Google, etc.) were broken for all locales. ✅ **Fixed this run**: Ran `prisma db push` against production Neon DB to create missing tables (`SystemClaim`, `Source`, `SourceSnapshot`, etc.). Also added `.catch()` graceful fallback in `/[lang]/systems/[slug]/page.tsx` to prevent future schema drift from crashing the page. Committed + deployed. — https://ai-register-eu.vercel.app/en/systems/anthropic-claude-enterprise

### Warning
- **Newsfeed shows future-dated articles (Aug 2026)** — Items dated "2 Aug 2026" appear in the feed as "most recent". With today being 2026-04-15, these entries appear to be pre-seeded future regulatory milestones (EU AI Act enforcement dates) rather than news errors, but the labelling could confuse users who expect live news. Recommend adding a "Scheduled" or "Upcoming" badge for entries dated in the future. — https://ai-register-eu.vercel.app/en/newsfeed
- **Footer `aiTransparencyTitle` and `aiTransparencyBody` + secondary nav ("Security", "Incident Response", "Terms", "Contact") untranslated in all non-English locales** — Ongoing from previous run. Requires DeepL backfill. — https://ai-register-eu.vercel.app/fr

### Info
- **Homepage, regulations, methodology, about, pricing, newsfeed, industries all load 200** — Full page load check passed for all major routes. ✅
- **System detail pages now loading** — Post-fix: Anthropic Claude Enterprise shows B- overall, full framework breakdown, evidence verification banner. ✅
- **FR/DE database page table headers, filter labels, risk labels, and CTAs still in English** — Ongoing from previous runs. Root cause: DatabaseGrid component translations not wired. Low priority vs critical fix above.
- **`html lang="en"` hardcoded in root layout** — Ongoing architectural issue from previous runs.

### Fixed this run
- **All `/[lang]/systems/[slug]` 500 errors** — `prisma db push` applied to production + graceful `.catch()` fallback in page.tsx. Deployed at commit `7309f17`. ✅

---

## 2026-04-14 QA Run (Evening)

### Critical
_None_

### Warning
- **`html lang="en"` hardcoded in root layout for all locales** — `src/app/layout.tsx:33` sets `<html lang="en">` globally. French, German, and all non-English pages are served with `lang="en"`, hurting SEO (hreflang signals conflicted) and accessibility (screen readers announce wrong language). OpenGraph `og:locale` is also hardcoded to `"en_EU"` on line 22. Requires architectural refactor: move `<html>` tag into `[lang]/layout.tsx` or dynamically derive from route params. — https://ai-register-eu.vercel.app/fr https://ai-register-eu.vercel.app/de
- **Footer `aiTransparencyTitle` and `aiTransparencyBody` untranslated in all non-English locales** — Dictionary keys exist but values remain in English (fallback-copied). Needs DEEPL_API_KEY to be set and `npm run i18n:translate` to run. — https://ai-register-eu.vercel.app/fr https://ai-register-eu.vercel.app/de

### Info
- **All main pages load 200** — /, /database, /regulations, /pricing, /about, /methodology, /resources, /industries all redirect cleanly and return 200. Footer links (security, incident-response, terms, contact) also 200. ✅
- **System detail pages load correctly** — /en/systems/anthropic-claude-enterprise, /en/systems/openai-chatgpt-enterprise, /en/systems/microsoft-azure-openai-service all return 200. ✅
- **Agentforce/Einstein 1 Platform shows N/A overall score** — One card on /database shows empty scores array / N/A. May be a data-completeness gap for that system record.

### Fixed this run
- **Footer "Disclaimer" title hardcoded in English** — `src/components/layout/Footer.tsx:114` had literal `"Disclaimer"` string instead of `t("footer.disclaimerTitle")`. ✅ Fixed: added `footer.disclaimerTitle` key to `en.json`, wired up `t()` in Footer.tsx, backfilled all 13 locales.
- **Footer secondary nav links hardcoded in English** — "Security", "Incident Response", "Terms", "Contact" were hardcoded strings instead of `t()` calls. ✅ Fixed: added `footer.security`, `footer.incidentResponse`, `footer.terms`, `footer.contact` to `en.json`, updated Footer.tsx, backfilled all locales.

---

## 2026-04-14 QA Run

### Critical
_None_

### Warning
- **Incomplete FR/DE translations — database table, regulation cards** — Risk labels ("High", "Limited", "Minimal"), DB column headers, button text ("Upgrade to Pro"), and all 6 regulation framework card descriptions remain in English on /fr and /de. ~40-60% of content untranslated. — https://ai-register-eu.vercel.app/fr/database https://ai-register-eu.vercel.app/de/regulations
- **"80 AI systems" vs "100+ AI systems" inconsistency** — StatsBar on homepage shows live DB count (~80), while PricingCards say "All 100+ AI systems". Creates trust gap for enterprise buyers comparing the two on the same visit. — https://ai-register-eu.vercel.app/en/pricing

### Info
- **`/api/compare` correctly returns 405 on GET** — POST-only; expected behaviour. No user-facing issue. — internal
- **No annual/monthly billing toggle on pricing page** — Save 20% annual offer shown as static text only; no interactive toggle. Common SaaS UX pattern that's absent. — https://ai-register-eu.vercel.app/en/pricing
- **No team bios on About page** — Platform positions itself as authoritative compliance intelligence; lack of named experts is a trust gap for enterprise procurement. — https://ai-register-eu.vercel.app/en/about

### Fixed this run
- **Duplicate "Podium — top-3 system recommendations" in Pro tier** — Entry appeared twice in Pro feature list. ✅ Fixed (2026-04-14): Removed duplicate line from `PricingCards.tsx`.

---

## 2026-04-13 QA Run (Evening)

### Critical
_None_

### Warning
- **Duplicate Salesforce entry in database** — Two separate DB records exist for Salesforce: `salesforce-agentforce-einstein` (main seed) and `agentforce-einstein-ai` (seed-platform-deep-m365-sfdc.ts). Both visible on `/database` page. The newer `agentforce-einstein-ai` slug has richer use-case data. Need to merge or delete the older record. — https://ai-register-eu.vercel.app/en/database
- **Pricing page (/fr/pricing, /de/pricing) entirely untranslated** — All tier names, feature list items, badges ("Most Popular"), and CTAs remain in English. The conversion-critical page should be a translation priority. — https://ai-register-eu.vercel.app/fr/pricing
- **Methodology page body untranslated in /de and /fr** — All 8 dimension names, grading scale, and assessment process text in English. — https://ai-register-eu.vercel.app/de/methodology

### Info
- **`/en/privacy-policy` returns 404** — Conventional URL pattern not redirected; correct path is `/en/privacy`. External links or email campaigns using `/privacy-policy` would hit 404. Simple redirect recommended. — https://ai-register-eu.vercel.app/en/privacy-policy ✅ **Fixed** (2026-04-13): Added permanent redirects `/privacy-policy` → `/en/privacy` and `/:lang/privacy-policy` → `/:lang/privacy` in next.config.ts.
- **`/api/compare` correctly rejects GET with 405** — POST-only; behaviour is correct (matches 2026-04-12 finding). — internal

### Fixed this run
_None_

---

## 2026-04-13 QA Run (Morning)

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
