# QA Bot — Defects Log

> Automatically maintained by the QA Bot scheduled task.
> Runs twice daily (8am, 8pm). Issues are logged, fixed by dev agent, and marked resolved.

---

## 2026-04-12 QA Run

### Critical
_None_

### Warning
- **Partial i18n on /de** — Several sections untranslated: "How It Works", "AI Compliance Intelligence" (newsletter CTA), and all 5 industry filter labels (Financial, Healthcare, Insurance, Public Sector, HR). — https://ai-register-eu.vercel.app/de ✅ **Fixed** (2026-04-12): Updated de.json with full German translations for `featured.*`, `howItWorks.*`, and `cta.*` keys.

### Info
- **`/ratings` redirects to `/methodology`** — intentional (code comment: "content was duplicated"), but no canonical redirect label or SEO signal. — https://ai-register-eu.vercel.app/en/ratings
- **Duplicate site name in `<title>` tags** — Pages like `/database`, `/regulations`, `/industries`, `/newsfeed` had titles like "AI Database — AI Compass EU" while the root layout template appends "| AI Compass EU" again, resulting in "AI Database — AI Compass EU | AI Compass EU". ✅ **Fixed** (2026-04-12): Removed "— AI Compass EU" and "| AI Compass EU" suffixes from 18 page metadata titles.
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
