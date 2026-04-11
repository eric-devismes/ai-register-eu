# QA Bot — Defects Log

> Automatically maintained by the QA Bot scheduled task.
> Runs twice daily (8am, 8pm). Issues are logged, fixed by dev agent, and marked resolved.

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
_None_

---
