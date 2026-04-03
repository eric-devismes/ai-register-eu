"use client";

import { useT } from "@/lib/locale-context";

export default function HowItWorks() {
  const t = useT();

  const steps = [
    { number: 1, title: t("howItWorks.step1Title"), description: t("howItWorks.step1Desc") },
    { number: 2, title: t("howItWorks.step2Title"), description: t("howItWorks.step2Desc") },
    { number: 3, title: t("howItWorks.step3Title"), description: t("howItWorks.step3Desc") },
    { number: 4, title: t("howItWorks.step4Title"), description: t("howItWorks.step4Desc") },
  ];

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">{t("howItWorks.title")}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-gray-500">{t("howItWorks.subtitle")}</p>
        </div>
        <div className="relative mt-16">
          <div className="absolute left-0 right-0 top-6 hidden h-0.5 bg-gradient-to-r from-[#003399]/10 via-[#003399]/30 to-[#003399]/10 lg:block" />
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.number} className="relative text-center">
                <div className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#003399] text-lg font-bold text-white shadow-lg ring-4 ring-white">
                  {step.number}
                </div>
                <h3 className="mt-6 text-lg font-semibold text-gray-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
