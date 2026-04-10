/**
 * Chat Rate Limiting
 *
 * Controls how many chat questions a user can ask per calendar day.
 * Limits are tiered by subscription level:
 *
 *   Anonymous (no account):  3 questions/day  — enough to try the chatbot
 *   Free (verified account): 10 questions/day — enough for occasional use
 *   Pro / Enterprise:        unlimited        — paying customers
 *
 * Identification uses a fingerprint cookie (random 16-byte hex string,
 * persists for 1 year). This is NOT cryptographically bound to the user —
 * it can be spoofed by clearing cookies — but it's sufficient for soft
 * rate limiting. Hard abuse prevention would require IP-based limits.
 *
 * Daily counts are stored in the ChatUsage table with a composite
 * unique key on (fingerprint, date). Counts reset at midnight UTC.
 */

import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import crypto from "crypto";

// ─── Configuration ─────────────────────────────────────
// These could move to env vars if you want to tune without redeploying

const ANONYMOUS_DAILY_LIMIT = 3;
const FREE_DAILY_LIMIT = 10;
const COOKIE_NAME = "chat-fingerprint";
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year in seconds

// ─── Types ─────────────────────────────────────────────

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;       // -1 means unlimited (pro/enterprise)
  tier: "free" | "pro" | "enterprise";
  fingerprint: string;
  isSubscriber: boolean;   // true if user has a verified account
}

// ─── Fingerprint Cookie ────────────────────────────────

/**
 * Get or create a fingerprint cookie for this visitor.
 *
 * On first visit, generates a random 16-byte hex string and sets it
 * as an HTTP-only cookie. On subsequent visits, reads the existing value.
 * The cookie is HTTP-only to prevent client-side JS from reading it.
 */
async function getFingerprint(): Promise<string> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(COOKIE_NAME)?.value;

  if (existing) return existing;

  const fp = crypto.randomBytes(16).toString("hex");
  cookieStore.set(COOKIE_NAME, fp, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });

  return fp;
}

// ─── Subscriber Tier Lookup ────────────────────────────

/**
 * Get the subscriber's tier if they are logged in.
 *
 * Uses dynamic import to avoid circular dependency with subscriber-auth.
 * Returns null if the user is not logged in (anonymous).
 */
async function getSubscriberTier(): Promise<{
  tier: "free" | "pro" | "enterprise";
  id: string;
} | null> {
  try {
    const { getSubscriber } = await import("@/lib/subscriber-auth");
    const sub = await getSubscriber();
    if (!sub) return null;
    return {
      tier: sub.tier as "free" | "pro" | "enterprise",
      id: sub.id,
    };
  } catch {
    return null;
  }
}

// ─── Rate Limit Check ──────────────────────────────────

/**
 * Check whether the current user is allowed to ask another question.
 *
 * Flow:
 *   1. Read fingerprint cookie (create one if missing)
 *   2. Look up subscriber session (if logged in, get their tier)
 *   3. Pro/Enterprise → always allowed (unlimited)
 *   4. Free/Anonymous → check daily count against limit
 */
export async function checkRateLimit(): Promise<RateLimitResult> {
  const fingerprint = await getFingerprint();
  const subscriber = await getSubscriberTier();

  // Determine the effective tier: logged-in users get their DB tier,
  // anonymous visitors are treated as "free" with a lower limit
  const tier = subscriber?.tier ?? "free";
  const isSubscriber = subscriber !== null;

  // Pro and Enterprise: unlimited — skip the DB lookup entirely
  if (tier === "pro" || tier === "enterprise") {
    return { allowed: true, remaining: -1, tier, fingerprint, isSubscriber };
  }

  // Free tier (both logged-in free and anonymous): check daily count
  // Anonymous users get a lower limit to incentivize account creation
  const dailyLimit = isSubscriber ? FREE_DAILY_LIMIT : ANONYMOUS_DAILY_LIMIT;
  const today = new Date().toISOString().split("T")[0]; // "2026-04-10"

  const usage = await prisma.chatUsage.findUnique({
    where: { fingerprint_date: { fingerprint, date: today } },
  });

  const currentCount = usage?.count ?? 0;
  const remaining = Math.max(0, dailyLimit - currentCount);

  return {
    allowed: currentCount < dailyLimit,
    remaining,
    tier: "free",  // Both anonymous and free-tier return "free"
    fingerprint,
    isSubscriber,
  };
}

// ─── Usage Increment ───────────────────────────────────

/**
 * Increment the daily question count for a fingerprint.
 *
 * Uses upsert: creates a new row if this is the first question today,
 * or increments the existing count. The unique constraint on
 * (fingerprint, date) prevents race conditions.
 */
export async function incrementUsage(fingerprint: string): Promise<void> {
  const today = new Date().toISOString().split("T")[0];

  await prisma.chatUsage.upsert({
    where: { fingerprint_date: { fingerprint, date: today } },
    update: { count: { increment: 1 } },
    create: { fingerprint, date: today, count: 1 },
  });
}

// ─── Subscriber ID Helper ──────────────────────────────

/**
 * Get the subscriber ID if logged in (used for chat logging).
 *
 * Returns null for anonymous users. The ID is stored in ChatLog
 * so admins can see which subscriber asked which question.
 */
export async function getSubscriberId(): Promise<string | null> {
  try {
    const { getSubscriber } = await import("@/lib/subscriber-auth");
    const sub = await getSubscriber();
    return sub?.id ?? null;
  } catch {
    return null;
  }
}
