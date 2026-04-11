/**
 * POST /api/business-case — Generate a structured business case for an AI system.
 *
 * Pipeline:
 *   1. Parse & validate request body
 *   2. Rate limit check (fingerprint cookie + subscriber tier)
 *   3. Tier gate — only pro and enterprise tiers can generate
 *   4. Fetch AI system from database by slug (with scores + industries)
 *   5. Call Claude with structured business case prompt
 *   6. Return generated business case sections as JSON
 *
 * Request:  { systemSlug, useCase, industry, orgSize, teamSize, currentProcess }
 * Response: { sections: { title, content }[] }
 */

import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/chat-rate-limit";
import { getEffectiveTier } from "@/lib/tier-access";
import { prisma } from "@/lib/db";
import { computeOverallScore } from "@/lib/scoring";
import { LLM_MODEL, LLM_TIMEOUT_MS } from "@/lib/constants";

// ─── Types ────────────────────────────────────────────────

interface BusinessCaseRequest {
  systemSlug: string;
  useCase: string;
  industry: string;
  orgSize: string;
  teamSize: number;
  currentProcess: string;
}

interface BusinessCaseSection {
  id: string;
  title: string;
  content: string;
}

// ─── Validation ───────────────────────────────────────────

const VALID_ORG_SIZES = ["startup", "sme", "enterprise", "public-sector"];

function validateRequest(body: unknown): { valid: true; data: BusinessCaseRequest } | { valid: false; error: string } {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Invalid request body" };
  }

  const b = body as Record<string, unknown>;

  if (!b.systemSlug || typeof b.systemSlug !== "string") {
    return { valid: false, error: "systemSlug is required" };
  }
  if (!b.useCase || typeof b.useCase !== "string" || b.useCase.length < 10) {
    return { valid: false, error: "useCase must be at least 10 characters" };
  }
  if (!b.industry || typeof b.industry !== "string") {
    return { valid: false, error: "industry is required" };
  }
  if (!b.orgSize || typeof b.orgSize !== "string" || !VALID_ORG_SIZES.includes(b.orgSize)) {
    return { valid: false, error: `orgSize must be one of: ${VALID_ORG_SIZES.join(", ")}` };
  }
  if (typeof b.teamSize !== "number" || b.teamSize < 1 || b.teamSize > 10000) {
    return { valid: false, error: "teamSize must be a number between 1 and 10,000" };
  }
  if (!b.currentProcess || typeof b.currentProcess !== "string" || b.currentProcess.length < 5) {
    return { valid: false, error: "currentProcess must be at least 5 characters" };
  }

  return {
    valid: true,
    data: {
      systemSlug: b.systemSlug as string,
      useCase: (b.useCase as string).slice(0, 1000),
      industry: (b.industry as string).slice(0, 100),
      orgSize: b.orgSize as string,
      teamSize: b.teamSize as number,
      currentProcess: (b.currentProcess as string).slice(0, 1000),
    },
  };
}

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

  return `You are the AI Compass EU Business Case Generator. You create professional, data-driven business cases that European decision-makers can present to their board or procurement committee.

SYSTEM BEING EVALUATED:
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
Generate a structured business case with exactly these sections. Each section must be practical, specific, and grounded in the system data above. Use the compliance scores to inform the EU compliance assessment. Be realistic about costs and timelines.

OUTPUT FORMAT:
Return valid JSON with this exact structure:
{
  "sections": [
    { "id": "executive-summary", "title": "Executive Summary", "content": "..." },
    { "id": "current-state", "title": "Current State Analysis", "content": "..." },
    { "id": "proposed-solution", "title": "Proposed Solution", "content": "..." },
    { "id": "eu-compliance", "title": "EU Compliance Assessment", "content": "..." },
    { "id": "cost-analysis", "title": "Cost Analysis", "content": "..." },
    { "id": "risk-assessment", "title": "Risk Assessment", "content": "..." },
    { "id": "implementation-timeline", "title": "Implementation Timeline", "content": "..." },
    { "id": "roi-projection", "title": "ROI Projection", "content": "..." },
    { "id": "recommendation", "title": "Recommendation", "content": "..." }
  ]
}

CONTENT GUIDELINES:
- Executive Summary: 3-4 sentences summarising the opportunity, key compliance findings, and recommendation.
- Current State Analysis: Analyse the user's current process and its limitations.
- Proposed Solution: How the AI system addresses the use case, with specific capabilities.
- EU Compliance Assessment: Reference the actual compliance scores. Flag any areas below B+. Mention the AI Act risk classification and what obligations that entails.
- Cost Analysis: Provide estimated cost ranges based on org size and team size. Include licensing, implementation, training, and ongoing costs. Use realistic EU market pricing.
- Risk Assessment: Cover regulatory risk, vendor lock-in, data sovereignty, operational risk, and change management risk. Rate each as Low/Medium/High.
- Implementation Timeline: Phased approach (pilot, rollout, optimisation) with realistic EU enterprise timelines.
- ROI Projection: Quantify expected benefits (time savings, error reduction, compliance cost avoidance). Use conservative estimates.
- Recommendation: Clear go/no-go recommendation with conditions.

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

    const { systemSlug, useCase, industry, orgSize, teamSize, currentProcess } = validation.data;

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
        { error: "Business case generation requires a Pro or Enterprise subscription.", upgrade: true },
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
          { id: "executive-summary", title: "Executive Summary", content: `[Dev mode] Business case for ${system.name} by ${system.vendor} — use case: ${useCase}` },
          { id: "current-state", title: "Current State Analysis", content: `Current process: ${currentProcess}` },
          { id: "proposed-solution", title: "Proposed Solution", content: `${system.name}: ${system.description}` },
          { id: "eu-compliance", title: "EU Compliance Assessment", content: `Overall score: ${overallScore}. Risk: ${system.risk}.` },
          { id: "cost-analysis", title: "Cost Analysis", content: `Org: ${orgSize}, Team: ${teamSize} users in ${industry}` },
          { id: "risk-assessment", title: "Risk Assessment", content: "Dev mode placeholder." },
          { id: "implementation-timeline", title: "Implementation Timeline", content: "Dev mode placeholder." },
          { id: "roi-projection", title: "ROI Projection", content: "Dev mode placeholder." },
          { id: "recommendation", title: "Recommendation", content: "Dev mode placeholder." },
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

    const userMessage = `Generate a business case for the following scenario:

