# Operations Guide — Human Edition

This is the plain-English explanation of how AI Compass EU runs. It covers what the platform does, who does what, how content moves from raw data to a published page, and what the daily, weekly, and monthly rhythms look like. If you are an operator, an investor, an auditor, or a new team member, start here.

For the machine-executable version of the same operations (commands, decision trees, exact triggers), see [OPERATIONS-AGENT.md](OPERATIONS-AGENT.md).

---

## 1. What the platform actually is

AI Compass EU is a procurement intelligence platform for European decision-makers — DPOs, CISOs, CROs, and procurement leads — who need to evaluate AI tools against EU regulations (AI Act, GDPR, DORA, EBA/EIOPA guidelines, MDR/IVDR, national strategies).

The product is **anti-vendor-pitch**: every claim about a vendor is backed by a quoted excerpt from a primary source (the vendor's own trust centre, security page, or DPA), with a date and a "report outdated" link. The buyer should never have to take the platform's word for anything.

Concretely, the site offers:

- A **catalog of ~65–90 AI systems** with structured assessments across compliance, security, vendor maturity, data sovereignty, and AI transparency.
- A **library of regulatory frameworks** (sections, statements, effective dates, penalties).
- **Decision tools**: a comparison matrix, a compliance checklist generator, an RFP answer engine, a vendor podium (top 3 picks), a business case generator.
- **A multilingual experience** in English, French, German, Spanish, and Italian (the dictionary infrastructure is built for further EU languages).
- **A Pro tier (€19/month)** unlocking all assessments, comparison, exports, the personalized dashboard, and tailored alerts. Free tier shows the top 5 vendors. Enterprise (custom, ~€199/mo+) adds the API, SSO, multi-seat, and consulting.

---

## 2. Who runs the platform

There are three roles, layered:

### 2.1 The CEO (you)
Strategic decisions only: rebrand, pricing, launch sequencing, scoring methodology changes, vendor flagged for legal risk. The CEO is reachable via Telegram and is the final authority on anything that touches positioning or revenue.

### 2.2 The expert panel (AI personas)
A panel of 11–14 domain experts — CTO, CISO, DPO, CRO, VP Ops, CPO, CHRO, CFO, General Counsel, PMO, COO, CMO, VP Sales, Social Lead — implemented as Claude personas. They are convened for cross-functional decisions through `/brainstorm` or by Telegram. They produce a transcript, a consensus, the dissents, and a recommended call. They do not decide; they advise.

### 2.3 The agent fleet (autonomous workers)
Day-to-day operations are run by AI agents. They handle:

- Discovering new vendor sources, fetching trust-centre pages, extracting claims, surfacing them for review.
- Translating new UI strings and reports into the five active locales.
- Ingesting RSS news every 6 hours and triaging entries.
- Convening expert panels when a decision is needed.
- Notifying the CEO via Telegram when input is required.
- Running QA on content, copy, and broken links.

This guide is what they read to know what to do.

---

## 3. How a piece of content gets onto the site

This is the single most important workflow to understand. The same lifecycle applies to vendor data, regulatory framework content, reports, and news entries — with small variations.

### 3.1 The evidence pipeline (vendors)

A vendor goes from "we should add them" to "live on the public site" in seven stages:

1. **Seed.** The vendor is added to a seed file (`src/data/seed-vendors.ts` or a wave file). At this point the system exists in the database but is `status=draft` — invisible to visitors.

2. **Discover.** A script (`evidence:discover`) walks the public web looking for the vendor's trust centre, security page, DPA, sub-processor list, and certification pages. URLs land in the `Source` table.

3. **Fetch.** A weekly cron (or manual `evidence:fetch`) pulls each registered URL, strips HTML to clean text, computes a SHA-256 hash, and writes a `SourceSnapshot`. If the hash matches the previous snapshot, nothing else happens — a cost-saving guard.

4. **Extract.** When a snapshot is new or changed, the extractor (`evidence:extract`) sends the raw text to Claude with a prompt asking for ~50 structured fields (does the vendor offer EU residency? Which certifications? Does the contract include SCCs? Is training data used for the customer's data?). Crucially, every claim Claude produces must include an `evidenceQuote` — a verbatim excerpt from the source. The server then verifies that quote actually appears in the source text and drops the claim if it doesn't. This is the anti-hallucination layer.

5. **Analyst review.** Drafts land in `/admin/evidence` ranked by confidence. A human (or trusted agent) approves, edits, or retires each claim. High-confidence drafts (>80%) can be bulk-promoted with a safety gate that skips conflicts.

6. **Publish.** Once enough claims are published for the vendor, an admin flips `AISystem.status=published` and the system appears on `/database`. The detail page is rebuilt with verified-claim chips: each fact links to the source URL, shows the date, shows the quoted excerpt on hover.

7. **Re-verify.** Every 90 days, the system flags the vendor for re-verification. The next weekly fetch will detect any source changes and create review tasks. This keeps the catalog from rotting.

The key invariant: **no claim ever appears on a public page without a quote-verified evidence trail and a human approval.**

### 3.2 The translation gate

Once content is ready in English, it cannot ship to one locale without shipping to all five. A `prebuild` hook runs `i18n:check`, which validates:

- Every key in `en.json` exists and is non-empty in `fr`, `de`, `es`, and `it`.
- Placeholders (`{count}`, `{date}`) match across translations.
- Reports in `src/data/reports/{locale}.json` exist for every locale.
- Priority pages use `generateMetadata({ params })` (dynamic, dictionary-backed) instead of static `export const metadata`.
- Files on the scan list contain no hardcoded English JSX of three or more words.

When a new string is added, the workflow is: edit `en.json` → run `i18n:translate` (DeepL fills the others) → run `i18n:check` → commit all five dictionary files together. CI runs the same check on every PR.

If DeepL is unavailable, the fallback mode copies English as a placeholder and marks it `untranslated` so the next backfill picks it up.

### 3.3 News and regulatory updates

Every 6 hours a Vercel cron pulls RSS sources registered at `/admin/sources`. New entries land in `NewsFeedEntry` with a draft state. An admin (or the agent running the news monitor) triages each one: post to the public newsfeed, rephrase for clarity, or ignore. Newsworthy items that affect a specific vendor also create a `ReviewTask` so the catalog stays in sync.

---

## 4. The shape of the site

The public site is locale-aware: every URL starts with `/en/`, `/fr/`, `/de/`, `/es/`, or `/it/`. Inside each locale, the routes are:

- **Discovery**: `/`, `/database`, `/regulations`, `/industries`, `/newsfeed`
- **Detail pages**: `/systems/[slug]`, `/regulations/[slug]`, `/industries/[slug]`, `/reports/[slug]`
- **Decision tools**: `/compare`, `/checklist`, `/rfp-engine`, `/vendor-prep`, `/business-case`, `/podium`
- **Account & commerce**: `/pricing`, `/subscribe`, `/account`, `/dashboard`
- **Trust & policies**: `/about`, `/methodology`, `/methodology/sourcing`, `/ratings`, `/privacy`, `/security`, `/incident-response`, `/terms`, `/contact`, `/services`

The admin lives at `/admin` (TOTP-protected) and is structured around the data model: systems, frameworks, sections, statements, industries, sources, evidence, changelog, news monitor, expert panel, subscribers, customers, cases, feedback, chat, team.

The technical architecture and complete schema are documented in [TECHNICAL-DOCUMENTATION.md](TECHNICAL-DOCUMENTATION.md). This guide does not duplicate that.

---

## 5. The daily, weekly, monthly rhythm

### Daily (autonomous; agents run; CEO sees Telegram summaries)

- Check the news ingest for the last 24 hours and triage any high-signal entries.
- Process any draft claims in the evidence review queue that crossed the high-confidence threshold overnight.
- Poll Telegram for CEO replies and act on them.
- Run a snapshot of platform stats (systems / sources / snapshots / drafts) and post if anything moved materially.
- Pick the top P0 from `TODO.md` and execute.

### Weekly

- Vercel cron fires the evidence fetcher on Monday at 05:00 UTC. The agent watches the run, checks for new snapshots, kicks off extraction.
- Veille / news monitor review (`/review-veille`): post / rephrase / ignore the week's news findings.
- QA pass on a rotation: one of the domain experts (CTO this week, DPO next, CRO the week after) reviews their domain's content for accuracy.
- Translation backfill if any new strings have been merged.

### Monthly

- Cost reconciliation: Anthropic, DeepL, Resend, Vercel, LemonSqueezy fees. The target steady state is a few dollars on Anthropic, free tiers on DeepL and Resend, Vercel included, and LemonSqueezy taking 5–8% of revenue.
- Vendor freshness sweep: any system whose last evidence verification is >90 days old gets re-verified.
- Expansion pass: pick the next batch of vendors from the P0 wave list (Celonis, Dataiku, Automation Anywhere, etc.) and run them through the pipeline.
- Subscriber digest: send the monthly digest to opted-in subscribers.

### Quarterly

- Methodology review: are the scoring formulas still right? Has any framework changed materially?
- Pricing review: are the tiers still defensible? Has the gross margin shifted?
- Strategic review with the expert panel: convene a brainstorm on positioning, GTM, roadmap.

---

## 6. How decisions get made

The platform has a clear escalation ladder.

**Routine content & data decisions** — what to claim about a vendor, whether a translation reads correctly, which news item to publish — are made by agents directly, with the evidence pipeline and the i18n gate as guardrails.

**Cross-functional or judgment-call decisions** — should we change the scoring weight on data sovereignty? Is this vendor's ToS a legal red flag? Should we ship a feature flag now or wait? — go to the **expert panel**. The panel is convened by `/brainstorm <topic>` or by sending `brainstorm: <topic>` to Telegram. The 3–5 most relevant personas debate, surface dissents, and recommend a call. The transcript is stored in the database for audit.

**Strategic decisions** — rebrand, pricing change, take outside investment, hire, fire, kill a feature — go to the **CEO**. The agent surfaces the question via Telegram with explicit options. It does not block waiting for an answer; it logs the question, continues with the next task, and resumes the blocked work when the CEO replies.

The rule: **the agent is allowed to do anything reversible without asking, and must ask before doing anything irreversible.**

---

## 7. The trust model (why anyone should believe us)

The platform's defensibility rests on three promises, in order:

**Promise 1: Every claim is sourced.** When a buyer reads "Salesforce Einstein offers EU data residency", they can click the chip and see the verbatim sentence from Salesforce's trust centre, the URL, and the date the platform last verified it. This is what makes the platform an alternative to Gartner-style vendor self-reporting.

**Promise 2: Every claim has a freshness date.** A buyer should never see a stale claim presented as current. Stale claims are flagged. The 90-day re-verify cycle is the enforcement mechanism.

**Promise 3: Every claim is challengeable.** A "report outdated" link is wired into every claim chip. A buyer who knows better can submit a correction. The submission goes into the review queue.

Together, these are what the methodology page is meant to communicate (the page rewrite is currently a launch-gate task — see TODO.md).

---

## 8. Money

### Revenue

- **Free**: 5 vendors, basic features. Lead-gen for Pro.
- **Pro €19/month**: full catalog, comparison, exports, dashboard, alerts. Target customer: an individual DPO/CISO/CRO at a mid-market European firm.
- **Enterprise (custom, anchor €199/mo)**: API, SSO, multi-seat, consulting. Target customer: large European banks, insurers, public-sector buyers.
- **Education courses**: planned upsell (not live).
- **Referral revenue from vendors**: explicitly *not* part of the model. The platform must remain unbought to retain trust.

### Costs

- Anthropic API (extraction, chat, business case, podium, RFP): low — target a few dollars per month at steady state.
- DeepL: free tier (500K characters/month) covers normal translation churn.
- Resend: free tier (3K emails/month) covers magic-link auth and digests in early growth.
- Vercel: included in the standard plan.
- LemonSqueezy: 5–8% on Pro revenue (Merchant of Record handles EU VAT; this is the trade-off for not running our own VAT compliance).

### Payments

LemonSqueezy is the primary processor (MoR for VAT). Stripe is wired in parallel as a backup. Webhooks update `Subscriber.tier` in real time. Failed payments mark the subscription as past-due; the dashboard prompts the user to update.

---

## 9. What is currently broken or unfinished

Honesty matters here — these are real, as of 2026-04-26:

1. **Evidence backbone is partially complete.** Many vendors have draft claims pending review; some still need first-pass extraction. This is the launch gate.
2. **The methodology page needs a rewrite** to lean fully into the three promises above.
3. **The Business Case Generator is broken and hidden from the nav.** Slated for repair as a consulting product.
4. **GDPR data export is manual** (admin runs it on request). It needs to be a self-service endpoint.
5. **Translation debt**: about 20 hardcoded English strings still live on the pricing, methodology, reports, regulations, and industries pages. They will be migrated as those paths are added to the i18n scan list.
6. **Three customer-development calls** with target buyers (DPO / CISO / procurement) are blocking paid acquisition.
7. **The domain and final brand** (currently ai-compass.eu) are pending a CEO decision.
8. **Autonomous QA bots** (continuous testing, broken-link sweeps, translation drift detection, mobile/perf testing, UX-improvement crawl) are designed but not built. Today, QA happens through scheduled domain-expert reviews and manual checks logged in `qa/`.

`TODO.md` is the live backlog. `qa/defects.md` is the live bug log. `qa/content-suggestions.md` is the live content review log.

---

## 10. Where to find the canonical answer

This guide is a map. The canonical answers live in code and structured documents:

- **What the tech stack is, how to run it locally** — [DEVELOPER.md](../DEVELOPER.md), [AGENTS.md](../AGENTS.md)
- **How translation works** — [CLAUDE.md](../CLAUDE.md)
- **The full architecture and database schema** — [TECHNICAL-DOCUMENTATION.md](TECHNICAL-DOCUMENTATION.md)
- **What's on the backlog and in what order** — [TODO.md](../TODO.md)
- **Known defects** — [qa/defects.md](../qa/defects.md)
- **How an agent should execute any of the above** — [OPERATIONS-AGENT.md](OPERATIONS-AGENT.md)
- **What the scoring formulas actually are** — [src/lib/scoring.ts](../src/lib/scoring.ts)
- **What features each tier unlocks** — [src/lib/tier-access.ts](../src/lib/tier-access.ts)
- **Who the expert personas are** — [src/lib/expert-panel.ts](../src/lib/expert-panel.ts)

If this guide and the source disagree, the source wins. Update the guide.

---

## 11. A one-paragraph elevator version

AI Compass EU is a procurement intelligence platform that rates AI tools against EU regulations using only verifiable, quote-cited evidence from each vendor's own public materials. The site is operated by a fleet of AI agents working under a CEO, with an expert panel of domain personas (CTO, CISO, DPO, CRO, CFO, etc.) advising on cross-functional decisions. Content flows through a strict pipeline — discover → fetch → extract → review → publish → re-verify every 90 days — with translation parity across five EU languages enforced as a hard build gate. Revenue comes from a Free / Pro €19 / Enterprise tiered subscription, with LemonSqueezy as merchant of record. The platform's defensibility is the trust model: every claim is sourced, every claim is dated, every claim is challengeable.
