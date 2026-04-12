/**
 * Telegram Webhook — Receives messages from Telegram and stores them.
 *
 * Two modes:
 *  1. POST: Telegram webhook pushes (if webhook URL is set)
 *  2. GET:  Poll-based — fetches new messages from Telegram API
 *
 * Messages are stored in the database so Claude Code sessions
 * can read them at startup.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "";

// ─── POST: Telegram webhook push ──────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = body?.message;

    if (!message?.text || String(message?.chat?.id) !== TELEGRAM_CHAT_ID) {
      return NextResponse.json({ ok: true });
    }

    // Store the message
    await prisma.telegramMessage.create({
      data: {
        telegramUpdateId: body.update_id,
        text: message.text,
        fromName: `${message.from?.first_name || ""} ${message.from?.last_name || ""}`.trim(),
        direction: "incoming",
        processedAt: null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[telegram-webhook] Error:", err);
    return NextResponse.json({ ok: true }); // Always return 200 to Telegram
  }
}

// ─── GET: Poll for new messages ───────────────────────

export async function GET(req: NextRequest) {
  // Auth check
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) {
    return NextResponse.json({ error: "Telegram not configured" }, { status: 500 });
  }

  try {
    // Get the last known update ID from DB
    const lastMsg = await prisma.telegramMessage.findFirst({
      where: { direction: "incoming" },
      orderBy: { telegramUpdateId: "desc" },
    });
    const offset = lastMsg ? lastMsg.telegramUpdateId + 1 : 0;

    // Poll Telegram
    const res = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/getUpdates?offset=${offset}&limit=20`,
      { signal: AbortSignal.timeout(10_000) }
    );
    const data = await res.json();

    const results = (data.result || []) as Array<{
      update_id: number;
      message?: { text?: string; from?: { first_name?: string; last_name?: string }; chat?: { id: number } };
    }>;

    // Filter to our chat and store
    let stored = 0;
    for (const update of results) {
      const msg = update.message;
      if (!msg?.text || String(msg.chat?.id) !== TELEGRAM_CHAT_ID) continue;

      // Check if already stored
      const exists = await prisma.telegramMessage.findFirst({
        where: { telegramUpdateId: update.update_id },
      });
      if (exists) continue;

      await prisma.telegramMessage.create({
        data: {
          telegramUpdateId: update.update_id,
          text: msg.text,
          fromName: `${msg.from?.first_name || ""} ${msg.from?.last_name || ""}`.trim(),
          direction: "incoming",
          processedAt: null,
        },
      });
      stored++;
    }

    return NextResponse.json({
      polled: results.length,
      stored,
      lastUpdateId: offset,
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
