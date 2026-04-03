/**
 * RegulatoryFrameworks — Server component fetches frameworks + translations.
 */

import { getPublishedFrameworks } from "@/lib/queries";
import { getTranslatedBatch } from "@/lib/get-translation";
import { RegulatoryFrameworksClient } from "./RegulatoryFrameworksClient";
import type { Locale } from "@/lib/i18n";

export default async function RegulatoryFrameworks({ locale }: { locale: Locale }) {
  const frameworks = await getPublishedFrameworks();

  const translations = await getTranslatedBatch(
    "framework",
    frameworks.map((f) => f.id),
    locale,
    ["name", "description"]
  );

  const data = frameworks.map((fw) => {
    const t = translations.get(fw.id) || {};
    return {
      id: fw.id,
      slug: fw.slug,
      name: t.name || fw.name,
      description: t.description || fw.description,
      badgeType: fw.badgeType,
      criteriaCount: fw.criteriaCount,
      effectiveDate: fw.effectiveDate,
    };
  });

  return <RegulatoryFrameworksClient frameworks={data} />;
}
