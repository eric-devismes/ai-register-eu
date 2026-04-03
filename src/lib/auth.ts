/**
 * Authentication Module
 *
 * Handles all admin authentication for AI Compass EU:
 *   1. Password verification (bcrypt)
 *   2. TOTP two-factor authentication (authenticator app)
 *   3. JWT session tokens (stored in HTTP-only cookies)
 *
 * Environment variables required:
 *   - ADMIN_PASSWORD_HASH: bcrypt hash of the admin password
 *   - TOTP_SECRET: base32-encoded secret for the authenticator app
 *   - JWT_SECRET: random string (32+ chars) for signing session tokens
 */

import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { TOTP, Secret } from "otpauth";
import { cookies } from "next/headers";

// Name of the cookie that stores the session token
const SESSION_COOKIE = "admin-session";

// How long a login session lasts (24 hours)
const SESSION_DURATION = 24 * 60 * 60; // in seconds

/**
 * Convert the JWT_SECRET string into bytes for the jose library.
 * Throws an error if the env var is not set.
 */
function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not set");
  return new TextEncoder().encode(secret);
}

// ─── Password ────────────────────────────────────────────

/**
 * Check if a plaintext password matches the stored hash.
 * The hash comes from the ADMIN_PASSWORD_HASH env var.
 */
export async function verifyPassword(plaintext: string): Promise<boolean> {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash) throw new Error("ADMIN_PASSWORD_HASH not set");
  return bcrypt.compare(plaintext, hash);
}

// ─── TOTP (Two-Factor Authentication) ───────────────────

/**
 * Create a TOTP instance configured for this app.
 * Used both for generating QR codes (setup) and validating codes (login).
 */
export function getTOTP() {
  const totpSecret = process.env.TOTP_SECRET;
  if (!totpSecret) throw new Error("TOTP_SECRET not set");
  return new TOTP({
    issuer: "AI Compass EU",   // Shows in the authenticator app
    label: "Admin",             // Account name in the authenticator app
    algorithm: "SHA1",          // Standard TOTP algorithm
    digits: 6,                  // 6-digit codes
    period: 30,                 // New code every 30 seconds
    secret: Secret.fromBase32(totpSecret),
  });
}

/**
 * Verify a 6-digit TOTP code from the user.
 * Accepts codes from the current and adjacent time windows (±30s)
 * to account for clock skew.
 */
export function verifyTOTP(token: string): boolean {
  const totp = getTOTP();
  const delta = totp.validate({ token, window: 1 });
  return delta !== null;
}

// ─── JWT Sessions ────────────────────────────────────────

/**
 * Create a new signed JWT session token.
 * The token contains the admin role and expires after 24 hours.
 */
export async function createSession(): Promise<string> {
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(getJwtSecret());
  return token;
}

/**
 * Check if a JWT token is valid and not expired.
 * Returns false for any invalid/expired/tampered tokens.
 */
export async function verifySession(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, getJwtSecret());
    return true;
  } catch {
    return false;
  }
}

// ─── Cookie Management ───────────────────────────────────

/**
 * Save the session token as a secure HTTP-only cookie.
 * HTTP-only means JavaScript can't read it (prevents XSS attacks).
 */
export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,                                    // Can't be read by JS
    secure: process.env.NODE_ENV === "production",     // HTTPS only in prod
    sameSite: "lax",                                   // Basic CSRF protection
    maxAge: SESSION_DURATION,                          // Auto-expires
    path: "/",                                         // Available site-wide
  });
}

/**
 * Remove the session cookie (used for logout).
 */
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

/**
 * Check if the current request has a valid admin session.
 * Used by server actions to verify the user is logged in.
 */
export async function getSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  return verifySession(token);
}
