"use client";

/**
 * ProfileBubble — Logged-in user avatar with initials + dropdown menu.
 *
 * Shows a circular bubble with user initials (e.g. "ED" for Eric Devismes).
 * Click opens a dropdown with profile, preferences, billing, and logout.
 */

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useLocale, useT } from "@/lib/locale-context";

interface ProfileBubbleProps {
  name: string | null;
  email: string;
  tier: string;
}

/** Extract initials from name or email */
function getInitials(name: string | null, email: string): string {
  if (name && name.trim().length > 0) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  }
  // Fallback to email
  return email.substring(0, 2).toUpperCase();
}

/** Tier badge color */
function tierColor(tier: string): string {
  switch (tier) {
    case "pro":
      return "bg-[#ffc107] text-[#0d1b3e]";
    case "enterprise":
      return "bg-purple-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
}

export default function ProfileBubble({ name, email, tier }: ProfileBubbleProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const t = useT();

  const initials = getInitials(name, email);
  const l = (path: string) => `/${locale}${path}`;

  // Close on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const menuItems = [
    {
      label: locale === "fr" ? "Mon profil" : locale === "de" ? "Mein Profil" : "My Profile",
      href: l("/account"),
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
      ),
    },
    {
      label: locale === "fr" ? "Préférences" : locale === "de" ? "Einstellungen" : "Preferences",
      href: l("/account#preferences"),
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
      ),
    },
    {
      label: locale === "fr" ? "Abonnement" : locale === "de" ? "Abonnement" : "Subscription",
      href: l("/account#subscription"),
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
        </svg>
      ),
    },
    {
      label: locale === "fr" ? "Exporter mes données" : locale === "de" ? "Daten exportieren" : "Export My Data",
      href: "/api/account/export",
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
      ),
    },
  ];

  async function handleLogout() {
    await fetch("/api/subscribe/logout", { method: "POST" });
    window.location.href = `/${locale}`;
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 group"
        aria-label="Profile menu"
      >
        {/* Initials bubble */}
        <div className="h-8 w-8 rounded-full bg-[#003399] flex items-center justify-center text-white text-xs font-bold ring-2 ring-white/20 group-hover:ring-[#ffc107]/50 transition-all">
          {initials}
        </div>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 w-64 rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden">
          {/* User info header */}
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[#003399] flex items-center justify-center text-white text-sm font-bold shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                {name && <p className="text-sm font-semibold text-gray-900 truncate">{name}</p>}
                <p className="text-xs text-gray-500 truncate">{email}</p>
                <span className={`inline-block mt-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${tierColor(tier)}`}>
                  {tier === "free" ? "Free" : tier === "pro" ? "Pro" : tier === "enterprise" ? "Enterprise" : tier}
                </span>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="py-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#003399] transition-colors"
                onClick={() => setOpen(false)}
              >
                <span className="text-gray-400">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>

          {/* Upgrade CTA for free users */}
          {tier === "free" && (
            <div className="border-t border-gray-200 px-4 py-2.5">
              <Link
                href={l("/pricing")}
                className="flex items-center gap-2 text-sm font-medium text-[#003399] hover:text-[#003399]/80"
                onClick={() => setOpen(false)}
              >
                <svg className="h-4 w-4 text-[#ffc107]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {locale === "fr" ? "Passer à Pro" : locale === "de" ? "Auf Pro upgraden" : "Upgrade to Pro"}
              </Link>
            </div>
          )}

          {/* Logout */}
          <div className="border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
              </svg>
              {locale === "fr" ? "Se déconnecter" : locale === "de" ? "Abmelden" : "Log out"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
