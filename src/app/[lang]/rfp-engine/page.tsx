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
import { getDictionary, getPageMetadata, type Locale, isValidLocale } from "@/lib/i18n";
import { RFPClient } from "./RFPClient";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const locale = isValidLocale(lang) ? lang : "en";
  return getPageMetadata(locale as Locale, "rfpEngine");
}

export default async function RFPEnginePage({ params }: PageProps) {
  const { lang } = await params;
  const locale = isValidLocale(lang) ? lang : "en";
  const dict = await getDictionary(locale as Locale);
  const t = (key: string) => {
    const [section, ...rest] = key.split(".");
    const field = rest.join(".");
    return dict?.[section]?.[field] || key;
  };

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
                {t("rfp.badge")}
              </div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-serif">
                {t("rfp.heroTitle")}
              </h1>
              <p className="mt-4 text-lg text-blue-100 max-w-2xl">
                {t("rfp.heroSubtitle")}
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
