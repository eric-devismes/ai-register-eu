"use client";

import Link from "next/link";
import { useT, useLocale } from "@/lib/locale-context";

export default function Footer() {
  const t = useT();
  const locale = useLocale();
  const l = (path: string) => `/${locale}${path}`;

  const databaseLinks = [
    { label: t("footer.browseAI"), href: l("/database") },
    { label: t("footer.riskCategories"), href: l("/database") },
    { label: t("footer.complianceTracker"), href: l("/database") },
  ];

  const regulationLinks = [
    { label: t("footer.euAiActOverview"), href: l("/regulations/eu-ai-act") },
    { label: t("footer.complianceReq"), href: l("/regulations/gdpr") },
    { label: t("footer.riskClassification"), href: l("/regulations/dora") },
    { label: t("footer.timeline"), href: l("/regulations") },
    { label: t("footer.standards"), href: l("/regulations") },
    { label: t("footer.nationalImpl"), href: l("/regulations/national-ai-strategies") },
  ];

  const platformLinks = [
    { label: t("footer.aboutUs"), href: l("/about") },
    { label: t("common.methodology"), href: l("/methodology") },
    { label: t("common.pricing"), href: l("/pricing") },
    { label: t("common.privacy"), href: l("/privacy") },
    { label: "Security", href: l("/security") },
    { label: "Incident Response", href: l("/incident-response") },
    { label: "Pricing", href: l("/pricing") },
    { label: "Terms", href: l("/terms") },
    { label: "Contact", href: l("/contact") },
  ];

  return (
    <footer className="bg-[#0a1628] text-gray-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top section */}
        <div className="grid grid-cols-1 gap-12 py-16 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href={`/${locale}`} className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#003399] to-[#0055cc]">
                <span className="text-sm font-bold text-white tracking-tight">AI</span>
              </div>
              <div>
                <div className="text-lg font-bold text-white">AI Compass EU</div>
                <div className="text-[10px] text-gray-500">{t("footer.slogan")}</div>
              </div>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed">{t("footer.tagline")}</p>
          </div>

          {/* Database links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-300">{t("footer.database")}</h3>
            <ul className="mt-4 space-y-2.5">
              {databaseLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Regulation links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-300">{t("footer.regulations")}</h3>
            <ul className="mt-4 space-y-2.5">
              {regulationLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-300">{t("footer.platform")}</h3>
            <ul className="mt-4 space-y-2.5">
              {platformLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Notices */}
        <div className="border-t border-gray-800 py-8 space-y-6">
          {/* AI Transparency Notice — EU AI Act Article 50 */}
          <div className="flex items-start gap-3">
            <svg className="h-5 w-5 shrink-0 text-[#ffc107] mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
            </svg>
            <div>
              <p className="text-xs font-semibold text-[#ffc107]">AI Transparency Notice</p>
              <p className="mt-1 text-[10px] leading-relaxed text-gray-500">
                This platform uses AI (Anthropic Claude) for its chatbot assistant and comparison tool.
                AI-generated responses are grounded in our assessed database and clearly labelled.
                No personal data is used for AI model training. All AI features comply with the EU AI Act
                transparency obligations (Article 50) and GDPR requirements for automated processing.
              </p>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-3">
            <svg className="h-5 w-5 shrink-0 text-[#ffc107] mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
            <div>
              <p className="text-xs font-semibold text-[#ffc107]">Disclaimer</p>
              <p className="mt-1 text-[10px] leading-relaxed text-gray-500">
                {t("footer.disclaimer")}
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 py-6">
          <p className="text-xs text-center">{t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
