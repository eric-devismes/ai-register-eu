"use client";

/**
 * TotpQrCode — Client component that renders a QR code image.
 *
 * Uses the `qrcode` library to generate a data URL from the
 * otpauth:// URI, then displays it as an <img> tag.
 * This runs on the client because qrcode needs canvas/DOM access.
 */

import { useEffect, useState } from "react";
import QRCode from "qrcode";

export function TotpQrCode({ uri }: { uri: string }) {
  const [dataUrl, setDataUrl] = useState<string>("");

  useEffect(() => {
    QRCode.toDataURL(uri, { width: 256, margin: 2 }).then(setDataUrl);
  }, [uri]);

  if (!dataUrl) {
    return (
      <div className="h-64 w-64 animate-pulse rounded-lg bg-surface-alt" />
    );
  }

  return (
    <img
      src={dataUrl}
      alt="Scan this QR code with your authenticator app"
      className="h-64 w-64"
    />
  );
}
