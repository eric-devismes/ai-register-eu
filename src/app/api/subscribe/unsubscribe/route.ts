/**
 * GET /api/subscribe/unsubscribe?id=...
 *
 * One-click unsubscribe from digest emails (RFC 8058 compliant).
 * Disables digest but keeps the account.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    await prisma.subscriber.update({
      where: { id },
      data: { digestEnabled: false },
    });
  } catch {
    // Subscriber may already be deleted — that's fine
  }

  return NextResponse.redirect(new URL("/subscribe/unsubscribed", request.url));
}
