/**
 * TOTP Setup Page
 *
 * One-time setup page to configure your authenticator app.
 * Shows the TOTP secret and a QR code that you scan with
 * Google Authenticator, Authy, or similar apps.
 *
 * This page is only useful during initial setup.
 * After scanning, the TOTP code is saved in your authenticator app.
 */

import { getTOTP } from "@/lib/auth";
import { TotpQrCode } from "./TotpQrCode";

export default function SetupTotpPage() {
  const totp = getTOTP();
  const uri = totp.toString(); // otpauth:// URI for QR code

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

      <div className="mt-8 rounded-xl border border-border-light bg-white p-8">
        <div className="flex flex-col items-center gap-6">
          {/* QR code rendered client-side */}
          <TotpQrCode uri={uri} />

          {/* Manual entry fallback */}
          <div className="text-center">
            <p className="text-xs text-text-muted">
              Can&apos;t scan? Enter this key manually:
            </p>
            <code className="mt-1 block rounded bg-surface-alt px-4 py-2 text-sm font-mono tracking-wider text-text-primary">
              {process.env.TOTP_SECRET}
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
