/**
 * Export API — CSV / JSON export of AI system compliance data (Pro+)
 *
 * GET /api/export?format=csv     — Download CSV of all systems + scores
 * GET /api/export?format=json    — Download JSON
 * GET /api/export?slug=X         — Export a single system
 *
 * Requires logged-in subscriber with Pro or Enterprise tier.
 */

import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { computeOverallScore } from "@/lib/scoring";
import { getSubscriber } from "@/lib/subscriber-auth";
import type { SubscriptionTier } from "@/lib/tier-access";

export async function GET(request: NextRequest) {
  const subscriber = await getSubscriber();
  const tier = (subscriber?.tier as SubscriptionTier) || "free";

  if (!subscriber || tier === "free") {
    return Response.json(
      { error: "Export requires a Pro or Enterprise subscription." },
      { status: 403 }
    );
  }

  const params = request.nextUrl.searchParams;
  const format = params.get("format") || "csv";
  const slug = params.get("slug");

  // Fetch systems
  const where = slug ? { slug } : {};
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
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
