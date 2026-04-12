/**
 * POST /api/lemonsqueezy/checkout — Create a LemonSqueezy checkout URL.
 *
 * Called when a user clicks "Subscribe" on the pricing page.
 * Uses the LemonSqueezy SDK to create a checkout and returns the URL.
 *
 * Body: { email?: string, locale?: string, subscriberId?: string }
 * Response: { url: string }
 *
 * Environment variables required:
 *   LEMONSQUEEZY_API_KEY    — API key from LemonSqueezy dashboard
 *   LEMONSQUEEZY_STORE_ID   — Your store ID
 *   LEMONSQUEEZY_VARIANT_ID — Product variant ID for the Pro plan
 */

import { NextResponse } from "next/server";
import {
  lemonSqueezySetup,
  createCheckout,
} from "@lemonsqueezy/lemonsqueezy.js";

export async function POST(request: Request) {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  const storeId = process.env.LEMONSQUEEZY_STORE_ID;
  const variantId = process.env.LEMONSQUEEZY_VARIANT_ID;

  if (!apiKey || !storeId || !variantId) {
    return NextResponse.json(
      { error: "Payment system not configured" },
      { status: 503 }
    );
  }

  lemonSqueezySetup({ apiKey });

  const { email, locale, subscriberId } = await request.json();
  let baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000").trim();
  if (!baseUrl.startsWith("http")) baseUrl = `https://${baseUrl}`;
  const lang = locale || "en";

  try {
    const checkout = await createCheckout(storeId, variantId, {
      checkoutData: {
        email: email || undefined,
        ...(subscriberId ? { custom: { subscriber_id: subscriberId } } : {}),
      },
      productOptions: {
        redirectUrl: `${baseUrl}/${lang}/pricing/success`,
        receiptButtonText: "Go to Dashboard",
        receiptLinkUrl: `${baseUrl}/${lang}/dashboard`,
      },
      checkoutOptions: {
        embed: false,
        media: true,
        buttonColor: "#003399",
      },
    });

    if (checkout.error) {
      console.error("[lemonsqueezy] API error:", JSON.stringify(checkout.error));
      return NextResponse.json(
        { error: "LemonSqueezy API error", detail: checkout.error },
        { status: 500 }
      );
    }

    const url = checkout.data?.data.attributes.url;
    if (!url) {
      return NextResponse.json(
        { error: "No checkout URL returned", raw: JSON.stringify(checkout.data).slice(0, 500) },
        { status: 500 }
      );
    }

    return NextResponse.json({ url });
  } catch (error) {
    console.error("[lemonsqueezy] Checkout creation failed:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Failed to create checkout", detail: message },
      { status: 500 }
    );
  }
}
