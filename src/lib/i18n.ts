/**
 * Internationalization Configuration — 14 EU Languages
 *
 * Primary: English. Auto-translated to 13 additional languages.
 * Covers 95%+ of the EU population.
 */

export const defaultLocale = "en";

export const locales = [
  "en", // English (primary)
  "fr", // French
  "de", // German
  "es", // Spanish
  "it", // Italian
  "nl", // Dutch
  "pl", // Polish
  "ro", // Romanian
  "pt", // Portuguese
  "cs", // Czech
  "el", // Greek
  "hu", // Hungarian
  "sv", // Swedish
  "bg", // Bulgarian
] as const;

export type Locale = (typeof locales)[number];

/** Display names for each locale (in their own language) */
export const localeNames: Record<Locale, string> = {
  en: "English",
  fr: "Fran\u00E7ais",
  de: "Deutsch",
  es: "Espa\u00F1ol",
  it: "Italiano",
  nl: "Nederlands",
  pl: "Polski",
  ro: "Rom\u00E2n\u0103",
  pt: "Portugu\u00EAs",
  cs: "\u010Ce\u0161tina",
  el: "\u0395\u03BB\u03BB\u03B7\u03BD\u03B9\u03BA\u03AC",
  hu: "Magyar",
  sv: "Svenska",
  bg: "\u0411\u044A\u043B\u0433\u0430\u0440\u0441\u043A\u0438",
};

/** Flag emoji for each locale */
export const localeFlags: Record<Locale, string> = {
  en: "\uD83C\uDDEC\uD83C\uDDE7",
  fr: "\uD83C\uDDEB\uD83C\uDDF7",
  de: "\uD83C\uDDE9\uD83C\uDDEA",
  es: "\uD83C\uDDEA\uD83C\uDDF8",
  it: "\uD83C\uDDEE\uD83C\uDDF9",
  nl: "\uD83C\uDDF3\uD83C\uDDF1",
  pl: "\uD83C\uDDF5\uD83C\uDDF1",
  ro: "\uD83C\uDDF7\uD83C\uDDF4",
  pt: "\uD83C\uDDF5\uD83C\uDDF9",
  cs: "\uD83C\uDDE8\uD83C\uDDFF",
  el: "\uD83C\uDDEC\uD83C\uDDF7",
  hu: "\uD83C\uDDED\uD83C\uDDFA",
  sv: "\uD83C\uDDF8\uD83C\uDDEA",
  bg: "\uD83C\uDDE7\uD83C\uDDEC",
};

/** DeepL target language codes (some differ from our locale codes) */
export const deeplLocaleMap: Record<Locale, string> = {
  en: "EN-GB",
  fr: "FR",
  de: "DE",
  es: "ES",
  it: "IT",
  nl: "NL",
  pl: "PL",
  ro: "RO",
  pt: "PT-PT",
  cs: "CS",
  el: "EL",
  hu: "HU",
  sv: "SV",
  bg: "BG",
};

/** Check if a string is a valid locale */
export function isValidLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

/** Load a UI dictionary for a locale */
export async function getDictionary(locale: Locale) {
  try {
    const dict = await import(`@/dictionaries/${locale}.json`);
    return dict.default;
  } catch {
    // Fallback to English if dictionary not found
    const dict = await import(`@/dictionaries/en.json`);
    return dict.default;
  }
}
