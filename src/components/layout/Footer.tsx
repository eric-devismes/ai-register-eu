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
    { label: "Services", href: l("/services") },
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

        {/* Bottom section */}
        <div className="border-t border-gray-800 py-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs">{t("footer.copyright")}</p>
          </div>
          <p className="mt-4 text-[10px] leading-relaxed text-gray-600">{t("footer.disclaimer")}</p>
        </div>
      </div>
    </footer>
  );
}
