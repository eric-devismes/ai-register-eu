/**
 * Claim Extractor (Phase 1b)
 *
 * Given a SourceSnapshot.rawText, extracts draft SystemClaim rows that an
 * analyst will then approve/edit/reject in the admin review queue.
 *
 * Anti-hallucination contract:
 *   1. The LLM is told to ONLY use the provided snippet — never training data.
 *   2. Every returned claim MUST include an `evidenceQuote` taken verbatim
 *      from the snippet.
 *   3. Server-side, we verify the quote actually appears in rawText
 *      (case-insensitive, whitespace-normalised). Claims whose quote can't
 *      be found are silently dropped — they're hallucinations.
 *
 * Output rows are inserted with status="draft". An admin must approve them
 * (status="published") before they appear on the public page.
 *
 * Existing claims for the same (systemId, field) are NOT overwritten —
 * the new draft sits alongside the published one so the analyst can
 * compare and decide whether to update.
 */

import { prisma } from "@/lib/db";
import { LLM_MODEL, LLM_TIMEOUT_MS } from "@/lib/constants";

// ─── The vocabulary of fields we extract ────────────────────
//
// Keeping a fixed schema means:
//   1. The UI knows what fields to render.
//   2. Comparing "old vs new" claim values is meaningful.
//   3. The LLM can't invent novel field names.
//
// Field naming convention: dotted, lowercase, snake-free. The Phase 0
// pilot seed used these same paths — keep them consistent.

export interface ClaimFieldSpec {
  field: string;
  description: string;
}

export const EXTRACTABLE_FIELDS: ClaimFieldSpec[] = [
  // Certifications & attestations
  { field: "certifications.soc2", description: "SOC 2 certification (Type I or II), with trust services covered" },
  { field: "certifications.iso27001", description: "ISO/IEC 27001 information security management certification, with year/version" },
  { field: "certifications.iso27701", description: "ISO/IEC 27701 privacy information management certification" },
  { field: "certifications.iso27017", description: "ISO/IEC 27017 cloud security certification" },
  { field: "certifications.iso27018", description: "ISO/IEC 27018 cloud privacy/PII certification" },
  { field: "certifications.iso42001", description: "ISO/IEC 42001 AI management system certification" },
  { field: "certifications.hipaa", description: "HIPAA compliance / BAA availability" },
  { field: "certifications.pciDss", description: "PCI DSS certification" },
  { field: "certifications.cyberEssentials", description: "Cyber Essentials / Cyber Essentials Plus" },
  { field: "certifications.fedramp", description: "FedRAMP authorization (Moderate/High)" },
  // Data processing posture
  { field: "dpa.available", description: "Data Processing Addendum (GDPR Art. 28) availability and scope" },
  { field: "dpa.scc", description: "Standard Contractual Clauses for cross-border transfers" },
  { field: "subprocessors.disclosed", description: "Whether sub-processors are publicly disclosed and how" },
  { field: "subprocessors.notice", description: "Advance notice given before adding/changing sub-processors" },
  // Training data use — the question every buyer asks
  { field: "trainingDataUse.api", description: "Whether API/business/enterprise customer data is used to train models" },
  { field: "trainingDataUse.consumer", description: "Whether consumer/free-tier data is used to train models" },
  { field: "trainingDataUse.optOut", description: "Whether customers can opt out of training data use" },
  // EU residency
  { field: "euResidency.storage", description: "EU data storage residency — where data is stored at rest" },
  { field: "euResidency.processing", description: "EU data processing residency — where inference happens" },
  { field: "euResidency.support", description: "EU residency for support / customer service access" },
  // Encryption
  { field: "encryption.atRest", description: "Encryption at rest (cipher, key management)" },
  { field: "encryption.inTransit", description: "Encryption in transit (TLS version)" },
  { field: "encryption.cmek", description: "Customer-managed encryption keys (BYOK / CMEK / HYOK)" },
  // Access controls
  { field: "accessControls.sso", description: "SSO support (SAML, OIDC) and whether Enterprise-tier only" },
  { field: "accessControls.scim", description: "SCIM provisioning support" },
  { field: "accessControls.mfa", description: "MFA enforcement" },
  { field: "accessControls.audit", description: "Audit log access and retention" },
  // Regulatory posture
  { field: "aiActStatus", description: "EU AI Act readiness statement, classification, or compliance roadmap" },
  { field: "gdprStatus", description: "GDPR compliance posture, DPO contact, supervisory authority" },
  // Exit / portability
  { field: "dataPortability", description: "Data export formats and tooling available to customers" },
  { field: "exitTerms", description: "Data deletion timeline after contract termination" },
];

