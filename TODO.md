# AI Compass EU — Backlog

> Persistent task list. Checked at the start of every Claude session.
> `[ ]` pending | `[~]` in progress | `[x]` done (with date)
>
> **RULE**: Items requiring CEO input/action are always listed first. If CEO is unavailable, proceed with autonomous tasks below.

---

## 🔖 RESUME HERE — Session paused 2026-04-15 ~09:00

**Context**: Evidence backbone backfill paused mid-run. User is restarting their computer. Pick up exactly where we left off.

### Current DB state (queried 2026-04-15)
- **89 AI systems** in catalog
- **497 active sources** (vendor trust pages, DPAs, sub-processor lists)
- **463 unique latest snapshots** → 108 extracted, **355 pending**
- **535 draft claims** awaiting analyst review across **47 systems**
- **8 published claims** (live on public pages)

### What's blocking
**Anthropic API credits are exhausted.** User is topping up — recommended amount: **$20** (finishes the 355-extraction backlog for ~$3, leaves ~12 months of steady-state headroom).

### Two cost guards now in place (committed this session)
1. **Fetcher hash-skip** (already existed): SHA-256 of page content compared against last success → unchanged pages are skipped, no LLM call. `src/lib/evidence-fetcher.ts:300`
2. **Extractor hash-skip + run cap** (NEW, commit `cb98ac1`): `scripts/evidence-extract.ts` now checks `systemClaim.findFirst({ sourceId, snapshotId })` before any LLM call. Default `--max 150` run cap. `--force` to re-extract everything (e.g. after prompt tuning).

### Exact restart command (after credit top-up)
```bash
cd /Users/ericdevismes/Documents/Claude-Work/PROJECTS/ai-register-eu
npm run evidence:extract
# → only touches the 355 pending ones; the 108 already-extracted are skipped automatically
```
Expected cost: **~$2–3 total**. Expected duration: **~15–25 min**. Output lands in `/admin/evidence` for human review (NEVER auto-publish).

### After the backfill finishes
1. Visit `/admin/evidence` — 80–90 systems should now have drafts (up from 47)
2. Use the bulk-promote button to publish high-confidence drafts per vendor (commit `667e046`)
3. Remaining P0 work: Phase 3 (freshness cron) + methodology page rewrite (items below)
4. Send Telegram status update to user once backfill + bulk-promote round 1 are done

### Recent commits this session
- `cb98ac1` evidence:extract — hash-skip + --force + --max
- `43b6635` admin queue: high-confidence % badge per vendor
- `461c712` claim-extractor: stricter anti-hallucination prompt
- `0980941` discover-sources: vendor brand-word + ccTLDs
- `667e046` admin evidence: bulk-promote safe high-confidence drafts

### Cost model (for the user's budget planning)
- Backlog tonight: ~$3
- Steady state once catalog is stable: ~$1–2/month (weekly cron, ~10–30 pages drift per week across 497 sources)
- Adding a new vendor to the catalog: ~$0.05 in extraction cost

---

## CEO Action Required (ask via Telegram if not in session)

- [x] **LemonSqueezy configuration**: Product created (Pro €19/month, test mode), all 4 env vars set on Vercel, webhook configured (2026-04-12)
- [ ] **Domain name + site naming** ⚠️ NEEDS BRAINSTORM: Find the right name for the platform and register a domain. Consider: .com, .org, .ai, .eu extensions — scope, future expansion, cost, memorability, ease of typing. "AI Compass EU" may be taken. May need full rebrand. All branding, metadata, URLs, and LemonSqueezy config depend on this. Brainstorm with advisory board.

## P0 — Core Rules

### 🚨 LAUNCH BLOCKER — Evidence Backbone (Sourcing + Freshness)

