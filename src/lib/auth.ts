/**
 * Admin Authentication — Multi-user with roles.
 *
 * Supports multiple admin users stored in the database (AdminUser model).
 * Each admin has: email, password (bcrypt), optional TOTP 2FA, and a role.
 *
 * Roles:
 *   - "owner"  — Unrestricted. Full admin + bypasses all public-site tier limits.
 *   - "admin"  — Full admin panel access.
 *   - "editor" — Content management only (systems, frameworks, changelog).
 *
 * Backward compatibility:
 *   If no AdminUser records exist in the DB, falls back to the legacy
 *   ADMIN_PASSWORD_HASH + TOTP_SECRET env vars (single-admin mode).
 *
 * Session: JWT stored in HTTP-only cookie, 24-hour expiry.
 * JWT payload includes: { adminId, role, type: "admin" }
 */

import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { TOTP, Secret } from "otpauth";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { ADMIN_SESSION_HOURS } from "@/lib/constants";

// ─── Constants ──────────────────────────────────────────

const SESSION_COOKIE = "admin-session";
const SESSION_DURATION = ADMIN_SESSION_HOURS * 60 * 60; // in seconds

export type AdminRole = "owner" | "admin" | "editor";

export interface AdminSession {
  adminId: string;       // AdminUser.id (or "legacy" for env-var mode)
  email: string;
  name: string;
  role: AdminRole;
}

// ─── JWT Helpers ────────────────────────────────────────

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not set");
  return new TextEncoder().encode(secret);
}

// ─── Password ───────────────────────────────────────────

/** Verify a plaintext password against a bcrypt hash. */
export async function verifyPassword(plaintext: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plaintext, hash);
}

/** Hash a plaintext password for storage. */
export async function hashPassword(plaintext: string): Promise<string> {
  return bcrypt.hash(plaintext, 12);
}

// ─── TOTP ───────────────────────────────────────────────

/** Create a TOTP instance for a given secret. */
export function createTOTP(secret: string, label = "Admin") {
  return new TOTP({
    issuer: "VendorScope",
    label,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: Secret.fromBase32(secret),
  });
}

/** Verify a 6-digit TOTP code. Accepts ±1 window for clock skew. */
export function verifyTOTP(token: string, secret: string): boolean {
  const totp = createTOTP(secret);
  const delta = totp.validate({ token, window: 1 });
  return delta !== null;
}

// Legacy TOTP for env-var mode
export function getTOTP() {
  const totpSecret = process.env.TOTP_SECRET;
  if (!totpSecret) throw new Error("TOTP_SECRET not set");
  return createTOTP(totpSecret, "Admin");
}

// ─── Admin User Lookup ──────────────────────────────────

/**
 * Find an admin user by email and verify their password.
 * Returns the admin record if credentials are valid, null otherwise.
 */
export async function authenticateAdmin(email: string, password: string) {
  // Try DB-backed admin first
  const admin = await prisma.adminUser.findUnique({ where: { email } });

  if (admin && admin.active) {
    const valid = await verifyPassword(password, admin.passwordHash);
    if (valid) return admin;
    return null;
  }

  // Legacy fallback: env-var mode (no email check, just password)
  const legacyHash = process.env.ADMIN_PASSWORD_HASH;
  if (legacyHash) {
    const valid = await verifyPassword(password, legacyHash);
    if (valid) {
      return {
        id: "legacy",
        email: "admin@vendorscope.eu",
        name: "Admin",
        role: "owner" as AdminRole,
        totpSecret: process.env.TOTP_SECRET || "",
        totpEnabled: !!process.env.TOTP_SECRET,
      };
    }
  }

  return null;
}

// ─── Sessions ───────────────────────────────────────────

/** Create a signed JWT session for an admin user. */
export async function createSession(admin: { id: string; email: string; name: string; role: string }): Promise<string> {
  return new SignJWT({
    adminId: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
    type: "admin",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(getJwtSecret());
}

/** Save session token as HTTP-only cookie. */
export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION,
    path: "/",
  });
}

/** Remove session cookie (logout). */
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

/**
 * Get the current admin session from the cookie.
 * Returns the full session payload (adminId, email, name, role) or null.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    if (payload.type !== "admin") return null;

    return {
      adminId: payload.adminId as string,
      email: payload.email as string,
      name: (payload.name as string) || "Admin",
      role: (payload.role as AdminRole) || "admin",
    };
  } catch {
    return null;
  }
}

/**
 * Legacy compat: check if there's a valid admin session (boolean).
 * Used by existing server actions that call getSession().
 */
export async function getSession(): Promise<boolean> {
  const session = await getAdminSession();
  return session !== null;
}

// ─── Role Checks ────────────────────────────────────────

/** Check if a role has permission for an action. */
export function hasAdminPermission(role: AdminRole, action: "view" | "edit" | "manage_admins"): boolean {
  switch (action) {
    case "view":
      return true; // All admin roles can view
    case "edit":
      return role === "owner" || role === "admin" || role === "editor";
    case "manage_admins":
      return role === "owner"; // Only owner can add/remove admins
  }
}

/**
 * Check if the current user (admin or subscriber) should bypass tier restrictions.
 * Returns true for admin owners — they see everything as if Enterprise.
 */
export async function isOwnerSession(): Promise<boolean> {
  const session = await getAdminSession();
  return session?.role === "owner";
}
