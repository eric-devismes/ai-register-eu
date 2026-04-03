/**
 * TOTP Verification API — Step 2 of 2
 *
 * POST /api/auth/verify-totp
 * Body: { password: string, code: string }
 *
 * Verifies BOTH the password (again, for security) and the 6-digit
 * TOTP code from the authenticator app. If both are valid, creates
 * a JWT session token and sets it as an HTTP-only cookie.
 *
 * The password is re-verified here to prevent someone from bypassing
 * step 1 and going directly to step 2 with just a TOTP code.
 */

import { NextResponse } from "next/server";
import {
  verifyPassword,
  verifyTOTP,
  createSession,
  setSessionCookie,
} from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { password, code } = await request.json();

    if (!password || !code) {
      return NextResponse.json(
        { error: "Password and TOTP code required" },
        { status: 400 }
      );
    }

    const passwordValid = await verifyPassword(password);
    if (!passwordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const totpValid = verifyTOTP(code);
    if (!totpValid) {
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 401 }
      );
    }

    const token = await createSession();
    await setSessionCookie(token);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
