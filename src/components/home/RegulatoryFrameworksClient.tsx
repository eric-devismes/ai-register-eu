"use client";

import Link from "next/link";
import { useT, useLocale } from "@/lib/locale-context";

const BADGE_COLORS: Record<string, string> = {
  EU: "bg-[#003399]/10 text-[#003399]",
  Sector: "bg-emerald-100 text-emerald-700",
  National: "bg-amber-100 text-amber-700",
};

interface Framework {
  id: string;
  slug: string;
  name: string;
  description: string;
  badgeType: string;
  criteriaCount: number;
  effectiveDate: string;
}

export function RegulatoryFrameworksClient({ frameworks }: { frameworks: Framework[] }) {
  const t = useT();
  const locale = useLocale();

  return (
    <section className="bg-surface-alt py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">{t("frameworks.title")}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-gray-500">{t("frameworks.subtitle")}</p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {frameworks.map((fw) => (
            <Link key={fw.id} href={`/${locale}/regulations/${fw.slug}`}
              className="group flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-[#003399]/30 hover:shadow-md">
              <span className={`inline-block w-fit rounded-full px-3 py-1 text-xs font-semibold ${BADGE_COLORS[fw.badgeType] || BADGE_COLORS.EU}`}>
                {fw.badgeType}
              </span>
              <h3 className="mt-4 text-lg font-bold text-gray-900">{fw.name}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">{fw.description}</p>
              <div className="mt-4 flex items-center gap-4 text-xs text-gray-400">
                <span>{fw.criteriaCount} {t("common.criteria")}</span>
                <span>{t("common.effective")}: {fw.effectiveDate}</span>
              </div>
              <p className="mt-4 text-sm font-semibold text-[#003399] group-hover:underline">
                {t("frameworks.readDocs")} &rarr;
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
