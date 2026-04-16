"use client";

import { useState } from "react";
import { useLocale, useT } from "@/lib/locale-context";

interface TierConfig {
  nameKey: string;
  price: string | null;
  periodKey: string | null;
  descKey: string;
  highlighted: boolean;
  badgeKey?: string;
  features: { key: string; included: boolean }[];
  action: "free" | "pro" | "enterprise";
  ctaKey: string;
}

const tiers: TierConfig[] = [
  {
    nameKey: "pricing.cards.freeName",
    price: "0",
    periodKey: "pricing.cards.freePeriod",
    descKey: "pricing.cards.freeDesc",
    highlighted: false,
    features: [
      { key: "pricing.cards.freeFeat1", included: true },
      { key: "pricing.cards.freeFeat2", included: true },
      { key: "pricing.cards.freeFeat3", included: true },
      { key: "pricing.cards.freeFeat4", included: true },
      { key: "pricing.cards.freeFeat5", included: true },
      { key: "pricing.cards.freeFeat6", included: false },
      { key: "pricing.cards.freeFeat7", included: false },
      { key: "pricing.cards.freeFeat8", included: false },
    ],
    action: "free",
    ctaKey: "pricing.cards.freeCta",
  },
  {
    nameKey: "pricing.cards.proName",
    price: "19",
    periodKey: "pricing.cards.proPeriod",
    descKey: "pricing.cards.proDesc",
    highlighted: true,
    badgeKey: "pricing.cards.proBadge",
    features: [
      { key: "pricing.cards.proFeat1", included: true },
      { key: "pricing.cards.proFeat2", included: true },
      { key: "pricing.cards.proFeat3", included: true },
      { key: "pricing.cards.proFeat4", included: true },
      { key: "pricing.cards.proFeat5", included: true },
      { key: "pricing.cards.proFeat6", included: true },
      { key: "pricing.cards.proFeat7", included: true },
    ],
    action: "pro",
    ctaKey: "pricing.cards.proCta",
  },
  {
    nameKey: "pricing.cards.enterpriseName",
    price: null,
    periodKey: null,
    descKey: "pricing.cards.enterpriseDesc",
    highlighted: false,
    features: [
      { key: "pricing.cards.enterpriseFeat1", included: true },
      { key: "pricing.cards.enterpriseFeat2", included: true },
      { key: "pricing.cards.enterpriseFeat3", included: true },
      { key: "pricing.cards.enterpriseFeat4", included: true },
      { key: "pricing.cards.enterpriseFeat5", included: true },
      { key: "pricing.cards.enterpriseFeat6", included: true },
      { key: "pricing.cards.enterpriseFeat7", included: true },
      { key: "pricing.cards.enterpriseFeat8", included: true },
      { key: "pricing.cards.enterpriseFeat9", included: true },
    ],
    action: "enterprise",
    ctaKey: "pricing.cards.enterpriseCta",
  },
];

export function PricingCards() {
  const locale = useLocale();
  const t = useT();
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
        alert(data.error || t("pricing.cards.paymentError"));
        setLoading(null);
      }
    } catch {
      alert(t("pricing.cards.paymentError"));
      setLoading(null);
    }
  }

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3 lg:items-start">
          {tiers.map((tier) => (
            <div
              key={tier.action}
              className={`relative rounded-2xl border-2 bg-white p-8 shadow-sm ${
                tier.highlighted
                  ? "border-[#003399] shadow-lg shadow-[#003399]/10 lg:scale-105"
                  : "border-gray-200"
              }`}
            >
              {tier.highlighted && tier.badgeKey && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center rounded-full bg-[#003399] px-4 py-1 text-xs font-semibold text-white shadow-sm">
                    {t(tier.badgeKey)}
                  </span>
                </div>
              )}

              <div className="text-center">
                <h3 className="text-lg font-semibold text-[#0d1b3e]">{t(tier.nameKey)}</h3>
                <div className="mt-4 flex items-baseline justify-center gap-1">
                  {tier.price !== null ? (
                    <>
                      <span className="text-sm font-medium text-gray-500">&euro;</span>
                      <span className="text-5xl font-bold text-[#0d1b3e]">{tier.price}</span>
                      <span className="text-sm font-medium text-gray-500">{t(tier.periodKey!)}</span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-[#0d1b3e]">{t("pricing.cards.enterpriseCustom")}</span>
                  )}
                </div>
                <p className="mt-3 text-sm text-gray-600">{t(tier.descKey)}</p>
              </div>

              <ul className="mt-8 space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature.key} className="flex items-start gap-3">
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
                      {t(feature.key)}
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
                  {loading === tier.action ? "..." : t(tier.ctaKey)}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Annual discount + enterprise CTA */}
        <div className="mt-16 mx-auto max-w-2xl text-center space-y-3">
          <p className="text-sm font-medium text-[#0d1b3e]">
            {t("pricing.cards.annualNote")}
          </p>
          <p className="text-sm text-gray-500">
            {t("pricing.cards.vatNote")}{" "}
            <a href={`/${locale}/contact`} className="font-medium text-[#003399] hover:underline">
              {t("pricing.cards.vatLink")}
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