> **DO NOT send launch emails, promote the site publicly, or enable LemonSqueezy live-mode until Phase 2 is complete.** Current vendor intel was LLM-authored from training data without primary-source verification. Every published claim on an AI system is currently an unverifiable assertion, which is a credibility and legal-liability risk for a platform sold to DPOs/CISOs.
>
> **Strategic framing**: Gartner's moat is brand. Our moat is verifiability — every claim linked to the vendor's own trust center, with the date we checked. Transparency is the differentiator, not a remediation.

- [~] **P0 — Evidence backbone (Phase 0)** (in progress, 2026-04-14): Prisma migration for `Source` / `SourceSnapshot` / `SystemClaim` / `ReviewTask` + OpenAI GPT-4 pilot with real trust-center URLs + source-chip UI component + interim "preview — evidence under verification" site banner. Reference implementation so the backfill team has a shape to follow.
- [ ] **P0 — Evidence backbone (Phase 1)**: Weekly fetcher cron (Vercel/GitHub Actions) + snapshot storage with contentHash diff detection + LLM claim extractor (extracts from fetched snippet only, includes the exact quote) + admin review queue UI with approve/edit/reject per claim.
- [ ] **P0 — Evidence backbone (Phase 2)**: Backfill top-20 vendors (OpenAI, Anthropic, Google, Microsoft, Mistral, Cohere, AWS Bedrock, Azure AI, IBM watsonx, Salesforce Einstein, SAP Joule, ServiceNow, Workday, Palantir, Databricks, Snowflake Cortex, UiPath, Adobe Firefly, GitHub Copilot, Perplexity) through the new pipeline. Long-tail systems either sourced or removed — better empty than wrong. **This is the launch gate.**
- [ ] **P0 — Evidence backbone (Phase 3)**: Ongoing freshness — cron re-verifies claims >90 days old, diff detection auto-queues changed sources, customer "Report outdated" button feeds triage queue. Monthly expert-panel spot-check of 5 random systems per domain.
- [ ] **P0 — Methodology page rewrite**: Lean into transparency as moat. Three promises visible: every claim has a source, every claim has a date, anyone can challenge any claim. Source hierarchy (Tier 1 trust portal → Tier 4 regulatory filings) published. Refresh cadence + review SLAs public. Ship with Phase 2.
- [ ] **P0 — Hallucination triage pass**: Before backfill, diff existing seed claims for top-3 vendors against live trust centers. Quantify how bad the LLM-authored content is so we know the cleanup scope. Findings feed the Phase 2 backfill priorities.

### Translation Gate

- [x] **CORE RULE — Translation is non-negotiable** (2026-04-14): Translation gate implemented and wired into prebuild + CI. `npm run i18n:check` blocks builds on missing keys, empty values, placeholder mismatches, hardcoded JSX in scanned files, non-localized metadata, and missing report locales. `npm run i18n:translate` auto-fills via DeepL (falls back to English placeholders when `DEEPL_API_KEY` is absent). Workflow documented in AGENTS.md. See P0 follow-up below for translation debt.
- [ ] **P0 follow-up — Migrate legacy hardcoded JSX to t()**: ~20 hardcoded English strings in pricing/about/methodology/reports/regulations/industries pages. Wrap in `t()`, add keys to `en.json`, run `npm run i18n:translate`, then add each page path to `scripts/i18n-scan-paths.txt` so the gate covers them. Acknowledged debt from the initial rollout.
- [ ] **P0 follow-up — Real DeepL backfill**: Current non-English dictionaries and reports were filled with English placeholders (`--fallback` mode) because no `DEEPL_API_KEY` was available locally. Set key, run `npm run i18n:translate`, commit the translated files.
- [x] **Fix chatbot** — API key confirmed working on Vercel, .trim() applied to all env vars (2026-04-12)

## P1 — Revenue & Go-to-Market

