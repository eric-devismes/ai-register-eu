/**
 * Expert Panel Orchestrator
 *
 * Manages expert discussions and Telegram communication.
 *
 * Two modes:
 * 1. USER ASKS: Route to most competent expert. If another expert has concerns, they chime in.
 * 2. AGENTS RAISE: Experts hold a "meeting" offline, then send ONE consolidated message.
 *
 * Usage:
 *   npx tsx agents/orchestrator.ts ask "Should we switch from Stripe to LemonSqueezy?"
 *   npx tsx agents/orchestrator.ts meeting "Evaluate our current security posture"
 *   npx tsx agents/orchestrator.ts listen   # Poll Telegram for user messages
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { experts, findRelevantExperts, type ExpertProfile } from "./expert-profiles";

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID!;

// ─── Telegram helpers ───────────────────────────────────────

async function sendTelegram(message: string): Promise<void> {
  // Split long messages (Telegram limit: 4096 chars)
  const chunks: string[] = [];
  let remaining = message;
  while (remaining.length > 0) {
    if (remaining.length <= 4000) {
      chunks.push(remaining);
      break;
    }
    // Find last newline before 4000
    const cutoff = remaining.lastIndexOf("\n", 4000);
    const split = cutoff > 0 ? cutoff : 4000;
    chunks.push(remaining.slice(0, split));
    remaining = remaining.slice(split);
  }

  for (const chunk of chunks) {
    await fetch(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: chunk,
          parse_mode: "Markdown",
        }),
      }
    );
  }
}

async function getNewTelegramMessages(lastUpdateId = 0): Promise<
  Array<{ updateId: number; text: string }>
> {
  const res = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_TOKEN}/getUpdates?offset=${lastUpdateId + 1}`
  );
  const data = (await res.json()) as {
    result: Array<{
      update_id: number;
      message?: { text?: string; chat?: { id: number } };
    }>;
  };

  return (data.result || [])
    .filter(
      (u) =>
        u.message?.text &&
        String(u.message.chat?.id) === TELEGRAM_CHAT_ID
    )
    .map((u) => ({
      updateId: u.update_id,
      text: u.message!.text!,
    }));
}

// ─── Expert consultation (simulated via structured prompts) ──

/**
 * Generate an expert's perspective on a topic.
 * In production, this would call the Claude API. For now, we generate
 * structured prompts that can be fed to Claude.
 */
function generateExpertPrompt(
  expert: ExpertProfile,
  topic: string,
  context?: string
): string {
  return `${expert.systemPrompt}

---

TOPIC FOR YOUR ASSESSMENT:
${topic}

${context ? `ADDITIONAL CONTEXT:\n${context}\n` : ""}
Provide your perspective in 2-4 sentences. Be direct and actionable. If you see a risk or opportunity others might miss, flag it. If you agree with the general direction, say so briefly and add your domain-specific consideration.

Format: Start with your key point, then supporting reasoning.`;
}

/**
 * Format a meeting summary for Telegram.
 */
function formatMeetingSummary(
  topic: string,
  perspectives: Array<{ expert: ExpertProfile; response: string }>,
  hasDisagreement: boolean
): string {
  let msg = `🏛️ *Advisory Board — Meeting Summary*\n\n`;
  msg += `📋 *Topic:* ${topic}\n\n`;

  for (const { expert, response } of perspectives) {
    msg += `${expert.emoji} *${expert.shortName}:* ${response}\n\n`;
  }

  if (hasDisagreement) {
    msg += `⚠️ *Disagreement detected* — your decision needed as CEO.\n`;
  } else {
    msg += `✅ *Consensus reached* — advisors are aligned.\n`;
  }

  msg += `\n_Reply with a question to drill deeper, or "approve" to proceed._`;

  return msg;
}

/**
 * Format a direct expert response for Telegram.
 */
function formatDirectResponse(
  expert: ExpertProfile,
  question: string,
  response: string,
  dissent?: { expert: ExpertProfile; concern: string }
): string {
  let msg = `${expert.emoji} *${expert.shortName} responds:*\n\n`;
  msg += `_Q: ${question}_\n\n`;
  msg += response;

  if (dissent) {
    msg += `\n\n${dissent.expert.emoji} *${dissent.expert.shortName} flags:* ${dissent.concern}`;
  }

  return msg;
}

// ─── CLI interface ──────────────────────────────────────────

