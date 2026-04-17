/**
 * POST /api/rfp — Generate draft RFP/RFI answers using AI system intelligence.
 *
 * Pipeline:
 *   1. Tier gate — Enterprise only
 *   2. Validate request (1-20 questions, 1-5 system slugs)
 *   3. Fetch AI systems from database with scores
 *   4. For each question, call Claude to generate a draft answer
 *   5. Return array of { question, answer, systemsReferenced }
 *
 * Request:  { questions: string[], systemSlugs: string[], companyContext?: string }
 * Response: { answers: { question, answer, systemsReferenced }[] }
 */

import { NextResponse } from "next/server";
import { getEffectiveTier } from "@/lib/tier-access";
import { prisma } from "@/lib/db";
import { computeOverallScore } from "@/lib/scoring";
import { LLM_MODEL, LLM_TIMEOUT_MS } from "@/lib/constants";

// ─── Types ────────────────────────────────────────────────

interface RFPRequest {
  questions: string[];
  systemSlugs: string[];
  companyContext?: string;
}

interface RFPAnswer {
  question: string;
  answer: string;
  systemsReferenced: string[];
}

// ─── Validation ───────────────────────────────────────────

function validateRequest(body: unknown): { valid: true; data: RFPRequest } | { valid: false; error: string } {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Invalid request body" };
  }

  const b = body as Record<string, unknown>;

  if (!Array.isArray(b.questions) || b.questions.length === 0) {
    return { valid: false, error: "At least 1 question is required" };
  }
  if (b.questions.length > 20) {
    return { valid: false, error: "Maximum 20 questions allowed" };
  }
  if (!b.questions.every((q: unknown) => typeof q === "string" && q.trim().length > 0)) {
    return { valid: false, error: "All questions must be non-empty strings" };
  }

  if (!Array.isArray(b.systemSlugs) || b.systemSlugs.length === 0) {
    return { valid: false, error: "At least 1 AI system is required" };
  }
  if (b.systemSlugs.length > 5) {
    return { valid: false, error: "Maximum 5 AI systems allowed" };
  }
  if (!b.systemSlugs.every((s: unknown) => typeof s === "string" && s.trim().length > 0)) {
    return { valid: false, error: "All system slugs must be non-empty strings" };
  }

  if (b.companyContext !== undefined && typeof b.companyContext !== "string") {
    return { valid: false, error: "companyContext must be a string" };
  }

  return {
    valid: true,
    data: {
      questions: (b.questions as string[]).map((q) => q.trim().slice(0, 2000)),
      systemSlugs: b.systemSlugs as string[],
      companyContext: b.companyContext ? (b.companyContext as string).slice(0, 2000) : undefined,
    },
  };
}

// ─── Build System Context ─────────────────────────────────

function buildSystemContext(
  systems: {
    name: string;
    vendor: string;
    slug: string;
    type: string;
    risk: string;
    description: string;
    category: string;
    overallScore: string;
    scores: { framework: string; score: string }[];
    industries: string[];
  }[],
): string {
  return systems
    .map((sys) => {
      const scoreLines = sys.scores
        .map((s) => `    - ${s.framework}: ${s.score}`)
        .join("\n");
      return `## ${sys.vendor} — ${sys.name}
  - Type: ${sys.type}
  - EU AI Act Risk Classification: ${sys.risk}
  - Category: ${sys.category}
  - Description: ${sys.description}
  - Overall Compliance Score: ${sys.overallScore}
  - Compliance Scores by Framework:
${scoreLines}
  - Applicable Industries: ${sys.industries.join(", ")}`;
    })
    .join("\n\n");
}

// ─── System Prompt ────────────────────────────────────────

const SYSTEM_PROMPT = `You are an AI procurement specialist helping respond to RFP/RFI questions. Use the provided AI system data to craft professional, accurate responses. Be specific about EU compliance (AI Act, GDPR, DORA). Cite concrete capabilities, certifications, and data residency details. If information is not available, say so honestly rather than fabricating.

Write clear, professional prose suitable for a formal RFP/RFI response document. Use markdown formatting where helpful (bold, bullet points). Keep answers concise but thorough.`;

