/**
 * POST /api/podium — Top-3 AI system recommendations (gold/silver/bronze podium).
 *
 * Pipeline:
 *   1. Parse & validate request body
 *   2. Tier gate — only pro and enterprise tiers can generate
 *   3. Fetch ALL AI systems from database with scores
 *   4. Call Claude with ALL system data + user requirements
 *   5. Parse JSON response and enrich with actual DB data
 *   6. Return podium results
 *
 * Request:  { useCase, industry, requirements[], orgSize, budget? }
 * Response: { podium: PodiumEntry[], systemCount: number }
 */

import { NextResponse } from "next/server";
import { getEffectiveTier } from "@/lib/tier-access";
import { prisma } from "@/lib/db";
import { computeOverallScore } from "@/lib/scoring";
import { LLM_MODEL, LLM_TIMEOUT_MS } from "@/lib/constants";

// ─── Types ────────────────────────────────────────────────

interface PodiumRequest {
  useCase: string;
  industry: string;
  requirements: string[];
  orgSize: string;
  budget?: string;
}

interface LLMRecommendation {
  systemSlug: string;
  rank: number;
  overallFit: number;
  strengths: string[];
  weaknesses: string[];
  complianceHighlights: string;
  riskFlags: string[];
  recommendation: string;
}

// ─── Validation ───────────────────────────────────────────

const VALID_ORG_SIZES = ["sme", "mid-enterprise", "large-enterprise", "multinational", "public-sector"];

function validateRequest(body: unknown): { valid: true; data: PodiumRequest } | { valid: false; error: string } {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Invalid request body" };
  }

  const b = body as Record<string, unknown>;

  if (!b.useCase || typeof b.useCase !== "string" || b.useCase.length < 10) {
    return { valid: false, error: "useCase must be at least 10 characters" };
  }
  if (!b.industry || typeof b.industry !== "string") {
    return { valid: false, error: "industry is required" };
  }
  if (!b.orgSize || typeof b.orgSize !== "string" || !VALID_ORG_SIZES.includes(b.orgSize)) {
    return { valid: false, error: `orgSize must be one of: ${VALID_ORG_SIZES.join(", ")}` };
  }
  if (!Array.isArray(b.requirements) || b.requirements.length === 0) {
    return { valid: false, error: "At least one requirement is needed" };
  }
  if (b.requirements.some((r: unknown) => typeof r !== "string")) {
    return { valid: false, error: "All requirements must be strings" };
  }

  return {
    valid: true,
    data: {
      useCase: (b.useCase as string).slice(0, 1000),
      industry: (b.industry as string).slice(0, 100),
      requirements: (b.requirements as string[]).slice(0, 20).map((r) => r.slice(0, 200)),
      orgSize: b.orgSize as string,
      budget: b.budget && typeof b.budget === "string" ? (b.budget as string).slice(0, 100) : undefined,
    },
  };
}

// ─── System Prompt ────────────────────────────────────────

