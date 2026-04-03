"use client";

/**
 * Header — Main navigation with locale-aware links and language switcher.
 */

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import { useT, useLocale } from "@/lib/locale-context";
import { locales, type Locale } from "@/lib/i18n";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSubscriber, setIsSubscriber] = useState(false);
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
      .then((data) => setIsSubscriber(data.authenticated))
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
    { label: t("common.pricing"), href: l("/pricing") },
  ];

  return (
    <header className="sticky top-0 z-50">
      {/* Utility Bar */}
      <div className="bg-[#0d1b3e] border-b-2 border-[#ffc107]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-9 text-xs">
            <nav className="hidden md:flex items-center gap-4">
              {utilityLinks.map((link) => (
                <Link key={link.href} href={link.href}
                  className="text-gray-300 hover:text-white transition-colors">
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="ml-auto flex items-center gap-4">
              {isSubscriber ? (
                <Link href={l("/account")} className="text-[#ffc107] hover:text-white transition-colors text-xs font-medium">
                  {t("common.myAccount")}
                </Link>
              ) : (
                <Link href={l("/subscribe")} className="text-gray-300 hover:text-white transition-colors text-xs">
                  {t("common.signIn")}
                </Link>
              )}
            </div>
            <LanguageSwitcher />
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
            </nav>

            {/* Search + Mobile Toggle */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center">
                <div className="relative">
                  <svg className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                  <input type="search" placeholder={t("hero.searchPlaceholder")}
                    className="w-48 rounded-md border border-gray-300 bg-gray-50 py-1.5 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#003399] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#003399]" />
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
