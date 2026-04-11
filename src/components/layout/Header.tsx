"use client";

/**
 * Header — Main navigation with locale-aware links and language switcher.
 */

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import ProfileBubble from "./ProfileBubble";
import { useT, useLocale } from "@/lib/locale-context";
import { locales, type Locale } from "@/lib/i18n";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [isSubscriber, setIsSubscriber] = useState(false);
  const [userData, setUserData] = useState<{ name: string | null; email: string; tier: string } | null>(null);
  const t = useT();
  const locale = useLocale();
  const pathname = usePathname();

  // Prefix helper: prepends locale to paths
  const l = (path: string) => `/${locale}${path}`;

  // Detect current locale from path for non-context situations
  const segments = pathname.split("/").filter(Boolean);
  const pathLocale = locales.includes(segments[0] as Locale) ? segments[0] : "en";

  useEffect(() => {
    fetch("/api/feed")
      .then((r) => r.json())
      .then((data) => {
        setIsSubscriber(data.authenticated);
        if (data.authenticated && data.user) {
          setUserData(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const utilityLinks = [
    { label: t("common.about"), href: l("/about") },
    { label: t("common.methodology"), href: l("/methodology") },
  ];

  const mainNavLinks = [
    { label: t("common.home"), href: `/${pathLocale}` },
    { label: t("common.database"), href: l("/database") },
    { label: t("common.regulations"), href: l("/regulations") },
    { label: t("common.industries"), href: l("/industries") },
    { label: "Newsfeed", href: l("/newsfeed") },
    { label: "Plans", href: l("/pricing") },
  ];

  const toolsLinks = [
    { label: "Compare", href: l("/compare"), desc: "Side-by-side system comparison" },
    { label: "Checklist", href: l("/checklist"), desc: "Compliance checklist generator" },
    { label: "Business Case", href: l("/business-case"), desc: "ROI/TCO business case" },
    { label: "RFP Engine", href: l("/rfp-engine"), desc: "AI-powered RFP answers" },
    { label: "Podium", href: l("/podium"), desc: "Top-3 system recommendations" },
    { label: "Vendor Prep", href: l("/vendor-prep"), desc: "Meeting preparation toolkit" },
    { label: "Reports", href: l("/reports"), desc: "Downloadable analysis reports" },
  ];

  return (
    <header className="sticky top-0 z-50">
      {/* Utility Bar */}
      <div className="bg-[#0d1b3e] border-b-2 border-[#ffc107]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-11 text-xs">
            <nav className="hidden md:flex items-center gap-4">
              {utilityLinks.map((link) => (
                <Link key={link.href} href={link.href}
                  className="text-gray-300 hover:text-white transition-colors">
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="ml-auto flex items-center gap-6">
              {isSubscriber && userData ? (
                <ProfileBubble name={userData.name} email={userData.email} tier={userData.tier} />
              ) : (
                <Link href={l("/subscribe")} className="text-gray-300 hover:text-white transition-colors text-xs">
                  {t("common.logIn")}
                </Link>
              )}
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href={`/${pathLocale}`} className="flex items-center gap-3 shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#003399] to-[#0055cc] shadow-sm">
                <span className="text-sm font-bold text-white tracking-tight">AI</span>
              </div>
              <div className="hidden sm:block">
                <div className="text-lg font-bold text-[#003399] leading-tight">AI Compass EU</div>
                <div className="text-[10px] text-gray-500 leading-tight">AI Intelligence for European Decision-Makers</div>
              </div>
            </Link>

            {/* Main Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {mainNavLinks.map((link) => (
                <Link key={link.href} href={link.href}
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#003399] hover:bg-blue-50 rounded-md transition-colors">
                  {link.label}
                </Link>
              ))}
              {/* Tools Dropdown */}
              <div className="relative"
                onMouseEnter={() => setToolsOpen(true)}
                onMouseLeave={() => setToolsOpen(false)}>
                <button
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#003399] hover:bg-blue-50 rounded-md transition-colors"
                >
                  Tools
                  <svg className={`h-3.5 w-3.5 transition ${toolsOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                {toolsOpen && (
                  <div className="absolute left-0 top-full z-50 w-72 rounded-lg border border-gray-200 bg-white shadow-xl py-2">
                    {toolsLinks.map((tool) => (
                      <Link key={tool.href} href={tool.href}
                        className="flex flex-col px-4 py-2.5 hover:bg-blue-50 transition-colors"
                        onClick={() => setToolsOpen(false)}>
                        <span className="text-sm font-medium text-gray-900">{tool.label}</span>
                        <span className="text-xs text-gray-500">{tool.desc}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            {/* Search + Mobile Toggle */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center">
                <div className="relative">
                  <svg className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                  <input type="search" placeholder={t("hero.searchPlaceholder")}
                    className="w-48 rounded-md border border-gray-300 bg-gray-50 py-1.5 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#003399] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#003399]"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const q = (e.target as HTMLInputElement).value.trim();
                        if (q) window.location.href = `/${pathLocale}/database?q=${encodeURIComponent(q)}`;
                      }
                    }} />
                </div>
              </div>

              <button type="button"
                className="lg:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 space-y-1">
              {mainNavLinks.map((link) => (
                <Link key={link.href} href={link.href}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-[#003399]"
                  onClick={() => setMobileMenuOpen(false)}>
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-gray-200 pt-2 mt-2">
                <p className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tools</p>
              </div>
              {toolsLinks.map((link) => (
                <Link key={link.href} href={link.href}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-[#003399]"
                  onClick={() => setMobileMenuOpen(false)}>
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-gray-200 pt-3 mt-3 space-y-1">
                {utilityLinks.map((link) => (
                  <Link key={link.href} href={link.href}
                    className="block rounded-md px-3 py-2 text-xs text-gray-500 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
