# Operations Runbook — Agent Edition

This is the autonomous-execution guide for AI agents operating the VendorScope platform. It is structured for machine consumption: decision trees, exact commands, exit criteria, failure modes.

For a narrative human-readable version of the same operations, see [OPERATIONS-HUMAN.md](OPERATIONS-HUMAN.md).
For prerequisite reading: [AGENTS.md](../AGENTS.md), [CLAUDE.md](../CLAUDE.md), [DEVELOPER.md](../DEVELOPER.md), [TECHNICAL-DOCUMENTATION.md](TECHNICAL-DOCUMENTATION.md).

---

## 0. Operating principles

1. **Evidence before publication.** No claim ships to a public page without a `SystemClaim` row whose `evidenceQuote` was server-verified against `SourceSnapshot.rawText`. If you cannot cite, do not publish.
2. **Translation parity is a hard gate.** All 5 active locales (en, fr, de, es, it) ship together. The `prebuild` hook runs `i18n:check` and blocks the build on failure. Never bypass.
3. **Cost guards are not optional.** The evidence extractor has a `--max 150` default and hash-skip — both protect the Anthropic budget. Override (`--force`) only with an explicit budget check.
4. **Two-way human escalation goes through Telegram.** When you are blocked on a judgment call (rebrand, pricing, vendor flagged for legal risk), call `scripts/telegram-notify.sh` with buttons. Do not block on the response — record the question and proceed to the next task.
5. **All durable state lives in Postgres.** No flat-file caches, no JSON sidecars. The only on-disk persistence are dictionaries (`src/dictionaries/*.json`), reports (`src/data/reports/{locale}.json`), seed files, and admin-managed assets.

---

## 1. Triggers and entry points

### 1.1 Vercel cron (production, automatic)

Defined in `vercel.json`. Agents do not invoke these directly — they fire from production:

| Path | Schedule (UTC) | Purpose | Auth |
|------|----------------|---------|------|
| `/api/admin/news-ingest` | `0 */6 * * *` (every 6h) | Pull RSS sources, populate `NewsFeedEntry` | `CRON_SECRET` header |
| `/api/admin/evidence-fetch` | `0 5 * * 1` (Mon 05:00 UTC) | Crawl trust-center URLs, snapshot diffs | `CRON_SECRET` header |

**Agent action if a cron is failing:** check Vercel logs → identify the specific endpoint → run the same logic locally via the matching `npm run` script (see §2) → file the diagnosis in `qa/defects.md` → notify via Telegram if production-impacting.

### 1.2 GitHub Actions (CI gate)

`.github/workflows/i18n.yml` — runs `npm run i18n:check` on every PR to main and on push. **Failure blocks merge.** Agents must repair before merging.

`.github/workflows/pages.yml` — static-content backup deploy. Non-blocking.

### 1.3 Telegram webhook (always-on)

`/api/telegram/webhook` accepts:
- `todo: <text>` — appends to TODO.md backlog
- `brainstorm: <topic>` — convenes expert panel (see §6)
- Free text — Claude Haiku replies with platform context (TODO, recent discussions, stats)

### 1.4 Slash commands (manual / agent-invoked)

| Command | File | Purpose |
|---------|------|---------|
| `/advisory-board` | `.claude/commands/advisory-board.md` | Route a question to relevant domain experts |
| `/brainstorm` | `.claude/commands/brainstorm.md` | 14-expert debate (chat-style transcript) |
| `/review-veille` | `.claude/commands/review-veille.md` | Triage news monitoring findings (post / rephrase / ignore) |

---

## 2. Command reference

All commands assume working dir `/Users/ericdevismes/Documents/Claude-Work/PROJECTS/ai-register-eu`, Node 22 via nvm, and `.env.local` populated.

> **Important env quirk** (memory: `reference_env_loading.md`): the Bash tool's shell pre-seeds `ANTHROPIC_API_KEY=""`. Prefix any LLM-touching script with `unset ANTHROPIC_API_KEY &&` before invocation, otherwise dotenv won't pick up the real key.

