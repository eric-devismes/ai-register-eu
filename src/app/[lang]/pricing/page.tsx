import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { PricingCards } from "./PricingCards";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "AI Compass EU pricing plans. Free, Pro, and Enterprise tiers for AI compliance intelligence. Start free, upgrade to Pro for \u20ac19/month, or contact us for enterprise.",
};

export default function PricingPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#0d1b3e] to-[#003399] text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold text-[#ffc107] tracking-wide uppercase">
                Pricing
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                AI Compliance Intelligence, Priced for Everyone
              </h1>
              <p className="mt-4 text-lg text-blue-100 leading-relaxed">
                Start free with essential compliance data and our AI chatbot.
                Upgrade to Pro for full access to 30+ AI systems, personalized
                dashboards, and comparison tools &mdash; or talk to us about enterprise.
              </p>
            </div>
          </div>
        </section>

        <PricingCards />
      </main>
      <Footer />
    </>
  );
}
