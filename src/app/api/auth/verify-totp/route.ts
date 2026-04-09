/**
 * TOTP Verification API — Step 2 of 2
 *
 * POST /api/auth/verify-totp
 * Body: { password: string, code: string, email?: string, adminId?: string }
 *
 * Re-verifies password + validates TOTP code, then creates session.
 */

import { NextResponse } from "next/server";
import {
  authenticateAdmin,
  verifyTOTP,
  createSession,
  setSessionCookie,
} from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { password, code, email, adminId } = await request.json();

    if (!password || !code) {
      return NextResponse.json({ error: "Password and TOTP code required" }, { status: 400 });
    }

    // Re-authenticate
    const admin = await authenticateAdmin(email || "admin@aicompass.eu", password);
    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Verify TOTP
    if (!admin.totpSecret) {
      return NextResponse.json({ error: "TOTP not configured" }, { status: 400 });
    }

    const totpValid = verifyTOTP(code, admin.totpSecret);
    if (!totpValid) {
      return NextResponse.json({ error: "Invalid verification code" }, { status: 401 });
    }

    // Create session
    const token = await createSession({
      id: admin.id,
      email: admin.email,
      name: admin.name || "Admin",
      role: admin.role,
    });
    await setSessionCookie(token);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
