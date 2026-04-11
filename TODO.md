# AI Compass EU — Backlog

> Persistent task list. Checked at the start of every Claude session.
> `[ ]` pending | `[~]` in progress | `[x]` done (with date)

---

## Content Enrichment — AI Systems

### Priority 1: Enrich Top 20 Systems (enterprise intel cards)
- [x] OpenAI GPT-4 / GPT-4o (2026-04-11)
- [x] Anthropic Claude (2026-04-11)
- [x] Google Gemini / Vertex AI (2026-04-11)
- [x] Microsoft Azure OpenAI / Copilot (2026-04-11)
- [x] Mistral AI (EU-native) (2026-04-11)
- [x] Salesforce Einstein / Agentforce (2026-04-11)
- [x] SAP Joule / Business AI (2026-04-11)
- [x] ServiceNow Now Assist (2026-04-11)
- [x] Workday Illuminate AI (2026-04-11)
- [x] IBM watsonx (2026-04-11)
- [x] Palantir AIP (2026-04-11)
- [x] GitHub Copilot Enterprise (2026-04-11)
- [x] Amazon Bedrock (2026-04-11)
- [x] Databricks / Mosaic AI (2026-04-11)
- [x] Snowflake Cortex AI (2026-04-11)
- [ ] UiPath Maestro
- [x] CrowdStrike Falcon AI (2026-04-11)
- [x] Darktrace (2026-04-11)
- [x] Palo Alto Networks Cortex XSIAM (2026-04-11)
- [ ] Glean Enterprise Search

### Priority 2: Add Missing Major Systems
- [ ] Cohere (enterprise LLM)
- [ ] Adobe Firefly / Sensei
- [ ] Zoom AI Companion
- [ ] Slack AI
- [ ] Atlassian Intelligence
- [ ] HubSpot AI
- [ ] Zendesk AI
- [ ] Freshworks Freddy AI
- [ ] Monday.com AI
- [ ] Canva AI
- [ ] Figma AI
- [ ] Grammarly Business
- [ ] Jasper AI
- [ ] Notion AI (enrich existing)
- [ ] Perplexity (enrich existing)
- [ ] DeepSeek (enrich existing)

### Priority 3: Sector-Specific Systems
- [ ] Healthcare: Tempus AI, PathAI, Paige AI, Viz.ai
- [ ] Legal: Harvey AI, CoCounsel (Thomson Reuters)
- [ ] Finance: Bloomberg GPT, Kensho, Ayasdi
- [ ] Manufacturing: Siemens Industrial Copilot (enrich), Cognite, Uptake
- [ ] HR: Eightfold AI, Beamery, Phenom

---

## Content Enrichment — Regulatory Frameworks

### Deepen Existing Frameworks
- [ ] EU AI Act: add 2025-2026 enforcement timeline, prohibited practices detail
- [ ] GDPR: add practical procurement compliance checklist
- [ ] DORA: add vendor assessment template guidance
- [ ] EBA/EIOPA: add model risk management deep-dive
- [ ] MDR/IVDR: add SaMD classification decision tree
- [ ] National AI Strategies: add more countries (Spain, Italy, Nordic, Poland)

### Add New Frameworks/Standards
- [ ] NIS2 Directive (cybersecurity)
- [ ] Data Act (data sharing obligations)
- [ ] Digital Services Act / Digital Markets Act
- [ ] ISO 42001 (AI management systems)
- [ ] NIST AI RMF (US framework, global relevance)

### Cross-Framework Intelligence
- [ ] GDPR ↔ AI Act mapping (which articles relate)
- [ ] DORA ↔ NIS2 overlap guidance
- [ ] Compliance checklist generator per framework combo

---

## Platform Features

- [ ] Enhance chat/RAG with richer seed data context
- [ ] Role-based drill-down views (CISO, DPO, Architect, Procurement)
- [ ] Comparison tool improvements with enriched data
- [ ] Procurement decision matrix export

