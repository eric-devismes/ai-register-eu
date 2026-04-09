/**
 * REST API — Changelog / Newsfeed (Enterprise only)
 *
 * GET /api/v1/changelog              — List recent changes (default: 50)
 * GET /api/v1/changelog?limit=100    — Custom limit
 * GET /api/v1/changelog?system=X     — Filter by system slug
 * GET /api/v1/changelog?framework=X  — Filter by framework slug
 *
 * Requires: Authorization: Bearer <token> with Enterprise tier.
 */

import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { authenticateApiRequest, requireEnterprise } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  const auth = await authenticateApiRequest(request);
  const forbidden = requireEnterprise(auth);
  if (forbidden) return forbidden;

  const params = request.nextUrl.searchParams;
  const limit = Math.min(parseInt(params.get("limit") || "50", 10), 500);
  const systemSlug = params.get("system");
  const frameworkSlug = params.get("framework");

  // Build filter
  const where: Record<string, unknown> = {};
  if (systemSlug) {
    where.system = { slug: systemSlug };
  }
  if (frameworkSlug) {
    where.framework = { slug: frameworkSlug };
  }

  const entries = await prisma.changeLog.findMany({
    where,
    orderBy: { date: "desc" },
    take: limit,
    include: {
      framework: { select: { slug: true, name: true } },
      system: { select: { slug: true, name: true, vendor: true } },
    },
  });

  return Response.json({
    data: entries.map((e) => ({
      id: e.id,
      date: e.date,
      title: e.title,
      description: e.description,
      changeType: e.changeType,
      sourceUrl: e.sourceUrl || undefined,
      sourceLabel: e.sourceLabel || undefined,
      system: e.system ? { slug: e.system.slug, name: e.system.name, vendor: e.system.vendor } : null,
      framework: e.framework ? { slug: e.framework.slug, name: e.framework.name } : null,
    })),
    meta: { total: entries.length, limit },
  });
}
