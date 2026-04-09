/**
 * REST API — AI Systems (Enterprise only)
 *
 * GET /api/v1/systems         — List all AI systems with scores
 * GET /api/v1/systems?slug=X  — Get a single system by slug
 *
 * Requires: Authorization: Bearer <token> with Enterprise tier.
 */

import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { computeOverallScore } from "@/lib/scoring";
import { authenticateApiRequest, requireEnterprise } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  const auth = await authenticateApiRequest(request);
  const forbidden = requireEnterprise(auth);
  if (forbidden) return forbidden;

  const slug = request.nextUrl.searchParams.get("slug");

  if (slug) {
    // Single system
    const system = await prisma.aISystem.findUnique({
      where: { slug },
      include: {
        scores: { include: { framework: { select: { slug: true, name: true } } } },
        industries: { select: { slug: true, name: true } },
        changelog: { orderBy: { date: "desc" }, take: 10 },
      },
    });

    if (!system) {
      return Response.json({ error: "System not found" }, { status: 404 });
    }

    return Response.json({
      data: {
        slug: system.slug,
        name: system.name,
        vendor: system.vendor,
        type: system.type,
        risk: system.risk,
        category: system.category,
        description: system.description,
        overallScore: computeOverallScore(system.scores.map((s) => s.score)),
        scores: system.scores.map((s) => ({
          framework: s.framework.slug,
          frameworkName: s.framework.name,
          score: s.score,
        })),
        industries: system.industries.map((i) => ({ slug: i.slug, name: i.name })),
        recentChanges: system.changelog.map((c) => ({
          date: c.date,
          title: c.title,
          type: c.changeType,
        })),
        updatedAt: system.updatedAt,
      },
    });
  }

  // List all systems
  const systems = await prisma.aISystem.findMany({
    include: {
      scores: { include: { framework: { select: { slug: true, name: true } } } },
      industries: { select: { slug: true, name: true } },
    },
    orderBy: { name: "asc" },
  });

  return Response.json({
    data: systems.map((system) => ({
      slug: system.slug,
      name: system.name,
      vendor: system.vendor,
      type: system.type,
      risk: system.risk,
      category: system.category,
      overallScore: computeOverallScore(system.scores.map((s) => s.score)),
      scores: system.scores.map((s) => ({
        framework: s.framework.slug,
        score: s.score,
      })),
      industries: system.industries.map((i) => i.slug),
      updatedAt: system.updatedAt,
    })),
    meta: { total: systems.length },
  });
}
