import type { Metadata } from "next";
import "./globals.css";
import CookieConsent from "@/components/ui/CookieConsent";

export const metadata: Metadata = {
  title: {
    default: "AI Compass EU — AI Intelligence for European Decision-Makers",
    template: "%s | AI Compass EU",
  },
  description:
    "Search, compare, and evaluate AI tools rated for European enterprises. GDPR compliance, AI Act readiness, data sovereignty, and multilingual quality scores.",
  keywords: [
    "AI tools Europe",
    "EU AI Act compliance",
    "GDPR AI tools",
    "AI vendor comparison",
    "European AI database",
    "AI compliance ratings",
  ],
  openGraph: {
    type: "website",
    locale: "en_EU",
    siteName: "AI Compass EU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        {/* Plausible Analytics — replace YOUR_DOMAIN with your domain when ready */}
        {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && (
          <script
            defer
            data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
            src="https://plausible.io/js/script.js"
          />
        )}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@300;400;500;600;700&family=Merriweather:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
