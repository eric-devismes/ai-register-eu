/**
 * AI System Comparison Tool — Pro feature
 *
 * URL: /compare
 *
 * Free users see a preview with an upgrade prompt.
 * Pro / Enterprise users get the full comparison tool.
 */

export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getSubscriber } from "@/lib/subscriber-auth";
import type { SubscriptionTier } from "@/lib/tier-access";
import { CompareClient } from "./CompareClient";

export const metadata: Metadata = {
  title: "AI System Comparison — AI Compass EU",
  description: "Describe your use case and get AI-matched, side-by-side comparisons of enterprise AI systems assessed for EU regulatory compliance.",
};

export default async function ComparePage() {
  const subscriber = await getSubscriber();
  const tier: SubscriptionTier = (subscriber?.tier as SubscriptionTier) || "free";
  const hasAccess = tier === "pro" || tier === "enterprise";

  return (
    <>
      <Header />
      <main className="flex-1 bg-gray-50 min-h-screen">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#0d1b3e] to-[#003399] text-white">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-blue-200">
                {hasAccess ? "Pro Feature" : "Pro Feature"} &middot; AI-Powered Matching
              </div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-serif">
                Find &amp; Compare AI Systems
              </h1>
              <p className="mt-4 text-lg text-blue-100 max-w-2xl">
                Describe your use case in plain English. Get AI-matched recommendations from our database of assessed enterprise AI systems, then compare them side-by-side against EU compliance criteria.
              </p>
            </div>
          </div>
        </section>

        {/* Main Tool or Upgrade Prompt */}
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {hasAccess ? (
            <CompareClient />
          ) : (
            <div className="mx-auto max-w-2xl text-center py-16">
              {/* Preview mockup */}
              <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm opacity-60 pointer-events-none">
                <div className="space-y-4">
                  <div className="h-10 w-full rounded-lg bg-gray-100 animate-pulse" />
                  <div className="text-sm text-gray-400">Describe your AI use case...</div>
                  <div className="grid grid-cols-3 gap-4 pt-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="rounded-lg border border-gray-100 p-4 space-y-2">
                        <div className="h-4 w-24 rounded bg-gray-100" />
                        <div className="h-3 w-full rounded bg-gray-50" />
                        <div className="h-3 w-3/4 rounded bg-gray-50" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Upgrade prompt */}
              <div className="rounded-2xl border-2 border-[#003399]/20 bg-gradient-to-br from-[#003399]/5 to-[#ffc107]/5 p-8">
                <svg className="mx-auto h-12 w-12 text-[#003399]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
                <h2 className="mt-4 text-xl font-bold text-[#0d1b3e]">
                  The Comparison Tool is a Pro Feature
                </h2>
                <p className="mt-2 text-sm text-gray-600 max-w-md mx-auto">
                  Describe your use case and let AI match you with the best AI systems.
                  Compare compliance scores, data residency, security posture, and more side-by-side.
                </p>
                <Link
                  href="/en/pricing"
                  className="mt-6 inline-block rounded-lg bg-[#003399] px-8 py-3 text-sm font-semibold text-white hover:bg-[#002277] transition-colors shadow-sm"
                >
                  Upgrade to Pro &mdash; &euro;19/month
                </Link>
                <p className="mt-3 text-xs text-gray-400">
                  Includes unlimited AI chatbot, all 30+ systems, personalized dashboard, and exports.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