// ─── Validator: quote must appear verbatim in source ────────

/**
 * Normalise text for verbatim-quote matching. Collapses runs of whitespace,
 * lowercases, and strips smart-quote variants. This is intentionally
 * forgiving: we want to reject genuine hallucinations, not minor
 * whitespace/punctuation drift introduced by our HTML stripper.
 */
function normaliseForMatch(s: string): string {
  return s
    .toLowerCase()
    .replace(/[\u2018\u2019\u201A\u201B\u2032]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F\u2033]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

export function isQuoteGrounded(quote: string, sourceText: string): boolean {
  if (!quote || quote.length < 5) return false;
  return normaliseForMatch(sourceText).includes(normaliseForMatch(quote));
}

/**
 * Extract the first balanced JSON object from arbitrary LLM output.
 *
 * Real-world LLM responses sometimes wrap the JSON in ```json ... ``` fences
 * or trail a markdown "Rationale:" block after the closing brace. Locating the
 * first `{` and walking with bracket-depth + string-state tracking finds the
 * outermost object reliably without dragging in a parser dependency.
 *
 * Returns the JSON substring (or the original input untouched if no `{` is
 * found, so JSON.parse will throw a useful error).
 */
export function extractFirstJsonObject(raw: string): string {
  const start = raw.indexOf("{");
  if (start === -1) return raw.trim();
  let depth = 0;
  let inString = false;
  let escape = false;
  for (let i = start; i < raw.length; i++) {
    const ch = raw[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (ch === "\\" && inString) {
      escape = true;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      continue;
    }
    if (inString) continue;
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) {
        return raw.slice(start, i + 1);
      }
    }
  }
  // Unbalanced — return what we have; the parser will report the real error
  return raw.slice(start);
}

// ─── Extractor types ────────────────────────────────────────

export interface ExtractedClaim {
  field: string;
  value: string;
  evidenceQuote: string;
  confidence: "high" | "medium" | "low";
}

export interface ExtractionResult {
  ok: boolean;
  claims: ExtractedClaim[];
  rejected: Array<{ field: string; quote: string; reason: string }>;
  errorMessage: string;
  modelUsed: string;
  promptTokens?: number;
  completionTokens?: number;
}

// ─── Prompt ──────────────────────────────────────────────────

