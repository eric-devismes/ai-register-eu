/**
 * Database query functions for AI Compass EU.
 *
 * Every piece of data displayed on the frontend comes through
 * one of these functions. No hardcoded data in components.
 *
 * Usage: import { getFeaturedSystems } from "@/lib/queries";
 */

import { prisma } from "@/lib/db";

// ─── AI Systems ──────────────────────────────────────────

/**
 * Get featured AI systems for the homepage.
 * Includes their industries and per-framework scores.
 */
export async function getFeaturedSystems() {
  return prisma.aISystem.findMany({
    where: { featured: true, status: "active" },
    orderBy: { name: "asc" },
    include: {
      industries: true,
      scores: {
        include: { framework: true },
      },
    },
  });
}

/**
 * Get all AI systems (for the full database page).
 * Includes industries and scores.
 */
export async function getAllSystems() {
  return prisma.aISystem.findMany({
    where: { status: "active" },
    orderBy: [{ vendor: "asc" }, { name: "asc" }],
    include: {
      industries: true,
      scores: {
        include: { framework: true },
      },
    },
  });
}

/**
 * Get a single AI system by its URL slug.
 * Includes full details: industries, scores with framework info.
 * Returns null if not found or inactive (public lookup).
 */
export async function getSystemBySlug(slug: string) {
  const system = await prisma.aISystem.findUnique({
    where: { slug },
    include: {
      industries: true,
      scores: {
        include: { framework: true },
        orderBy: { framework: { name: "asc" } },
      },
    },
  });
  if (!system || system.status !== "active") return null;
  return system;
}

/**
 * Published evidence-backed claims for a system.
 * Only returns status="published" — drafts and retired claims are hidden.
 * Each claim includes its source (url, label, tier) for chip rendering.
 *
 * A claim is considered "stale" once verifiedAt > STALE_DAYS old.
 */
const STALE_DAYS = 180;
export async function getSystemClaims(systemId: string) {
  const rows = await prisma.systemClaim.findMany({
    where: { systemId, status: "published" },
    include: { source: true },
    orderBy: [{ field: "asc" }],
  });
  const staleThreshold = Date.now() - STALE_DAYS * 24 * 60 * 60 * 1000;
  return rows.map((c) => ({
    id: c.id,
    field: c.field,
    value: c.value,
    evidenceQuote: c.evidenceQuote,
    confidence: c.confidence,
    verifiedAt: c.verifiedAt?.toISOString() ?? null,
    stale: c.verifiedAt ? c.verifiedAt.getTime() < staleThreshold : false,
    source: c.source
      ? {
          url: c.source.url,
          label: c.source.label,
          tier: c.source.tier,
        }
      : null,
  }));
}

// ─── Regulatory Frameworks ───────────────────────────────

/**
 * Get all published regulatory frameworks.
 * Used by the homepage RegulatoryFrameworks component.
 */
export async function getPublishedFrameworks() {
  return prisma.regulatoryFramework.findMany({
    where: { published: true },
    orderBy: { name: "asc" },
  });
}

/**
 * Get all frameworks (including unpublished), for admin use.
 */
export async function getAllFrameworks() {
  return prisma.regulatoryFramework.findMany({
    orderBy: { name: "asc" },
  });
}

/**
 * Get a single framework by slug, with all systems scored under it,
 * structured sections with policy statements, and applicable industries.
 */
export async function getFrameworkBySlug(slug: string) {
  return prisma.regulatoryFramework.findUnique({
    where: { slug },
    include: {
      industries: true,
      sections: {
        orderBy: { sortOrder: "asc" },
        include: {
          statements: { orderBy: { sortOrder: "asc" } },
        },
      },
      scores: {
        include: { system: true },
        orderBy: { system: { name: "asc" } },
      },
      changelog: {
        orderBy: { date: "desc" },
        take: 10,
      },
    },
  });
}

/**
 * Get cross-report data: one system assessed against one framework.
 * Includes dimension scores (per-section), framework sections, and system details.
 */
export async function getSystemFrameworkReport(systemSlug: string, frameworkSlug: string) {
  const [system, framework] = await Promise.all([
    prisma.aISystem.findFirst({
      where: { slug: systemSlug, status: "active" },
      include: {
        scores: {
          include: { framework: true },
        },
        industries: true,
        dimensionScores: {
          include: {
            section: {
              include: { framework: true },
            },
          },
        },
      },
    }),
    prisma.regulatoryFramework.findUnique({
      where: { slug: frameworkSlug },
      include: {
        sections: {
          orderBy: { sortOrder: "asc" },
          include: {
            statements: { orderBy: { sortOrder: "asc" } },
          },
        },
      },
    }),
  ]);

  if (!system || !framework) return null;

  // Get the overall score for this system+framework
  const overallScore = system.scores.find((s) => s.framework.slug === frameworkSlug);

  // Get dimension scores for this framework's sections
  const frameworkSectionIds = framework.sections.map((s) => s.id);
  const dimensionScores = system.dimensionScores.filter((ds) =>
    frameworkSectionIds.includes(ds.sectionId)
  );

  return { system, framework, overallScore, dimensionScores };
}

/**
 * Get changelog entries for a specific AI system.
 */
export async function getSystemChangelog(systemId: string) {
  return prisma.changeLog.findMany({
    where: { systemId },
    orderBy: { date: "desc" },
    take: 10,
  });
}

/**
 * Get all recent changelog entries (for the public newsfeed).
 * Returns entries across all frameworks and systems, sorted by date.
 */
export async function getRecentChangelogs(limit = 50) {
  return prisma.changeLog.findMany({
    where: {
      OR: [
        { systemId: null },
        { system: { status: "active" } },
      ],
    },
    orderBy: { date: "desc" },
    take: limit,
    include: {
      framework: { select: { slug: true, name: true } },
      system: { select: { slug: true, name: true, vendor: true } },
    },
  });
}

// ─── Industries ──────────────────────────────────────────

/**
 * Get all industries with the count of linked AI systems.
 * Used by the homepage BrowseByIndustry component.
 */
export async function getIndustriesWithCounts() {
  return prisma.industry.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { systems: { where: { status: "active" } } },
      },
    },
  });
}

/**
 * Get all industries (for admin forms and dropdowns).
 */
export async function getAllIndustries() {
  return prisma.industry.findMany({
    orderBy: { name: "asc" },
  });
}

// ─── Compliance Checklist ────────────────────────────────

/**
 * Get multiple frameworks by slug with their sections and statements.
 * Used by the compliance checklist generator.
 */
export async function getFrameworksWithSections(slugs: string[]) {
  return prisma.regulatoryFramework.findMany({
    where: { slug: { in: slugs }, published: true },
    orderBy: { name: "asc" },
    include: {
      sections: {
        orderBy: { sortOrder: "asc" },
        include: {
          statements: { orderBy: { sortOrder: "asc" } },
        },
      },
    },
  });
}

// ─── Stats ───────────────────────────────────────────────

/**
 * Get aggregate counts for the homepage stats bar.
 * Returns total systems, frameworks, and industries.
 */
export async function getSiteStats() {
  const [systemCount, frameworkCount, industryCount] = await Promise.all([
    prisma.aISystem.count({ where: { status: "active" } }),
    prisma.regulatoryFramework.count({ where: { published: true } }),
    prisma.industry.count(),
  ]);

  return { systemCount, frameworkCount, industryCount };
}
