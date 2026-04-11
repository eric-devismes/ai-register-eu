/**
 * POST /api/vendor-prep — Generate vendor discussion prep materials.
 *
 * Pipeline:
 *   1. Parse & validate request body
 *   2. Rate limit check (fingerprint cookie + subscriber tier)
 *   3. Tier gate — only pro and enterprise tiers can generate
 *   4. Fetch AI system from database by slug (with scores + industries)
 *   5. Call Claude with system data + meeting context
 *   6. Return structured JSON
 *
 * Request:  { systemSlug, meetingType, attendeeRoles, concerns, budget? }
 * Response: { sections: { id, title, content }[] }
 */

import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/chat-rate-limit";
import { getEffectiveTier } from "@/lib/tier-access";
import { prisma } from "@/lib/db";
import { computeOverallScore } from "@/lib/scoring";
import { LLM_MODEL, LLM_TIMEOUT_MS } from "@/lib/constants";

// ─── Types ────────────────────────────────────────────────

interface VendorPrepRequest {
  systemSlug: string;
  meetingType: string;
  attendeeRoles: string[];
  concerns: string[];
  budget?: string;
}

interface VendorPrepSection {
  id: string;
  title: string;
  content: string;
}

// ─── Validation ───────────────────────────────────────────

const VALID_MEETING_TYPES = [
  "initial-demo",
  "technical-deep-dive",
  "commercial-negotiation",
  "compliance-review",
  "contract-review",
];

const VALID_ROLES = ["cto", "ciso", "dpo", "procurement", "legal", "executive"];

function validateRequest(body: unknown): { valid: true; data: VendorPrepRequest } | { valid: false; error: string } {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Invalid request body" };
  }

  const b = body as Record<string, unknown>;

  if (!b.systemSlug || typeof b.systemSlug !== "string") {
    return { valid: false, error: "systemSlug is required" };
  }
  if (!b.meetingType || typeof b.meetingType !== "string" || !VALID_MEETING_TYPES.includes(b.meetingType)) {
    return { valid: false, error: `meetingType must be one of: ${VALID_MEETING_TYPES.join(", ")}` };
  }
  if (!Array.isArray(b.attendeeRoles) || b.attendeeRoles.length === 0) {
    return { valid: false, error: "attendeeRoles must be a non-empty array" };
  }
  for (const role of b.attendeeRoles) {
    if (typeof role !== "string" || !VALID_ROLES.includes(role)) {
      return { valid: false, error: `Invalid attendee role: ${role}. Must be one of: ${VALID_ROLES.join(", ")}` };
    }
  }
  if (!Array.isArray(b.concerns) || b.concerns.length === 0) {
    return { valid: false, error: "concerns must be a non-empty array" };
  }
  if (b.budget !== undefined && typeof b.budget !== "string") {
    return { valid: false, error: "budget must be a string if provided" };
  }

  return {
    valid: true,
    data: {
      systemSlug: b.systemSlug as string,
      meetingType: b.meetingType as string,
      attendeeRoles: b.attendeeRoles as string[],
      concerns: (b.concerns as string[]).map((c) => String(c).slice(0, 200)),
      budget: b.budget ? (b.budget as string).slice(0, 200) : undefined,
    },
  };
}

// ─── Meeting Type Labels ─────────────────────────────────

const MEETING_TYPE_LABELS: Record<string, string> = {
  "initial-demo": "Initial Demo / Discovery",
  "technical-deep-dive": "Technical Deep-Dive",
  "commercial-negotiation": "Commercial Negotiation",
  "compliance-review": "Compliance Review",
  "contract-review": "Contract Review",
};

const ROLE_LABELS: Record<string, string> = {
  cto: "Chief Technology Officer (CTO)",
  ciso: "Chief Information Security Officer (CISO)",
  dpo: "Data Protection Officer (DPO)",
  procurement: "Procurement Lead",
  legal: "Legal Counsel",
  executive: "Executive / C-Suite",
};

