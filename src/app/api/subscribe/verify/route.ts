/**
 * GET /api/subscribe/verify?email=...&token=...
 *
 * Verifies a magic link token, creates a session, and redirects to /account.
 */

import { NextResponse } from "next/server";
import { verifyMagicToken, createSubscriberSession } from "@/lib/subscriber-auth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");
  const token = url.searchParams.get("token");

  if (!email || !token) {
    return NextResponse.redirect(new URL("/subscribe?error=invalid", request.url));
  }

  const subscriber = await verifyMagicToken(email, token);

  if (!subscriber) {
    return NextResponse.redirect(new URL("/subscribe?error=expired", request.url));
  }

  // Create session (sets cookie)
  await createSubscriberSession(subscriber.id);

  // Redirect to account page
  return NextResponse.redirect(new URL("/account", request.url));
}