function buildSystemPrompt(
  systems: {
    slug: string;
    name: string;
    vendor: string;
    type: string;
    risk: string;
    description: string;
    category: string;
    overallScore: string;
    scores: { framework: string; score: string }[];
    industries: string[];
  }[],
): string {
  const systemsList = systems
    .map(
      (s, i) =>
        `[${i + 1}] slug: "${s.slug}" | ${s.vendor} ${s.name} | Type: ${s.type} | Risk: ${s.risk} | Category: ${s.category} | Overall: ${s.overallScore} | Scores: ${s.scores.map((sc) => `${sc.framework}=${sc.score}`).join(", ")} | Industries: ${s.industries.join(", ")} | ${s.description}`,
    )
    .join("\n");

  return `You are the AI Compass EU Podium Recommender. You analyse AI systems against user requirements to recommend the top 3 best-fit solutions.

You have access to ${systems.length} AI systems from the AI Compass EU database:

${systemsList}

YOUR TASK:
Based on the user's requirements, analyse ALL systems above and select the top 3. Rank them as gold (1st), silver (2nd), and bronze (3rd).

EVALUATION CRITERIA:
- Match to stated use case and industry
- Compliance scores (especially frameworks relevant to their industry)
- Risk classification appropriateness
- Match to specific requirements (e.g., data residency, certifications)
- Suitability for organisation size
- Budget fit (if provided)

BE HONEST:
- No system is perfect. Always list genuine weaknesses.
- If a system has a low compliance score in a relevant framework, flag it.
- Risk flags should highlight real concerns (high-risk classification, low scores, vendor lock-in, etc.)

OUTPUT FORMAT:
Return valid JSON with this exact structure:
{
  "recommendations": [
    {
      "systemSlug": "the-system-slug",
      "rank": 1,
      "overallFit": 85,
      "strengths": ["Strength 1", "Strength 2", "Strength 3"],
      "weaknesses": ["Weakness 1", "Weakness 2"],
      "complianceHighlights": "Brief compliance summary with specific scores referenced",
      "riskFlags": ["Risk flag 1"],
      "recommendation": "2-3 sentence recommendation explaining why this system ranks here and what to watch for."
    }
  ]
}

RULES:
- Return exactly 3 recommendations, ranked 1, 2, 3.
- overallFit is 0-100, representing how well the system fits the specific requirements.
- strengths: 2-4 items. weaknesses: 1-3 items. riskFlags: 0-3 items.
- Use the exact slug from the database for systemSlug.
- Do NOT include any text outside the JSON structure. Return ONLY the JSON object.`;
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

    const { useCase, industry, requirements, orgSize, budget } = validation.data;

    // Step 2: Tier gate — only pro and enterprise
    const tier = await getEffectiveTier();
    if (tier !== "pro" && tier !== "enterprise") {
      return NextResponse.json(
        { error: "Podium recommendations require a Pro or Enterprise subscription.", upgrade: true },
        { status: 403 },
      );
    }

    // Step 3: Fetch ALL AI systems with scores
    const systems = await prisma.aISystem.findMany({
      where: { status: "active" },
      include: {
        scores: { include: { framework: { select: { slug: true, name: true } } } },
        industries: { select: { name: true } },
      },
      orderBy: { name: "asc" },
    });

    if (systems.length === 0) {
      return NextResponse.json({ error: "No AI systems found in database" }, { status: 404 });
    }

    // Prepare systems data for the LLM
    const systemsForLLM = systems.map((s) => ({
      slug: s.slug,
      name: s.name,
      vendor: s.vendor,
      type: s.type,
      risk: s.risk,
      description: s.description,
      category: s.category,
      overallScore: computeOverallScore(s.scores.map((sc) => sc.score)),
      scores: s.scores.map((sc) => ({ framework: sc.framework.name, score: sc.score })),
      industries: s.industries.map((i) => i.name),
    }));

    // Step 4: Call Claude
    const apiKey = process.env.ANTHROPIC_API_KEY?.trim();

    if (!apiKey) {
      // Dev mode — return placeholder with first 3 systems
      const devSlugs = systemsForLLM.slice(0, 3);
      return NextResponse.json({
        podium: devSlugs.map((s, i) => ({
          rank: i + 1,
          systemSlug: s.slug,
          systemName: s.name,
          vendor: s.vendor,
          type: s.type,
          risk: s.risk,
          category: s.category,
          overallScore: s.overallScore,
          overallFit: 90 - i * 10,
          strengths: ["[Dev mode] Strong compliance scores", "Good industry fit"],
          weaknesses: ["[Dev mode] Placeholder weakness"],
          complianceHighlights: `[Dev mode] Overall score: ${s.overallScore}. Risk: ${s.risk}.`,
          riskFlags: i === 2 ? ["[Dev mode] Sample risk flag"] : [],
          recommendation: `[Dev mode] ${s.vendor} ${s.name} is recommended for ${useCase}.`,
          scores: s.scores,
          industries: s.industries,
        })),
        systemCount: systems.length,
      });
    }

    const systemPrompt = buildSystemPrompt(systemsForLLM);

    const userMessage = `Find the top 3 AI systems for the following requirements:

**Use Case:** ${useCase}
**Industry:** ${industry}
**Organisation Size:** ${orgSize}
**Key Requirements:** ${requirements.join(", ")}
${budget ? `**Budget Range:** ${budget}` : ""}

Analyse all ${systems.length} systems and return your top 3 recommendations as JSON.`;

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
        console.error("[podium] LLM API error:", response.status, errorText);
        return NextResponse.json(
          { error: "Failed to generate recommendations. Please try again." },
          { status: 502 },
        );
      }

      const llmResult = await response.json();
      const textBlock = llmResult.content?.find((b: { type: string }) => b.type === "text");
      const rawText = textBlock?.text || "";

      // Parse JSON — strip markdown code fences if present
      const jsonStr = rawText
        .replace(/^```json\s*/i, "")
        .replace(/```\s*$/, "")
        .trim();

      let recommendations: LLMRecommendation[];
      try {
        const parsed = JSON.parse(jsonStr);
        recommendations = parsed.recommendations;
        if (!Array.isArray(recommendations) || recommendations.length !== 3) {
          throw new Error("Expected exactly 3 recommendations");
        }
      } catch {
        console.error("[podium] Failed to parse LLM JSON:", jsonStr.slice(0, 200));
        return NextResponse.json(
          { error: "Failed to parse recommendations. Please try again." },
          { status: 502 },
        );
      }

      // Step 5: Enrich with actual DB data
      const systemsBySlug = new Map(
        systemsForLLM.map((s) => [s.slug, s]),
      );

      const podium = recommendations
        .sort((a, b) => a.rank - b.rank)
        .map((rec) => {
          const sys = systemsBySlug.get(rec.systemSlug);
          return {
            rank: rec.rank,
            systemSlug: rec.systemSlug,
            systemName: sys?.name || rec.systemSlug,
            vendor: sys?.vendor || "Unknown",
            type: sys?.type || "Unknown",
            risk: sys?.risk || "Unknown",
            category: sys?.category || "Unknown",
            overallScore: sys?.overallScore || "N/A",
            overallFit: Math.min(100, Math.max(0, rec.overallFit)),
            strengths: rec.strengths,
            weaknesses: rec.weaknesses,
            complianceHighlights: rec.complianceHighlights,
            riskFlags: rec.riskFlags,
            recommendation: rec.recommendation,
            scores: sys?.scores || [],
            industries: sys?.industries || [],
          };
        });

      return NextResponse.json({ podium, systemCount: systems.length });
    } catch (fetchError) {
      clearTimeout(timeout);
      if ((fetchError as Error).name === "AbortError") {
        return NextResponse.json(
          { error: "Recommendation generation timed out. Please try again." },
          { status: 504 },
        );
      }
      throw fetchError;
    }
  } catch (error) {
    console.error("[podium] Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 },
    );
  }
}