// ─── System Prompt ────────────────────────────────────────

function buildSystemPrompt(
  system: {
    name: string;
    vendor: string;
    type: string;
    risk: string;
    description: string;
    category: string;
    overallScore: string;
    scores: { framework: string; score: string }[];
    industries: string[];
  },
): string {
  const scoreLines = system.scores
    .map((s) => `  - ${s.framework}: ${s.score}`)
    .join("\n");

  return `You are a senior procurement advisor preparing an enterprise team for a vendor meeting about an AI product. Generate structured preparation materials organized by: (1) Key Talking Points per attendee role, (2) Questions to Ask (organized by topic: compliance, security, data, commercial, technical), (3) Negotiation Leverage (what the buyer has going for them based on the vendor's weaknesses), (4) Red Flags to Watch For, (5) Compliance Checklist for the meeting, (6) Follow-up Actions template.

AI SYSTEM BEING DISCUSSED:
- Name: ${system.name}
- Vendor: ${system.vendor}
- Type: ${system.type}
- EU AI Act Risk Classification: ${system.risk}
- Category: ${system.category}
- Description: ${system.description}
- Overall Compliance Score: ${system.overallScore}
- Compliance Scores by Framework:
${scoreLines}
- Applicable Industries: ${system.industries.join(", ")}

YOUR TASK:
Generate structured vendor meeting preparation materials with exactly these sections. Each section must be practical, specific, and grounded in the system data above. Use the compliance scores to inform leverage points and red flags. Be direct, assertive, and buyer-centric — this is procurement intelligence, not a sales pitch.

OUTPUT FORMAT:
Return valid JSON with this exact structure:
{
  "sections": [
    { "id": "talking-points", "title": "Talking Points by Role", "content": "..." },
    { "id": "questions", "title": "Questions to Ask", "content": "..." },
    { "id": "leverage", "title": "Negotiation Leverage", "content": "..." },
    { "id": "red-flags", "title": "Red Flags to Watch For", "content": "..." },
    { "id": "compliance-checklist", "title": "Compliance Checklist", "content": "..." },
    { "id": "follow-up", "title": "Follow-up Actions", "content": "..." }
  ]
}

CONTENT GUIDELINES:
- Talking Points by Role: For each attendee role, provide 3-5 key points they should raise. Tailor to their domain expertise.
- Questions to Ask: Organise by topic (Compliance, Security, Data Sovereignty, Commercial Terms, Technical Architecture). 3-5 questions per topic. Include the "why" behind each question.
- Negotiation Leverage: Identify 4-6 leverage points based on the vendor's compliance gaps, market position, or competitive alternatives. Be specific about what scores or gaps give the buyer power.
- Red Flags to Watch For: 5-8 warning signs during the meeting (evasive answers, missing certifications, vague commitments). Rate each as High/Medium risk.
- Compliance Checklist: 8-12 items the team must verify during or after the meeting, based on EU AI Act, GDPR, and any sector-specific regulations. Include checkbox-style formatting.
- Follow-up Actions: Template with 6-8 concrete next steps after the meeting, with suggested owners and deadlines.

Use markdown formatting within content fields (headers, bullet points, bold).
Do NOT include any text outside the JSON structure. Return ONLY the JSON object.`;
}

