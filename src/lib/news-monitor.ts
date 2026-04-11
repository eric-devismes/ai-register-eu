/**
 * News Monitor — Fetches, classifies, and ingests regulatory news.
 *
 * Pipeline:
 *  1. Fetch RSS feeds from curated sources
 *  2. Parse entries, dedup against existing ChangeLog
 *  3. Use LLM to classify relevance, extract metadata, summarize
 *  4. Insert qualifying items into ChangeLog (newsfeed)
 *
 * Designed to be called by a cron job or admin endpoint.
 */

import { prisma } from "@/lib/db";
import { getEnabledSources, RELEVANCE_KEYWORDS, type NewsSource } from "@/lib/news-sources";
import { LLM_MODEL, LLM_TIMEOUT_MS } from "@/lib/constants";
import { runGrokScanner } from "@/lib/news-grok";

// ─── Types ─────────────────────────────────────────────

interface RawNewsItem {
  title: string;
  description: string;
  url: string;
  pubDate: string;
  source: NewsSource;
}

interface ClassifiedNewsItem {
  title: string;
  summary: string;
  changeType: string;
  sourceUrl: string;
  sourceLabel: string;
  relevanceScore: number;  // 0-100
  frameworks: string[];    // slugs
  systems: string[];       // slugs
  date: Date;
}

// ─── RSS Parser (lightweight, no dependency) ───────────

function parseRSSItems(xml: string): Array<{ title: string; description: string; link: string; pubDate: string }> {
  const items: Array<{ title: string; description: string; link: string; pubDate: string }> = [];

  // Match <item> or <entry> blocks (RSS 2.0 and Atom)
  const itemRegex = /<(?:item|entry)[\s>]([\s\S]*?)<\/(?:item|entry)>/gi;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];

    const title = extractTag(block, "title");
    const description = extractTag(block, "description") || extractTag(block, "summary") || extractTag(block, "content");
    const link = extractLink(block);
    const pubDate = extractTag(block, "pubDate") || extractTag(block, "published") || extractTag(block, "updated") || extractTag(block, "dc:date");

    if (title) {
      items.push({
        title: stripCDATA(title).trim(),
        description: stripHTML(stripCDATA(description || "")).trim().slice(0, 1000),
        link: link || "",
        pubDate: pubDate || new Date().toISOString(),
      });
    }
  }

  return items;
}

function extractTag(block: string, tag: string): string | null {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const m = block.match(regex);
  return m ? m[1] : null;
}

function extractLink(block: string): string {
  // Try <link>url</link> first
  const linkContent = extractTag(block, "link");
  if (linkContent && linkContent.startsWith("http")) return linkContent;

  // Try <link href="url" />
  const hrefMatch = block.match(/<link[^>]*href=["']([^"']+)["'][^>]*\/?>/i);
  if (hrefMatch) return hrefMatch[1];

  // Try <guid>url</guid>
  const guid = extractTag(block, "guid");
  if (guid && guid.startsWith("http")) return guid;

  return "";
}

function stripCDATA(text: string): string {
  return text.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");
}

function stripHTML(text: string): string {
  return text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

// ─── Fetch RSS Feeds ───────────────────────────────────

async function fetchSource(source: NewsSource): Promise<RawNewsItem[]> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);

    const res = await fetch(source.url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "AI-Compass-EU-NewsBot/1.0 (+https://aicompass.eu)",
        Accept: "application/rss+xml, application/xml, application/atom+xml, text/xml",
      },
    });
    clearTimeout(timeout);

    if (!res.ok) {
      console.warn(`[news-monitor] ${source.id}: HTTP ${res.status}`);
      return [];
    }

    const xml = await res.text();
    const items = parseRSSItems(xml);

    return items.map((item) => ({
      title: item.title,
      description: item.description,
      url: item.link,
      pubDate: item.pubDate,
      source,
    }));
  } catch (err) {
    console.warn(`[news-monitor] ${source.id}: fetch failed —`, (err as Error).message);
    return [];
  }
}

// ─── Pre-filter by Keywords ────────────────────────────

function isLikelyRelevant(item: RawNewsItem): boolean {
  const text = `${item.title} ${item.description}`.toLowerCase();

  // Official/institutional sources: always relevant
  if (item.source.trustLevel === "official" || item.source.trustLevel === "institutional") {
    return true;
  }

  // Press/vendor sources: must match at least one relevance keyword
  return RELEVANCE_KEYWORDS.some((kw) => text.includes(kw.toLowerCase()));
}

// ─── Dedup Against Existing Entries ────────────────────

async function filterNewItems(items: RawNewsItem[]): Promise<RawNewsItem[]> {
  if (items.length === 0) return [];

  // Get URLs of recent changelog entries (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const existing = await prisma.changeLog.findMany({
    where: { date: { gte: thirtyDaysAgo } },
    select: { sourceUrl: true, title: true },
  });

  const existingUrls = new Set(existing.map((e) => e.sourceUrl).filter(Boolean));
  const existingTitles = new Set(existing.map((e) => e.title.toLowerCase()));

  return items.filter((item) => {
    if (item.url && existingUrls.has(item.url)) return false;
    if (existingTitles.has(item.title.toLowerCase())) return false;
    return true;
  });
}

