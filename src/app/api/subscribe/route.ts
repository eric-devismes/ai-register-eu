/**
 * POST /api/subscribe — Create or re-authenticate a subscriber.
 *
 * If email is new: creates unverified subscriber + sends magic link.
 * If email exists: sends a new magic link (works like "sign in").
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateMagicToken } from "@/lib/subscriber-auth";
import { sendMagicLink } from "@/lib/email";

const CONSENT_TEXT = "I agree to receive email updates about selected AI compliance topics from AI Compass EU. I can unsubscribe or delete my account at any time.";

export async function POST(request: Request) {
  try {
    const { email, consent } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    // Check if subscriber already exists
    let subscriber = await prisma.subscriber.findUnique({ where: { email } });

    if (!subscriber) {
      // New subscriber: require consent
      if (!consent) {
        return NextResponse.json({ error: "Consent required" }, { status: 400 });
      }

      subscriber = await prisma.subscriber.create({
        data: {
          email,
          consentDate: new Date(),
          consentText: CONSENT_TEXT,
        },
      });
    }

    // Generate and send magic link
    const token = await generateMagicToken(subscriber.id);
    await sendMagicLink(email, token);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