// ─── Handler ──────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    // Step 1: Parse request
    const body = await request.json();
    const validation = validateRequest(body);

    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { systemSlug, meetingType, attendeeRoles, concerns, budget } = validation.data;

    // Step 2: Rate limit check
    const rateLimit = await checkRateLimit();
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 },
      );
    }

    // Step 3: Tier gate — only pro and enterprise
    const tier = await getEffectiveTier();
    if (tier !== "pro" && tier !== "enterprise") {
      return NextResponse.json(
        { error: "Vendor discussion prep requires a Pro or Enterprise subscription.", upgrade: true },
        { status: 403 },
      );
    }

    // Step 4: Fetch AI system from database
    const system = await prisma.aISystem.findUnique({
      where: { slug: systemSlug },
      include: {
        scores: { include: { framework: { select: { slug: true, name: true } } } },
        industries: { select: { name: true } },
      },
    });

    if (!system) {
      return NextResponse.json({ error: "AI system not found" }, { status: 404 });
    }

    // Compute overall score
    const overallScore = computeOverallScore(system.scores.map((s) => s.score));

    // Step 5: Call Claude
    const apiKey = process.env.ANTHROPIC_API_KEY?.trim();

    if (!apiKey) {
      // Dev mode — return placeholder
      return NextResponse.json({
        sections: [
          { id: "talking-points", title: "Talking Points by Role", content: `[Dev mode] Talking points for ${attendeeRoles.map(r => ROLE_LABELS[r]).join(", ")} meeting with ${system.vendor}` },
          { id: "questions", title: "Questions to Ask", content: `[Dev mode] Questions for ${MEETING_TYPE_LABELS[meetingType]} about ${system.name}` },
          { id: "leverage", title: "Negotiation Leverage", content: `[Dev mode] Leverage points based on overall score: ${overallScore}` },
          { id: "red-flags", title: "Red Flags to Watch For", content: `[Dev mode] Concerns: ${concerns.join(", ")}` },
          { id: "compliance-checklist", title: "Compliance Checklist", content: `[Dev mode] Risk classification: ${system.risk}` },
          { id: "follow-up", title: "Follow-up Actions", content: `[Dev mode] Follow-up template for ${system.vendor} meeting` },
        ],
      });
    }

    const systemPrompt = buildSystemPrompt({
      name: system.name,
      vendor: system.vendor,
      type: system.type,
      risk: system.risk,
      description: system.description,
      category: system.category,
      overallScore,
      scores: system.scores.map((s) => ({ framework: s.framework.name, score: s.score })),
      industries: system.industries.map((i) => i.name),
    });

    const roleLabels = attendeeRoles.map((r) => ROLE_LABELS[r] || r).join(", ");
    const userMessage = `Prepare vendor meeting materials for the following scenario:

**Meeting Type:** ${MEETING_TYPE_LABELS[meetingType] || meetingType}
**Attendees:** ${roleLabels}
**Key Concerns:** ${concerns.join(", ")}
${budget ? `**Budget Context:** ${budget}` : ""}

Generate the preparation materials now. Return ONLY valid JSON.`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), LLM_TIMEOUT_MS);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: LLM_MODEL,
          max_tokens: 2048,
          system: systemPrompt,
          messages: [{ role: "user", content: userMessage }],
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("[vendor-prep] LLM API error:", response.status, errorText);
        return NextResponse.json(
          { error: "Failed to generate vendor prep materials. Please try again." },
          { status: 502 },
        );
      }

      const llmResult = await response.json();
      const textBlock = llmResult.content?.find((b: { type: string }) => b.type === "text");
      const rawText = textBlock?.text || "";

      // Parse the JSON from the LLM response
      const jsonStr = rawText
        .replace(/^```json\s*/i, "")
        .replace(/```\s*$/, "")
        .trim();

      let sections: VendorPrepSection[];
      try {
        const parsed = JSON.parse(jsonStr);
        sections = parsed.sections;
        if (!Array.isArray(sections) || sections.length === 0) {
          throw new Error("Invalid sections array");
        }
      } catch {
        console.error("[vendor-prep] Failed to parse LLM JSON:", jsonStr.slice(0, 200));
        return NextResponse.json(
          { error: "Failed to parse generated materials. Please try again." },
          { status: 502 },
        );
      }

      return NextResponse.json({ sections });
    } catch (fetchError) {
      clearTimeout(timeout);
      if ((fetchError as Error).name === "AbortError") {
        return NextResponse.json(
          { error: "Generation timed out. Please try again." },
          { status: 504 },
        );
      }
      throw fetchError;
    }
  } catch (error) {
    console.error("[vendor-prep] Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 },
    );
  }
}
