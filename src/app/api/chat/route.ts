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

/**
 * Detect if a question is about the user's account, billing, or subscription.
 */
const ACCOUNT_PATTERNS = [
  /\b(?:my\s+)?(?:account|subscription|billing|invoice|payment|plan|tier)\b/i,
  /\b(?:cancel|unsubscribe|downgrade|upgrade|refund)\b/i,
  /\b(?:mon\s+)?(?:compte|abonnement|facturation|facture|paiement|forfait)\b/i,
  /\b(?:annuler|résilier|désabonner)\b/i,
  /\b(?:mein\s+)?(?:konto|abonnement|rechnung|zahlung|plan)\b/i,
  /\b(?:kündigen|abbestellen)\b/i,
  /\bhow\s+(?:to|do\s+i)\s+(?:cancel|unsubscribe|delete|export)\b/i,
  /\bwhat\s+(?:plan|tier)\s+am\s+i\b/i,
  /\bdata\s+(?:export|delete|portability)\b/i,
];

function isAccountQuestion(question: string): boolean {
  return ACCOUNT_PATTERNS.some((p) => p.test(question));
}

/**
 * Build account context for the LLM when the user asks about their account.
 */
async function getAccountContext(subscriberId: string | null, locale: string): Promise<string> {
  if (!subscriberId) {
    return locale === "fr"
      ? "L'utilisateur n'est pas connecté. Pour gérer un compte, il doit d'abord se connecter via la page /subscribe. Les visiteurs anonymes ont 3 questions gratuites par jour."
      : locale === "de"
      ? "Der Benutzer ist nicht angemeldet. Zur Kontoverwaltung muss er sich unter /subscribe anmelden. Anonyme Besucher haben 3 kostenlose Fragen pro Tag."
      : "The user is not logged in. To manage an account, they need to log in via the /subscribe page. Anonymous visitors get 3 free questions per day.";
  }

  try {
    const sub = await prisma.subscriber.findUnique({
      where: { id: subscriberId },
      select: {
        email: true,
        name: true,
        tier: true,
        stripeSubscriptionId: true,
        tierExpiresAt: true,
        digestEnabled: true,
        digestFrequency: true,
        consentDate: true,
        createdAt: true,
      },
    });

    if (!sub) return "User account not found.";

    const tierLabels: Record<string, string> = {
      free: "Free (3 questions/day, basic access)",
      pro: "Pro €19/month (unlimited questions, full access, CSV exports)",
      enterprise: "Enterprise (custom pricing, API access, priority support)",
    };

    return [
      `ACCOUNT INFO FOR THIS USER:`,
      `Email: ${sub.email}`,
      `Name: ${sub.name || "Not set"}`,
      `Plan: ${tierLabels[sub.tier || "free"] || sub.tier}`,
      sub.stripeSubscriptionId ? `Subscription active (managed via payment provider)` : `No active paid subscription`,
      sub.tierExpiresAt ? `Expires: ${sub.tierExpiresAt.toISOString().split("T")[0]}` : "",
      `Member since: ${sub.createdAt.toISOString().split("T")[0]}`,
      `Digest: ${sub.digestEnabled ? `Enabled (${sub.digestFrequency})` : "Disabled"}`,
      "",
      "SELF-SERVICE ACTIONS THE USER CAN TAKE:",
      "- View/edit profile and preferences: /account",
      "- Export all personal data (GDPR Art. 20): /api/account/export",
      "- Delete account permanently (GDPR Art. 17): available in /account settings",
      "- Manage subscription/billing: click 'Subscription' in the profile menu",
      "- Upgrade plan: /pricing",
      "- Cancel subscription: via the customer portal (link in /account under Subscription section)",
      "- Unsubscribe from digest emails: toggle in /account preferences",
      "",
      "CUSTOMER SUPPORT POLICIES:",
      "- Cancellation: Subscriptions can be cancelled anytime. Takes effect at end of current billing period. No partial refunds.",
      "- Refunds: If requested within 14 days of initial purchase, full refund available. Contact support@vendorscope.eu.",
      "- Billing disputes: If charged incorrectly, contact support@vendorscope.eu with billing details.",
      "- Plan changes: Upgrade takes effect immediately. Downgrade takes effect at next billing cycle.",
      "- Account deletion: Immediate and irreversible. All data erased per GDPR Article 17.",
      "- Data export: Available anytime at /api/account/export. Includes all personal data, preferences, and chat history.",
      "- Technical issues: For platform bugs or access issues, contact support@vendorscope.eu.",
      "",
      "RESPONSE RULES:",
      "- Never share the user's email or personal data in the response.",
      "- Refer to their plan/tier and guide them to the right page/action.",
      "- Be empathetic but efficient. Resolve in the fewest steps possible.",
      "- If the issue cannot be resolved via self-service, direct them to support@vendorscope.eu.",
      "- For cancellation requests, acknowledge their decision without being pushy but mention they can re-subscribe anytime.",
    ].filter(Boolean).join("\n");
  } catch {
    return "Unable to load account information. Please try again or visit /account directly.";
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const question = body.question as string;
    const locale = (isValidLocale(body.locale) ? body.locale : "en") as Locale;

    if (!question || typeof question !== "string" || question.trim().length === 0) {
      return NextResponse.json({ error: "Missing required field: question" }, { status: 400 });
    }

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
    // If the question is about the user's account, inject account context instead of RAG
    const isAccount = isAccountQuestion(guard.sanitised!);
    const [context, userProfile] = await Promise.all([
      isAccount
        ? getAccountContext(subId, locale)
        : retrieveContext(guard.sanitised!),
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
