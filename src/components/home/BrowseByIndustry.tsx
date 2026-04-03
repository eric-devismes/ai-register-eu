/**
 * BrowseByIndustry — Server component fetches industries + translations.
 */

import { getIndustriesWithCounts } from "@/lib/queries";
import { getTranslatedBatch } from "@/lib/get-translation";
import { BrowseByIndustryClient } from "./BrowseByIndustryClient";
import type { Locale } from "@/lib/i18n";

export default async function BrowseByIndustry({ locale }: { locale: Locale }) {
  const industries = await getIndustriesWithCounts();

  const translations = await getTranslatedBatch(
    "industry",
    industries.map((i) => i.id),
    locale,
    ["name"]
  );

  const data = industries.map((ind) => {
    const t = translations.get(ind.id) || {};
    return {
      id: ind.id,
      slug: ind.slug,
      name: t.name || ind.name,
      colorClass: ind.colorClass,
      count: ind._count.systems,
    };
  });

  return <BrowseByIndustryClient industries={data} />;
}
