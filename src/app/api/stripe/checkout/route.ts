/**
 * POST /api/stripe/checkout — Create a Stripe checkout session.
 *
 * Called when a user clicks "Subscribe" on the pricing page.
 * Creates a Stripe checkout session and returns the URL to redirect to.
 *
 * Body: { priceId?: string, email?: string, locale?: string }
 * Response: { url: string }
 *
 * The locale parameter ensures users are redirected back to their
 * language-specific success/cancel page after checkout.
 */

import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const stripe = new Stripe(stripeKey);
  const { priceId, email, locale } = await request.json();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  // Use the user's locale for redirect URLs, default to "en"
  const lang = locale || "en";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: email || undefined,
      line_items: [{ price: priceId || process.env.STRIPE_PRO_PRICE_ID, quantity: 1 }],
      success_url: `${baseUrl}/${lang}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/${lang}/pricing/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[stripe] Checkout session creation failed:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
