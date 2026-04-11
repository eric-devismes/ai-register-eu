/**
 * Vendor Discussion Prep Page
 *
 * URL: /[lang]/vendor-prep
 *
 * Tier-gated: Free users see a blurred preview with upgrade CTA.
 * Pro/Enterprise users get the full interactive prep generator.
 */

export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getEffectiveTier } from "@/lib/tier-access";
import { getDictionary, type Locale, isValidLocale } from "@/lib/i18n";
import { prisma } from "@/lib/db";
import { VendorPrepClient } from "./VendorPrepClient";

export const metadata: Metadata = {
  title: "Vendor Discussion Prep | AI Compass EU",
  description:
    "Generate talking points, negotiation leverage, and red-flag questions for procurement team meetings with AI vendors. Grounded in independent compliance data.",
};

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function VendorPrepPage({ params }: PageProps) {
  const { lang } = await params;
  const locale = isValidLocale(lang) ? lang : "en";
  await getDictionary(locale as Locale);

  const tier = await getEffectiveTier();

  // Fetch systems list for the dropdown (lightweight — only slug, vendor, name)
  const systems = await prisma.aISystem.findMany({
    orderBy: [{ vendor: "asc" }, { name: "asc" }],
    select: { slug: true, vendor: true, name: true },
  });

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
                Vendor Discussion Prep
              </h1>
              <p className="mt-4 text-lg text-blue-100 max-w-2xl">
                Walk into every AI vendor meeting with structured talking points,
                sharp questions, and negotiation leverage — backed by our independent
                compliance assessment data.
              </p>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <VendorPrepClient tier={tier} systems={systems} />
        </div>
      </main>
      <Footer />
    </>
  );
}
