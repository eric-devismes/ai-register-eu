"use client";

import { useState } from "react";
import { useLocale } from "@/lib/locale-context";

const tiers = [
  {
    name: "Free",
    price: "0",
    period: "forever",
    description:
      "Explore AI compliance data for the most widely used platforms. Perfect for getting started.",
    highlighted: false,
    features: [
      { text: "10 most-used AI systems with full detail", included: true },
      { text: "AI compliance chatbot — 3 questions/day", included: true },
      { text: "Newsfeed & regulatory updates", included: true },
      { text: "Compare free-tier systems side-by-side", included: true },
      { text: "Compliance checklist generator", included: true },
      { text: "All 100+ AI systems with deep assessments", included: false },
      { text: "Business Case & Podium tools", included: false },
      { text: "Export compliance reports (CSV / JSON)", included: false },
    ],
    action: "free" as const,
    cta: "Get Started Free",
  },
  {
    name: "Pro",
    price: "19",
    period: "/month",
    description:
      "Full compliance intelligence for DPOs, compliance officers, and AI-aware professionals.",
    highlighted: true,
    badge: "Most Popular",
    features: [
      { text: "All 100+ AI systems — full assessments & role drill-downs", included: true },
      { text: "Unlimited AI compliance chatbot", included: true },
      { text: "Side-by-side comparison with 35+ attributes", included: true },
      { text: "Business Case Generator (ROI/TCO analysis)", included: true },
      { text: "Podium — top-3 system recommendations", included: true },
      { text: "Vendor Discussion Prep toolkit", included: true },
      { text: "Export compliance reports (PDF / CSV / JSON)", included: true },
      { text: "Priority email support", included: true },
    ],
    action: "pro" as const,
    cta: "Start Pro — \u20ac19/month",
  },
  {
    name: "Enterprise",
    price: null,
    period: null,
    description:
      "For compliance teams managing AI across the organization. RFP engine, API access, and dedicated support.",
    highlighted: false,
    features: [
      { text: "Everything in Pro", included: true },
      { text: "RFP/RFI Answer Engine — AI-drafted responses", included: true },
      { text: "REST API access — integrate compliance data into your stack", included: true },
      { text: "Multiple team seats with SSO", included: true },
      { text: "Custom compliance reports & bulk export", included: true },
      { text: "Webhook alerts with custom rules", included: true },
      { text: "Priority compliance guidance from AI experts", included: true },
      { text: "Dedicated account manager & phone support", included: true },
    ],
    action: "enterprise" as const,
    cta: "Contact Sales",
  },
];

export function PricingCards() {
  const locale = useLocale();
  const [loading, setLoading] = useState<string | null>(null);

  async function handleClick(action: "free" | "pro" | "enterprise") {
    if (action === "free") {
      window.location.href = `/${locale}/subscribe`;
      return;
    }

    if (action === "enterprise") {
      window.location.href = `/${locale}/contact`;
      return;
    }

    // Pro → LemonSqueezy Checkout
    setLoading("pro");
    try {
      const res = await fetch("/api/lemonsqueezy/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale }),
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
              {tier.highlighted && tier.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center rounded-full bg-[#003399] px-4 py-1 text-xs font-semibold text-white shadow-sm">
                    {tier.badge}
                  </span>
                </div>
              )}

              <div className="text-center">
                <h3 className="text-lg font-semibold text-[#0d1b3e]">{tier.name}</h3>
                <div className="mt-4 flex items-baseline justify-center gap-1">
                  {tier.price !== null ? (
                    <>
                      <span className="text-sm font-medium text-gray-500">&euro;</span>
                      <span className="text-5xl font-bold text-[#0d1b3e]">{tier.price}</span>
                      <span className="text-sm font-medium text-gray-500">{tier.period}</span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-[#0d1b3e]">Custom</span>
                  )}
                </div>
                <p className="mt-3 text-sm text-gray-600">{tier.description}</p>
              </div>

              <ul className="mt-8 space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature.text} className="flex items-start gap-3">
                    {feature.included ? (
                      <svg
                        className={`h-5 w-5 shrink-0 ${tier.highlighted ? "text-[#003399]" : "text-green-500"}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5 shrink-0 text-gray-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                    )}
                    <span className={`text-sm ${feature.included ? "text-gray-700" : "text-gray-400"}`}>
                      {feature.text}
                    </span>
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

        {/* Annual discount + enterprise CTA */}
        <div className="mt-16 mx-auto max-w-2xl text-center space-y-3">
          <p className="text-sm font-medium text-[#0d1b3e]">
            Save 20% with annual billing &mdash; Pro at just &euro;182/year.
          </p>
          <p className="text-sm text-gray-500">
            All prices exclude VAT. Need a tailored enterprise plan with API access and dedicated support?{" "}
            <a href={`/${locale}/contact`} className="font-medium text-[#003399] hover:underline">
              Let&apos;s talk
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
