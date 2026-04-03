/**
 * Server-side locale detection — reads the locale from the request URL.
 * Used by server components that need the current locale but don't have
 * access to the [lang] route parameter.
 */

import { headers } from "next/headers";
import { locales, type Locale } from "@/lib/i18n";

export async function getLocaleFromHeaders(): Promise<Locale> {
  const headersList = await headers();
  // Next.js provides the full URL in x-url or we can parse from referer/x-forwarded-*
  // The most reliable way in Next.js 16 is to look at x-nextjs-data or parse the pathname
  const url = headersList.get("x-url") || headersList.get("referer") || "";

  for (const locale of locales) {
    if (url.includes(`/${locale}/`) || url.endsWith(`/${locale}`)) {
      return locale;
    }
  }

  // Fallback: check the pathname from x-invoke-path (Next.js internal header)
  const invokePath = headersList.get("x-invoke-path") || "";
  const segments = invokePath.split("/").filter(Boolean);
  if (segments[0] && locales.includes(segments[0] as Locale)) {
    return segments[0] as Locale;
  }

  return "en";
}