async function main() {
  const [, , command, ...args] = process.argv;
  const topic = args.join(" ");

  switch (command) {
    case "ask": {
      if (!topic) {
        console.error("Usage: orchestrator.ts ask <question>");
        process.exit(1);
      }

      const relevant = findRelevantExperts(topic, 1, 3);
      const lead = relevant[0];

      console.log(`\nRouting to: ${lead.emoji} ${lead.title}`);
      console.log(`Topic: ${topic}\n`);

      // Generate the lead expert's prompt
      const prompt = generateExpertPrompt(lead, topic);
      console.log("--- Lead Expert Prompt ---");
      console.log(prompt);
      console.log("--- End ---\n");

      // Check if other experts might dissent
      if (relevant.length > 1) {
        console.log("Other relevant experts who may weigh in:");
        for (const ex of relevant.slice(1)) {
          console.log(`  ${ex.emoji} ${ex.shortName} — ${ex.domain}`);
        }
      }

      // Send notification to Telegram
      await sendTelegram(
        `🤖 *Expert Panel — Question Received*\n\n` +
          `_"${topic}"_\n\n` +
          `Routing to ${lead.emoji} *${lead.shortName}* (${lead.domain}).\n` +
          (relevant.length > 1
            ? `${relevant
                .slice(1)
                .map((e) => `${e.emoji} ${e.shortName}`)
                .join(", ")} may also weigh in.`
            : "")
      );

      break;
    }

    case "meeting": {
      if (!topic) {
        console.error("Usage: orchestrator.ts meeting <topic>");
        process.exit(1);
      }

      const relevant = findRelevantExperts(topic, 2, 5);

      console.log(`\nConvening meeting on: ${topic}`);
      console.log(`Participants: ${relevant.map((e) => `${e.emoji} ${e.shortName}`).join(", ")}\n`);

      // Generate prompts for each expert
      for (const expert of relevant) {
        const prompt = generateExpertPrompt(expert, topic);
        console.log(`--- ${expert.shortName} Prompt ---`);
        console.log(prompt);
        console.log("--- End ---\n");
      }

      // Send meeting notification to Telegram
      await sendTelegram(
        `🏛️ *Advisory Board — Meeting Convened*\n\n` +
          `📋 *Topic:* ${topic}\n\n` +
          `👥 *Participants:*\n${relevant.map((e) => `${e.emoji} ${e.shortName} — ${e.domain}`).join("\n")}\n\n` +
          `_Meeting in progress... summary will follow._`
      );

      break;
    }

    case "listen": {
      console.log("Listening for Telegram messages...");

      let lastUpdateId = 0;

      // Get current offset
      const initial = await getNewTelegramMessages(0);
      if (initial.length > 0) {
        lastUpdateId = Math.max(...initial.map((m) => m.updateId));
      }

      console.log(`Starting from update ID: ${lastUpdateId}`);
      console.log("Waiting for new messages...\n");

      // Poll every 5 seconds
      const poll = async () => {
        const messages = await getNewTelegramMessages(lastUpdateId);
        for (const msg of messages) {
          console.log(`\n📨 New message: "${msg.text}"`);
          lastUpdateId = msg.updateId;

          // Route to appropriate expert
          const relevant = findRelevantExperts(msg.text, 1, 3);
          const lead = relevant[0];
          console.log(`  → Routing to ${lead.emoji} ${lead.shortName}`);

          // Generate prompt
          const prompt = generateExpertPrompt(lead, msg.text);
          console.log(`  → Prompt generated for ${lead.shortName}`);

          // Acknowledge in Telegram
          await sendTelegram(
            `${lead.emoji} *${lead.shortName}* is reviewing your question...\n_"${msg.text}"_`
          );
        }
      };

      // Run poll loop
      setInterval(poll, 5000);
      // Keep process alive
      await new Promise(() => {});
      break;
    }

    case "roster": {
      console.log("\n🏛️ Advisory Board Roster\n");
      for (const expert of experts) {
        console.log(
          `  ${expert.emoji} ${expert.shortName.padEnd(14)} ${expert.domain}`
        );
        console.log(
          `     ${expert.expertise.slice(0, 3).join(", ")}`
        );
      }

      await sendTelegram(
        `🏛️ *Advisory Board — Roster*\n\n` +
          experts
            .map((e) => `${e.emoji} *${e.shortName}* — ${e.domain}`)
            .join("\n")
      );

      break;
    }

    default:
      console.log(`
Expert Panel Orchestrator

Commands:
  ask <question>     Route a question to the most competent expert
  meeting <topic>    Convene a meeting with relevant experts
  listen             Poll Telegram for user messages and route them
  roster             Show the full advisory board roster
      `);
  }
}

main().catch(console.error);