// ─── LLM Classification ───────────────────────────────

async function classifyWithLLM(items: RawNewsItem[]): Promise<ClassifiedNewsItem[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey || items.length === 0) return [];

  // Batch items (max 10 per LLM call to manage tokens)
  const batches: RawNewsItem[][] = [];
  for (let i = 0; i < items.length; i += 10) {
    batches.push(items.slice(i, i + 10));
  }

  const results: ClassifiedNewsItem[] = [];

  for (const batch of batches) {
    try {
      const itemsText = batch
        .map((item, idx) => `[${idx}] TITLE: ${item.title}\nDESC: ${item.description.slice(0, 300)}\nSOURCE: ${item.source.name}\nURL: ${item.url}\nDATE: ${item.pubDate}`)
        .join("\n\n");

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: LLM_MODEL,
          max_tokens: 2048,
          system: `You are a seasoned EU tech-policy journalist writing for AI Compass EU. Your readers are European decision-makers — CTOs, DPOs, procurement leads — who scan headlines between meetings. They need to grasp the essentials in seconds, but they also need to feel the weight and context of what's happening.

For each news item, return these fields:

1. **relevance** (0-100): How significant for EU AI regulation, compliance, or enterprise AI procurement?
2. **changeType**: One of "update", "amendment", "jurisprudence", "new_version", "incident", "certification", "correction"
3. **summary**: This is the heart of the output. Write it like a human journalist — not a template. Guidelines:

   VOICE & TONE:
   - Write like a sharp, opinionated tech journalist who respects the reader's time
   - Vary your sentence structure. Don't always start with "The EU..." or "A new..."
   - Use active voice. Be direct. Occasionally be punchy or provocative when warranted
   - Match the energy to the news: a landmark ruling gets urgency; a routine update gets calm clarity
   - NO formulaic structure. Never use the same "X happened. This matters because Y. You should Z." pattern twice

   CONTENT (cover these naturally, not as a checklist):
   - What actually happened — in plain terms anyone could follow
   - Why this is significant — the real-world consequence, not the legal abstraction
   - Who should pay attention — be specific (banks? recruiters? anyone using chatbots?)
   - Where this might lead — a hint at what comes next, what to watch for

   EXAMPLES OF GOOD VARIETY:
   - "France's data watchdog just landed a €15M fine on a recruitment platform for letting its AI reject candidates without human review. If your company uses automated screening tools in the EU, this is the precedent that should keep you up at night."
   - "Quietly, almost without fanfare, the EU AI Office published its first set of compliance templates for high-risk systems. They're voluntary for now — but expect them to become the de facto standard auditors will measure you against."
   - "OpenAI now stores European enterprise data in Dublin. On paper, this solves the data residency headache. In practice, your DPO will still need to verify the sub-processor chain. Worth revisiting your DPIA."
   - "A German court ruled that ChatGPT-generated employment references can qualify as 'automated decisions' under GDPR Article 22. Small case, enormous implications — every HR team using generative AI should take note."

   ANTI-PATTERNS (never do these):
   - Don't start every summary the same way
   - Don't use "This is significant because..." as a crutch
   - Don't write bullet points or numbered lists
   - Don't use "stakeholders", "leverage", "synergy", or consultant-speak
   - Don't hedge everything — have a point of view
   - Don't exceed 4 sentences. Most should be 2-3.

4. **frameworks**: Related regulatory frameworks as slugs: eu-ai-act, gdpr, dora, nis2, data-act, dsa-dma, iso-42001, nist-ai-rmf, mdr-ivdr, eba-eiopa
5. **systems**: AI systems mentioned as slugs: gpt-4, claude, gemini, mistral, copilot, bedrock, watsonx, etc. (empty array if none specific)

Return ONLY a valid JSON array. Each element: { "index": N, "relevance": 0-100, "changeType": "...", "summary": "...", "frameworks": ["..."], "systems": ["..."] }
Only include items with relevance >= 40. Skip vendor marketing fluff with no regulatory or procurement angle.`,
          messages: [{ role: "user", content: itemsText }],
        }),
        signal: AbortSignal.timeout(LLM_TIMEOUT_MS),
      });

      if (!res.ok) {
        console.warn(`[news-monitor] LLM classify failed: ${res.status}`);
        continue;
      }

      const data = await res.json();
      const text = data?.content?.[0]?.text || "";

      // Extract JSON from response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) continue;

      const classified = JSON.parse(jsonMatch[0]) as Array<{
        index: number;
        relevance: number;
        changeType: string;
        summary: string;
        frameworks: string[];
        systems: string[];
      }>;

      for (const c of classified) {
        if (c.relevance < 40) continue;
        const item = batch[c.index];
        if (!item) continue;

        let date: Date;
        try {
          date = new Date(item.pubDate);
          if (isNaN(date.getTime())) date = new Date();
        } catch {
          date = new Date();
        }

        results.push({
          title: item.title.slice(0, 200),
          summary: c.summary || item.description.slice(0, 500),
          changeType: c.changeType || "update",
          sourceUrl: item.url,
          sourceLabel: item.source.name,
          relevanceScore: c.relevance,
          frameworks: c.frameworks || [],
          systems: c.systems || [],
          date,
        });
      }
    } catch (err) {
      console.warn(`[news-monitor] LLM batch failed:`, (err as Error).message);
    }
  }

  return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

