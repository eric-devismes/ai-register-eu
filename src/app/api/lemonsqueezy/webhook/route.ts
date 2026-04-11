/**
 * POST /api/lemonsqueezy/webhook — LemonSqueezy payment event handler.
 *
 * Receives signed webhook events from LemonSqueezy and updates subscriber tiers.
 *
 * Events handled:
 *   subscription_created      → upgrade subscriber to "pro"
 *   subscription_updated      → sync status changes
 *   subscription_cancelled    → mark for downgrade at period end
 *   subscription_expired      → downgrade subscriber to "free"
 *   subscription_payment_failed → alert (future: notify user)
 *
 * Security: Every request is verified using HMAC-SHA256 signature
 * from the X-Signature header against the webhook secret.
 */

import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 503 }
    );
  }

  // Read raw body for signature verification
  const rawBody = await request.text();
  const signature = request.headers.get("x-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  // Verify HMAC-SHA256 signature
  const hmac = crypto.createHmac("sha256", secret);
  const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
  const sig = Buffer.from(signature, "utf8");

  if (digest.length !== sig.length || !crypto.timingSafeEqual(digest, sig)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  const eventName: string = payload.meta?.event_name;
  const customData = payload.meta?.custom_data;
  const attrs = payload.data?.attributes;

  // Get subscriber email from the event or custom data
  const email: string | undefined =
    attrs?.user_email || customData?.email;
  const subscriberId: string | undefined = customData?.subscriber_id;
  const subscriptionId: string | undefined = payload.data?.id;
  const customerId: string | undefined = attrs?.customer_id?.toString();

  console.log(
    `[lemonsqueezy] Event: ${eventName}, email: ${email}, sub: ${subscriptionId}`
  );

  try {
    switch (eventName) {
      // ── New subscription → upgrade to Pro ─────────────
      case "subscription_created": {
        if (!email && !subscriberId) break;

        const where = subscriberId
          ? { id: subscriberId }
          : { email: email! };

        await prisma.subscriber.update({
          where,
          data: {
            tier: "pro",
            stripeCustomerId: customerId || null, // Reusing field for LS customer ID
            stripeSubscriptionId: subscriptionId || null, // Reusing field for LS subscription ID
          },
        });
        break;
      }

      // ── Subscription updated (plan change, etc.) ──────
      case "subscription_updated": {
        if (!subscriptionId) break;

        const status: string = attrs?.status;

        // Map LemonSqueezy statuses to our tiers
        if (status === "active" || status === "on_trial") {
          await prisma.subscriber.updateMany({
            where: { stripeSubscriptionId: subscriptionId },
            data: { tier: "pro" },
          });
        } else if (status === "paused" || status === "past_due") {
          // Keep pro but could notify user
          console.warn(
            `[lemonsqueezy] Subscription ${subscriptionId} status: ${status}`
          );
        }
        break;
      }

      // ── Subscription cancelled (still active until period end) ──
      case "subscription_cancelled": {
        // Don't downgrade immediately — the user paid for the current period
        // The subscription_expired event will handle the actual downgrade
        if (subscriptionId) {
          console.log(
            `[lemonsqueezy] Subscription ${subscriptionId} cancelled — will expire at period end`
          );
        }
        break;
      }

      // ── Subscription expired → downgrade to Free ──────
      case "subscription_expired": {
        if (!subscriptionId) break;

        await prisma.subscriber.updateMany({
          where: { stripeSubscriptionId: subscriptionId },
          data: {
            tier: "free",
            stripeSubscriptionId: null,
          },
        });
        break;
      }

      // ── Payment failed → log for follow-up ────────────
      case "subscription_payment_failed": {
        console.error(
          `[lemonsqueezy] Payment failed for subscription ${subscriptionId}`
        );
        // Future: send email notification to user
        break;
      }

      default:
        console.log(`[lemonsqueezy] Unhandled event: ${eventName}`);
    }
  } catch (error) {
    console.error(`[lemonsqueezy] Error processing ${eventName}:`, error);
    // Return 200 to prevent LemonSqueezy from retrying — log error for investigation
  }

  return NextResponse.json({ received: true });
}
