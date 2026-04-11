/**
 * Grok (xAI) Twitter/X Scanner — Real-time social intelligence.
 *
 * Uses the xAI API (Grok) to scan Twitter/X for EU AI regulatory news.
 * Grok has native access to real-time X posts, making it ideal for
 * catching breaking news, enforcement actions, and vendor announcements
 * that haven't hit RSS feeds yet.
 *
 * Pipeline:
 *  1. Ask Grok to scan X for recent EU AI regulatory news
 *  2. Grok returns structured items with source tweet URLs
 *  3. Items feed into the same classification + ingestion pipeline
 *
 * Requires: XAI_API_KEY env var (sign up at console.x.ai)
 */

import type { MonitorResult } from "@/lib/news-monitor";
import { prisma } from "@/lib/db";

// ─── Types ─────────────────────────────────────────────

interface GrokNewsItem {
  title: string;
  summary: string;
  sourceUrl: string;
  sourceLabel: string;
  changeType: string;
  relevance: number;
  frameworks: string[];
  systems: string[];
  date: string;
}

// ─── Twitter Accounts to Monitor ───────────────────────

const MONITORED_ACCOUNTS = [
  // EU Official
  "@EU_Commission", "@EUparliament", "@EU_AIACT",
  "@EU_Justice", "@DigitalEU",
  // Regulators / DPAs
  "@ABOREU", "@ABOREU", "@ABOREU",
  "@ABOREU", "@EDPB_EDPS", "@CABOREU",
  "@CABOREU", "@CABOREU",
  "@CNIL", "@ICOnews",
  "@ENABOREU",
  // AI Vendors
  "@OpenAI", "@AnthropicAI", "@MistralAI",
  "@GoogleAI", "@GoogleDeepMind", "@MSFTResearch",
  "@MetaAI", "@xaboreu",
  "@IBMResearch", "@awscloud",
  "@Aboreu", "@CohereAI",
  // AI Policy / Think Tanks
  "@FutureofLifeInst", "@ABOREU",
  "@Stanford_HAI", "@ABOREU",
  "@OECD_AI", "@AIIndex",
  // Press
  "@Reuters", "@TechCrunch",
  "@euaboreu", "@iaboreu",
];

// ─── Search Topics ─────────────────────────────────────

const SEARCH_TOPICS = [
  "EU AI Act enforcement compliance",
  "GDPR AI automated decision fine penalty",
  "AI regulation Europe new rules",
  "AI vendor compliance certification EU",
  "AI safety policy Europe",
  "DORA NIS2 AI cybersecurity",
  "AI procurement enterprise Europe",
  "foundation model regulation GPAI",
];

// ─── URL Sanitization ──────────────────────────────────
// Grok hallucinate tweet IDs. This function catches fake URLs and
// replaces them with real X search links that will actually work.

function sanitizeGrokUrl(url: string, sourceLabel: string, title: string): string {
  if (!url) return "";

  // Detect hallucinated tweet URLs: x.com/user/status/digits or twitter.com/user/status/digits
  const tweetPattern = /^https?:\/\/(x\.com|twitter\.com)\/\w+\/status\/\d+/i;
  if (tweetPattern.test(url)) {
    // Extract username from sourceLabel (e.g., "X/@CNIL" → "CNIL")
    const userMatch = sourceLabel?.match(/@(\w+)/);
    const username = userMatch ? userMatch[1] : "";

    // Build a search URL using key terms from the title
    const keywords = title
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .slice(0, 4)
      .join(" ");

    const query = username
      ? `from:${username} ${keywords}`
      : keywords;

    return `https://x.com/search?q=${encodeURIComponent(query)}&f=live`;
  }

  return url;
}

// ─── Grok API Call ─────────────────────────────────────

