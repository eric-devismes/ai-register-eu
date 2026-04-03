"use client";

/**
 * LanguageSwitcher — Dropdown to switch between supported locales.
 * Preserves the current page path when switching languages.
 */

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { locales, localeNames, localeFlags, type Locale } from "@/lib/i18n";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Detect current locale from URL
  const segments = pathname.split("/").filter(Boolean);
  const currentLocale = (locales.includes(segments[0] as Locale) ? segments[0] : "en") as Locale;

  // Path without locale prefix
  const pathWithoutLocale = "/" + segments.slice(locales.includes(segments[0] as Locale) ? 1 : 0).join("/");

  // Close on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors text-xs"
      >
        <span>{localeFlags[currentLocale]}</span>
        <span className="font-medium">{currentLocale.toUpperCase()}</span>
        <svg className={`h-3 w-3 transition ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 w-48 rounded-lg border border-gray-700 bg-[#0d1b3e] shadow-lg py-1">
          {locales.map((locale) => (
            <a
              key={locale}
              href={`/${locale}${pathWithoutLocale}`}
              className={`flex items-center gap-2 px-3 py-2 text-xs transition hover:bg-white/10 ${
                locale === currentLocale ? "text-[#ffc107] font-semibold" : "text-gray-300"
              }`}
              onClick={() => setOpen(false)}
            >
              <span>{localeFlags[locale]}</span>
              <span>{localeNames[locale]}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
