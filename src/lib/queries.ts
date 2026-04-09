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
    where: { featured: true },
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
 * Returns null if not found.
 */
export async function getSystemBySlug(slug: string) {
  return prisma.aISystem.findUnique({
    where: { slug },
    include: {
      industries: true,
      scores: {
        include: { framework: true },
        orderBy: { framework: { name: "asc" } },
      },
    },
  });
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
    prisma.aISystem.findUnique({
      where: { slug: systemSlug },
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
        select: { systems: true },
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

// ─── Stats ───────────────────────────────────────────────

/**
 * Get aggregate counts for the homepage stats bar.
 * Returns total systems, frameworks, and industries.
 */
export async function getSiteStats() {
  const [systemCount, frameworkCount, industryCount] = await Promise.all([
    prisma.aISystem.count(),
    prisma.regulatoryFramework.count({ where: { published: true } }),
    prisma.industry.count(),
  ]);

  return { systemCount, frameworkCount, industryCount };
}
