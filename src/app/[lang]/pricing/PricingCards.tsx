"use client";

import { useState } from "react";
import { useLocale } from "@/lib/locale-context";

const tiers = [
  {
    name: "Free",
    price: "0",
    period: "forever",
    description: "Get started with essential AI compliance data. Perfect for individual exploration.",
    highlighted: false,
    features: [
      "Browse top-level compliance scores",
      "5 full assessments per month",
      "Basic search and filtering",
      "EU AI Act risk category lookup",
      "Weekly regulatory newsletter",
    ],
    action: "free" as const,
    cta: "Get Started Free",
  },
  {
    name: "Pro",
    price: "49",
    period: "/month",
    description: "Full access to compliance intelligence for professionals and compliance officers.",
    highlighted: true,
    features: [
      "Unlimited full assessments",
      "Side-by-side comparison tool",
      "Real-time regulatory alerts",
      "Export compliance reports (PDF/CSV)",
      "Detailed scoring breakdowns",
      "Saved searches and watchlists",
      "Priority email support",
    ],
    action: "pro" as const,
    cta: "Start Pro Trial",
  },
  {
    name: "Team",
    price: "149",
    period: "/month",
    description: "Collaborate on AI compliance across your organization with shared tools and API access.",
    highlighted: false,
    features: [
      "Everything in Pro",
      "5 team member seats",
      "REST API access (10K calls/month)",
      "Custom compliance reports",
      "Shared team watchlists",
      "SSO integration",
      "Priority phone & email support",
      "Dedicated account manager",
    ],
    action: "team" as const,
    cta: "Contact Sales",
  },
];

export function PricingCards() {
  const locale = useLocale();
  const [loading, setLoading] = useState<string | null>(null);

  async function handleClick(action: "free" | "pro" | "team") {
    if (action === "free") {
      window.location.href = `/${locale}/subscribe`;
      return;
    }

    if (action === "team") {
      window.location.href = `/${locale}/contact`;
      return;
    }

    // Pro → Stripe Checkout
    setLoading("pro");
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Payment system is being set up. Please try again later.");
        setLoading(null);
      }
    } catch {
      alert("Payment system is being set up. Please try again later.");
      setLoading(null);
    }
  }

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3 lg:items-start">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl border-2 bg-white p-8 shadow-sm ${
                tier.highlighted
                  ? "border-[#003399] shadow-lg shadow-[#003399]/10 lg:scale-105"
                  : "border-gray-200"
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center rounded-full bg-[#003399] px-4 py-1 text-xs font-semibold text-white shadow-sm">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center">
                <h3 className="text-lg font-semibold text-[#0d1b3e]">{tier.name}</h3>
                <div className="mt-4 flex items-baseline justify-center gap-1">
                  <span className="text-sm font-medium text-gray-500">&euro;</span>
                  <span className="text-5xl font-bold text-[#0d1b3e]">{tier.price}</span>
                  <span className="text-sm font-medium text-gray-500">{tier.period}</span>
                </div>
                <p className="mt-3 text-sm text-gray-600">{tier.description}</p>
              </div>

              <ul className="mt-8 space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <svg
                      className={`h-5 w-5 shrink-0 ${tier.highlighted ? "text-[#003399]" : "text-green-500"}`}
                      fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <button
                  type="button"
                  onClick={() => handleClick(tier.action)}
                  disabled={loading === tier.action}
                  className={`w-full rounded-lg px-4 py-3 text-sm font-semibold transition-colors disabled:opacity-50 ${
                    tier.highlighted
                      ? "bg-[#003399] text-white hover:bg-[#002277] shadow-sm"
                      : "bg-white text-[#003399] ring-1 ring-inset ring-[#003399] hover:bg-[#003399]/5"
                  }`}
                >
                  {loading === tier.action ? "..." : tier.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 mx-auto max-w-2xl text-center">
          <p className="text-sm text-gray-500">
            All prices exclude VAT. Annual billing available with 20% discount.
            Need a custom enterprise plan?{" "}
            <a href={`/${locale}/contact`} className="font-medium text-[#003399] hover:underline">
              Contact our sales team
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