function buildExtractorPrompt(sourceLabel: string, sourceUrl: string, rawText: string): string {
  // Cap input — Haiku has a generous context window but keeping it tight
  // sharpens extraction quality and keeps cost predictable.
  const MAX_INPUT_CHARS = 50_000;
  const snippet = rawText.length > MAX_INPUT_CHARS
    ? rawText.slice(0, MAX_INPUT_CHARS) + "\n\n[...truncated for length...]"
    : rawText;

  const fieldList = EXTRACTABLE_FIELDS
    .map((f) => `  - ${f.field}: ${f.description}`)
    .join("\n");

  return `You are an evidence extractor for AI Compass EU. Your job: read a vendor trust-page snippet and extract verifiable claims about that vendor's compliance, security, and data handling.

ABSOLUTE RULES — VIOLATIONS CAUSE THE OUTPUT TO BE DISCARDED:
1. Use ONLY the snippet below. Never use prior knowledge of the vendor. If the snippet doesn't say it, you don't claim it.
2. Every claim MUST include "evidenceQuote": a verbatim substring of the snippet (10-300 characters). This will be programmatically verified — paraphrases are rejected.
3. Output ONLY claims for fields in the schema below. Skip any field the snippet doesn't address.
4. If a field is mentioned but ambiguous, set confidence to "low" and let an analyst decide.
5. Output JSON only — no markdown fences, no commentary, no preamble.

FIELD SCHEMA:
${fieldList}

CONFIDENCE GUIDE:
- "high": the snippet states it explicitly and unambiguously
- "medium": the snippet implies it strongly but uses softer language
- "low": the snippet hints at it but interpretation is required

OUTPUT FORMAT (strict JSON):
{
  "claims": [
    {
      "field": "<one of the schema fields>",
      "value": "<short factual statement, max 200 chars>",
      "evidenceQuote": "<verbatim substring of the snippet, 10-300 chars>",
      "confidence": "high" | "medium" | "low"
    }
  ]
}

If the snippet contains no extractable claims (e.g., it's a marketing page with no factual statements), return: {"claims": []}

SOURCE
Label: ${sourceLabel}
URL:   ${sourceUrl}

SNIPPET:
"""
${snippet}
"""`;
}

// ─── Main extractor ──────────────────────────────────────────

const MAX_OUTPUT_TOKENS = 4096;

export async function extractClaimsFromSnapshot(input: {
  rawText: string;
  sourceLabel: string;
  sourceUrl: string;
}): Promise<ExtractionResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) {
    return {
      ok: false,
      claims: [],
      rejected: [],
      errorMessage: "ANTHROPIC_API_KEY not configured — cannot extract claims",
      modelUsed: LLM_MODEL,
    };
  }

  const prompt = buildExtractorPrompt(input.sourceLabel, input.sourceUrl, input.rawText);

  let raw: string;
  let promptTokens: number | undefined;
  let completionTokens: number | undefined;
  try {
    const Anthropic = (await import("@anthropic-ai/sdk")).default;
    const client = new Anthropic({ apiKey });
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), LLM_TIMEOUT_MS);
    const response = await client.messages.create(
      {
        model: LLM_MODEL,
        max_tokens: MAX_OUTPUT_TOKENS,
        // No system prompt — putting all instructions in the user turn keeps
        // the snippet and rules visually adjacent for the model.
        messages: [{ role: "user", content: prompt }],
      },
      { signal: controller.signal },
    ).finally(() => clearTimeout(timer));

    const textBlock = response.content.find((b) => b.type === "text");
    raw = textBlock?.text ?? "";
    promptTokens = response.usage?.input_tokens;
    completionTokens = response.usage?.output_tokens;
  } catch (err) {
    return {
      ok: false,
      claims: [],
      rejected: [],
      errorMessage: err instanceof Error ? err.message : String(err),
      modelUsed: LLM_MODEL,
    };
  }

  // Parse — model is told to return strict JSON, but real-world LLMs
  // sometimes wrap in ```json ... ``` fences or trail a "Rationale:" block
  // after the JSON object. Be defensive: extract the first balanced top-level
  // {...} block from the response and parse that.
  const jsonText = extractFirstJsonObject(raw);

  let parsed: { claims?: unknown };
  try {
    parsed = JSON.parse(jsonText);
  } catch (err) {
    return {
      ok: false,
      claims: [],
      rejected: [],
      errorMessage: `LLM returned invalid JSON: ${(err as Error).message}. First 200 chars: ${jsonText.slice(0, 200)}`,
      modelUsed: LLM_MODEL,
      promptTokens,
      completionTokens,
    };
  }

  // Validate shape and ground every quote
  const validFields = new Set(EXTRACTABLE_FIELDS.map((f) => f.field));
  const validConfidences = new Set(["high", "medium", "low"]);
  const accepted: ExtractedClaim[] = [];
  const rejected: ExtractionResult["rejected"] = [];

  if (Array.isArray(parsed.claims)) {
    for (const c of parsed.claims as Array<Record<string, unknown>>) {
      const field = String(c.field ?? "");
      const value = String(c.value ?? "").slice(0, 500);
      const evidenceQuote = String(c.evidenceQuote ?? "");
      const confidence = String(c.confidence ?? "medium") as "high" | "medium" | "low";

      if (!validFields.has(field)) {
        rejected.push({ field, quote: evidenceQuote, reason: "unknown field" });
        continue;
      }
      if (!value || !evidenceQuote) {
        rejected.push({ field, quote: evidenceQuote, reason: "missing value or quote" });
        continue;
      }
      if (!validConfidences.has(confidence)) {
        rejected.push({ field, quote: evidenceQuote, reason: `invalid confidence: ${confidence}` });
        continue;
      }
      // The crucial anti-hallucination check
      if (!isQuoteGrounded(evidenceQuote, input.rawText)) {
        rejected.push({ field, quote: evidenceQuote, reason: "quote not found verbatim in source — likely hallucination" });
        continue;
      }
      accepted.push({ field, value, evidenceQuote, confidence });
    }
  }

  return {
    ok: true,
    claims: accepted,
    rejected,
    errorMessage: "",
    modelUsed: LLM_MODEL,
    promptTokens,
    completionTokens,
  };
}

