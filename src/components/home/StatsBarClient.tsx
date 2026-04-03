"use client";

import { useT } from "@/lib/locale-context";

export function StatsBarClient({ systemCount, frameworkCount, industryCount }: { systemCount: number; frameworkCount: number; industryCount: number }) {
  const t = useT();
  const stats = [
    { value: systemCount.toLocaleString(), label: t("stats.aiToolsRated") },
    { value: frameworkCount.toString(), label: t("stats.regulatoryFrameworks") },
    { value: industryCount.toString(), label: t("stats.industriesCovered") },
    { value: "27", label: t("stats.euMemberStates") },
  ];

  return (
    <section className="bg-[#0d1b3e]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-extrabold text-[#ffc107] sm:text-4xl">{stat.value}</p>
              <p className="mt-1 text-sm text-blue-200/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
