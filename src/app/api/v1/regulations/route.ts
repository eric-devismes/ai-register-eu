/**
 * REST API — Regulatory Frameworks (Enterprise only)
 *
 * GET /api/v1/regulations           — List all frameworks
 * GET /api/v1/regulations?slug=X    — Get a single framework with sections & statements
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

  const slug = request.nextUrl.searchParams.get("slug");

  if (slug) {
    const framework = await prisma.regulatoryFramework.findUnique({
      where: { slug },
      include: {
        sections: {
          orderBy: { sortOrder: "asc" },
          include: {
            statements: { orderBy: { sortOrder: "asc" } },
          },
        },
        changelog: { orderBy: { date: "desc" }, take: 10 },
      },
    });

    if (!framework) {
      return Response.json({ error: "Framework not found" }, { status: 404 });
    }

    return Response.json({
      data: {
        slug: framework.slug,
        name: framework.name,
        description: framework.description,
        effectiveDate: framework.effectiveDate,
        issuingAuthority: framework.issuingAuthority,
        maxPenalty: framework.maxPenalty,
        enforcementType: framework.enforcementType,
        applicableRegions: framework.applicableRegions,
        officialUrl: framework.officialUrl,
        sections: framework.sections.map((sec) => ({
          title: sec.title,
          description: sec.description,
          statements: sec.statements.map((st) => ({
            reference: st.reference,
            statement: st.statement,
            commentary: st.commentary,
          })),
        })),
        recentChanges: framework.changelog.map((c) => ({
          date: c.date,
          title: c.title,
          type: c.changeType,
        })),
        updatedAt: framework.updatedAt,
      },
    });
  }

  // List all frameworks
  const frameworks = await prisma.regulatoryFramework.findMany({
    where: { published: true },
    orderBy: { name: "asc" },
    include: {
      _count: { select: { sections: true } },
    },
  });

  return Response.json({
    data: frameworks.map((fw) => ({
      slug: fw.slug,
      name: fw.name,
      description: fw.description,
      effectiveDate: fw.effectiveDate,
      issuingAuthority: fw.issuingAuthority,
      maxPenalty: fw.maxPenalty,
      enforcementType: fw.enforcementType,
      sectionCount: fw._count.sections,
      updatedAt: fw.updatedAt,
    })),
    meta: { total: frameworks.length },
  });
}
