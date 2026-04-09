"use client";

/**
 * CookieConsent — GDPR-compliant cookie consent banner.
 *
 * Shows on first visit. Remembers choice via a cookie.
 * Only essential cookies are used (session, rate limiting).
 * Analytics (Plausible) is privacy-friendly and cookie-free.
 *
 * Consent choices:
 *   - "Accept all": sets consent cookie, enables future analytics
 *   - "Essential only": sets consent cookie with essential-only flag
 */

import { useState, useEffect } from "react";
import Link from "next/link";

const CONSENT_COOKIE = "cookie-consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show banner only if no consent cookie exists
    const hasConsent = document.cookie.split(";").some((c) => c.trim().startsWith(`${CONSENT_COOKIE}=`));
    if (!hasConsent) setVisible(true);
  }, []);

  function accept(choice: "all" | "essential") {
    // Set consent cookie (1 year)
    document.cookie = `${CONSENT_COOKIE}=${choice}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`;
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 backdrop-blur-sm shadow-lg">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1 text-sm text-gray-600">
            <p>
              We use <strong>essential cookies only</strong> (session management, rate limiting).
              No tracking, no advertising cookies. Our analytics are cookie-free.{" "}
              <Link href="/en/privacy" className="text-[#003399] underline hover:text-[#002277]">
                Privacy Policy
              </Link>
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => accept("essential")}
              className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50"
            >
              Essential only
            </button>
            <button
              onClick={() => accept("all")}
              className="rounded-lg bg-[#003399] px-4 py-2 text-xs font-semibold text-white hover:bg-[#002277]"
            >
              Accept all
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
