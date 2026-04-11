/**
 * Compliance Checklist Generator
 *
 * URL: /[lang]/checklist
 *
 * Select regulatory frameworks → get a combined compliance checklist
 * with all requirements organized by framework and section.
 * Free tier: view checklist. Pro: export + commentary.
 */

export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getEffectiveTier } from "@/lib/tier-access";
import { getPublishedFrameworks } from "@/lib/queries";
import { ChecklistClient } from "./ChecklistClient";

export const metadata: Metadata = {
  title: "Compliance Checklist Generator — AI Compass EU",
  description:
    "Generate a tailored compliance checklist by combining EU regulatory frameworks. Select AI Act, GDPR, DORA, NIS2, and more to build your complete AI procurement compliance checklist.",
};

export default async function ChecklistPage() {
  const [tier, frameworks] = await Promise.all([
    getEffectiveTier(),
    getPublishedFrameworks(),
  ]);

  const frameworkOptions = frameworks.map((fw) => ({
    slug: fw.slug,
    name: fw.name,
    badgeType: fw.badgeType,
  }));

  return (
    <>
      <Header />
      <main className="flex-1 bg-gray-50 min-h-screen">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#0d1b3e] to-[#003399] text-white">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-blue-200">
                Compliance Tool
              </div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-serif">
                Compliance Checklist Generator
              </h1>
              <p className="mt-4 text-lg text-blue-100 max-w-2xl">
                Select the regulatory frameworks that apply to your organisation.
                Get a combined, actionable compliance checklist with expert commentary
                on every requirement.
              </p>
            </div>
          </div>
        </section>

        {/* Checklist tool */}
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <ChecklistClient tier={tier} frameworkOptions={frameworkOptions} />
        </div>
      </main>
      <Footer />
    </>
  );
}
