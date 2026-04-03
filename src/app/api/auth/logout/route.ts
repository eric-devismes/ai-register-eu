/**
 * Logout API
 *
 * POST /api/auth/logout
 *
 * Removes the session cookie, effectively logging the admin out.
 */

import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";

export async function POST() {
  await clearSessionCookie();
  return NextResponse.json({ success: true });
}
