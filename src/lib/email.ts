/**
 * Email Service — Sends magic links and digest emails via Resend.
 *
 * Requires RESEND_API_KEY in .env.local.
 * Free tier: 3,000 emails/month.
 *
 * In development without a key, emails are logged to console instead.
 */

import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = process.env.FROM_EMAIL || "AI Compass EU <noreply@aicompass.eu>";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

// ─── Magic Link Email ────────────────────────────────────

export async function sendMagicLink(email: string, token: string) {
  const link = `${BASE_URL}/subscribe/verify?email=${encodeURIComponent(email)}&token=${token}`;

  const subject = "Sign in to AI Compass EU";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: #003399; font-size: 24px; margin: 0;">AI Compass EU</h1>
        <p style="color: #666; font-size: 14px;">AI Intelligence for European Decision-Makers</p>
      </div>
      <p style="font-size: 16px; color: #333;">Click the button below to sign in to your account:</p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${link}" style="background-color: #003399; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block;">
          Sign in to AI Compass EU
        </a>
      </div>
      <p style="font-size: 13px; color: #999;">This link expires in 15 minutes. If you didn't request this, you can safely ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
      <p style="font-size: 11px; color: #aaa; text-align: center;">
        AI Compass EU &mdash; Independent AI compliance intelligence for Europe.<br/>
        You received this because someone entered your email on our site.
      </p>
    </div>
  `;

  if (resend) {
    await resend.emails.send({ from: FROM_EMAIL, to: email, subject, html });
  } else {
    // Development fallback: log to console
    console.log("\n📧 MAGIC LINK EMAIL (dev mode - no Resend key)");
    console.log(`   To: ${email}`);
    console.log(`   Link: ${link}\n`);
  }
}

// ─── Digest Email ────────────────────────────────────────

interface DigestItem {
  title: string;
  description: string;
  changeType: string;
  sourceUrl: string;
  date: Date;
  relatedName: string; // Framework or system name
}

export async function sendDigest(email: string, subscriberId: string, items: DigestItem[]) {
  const unsubscribeLink = `${BASE_URL}/api/subscribe/unsubscribe?id=${subscriberId}`;

  const itemsHtml = items.map((item) => `
    <div style="padding: 16px 0; border-bottom: 1px solid #eee;">
      <p style="font-size: 12px; color: #999; margin: 0;">
        ${item.date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
        &middot; ${item.relatedName}
      </p>
      <p style="font-size: 15px; color: #333; margin: 8px 0 4px; font-weight: 600;">${item.title}</p>
      <p style="font-size: 14px; color: #666; margin: 0;">${item.description}</p>
      ${item.sourceUrl ? `<a href="${item.sourceUrl}" style="font-size: 12px; color: #003399;">View source &rarr;</a>` : ""}
    </div>
  `).join("");

  const subject = `AI Compass EU Digest — ${items.length} update${items.length !== 1 ? "s" : ""} on your topics`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #003399; font-size: 22px; margin: 0;">Your AI Compliance Digest</h1>
        <p style="color: #666; font-size: 13px;">${items.length} update${items.length !== 1 ? "s" : ""} on topics you follow</p>
      </div>
      ${itemsHtml}
      <div style="margin-top: 24px; text-align: center;">
        <a href="${BASE_URL}/account" style="background-color: #003399; color: white; padding: 10px 24px; text-decoration: none; border-radius: 6px; font-size: 14px; display: inline-block;">
          Manage Preferences
        </a>
      </div>
      <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
      <p style="font-size: 11px; color: #aaa; text-align: center;">
        <a href="${unsubscribeLink}" style="color: #aaa;">Unsubscribe from digests</a>
        &middot; <a href="${BASE_URL}/account" style="color: #aaa;">Manage account</a><br/>
        AI Compass EU &mdash; AI Intelligence for European Decision-Makers
      </p>
    </div>
  `;

  const headers = { "List-Unsubscribe": `<${unsubscribeLink}>` };

  if (resend) {
    await resend.emails.send({ from: FROM_EMAIL, to: email, subject, html, headers });
  } else {
    console.log(`\n📧 DIGEST EMAIL (dev mode)\n   To: ${email}\n   Items: ${items.length}\n`);
  }
}