### Enterprise Tier — Procurement Intelligence Suite
- [ ] **Business Case Generator**: auto-generate ROI/TCO business cases for shortlisted AI tools, tailored to company size, industry, and use case
- [ ] **RFI/RFP Answer Engine**: upload RFI/RFP documents → AI parses all questions/requirements → generates draft answers for each relevant vendor/solution using the platform's intel database
- [ ] **Podium Recommendations**: after RFP analysis, suggest top 3 best-fit solutions with scoring rationale, strengths/weaknesses per requirement, and comparison matrix
- [ ] **Vendor Discussion Prep**: generate talking points, negotiation leverage, and red-flag questions for procurement team meetings with vendors

---

## Payments & Subscriptions

- [x] **LemonSqueezy integration**: Checkout + webhook routes built (2026-04-11)
- [x] Wire up subscription tiers (Free / Pro / Enterprise) to LemonSqueezy checkout (2026-04-11)
- [x] Handle webhooks for payment events (subscription created, updated, cancelled, expired, failed) (2026-04-11)
- [ ] **LemonSqueezy configuration**: Set env vars on Vercel (LEMONSQUEEZY_API_KEY, STORE_ID, VARIANT_ID, WEBHOOK_SECRET)
- [ ] **Subscription management page**: Let users view/cancel their subscription from dashboard

## Chatbot

- [ ] **Fix chatbot** — not working as of 2026-04-11, needs debugging
- [ ] **Account management via chatbot**: Answer questions about user's account tier, next payment date, how to unsubscribe
- [ ] **Customer support via chatbot**: Handle claims for payment cancellation, refunds, billing issues
- [ ] **Full customer engagement**: Make the chatbot handle all regular customer cases — easy, self-service, no friction

## Scoring & Methodology

- [ ] **Develop detailed scoring/ranking methodology**: Deep discussion with expert agents needed. Must show transparency to customers about how we rank systems, but protect proprietary methodology (don't give away everything for free). Balance: show enough to build trust, keep the secret sauce proprietary. This is a strategic decision requiring advisory board input.

## UX Fixes

- [ ] **Risk badge UX**: "High Risk" red badge is confusing when compliance scores are A/B — users don't understand why it's "high risk" if everything looks good. Fix: make risk badge clickable with explanation popup, and add hover tooltips on each compliance score letter explaining what it means and how it was assessed.

## Documentation

- [ ] **Retro-documentation of the site**: Document current architecture, features, data model, APIs, deployment, and configuration

## DevOps & Quality

- [ ] **QA Bot (continuous loop)** (2026-04-11): Autonomous bot monitored via Telegram that continuously tests the site from UX/customer perspective. Finds usability issues, missed translations, broken UX, degraded experiences. Maintains a defects log. Dev agent picks up fixes twice daily. Continuous loop: test → log defects → fix → retest → close.
- [ ] **Content Quality Agents** (2026-04-11): Each domain expert agent (CTO, CISO, DPO, etc.) continuously monitors site content in their area and suggests improvements/refinements to improve quality. Not just testing — actively enriching and refining content.
- [ ] **Tester Agent** (2026-04-11): Autonomous testing agent — functional tests, broken links, forms, performance, mobile
- [ ] **UI/UX Improvement Agent** (2026-04-11): Continuously crawl site, find UX issues, accessibility gaps, suggest fixes
- [x] **Telegram Bot for Status Updates** (2026-04-11): Done — scripts/telegram-notify.sh, hourly cron active

## Expert Agent Panel (Advisory Board) — PRIORITY

- [~] **Multi-agent expert collaboration system**: 11 domain-expert agents (CTO, CISO, DPO, CFO, Legal, HR, Procurement, Ops, Risk, PMO, Business) that collaborate, debate, and bring their domain perspective to decisions
- [ ] Each agent speaks in user's tone/voice — "digital me" with domain expertise
- [ ] Agents discuss via shared log, visible to user via Telegram
- [ ] When agents disagree, user decides as CEO via Telegram response
- [ ] Domains: Technology, Security, Data/Privacy, Risk/Compliance, Operations, Procurement, HR/Change, Finance, Legal, Project Delivery, Business Stakeholders

## Ideas Inbox
> Add new ideas here — will be triaged into the sections above

---

## Completed
<!-- Move completed items here with date -->
