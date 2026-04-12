# Content Quality — Improvement Suggestions

> Maintained by the Content Quality Monitor.
> Each domain expert reviews content daily on rotation.

---

## 2026-04-12 — General Review (Sat)

**Lens**: Broken content, outdated dates, cross-file inconsistencies

---

### 🟡 Suggestion: Mistral AI — New Products Not in Profile
**Status**: CEO review needed
**File**: `src/data/seed-enrichment-top10.ts` (Mistral entry)

Mistral launched several major products after the last seed update that are not reflected in use cases or description:
- **Mistral 3** (December 2025) — new multimodal frontier model family
- **Mistral OCR 3** (December 2025) — document processing, claimed "new frontier for accuracy and efficiency"
- **Devstral 2** (December 2025) — state-of-the-art agentic coding model
- **Voxtral TTS** (March 2026) — open-weights text-to-speech model for voice agents

Current use cases list "Code generation (Codestral)" but miss Devstral 2 and Voxtral. The description also references "Mistral 7B, Mixtral" by name but newer flagship models (Mistral 3) are absent. Suggest refreshing use cases and description to reflect Q4 2025/Q1 2026 product launches.

*Source*: mistral.ai/news (fetched 2026-04-12)

---

### 🔴 Fix: seed-vendor-maturity.ts — Stale Anthropic Valuation
**Status**: Inconsistency flagged (DB likely correct; seed file stale)
**File**: `src/data/seed-vendor-maturity.ts`, line ~37

`fundingStatus` reads `"Private (VC-backed, $60B valuation)"` — Anthropic closed a $30B Series G in February 2026 at a **$380B post-money valuation**. The correct data is already in `seed-enrichment-top10.ts` (which runs later and overwrites). The seed-vendor-maturity.ts should be updated for consistency, to avoid confusion on future seed runs or audits.

*Fix*: Update the `fundingStatus` in `seed-vendor-maturity.ts` for `anthropic-claude-enterprise`.

---

### 🟡 Suggestion: Assessment Date Staleness — 6 Systems Overdue
**Status**: CEO awareness
**File**: `src/data/seed-assessed-dates.ts`

The following systems were last assessed in January–February 2026 (2+ months ago). Given the pace of AI product launches, compliance updates, and pricing changes, these profiles may have drifted from current reality:

| System | Last Assessed | Days Old |
|--------|--------------|---------|
| Personio AI | 2026-02-08 | ~63 days |
| HireVue | 2026-02-12 | ~59 days |
| UiPath Maestro | 2026-02-15 | ~56 days |
| Workday Illuminate | 2026-02-18 | ~53 days |
| Palantir AIP | 2026-02-22 | ~49 days |
| ServiceNow Now Assist | 2026-02-25 | ~46 days |

Consider prioritising ServiceNow (active Now Assist development) and Workday (Illuminate AI agent launches) for next assessment cycle.

---

### 🟡 Suggestion: OpenAI ISO 27001 Status — Confirm or Update
**Status**: Verify before next DPO rotation (Tue)
**File**: `src/data/seed-new-content-2026.ts`, line ~57

OpenAI ChatGPT Enterprise entry says `"ISO 27001 in progress (2026 target)"`. It is now April 2026; this certification may have been achieved or the target may have slipped. Recommend a quick check of `trust.openai.com` before the next DPO review day to either update certification status or flag as still pending.

---

### ℹ️ Note: Seed File Architecture — Multiple Overlapping Sources
**Status**: No action needed — architecture observation
The database is populated by a chain of seed files (seed-vendors → seed-vendor-maturity → seed-enrichment-top10 → seed-enrichment-batch*). Each runs as upsert and later files overwrite earlier ones. This is working as intended, but the gap between older files (e.g., seed-vendor-maturity.ts showing "$60B valuation" for Anthropic) and newer files can cause confusion when reading seed files directly. Future maintenance: consider adding a "superseded by" comment to older files when their entries are fully covered by enrichment files.

