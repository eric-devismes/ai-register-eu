/**
 * Expert Panel Discussion Engine
 *
 * Orchestrates multi-expert discussions using Claude:
 *  1. Identify relevant experts for the topic
 *  2. Round 1: Each expert gives their initial take
 *  3. Round 2: Experts respond to each other (rebuttals)
 *  4. Detect consensus or disagreement
 *  5. Generate summary and send to Telegram for CEO decision
 *
 * All discussions are persisted to the database for audit trail.
 */

import { prisma } from "@/lib/db";
import { LLM_TIMEOUT_MS } from "@/lib/constants";

// ─── Expert Profiles (inline — avoids TS path issues with agents/) ──

interface ExpertProfile {
  id: string;
  shortName: string;
  emoji: string;
  domain: string;
  systemPrompt: string;
  triggers: string[];
}

const EXPERTS: ExpertProfile[] = [
  {
    id: "cto",
    shortName: "CTO",
    emoji: "🔧",
    domain: "Technology & Architecture",
    triggers: ["tech", "architecture", "platform", "framework", "api", "integration", "scalability", "performance", "database", "infrastructure", "deployment", "stack", "code", "build", "migrate"],
    systemPrompt: "You are the CTO. You think in systems, architectures, and technical tradeoffs. You prefer proven tech, care about DX and maintainability, and push back on over-engineering. When you disagree, state why with technical reasoning.",
  },
  {
    id: "ciso",
    shortName: "CISO",
    emoji: "🛡️",
    domain: "Security",
    triggers: ["security", "auth", "password", "encryption", "vulnerability", "attack", "breach", "access", "token", "api key", "secret", "cert", "ssl", "tls", "sso", "mfa"],
    systemPrompt: "You are the CISO. You think in threats and attack surfaces. You find secure ways to say yes but are non-negotiable on secrets, auth, encryption, and third-party security reviews.",
  },
  {
    id: "dpo",
    shortName: "DPO",
    emoji: "🔒",
    domain: "Data & Privacy",
    triggers: ["gdpr", "privacy", "data", "consent", "retention", "personal data", "dora", "transfer", "dpa", "dpia", "cookie", "tracking", "subprocessor", "data residency", "regulation"],
    systemPrompt: "You are the DPO. You think in data flows, legal bases, and data subject rights. You know GDPR, DORA, ePrivacy, and the EU AI Act. You push for privacy by design, not privacy as an afterthought.",
  },
  {
    id: "cro",
    shortName: "Risk",
    emoji: "⚖️",
    domain: "Risk & Compliance",
    triggers: ["risk", "compliance", "audit", "iso", "soc", "nist", "control", "framework", "certification", "third-party", "vendor risk", "due diligence", "governance"],
    systemPrompt: "You are the CRO. You map risks to controls and controls to evidence. You assess likelihood and impact, then recommend proportional controls. You keep a risk register in your head.",
  },
  {
    id: "vp-ops",
    shortName: "Ops",
    emoji: "⚙️",
    domain: "Operations & SRE",
    triggers: ["ops", "operations", "incident", "outage", "monitoring", "uptime", "sla", "deploy", "ci/cd", "pipeline", "release", "rollback", "capacity"],
    systemPrompt: "You are VP of Operations. You keep the platform running. You think in SLOs, error budgets, and MTTR. You flag when features will be hard to operate, monitor, or debug in production.",
  },
  {
    id: "cpo",
    shortName: "Procurement",
    emoji: "📋",
    domain: "Procurement & Vendor",
    triggers: ["vendor", "procurement", "contract", "license", "pricing", "cost", "sla", "negotiat", "renew", "subscription", "payment", "buy", "purchase"],
    systemPrompt: "You are the CPO. You negotiate deals and optimize costs. You think in TCO, not sticker price. You've seen every vendor trick: introductory pricing, usage traps, auto-renewal clauses, data hostage exit terms.",
  },
  {
    id: "chro",
    shortName: "HR",
    emoji: "👥",
    domain: "HR & Org Change",
    triggers: ["team", "hire", "skill", "training", "adoption", "change", "onboard", "culture", "workforce", "people", "talent"],
    systemPrompt: "You are the CHRO. You think about the human side of technology decisions. Every tool and process change affects people. You measure success by adoption rates, not rollout dates.",
  },
  {
    id: "cfo",
    shortName: "CFO",
    emoji: "💰",
    domain: "Finance",
    triggers: ["cost", "budget", "price", "revenue", "profit", "expense", "financial", "roi", "tco", "capex", "opex", "subscription", "billing", "payment", "monetiz", "freemium"],
    systemPrompt: "You are the CFO. Every decision has a financial impact and you quantify it. You think in unit economics, burn rate, and runway. You present numbers, not opinions.",
  },
  {
    id: "legal",
    shortName: "Legal",
    emoji: "⚖️",
    domain: "Legal",
    triggers: ["legal", "contract", "liability", "ip", "copyright", "license", "open-source", "terms", "privacy policy", "disclaimer", "indemnit", "regulation", "law"],
    systemPrompt: "You are General Counsel. You protect the company from legal risk while enabling the business to move fast. You speak plain language, not legalese.",
  },
  {
    id: "pmo",
    shortName: "PMO",
    emoji: "📊",
    domain: "Project Delivery",
    triggers: ["project", "milestone", "deadline", "timeline", "plan", "schedule", "resource", "dependency", "backlog", "sprint", "priority", "roadmap"],
    systemPrompt: "You are the PMO Lead. You keep the trains running. You think in milestones, dependencies, and critical paths. You flag scope creep and unrealistic timelines.",
  },
  {
    id: "coo",
    shortName: "Business",
    emoji: "🎯",
    domain: "Business & Product",
    triggers: ["business", "customer", "user", "feature", "requirement", "roi", "market", "competitor", "value", "product", "pricing", "enterprise", "growth"],
    systemPrompt: "You are the COO / Product Owner. You represent the customer and the business. You validate business cases and push for measurable outcomes. Ship, measure, iterate.",
  },
  {
    id: "cmo",
    shortName: "CMO",
    emoji: "📈",
    domain: "Marketing",
    triggers: ["marketing", "brand", "seo", "content", "campaign", "lead gen", "funnel", "awareness", "positioning", "messaging", "blog", "newsletter", "email", "launch", "press", "pr", "thought leadership", "inbound"],
    systemPrompt: "You are the CMO with 20+ years in B2B SaaS marketing. You think in positioning, messaging, and distribution. Trust is the currency in B2B. Content must educate, not sell. You're allergic to 'build it and they will come' thinking.",
  },
  {
    id: "vp-sales",
    shortName: "VP Sales",
    emoji: "💼",
    domain: "Sales & Pipeline",
    triggers: ["sales", "pipeline", "deal", "prospect", "customer", "conversion", "churn", "revenue", "pricing", "upsell", "demo", "trial", "onboard", "enterprise", "account", "quota", "close"],
    systemPrompt: "You are the VP of Sales with 20+ years selling enterprise SaaS to European companies. You think in pipeline, conversion rates, and deal velocity. You know enterprise buyers are skeptical, slow, and risk-averse. You're direct about what sells and what doesn't.",
  },
  {
    id: "social-lead",
    shortName: "Social",
    emoji: "📱",
    domain: "Social & Community",
    triggers: ["social", "twitter", "linkedin", "community", "audience", "followers", "engagement", "influencer", "viral", "post", "share", "distribution", "youtube", "podcast", "webinar"],
    systemPrompt: "You are the Social & Community Lead with 20+ years building B2B audiences. LinkedIn is king for EU regulatory tech. You know organic social is slow but compounds. The founder's personal brand matters more than the company page.",
  },
];

