/**
 * Podium Recommendations Page
 *
 * URL: /[lang]/podium
 *
 * Tier-gated: Free users see a blurred preview with upgrade CTA.
 * Pro/Enterprise users get the full interactive recommender.
 */

export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getEffectiveTier } from "@/lib/tier-access";
import { getDictionary, type Locale, isValidLocale } from "@/lib/i18n";
import { PodiumClient } from "./PodiumClient";

export const metadata: Metadata = {
  title: "AI System Recommendations | AI Compass EU",
  description:
    "Get personalised top-3 AI system recommendations based on your use case, industry, and compliance requirements. Gold, silver, and bronze podium with scoring rationale.",
};

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function PodiumPage({ params }: PageProps) {
  const { lang } = await params;
  const locale = isValidLocale(lang) ? lang : "en";
  await getDictionary(locale as Locale);

  const tier = await getEffectiveTier();

  return (
    <>
      <Header />
      <main className="flex-1 bg-gray-50 min-h-screen">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#0d1b3e] to-[#003399] text-white">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-blue-200">
                Enterprise Tool
              </div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-serif">
                AI System Recommendations
              </h1>
              <p className="mt-4 text-lg text-blue-100 max-w-2xl">
                Describe your requirements and we will analyse our entire database
                to recommend the top 3 best-fit AI systems — ranked on a gold, silver,
                and bronze podium with full scoring rationale.
              </p>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <PodiumClient tier={tier} />
        </div>
      </main>
      <Footer />
    </>
  );
}
