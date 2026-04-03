/**
 * Chat Rate Limiting — Fingerprint-based daily limits for anonymous users.
 *
 * Anonymous: 5 questions per calendar day (tracked by persistent cookie).
 * Logged-in subscribers: unlimited.
 */

import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import crypto from "crypto";

const ANONYMOUS_DAILY_LIMIT = 5;
const SUBSCRIBER_MONTHLY_LIMIT = 20;
const COOKIE_NAME = "chat-fingerprint";
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  isSubscriber: boolean;
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
 * Check if this visitor is a logged-in subscriber.
 */
async function isLoggedIn(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("subscriber-session")?.value;
  return !!sessionToken;
}

/**
 * Check rate limit and return status.
 *
 * Anonymous: 5 questions per calendar day.
 * Subscriber: 20 questions per calendar month.
 */
export async function checkRateLimit(): Promise<RateLimitResult> {
  const fingerprint = await getFingerprint();
  const subscriber = await isLoggedIn();

  if (subscriber) {
    // Subscribers: 20 per month, tracked by fingerprint + month key
    const month = new Date().toISOString().slice(0, 7); // "2026-04"
    const monthKey = `sub-${month}`;

    const usage = await prisma.chatUsage.findUnique({
      where: { fingerprint_date: { fingerprint, date: monthKey } },
    });

    const currentCount = usage?.count || 0;
    const remaining = Math.max(0, SUBSCRIBER_MONTHLY_LIMIT - currentCount);

    return {
      allowed: currentCount < SUBSCRIBER_MONTHLY_LIMIT,
      remaining,
      isSubscriber: true,
      fingerprint,
    };
  }

  // Anonymous: 5 per calendar day
  const today = new Date().toISOString().split("T")[0];

  const usage = await prisma.chatUsage.findUnique({
    where: { fingerprint_date: { fingerprint, date: today } },
  });

  const currentCount = usage?.count || 0;
  const remaining = Math.max(0, ANONYMOUS_DAILY_LIMIT - currentCount);

  return {
    allowed: currentCount < ANONYMOUS_DAILY_LIMIT,
    remaining,
    isSubscriber: false,
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
