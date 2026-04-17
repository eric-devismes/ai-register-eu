/**
 * Locale Layout — Wraps all public pages under /[lang]/.
 *
 * Loads the UI dictionary for the current locale and provides it
 * to all child components via LocaleProvider context.
 */

import { activeLocales, type Locale, isActiveLocale, getDictionary } from "@/lib/i18n";
import { LocaleProvider } from "@/lib/locale-context";
import { notFound } from "next/navigation";
import ChatWidget from "@/components/chat/ChatWidget";

export function generateStaticParams() {
  return activeLocales.map((lang) => ({ lang }));
}

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { lang } = await params;

  if (!isActiveLocale(lang)) {
    notFound();
  }

  const dict = await getDictionary(lang as Locale);

  return (
    <LocaleProvider locale={lang as Locale} dict={dict}>
      {children}
      <ChatWidget />
    </LocaleProvider>
  );
}