// ─── Expert Selection ──────────────────────────────────

function findRelevantExperts(topic: string, min = 3, max = 5): ExpertProfile[] {
  const lower = topic.toLowerCase();
  const scored = EXPERTS.map((e) => ({
    expert: e,
    matches: e.triggers.filter((t) => lower.includes(t)).length,
  }));
  scored.sort((a, b) => b.matches - a.matches);

  const relevant = scored.filter((s) => s.matches > 0).slice(0, max).map((s) => s.expert);

  // Always have at least `min` experts
  if (relevant.length < min) {
    const defaults = ["cto", "cfo", "coo"];
    for (const id of defaults) {
      if (relevant.length >= min) break;
      const e = EXPERTS.find((ex) => ex.id === id);
      if (e && !relevant.includes(e)) relevant.push(e);
    }
  }

  return relevant;
}

// ─── Claude API Call ───────────────────────────────────

async function callClaude(system: string, userMsg: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) return "[No ANTHROPIC_API_KEY — dev mode]";

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      system,
      messages: [{ role: "user", content: userMsg }],
    }),
    signal: AbortSignal.timeout(LLM_TIMEOUT_MS),
  });

  if (!res.ok) throw new Error(`Claude API ${res.status}`);
  const data = await res.json();
  return data?.content?.[0]?.text || "";
}

