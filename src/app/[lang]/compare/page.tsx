/**
 * AI System Comparison Tool
 *
 * URL: /compare
 *
 * Available to all users:
 * - Free: can compare, but results limited to free-tier systems (5 most popular)
 * - Pro/Enterprise: full access to all systems
 * - Admin owner: full access (bypasses tier)
 */

export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getEffectiveTier } from "@/lib/tier-access";
import { CompareClient } from "./CompareClient";

export const metadata: Metadata = {
  title: "AI System Comparison",
  description: "Describe your use case and get AI-matched, side-by-side comparisons of enterprise AI systems assessed for EU regulatory compliance.",
};

export default async function ComparePage() {
  const tier = await getEffectiveTier();
  const hasFullAccess = tier === "pro" || tier === "enterprise";

  return (
    <>
      <Header />
      <main className="flex-1 bg-gray-50 min-h-screen">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#0d1b3e] to-[#003399] text-white">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-blue-200">
                AI-Powered Matching
              </div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-serif">
                Find &amp; Compare AI Systems
              </h1>
              <p className="mt-4 text-lg text-blue-100 max-w-2xl">
                Describe your use case in plain English. Get AI-matched recommendations
                from our database of assessed enterprise AI systems, then compare them
                side-by-side against EU compliance criteria.
              </p>
              {!hasFullAccess && (
                <p className="mt-2 text-sm text-blue-200/70">
                  Free access covers the 5 most popular AI platforms.{" "}
                  <a href="/en/pricing" className="underline hover:text-white">Upgrade to Pro</a>{" "}
                  for all 60+ systems.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Comparison tool — available to all tiers */}
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <CompareClient tier={tier} />
        </div>
      </main>
      <Footer />
    </>
  );
}
