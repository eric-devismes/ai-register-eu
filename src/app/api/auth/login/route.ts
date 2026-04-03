/**
 * Login API — Step 1 of 2
 *
 * POST /api/auth/login
 * Body: { password: string }
 *
 * Verifies the admin password. If correct, tells the client
 * to proceed to TOTP verification (step 2).
 * Does NOT create a session — that happens after TOTP is verified.
 */

import { NextResponse } from "next/server";
import { verifyPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: "Password required" },
        { status: 400 }
      );
    }

    const valid = await verifyPassword(password);

    if (!valid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true, step: "totp" });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
