/**
 * RFP/RFI Answer Engine Page
 *
 * URL: /[lang]/rfp-engine
 *
 * Tier-gated: Enterprise only. Free/Pro users see blurred preview with upgrade CTA.
 * Enterprise users get the full interactive RFP/RFI answer engine.
 */

export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getEffectiveTier } from "@/lib/tier-access";
import { isValidLocale } from "@/lib/i18n";
import { RFPClient } from "./RFPClient";

export const metadata: Metadata = {
  title: "RFP/RFI Answer Engine | AI Compass EU",
  description:
    "Paste your RFP/RFI questions and generate professional draft answers grounded in AI system compliance intelligence. Enterprise feature for procurement teams.",
};

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function RFPEnginePage({ params }: PageProps) {
  const { lang } = await params;
  const locale = isValidLocale(lang) ? lang : "en";

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
                RFP/RFI Answer Engine
              </h1>
              <p className="mt-4 text-lg text-blue-100 max-w-2xl">
                Paste your RFP or RFI questions and get professional draft answers
                grounded in our independent AI system assessments. EU compliance,
                data sovereignty, certifications — all cited with real data.
              </p>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <RFPClient tier={tier} locale={locale} />
        </div>
      </main>
      <Footer />
    </>
  );
}