// ─── Handler ──────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    // Step 1: Parse request
    const body = await request.json();
    const validation = validateRequest(body);

    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { questions, systemSlugs, companyContext } = validation.data;

    // Step 2: Tier gate — Enterprise only
    const tier = await getEffectiveTier();
    if (tier !== "enterprise") {
      return NextResponse.json(
        { error: "RFP/RFI Answer Engine requires an Enterprise subscription.", upgrade: true },
        { status: 403 },
      );
    }

    // Step 3: Fetch AI systems from database
    const systems = await prisma.aISystem.findMany({
      where: { slug: { in: systemSlugs }, status: "active" },
      include: {
        scores: { include: { framework: { select: { slug: true, name: true } } } },
        industries: { select: { name: true } },
      },
    });

    if (systems.length === 0) {
      return NextResponse.json({ error: "No matching AI systems found" }, { status: 404 });
    }

    // Build enriched system data
    const enrichedSystems = systems.map((sys) => ({
      name: sys.name,
      vendor: sys.vendor,
      slug: sys.slug,
      type: sys.type,
      risk: sys.risk,
      description: sys.description,
      category: sys.category,
      overallScore: computeOverallScore(sys.scores.map((s) => s.score)),
      scores: sys.scores.map((s) => ({ framework: s.framework.name, score: s.score })),
      industries: sys.industries.map((i) => i.name),
    }));

    const systemContext = buildSystemContext(enrichedSystems);
    const systemNames = enrichedSystems.map((s) => `${s.vendor} ${s.name}`);

    // Step 4: Check for API key
    const apiKey = process.env.ANTHROPIC_API_KEY?.trim();

    if (!apiKey) {
      // Dev mode — return placeholder answers
      const devAnswers: RFPAnswer[] = questions.map((q) => ({
        question: q,
        answer: `[Dev mode] Draft answer for: "${q}"\n\nBased on analysis of ${systemNames.join(", ")}. This is a placeholder response — configure ANTHROPIC_API_KEY for real answers.`,
        systemsReferenced: systemNames,
      }));
      return NextResponse.json({ answers: devAnswers });
    }

    // Step 5: Process questions sequentially to avoid rate limiting
    const answers: RFPAnswer[] = [];

    for (const question of questions) {
      const userMessage = `${companyContext ? `RESPONDING COMPANY CONTEXT:\n${companyContext}\n\n` : ""}AI SYSTEMS BEING PROPOSED:
${systemContext}

RFP/RFI QUESTION:
${question}

Generate a professional draft answer to this RFP/RFI question based on the AI system data above. Be specific and cite actual compliance scores and capabilities.`;

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
            max_tokens: 1024,
            system: SYSTEM_PROMPT,
            messages: [{ role: "user", content: userMessage }],
          }),
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("[rfp] LLM API error:", response.status, errorText);
          answers.push({
            question,
            answer: "Failed to generate answer for this question. Please try again.",
            systemsReferenced: systemNames,
          });
          continue;
        }

        const llmResult = await response.json();
        const textBlock = llmResult.content?.find((b: { type: string }) => b.type === "text");
        const answerText = textBlock?.text || "No answer generated.";

        answers.push({
          question,
          answer: answerText,
          systemsReferenced: systemNames,
        });
      } catch (fetchError) {
        clearTimeout(timeout);
        if ((fetchError as Error).name === "AbortError") {
          answers.push({
            question,
            answer: "Answer generation timed out for this question. Please try again.",
            systemsReferenced: systemNames,
          });
        } else {
          console.error("[rfp] Fetch error for question:", fetchError);
          answers.push({
            question,
            answer: "An error occurred generating the answer for this question.",
            systemsReferenced: systemNames,
          });
        }
      }
    }

    return NextResponse.json({ answers });
  } catch (error) {
    console.error("[rfp] Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 },
    );
  }
}