async function queryGrok(apiKey: string): Promise<GrokNewsItem[]> {
  const accountsList = MONITORED_ACCOUNTS.slice(0, 30).join(", ");
  const topicsList = SEARCH_TOPICS.join("; ");

  const prompt = `You have real-time access to X/Twitter. Find the most important EU AI regulatory and compliance news from the last 24 hours.

SCAN THESE SOURCES:
- Official accounts: ${accountsList}
- Search topics: ${topicsList}

FOR EACH NEWS ITEM, return a JSON object with:
- title: A sharp, specific headline (max 100 chars). Write it like a Reuters or Politico headline — not generic.
- summary: Write this like a seasoned EU tech-policy journalist. 2-3 sentences max. Guidelines:
  * Vary your style — don't follow the same template every time
  * Cover: what happened, why it's significant, who should care, where it leads
  * Be direct, use active voice, have a point of view
  * Match the tone to the gravity of the news — punchy for big stories, measured for routine updates
  * No bullet points, no "This is significant because...", no consultant-speak
  * Examples of the tone I want:
    "France's CNIL just fined a recruitment platform €15M for letting AI reject candidates without human review. If your company uses automated screening in the EU, this is the precedent that should keep you up at night."
    "Quietly, the EU AI Office published its first compliance templates for high-risk systems. Voluntary for now — but expect them to become the yardstick auditors measure you against."
- sourceUrl: IMPORTANT — Do NOT fabricate tweet URLs. LLMs hallucinate tweet IDs. Instead:
  * If the tweet links to an external article, return that article's URL
  * If there is no external link, return an X search URL like: https://x.com/search?q=from%3Ausername%20keyword&f=live
  * NEVER return a made-up x.com/user/status/ID — those will 404
- sourceLabel: "X/@username" format (e.g. "X/@CNIL", "X/@OpenAI")
- changeType: One of "update", "amendment", "jurisprudence", "new_version", "incident", "certification", "correction"
- relevance: 0-100 (significance for EU AI compliance)
- frameworks: Slugs: eu-ai-act, gdpr, dora, nis2, data-act, dsa-dma, iso-42001
- systems: Slugs: gpt-4, claude, gemini, mistral, copilot, etc. (empty if none)
- date: ISO date string

RULES:
- Only items with real regulatory, compliance, or procurement significance (relevance >= 50)
- Skip marketing, product launches without compliance angle, memes, hot takes without substance
- Maximum 10 items, ranked by importance
- Focus: enforcement actions, regulations, deadlines, fines, guidance, rulings, certifications

Return ONLY a valid JSON array. No markdown, no explanation.`;

  const res = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "grok-3",
      messages: [
        {
          role: "system",
          content: "You are an EU AI regulatory intelligence analyst. You scan X/Twitter for breaking news about AI regulation, compliance, and enforcement in Europe. You always return structured JSON data.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 4096,
    }),
    signal: AbortSignal.timeout(60_000), // Grok may take longer to search X
  });

  if (!res.ok) {
    const errBody = await res.text().catch(() => "");
    throw new Error(`Grok API ${res.status}: ${errBody.slice(0, 200)}`);
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content || "";

  // Extract JSON array
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    console.warn("[grok-scanner] No JSON array in Grok response");
    return [];
  }

  try {
    const items = JSON.parse(jsonMatch[0]) as GrokNewsItem[];
    return items
      .filter((item) => item.relevance >= 50 && item.title && item.summary)
      .map((item) => ({
        ...item,
        // Safety net: replace likely-hallucinated tweet URLs with search URLs
        sourceUrl: sanitizeGrokUrl(item.sourceUrl, item.sourceLabel, item.title),
      }));
  } catch (err) {
    console.warn("[grok-scanner] Failed to parse Grok JSON:", (err as Error).message);
    return [];
  }
}

// ─── Dedup Against Existing Entries ────────────────────

