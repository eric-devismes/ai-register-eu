/**
 * Telegram Bot — Two-way persistent chat with the CEO.
 *
 * Receives messages via Telegram webhook, understands context,
 * responds intelligently using Claude API. Works 24/7 whether
 * or not a Claude Code session is running.
 *
 * Capabilities:
 *  - Answer questions about the project
 *  - Add items to TODO (detects "todo:" prefix)
 *  - Report current status ("what are you working on")
 *  - Run expert panel brainstorms ("brainstorm: topic")
 *  - General strategic conversation
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { readFile } from "fs/promises";
import { join } from "path";

export const maxDuration = 60;

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "";
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY || "";

// ─── Telegram Send ────────────────────────────────────

async function sendTelegram(text: string): Promise<void> {
  // Split long messages
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
    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
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
  } catch { /* non-critical */ }
}

// ─── Build Context ────────────────────────────────────

async function buildContext(): Promise<string> {
  const parts: string[] = [];

  // Recent conversation history (last 20 messages)
  try {
    const recent = await prisma.telegramMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    if (recent.length > 0) {
      const history = recent.reverse().map((m) =>
        `[${m.direction === "incoming" ? "CEO" : "Bot"}] ${m.text.slice(0, 300)}`
      ).join("\n");
      parts.push(`RECENT CONVERSATION:\n${history}`);
    }
  } catch { /* DB might not be available */ }

  // TODO summary
  try {
    const todoPath = join(process.cwd(), "TODO.md");
    const todo = await readFile(todoPath, "utf-8");
    // Extract pending items only
    const pending = todo.split("\n")
      .filter((l) => l.match(/^- \[ \]/))
      .slice(0, 20)
      .join("\n");
    if (pending) {
      parts.push(`PENDING TODO ITEMS:\n${pending}`);
    }
  } catch { /* file might not exist in production */ }

  // Recent discussions
  try {
    const discussions = await prisma.expertDiscussion.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
      select: { topic: true, status: true, consensus: true, summary: true },
    });
    if (discussions.length > 0) {
      const disc = discussions.map((d) =>
        `• ${d.topic} — ${d.status}${d.consensus ? " (consensus)" : ""}`
      ).join("\n");
      parts.push(`RECENT BOARD DISCUSSIONS:\n${disc}`);
    }
  } catch { /* table might not exist yet */ }

  // Platform stats
  try {
    const systemCount = await prisma.aISystem.count();
    const frameworkCount = await prisma.regulatoryFramework.count();
    const subscriberCount = await prisma.subscriber.count();
    const newsCount = await prisma.changeLog.count();
    parts.push(`PLATFORM STATS: ${systemCount} AI systems, ${frameworkCount} frameworks, ${subscriberCount} subscribers, ${newsCount} news items`);
  } catch { /* */ }

  return parts.join("\n\n");
}

// ─── Claude API Call ──────────────────────────────────

async function askClaude(userMessage: string, context: string): Promise<string> {
  if (!ANTHROPIC_KEY) return "⚠️ Claude API not configured on this deployment.";

  const systemPrompt = `You are the AI assistant for AI Compass EU, a regulatory intelligence platform for European AI compliance. You are chatting with Eric Devismes, the CEO and founder, via Telegram.

YOUR ROLE:
- You are his trusted advisor and project partner
- You know the project inside out — the codebase, the TODO backlog, the advisory board, the business model
- You respond conversationally, briefly (Telegram = mobile), and directly
- You are NOT a yes-man — give honest opinions, push back when needed

CAPABILITIES:
- Answer questions about the project, strategy, features, status
- When the CEO says "todo:" or asks to add something, acknowledge it and note what should be added
- When asked "what are you working on" or similar, summarize recent activity from context
- When asked to "brainstorm" a topic, give a brief multi-perspective take (CTO, CFO, CMO angles in 2-3 sentences each)
- General strategic conversation — pricing, go-to-market, competition, tech decisions

STYLE:
- Brief — 2-5 sentences for most replies. This is Telegram, not email
- Direct — no filler, no "sure thing!", no corporate speak
- Honest — if you don't know something, say so
- Use emoji sparingly — one per message max
- Use Markdown formatting (Telegram supports bold, italic)

CONTEXT:
${context}`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 500,
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }],
      }),
      signal: AbortSignal.timeout(25_000),
    });

    if (!res.ok) {
      console.error("[telegram-bot] Claude API error:", res.status);
      return "⚠️ Couldn't process that right now. I'll pick it up in the next Claude Code session.";
    }

    const data = await res.json();
    return data?.content?.[0]?.text || "No response generated.";
  } catch (err) {
    console.error("[telegram-bot] Claude call failed:", err);
    return "⚠️ Response timed out. I'll address this in the next session.";
  }
}

// ─── POST: Telegram webhook ──────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = body?.message;

    // Ignore non-text or wrong chat
    if (!message?.text || String(message?.chat?.id) !== TELEGRAM_CHAT_ID) {
      return NextResponse.json({ ok: true });
    }

    const text = message.text.trim();
    const fromName = `${message.from?.first_name || ""} ${message.from?.last_name || ""}`.trim();

    // Store incoming message
    try {
      await prisma.telegramMessage.create({
        data: {
          telegramUpdateId: body.update_id,
          text,
          fromName,
          direction: "incoming",
          processedAt: null,
        },
      });
    } catch {
      // Might be duplicate update_id — continue anyway
    }

    // Build context and respond
    const context = await buildContext();
    const response = await askClaude(text, context);

    // Send response
    await sendTelegram(response);

    // Mark as processed
    try {
      await prisma.telegramMessage.updateMany({
        where: { telegramUpdateId: body.update_id },
        data: { processedAt: new Date() },
      });
    } catch { /* non-critical */ }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[telegram-bot] Webhook error:", err);
    return NextResponse.json({ ok: true }); // Always 200 for Telegram
  }
}

// ─── GET: Health check / manual poll ──────────────────

export async function GET() {
  const webhookInfo = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_TOKEN}/getWebhookInfo`
  ).then((r) => r.json()).catch(() => null);

  const unprocessed = await prisma.telegramMessage.count({
    where: { direction: "incoming", processedAt: null },
  }).catch(() => 0);

  return NextResponse.json({
    status: "ok",
    webhook: webhookInfo?.result?.url || "not set",
    unprocessedMessages: unprocessed,
  });
}
