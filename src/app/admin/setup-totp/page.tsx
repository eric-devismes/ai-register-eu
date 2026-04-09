/**
 * TOTP Setup Page — Scan QR code to set up authenticator app.
 *
 * Reads the TOTP secret from the AdminUser record in the database.
 * After scanning, the user's authenticator app generates 6-digit codes.
 *
 * Requires admin login. Only shows the current user's TOTP secret.
 */

export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getAdminSession, createTOTP } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { TotpQrCode } from "./TotpQrCode";

export default async function SetupTotpPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  // Get the admin user's TOTP secret from DB
  const admin = await prisma.adminUser.findUnique({
    where: { id: session.adminId },
    select: { totpSecret: true, totpEnabled: true, email: true },
  });

  // Fallback for legacy mode
  const secret = admin?.totpSecret || process.env.TOTP_SECRET || "";

  if (!secret) {
    return (
      <>
        <h1 className="font-heading text-2xl font-bold text-text-primary">
          Two-Factor Authentication
        </h1>
        <p className="mt-4 text-sm text-gray-500">
          No TOTP secret configured. Contact the site owner to set one up.
        </p>
      </>
    );
  }

  const totp = createTOTP(secret, admin?.email || "Admin");
  const uri = totp.toString();

  return (
    <>
      <h1 className="font-heading text-2xl font-bold text-text-primary">
        Set Up Two-Factor Authentication
      </h1>
      <p className="mt-2 text-sm text-text-secondary">
        Scan the QR code below with your authenticator app (Google
        Authenticator, Authy, or similar). Then use the 6-digit codes it
        generates when logging in.
      </p>

      {admin?.totpEnabled && (
        <div className="mt-4 rounded-lg bg-green-50 border border-green-200 p-3">
          <p className="text-sm text-green-700">
            ✓ Two-factor authentication is <strong>active</strong> on your account.
          </p>
        </div>
      )}

      <div className="mt-8 rounded-xl border border-border-light bg-white p-8">
        <div className="flex flex-col items-center gap-6">
          <TotpQrCode uri={uri} />

          <div className="text-center">
            <p className="text-xs text-text-muted">
              Can&apos;t scan? Enter this key manually:
            </p>
            <code className="mt-1 block rounded bg-surface-alt px-4 py-2 text-sm font-mono tracking-wider text-text-primary">
              {secret}
            </code>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-lg bg-amber-50 border border-amber-200 p-4">
        <p className="text-sm text-amber-800">
          <strong>Important:</strong> Save a backup of the secret key above in a
          secure location. If you lose access to your authenticator app, you will
          need this key to recover access.
        </p>
      </div>
    </>
  );
}
