/**
 * Login API — Step 1 of 2
 *
 * POST /api/auth/login
 * Body: { email: string, password: string }
 *
 * Verifies admin credentials against the AdminUser table (or legacy env vars).
 * If correct and TOTP is enabled, tells the client to proceed to step 2.
 * If TOTP is not enabled, creates session immediately.
 */

import { NextResponse } from "next/server";
import { authenticateAdmin, createSession, setSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!password) {
      return NextResponse.json({ error: "Password required" }, { status: 400 });
    }

    // Authenticate against DB or legacy env vars
    // For legacy mode (no email field), use a placeholder email
    const admin = await authenticateAdmin(email || "admin@vendorscope.eu", password);

    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // If TOTP is enabled, require step 2
    if (admin.totpEnabled && admin.totpSecret) {
      return NextResponse.json({
        success: true,
        step: "totp",
        adminId: admin.id,
      });
    }

    // No TOTP — create session directly
    const token = await createSession({
      id: admin.id,
      email: admin.email,
      name: admin.name || "Admin",
      role: admin.role,
    });
    await setSessionCookie(token);

    return NextResponse.json({ success: true, step: "done" });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
