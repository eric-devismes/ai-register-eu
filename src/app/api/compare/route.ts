/**
 * POST /api/compare — AI-powered use case matcher + follow-up conversation.
 *
 * Phase 1 (no systemIds): Analyse use case description, ask follow-up questions,
 *   then return ranked matching AI systems from the database.
 *
 * Phase 2 (systemIds provided): Return full comparison data for selected systems.
 *
 * Body: {
 *   useCase: string,           // plain text use case description
 *   followUpAnswers?: string,  // answers to follow-up questions
 *   systemIds?: string[],      // if provided, return comparison data
 *   phase: "match" | "compare"
 * }
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

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
  // Product
  { key: "type", label: "System Type", category: "Product" },
  { key: "vendorHq", label: "Vendor HQ", category: "Product" },
  { key: "euPresence", label: "EU Presence", category: "Product" },
  { key: "useCases", label: "Key Use Cases", category: "Product" },
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
    assessmentNote: system.assessmentNote || "",
    ...scoreMap,
  };
}

function computeOverallScore(grades: string[]): string {
  const map: Record<string, number> = {
    "A+": 10, "A": 9, "A-": 8, "B+": 7, "B": 6, "B-": 5,
    "C+": 4, "C": 3, "C-": 2, "D": 1, "F": 0,
  };
  if (grades.length === 0) return "N/A";
  const total = grades.reduce((s, g) => s + (map[g] ?? 0), 0);
  const avg = total / grades.length;
  const thresholds: [number, string][] = [
    [9.5, "A+"], [8.5, "A"], [7.5, "A-"], [6.5, "B+"],
    [5.5, "B"], [4.5, "B-"], [3.5, "C+"], [2.5, "C"], [1.5, "C-"], [0, "D"],
  ];
  for (const [t, g] of thresholds) if (avg >= t) return g;
  return "D";
}

// ─── LLM Call for Matching ───────────────────────────────

async function callMatchingLLM(useCase: string, followUpAnswers: string, systemsSummary: string): Promise<{
  analysis: string;
  followUpQuestions: string[] | null;
  matches: Array<{ slug: string; relevanceScore: number; reason: string; useCaseMatch: string; riskNote: string }>;
  ready: boolean;
}> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      analysis: "Demo mode — configure ANTHROPIC_API_KEY to enable AI matching.",
      followUpQuestions: null,
      matches: [],
      ready: false,
    };
  }

  const Anthropic = (await import("@anthropic-ai/sdk")).default;
  const client = new Anthropic({ apiKey });

  const systemPrompt = `You are an AI procurement advisor for EU enterprises. You help organisations find the right AI solutions for their use cases while ensuring EU regulatory compliance (EU AI Act, GDPR, DORA).

Your job:
1. Analyse the use case description
2. If you need more information to make a good recommendation, ask 2-3 focused follow-up questions
3. Once you have enough information, return ranked matches from the AI systems database

AVAILABLE AI SYSTEMS (summary):
${systemsSummary}

RESPONSE FORMAT — you must return ONLY valid JSON in this exact format:

If you need more information:
{
  "ready": false,
  "analysis": "Brief analysis of what you understand so far",
  "followUpQuestions": ["Question 1?", "Question 2?", "Question 3?"]
}

If you have enough information to recommend:
{
  "ready": true,
  "analysis": "2-3 sentence analysis of the use case and key considerations",
  "followUpQuestions": null,
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
- Only include systems that are genuinely relevant to the use case
- relevanceScore is 0-100 (only include systems with score >= 50)
- Maximum 8 matches, ranked by relevance
- Be specific about which feature of the system matches the use case
- Always note the EU AI Act risk classification for the specific use case
- If the use case involves personal data, flag GDPR considerations
- If the use case involves employment/HR, flag Annex III Category 4
- If the use case involves financial decisions, flag Annex III Category 5`;

  const userMessage = followUpAnswers
    ? `Use case: ${useCase}\n\nFollow-up answers: ${followUpAnswers}`
    : `Use case: ${useCase}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  const response = await client.messages.create({
    model: "claude-haiku-4-20250414",
    max_tokens: 2048,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  }, { signal: controller.signal }).finally(() => clearTimeout(timeout));

  const text = response.content.find((b) => b.type === "text")?.text || "{}";

  try {
    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/(\{[\s\S]*\})/);
    const jsonStr = jsonMatch ? jsonMatch[1] : text;
    return JSON.parse(jsonStr);
  } catch {
    return {
      ready: false,
      analysis: "Unable to parse response. Please try again.",
      followUpQuestions: ["Could you describe your use case in more detail?"],
      matches: [],
    };
  }
}

// ─── Route Handler ────────────────────────────────────────

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { useCase, followUpAnswers, systemIds, phase } = body as {
      useCase?: string;
      followUpAnswers?: string;
      systemIds?: string[];
      phase: "match" | "compare";
    };

    // ── Phase 2: Return full comparison data ──────────────
    if (phase === "compare" && systemIds?.length) {
      const systems = await prisma.aISystem.findMany({
        where: { id: { in: systemIds } },
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

    // Get all systems summary for the LLM
    const allSystems = await prisma.aISystem.findMany({
      select: {
        id: true,
        slug: true,
        vendor: true,
        name: true,
        type: true,
        risk: true,
        description: true,
        category: true,
        useCases: true,
        aiActStatus: true,
        gdprStatus: true,
        euResidency: true,
        scores: { include: { framework: { select: { slug: true } } } },
        industries: { select: { name: true } },
      },
    });

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

    const result = await callMatchingLLM(useCase, followUpAnswers || "", systemsSummary);

    // If ready, enrich matches with full system data
    if (result.ready && result.matches?.length) {
      const matchSlugs = result.matches.map((m) => m.slug);
      const matchedSystems = await prisma.aISystem.findMany({
        where: { slug: { in: matchSlugs } },
        include: {
          scores: { include: { framework: true } },
          industries: true,
        },
      });

      const systemsBySlug = Object.fromEntries(matchedSystems.map((s) => [s.slug, s]));

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
