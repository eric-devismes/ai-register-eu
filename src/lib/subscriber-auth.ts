/**
 * Subscriber Authentication — Magic link flow.
 *
 * No passwords. User enters email → gets a magic link → clicks it → session set.
 * Tokens are hashed before storage. Sessions last 30 days.
 */

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import crypto from "crypto";
import { SUBSCRIBER_SESSION_DAYS, MAGIC_LINK_MINUTES } from "@/lib/constants";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "");
const COOKIE_NAME = "subscriber-session";
const SESSION_DAYS = SUBSCRIBER_SESSION_DAYS;

// ─── Token Helpers ───────────────────────────────────────

/** Hash a token with SHA-256 for safe storage */
function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/** Generate a random token */
function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// ─── Magic Link ──────────────────────────────────────────

/**
 * Generate a magic link token for a subscriber.
 * Returns the raw token (to include in the email link).
 * Stores the hashed version in the database.
 */
export async function generateMagicToken(subscriberId: string): Promise<string> {
  const rawToken = generateToken();
  const hashed = hashToken(rawToken);
  const expiry = new Date(Date.now() + MAGIC_LINK_MINUTES * 60 * 1000);

  await prisma.subscriber.update({
    where: { id: subscriberId },
    data: { magicToken: hashed, magicTokenExp: expiry },
  });

  return rawToken;
}

/**
 * Verify a magic link token.
 * Returns the subscriber if valid, null if expired or invalid.
 * Clears the token after use (single-use).
 */
export async function verifyMagicToken(email: string, rawToken: string) {
  const hashed = hashToken(rawToken);

  const subscriber = await prisma.subscriber.findUnique({ where: { email } });
  if (!subscriber) return null;
  if (!subscriber.magicToken || subscriber.magicToken !== hashed) return null;
  if (!subscriber.magicTokenExp || subscriber.magicTokenExp < new Date()) return null;

  // Clear the token (single-use) and mark as verified
  await prisma.subscriber.update({
    where: { id: subscriber.id },
    data: {
      magicToken: null,
      magicTokenExp: null,
      verified: true,
    },
  });

  return subscriber;
}

// ─── Session ─────────────────────────────────────────────

/**
 * Create a session for a subscriber.
 * Sets an HTTP-only cookie with a JWT containing the subscriber ID.
 */
export async function createSubscriberSession(subscriberId: string) {
  const sessionToken = generateToken();
  const hashed = hashToken(sessionToken);
  const expiry = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  // Store hashed session in DB
  await prisma.subscriber.update({
    where: { id: subscriberId },
    data: { sessionToken: hashed, sessionExp: expiry },
  });

  // Create JWT
  const jwt = await new SignJWT({ sub: subscriberId, type: "subscriber" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(JWT_SECRET);

  // Set cookie
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
    path: "/",
  });
}

/**
 * Get the currently logged-in subscriber from the session cookie.
 * Returns the subscriber object with preferences, or null.
 */
export async function getSubscriber() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (payload.type !== "subscriber" || !payload.sub) return null;

    const subscriber = await prisma.subscriber.findUnique({
      where: { id: payload.sub },
      include: {
        frameworks: { select: { id: true, slug: true, name: true } },
        systems: { select: { id: true, slug: true, vendor: true, name: true } },
      },
    });

    if (!subscriber || !subscriber.verified) return null;
    if (subscriber.sessionExp && subscriber.sessionExp < new Date()) return null;

    return subscriber;
  } catch {
    return null;
  }
}

/**
 * Log out the subscriber by clearing the session cookie.
 */
export async function logoutSubscriber() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", { maxAge: 0, path: "/" });
}
