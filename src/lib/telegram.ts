/**
 * Shared Telegram utility — single source of truth for sending messages.
 *
 * Used by: expert-panel.ts, webhook/route.ts, work-cycle.ts, daily-digest.ts, pulse.
 * Handles message chunking (Telegram 4096 char limit) and DB logging.
 */

import { prisma } from "@/lib/db";

const TOKEN = () => (process.env.TELEGRAM_BOT_TOKEN || "").trim();
const CHAT_ID = () => (process.env.TELEGRAM_CHAT_ID || "").trim();

// ─── Send a Telegram message (with chunking + DB log) ────

export async function sendTelegram(text: string): Promise<void> {
  const token = TOKEN();
  const chatId = CHAT_ID();
  if (!token || !chatId) {
    console.log("[telegram] Not configured, skipping");
    return;
  }

  // Split long messages at newline boundaries
  const chunks: string[] = [];
  let remaining = text;
  while (remaining.length > 0) {
    if (remaining.length <= 4000) {
      chunks.push(remaining);
      break;
    }
    const cut = remaining.lastIndexOf("\n", 4000);
    chunks.push(remaining.slice(0, cut > 0 ? cut : 4000));
    remaining = remaining.slice(cut > 0 ? cut : 4000);
  }

  for (const chunk of chunks) {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: chunk,
        parse_mode: "Markdown",
      }),
    });
  }

  // Log outgoing message
  try {
    await prisma.telegramMessage.create({
      data: {
        telegramUpdateId: 0,
        text: text.slice(0, 2000),
        fromName: "AI Compass EU Bot",
        direction: "outgoing",
        processedAt: new Date(),
      },
    });
  } catch {
    /* non-critical */
  }
}

// ─── Emergency bypass — sends immediately regardless of digest ────

export async function sendEmergencyTelegram(text: string): Promise<void> {
  const message = `🚨 *EMERGENCY*\n\n${text}`;
  await sendTelegram(message);
}