- [x] **Gate compare export by tier**: Free users see upgrade prompt, Pro gets CSV+JSON buttons (2026-04-12)
- [x] **Compare page — Podium + Spider chart integration**: Podium (Gold/Silver/Bronze) + SVG radar chart (6 dimensions) integrated at top of compare results. Clickable dimensions, collapsible sections, responsive layout (2026-04-12)
- [ ] **Compare page — Feature fit matrix**: AI infers capabilities from the comparison prompt. For each solution: ✅ green = fully met, ⚠️ orange = partially met / needs customization, ❌ red = not met. Instant gap analysis.
- [ ] **Podium results page redesign**: Visual podium graphic (🥇🥈🥉), structured table below with Strengths/Weaknesses/Risks aligned per system, links to full docs. Award ceremony feel.
- [ ] **Checklist — Enterprise gate + UX upgrades**: Enterprise-only. (1) Category-level checkbox, (2) all auto-checked by default, (3) MoSCoW colors (Must=red, Should=orange, Nice=green), (4) Excel export. ⚠️ PRIVACY NOTE: platform sees which enterprise is evaluating which vendor — sensitive. Need clear data policy: we do NOT share customer evaluation data with vendors. Add privacy notice to checklist page.
- [ ] **Business Case Generator — HIDDEN, future consulting tool**: Hide from navigation (don't destroy). Will be used as a consulting deliverable for direct enterprise customers, not self-serve. Future overhaul: (1) Legal disclaimer, (2) richer inputs (skills, budget, timeline, infra), (3) financial modelling (amortization, discount rate, NPV/IRR, TCO 3-5yr), (4) interactive graphs + report with assumptions + soft benefits, (5) confidence levels, (6) admin-operated only. (7) BUG: currently broken — fix when reactivating.
- [x] **Vendor Meeting Prep — clarity + meeting script** (2026-04-12): Renamed, added meeting context/title/agenda/concerns inputs, conversational chat box, pre-filled vendor intelligence section, buyer-centric positioning. ROADMAP items remaining: post-meeting vendor claim checker, scheduled email briefing.: (1) Clear positioning: for the CUSTOMER, not vendor. Rename to "Vendor Meeting Prep" or "Meeting Briefing Kit." (2) Input: meeting title, agenda, key concerns — via chat box (natural language). (3) Output: meeting script with talking points, tough questions, red flags, compliance checklist, negotiation leverage. (4) Pre-filled answer intelligence from our DB — flag misalignments between vendor claims and our data as red flags. (5) ROADMAP: scheduled briefing email the day before meeting.
- [x] **Reports & White Papers — create actual content + tier gating**: 5 reports with full content (~22K words), detail pages, tier gating (2 free sections, rest Pro), AI-generated disclaimer (2026-04-12)
- [x] **Budget range missing currency**: EUR prefix added to podium budget field (2026-04-12)
- [x] **Recalibrate organization size ranges**: Updated to SME/Mid-Enterprise/Large-Enterprise/Multinational/Public Sector across all forms and APIs (2026-04-12)
- [ ] **Referral revenue model**: Research AI vendor affiliate/referral programs. (from Telegram)
- [x] **Hide consulting offering**: Removed/softened across pricing, footer, and all dictionaries (2026-04-12)
- [ ] **Pitch deck — multiple audiences**: For enterprise customers, acquirers, strategic partners. (from Telegram)
- [ ] **Gate newsfeed as lead magnet**: Keep newsfeed page public (SEO), but gate the curated daily digest email behind email signup. Builds email list for nurturing toward paid tiers.

## P2 — Content & Quality

- [ ] **Develop detailed scoring/ranking methodology**: Deep discussion with expert agents needed. Must show transparency to customers about how we rank systems, but protect proprietary methodology (don't give away everything for free). Balance: show enough to build trust, keep the secret sauce proprietary. This is a strategic decision requiring advisory board input.
- [x] **Review news sourcing strategy + expand RSS sources**: Expanded from 27 to 61 sources. All 27 EU DPAs + 3 EEA DPAs + EDPS + CJEU + AI Office + civil society (Access Now, AlgorithmWatch, etc.) (2026-04-12)

## P3 — Risk & Compliance (Internal)

- [ ] **Risk assessment for running the site**: Identify operational, legal, reputational, financial risks of operating AI Compass EU. Include remediation plan, controls, metrics to measure risk. (from Telegram)

## P4 — DevOps & Automation

- [ ] **QA Bot (continuous loop)**: Autonomous bot monitored via Telegram that continuously tests the site from UX/customer perspective. Finds usability issues, missed translations, broken UX, degraded experiences. Maintains a defects log. Dev agent picks up fixes twice daily.
- [ ] **Content Quality Agents**: Each domain expert agent (CTO, CISO, DPO, etc.) continuously monitors site content in their area and suggests improvements/refinements.
- [ ] **Tester Agent**: Autonomous testing agent — functional tests, broken links, forms, performance, mobile
- [ ] **UI/UX Improvement Agent**: Continuously crawl site, find UX issues, accessibility gaps, suggest fixes

## P5 — Expert Panel Enhancements

- [ ] **Telegram async integration**: Start discussions from Telegram, get chat-style output, reply with CEO decision

---

## Completed

- [x] OpenAI GPT-4, Claude, Gemini, Copilot, Mistral, Salesforce Einstein, SAP Joule, ServiceNow, Workday, IBM watsonx, Palantir, GitHub Copilot, Amazon Bedrock, Databricks, Snowflake Cortex, UiPath, CrowdStrike, Darktrace, Palo Alto, Glean — enriched (2026-04-11)
- [x] Cohere, Adobe Firefly, Zoom AI, Slack AI, Atlassian, HubSpot, Zendesk, Freshworks, Monday.com, Canva, Figma, Grammarly, Jasper, Notion, Perplexity, DeepSeek — added/enriched (2026-04-11)
- [x] Sector-specific: Healthcare (Tempus, PathAI, Paige, Viz.ai), Legal (Harvey, CoCounsel), Finance (Bloomberg GPT, Kensho, SymphonyAI), Manufacturing (Siemens, Cognite, Uptake), HR (Eightfold, Beamery, Phenom) (2026-04-11)
- [x] EU AI Act enforcement timeline, GDPR procurement checklist, DORA vendor assessment, EBA/EIOPA model risk, MDR/IVDR SaMD classification, National AI strategies expanded (2026-04-11)
- [x] NIS2, Data Act, DSA/DMA, ISO 42001, NIST AI RMF frameworks added (2026-04-11)
- [x] Cross-framework mapping: GDPR↔AI Act, DORA↔NIS2, compliance checklist generator (2026-04-11)
- [x] Chat/RAG enhanced, role-based drill-down views, comparison tool, procurement matrix export (2026-04-11)
- [x] Business Case Generator, RFI/RFP Engine, Podium Recommendations, Vendor Prep (2026-04-11)
- [x] LemonSqueezy checkout + webhooks, subscription management page (2026-04-11)
- [x] Account/billing/support chatbot, customer engagement (2026-04-11)
- [x] Risk badge UX fix, header overhaul, profile bubble (2026-04-11)
- [x] Self-assessment, security policy page, incident response plan (2026-04-11)
- [x] Site documentation (2026-04-11)
- [x] News monitoring pipeline: 27 RSS sources, auto-tagging, LLM classification (2026-04-11)
- [x] Admin: customer management redesign, inline editing, company drill-down (2026-04-11)
- [x] Expert advisory panel: 14 agents, /brainstorm command, discussion engine, admin UI (2026-04-12)
- [x] Telegram bot: 2-way persistent chat with Claude Haiku auto-responder (2026-04-12)
- [x] Vercel deployment fixes: dynamic expert-panel page, production DB schema push, env var fixes (2026-04-12)

---

## Ideas Inbox
> Add new ideas here — will be triaged into the sections above

- (2026-04-11) Eric's next steps: (1) Get/configure domain name, (2) Send launch emails to get registrations, (3) Connect LemonSqueezy for payments