// ─── Ingest Into Database ──────────────────────────────

async function ingestItems(items: ClassifiedNewsItem[]): Promise<number> {
  let ingested = 0;

  // Resolve framework slugs to IDs
  const allFrameworks = await prisma.regulatoryFramework.findMany({
    select: { id: true, slug: true },
  });
  const frameworkMap = new Map(allFrameworks.map((f) => [f.slug, f.id]));

  // Resolve system slugs to IDs
  const allSystems = await prisma.aISystem.findMany({
    select: { id: true, slug: true },
  });
  const systemMap = new Map(allSystems.map((s) => [s.slug, s.id]));

  for (const item of items) {
    try {
      // Find the best matching framework
      const frameworkId = item.frameworks
        .map((slug) => frameworkMap.get(slug))
        .find((id) => id != null) || null;

      // Find the best matching system
      const systemId = item.systems
        .map((slug) => systemMap.get(slug))
        .find((id) => id != null) || null;

      await prisma.changeLog.create({
        data: {
          date: item.date,
          title: item.title,
          description: item.summary,
          changeType: item.changeType,
          sourceUrl: item.sourceUrl,
          sourceLabel: item.sourceLabel,
          author: "AI Compass EU News Monitor",
          ...(frameworkId ? { frameworkId } : {}),
          ...(systemId ? { systemId } : {}),
        },
      });
      ingested++;
    } catch (err) {
      console.warn(`[news-monitor] Failed to ingest "${item.title}":`, (err as Error).message);
    }
  }

  return ingested;
}

// ─── Main Pipeline ─────────────────────────────────────

export interface MonitorResult {
  sourcesFetched: number;
  rawItems: number;
  relevantItems: number;
  newItems: number;
  classifiedItems: number;
  ingestedItems: number;
  grok?: {
    enabled: boolean;
    rawItems: number;
    newItems: number;
    ingestedItems: number;
    errors: string[];
    duration: number;
  };
  errors: string[];
  duration: number;
}

export async function runNewsMonitor(): Promise<MonitorResult> {
  const start = Date.now();
  const errors: string[] = [];

  // 1. Fetch all enabled sources in parallel
  const sources = getEnabledSources();
  console.log(`[news-monitor] Fetching ${sources.length} sources...`);

  const fetchResults = await Promise.allSettled(
    sources.map((source) => fetchSource(source))
  );

  const allRaw: RawNewsItem[] = [];
  fetchResults.forEach((result, idx) => {
    if (result.status === "fulfilled") {
      allRaw.push(...result.value);
    } else {
      errors.push(`${sources[idx].id}: ${result.reason}`);
    }
  });

  console.log(`[news-monitor] Fetched ${allRaw.length} raw items from ${sources.length} sources`);

  // 2. Pre-filter by relevance keywords
  const relevant = allRaw.filter(isLikelyRelevant);
  console.log(`[news-monitor] ${relevant.length} items pass keyword filter`);

  // 3. Dedup against existing entries
  const newItems = await filterNewItems(relevant);
  console.log(`[news-monitor] ${newItems.length} new items after dedup`);

  if (newItems.length === 0) {
    return {
      sourcesFetched: sources.length,
      rawItems: allRaw.length,
      relevantItems: relevant.length,
      newItems: 0,
      classifiedItems: 0,
      ingestedItems: 0,
      errors,
      duration: Date.now() - start,
    };
  }

  // 4. Classify with LLM (top 30 items max to control costs)
  const toClassify = newItems.slice(0, 30);
  const classified = await classifyWithLLM(toClassify);
  console.log(`[news-monitor] ${classified.length} items classified as relevant (score >= 40)`);

  // 5. Ingest into database (top 15 per run to avoid flooding)
  const toIngest = classified.slice(0, 15);
  const ingestedCount = await ingestItems(toIngest);
  console.log(`[news-monitor] ${ingestedCount} items ingested into newsfeed`);

  // 6. Run Grok/X scanner (if XAI_API_KEY configured)
  let grokResult;
  try {
    grokResult = await runGrokScanner();
    if (grokResult.enabled) {
      console.log(`[news-monitor] Grok scanner: ${grokResult.ingestedItems} items from X/Twitter`);
    }
  } catch (err) {
    console.warn("[news-monitor] Grok scanner error:", (err as Error).message);
    errors.push(`grok: ${(err as Error).message}`);
  }

  return {
    sourcesFetched: sources.length,
    rawItems: allRaw.length,
    relevantItems: relevant.length,
    newItems: newItems.length,
    classifiedItems: classified.length,
    ingestedItems: ingestedCount,
    grok: grokResult,
    errors,
    duration: Date.now() - start,
  };
}
