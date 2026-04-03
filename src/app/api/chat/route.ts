/**
 * POST /api/chat — Chat endpoint with RAG, rate limiting, and security.
 *
 * Flow: validate → rate check → sanitise → RAG retrieve → LLM call → log → respond
 *
 * Body: { question: string, locale: string }
 * Response: { answer: string, remaining: number, isSubscriber: boolean, blocked: boolean, exhausted: boolean }
 */

import { NextResponse } from "next/server";
import { guardQuestion, getRefusalMessage } from "@/lib/chat-guard";
import { checkRateLimit, incrementUsage, getSubscriberId } from "@/lib/chat-rate-limit";
import { retrieveContext } from "@/lib/chat-rag";
import { callLLM } from "@/lib/llm";
import { prisma } from "@/lib/db";
import { isValidLocale, type Locale } from "@/lib/i18n";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const question = body.question as string;
    const locale = (isValidLocale(body.locale) ? body.locale : "en") as Locale;

    // 1. Rate limit check
    const rateLimit = await checkRateLimit();

    if (!rateLimit.allowed) {
      // Log the blocked attempt
      await prisma.chatLog.create({
        data: {
          fingerprint: rateLimit.fingerprint,
          subscriberId: await getSubscriberId(),
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
        isSubscriber: false,
        blocked: true,
        exhausted: true,
      });
    }

    // 2. Security guard
    const guard = guardQuestion(question);

    if (!guard.allowed) {
      const refusal = getRefusalMessage(guard.reason!, locale);

      await prisma.chatLog.create({
        data: {
          fingerprint: rateLimit.fingerprint,
          subscriberId: await getSubscriberId(),
          question: (question || "").slice(0, 500),
          answer: refusal,
          locale,
          blocked: true,
          blockReason: guard.reason!,
        },
      });

      // Don't count blocked questions against rate limit
      return NextResponse.json({
        answer: refusal,
        remaining: rateLimit.remaining,
        isSubscriber: rateLimit.isSubscriber,
        blocked: true,
        exhausted: false,
      });
    }

    // 3. RAG retrieval
    const context = await retrieveContext(guard.sanitised!);

    // 4. LLM call
    const llmResponse = await callLLM({
      question: guard.sanitised!,
      context,
      locale,
    });

    // 5. Increment usage (only for successful, non-blocked responses)
    await incrementUsage(rateLimit.fingerprint);
    const newRemaining = rateLimit.isSubscriber ? -1 : rateLimit.remaining - 1;

    // 6. Log the interaction
    await prisma.chatLog.create({
      data: {
        fingerprint: rateLimit.fingerprint,
        subscriberId: await getSubscriberId(),
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
      { status: 500 }
    );
  }
}
