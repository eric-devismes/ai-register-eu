/**
 * Proxy (Next.js 16 middleware)
 *
 * Two responsibilities:
 * 1. Admin auth — protect /admin/* routes
 * 2. Locale routing — detect locale, redirect bare paths to /en/
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const LOCALES = ["en", "fr", "de", "es", "it", "nl", "pl", "ro", "pt", "cs", "el", "hu", "sv", "bg"];
const DEFAULT_LOCALE = "en";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ─── Admin Auth ────────────────────────────────────
  const publicAdminPages = ["/admin/login", "/admin/setup-totp"];
  if (pathname.startsWith("/admin") && !publicAdminPages.includes(pathname)) {
    const token = request.cookies.get("admin-session")?.value;
    if (!token) return NextResponse.redirect(new URL("/admin/login", request.url));

    const secret = getJwtSecret();
    if (!secret) return NextResponse.redirect(new URL("/admin/login", request.url));

    try {
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // ─── Skip locale routing for API, admin, _next ────
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")  // static files
  ) {
    return NextResponse.next();
  }

  // ─── Locale Detection & Redirect ──────────────────
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];

  // Already has a valid locale prefix → pass through
  if (firstSegment && LOCALES.includes(firstSegment)) {
    return NextResponse.next();
  }

  // No locale prefix → detect from Accept-Language header or default to English
  const acceptLanguage = request.headers.get("accept-language") || "";
  let detectedLocale = DEFAULT_LOCALE;

  for (const locale of LOCALES) {
    if (acceptLanguage.toLowerCase().includes(locale)) {
      detectedLocale = locale;
      break;
    }
  }

  // Redirect to locale-prefixed URL
  const url = request.nextUrl.clone();
  url.pathname = `/${detectedLocale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    // Match all paths except _next/static, _next/image, favicon
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
