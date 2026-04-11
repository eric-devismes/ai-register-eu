/**
 * GET /api/lemonsqueezy/portal — Get the LemonSqueezy Customer Portal URL.
 *
 * Fetches a pre-signed customer portal URL from LemonSqueezy, valid for 24 hours.
 * The portal allows subscribers to manage billing, update payment method, and cancel.
 *
 * Response: { url: string } or { error: string }
 */

import { NextResponse } from "next/server";
import { getSubscriber } from "@/lib/subscriber-auth";
import {
  lemonSqueezySetup,
  getSubscription,
} from "@lemonsqueezy/lemonsqueezy.js";

export async function GET() {
  const subscriber = await getSubscriber();
  if (!subscriber) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (subscriber.tier === "free" || !subscriber.stripeSubscriptionId) {
    return NextResponse.json(
      { error: "No active subscription" },
      { status: 400 }
    );
  }

  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Payment system not configured" },
      { status: 503 }
    );
  }

  lemonSqueezySetup({ apiKey });

  try {
    const { data, error } = await getSubscription(
      subscriber.stripeSubscriptionId
    );

    if (error) {
      console.error("[LS Portal] Error fetching subscription:", error);
      return NextResponse.json(
        { error: "Could not fetch subscription details" },
        { status: 500 }
      );
    }

    const portalUrl =
      data?.data?.attributes?.urls?.customer_portal;

    if (!portalUrl) {
      return NextResponse.json(
        { error: "Customer portal not available" },
        { status: 404 }
      );
    }

    return NextResponse.json({ url: portalUrl });
  } catch (err) {
    console.error("[LS Portal] Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}
