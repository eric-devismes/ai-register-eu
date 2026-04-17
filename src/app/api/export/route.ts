/**
 * Export API — CSV / JSON export of AI system compliance data (Pro+)
 *
 * GET /api/export?format=csv          — Download CSV of all systems + scores
 * GET /api/export?format=json         — Download JSON
 * GET /api/export?slug=X              — Export a single system
 * GET /api/export?compare=slug1,slug2 — Procurement decision matrix (side-by-side)
 *
 * Requires logged-in subscriber with Pro or Enterprise tier.
 */

import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { computeOverallScore } from "@/lib/scoring";
import { getEffectiveTier } from "@/lib/tier-access";

export async function GET(request: NextRequest) {
  const tier = await getEffectiveTier();

  if (tier === "free" || tier === "anonymous") {
    return Response.json(
      { error: "Export requires a Pro or Enterprise subscription." },
      { status: 403 }
    );
  }

  const params = request.nextUrl.searchParams;
  const format = params.get("format") || "csv";
  const slug = params.get("slug");
  const compareSlugs = params.get("compare");

  // ── Procurement Decision Matrix (comparison export) ──────
  if (compareSlugs) {
    const slugList = compareSlugs.split(",").map((s) => s.trim()).filter(Boolean);
    if (slugList.length < 2 || slugList.length > 6) {
      return Response.json({ error: "Compare export requires 2-6 systems." }, { status: 400 });
    }
    return exportComparisonMatrix(slugList, format);
  }

  // Fetch systems
  const where = slug ? { slug, status: "active" } : { status: "active" };
  const systems = await prisma.aISystem.findMany({
    where,
    include: {
      scores: { include: { framework: { select: { slug: true, name: true } } } },
      industries: { select: { name: true } },
    },
    orderBy: { name: "asc" },
  });

  if (slug && systems.length === 0) {
    return Response.json({ error: "System not found" }, { status: 404 });
  }

  // Get all frameworks for CSV column headers
  const allFrameworks = await prisma.regulatoryFramework.findMany({
    where: { published: true },
    orderBy: { name: "asc" },
    select: { slug: true, name: true },
  });

  if (format === "json") {
    const data = systems.map((s) => ({
      slug: s.slug,
      name: s.name,
      vendor: s.vendor,
      type: s.type,
      risk: s.risk,
      category: s.category,
      description: s.description,
      overallScore: computeOverallScore(s.scores.map((sc) => sc.score)),
      scores: Object.fromEntries(s.scores.map((sc) => [sc.framework.slug, sc.score])),
      industries: s.industries.map((i) => i.name),
      updatedAt: s.updatedAt,
    }));

    return new Response(JSON.stringify({ data, exportedAt: new Date().toISOString() }, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="ai-compass-export-${new Date().toISOString().split("T")[0]}.json"`,
      },
    });
  }

  // CSV format
  const headers = [
    "System",
    "Vendor",
    "Type",
    "Risk Level",
    "Category",
    "Overall Score",
    ...allFrameworks.map((fw) => fw.name),
    "Industries",
    "Last Updated",
  ];

  const rows = systems.map((s) => {
    const scoreMap = new Map(s.scores.map((sc) => [sc.framework.slug, sc.score]));
    return [
      csvEscape(s.name),
      csvEscape(s.vendor),
      csvEscape(s.type),
      s.risk,
      csvEscape(s.category),
      computeOverallScore(s.scores.map((sc) => sc.score)),
      ...allFrameworks.map((fw) => scoreMap.get(fw.slug) || ""),
      csvEscape(s.industries.map((i) => i.name).join("; ")),
      s.updatedAt.toISOString().split("T")[0],
    ];
  });

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="ai-compass-export-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}

function csvEscape(value: string): string {
  if (!value) return "";
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

// ─── Procurement Decision Matrix ────────────────────────

const MATRIX_ROWS = [
  // Header info
  { key: "vendor", label: "Vendor" },
  { key: "name", label: "System Name" },
  { key: "type", label: "System Type" },
  { key: "vendorHq", label: "Vendor HQ" },
  { key: "foundedYear", label: "Founded" },
  { key: "employeeCount", label: "Company Size" },
  { key: "fundingStatus", label: "Funding / Ownership" },
  { key: "marketPresence", label: "Market Position" },
  // Scores
  { key: "overallScore", label: "Overall Compliance Score" },
  { key: "risk", label: "EU AI Act Risk Level" },
  { key: "score_eu-ai-act", label: "EU AI Act Score" },
  { key: "score_gdpr", label: "GDPR Score" },
  { key: "score_dora", label: "DORA Score" },
  { key: "score_eba-eiopa-guidelines", label: "EBA/EIOPA Score" },
  { key: "score_mdr-ivdr", label: "MDR/IVDR Score" },
  { key: "score_nis2", label: "NIS2 Score" },
  // EU Compliance
  { key: "aiActStatus", label: "AI Act Compliance Status" },
  { key: "gdprStatus", label: "GDPR Compliance Status" },
  { key: "euResidency", label: "EU Data Residency" },
  { key: "euPresence", label: "EU Presence" },
  // Data & Security
  { key: "dataStorage", label: "Data Storage" },
  { key: "dataProcessing", label: "Data Processing" },
  { key: "trainingDataUse", label: "Training Data Use" },
  { key: "encryptionInfo", label: "Encryption" },
  { key: "certifications", label: "Certifications" },
  { key: "accessControls", label: "Access Controls" },
  // Governance
  { key: "dpaDetails", label: "DPA / Data Protection Agreement" },
  { key: "slaDetails", label: "SLA" },
  { key: "dataPortability", label: "Data Portability" },
  { key: "exitTerms", label: "Exit Terms" },
  { key: "ipTerms", label: "IP Ownership" },
  { key: "subprocessors", label: "Subprocessors" },
  // AI Transparency
  { key: "modelDocs", label: "Model Documentation" },
  { key: "explainability", label: "Explainability" },
  { key: "biasTesting", label: "Bias Testing" },
  // Product
  { key: "deploymentModel", label: "Deployment Model" },
  { key: "sourceModel", label: "Source Model" },
  { key: "customerCount", label: "Customer Base" },
  { key: "notableCustomers", label: "Notable Customers" },
  { key: "useCases", label: "Use Cases" },
];

async function exportComparisonMatrix(slugList: string[], format: string) {
  const systems = await prisma.aISystem.findMany({
    where: { slug: { in: slugList }, status: "active" },
    include: {
      scores: { include: { framework: { select: { slug: true, name: true } } } },
      industries: { select: { name: true } },
    },
  });

  // Maintain requested order
  const ordered = slugList
    .map((s) => systems.find((sys) => sys.slug === s))
    .filter(Boolean) as typeof systems;

  if (ordered.length < 2) {
    return Response.json({ error: "Not enough matching systems found." }, { status: 404 });
  }

  // Build flat row data for each system
  const systemData = ordered.map((sys) => {
    const scoreMap: Record<string, string> = {};
    for (const sc of sys.scores) {
      scoreMap[`score_${sc.framework.slug}`] = sc.score;
    }
    return {
      ...sys,
      overallScore: computeOverallScore(sys.scores.map((sc) => sc.score)),
      ...scoreMap,
    } as Record<string, unknown>;
  });

  if (format === "json") {
    const data = {
      exportType: "procurement-decision-matrix",
      exportedAt: new Date().toISOString(),
      systemCount: ordered.length,
      systems: systemData.map((sys) => {
        const result: Record<string, string> = {};
        for (const row of MATRIX_ROWS) {
          result[row.key] = String(sys[row.key] || "");
        }
        return result;
      }),
    };

    return new Response(JSON.stringify(data, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="ai-compass-comparison-${new Date().toISOString().split("T")[0]}.json"`,
      },
    });
  }

  // CSV: attribute as first column, then one column per system
  const headers = ["Attribute", ...systemData.map((s) => String(s.name || s.slug))];

  const rows = MATRIX_ROWS.map((row) => [
    csvEscape(row.label),
    ...systemData.map((sys) => {
      const val = sys[row.key];
      if (val === null || val === undefined) return "";
      // Replace newlines in multi-line fields with semicolons for CSV
      return csvEscape(String(val).replace(/\n/g, "; "));
    }),
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="ai-compass-comparison-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