// ─── Telegram ──────────────────────────────────────────

async function sendTelegram(message: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.log("[expert-panel] Telegram not configured, skipping notification");
    return;
  }

  // Split long messages (Telegram limit: 4096 chars)
  const chunks: string[] = [];
  let remaining = message;
  while (remaining.length > 0) {
    if (remaining.length <= 4000) {
      chunks.push(remaining);
      break;
    }
    const cutoff = remaining.lastIndexOf("\n", 4000);
    chunks.push(remaining.slice(0, cutoff > 0 ? cutoff : 4000));
    remaining = remaining.slice(cutoff > 0 ? cutoff : 4000);
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
}

// ─── Discussion Engine ─────────────────────────────────

export interface DiscussionResult {
  discussionId: string;
  topic: string;
  experts: string[];
  consensus: boolean;
  summary: string;
  responses: Array<{
    expertId: string;
    expertName: string;
    emoji: string;
    round: number;
    response: string;
    position: string;
  }>;
}

export async function runExpertDiscussion(
  topic: string,
  context?: string
): Promise<DiscussionResult> {
  // 1. Create discussion record
  const discussion = await prisma.expertDiscussion.create({
    data: { topic, context: context || "", status: "in_progress" },
  });

  // 2. Find relevant experts
  const relevant = findRelevantExperts(topic);
  console.log(`[expert-panel] Discussion "${topic}" — ${relevant.map((e) => e.shortName).join(", ")}`);

  // 3. Round 1: Initial takes (parallel)
  const round1Promises = relevant.map(async (expert) => {
    const system = `${expert.systemPrompt}

You are in a board meeting for AI Compass EU, a regulatory intelligence platform. The CEO has raised a topic for discussion. Give your perspective in 2-4 sentences. Be direct, be honest, have a point of view. If you see a risk or opportunity others might miss, flag it.

End your response with one of these tags on a new line:
[AGREE] — you support the direction
[CONCERN] — you have reservations but could be convinced
[DISAGREE] — you think this is wrong or risky`;

    const userMsg = `TOPIC: ${topic}${context ? `\n\nCONTEXT: ${context}` : ""}

Give your ${expert.domain} perspective. Be specific and actionable.`;

    try {
      const response = await callClaude(system, userMsg);
      const position = response.includes("[DISAGREE]")
        ? "disagree"
        : response.includes("[CONCERN]")
          ? "concern"
          : response.includes("[AGREE]")
            ? "agree"
            : "neutral";

      // Strip the position tag from the response text
      const cleanResponse = response
        .replace(/\[AGREE\]/g, "")
        .replace(/\[CONCERN\]/g, "")
        .replace(/\[DISAGREE\]/g, "")
        .trim();

      return { expert, response: cleanResponse, position };
    } catch (err) {
      console.warn(`[expert-panel] ${expert.shortName} failed:`, (err as Error).message);
      return { expert, response: `[Error: ${(err as Error).message}]`, position: "neutral" };
    }
  });

  const round1Results = await Promise.all(round1Promises);

  // Save Round 1 to DB
  for (const r of round1Results) {
    await prisma.expertResponse.create({
      data: {
        discussionId: discussion.id,
        expertId: r.expert.id,
        expertName: r.expert.shortName,
        emoji: r.expert.emoji,
        round: 1,
        response: r.response,
        position: r.position,
      },
    });
  }

  // 4. Detect disagreement
  const hasDisagreement = round1Results.some((r) => r.position === "disagree" || r.position === "concern");

  // 5. Round 2: Rebuttals (only if there's disagreement)
  const round2Results: typeof round1Results = [];

  if (hasDisagreement) {
    // Build context from Round 1 for rebuttals
    const round1Summary = round1Results
      .map((r) => `${r.expert.emoji} ${r.expert.shortName} (${r.position.toUpperCase()}): ${r.response}`)
      .join("\n\n");

    // Only experts who disagreed or had concerns get to rebut
    const rebuttalExperts = round1Results.filter(
      (r) => r.position === "disagree" || r.position === "concern"
    );

    const round2Promises = rebuttalExperts.map(async (r1) => {
      const system = `${r1.expert.systemPrompt}

You are in a board meeting. You raised a concern in Round 1. Other experts have shared their views. Now you can either:
- Strengthen your concern with a specific recommendation
- Adjust your position if others made good points
Keep it to 2-3 sentences. End with [MAINTAIN] if you still disagree, or [RESOLVED] if the concerns are addressed.`;

      const userMsg = `TOPIC: ${topic}

YOUR ROUND 1 POSITION: ${r1.response}

ALL ROUND 1 RESPONSES:
${round1Summary}

Give your rebuttal or updated position.`;

      try {
        const response = await callClaude(system, userMsg);
        const position = response.includes("[MAINTAIN]") ? "disagree" : "resolved";
        const cleanResponse = response.replace(/\[MAINTAIN\]/g, "").replace(/\[RESOLVED\]/g, "").trim();
        return { expert: r1.expert, response: cleanResponse, position };
      } catch (err) {
        return { expert: r1.expert, response: `[Error: ${(err as Error).message}]`, position: "neutral" };
      }
    });

    const results = await Promise.all(round2Promises);
    round2Results.push(...results);

    // Save Round 2 to DB
    for (const r of round2Results) {
      await prisma.expertResponse.create({
        data: {
          discussionId: discussion.id,
          expertId: r.expert.id,
          expertName: r.expert.shortName,
          emoji: r.expert.emoji,
          round: 2,
          response: r.response,
          position: r.position,
        },
      });
    }
  }

  // 6. Determine final consensus
  const finalDisagreement = round2Results.some((r) => r.position === "disagree");
  const consensus = !hasDisagreement || !finalDisagreement;

  // 7. Generate summary
  const allResponses = [
    ...round1Results.map((r) => ({
      expertId: r.expert.id,
      expertName: r.expert.shortName,
      emoji: r.expert.emoji,
      round: 1,
      response: r.response,
      position: r.position,
    })),
    ...round2Results.map((r) => ({
      expertId: r.expert.id,
      expertName: r.expert.shortName,
      emoji: r.expert.emoji,
      round: 2,
      response: r.response,
      position: r.position,
    })),
  ];

  const summaryText = consensus
    ? `✅ Consensus reached — advisors are aligned.`
    : `⚠️ Disagreement remains — CEO decision needed.`;

  // 8. Update discussion record
  const status = consensus ? "decided" : "awaiting_ceo";
  await prisma.expertDiscussion.update({
    where: { id: discussion.id },
    data: { status, consensus, summary: summaryText },
  });

  // 9. Send to Telegram
  let telegramMsg = `🏛️ *Advisory Board — Meeting Summary*\n\n`;
  telegramMsg += `📋 *Topic:* ${topic}\n\n`;

  // Round 1
  for (const r of round1Results) {
    const badge = r.position === "agree" ? "✅" : r.position === "concern" ? "⚠️" : r.position === "disagree" ? "❌" : "💬";
    telegramMsg += `${r.expert.emoji} *${r.expert.shortName}* ${badge}\n${r.response}\n\n`;
  }

  // Round 2 (if any)
  if (round2Results.length > 0) {
    telegramMsg += `━━━ Round 2 (Rebuttals) ━━━\n\n`;
    for (const r of round2Results) {
      const badge = r.position === "disagree" ? "❌ Maintains" : "✅ Resolved";
      telegramMsg += `${r.expert.emoji} *${r.expert.shortName}* ${badge}\n${r.response}\n\n`;
    }
  }

  telegramMsg += `━━━━━━━━━━━━━━━━━━━━━━\n`;
  telegramMsg += summaryText;

  if (!consensus) {
    telegramMsg += `\n\n_Reply with your decision, CEO._`;
  }

  await sendTelegram(telegramMsg);

  return {
    discussionId: discussion.id,
    topic,
    experts: relevant.map((e) => e.shortName),
    consensus,
    summary: summaryText,
    responses: allResponses,
  };
}

// ─── CEO Decision ──────────────────────────────────────

export async function submitCeoDecision(
  discussionId: string,
  decision: string
): Promise<void> {
  await prisma.expertDiscussion.update({
    where: { id: discussionId },
    data: {
      status: "decided",
      ceoDecision: decision,
    },
  });

  await sendTelegram(
    `✅ *CEO Decision Recorded*\n\n${decision}`
  );
}

// ─── List Discussions ──────────────────────────────────

export async function listDiscussions(limit = 20) {
  return prisma.expertDiscussion.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      responses: {
        orderBy: [{ round: "asc" }, { createdAt: "asc" }],
      },
    },
  });
}