// ─── DB writer ──────────────────────────────────────────────

export interface PersistResult {
  draftsCreated: number;
  draftsUpdated: number;
  drafts: Array<{ id: string; field: string; value: string }>;
}

/**
 * Insert (or refresh) draft claims for a snapshot.
 *
 * Schema invariant: @@unique([systemId, field, status]) — at most one
 * row per (system, field, status). Drafts and published claims on the
 * same field coexist because their `status` differs.
 *
 * Behaviour:
 *   - At most one draft exists per (systemId, field) — newest extraction wins.
 *     Re-running extraction (whether on the same snapshot or a different
 *     source that mentions the same field) supersedes the previous draft.
 *   - Published claims are NEVER mutated here. Promotion to published
 *     happens via the admin review UI (separate transaction).
 *   - When a draft and a published claim agree on the field, the analyst
 *     sees them side-by-side and decides whether the draft is a refresh
 *     (verifiedAt update only) or a real change (replace published value).
 */
export async function persistDraftClaims(input: {
  systemId: string;
  sourceId: string;
  snapshotId: string;
  claims: ExtractedClaim[];
}): Promise<PersistResult> {
  const { systemId, sourceId, snapshotId, claims } = input;

  let draftsCreated = 0;
  let draftsUpdated = 0;
  const written: Array<{ id: string; field: string; value: string }> = [];

  for (const c of claims) {
    // Upsert keyed on the unique (systemId, field, status) constraint.
    // If a draft already exists for this field, refresh it with the new
    // extraction (newer snapshot supersedes older).
    const result = await prisma.systemClaim.upsert({
      where: {
        systemId_field_status: {
          systemId,
          field: c.field,
          status: "draft",
        },
      },
      create: {
        systemId,
        field: c.field,
        value: c.value,
        evidenceQuote: c.evidenceQuote,
        sourceId,
        snapshotId,
        confidence: c.confidence,
        status: "draft",
        verifiedBy: "extractor",
      },
      update: {
        value: c.value,
        evidenceQuote: c.evidenceQuote,
        sourceId,
        snapshotId,
        confidence: c.confidence,
        verifiedBy: "extractor",
      },
    });
    written.push({ id: result.id, field: c.field, value: c.value });
    if (result.createdAt.getTime() === result.updatedAt.getTime()) {
      draftsCreated++;
    } else {
      draftsUpdated++;
    }
  }

  return { draftsCreated, draftsUpdated, drafts: written };
}
