/**
 * FeaturedSystems — Homepage section showing rated AI systems from the database.
 * Server component that fetches data + translations, passes to client grid.
 */

import { getFeaturedSystems, getPublishedFrameworks } from "@/lib/queries";
import { computeOverallScore } from "@/lib/scoring";
import { getTranslatedBatch } from "@/lib/get-translation";
import { FeaturedSystemsGrid } from "./FeaturedSystemsGrid";
import type { Locale } from "@/lib/i18n";

export default async function FeaturedSystems({ locale }: { locale: Locale }) {
  const [systems, frameworks] = await Promise.all([
    getFeaturedSystems(),
    getPublishedFrameworks(),
  ]);

  // Fetch translations for system descriptions and industry names
  const systemTranslations = await getTranslatedBatch(
    "system",
    systems.map((s) => s.id),
    locale,
    ["description", "name", "type"]
  );

  const industryIds = [...new Set(systems.flatMap((s) => s.industries.map((i) => i.id)))];
  const industryTranslations = await getTranslatedBatch(
    "industry",
    industryIds,
    locale,
    ["name"]
  );

  const frameworkTranslations = await getTranslatedBatch(
    "framework",
    systems.flatMap((s) => s.scores.map((sc) => sc.framework.id)),
    locale,
    ["name"]
  );

  const plainSystems = systems.map((s) => {
    const st = systemTranslations.get(s.id) || {};
    return {
      id: s.id,
      slug: s.slug,
      vendor: s.vendor,
      name: st.name || s.name,
      type: st.type || s.type,
      risk: s.risk,
      description: st.description || s.description,
      category: s.category,
      industries: s.industries.map((i) => {
        const it = industryTranslations.get(i.id) || {};
        return it.name || i.name;
      }),
      scores: s.scores.map((sc) => {
        const ft = frameworkTranslations.get(sc.framework.id) || {};
        return {
          frameworkName: ft.name || sc.framework.name,
          frameworkSlug: sc.framework.slug,
          score: sc.score,
        };
      }),
      overallScore: computeOverallScore(s.scores.map((sc) => sc.score)),
    };
  });

  const plainFrameworks = frameworks.map((f) => ({
    name: f.name,
    slug: f.slug,
  }));

  return <FeaturedSystemsGrid systems={plainSystems} frameworks={plainFrameworks} />;
}