**Use Case:** ${useCase}
**Industry:** ${industry}
**Organisation Size:** ${orgSize}
**Team Size:** ${teamSize} users
**Current Process:** ${currentProcess}

Generate the business case now. Return ONLY valid JSON.`;

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
        console.error("[business-case] LLM API error:", response.status, errorText);
        return NextResponse.json(
          { error: "Failed to generate business case. Please try again." },
          { status: 502 },
        );
      }

      const llmResult = await response.json();
      const textBlock = llmResult.content?.find((b: { type: string }) => b.type === "text");
      const rawText = textBlock?.text || "";

      // Parse the JSON from the LLM response
      // The LLM may wrap it in ```json ... ``` — strip that
      const jsonStr = rawText
        .replace(/^```json\s*/i, "")
        .replace(/```\s*$/, "")
        .trim();

      let sections: BusinessCaseSection[];
      try {
        const parsed = JSON.parse(jsonStr);
        sections = parsed.sections;
        if (!Array.isArray(sections) || sections.length === 0) {
          throw new Error("Invalid sections array");
        }
      } catch {
        console.error("[business-case] Failed to parse LLM JSON:", jsonStr.slice(0, 200));
        return NextResponse.json(
          { error: "Failed to parse generated business case. Please try again." },
          { status: 502 },
        );
      }

      return NextResponse.json({ sections });
    } catch (fetchError) {
      clearTimeout(timeout);
      if ((fetchError as Error).name === "AbortError") {
        return NextResponse.json(
          { error: "Business case generation timed out. Please try again." },
          { status: 504 },
        );
      }
      throw fetchError;
    }
  } catch (error) {
    console.error("[business-case] Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 },
    );
  }
}