### 2.1 Translation gate

```bash
npm run i18n:check          # validate; exit 0 = clean, 1 = errors
npm run i18n:translate      # backfill missing keys via DeepL (needs DEEPL_API_KEY)
node scripts/i18n-translate.js --fallback   # emergency: copy English as placeholders
```

**Exit-1 categories** (severity = error, blocks build):
- `dictionary:missing-key`, `dictionary:empty`, `dictionary:placeholders`, `dictionary:missing-file`
- `reports:missing-locale`, `reports:missing-slug`
- `metadata:hardcoded`, `jsx:hardcoded-english`

**Warnings** (don't block but should be cleared): `dictionary:untranslated`, `dictionary:extra-key`.

**Decision tree on failure:**
1. Missing key → add to all 5 locales (or run `i18n:translate`).
2. Hardcoded JSX → wrap in `t("key")`, add the key to `en.json`, backfill.
3. New page added to scan list (`scripts/i18n-scan-paths.txt`) → triage every English string before committing.
4. DeepL out of quota / no key → use `--fallback` to unblock, then file a TODO to backfill once quota resets.

### 2.2 Evidence pipeline

```bash
unset ANTHROPIC_API_KEY && npm run evidence:discover   # find new vendor URLs
unset ANTHROPIC_API_KEY && npm run evidence:fetch      # snapshot trust centres (hash-skip)
unset ANTHROPIC_API_KEY && npm run evidence:extract    # LLM extract claims (max 150, hash-skip)
unset ANTHROPIC_API_KEY && npm run evidence:extract -- --force --max 50   # re-extract subset
```

**Pipeline order** (hard dependency): `discover` → `fetch` → `extract` → human review at `/admin/evidence`.

**Cost guards** (do not disable without notifying via Telegram):
- Fetcher: SHA-256 content hash; skips LLM call if `SourceSnapshot.contentHash` matches latest.
- Extractor: hash-skip on already-extracted snapshots + `--max N` cap (default 150).
- Steady-state cost target: $1–2/month. Backlog cost: ~$2–3 per 355-snapshot run.

**Pause/resume protocol:** if Anthropic credits exhaust mid-run, the extractor logs the last-completed snapshot ID. To resume, just re-run `npm run evidence:extract` — hash-skip will skip already-done items.

### 2.3 Diagnostic / maintenance scripts

```bash
npx tsx scripts/check-progress.ts        # systems/sources/snapshots/draft counts
npx tsx scripts/pending-check.ts         # list pending extraction work
npx tsx scripts/list-open-tasks.ts       # extract TODO items from markdown
npx tsx scripts/triage-fetch-errors.ts   # categorise failed fetches
npx tsx scripts/check-dupes.ts           # duplicate detection
npx tsx scripts/consolidate-dupes.ts     # merge duplicates
npx tsx scripts/reset-unclaimed-sources.ts   # clear orphaned source assignments
npx tsx scripts/peek-snapshot.ts <id>    # debug a specific snapshot
npx tsx scripts/diag-agents.ts           # expert-panel diagnostics
```

### 2.4 Telegram

```bash
./scripts/telegram-notify.sh "msg"
./scripts/telegram-notify.sh "Pick one:" --buttons "Option A|Option B|Option C"
./scripts/telegram-check.sh              # bot connectivity
./scripts/telegram-poll.sh               # read pending CEO replies
```

**Notify rules** (memory: `feedback_telegram_ux.md`):
- Buttons only when there is a real decision. No "Got it / OK" buttons on info messages.
- Lead with the consensus or recommendation, then context.
- Never block waiting for a reply — fire and continue (memory: `feedback_never_wait.md`).

---

## 3. Decision tree: what should an agent do right now?

```
START
 │
 ├─ Is `npm run i18n:check` failing?      → §2.1, repair before anything else
 │
 ├─ Is the production build red on Vercel? → check logs; if cron-related see §1.1
 │
 ├─ Is there a CEO reply waiting on Telegram? → poll, act on the answer, ack
 │
 ├─ Is the evidence extractor backlog > 50 snapshots?
 │    └─ Yes & API credits available → run `evidence:extract`
 │    └─ Yes & API credits exhausted → notify CEO, pause, log to TODO
 │
 ├─ Are there draft claims at `/admin/evidence` ready for review?
 │    └─ Yes & high-confidence > 80% → bulk-promote (admin UI, action: §5.2)
 │
 ├─ Is news ingest behind (last NewsFeedEntry > 12h old)?
 │    └─ Investigate cron, then re-run ingest endpoint
 │
 ├─ Are there content-review items in qa/content-suggestions.md?
 │    └─ Triage by domain expert (CTO/DPO/CRO/etc., see §6)
 │
 └─ Otherwise → pick top P0 from TODO.md and execute
```

---

## 4. Publishing lifecycle for site content

Every piece of content (a system, a framework, a report, a news item) flows through a fixed lifecycle. Agents must not skip stages.

### 4.1 AI System (vendor catalog entry)

```
seed → enrichment → evidence discovery → snapshot → claim extraction →
  → analyst review → published → freshness re-verify (90d)
```

| Stage | Tool | DB state | Public visibility |
|-------|------|----------|------------------|
| Seed | `src/data/seed-vendors.ts` | `AISystem.status=draft` | none |
| Enrichment | `src/data/seed-enrichment-batch*.ts`, `src/data/seed-platform-deep-*.ts` | adds fields | none |
| Discover | `npm run evidence:discover` | inserts `Source` rows | none |
| Fetch | `npm run evidence:fetch` | inserts `SourceSnapshot` rows | none |
| Extract | `npm run evidence:extract` | inserts `SystemClaim` rows with `status=draft` | none |
| Review | `/admin/evidence` UI | claim `status=published` | **factsheet sections light up** |
| Publish | flip `AISystem.status=published` | active in catalog | **listed on `/[lang]/database`** |
| Re-verify | weekly fetch detects diff → `ReviewTask` type=`source-diff` | analyst re-approves or retires | **stale claims drop off** |

### 4.2 Regulatory framework

```
admin draft → sections + statements created → published flag set → appears on /regulations
```

Edit at `/admin/frameworks` → `/sections` → `/statements`. Always set `effectiveDate`, `criteriaCount`, `issuingAuthority`, `officialUrl` before publishing.

### 4.3 Report (`src/data/reports/{locale}.json`)

```
edit en.json → run i18n:translate → run i18n:check → commit all locales
```

Auto-translated reports get `autoTranslated: true` and the detail page shows a "pending human review" banner automatically.

### 4.4 Newsfeed entry

```
RSS source registered (admin) → news-ingest cron → NewsFeedEntry row → admin triage →
  → publish or ignore → appears on /[lang]/newsfeed and homepage NewsFeed block
```

### 4.5 Changelog entry

User-facing version log. Edit at `/admin/changelog`. Used to communicate evidence refreshes, scoring changes, new vendors. Drives the "What changed for systems you follow" block on the dashboard.

---

## 5. Agent action playbooks

Each playbook is a self-contained procedure. Use them as a checklist.

### 5.1 Add a new AI system to the catalog

1. Decide vendor + slug (kebab-case, vendor-product, e.g. `databricks-mosaic-ai`).
2. Append to or create `src/data/seed-vendors.ts` (or a new `seed-wave*.ts`).
3. Run the seed script for it (`npx tsx --env-file=.env.local <seed file>`).
4. `npm run evidence:discover` to populate trust-centre URLs.
5. `npm run evidence:fetch` to snapshot.
6. `npm run evidence:extract` to draft claims.
7. Review at `/admin/evidence/[slug]`; promote high-confidence claims.
8. Set `featured: false` initially; flip to `true` only after analyst sign-off.
9. Add use-cases and industries (admin UI or seed file).
10. Set `AISystem.status='published'`.
11. If the vendor name needs to appear in UI strings, add to `scripts/i18n-glossary.json`.
12. Commit + push (Vercel auto-deploys).

**Exit criteria:** system appears on `/[lang]/database`, all 5 locales, with at least one `published` claim per visible section.

### 5.2 Process the evidence review queue

1. Open `/admin/evidence`.
2. Sort vendors by `high-confidence %` desc.
3. For vendors > 80%: click **bulk-promote** (calls `approveAllHighConfidenceDrafts()`); the safety gate skips conflicts.
4. For each conflict: open the claim, compare draft vs. published, decide: approve / edit / retire.
5. For low-confidence draft (< 60%): inspect `evidenceQuote` against original source URL → either accept (raise confidence), reject (status=retired), or escalate (open `ReviewTask`).
6. Close any `ReviewTask` rows resolved by this run.

**Exit criteria:** `SystemClaim where status='draft'` count drops; `ReviewTask where status='open'` triaged.

### 5.3 Repair a translation-gate failure

1. Run `npm run i18n:check` — read the first error.
2. If `dictionary:missing-key` → add to `src/dictionaries/en.json`, then `npm run i18n:translate`.
3. If `jsx:hardcoded-english` → open the offending file, wrap each English string in `t("...")`, add keys to `en.json`, then `i18n:translate`.
4. If `metadata:hardcoded` → convert `export const metadata = {...}` to `export async function generateMetadata({ params })` using `getPageMetadata(locale, pageKey)` from `src/lib/i18n.ts`. Add `meta.<pageKey>.title|description` to `en.json`.
5. If `reports:missing-slug` → ensure the report exists in every locale's `src/data/reports/{locale}.json`.
6. Re-run `npm run i18n:check` until clean.
7. Commit **all locale files together**.

### 5.4 Add a new UI string

1. Add to `src/dictionaries/en.json` (use a stable dotted key path).
2. In a server component: `const dict = await getDictionary(locale); dict.section.key`.
3. In a client component: `const t = useT(); t("section.key")`.
4. `npm run i18n:translate` → `npm run i18n:check`.
5. Commit all 5 dictionary files.

### 5.5 Add a new locale-aware page

1. Create `src/app/[lang]/<route>/page.tsx`.
2. Use `generateMetadata({ params })` (not `export const metadata`) and pull from `getPageMetadata(locale, pageKey)`.
3. Add `meta.<pageKey>.title|description` to `en.json`.
4. If the page is prominent: add to `PRIORITY_METADATA_PAGES` in `scripts/i18n-check.js`.
5. Wrap every JSX text in `t()` — no hardcoded strings.
6. Add to `scripts/i18n-scan-paths.txt` once clean (else the gate ignores it; adding it before triage will block the build).
7. Backfill, check, commit.

### 5.6 Restart paused evidence extraction (the `2026-04-15` scenario)

1. Confirm Anthropic credits restored (`echo $ANTHROPIC_API_KEY` in `.env.local` and account balance check).
2. `npx tsx scripts/check-progress.ts` — confirm pending count.
3. `unset ANTHROPIC_API_KEY && npm run evidence:extract` (default `--max 150`).
4. Repeat until `pending = 0` (typically 3 runs for a 355-item backlog).
5. Move to §5.2 to triage the new drafts.
6. Notify via Telegram with summary: "Backbone backfill complete: N claims drafted, M auto-promoted, K need review."

### 5.7 Convene the expert panel

Use when a cross-functional decision is needed (rebrand, pricing change, scoring methodology change, large vendor flagged for compliance risk, breaking i18n change).

```bash
# Either via Telegram:
brainstorm: <topic>

# Or via slash command:
/brainstorm <topic>

# Or via API:
POST /api/admin/expert-panel  { "topic": "...", "context": "..." }
```

The orchestrator picks 3–5 relevant experts from the 11 personas (CTO, CISO, DPO, CRO, VP Ops, CPO, CHRO, CFO, General Counsel, PMO, COO, CMO, VP Sales, Social Lead — see `src/lib/expert-panel.ts:28`), runs N rounds, surfaces consensus + dissents, and posts the summary to Telegram with a CEO decision button.

Discussion stored in `ExpertDiscussion` + `ExpertResponse`. CEO decisions logged to `WorkCycle`.

### 5.8 News monitoring weekly review

1. `/admin/news-monitor` — list new entries since last review.
2. For each: triage as **post / rephrase / ignore**. Use `/review-veille` slash command to streamline.
3. Posted entries appear on `/[lang]/newsfeed` and the homepage NewsFeed block.
4. If an entry is newsworthy enough to drive a vendor reassessment, file a `ReviewTask` against the affected systems.

### 5.9 Subscriber & customer ops

- New magic-link signup → `Subscriber` row created via `/api/subscribe` → verified via `/api/subscribe/verify`.
- LemonSqueezy webhook (`/api/lemonsqueezy/webhook`) updates `Subscriber.tier` on payment.
- Admin can manually adjust tier at `/admin/subscribers`.
- GDPR delete request: user clicks Delete on `/[lang]/account` → `Subscriber` + linked rows purged → confirmation page `/[lang]/account/deleted`.
- GDPR export: implement via `/admin/subscribers` data export (currently manual; flag for runbook).

---

## 6. Expert panel reference

11 (or 14, depending on configuration; check `src/lib/expert-panel.ts`) domain personas. Each owns a domain and is auto-selected by keyword match on the topic.

| Persona | Owns |
|---------|------|
| CTO | Architecture, APIs, scalability, deployment, model selection |
| CISO | AuthN/Z, encryption, vulnerability mgmt, SSO, incident response |
| DPO | GDPR, data residency, consent, DPIA, vendor data flows |
| CRO (Risk & Compliance) | Audit, ISO/SOC certifications, vendor risk |
| VP Ops / SRE | Incidents, monitoring, SLOs, CI/CD, on-call |
| CPO (Procurement) | Vendor contracts, pricing, TCO, renewals |
| CHRO | Hiring, training, AI-adoption change mgmt |
| CFO | Budget, ROI, unit economics, pricing tiers |
| General Counsel | Contracts, IP, copyright, liability, regulation interpretation |
| PMO | Milestones, dependencies, roadmap |
| COO | Customer, market, growth |
| CMO | Positioning, messaging, content, SEO |
| VP Sales | Pipeline, enterprise deals, conversion |
| Social Lead | LinkedIn distribution, audience, engagement |

**Routing rule:** if a task description matches keywords listed for a persona, prefer that persona. For multi-domain decisions, run a brainstorm.

---

## 7. Failure modes & recovery

| Symptom | Likely cause | Recovery |
|---------|--------------|---------|
| `i18n:check` exits 1 | Missing translation, hardcoded JSX, missing report locale | §5.3 |
| `evidence:fetch` returns 4xx/5xx for many sources | Vendor rate-limit or blocked UA | `triage-fetch-errors.ts`; rotate or back off |
| `evidence:extract` exits early with token error | Anthropic credits exhausted | Telegram notify CEO; pause until top-up |
| LLM hallucinated a claim (no quote in source text) | Server-side verification should have dropped it; if it surfaced, it's a bug | Open issue, retire the claim, tighten prompt in `claim-extractor.ts` |
| News ingest cron silent for > 12h | Vercel cron auth or RSS source down | Hit `/api/admin/news-ingest` manually with `CRON_SECRET`; check sources at `/admin/sources` |
| Vercel build fails on `prebuild` | i18n gate failure | §5.3, then re-push |
| Magic-link email not arriving | Resend quota or `FROM_EMAIL` mis-set | check Resend dashboard; verify `RESEND_API_KEY` |
| Stripe/LemonSqueezy webhook not updating tier | Webhook secret mismatch or signature failure | re-verify `*_WEBHOOK_SECRET`; check `/admin/customers` |
| Production page shows English on French URL | Dictionary loaded but page not awaiting `getDictionary(locale)` | inspect server component; ensure async + locale param |
| Score on detail page differs from spider chart | `computeOverallScore` vs cached `AssessmentScore.score` drift | re-run scoring backfill (`src/lib/scoring.ts`) |

---

## 8. Resource limits & guards

| Resource | Limit / target | Guard |
|----------|----------------|-------|
| Anthropic spend | < $5/month steady-state | extractor `--max 150`, hash-skip, content-hash dedup |
| DeepL chars | 500 K / month free | only re-translate keys flagged `untranslated` or new |
| Resend emails | 3 K / month free | digest opt-in, dedup |
| Vercel cron invocations | 100/day Hobby, 1000/day Pro | only 2 crons configured |
| Chat usage per visitor | tier-gated (anon=3, free=10, pro=∞, ent=∞) | enforced in `checkRateLimit()` |
| LLM call timeout | `LLM_TIMEOUT_MS` (typ. 30–60s) | request-side timeout |
| Source re-fetch frequency | weekly per cron | hash-skip skips unchanged |
| Source freshness target | 90 days | re-verify task auto-created when stale |

---

## 9. State variables to check on session start

When an agent boots, before doing work, run this snapshot:

```bash
npx tsx scripts/check-progress.ts            # systems / sources / snapshots / drafts
npx tsx scripts/pending-check.ts             # extraction backlog
npx tsx scripts/list-open-tasks.ts           # markdown TODOs
git status && git log --oneline -10           # uncommitted work, recent direction
npm run i18n:check                            # gate status (don't fix unless a task)
./scripts/telegram-poll.sh                   # any CEO replies
```

Cache the resulting numbers in working memory; do not repeat the snapshot more than once per hour unless taking an action that changes them.

---

## 10. What is NOT yet automated (escalate to human or build the agent)

The following are documented gaps as of 2026-04-26. Treat as "human in the loop" unless a CEO directive changes that.

- **Domain / branding decision** — vendorscope.eu is the current domain; rebrand pending.
- **Customer-development calls** — 3 calls (DPO, CISO, procurement) blocking paid acquisition.
- **Pricing validation** — gross-margin check on €19 Pro tier vs. inference cost.
- **Business Case Generator** — currently broken and hidden from nav.
- **GDPR data-export procedure** — manual via admin UI; needs scripted `/api/account/export`.
- **Evidence freshness re-verify scheduler** — exists logically (90d) but no enforcing cron yet.
- **Autonomous QA bot** — UX/translation/broken-links/regression suite not built.
- **Tester agent** — functional/perf/mobile not built.
- **Continuous UX-improvement agent** — not built.
- **Referral revenue model** — not designed.

When you encounter one of these, file a `qa/defects.md` line if it's a defect, a TODO.md line if it's a build, and notify the CEO via Telegram only if it blocks a stated launch gate.

---

## 11. Authoritative source map

When in doubt, consult the source — never recall from memory:

| Topic | Source |
|-------|--------|
| Tech stack & conventions | [AGENTS.md](../AGENTS.md), [DEVELOPER.md](../DEVELOPER.md) |
| Translation gate | [CLAUDE.md](../CLAUDE.md) |
| Architecture deep-dive | [TECHNICAL-DOCUMENTATION.md](TECHNICAL-DOCUMENTATION.md) |
| Backlog & gates | [TODO.md](../TODO.md) |
| Risk register | [RISK-REMEDIATION.md](../RISK-REMEDIATION.md) |
| Defects log | [qa/defects.md](../qa/defects.md) |
| Content suggestions | [qa/content-suggestions.md](../qa/content-suggestions.md) |
| Scoring formulas | [src/lib/scoring.ts](../src/lib/scoring.ts) |
| Tier feature matrix | [src/lib/tier-access.ts](../src/lib/tier-access.ts) |
| Expert personas | [src/lib/expert-panel.ts](../src/lib/expert-panel.ts) |
| Claim extraction prompt | [src/lib/claim-extractor.ts](../src/lib/claim-extractor.ts) |
| Active locales | [src/lib/i18n.ts](../src/lib/i18n.ts) |
| Cron schedule | [vercel.json](../vercel.json) |
| Prisma schema | [prisma/schema.prisma](../prisma/schema.prisma) |
