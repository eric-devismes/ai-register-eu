"use client";

import { useState } from "react";
import { useT, useLocale } from "@/lib/locale-context";

const popularSearches = ["GPT-4", "Claude", "Mistral", "SAP AI", "Salesforce Einstein"];

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const t = useT();
  const locale = useLocale();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0d1b3e] via-[#0d1b3e] to-[#003399]">
      <div className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium tracking-wide text-white/90 backdrop-blur-sm">
            {t("hero.badge")}
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            {t("hero.title")}{" "}
            <span className="text-[#ffc107]">{t("hero.titleHighlight")}</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-blue-100/80 sm:text-xl">
            {t("hero.subtitle")}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href={`/${locale}/database`}
              className="inline-flex items-center rounded-lg bg-[#ffc107] px-8 py-3.5 text-sm font-semibold text-[#0d1b3e] shadow-lg transition hover:bg-[#ffcd38] hover:shadow-xl">
              {t("hero.ctaDatabase")}
              <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </a>
            <a href={`/${locale}/methodology`}
              className="inline-flex items-center rounded-lg border border-white/30 px-8 py-3.5 text-sm font-semibold text-white transition hover:border-white/60 hover:bg-white/10">
              {t("hero.ctaMethodology")}
            </a>
          </div>

          <div className="mx-auto mt-12 max-w-2xl">
            <div className="flex overflow-hidden rounded-xl bg-white/10 p-1.5 shadow-2xl ring-1 ring-white/20 backdrop-blur-sm">
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("hero.searchPlaceholder")}
                className="flex-1 bg-transparent px-4 py-3 text-sm text-white placeholder-blue-200/50 focus:outline-none" />
              <button type="button"
                className="rounded-lg bg-[#ffc107] px-6 py-3 text-sm font-semibold text-[#0d1b3e] transition hover:bg-[#ffcd38]">
                {t("hero.searchButton")}
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs text-blue-200/50">{t("hero.popular")}:</span>
              {popularSearches.map((tag) => (
                <button key={tag} type="button" onClick={() => setSearchQuery(tag)}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-blue-100/70 transition hover:border-white/20 hover:bg-white/10 hover:text-white">
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
