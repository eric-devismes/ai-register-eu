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
- [x] UiPath Maestro (2026-04-11)
- [x] CrowdStrike Falcon AI (2026-04-11)
- [x] Darktrace (2026-04-11)
- [x] Palo Alto Networks Cortex XSIAM (2026-04-11)
- [x] Glean Enterprise Search (2026-04-11)

### Priority 2: Add Missing Major Systems
- [x] Cohere (enterprise LLM) (2026-04-11)
- [x] Adobe Firefly / Sensei (2026-04-11)
- [x] Zoom AI Companion (2026-04-11)
- [x] Slack AI (2026-04-11)
- [x] Atlassian Intelligence (2026-04-11)
- [x] HubSpot AI (2026-04-11)
- [x] Zendesk AI (2026-04-11)
- [x] Freshworks Freddy AI (2026-04-11)
- [x] Monday.com AI (2026-04-11)
- [x] Canva AI (2026-04-11)
- [x] Figma AI (2026-04-11)
- [x] Grammarly Business (2026-04-11)
- [x] Jasper AI (2026-04-11)
- [x] Notion AI (enriched) (2026-04-11)
- [x] Perplexity (enriched) (2026-04-11)
- [x] DeepSeek (enriched) (2026-04-11)

### Priority 3: Sector-Specific Systems
- [x] Healthcare: Tempus AI, PathAI, Paige AI, Viz.ai (2026-04-11)
- [x] Legal: Harvey AI, CoCounsel (Thomson Reuters) (2026-04-11)
- [x] Finance: Bloomberg GPT, Kensho, Ayasdi/SymphonyAI (2026-04-11)
- [x] Manufacturing: Siemens Industrial Copilot (enrich), Cognite, Uptake (2026-04-11)
- [x] HR: Eightfold AI, Beamery, Phenom (2026-04-11)

---

## Content Enrichment — Regulatory Frameworks

### Deepen Existing Frameworks
- [x] EU AI Act: add 2025-2026 enforcement timeline, prohibited practices detail (2026-04-11)
- [x] GDPR: add practical procurement compliance checklist (2026-04-11)
- [x] DORA: add vendor assessment template guidance (2026-04-11)
- [x] EBA/EIOPA: add model risk management deep-dive (2026-04-11)
- [x] MDR/IVDR: add SaMD classification decision tree (2026-04-11)
- [x] National AI Strategies: add more countries (Spain, Italy, Nordic, Poland) (2026-04-11)

### Add New Frameworks/Standards
- [x] NIS2 Directive (cybersecurity) (2026-04-11)
- [x] Data Act (data sharing obligations) (2026-04-11)
- [x] Digital Services Act / Digital Markets Act (2026-04-11)
- [x] ISO 42001 (AI management systems) (2026-04-11)
- [x] NIST AI RMF (US framework, global relevance) (2026-04-11)

### Cross-Framework Intelligence
- [x] GDPR ↔ AI Act mapping (which articles relate) (2026-04-11)
- [x] DORA ↔ NIS2 overlap guidance (2026-04-11)
- [x] Compliance checklist generator per framework combo (2026-04-11)

---

## Platform Features

- [x] Enhance chat/RAG with richer seed data context (2026-04-11) — 25+ enriched fields in context, 8000 char limit, 512 token responses
- [x] Role-based drill-down views (CISO, DPO, Architect, Procurement) (2026-04-11) — integrated into system detail pages
- [x] Comparison tool improvements with enriched data (2026-04-11) — already has 35 attributes across 7 categories
- [x] Procurement decision matrix export (2026-04-11) — /api/export?compare=slug1,slug2 with 40-row matrix

### Enterprise Tier — Procurement Intelligence Suite
- [x] **Business Case Generator**: ROI/TCO business cases with 9 sections, Pro+ tier gate (2026-04-11)
- [x] **RFI/RFP Answer Engine**: paste up to 20 questions, select AI systems, get AI-generated draft answers. Enterprise tier gate. (2026-04-11)
- [x] **Podium Recommendations**: Gold/Silver/Bronze top-3 AI system picker with fit scoring, strengths/weaknesses, risk flags. Pro+ tier gate. (2026-04-11)
- [x] **Vendor Discussion Prep**: talking points per attendee role, negotiation leverage, red flags, compliance checklist, follow-up actions. Pro+ tier gate. (2026-04-11)

---

## Payments & Subscriptions

- [x] **LemonSqueezy integration**: Checkout + webhook routes built (2026-04-11)
- [x] Wire up subscription tiers (Free / Pro / Enterprise) to LemonSqueezy checkout (2026-04-11)
- [x] Handle webhooks for payment events (subscription created, updated, cancelled, expired, failed) (2026-04-11)
- [ ] **LemonSqueezy configuration**: Eric to create product in LS dashboard, then set env vars on Vercel (API_KEY, STORE_ID, VARIANT_ID, WEBHOOK_SECRET)
- [x] **Subscription management page**: Let users view/cancel their subscription from dashboard (2026-04-11)

