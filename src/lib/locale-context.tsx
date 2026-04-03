"use client";

/**
 * Locale Context — Makes locale and dictionary available to all client components.
 *
 * The [lang] layout loads the dictionary server-side and passes it here.
 * Client components use `useLocale()` to read locale and `useDict()` for strings.
 */

import { createContext, useContext, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n";

// Dictionary type matches our JSON structure
type Dict = Record<string, Record<string, string>>;

interface LocaleContextValue {
  locale: Locale;
  dict: Dict;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: "en",
  dict: {},
});

export function LocaleProvider({
  locale,
  dict,
  children,
}: {
  locale: Locale;
  dict: Dict;
  children: ReactNode;
}) {
  return (
    <LocaleContext.Provider value={{ locale, dict }}>
      {children}
    </LocaleContext.Provider>
  );
}

/** Get the current locale */
export function useLocale(): Locale {
  return useContext(LocaleContext).locale;
}

/** Get the full dictionary */
export function useDict(): Dict {
  return useContext(LocaleContext).dict;
}

/**
 * Get a translated string by section.key path.
 * Usage: t("hero.title") → "The European Reference Database for"
 */
export function useT() {
  const { dict } = useContext(LocaleContext);

  return function t(key: string, fallback?: string): string {
    const [section, ...rest] = key.split(".");
    const field = rest.join(".");
    return dict?.[section]?.[field] || fallback || key;
  };
}