async function dedup(items: GrokNewsItem[]): Promise<GrokNewsItem[]> {
  if (items.length === 0) return [];

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const existing = await prisma.changeLog.findMany({
    where: { date: { gte: sevenDaysAgo } },
    select: { sourceUrl: true, title: true },
  });

  const existingUrls = new Set(existing.map((e) => e.sourceUrl).filter(Boolean));
  const existingTitles = new Set(existing.map((e) => e.title.toLowerCase().slice(0, 50)));

  return items.filter((item) => {
    if (item.sourceUrl && existingUrls.has(item.sourceUrl)) return false;
    // Fuzzy title dedup: check if first 50 chars match
    if (existingTitles.has(item.title.toLowerCase().slice(0, 50))) return false;
    return true;
  });
}

// ─── Ingest Into Database ──────────────────────────────

async function ingestGrokItems(items: GrokNewsItem[]): Promise<number> {
  let ingested = 0;

  const allFrameworks = await prisma.regulatoryFramework.findMany({
    select: { id: true, slug: true },
  });
  const frameworkMap = new Map(allFrameworks.map((f) => [f.slug, f.id]));

  const allSystems = await prisma.aISystem.findMany({
    select: { id: true, slug: true },
  });
  const systemMap = new Map(allSystems.map((s) => [s.slug, s.id]));

  for (const item of items) {
    try {
      const frameworkId = (item.frameworks || [])
        .map((slug) => frameworkMap.get(slug))
        .find((id) => id != null) || null;

      const systemId = (item.systems || [])
        .map((slug) => systemMap.get(slug))
        .find((id) => id != null) || null;

      let date: Date;
      try {
        date = new Date(item.date);
        if (isNaN(date.getTime())) date = new Date();
      } catch {
        date = new Date();
      }

      await prisma.changeLog.create({
        data: {
          date,
          title: item.title.slice(0, 200),
          description: item.summary,
          changeType: item.changeType || "update",
          sourceUrl: item.sourceUrl || "",
          sourceLabel: item.sourceLabel || "X/Twitter via Grok",
          author: "AI Compass EU Grok Scanner",
          ...(frameworkId ? { frameworkId } : {}),
          ...(systemId ? { systemId } : {}),
        },
      });
      ingested++;
    } catch (err) {
      console.warn(`[grok-scanner] Ingest failed "${item.title}":`, (err as Error).message);
    }
  }

  return ingested;
}

// ─── Main Pipeline ─────────────────────────────────────

export interface GrokScanResult {
  enabled: boolean;
  rawItems: number;
  newItems: number;
  ingestedItems: number;
  errors: string[];
  duration: number;
}

export async function runGrokScanner(): Promise<GrokScanResult> {
  const start = Date.now();
  const apiKey = process.env.XAI_API_KEY?.trim();

  if (!apiKey) {
    return {
      enabled: false,
      rawItems: 0,
      newItems: 0,
      ingestedItems: 0,
      errors: ["XAI_API_KEY not configured"],
      duration: 0,
    };
  }

  const errors: string[] = [];
  console.log("[grok-scanner] Scanning X/Twitter via Grok...");

  let rawItems: GrokNewsItem[] = [];
  try {
    rawItems = await queryGrok(apiKey);
    console.log(`[grok-scanner] Grok returned ${rawItems.length} items`);
  } catch (err) {
    const msg = (err as Error).message;
    console.error("[grok-scanner] Grok API error:", msg);
    errors.push(msg);
    return {
      enabled: true,
      rawItems: 0,
      newItems: 0,
      ingestedItems: 0,
      errors,
      duration: Date.now() - start,
    };
  }

  // Dedup
  const newItems = await dedup(rawItems);
  console.log(`[grok-scanner] ${newItems.length} new items after dedup`);

  // Ingest (max 10 per run)
  const toIngest = newItems.slice(0, 10);
  const ingestedCount = await ingestGrokItems(toIngest);
  console.log(`[grok-scanner] ${ingestedCount} items ingested`);

  return {
    enabled: true,
    rawItems: rawItems.length,
    newItems: newItems.length,
    ingestedItems: ingestedCount,
    errors,
    duration: Date.now() - start,
  };
}
