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

// ─── Grok API Call ─────────────────────────────────────

async function queryGrok(apiKey: string): Promise<GrokNewsItem[]> {
  const accountsList = MONITORED_ACCOUNTS.slice(0, 30).join(", ");
  const topicsList = SEARCH_TOPICS.join("; ");

  const prompt = `You have real-time access to X/Twitter. I need you to find the most important EU AI regulatory and compliance news from the last 24 hours.

SCAN THESE SOURCES:
- Official accounts: ${accountsList}
- Search topics: ${topicsList}

FOR EACH NEWS ITEM YOU FIND, return:
- title: A clear headline (max 100 chars)
- summary: Explain like you're talking to a smart 10-year-old. What happened? Why does it matter? What should companies do about it? Max 2-3 sentences. No jargon.
- sourceUrl: The tweet URL (https://x.com/user/status/ID) or linked article URL
- sourceLabel: "X/@username" or the publication name
- changeType: One of "update", "amendment", "jurisprudence", "new_version", "incident", "certification", "correction"
- relevance: 0-100 (how important for EU AI compliance officers)
- frameworks: Related frameworks as slugs: eu-ai-act, gdpr, dora, nis2, data-act, dsa-dma, iso-42001
- systems: AI systems mentioned as slugs: gpt-4, claude, gemini, mistral, copilot, etc. (empty if none)
- date: ISO date string of when it was posted

RULES:
- Only include items with real regulatory, compliance, or procurement significance (relevance >= 50)
- Skip vendor marketing, product launches with no compliance angle, memes, opinions without substance
- Maximum 10 items, ranked by importance
- Focus on: enforcement actions, new regulations, compliance deadlines, fines, guidance documents, court rulings, data protection decisions, vendor compliance certifications

Return ONLY a valid JSON array of objects with the fields above. No markdown, no explanation.`;

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
    return items.filter((item) => item.relevance >= 50 && item.title && item.summary);
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
