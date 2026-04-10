/**
 * POST /api/chat — AI chatbot endpoint with RAG, rate limiting, and security.
 *
 * Pipeline (each step can short-circuit):
 *   1. Parse & validate request body
 *   2. Rate limit check (fingerprint cookie + subscriber tier)
 *   3. Security guard (injection detection, off-topic filter, length check)
 *   4. RAG retrieval (keyword search across frameworks, statements, systems, changelog)
 *   5. LLM call (Claude Haiku with profile-aware system prompt)
 *   6. Increment usage counter + log interaction
 *   7. Return answer with remaining quota
 *
 * Request:  { question: string, locale: string }
 * Response: { answer: string, remaining: number, isSubscriber: boolean, blocked: boolean, exhausted: boolean }
 */

import { NextResponse } from "next/server";
import { guardQuestion, getRefusalMessage } from "@/lib/chat-guard";
import { checkRateLimit, incrementUsage, getSubscriberId } from "@/lib/chat-rate-limit";
import { retrieveContext } from "@/lib/chat-rag";
import { callLLM, type UserProfile } from "@/lib/llm";
import { prisma } from "@/lib/db";
import { isValidLocale, type Locale } from "@/lib/i18n";

/**
 * Load user profile from the subscriber record (if logged in).
 *
 * The profile is passed to the LLM system prompt so it can tailor
 * responses — e.g., a DPO gets compliance-focused answers while
 * a CTO gets technical implementation details.
 */
async function getUserProfile(subscriberId: string | null): Promise<UserProfile | undefined> {
  if (!subscriberId) return undefined;
  try {
    const sub = await prisma.subscriber.findUnique({
      where: { id: subscriberId },
      select: { role: true, industry: true, orgSize: true },
    });
    if (sub && (sub.role || sub.industry || sub.orgSize)) {
      return {
        role: sub.role || undefined,
        industry: sub.industry || undefined,
        orgSize: sub.orgSize || undefined,
      };
    }
  } catch { /* subscriber lookup is best-effort */ }
  return undefined;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const question = body.question as string;
    const locale = (isValidLocale(body.locale) ? body.locale : "en") as Locale;

    // Step 0: Get subscriber ID early — needed for logging and profile lookup
    const subId = await getSubscriberId();

    // Step 1: Rate limit check
    const rateLimit = await checkRateLimit();

    if (!rateLimit.allowed) {
      // Log the blocked attempt so admins can spot abuse patterns
      await prisma.chatLog.create({
        data: {
          fingerprint: rateLimit.fingerprint,
          subscriberId: subId,
          question: (question || "").slice(0, 500),
          answer: "",
          locale,
          blocked: true,
          blockReason: "rate-limit",
        },
      });

      return NextResponse.json({
        answer: "",
        remaining: 0,
        isSubscriber: rateLimit.isSubscriber,
        blocked: true,
        exhausted: true,
      });
    }

    // Step 2: Security guard — reject injection attempts, off-topic, too long
    const guard = guardQuestion(question);

    if (!guard.allowed) {
      const refusal = getRefusalMessage(guard.reason!, locale);

      await prisma.chatLog.create({
        data: {
          fingerprint: rateLimit.fingerprint,
          subscriberId: subId,
          question: (question || "").slice(0, 500),
          answer: refusal,
          locale,
          blocked: true,
          blockReason: guard.reason!,
        },
      });

      // Blocked questions don't count against the daily limit
      return NextResponse.json({
        answer: refusal,
        remaining: rateLimit.remaining,
        isSubscriber: rateLimit.isSubscriber,
        blocked: true,
        exhausted: false,
      });
    }

    // Step 3: RAG retrieval + user profile lookup (run in parallel)
    const [context, userProfile] = await Promise.all([
      retrieveContext(guard.sanitised!),
      getUserProfile(subId),
    ]);

    // Step 4: LLM call with profile-aware system prompt
    const llmResponse = await callLLM({
      question: guard.sanitised!,
      context,
      locale,
      userProfile,
    });

    // Step 5: Increment daily usage counter (only for successful responses)
    await incrementUsage(rateLimit.fingerprint);

    // Calculate remaining: pro/enterprise get -1 (unlimited), free tier decrements
    const isUnlimited = rateLimit.tier === "pro" || rateLimit.tier === "enterprise";
    const newRemaining = isUnlimited ? -1 : rateLimit.remaining - 1;

    // Step 6: Log the interaction for admin review and abuse detection
    await prisma.chatLog.create({
      data: {
        fingerprint: rateLimit.fingerprint,
        subscriberId: subId,
        question: guard.sanitised!,
        answer: llmResponse.answer,
        locale,
        blocked: llmResponse.blocked,
        blockReason: llmResponse.blockReason || "",
      },
    });

    return NextResponse.json({
      answer: llmResponse.answer,
      remaining: newRemaining,
      isSubscriber: rateLimit.isSubscriber,
      blocked: false,
      exhausted: false,
    });
  } catch (error) {
    console.error("[chat] Error:", error);
    return NextResponse.json(
      { answer: "An error occurred. Please try again.", remaining: -1, blocked: false, exhausted: false },
      { status: 500 },
    );
  }
}
