import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { locales } from "@/lib/i18n";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://aicompass.eu";

  const staticPages = [
    "",
    "/database",
    "/industries",
    "/regulations",
    "/ratings",
    "/methodology",
    "/resources",
    "/about",
    "/pricing",
    "/privacy",
    "/terms",
    "/contact",
  ];

  const entries: MetadataRoute.Sitemap = [];

  // Static pages for each locale
  for (const locale of locales) {
    for (const page of staticPages) {
      entries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === "" ? "daily" : "weekly",
        priority: page === "" ? 1 : 0.8,
      });
    }
  }

  // Dynamic system pages
  try {
    const systems = await prisma.aISystem.findMany({
      select: { slug: true, assessedAt: true },
    });

    for (const system of systems) {
      for (const locale of locales) {
        entries.push({
          url: `${baseUrl}/${locale}/systems/${system.slug}`,
          lastModified: system.assessedAt || new Date(),
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }
    }
  } catch {
    // DB may not be available during build
  }

  // Dynamic framework pages
  try {
    const frameworks = await prisma.regulatoryFramework.findMany({
      where: { published: true },
      select: { slug: true },
    });

    for (const fw of frameworks) {
      for (const locale of locales) {
        entries.push({
          url: `${baseUrl}/${locale}/regulations/${fw.slug}`,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.7,
        });
      }
    }
  } catch {
    // DB may not be available during build
  }

  // Dynamic industry pages
  try {
    const industries = await prisma.industry.findMany({
      select: { slug: true },
    });

    for (const ind of industries) {
      for (const locale of locales) {
        entries.push({
          url: `${baseUrl}/${locale}/industries/${ind.slug}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.6,
        });
      }
    }
  } catch {
    // DB may not be available during build
  }

  return entries;
}
