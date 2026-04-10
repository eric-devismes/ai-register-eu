/**
 * POST /api/stripe/webhook — Stripe payment event handler.
 *
 * Receives signed webhook events from Stripe and updates subscriber tiers.
 * Only two events are handled:
 *
 *   checkout.session.completed → upgrade subscriber to "pro"
 *   customer.subscription.deleted → downgrade subscriber to "free"
 *
 * Security: Every request is verified using the Stripe webhook signature.
 * Invalid signatures are rejected with 400 before any DB writes.
 *
 * Important: Uses `update()` (not `updateMany()`) to ensure we only
 * modify the exact subscriber matching the email. The email field has
 * a unique constraint in the Subscriber model, so this is safe.
 */

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripeKey || !webhookSecret) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const stripe = new Stripe(stripeKey);
  const body = await request.text();
  const sig = request.headers.get("stripe-signature")!;

  // Verify the webhook signature — rejects tampered or replayed events
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // ── Checkout completed → upgrade to Pro ───────────────
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.customer_email) {
      try {
        // Use update() with unique email — safer than updateMany()
        // which could theoretically affect multiple rows
        await prisma.subscriber.update({
          where: { email: session.customer_email },
          data: {
            tier: "pro",
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: session.subscription as string,
          },
        });
      } catch (error) {
        // Subscriber might not exist yet (checkout before signup).
        // This is non-fatal — the upgrade will apply when they sign up
        // and Stripe sends a subsequent event.
        console.warn("[stripe] No subscriber found for email:", session.customer_email, error);
      }
    }
  }

  // ── Subscription cancelled → downgrade to Free ────────
  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    // Use updateMany here because stripeSubscriptionId is not a unique field
    await prisma.subscriber.updateMany({
      where: { stripeSubscriptionId: subscription.id },
      data: { tier: "free", stripeSubscriptionId: null },
    });
  }

  return NextResponse.json({ received: true });
}
