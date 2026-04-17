"use client";

/**
 * LanguageSwitcher — Dropdown to switch between supported locales.
 * Uses flat-design SVG flags instead of emoji for consistent cross-platform rendering.
 * Preserves the current page path when switching languages.
 */

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { locales, activeLocales, localeNames, type Locale } from "@/lib/i18n";

/** Flat-design SVG flags — simple geometric representations */
function FlagIcon({ locale, size = 16 }: { locale: Locale; size?: number }) {
  const w = size;
  const h = Math.round(size * 0.75);

  const flags: Record<Locale, React.ReactNode> = {
    // UK — Union Jack simplified
    en: (
      <svg width={w} height={h} viewBox="0 0 20 15" className="rounded-sm">
        <rect width="20" height="15" fill="#012169" />
        <path d="M0,0 L20,15 M20,0 L0,15" stroke="#fff" strokeWidth="3" />
        <path d="M0,0 L20,15 M20,0 L0,15" stroke="#C8102E" strokeWidth="1.5" />
        <path d="M10,0 V15 M0,7.5 H20" stroke="#fff" strokeWidth="5" />
        <path d="M10,0 V15 M0,7.5 H20" stroke="#C8102E" strokeWidth="3" />
      </svg>
    ),
    // France — Tricolore
    fr: (
      <svg width={w} height={h} viewBox="0 0 20 15" className="rounded-sm">
        <rect width="6.67" height="15" fill="#002395" />
        <rect x="6.67" width="6.67" height="15" fill="#fff" />
        <rect x="13.33" width="6.67" height="15" fill="#ED2939" />
      </svg>
    ),
    // Germany — Schwarz-Rot-Gold
    de: (
      <svg width={w} height={h} viewBox="0 0 20 15" className="rounded-sm">
        <rect width="20" height="5" fill="#000" />
        <rect y="5" width="20" height="5" fill="#DD0000" />
        <rect y="10" width="20" height="5" fill="#FFCC00" />
      </svg>
    ),
    // Spain — Rojo y Gualda
    es: (
      <svg width={w} height={h} viewBox="0 0 20 15" className="rounded-sm">
        <rect width="20" height="15" fill="#AA151B" />
        <rect y="3.75" width="20" height="7.5" fill="#F1BF00" />
      </svg>
    ),
    // Italy — Il Tricolore
    it: (
      <svg width={w} height={h} viewBox="0 0 20 15" className="rounded-sm">
        <rect width="6.67" height="15" fill="#009246" />
        <rect x="6.67" width="6.67" height="15" fill="#fff" />
        <rect x="13.33" width="6.67" height="15" fill="#CE2B37" />
      </svg>
    ),
    // Netherlands — Rood-Wit-Blauw
    nl: (
      <svg width={w} height={h} viewBox="0 0 20 15" className="rounded-sm">
        <rect width="20" height="5" fill="#AE1C28" />
        <rect y="5" width="20" height="5" fill="#fff" />
        <rect y="10" width="20" height="5" fill="#21468B" />
      </svg>
    ),
    // Poland — Biało-czerwona
    pl: (
      <svg width={w} height={h} viewBox="0 0 20 15" className="rounded-sm">
        <rect width="20" height="7.5" fill="#fff" />
        <rect y="7.5" width="20" height="7.5" fill="#DC143C" />
      </svg>
    ),
    // Romania — Tricolor
    ro: (
      <svg width={w} height={h} viewBox="0 0 20 15" className="rounded-sm">
        <rect width="6.67" height="15" fill="#002B7F" />
        <rect x="6.67" width="6.67" height="15" fill="#FCD116" />
        <rect x="13.33" width="6.67" height="15" fill="#CE1126" />
      </svg>
    ),
    // Portugal
    pt: (
      <svg width={w} height={h} viewBox="0 0 20 15" className="rounded-sm">
        <rect width="8" height="15" fill="#006600" />
        <rect x="8" width="12" height="15" fill="#FF0000" />
        <circle cx="8" cy="7.5" r="2.5" fill="#FFCC00" />
      </svg>
    ),
    // Czech Republic
    cs: (
      <svg width={w} height={h} viewBox="0 0 20 15" className="rounded-sm">
        <rect width="20" height="7.5" fill="#fff" />
        <rect y="7.5" width="20" height="7.5" fill="#D7141A" />
        <polygon points="0,0 10,7.5 0,15" fill="#11457E" />
      </svg>
    ),
    // Greece
    el: (
      <svg width={w} height={h} viewBox="0 0 20 15" className="rounded-sm">
        <rect width="20" height="15" fill="#0D5EAF" />
        {[0, 2, 4, 6, 8].map((i) => (
          <rect key={i} y={i * (15/9)} width="20" height={15/9} fill={i % 2 === 0 ? "#0D5EAF" : "#fff"} />
        ))}
        <rect width="5.56" height="5" fill="#0D5EAF" />
        <path d="M2.78,0 V5 M0,2.5 H5.56" stroke="#fff" strokeWidth="1" />
      </svg>
    ),
    // Hungary
    hu: (
      <svg width={w} height={h} viewBox="0 0 20 15" className="rounded-sm">
        <rect width="20" height="5" fill="#CE2939" />
        <rect y="5" width="20" height="5" fill="#fff" />
        <rect y="10" width="20" height="5" fill="#477050" />
      </svg>
    ),
    // Sweden
    sv: (
      <svg width={w} height={h} viewBox="0 0 20 15" className="rounded-sm">
        <rect width="20" height="15" fill="#006AA7" />
        <rect x="5.5" width="3" height="15" fill="#FECC00" />
        <rect y="5.5" width="20" height="3" fill="#FECC00" />
      </svg>
    ),
    // Bulgaria
    bg: (
      <svg width={w} height={h} viewBox="0 0 20 15" className="rounded-sm">
        <rect width="20" height="5" fill="#fff" />
        <rect y="5" width="20" height="5" fill="#00966E" />
        <rect y="10" width="20" height="5" fill="#D62612" />
      </svg>
    ),
  };

  return <span className="inline-flex shrink-0">{flags[locale]}</span>;
}

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
        <FlagIcon locale={currentLocale} size={18} />
        <span className="font-medium">{currentLocale.toUpperCase()}</span>
        <svg className={`h-3 w-3 transition ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 w-48 rounded-lg border border-gray-700 bg-[#0d1b3e] shadow-lg py-1">
          {activeLocales.map((locale) => (
            <a
              key={locale}
              href={`/${locale}${pathWithoutLocale}`}
              className={`flex items-center gap-2 px-3 py-2 text-xs transition hover:bg-white/10 ${
                locale === currentLocale ? "text-[#ffc107] font-semibold" : "text-gray-300"
              }`}
              onClick={() => setOpen(false)}
            >
              <FlagIcon locale={locale} size={16} />
              <span>{localeNames[locale]}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
