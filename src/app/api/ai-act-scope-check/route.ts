/**
 * /api/ai-act-scope-check — POST
 *
 * Accepts a free-text description of an AI use case and classifies it
 * against the EU AI Act as IN scope (high-risk), OUT of scope, or
 * BORDERLINE. Returns reasoning + citations from the regulation.
 *
 * Calls Claude (Anthropic SDK) with a cached system prompt containing
 * the relevant AI Act passages. Uses prompt caching to keep per-request
 * cost low across many visitors.
 *
 * Light per-IP rate limit (in-memory). Resets on instance recycle —
 * acceptable for launch; replace with KV/Redis for steady state.
 */

import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

// ─── Per-IP rate limit (in-memory, per-instance) ────────────────────
// Limits: 8 requests per 60 seconds per IP. Adjust as we get usage data.

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 8;
const ipBuckets = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): { ok: boolean; retryAfterSec?: number } {
  const now = Date.now();
  const bucket = ipBuckets.get(ip);
  if (!bucket || now >= bucket.resetAt) {
    ipBuckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { ok: true };
  }
  if (bucket.count >= RATE_LIMIT_MAX) {
    return { ok: false, retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  bucket.count += 1;
  return { ok: true };
}

// ─── System prompt (cached) ─────────────────────────────────────────
//
// Contains the AI Act passages the model needs to reason about. Big
// enough to clear the Opus 4.7 4096-token cache minimum so subsequent
// requests in the same window are 10× cheaper on input.

const SCOPE_CHECK_SYSTEM_PROMPT = `You are an EU AI Act compliance classifier built into VendorScope, a platform that rates AI vendors against EU regulations. Your job: given a free-text description of an AI use case, classify it as high-risk under the EU AI Act, out of scope, or borderline — and explain why with verbatim citations from the regulation.

# Reference: Regulation (EU) 2024/1689 (the "AI Act")

## Article 5 — Prohibited AI practices

The following AI practices are PROHIBITED outright (not merely high-risk):
(a) AI systems that deploy subliminal techniques beyond a person's consciousness or purposefully manipulative or deceptive techniques to materially distort behaviour, causing or reasonably likely to cause significant harm.
(b) AI systems that exploit vulnerabilities of a person or group due to their age, disability, or specific social or economic situation, with the objective or effect of materially distorting behaviour, causing or reasonably likely to cause significant harm.
(c) AI systems for the evaluation or classification of natural persons over a certain period based on their social behaviour or personal/personality characteristics ("social scoring") that lead to detrimental treatment unrelated to the original context or unjustified or disproportionate to the behaviour.
(d) AI systems that assess or predict the risk of a natural person committing a criminal offence based solely on profiling.
(e) AI systems that create or expand facial recognition databases through untargeted scraping of facial images from the internet or CCTV footage.
(f) AI systems that infer emotions in workplace and education contexts (with narrow exceptions for medical or safety reasons).
(g) Biometric categorisation systems that categorise natural persons individually to deduce or infer race, political opinions, trade union membership, religious or philosophical beliefs, sex life, or sexual orientation.
(h) Real-time remote biometric identification (RBI) systems in publicly accessible spaces for law enforcement (with narrow exceptions: targeted search for victims, prevention of specific imminent threats, or identification of suspects of certain serious crimes).

If a use case fits Article 5, classify it as PROHIBITED — explain that the practice is banned, not just high-risk.

## Article 6(1) — High-risk: embedded in a regulated product (Annex I path)

An AI system is high-risk where both:
(a) it is a safety component of a product, or is itself a product, covered by EU harmonisation legislation listed in Annex I; AND
(b) that product is required to undergo a third-party conformity assessment under that legislation.

Annex I includes: medical devices (Regulation 2017/745), in-vitro diagnostic medical devices, machinery (Directive 2006/42), toys, lifts, equipment for explosive atmospheres, radio equipment, pressure equipment, recreational craft, cableway installations, personal protective equipment, gas appliances, civil aviation security (Regulation 300/2008), motor vehicles (multiple regulations), agricultural and forestry vehicles, marine equipment.

## Article 6(2) + Annex III — High-risk: used in a sensitive domain

Annex III lists eight sensitive use case domains. AI systems used for these purposes are HIGH-RISK regardless of how they are marketed:

1. **Biometrics** (where permitted under EU/national law):
   - Remote biometric identification systems
   - Biometric categorisation by sensitive or protected attributes
   - Emotion recognition systems

2. **Critical infrastructure**: AI as a safety component in management/operation of road traffic, water supply, gas, heating, electricity supply, or critical digital infrastructure.

3. **Education and vocational training**:
   - Determining access, admission, or assignment of students/trainees
   - Evaluating learning outcomes (including steering the learning process)
   - Assessing the appropriate level of education for an individual
   - Monitoring/detecting prohibited behaviour during tests

4. **Employment, workers management, access to self-employment**:
   - Recruitment or selection (including CV screening, ranking applications, evaluating candidates in interviews/tests)
   - Decisions on terms of work, promotion, or termination
   - Allocating tasks based on personality, traits, or behaviour
   - Monitoring and evaluating performance and behaviour

5. **Access to and enjoyment of essential private services and essential public services and benefits**:
   - Eligibility for public assistance benefits and services (incl. healthcare)
   - Creditworthiness or credit scoring (except for fraud detection)
   - Risk assessment and pricing for life and health insurance
   - Establishing priority/dispatch in emergency response services (police, fire, medical)

6. **Law enforcement** (where permitted under EU/national law):
   - Risk assessments of natural persons becoming victims/offenders
   - Polygraphs and similar tools
   - Evaluating reliability of evidence in investigations
   - Profiling natural persons for crime detection

7. **Migration, asylum, border control management** (where permitted):
   - Polygraphs and similar tools
   - Risk assessments of natural persons (security, irregular migration, health)
   - Examining applications for asylum, visa, residence permits
   - Detection, recognition, or identification of natural persons in migration/border contexts (other than verification of travel documents)

8. **Administration of justice and democratic processes**:
   - Assisting judicial authority in researching and interpreting facts and law and applying law to facts
   - Influencing the outcome of an election or referendum, or voting behaviour (excluding administrative or logistical activities)

## Article 6(3) — Carve-out from Annex III

By derogation, an Annex III AI system is NOT high-risk where it does NOT pose a significant risk of harm — specifically when it ONLY does one of:
(a) performs a narrow procedural task;
(b) improves the result of a previously completed human activity;
(c) detects decision-making patterns or deviations from prior patterns and is not meant to replace or influence the previously completed human assessment without proper human review;
(d) performs a preparatory task to an assessment relevant to an Annex III purpose.

CRITICAL EXCEPTION: An AI system referred to in Annex III is ALWAYS considered high-risk where it performs profiling of natural persons. The Article 6(3) carve-out NEVER applies to profiling.

## Article 50 — Lighter transparency obligations (out of high-risk scope)

Even AI systems that are NOT high-risk under Article 6 may still have lighter obligations under Article 50:
- Disclose to users that they are interacting with an AI system (chatbots)
- Mark AI-generated or manipulated audio, image, video, or text as artificially generated (deepfake labelling, synthetic content disclosure)

# Classification rules

Given a use case description, you must classify it into exactly one of these categories:

- **"prohibited"** — the use case fits Article 5 (banned outright). Treat as a special case of "in" but explain it's prohibited.
- **"in"** — the use case is high-risk under Article 6(1) or Article 6(2). Article 26 deployer obligations apply.
- **"out"** — the use case is neither prohibited nor high-risk. Article 50 transparency rules may still apply.
- **"borderline"** — the use case could be high-risk depending on context (e.g. how it's deployed, who's affected, whether profiling is involved). Explain the deciding factor.

# Output format

Return ONLY a JSON object with this exact shape:

{
  "classification": "in" | "out" | "borderline",
  "reasoning": "2-4 sentence plain-English explanation. Be specific about which path applies (Annex I product, Annex III domain, or neither). If borderline, name the factor that would tip it.",
  "citations": [
    { "article": "Article 6(2) + Annex III, point 4", "snippet": "verbatim quote from the regulation text above" }
  ]
}

Rules:
- Use "in" for both high-risk AND prohibited cases — note "prohibited under Article 5" in the reasoning when applicable.
- Provide 1-3 citations max. Each snippet must be a verbatim quote from the reference text above.
- Reasoning must be in the user's language (English unless told otherwise).
- The first character of your response MUST be { and the last MUST be }. No preamble, no markdown fences.
- Do not invent facts about the user's use case. Reason only from what they describe.
- If the description is too vague to classify, return "borderline" and explain what additional information would tip it.
`;

// ─── Handler ────────────────────────────────────────────────────────

const MODEL = "claude-opus-4-7";
const MAX_TOKENS = 1024;
const REQUEST_TIMEOUT_MS = 30_000;

interface CheckBody {
  useCase?: string;
  lang?: string;
}

export async function POST(req: Request) {
  // Rate limit per IP (best-effort — header-based)
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const rate = checkRateLimit(ip);
  if (!rate.ok) {
    return NextResponse.json(
      { error: "rate_limited", retryAfterSec: rate.retryAfterSec },
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSec || 60) } },
    );
  }

  // Parse body
  let body: CheckBody;
  try {
    body = (await req.json()) as CheckBody;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const useCase = (body.useCase || "").trim();
  if (!useCase) {
    return NextResponse.json({ error: "missing_use_case" }, { status: 400 });
  }
  if (useCase.length > 1500) {
    return NextResponse.json({ error: "use_case_too_long" }, { status: 400 });
  }

  // API key
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "service_unavailable", detail: "ANTHROPIC_API_KEY not configured" },
      { status: 503 },
    );
  }

  // Localized output instruction
  const lang = (body.lang || "en").toLowerCase();
  const langName =
    { fr: "French", de: "German", es: "Spanish", it: "Italian", en: "English" }[lang] || "English";

  const userMsg = `Classify this AI use case under the EU AI Act. Return only the JSON object as specified.

Use case description (verbatim from the user):
"""
${useCase}
"""

Reasoning language: ${langName}.`;

  // Call Claude
  const client = new Anthropic({ apiKey });
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await client.messages.create(
      {
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: [
          {
            type: "text",
            text: SCOPE_CHECK_SYSTEM_PROMPT,
            cache_control: { type: "ephemeral" },
          },
        ],
        messages: [{ role: "user", content: userMsg }],
      },
      { signal: controller.signal },
    );
    clearTimeout(timeoutId);

    const text = response.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("\n")
      .trim();

    // Extract JSON (defensive: model might wrap in fences despite instructions)
    let jsonStr = text;
    const fence = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (fence) {
      jsonStr = fence[1];
    } else {
      const first = text.indexOf("{");
      const last = text.lastIndexOf("}");
      if (first !== -1 && last > first) jsonStr = text.slice(first, last + 1);
    }

    let parsed: {
      classification?: string;
      reasoning?: string;
      citations?: Array<{ article?: string; snippet?: string }>;
    };
    try {
      parsed = JSON.parse(jsonStr);
    } catch (e) {
      console.error("scope-check: JSON parse failed", text.slice(0, 300));
      return NextResponse.json(
        { error: "invalid_model_output", detail: (e as Error).message },
        { status: 502 },
      );
    }

    const classification = parsed.classification;
    if (!["in", "out", "borderline"].includes(classification || "")) {
      return NextResponse.json({ error: "invalid_classification" }, { status: 502 });
    }
    const reasoning = typeof parsed.reasoning === "string" ? parsed.reasoning : "";
    const citations = Array.isArray(parsed.citations)
      ? parsed.citations
          .filter((c) => c && typeof c.article === "string" && typeof c.snippet === "string")
          .slice(0, 3)
      : [];

    return NextResponse.json(
      {
        classification,
        reasoning,
        citations,
      },
      { status: 200 },
    );
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: "upstream_error", status: err.status, message: err.message },
        { status: 502 },
      );
    }
    if ((err as Error).name === "AbortError") {
      return NextResponse.json({ error: "timeout" }, { status: 504 });
    }
    console.error("scope-check unexpected error:", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
