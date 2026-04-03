"use client";

import Link from "next/link";
import { useT, useLocale } from "@/lib/locale-context";

interface Industry {
  id: string;
  slug: string;
  name: string;
  colorClass: string;
  count: number;
}

export function BrowseByIndustryClient({ industries }: { industries: Industry[] }) {
  const t = useT();
  const locale = useLocale();

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">{t("browseIndustry.title")}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-gray-500">{t("browseIndustry.subtitle")}</p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {industries.map((ind) => (
            <Link href={`/${locale}/industries/${ind.slug}`} key={ind.id}
              className="group flex flex-col items-center rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm transition hover:border-[#003399]/30 hover:shadow-md">
              <span className={`inline-flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold ${ind.colorClass}`}>
                {ind.count}
              </span>
              <h3 className="mt-3 text-sm font-semibold text-gray-900">{ind.name}</h3>
              <p className="mt-1 text-xs text-gray-500">{ind.count} {t("browseIndustry.systemsAssessed")}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