## Chatbot

- [~] **Fix chatbot** — code fixes applied (API key trim, label fix). Root cause: ANTHROPIC_API_KEY empty or has trailing whitespace in Vercel. Eric: verify key in Vercel dashboard.
- [x] **Account management via chatbot**: Detects account/billing questions, injects subscriber context (tier, status, actions) (2026-04-11)
- [x] **Customer support via chatbot**: Handles cancellation, refunds, billing with support policies in context (2026-04-11)
- [x] **Full customer engagement**: Chatbot answers account/billing/support + regulatory questions, with fuller responses (512 tokens) (2026-04-11)

## Scoring & Methodology

- [ ] **Develop detailed scoring/ranking methodology**: Deep discussion with expert agents needed. Must show transparency to customers about how we rank systems, but protect proprietary methodology (don't give away everything for free). Balance: show enough to build trust, keep the secret sauce proprietary. This is a strategic decision requiring advisory board input.

## UX Fixes

- [x] **Risk badge UX**: "High Risk" red badge is confusing when compliance scores are A/B — users don't understand why it's "high risk" if everything looks good. Fix: make risk badge clickable with explanation popup, and add hover tooltips on each compliance score letter explaining what it means and how it was assessed. (2026-04-11)
- [x] **Header UI overhaul**: Taller utility bar, proper spacing between sign-in and language switcher, "Log in" instead of "Sign in", flat-design SVG flags replacing emoji flags (2026-04-11)
- [x] **Profile bubble**: Logged-in users see initials avatar (e.g. "ED") with dropdown: Profile, Preferences, Subscription, Export Data, Upgrade to Pro, Log out (2026-04-11)

## Compliance & Security

- [x] **Self-assessment**: AI Compass EU rated itself — Risk: Minimal, EU AI Act B+, GDPR B+, DORA B-, NIS2 C+ (2026-04-11)
- [x] **Security policy page** (/security): ICT risk management, supply chain assessment, encryption, NIS2 alignment (2026-04-11)
- [x] **Incident response plan** (/incident-response): P1-P4 classification, SLAs, DORA/NIS2/GDPR reporting obligations (2026-04-11)

## Documentation

- [x] **Retro-documentation of the site**: Document current architecture, features, data model, APIs, deployment, and configuration (2026-04-11)

## DevOps & Quality

- [ ] **QA Bot (continuous loop)** (2026-04-11): Autonomous bot monitored via Telegram that continuously tests the site from UX/customer perspective. Finds usability issues, missed translations, broken UX, degraded experiences. Maintains a defects log. Dev agent picks up fixes twice daily. Continuous loop: test → log defects → fix → retest → close.
- [ ] **Content Quality Agents** (2026-04-11): Each domain expert agent (CTO, CISO, DPO, etc.) continuously monitors site content in their area and suggests improvements/refinements to improve quality. Not just testing — actively enriching and refining content.
- [ ] **Tester Agent** (2026-04-11): Autonomous testing agent — functional tests, broken links, forms, performance, mobile
- [ ] **UI/UX Improvement Agent** (2026-04-11): Continuously crawl site, find UX issues, accessibility gaps, suggest fixes
- [x] **Telegram Bot for Status Updates** (2026-04-11): Done — scripts/telegram-notify.sh, hourly cron active

## Expert Agent Panel (Advisory Board) — PRIORITY

- [x] **Multi-agent expert collaboration system**: 11 domain-expert agents that debate topics in natural chat-style conversation. Two channels: Claude Code (/brainstorm slash command) and Telegram (async). Output reads like a real chat history with timestamps, names, and brief arguments. (2026-04-12)
- [x] Expert profiles defined with domain expertise and system prompts (2026-04-12)
- [x] Agents discuss in plain human language — polite, brief, no flattery, no interrupting (2026-04-12)
- [ ] Telegram async integration — start discussions from Telegram, get chat-style output, reply with CEO decision

## Admin Panel

- [x] **Redesign admin customer management**: Merged into /admin/customers with 2 tabs, inline editing, company drill-down (2026-04-11)
- [x] **Admin: inline record editing**: Edit subscriber fields directly from the admin panel (2026-04-11)
- [x] **Admin: company drill-down**: Click a company to see all users belonging to it (2026-04-11)

## Newsfeed & Content Pipeline

- [x] **Automated News Monitoring System**: 27 RSS sources + Grok/xAI Twitter scanner. Pipeline: fetch → keyword filter → dedup → LLM classify → ingest. Admin dashboard at /admin/news-monitor. (2026-04-11)
- [x] **News Source Configuration**: 27 sources — EU official (EUR-Lex, EDPB, ENISA, EC), DPAs (CNIL, BfDI, AEPD, ICO, Garante), standards (ISO, NIST), vendors (OpenAI, Anthropic, Google, Microsoft, Mistral, Meta, AWS, Salesforce, IBM), press (Euractiv, IAPP, TechCrunch, Wired, Reuters, AI Act Blog). (2026-04-11)
- [x] **Auto-tagging & Classification**: LLM classifies relevance 0-100, assigns changeType, tags frameworks + AI systems, generates plain-language actionable summaries. (2026-04-11)
- [x] **Grok/xAI Twitter Scanner**: Attempted but disabled — Grok produces hallucinated URLs and unverifiable content even with x_search grounding. (2026-04-11)
- [ ] **Review news sourcing strategy**: Don't add Google/Perplexity/Tavily. Board consensus: expand RSS to 60+ sources (missing DPA newsrooms, CJEU case law, national AI committee feeds, EDPS, AI Office). RSS is free, primary sources, no noise. Only add a search API when paying customers ask for it. (2026-04-12)
- [ ] **Expand RSS sources**: Add ~30-40 missing EU/EEA sources — remaining DPAs (we cover 5 of 30), national AI strategy pages, CJEU case law feed, EDPS newsletter, AI Office updates, parliamentary committee feeds. (2026-04-12)
- [ ] **Gate newsfeed as lead magnet**: Keep newsfeed page public (SEO), but gate the curated daily digest email behind email signup. Builds email list for nurturing toward paid tiers. (2026-04-12)

---

## Revenue & Business Model

- [ ] **Referral revenue model**: When a customer chooses an AI system based on our assessment, get referral commission from that AI vendor. Research affiliate/referral programs from major AI vendors (OpenAI, Anthropic, Microsoft, Google, etc.). (2026-04-11, from Telegram)
- [ ] **Hide consulting offering**: Remove or downplay consulting/enterprise tier until CEO leaves current employment. Don't advertise services we can't deliver yet. (2026-04-11, from Telegram)
- [ ] **Pitch deck — multiple audiences**: Build pitch materials suited to (a) enterprise customers evaluating the platform, (b) potential acquirers, (c) strategic partners. Not investors/angels — injecting funds wouldn't dramatically change what the site can do. (2026-04-11, from Telegram)

## Translation & Localisation

- [ ] **CORE RULE — Translation is non-negotiable**: Every page, every feature, every piece of content MUST be published in ALL supported languages simultaneously. Content is NOT published in English if it's not published in every other language. Make this part of every publishing workflow. (2026-04-11, from Telegram)

## Risk & Compliance (Internal)

- [ ] **Risk assessment for running the site**: Identify operational, legal, reputational, financial risks of operating AI Compass EU. Include remediation plan, controls, and metrics to measure risk. (2026-04-11, from Telegram)

---

## Ideas Inbox
> Add new ideas here — will be triaged into the sections above
> Every user message is captured here immediately.

- (2026-04-11) "everytime i say something, add it to the todo immediately" — Standing rule: capture all user messages as TODO items instantly
- (2026-04-11) "In the message at the bottom it is said we used cookies. Is that true? are cookies actually created on the user computer?" — DONE: Audited, 4 essential cookies only, no tracking.
- (2026-04-11) "i can think of getting domain name send email to people to register, connect to lemonfizzy as next steps" — Eric's next steps: (1) Get/configure domain name, (2) Send launch emails to get registrations, (3) Connect LemonSqueezy for payments
- (2026-04-11) "also need a system to continuously monitor news and feed the news feed" — DONE: Automated news monitoring pipeline built.
- (2026-04-11) "At the bottom of the home page, there are 2 sections with disclaimer. I'd prefer it to be consolidated in 1 section with 2 disclaimers" — DONE: Merged footer disclaimers.
- (2026-04-11) "blue on grey is not visible. Use a visible color" — DONE: Changed chatbot link color to gold (#ffc107).
- (2026-04-11, Telegram) "The site is live, but not fully working and it has not been advertised. I'd like a risk assessment for me to run this site" — Added to Risk & Compliance section.
- (2026-04-11, Telegram) "Remediation plan to address those risks effectively and controls in place to mitigate and metrics to measure these risks" — Added to Risk & Compliance section.
- (2026-04-11, Telegram) "Can you build a pitch I can use with a customer or with a potential company that would want to acquire the company?" — Added to Revenue & Business Model section.
- (2026-04-11, Telegram) "I find it irrelevant to pitch to business angel as injecting funds would not dramatically change what the site can do" — Noted in pitch deck task.
- (2026-04-11, Telegram) "Setup a process of continuous technology watch on regulations, enterprise AI experience, AI models update, AI software updates" — Covered by Newsfeed & Content Pipeline.
- (2026-04-11, Telegram) "Later business could be referral. If a customer chooses an AI software based on my site assessment I could get money from that AI vendor" — Added to Revenue & Business Model section.
- (2026-04-11, Telegram) "Hide the consulting part. Because really I don't have time for that as long as I am still employed" — Added to Revenue & Business Model section.
- (2026-04-11, Telegram) "Language is a critical value add from my site. I really want all pages and all content to be translated professionally in all languages" — Added as CORE RULE in Translation section.

---

## Completed
<!-- Move completed items here with date -->
