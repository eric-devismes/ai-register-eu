# AI Compass EU — Backlog

> Persistent task list. Checked at the start of every Claude session.
> `[ ]` pending | `[~]` in progress | `[x]` done (with date)
>
> **RULE**: Items requiring CEO input/action are always listed first. If CEO is unavailable, proceed with autonomous tasks below.

---

## CEO Action Required (ask via Telegram if not in session)

- [x] **LemonSqueezy configuration**: Product created (Pro €19/month, test mode), all 4 env vars set on Vercel, webhook configured (2026-04-12)
- [ ] **Domain name**: Find and register a domain. "AI Compass EU" may already be taken — may need to rename the platform. All branding, metadata, URLs, and LemonSqueezy config depend on this decision. Research alternatives if needed.

## P0 — Core Rules

- [ ] **CORE RULE — Translation is non-negotiable**: Every page, every feature, every piece of content MUST be published in ALL supported languages simultaneously. Content is NOT published in English if it's not published in every other language. Make this part of every publishing workflow. (2026-04-11, from Telegram)
- [x] **Fix chatbot** — API key confirmed working on Vercel, .trim() applied to all env vars (2026-04-12)

## P1 — Revenue & Go-to-Market

- [x] **Gate compare export by tier**: Free users see upgrade prompt, Pro gets CSV+JSON buttons (2026-04-12)
- [x] **Compare page — Podium + Spider chart integration**: Podium (Gold/Silver/Bronze) + SVG radar chart (6 dimensions) integrated at top of compare results. Clickable dimensions, collapsible sections, responsive layout (2026-04-12)
- [ ] **Compare page — Feature fit matrix**: AI infers capabilities from the comparison prompt. For each solution: ✅ green = fully met, ⚠️ orange = partially met / needs customization, ❌ red = not met. Instant gap analysis.
- [ ] **Podium results page redesign**: Visual podium graphic (🥇🥈🥉), structured table below with Strengths/Weaknesses/Risks aligned per system, links to full docs. Award ceremony feel.
- [ ] **Checklist — Enterprise gate + UX upgrades**: Enterprise-only. (1) Category-level checkbox, (2) all auto-checked by default, (3) MoSCoW colors (Must=red, Should=orange, Nice=green), (4) Excel export. ⚠️ PRIVACY NOTE: platform sees which enterprise is evaluating which vendor — sensitive. Need clear data policy: we do NOT share customer evaluation data with vendors. Add privacy notice to checklist page.
- [ ] **Business Case Generator — HIDDEN, future consulting tool**: Hide from navigation (don't destroy). Will be used as a consulting deliverable for direct enterprise customers, not self-serve. Future overhaul: (1) Legal disclaimer, (2) richer inputs (skills, budget, timeline, infra), (3) financial modelling (amortization, discount rate, NPV/IRR, TCO 3-5yr), (4) interactive graphs + report with assumptions + soft benefits, (5) confidence levels, (6) admin-operated only. (7) BUG: currently broken — fix when reactivating.
- [ ] **Vendor Discussion Prep — clarity + meeting script**: (1) Clear positioning: for the CUSTOMER, not vendor. Rename to "Vendor Meeting Prep" or "Meeting Briefing Kit." (2) Input: meeting title, agenda, key concerns — via chat box (natural language). (3) Output: meeting script with talking points, tough questions, red flags, compliance checklist, negotiation leverage. (4) Pre-filled answer intelligence from our DB — flag misalignments between vendor claims and our data as red flags. (5) ROADMAP: scheduled briefing email the day before meeting.
- [x] **Reports & White Papers — create actual content + tier gating**: 5 reports with full content (~22K words), detail pages, tier gating (2 free sections, rest Pro), AI-generated disclaimer (2026-04-12)
- [x] **Budget range missing currency**: EUR prefix added to podium budget field (2026-04-12)
- [x] **Recalibrate organization size ranges**: Updated to SME/Mid-Enterprise/Large-Enterprise/Multinational/Public Sector across all forms and APIs (2026-04-12)
- [ ] **Referral revenue model**: Research AI vendor affiliate/referral programs. (from Telegram)
- [x] **Hide consulting offering**: Removed/softened across pricing, footer, and all dictionaries (2026-04-12)
- [ ] **Pitch deck — multiple audiences**: For enterprise customers, acquirers, strategic partners. (from Telegram)
- [ ] **Gate newsfeed as lead magnet**: Keep newsfeed page public (SEO), but gate the curated daily digest email behind email signup. Builds email list for nurturing toward paid tiers.

## P2 — Content & Quality

- [ ] **Develop detailed scoring/ranking methodology**: Deep discussion with expert agents needed. Must show transparency to customers about how we rank systems, but protect proprietary methodology (don't give away everything for free). Balance: show enough to build trust, keep the secret sauce proprietary. This is a strategic decision requiring advisory board input.
- [ ] **Review news sourcing strategy**: Don't add Google/Perplexity/Tavily. Board consensus: expand RSS to 60+ sources (missing DPA newsrooms, CJEU case law, national AI committee feeds, EDPS, AI Office). RSS is free, primary sources, no noise. Only add a search API when paying customers ask for it.
- [ ] **Expand RSS sources**: Add ~30-40 missing EU/EEA sources — remaining DPAs (we cover 5 of 30), national AI strategy pages, CJEU case law feed, EDPS newsletter, AI Office updates, parliamentary committee feeds.

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
