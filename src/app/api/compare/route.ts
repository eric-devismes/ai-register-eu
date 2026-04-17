/**
 * POST /api/compare — AI-powered use case matcher and comparison tool.
 *
 * Two-phase flow:
 *
 * Phase 1 — "match":
 *   User describes a use case → LLM analyses it against all AI systems
 *   in the database → returns ranked matches with relevance scores.
 *   Rate-limited like the chatbot (same daily quota).
 *
 * Phase 2 — "compare":
 *   User selects systems from the match results → we return full
 *   comparison data (scores, attributes, vendor details) for a
 *   side-by-side table. No LLM call needed — pure data retrieval.
 *
 * Request body:
 *   { phase: "match",   useCase: string, filters?: { industry?, deployment?, capability? } }
 *   { phase: "compare", systemIds: string[] }
 *
 * Response:
 *   match:   { analysis, matches[], ready }
 *   compare: { systems[], attributes[] }
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkRateLimit, incrementUsage } from "@/lib/chat-rate-limit";
import { guardQuestion } from "@/lib/chat-guard";
import { computeOverallScore } from "@/lib/scoring";
import { LLM_MODEL, LLM_COMPARE_MAX_TOKENS, LLM_TIMEOUT_MS } from "@/lib/constants";

// ─── Comparison Attributes ───────────────────────────────
// These are the rows in the side-by-side comparison table

export const COMPARISON_ATTRIBUTES = [
  // EU Compliance
  { key: "euAiActRisk", label: "EU AI Act Risk Level", category: "EU Compliance" },
  { key: "aiActStatus", label: "EU AI Act Compliance Status", category: "EU Compliance" },
  { key: "gdprStatus", label: "GDPR Compliance", category: "EU Compliance" },
  { key: "euResidency", label: "EU Data Residency", category: "EU Compliance" },
  // Scores
  { key: "score_eu-ai-act", label: "EU AI Act Score", category: "Assessment Scores" },
  { key: "score_gdpr", label: "GDPR Score", category: "Assessment Scores" },
  { key: "score_dora", label: "DORA Score", category: "Assessment Scores" },
  { key: "score_eba-eiopa-guidelines", label: "EBA/EIOPA Score", category: "Assessment Scores" },
  { key: "score_mdr-ivdr", label: "MDR/IVDR Score", category: "Assessment Scores" },
  { key: "score_nis2", label: "NIS2 Score", category: "Assessment Scores" },
  { key: "overallScore", label: "Overall Score", category: "Assessment Scores" },
  // Data & Infrastructure
  { key: "dataStorage", label: "Data Storage", category: "Data & Infrastructure" },
  { key: "dataProcessing", label: "Data Processing", category: "Data & Infrastructure" },
  { key: "trainingDataUse", label: "Training Data Use", category: "Data & Infrastructure" },
  { key: "encryptionInfo", label: "Encryption", category: "Data & Infrastructure" },
  // Governance & Legal
  { key: "dpaDetails", label: "DPA / GDPR Contract", category: "Governance & Legal" },
  { key: "slaDetails", label: "SLA", category: "Governance & Legal" },
  { key: "dataPortability", label: "Data Portability", category: "Governance & Legal" },
  { key: "exitTerms", label: "Exit Terms", category: "Governance & Legal" },
  { key: "ipTerms", label: "IP Ownership", category: "Governance & Legal" },
  // Security
  { key: "certifications", label: "Certifications", category: "Security" },
  { key: "accessControls", label: "Access Controls", category: "Security" },
  // AI Transparency
  { key: "modelDocs", label: "Model Documentation", category: "AI Transparency" },
  { key: "explainability", label: "Explainability", category: "AI Transparency" },
  { key: "biasTesting", label: "Bias Testing", category: "AI Transparency" },
  // Vendor & Product
  { key: "type", label: "System Type", category: "Vendor & Product" },
  { key: "vendorHq", label: "Vendor HQ", category: "Vendor & Product" },
  { key: "euPresence", label: "EU Presence", category: "Vendor & Product" },
  { key: "fundingStatus", label: "Funding / Ownership", category: "Vendor & Product" },
  { key: "employeeCount", label: "Company Size", category: "Vendor & Product" },
  { key: "customerCount", label: "Customer Base", category: "Vendor & Product" },
  { key: "notableCustomers", label: "Notable Customers", category: "Vendor & Product" },
  { key: "useCases", label: "Key Use Cases", category: "Vendor & Product" },
  // Subprocessors & Supply Chain
  { key: "subprocessors", label: "Subprocessors", category: "Supply Chain" },
  { key: "deploymentModel", label: "Deployment Model", category: "Supply Chain" },
  { key: "sourceModel", label: "Source Model", category: "Supply Chain" },
];

// ─── System → Plain Object ───────────────────────────────

function systemToCompareRow(system: Record<string, unknown>, scores: Array<{ frameworkSlug: string; score: string }>) {
  const scoreMap: Record<string, string> = {};
  for (const s of scores) {
    scoreMap[`score_${s.frameworkSlug}`] = s.score;
  }

  const allScores = scores.map((s) => s.score);
  const overallScore = computeOverallScore(allScores);

  return {
    id: system.id,
    slug: system.slug,
    vendor: system.vendor,
    name: system.name,
    description: system.description,
    risk: system.risk,
    category: system.category,
    overallScore,
    euAiActRisk: system.risk,
    aiActStatus: system.aiActStatus || "",
    gdprStatus: system.gdprStatus || "",
    euResidency: system.euResidency || "",
    dataStorage: system.dataStorage || "",
    dataProcessing: system.dataProcessing || "",
    trainingDataUse: system.trainingDataUse || "",
    encryptionInfo: system.encryptionInfo || "",
    dpaDetails: system.dpaDetails || "",
    slaDetails: system.slaDetails || "",
    dataPortability: system.dataPortability || "",
    exitTerms: system.exitTerms || "",
    ipTerms: system.ipTerms || "",
    certifications: system.certifications || "",
    accessControls: system.accessControls || "",
    modelDocs: system.modelDocs || "",
    explainability: system.explainability || "",
    biasTesting: system.biasTesting || "",
    type: system.type || "",
    vendorHq: system.vendorHq || "",
    euPresence: system.euPresence || "",
    useCases: system.useCases || "",
    fundingStatus: system.fundingStatus || "",
    employeeCount: system.employeeCount || "",
    customerCount: system.customerCount || "",
    notableCustomers: system.notableCustomers || "",
    subprocessors: system.subprocessors || "",
    deploymentModel: system.deploymentModel || "",
    sourceModel: system.sourceModel || "",
    assessmentNote: system.assessmentNote || "",
    ...scoreMap,
  };
}

// ─── LLM Call for Matching ───────────────────────────────

async function callMatchingLLM(useCase: string, body: Record<string, unknown>, systemsSummary: string): Promise<{
  analysis: string;
  matches: Array<{ slug: string; relevanceScore: number; reason: string; useCaseMatch: string; riskNote: string }>;
  ready: boolean;
}> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      analysis: "Demo mode — configure ANTHROPIC_API_KEY to enable AI matching.",
      matches: [],
      ready: true,
    };
  }

  const Anthropic = (await import("@anthropic-ai/sdk")).default;
  const client = new Anthropic({ apiKey });

  // Build filter context from optional structured fields
  const filters = (body.filters || {}) as { industry?: string; deployment?: string; capability?: string };
  const filterContext = [
    filters.industry ? `Industry: ${filters.industry}` : "",
    filters.deployment ? `Deployment preference: ${filters.deployment}` : "",
    filters.capability ? `Key capability needed: ${filters.capability}` : "",
  ].filter(Boolean).join("\n");

  const systemPrompt = `You are an AI procurement advisor for EU enterprises. You help organisations find the right AI solutions for their use cases while ensuring EU regulatory compliance (EU AI Act, GDPR, DORA).

Your job: Analyse the use case and return ranked matches from the AI systems database. Always return matches directly — never ask follow-up questions.

AVAILABLE AI SYSTEMS (summary):
${systemsSummary}

${filterContext ? `USER FILTERS (use these to prioritise results):\n${filterContext}\n` : ""}
RESPONSE FORMAT — return ONLY valid JSON:
{
  "ready": true,
  "analysis": "2-3 sentence analysis of the use case and key considerations",
  "matches": [
    {
      "slug": "system-slug-from-database",
      "relevanceScore": 95,
      "reason": "Why this system fits the use case (1-2 sentences)",
      "useCaseMatch": "Specific feature/capability that matches",
      "riskNote": "EU AI Act risk level for this specific use case"
    }
  ]
}

Rules:
- Always return ready: true with matches — never ask follow-up questions
- Only include systems genuinely relevant to the use case
- If the user specified filters (industry, deployment, capability), strongly prefer systems matching those filters
- relevanceScore is 0-100 (only include systems with score >= 50)
- Maximum 8 matches, ranked by relevance
- Be specific about which feature of the system matches the use case
- Always note the EU AI Act risk classification for the specific use case
- If the use case involves personal data, flag GDPR considerations
- If the use case involves employment/HR, flag Annex III Category 4
- If the use case involves financial decisions, flag Annex III Category 5`;

  const userMessage = `Use case: ${useCase}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), LLM_TIMEOUT_MS);

  let response;
  try {
    response = await client.messages.create({
      model: LLM_MODEL,
      max_tokens: LLM_COMPARE_MAX_TOKENS,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    }, { signal: controller.signal }).finally(() => clearTimeout(timeout));
  } catch (error: unknown) {
    console.error("[compare] LLM call failed:", error);
    const status = (error as { status?: number })?.status;
    if (status === 400 || status === 402) {
      return {
        ready: true,
        analysis: "The AI matching service is temporarily unavailable. You can browse our AI database directly to find systems relevant to your use case.",
        matches: [],
      };
    }
    return {
      ready: true,
      analysis: "Unable to process your request. Please try again in a moment.",
      matches: [],
    };
  }

  const text = response.content.find((b) => b.type === "text")?.text || "{}";

  try {
    const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/(\{[\s\S]*\})/);
    const jsonStr = jsonMatch ? jsonMatch[1] : text;
    return JSON.parse(jsonStr);
  } catch {
    return {
      ready: true,
      analysis: "Unable to parse response. Please try again.",
      matches: [],
    };
  }
}

// ─── Route Handler ────────────────────────────────────────

export async function POST(request: Request) {
  try {
    // ── Request size guard (max 10KB) ─────────────────────
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > 10240) {
      return NextResponse.json({ error: "Request too large" }, { status: 413 });
    }

    const body = await request.json();
    const { useCase, systemIds, phase } = body as {
      useCase?: string;
      systemIds?: string[];
      filters?: { industry?: string; deployment?: string; capability?: string };
      phase: "match" | "compare";
    };

    // ── Phase 2: Return full comparison data (no LLM, lighter limits) ──
    if (phase === "compare" && systemIds?.length) {
      if (systemIds.length > 10) {
        return NextResponse.json({ error: "Maximum 10 systems" }, { status: 400 });
      }
      const systems = await prisma.aISystem.findMany({
        where: { id: { in: systemIds }, status: "active" },
        include: {
          scores: { include: { framework: true } },
          industries: true,
        },
      });

      const rows = systems.map((s) =>
        systemToCompareRow(s as unknown as Record<string, unknown>, s.scores.map((sc) => ({
          frameworkSlug: sc.framework.slug,
          score: sc.score,
        })))
      );

      return NextResponse.json({ systems: rows, attributes: COMPARISON_ATTRIBUTES });
    }

    // ── Phase 1: Match use case to systems ─────────────────
    if (!useCase) {
      return NextResponse.json({ error: "useCase is required" }, { status: 400 });
    }

    // Rate limit (same daily limits as chatbot)
    const rateLimit = await checkRateLimit();
    if (!rateLimit.allowed) {
      return NextResponse.json({
        error: "Daily comparison limit reached. Sign up for more.",
        remaining: 0,
      }, { status: 429 });
    }

    // Input length cap (2000 chars for use case descriptions)
    if (useCase.length > 2000) {
      return NextResponse.json({ error: "Use case description too long (max 2000 characters)" }, { status: 400 });
    }

    // Injection detection on use case input
    const guard = guardQuestion(useCase);
    if (!guard.allowed && guard.reason === "injection") {
      return NextResponse.json({
        error: "Please describe a genuine business use case.",
        analysis: "Please describe what your organisation needs — e.g., 'customer service automation for our insurance claims team'.",
        matches: [],
        ready: true,
      });
    }

    // Count this as a usage
    await incrementUsage(rateLimit.fingerprint);

    // Fetch all systems with scores and industries — used for both
    // the LLM summary and for enriching match results afterwards.
    // Single query instead of two separate fetches.
    const allSystems = await prisma.aISystem.findMany({
      where: { status: "active" },
      include: {
        scores: { include: { framework: { select: { slug: true, name: true } } } },
        industries: { select: { name: true } },
      },
    });

    // Build a text summary for the LLM (just the fields it needs to rank)
    const systemsSummary = allSystems
      .map((s) => {
        const scores = s.scores.map((sc) => `${sc.framework.slug}: ${sc.score}`).join(", ");
        const industries = s.industries.map((i) => i.name).join(", ");
        return `Slug: ${s.slug}
Name: ${s.vendor} — ${s.name}
Type: ${s.type}
EU AI Act Risk: ${s.risk}
Category: ${s.category}
Industries: ${industries}
Key capabilities: ${(s.useCases || "").split("\n").slice(0, 8).join(" | ")}
Scores: ${scores}
---`;
      })
      .join("\n");

    const result = await callMatchingLLM(useCase, body, systemsSummary);

    // Enrich LLM matches with full system data from the already-fetched list
    // (no second DB query needed — we reuse allSystems)
    if (result.ready && result.matches?.length) {
      const systemsBySlug = Object.fromEntries(allSystems.map((s) => [s.slug, s]));

      const enrichedMatches = result.matches
        .filter((m) => systemsBySlug[m.slug])
        .map((m) => {
          const s = systemsBySlug[m.slug];
          return {
            ...m,
            id: s.id,
            vendor: s.vendor,
            name: s.name,
            type: s.type,
            risk: s.risk,
            description: s.description,
            overallScore: computeOverallScore(s.scores.map((sc) => sc.score)),
            scores: s.scores.map((sc) => ({ framework: sc.framework.name, frameworkSlug: sc.framework.slug, score: sc.score })),
            industries: s.industries.map((i) => i.name),
          };
        });

      return NextResponse.json({ ...result, matches: enrichedMatches });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("[compare] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
