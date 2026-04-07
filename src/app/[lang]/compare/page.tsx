/**
 * AI System Comparison Tool
 *
 * URL: /compare
 *
 * Step 1: User describes use case in plain text
 * Step 2: AI asks follow-up questions (if needed)
 * Step 3: AI returns ranked matches with relevance scores
 * Step 4: User selects systems to compare
 * Step 5: Side-by-side comparison table (systems as columns, attributes as rows)
 */

import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CompareClient } from "./CompareClient";

export const metadata: Metadata = {
  title: "AI System Comparison — AI Compass EU",
  description: "Describe your use case and get AI-matched, side-by-side comparisons of enterprise AI systems assessed for EU regulatory compliance.",
};

export default function ComparePage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-gray-50 min-h-screen">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#0d1b3e] to-[#003399] text-white">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-blue-200">
                ✦ AI-Powered Matching
              </div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-serif">
                Find & Compare AI Systems
              </h1>
              <p className="mt-4 text-lg text-blue-100 max-w-2xl">
                Describe your use case in plain English. Get AI-matched recommendations from our database of assessed enterprise AI systems, then compare them side-by-side against EU compliance criteria.
              </p>
            </div>
          </div>
        </section>

        {/* Main Tool */}
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <CompareClient />
        </div>
      </main>
      <Footer />
    </>
  );
}
