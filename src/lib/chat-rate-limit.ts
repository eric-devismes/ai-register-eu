/**
 * Chat Rate Limiting — 4-tier limits.
 *
 * Anonymous (no account): 3 questions per calendar day.
 * Free (account created): 10 questions per calendar day.
 * Pro subscribers: unlimited.
 * Enterprise subscribers: unlimited.
 */

import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import crypto from "crypto";

const ANONYMOUS_DAILY_LIMIT = 3;
const FREE_DAILY_LIMIT = 10;
const COOKIE_NAME = "chat-fingerprint";
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  tier: "free" | "pro" | "enterprise";
  fingerprint: string;
}

/**
 * Get or create a fingerprint cookie for this visitor.
 */
async function getFingerprint(): Promise<string> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(COOKIE_NAME)?.value;

  if (existing) return existing;

  // Generate new fingerprint
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

/**
 * Get the subscriber's tier if logged in.
 */
async function getSubscriberTier(): Promise<"free" | "pro" | "enterprise" | null> {
  try {
    const { getSubscriber } = await import("@/lib/subscriber-auth");
    const sub = await getSubscriber();
    if (!sub) return null;
    const tier = sub.tier as "free" | "pro" | "enterprise";
    return tier;
  } catch {
    return null;
  }
}

/**
 * Check rate limit and return status.
 *
 * Free / anonymous: 5 questions per calendar day.
 * Pro / Enterprise: unlimited.
 */
export async function checkRateLimit(): Promise<RateLimitResult> {
  const fingerprint = await getFingerprint();
  const tier = (await getSubscriberTier()) || "free";

  // Pro and Enterprise: unlimited
  if (tier === "pro" || tier === "enterprise") {
    return {
      allowed: true,
      remaining: -1, // -1 = unlimited
      tier,
      fingerprint,
    };
  }

  // Determine if user has an account (free tier) or is anonymous
  const isLoggedIn = tier !== null;
  const dailyLimit = isLoggedIn ? FREE_DAILY_LIMIT : ANONYMOUS_DAILY_LIMIT;
  const effectiveTier = isLoggedIn ? "free" : "anonymous";

  const today = new Date().toISOString().split("T")[0];

  const usage = await prisma.chatUsage.findUnique({
    where: { fingerprint_date: { fingerprint, date: today } },
  });

  const currentCount = usage?.count || 0;
  const remaining = Math.max(0, dailyLimit - currentCount);

  return {
    allowed: currentCount < dailyLimit,
    remaining,
    tier: effectiveTier as "free" | "pro" | "enterprise",
    fingerprint,
  };
}

/**
 * Increment the question count for this visitor.
 */
export async function incrementUsage(fingerprint: string): Promise<void> {
  const today = new Date().toISOString().split("T")[0];

  await prisma.chatUsage.upsert({
    where: { fingerprint_date: { fingerprint, date: today } },
    update: { count: { increment: 1 } },
    create: { fingerprint, date: today, count: 1 },
  });
}

/**
 * Get the subscriber ID if logged in (for chat logging).
 */
export async function getSubscriberId(): Promise<string | null> {
  try {
    const { getSubscriber } = await import("@/lib/subscriber-auth");
    const sub = await getSubscriber();
    return sub?.id || null;
  } catch {
    return null;
  }
}
