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

- [ ] **Gate compare export by tier**: Free users get PDF only (non-editable). CSV/Excel export is Pro-only. Protects data value and gives a clear upgrade incentive.
- [ ] **Compare page — Podium**: Top of comparison page shows Gold/Silver/Bronze podium ranking the compared systems by best match + compliance score. Visual, immediate, decisive.
- [ ] **Compare page — Spider web chart**: Radar/spider chart with predefined clickable dimensions (e.g. compliance, security, data sovereignty, integration, pricing). Each contender shown as an area overlay — largest area = winner. Clicking a dimension jumps to the corresponding section below (sections collapsed by default, expandable).
- [ ] **Checklist — Enterprise gate + UX upgrades**: Move checklist to Enterprise tier only (high-value feature). Add: (1) category-level checkbox that auto-selects/deselects all underlying requirements, (2) all items auto-checked by default, (3) MoSCoW priority classification — Must (red), Should (orange), Nice to have (green) — with color coding on each requirement, (4) Excel export — this is the one feature where editable spreadsheet output is essential (enterprise teams need to edit, assign owners, track progress in their own tools).
- [ ] **Business Case Generator — major overhaul**: Enterprise-only tool, possibly admin/consultant-operated (not self-serve — requires careful guidance). Changes: (1) Legal disclaimer: estimates for educational/indicative purposes only, not sole basis for decisions, no liability. (2) Richer input: internal skills, budget range, timeline, existing infrastructure, integration needs, change management readiness. (3) Financial modelling: amortization timeframe, discount rate, NPV/IRR calculations, TCO over 3-5 years. (4) Output: Claude-generated interactive graphs + financial report with explicit assumptions, confidence levels, and soft benefits statement (productivity, risk reduction, compliance posture). (5) Transparency: flag low-confidence estimates, never make definitive vendor-specific ROI claims — use "typical range" / "industry benchmarks." (6) Access model: possibly not exposed for autonomous use — CEO/consultant runs it with the customer, customer sees polished output only. (7) BUG: feature is currently broken — needs debugging before any redesign.
- [ ] **Vendor Discussion Prep — clarity + meeting script**: (1) Make positioning crystal clear: this is for the CUSTOMER preparing to meet a vendor, not the other way around. Rename/rebrand if needed — e.g. "Vendor Meeting Prep" or "Meeting Briefing Kit." (2) Add input fields: meeting title, meeting agenda (paste), key concerns/priorities. (3) Output becomes a meeting script: structured talking points per agenda item, tough questions to ask, red flags to watch for, compliance points to raise, negotiation leverage. The customer walks into the meeting fully prepared. (4) Pre-filled answer intelligence: for each talking point/question, pre-populate what WE already know from our database (certifications, data residency, pricing, compliance status). After the meeting, customer can input what the vendor actually said — system flags misalignments between vendor claims and our data as red flags requiring verification. Turns the tool into a vendor accountability checker. (5) Conversational input: replace rigid form with a chat box at the top — user pastes or describes the meeting context naturally (goal, purpose, who's attending, what's at stake), AI extracts the structure and generates the briefing. (6) ROADMAP: scheduled meeting briefing — user sets the meeting date, system emails the complete meeting prep report (questions, talking points, pre-filled intel, red flags to watch) the day before. Even if they forgot to prepare, the briefing is waiting in their inbox.
- [ ] **Podium + Compare integration decision** ⚠️ NEEDS BRAINSTORM: Original intent was podium as part of the Compare tool, not standalone. Ideal layout: compare results page with podium (left) + spider/radar chart (right) at the top, then detailed sections below. Open question: keep podium as standalone feature too (it has value on its own) or merge into compare only? Schedule brainstorm with advisory board to decide.
- [ ] **Podium results page redesign**: Current output is bland. Want a visual podium graphic — left to right: 🥇 Gold (tallest), 🥈 Silver, 🥉 Bronze, with system names/logos on each step. Below the podium, a structured comparison table (well-designed, not plain HTML): rows for Strengths (aligned across all 3), Weaknesses (aligned), Risks (aligned), and a link to each system's full documentation page. Should feel like a real award ceremony, not a text dump.
- [ ] **Budget range missing currency**: The AI system recommendation / podium tool asks for budget range but doesn't specify a currency. Add EUR as default (EU audience), or let the user pick EUR/USD/GBP. Show the currency symbol in the input field.
- [ ] **Reports & White Papers — create actual content + tier gating**: Currently 5 published tiles + 2 coming soon, but NO actual content behind them (no report pages, no PDFs). Need to: (1) Create full content for all 5 published reports: "EU AI Act Readiness Report 2026", "State of AI Adoption in European Enterprises", "GDPR + AI Act: The Compliance Overlap", "Data Residency Report", "AI Risk Classification: A Practical Guide". (2) Build the `/reports/[slug]` detail pages. (3) Gate some reports as free (lead magnets, SEO) and others as Pro-only. (4) Add clear disclaimer on each: "AI-generated content, reviewed by domain experts." (5) Create the 2 coming-soon reports when ready. (6) Generate downloadable PDF versions.
- [ ] **Recalibrate organization size ranges**: Current size buckets are too small for our actual audience. Target customers are large multinationals with well over 250 employees. Adjust size options across all forms, filters, and context prompts (business case, compare, checklist, etc.) to reflect enterprise reality — e.g. 1,000–5,000 / 5,000–20,000 / 20,000–50,000 / 50,000+. Remove or downplay SME-sized options.
- [ ] **Compare page — Feature fit matrix**: AI infers a list of capabilities from the user's comparison prompt. For each solution, mark each capability: ✅ green = fully met, ⚠️ orange = partially met / requires customization / needs additional product, ❌ red = not met at all. Gives instant gap analysis.
- [ ] **Referral revenue model**: When a customer chooses an AI system based on our assessment, get referral commission from that AI vendor. Research affiliate/referral programs from major AI vendors (OpenAI, Anthropic, Microsoft, Google, etc.). (from Telegram)
- [ ] **Hide consulting offering**: Remove or downplay consulting/enterprise tier until CEO leaves current employment. Don't advertise services we can't deliver yet. (from Telegram)
- [ ] **Pitch deck — multiple audiences**: Build pitch materials suited to (a) enterprise customers evaluating the platform, (b) potential acquirers, (c) strategic partners. Not investors/angels — injecting funds wouldn't dramatically change what the site can do. (from Telegram)
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
