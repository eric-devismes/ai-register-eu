/**
 * News Sources — Curated list of authoritative EU AI regulatory news sources.
 *
 * Each source defines:
 *  - name: Display label
 *  - type: "rss" | "api" | "web" (how to fetch)
 *  - url: Feed or page URL
 *  - category: Primary content category
 *  - trustLevel: "official" | "institutional" | "press" | "vendor"
 *
 * Sources are checked by the news monitor on a schedule.
 * RSS feeds are preferred (structured, reliable). Web scraping is a last resort.
 */

export interface NewsSource {
  id: string;
  name: string;
  type: "rss" | "web";
  url: string;
  category: "regulation" | "enforcement" | "guidance" | "industry" | "standards";
  trustLevel: "official" | "institutional" | "press" | "vendor";
  region: "eu" | "global";
  enabled: boolean;
}

/**
 * HOW TO ADD A NEW SOURCE:
 *
 * 1. Copy any existing entry below
 * 2. Change the id (unique slug), name, url, category, trustLevel, region
 * 3. Set enabled: true
 * 4. Commit & push — next pipeline run picks it up automatically
 *
 * Finding RSS feed URLs:
 *   - Most blogs: try /feed/, /rss/, /rss.xml, /feed.xml, /atom.xml
 *   - Google: "site:example.com rss OR feed OR atom"
 *   - Browser extensions: "Get RSS Feed URL"
 */

export const NEWS_SOURCES: NewsSource[] = [
  // ─── EU Official Sources ─────────────────────────────
  {
    id: "eurlex-ai",
    name: "EUR-Lex (AI Act updates)",
    type: "rss",
    url: "https://eur-lex.europa.eu/EN/display-feed.html?rssId=TEurLex-C2:AI",
    category: "regulation",
    trustLevel: "official",
    region: "eu",
    enabled: true,
  },
  {
    id: "edpb",
    name: "European Data Protection Board",
    type: "rss",
    url: "https://www.edpb.europa.eu/rss_en",
    category: "guidance",
    trustLevel: "official",
    region: "eu",
    enabled: true,
  },
  {
    id: "enisa",
    name: "ENISA (EU Cybersecurity Agency)",
    type: "rss",
    url: "https://www.enisa.europa.eu/rss.xml",
    category: "guidance",
    trustLevel: "official",
    region: "eu",
    enabled: true,
  },
  {
    id: "ec-digital",
    name: "European Commission — Digital Strategy",
    type: "rss",
    url: "https://digital-strategy.ec.europa.eu/en/rss.xml",
    category: "regulation",
    trustLevel: "official",
    region: "eu",
    enabled: true,
  },
  {
    id: "ai-office",
    name: "EU AI Office",
    type: "rss",
    url: "https://digital-strategy.ec.europa.eu/en/rss.xml",
    category: "regulation",
    trustLevel: "official",
    region: "eu",
    enabled: true,
  },

  // ─── National DPAs ───────────────────────────────────
  {
    id: "cnil",
    name: "CNIL (France)",
    type: "rss",
    url: "https://www.cnil.fr/fr/rss.xml",
    category: "enforcement",
    trustLevel: "official",
    region: "eu",
    enabled: true,
  },
  {
    id: "bfdi",
    name: "BfDI (Germany)",
    type: "rss",
    url: "https://www.bfdi.bund.de/SiteGlobals/Functions/RSSFeed/DE/RSSNewsfeed/RSSNewsfeed.xml",
    category: "enforcement",
    trustLevel: "official",
    region: "eu",
    enabled: true,
  },
  {
    id: "aepd",
    name: "AEPD (Spain)",
    type: "rss",
    url: "https://www.aepd.es/en/rss.xml",
    category: "enforcement",
    trustLevel: "official",
    region: "eu",
    enabled: true,
  },
  {
    id: "ico-uk",
    name: "ICO (UK)",
    type: "rss",
    url: "https://ico.org.uk/about-the-ico/media-centre/news-and-blogs/rss/",
    category: "enforcement",
    trustLevel: "official",
    region: "global",
    enabled: true,
  },
  {
    id: "garante-italy",
    name: "Garante (Italy)",
    type: "rss",
    url: "https://www.garanteprivacy.it/web/guest/home/rss",
    category: "enforcement",
    trustLevel: "official",
    region: "eu",
    enabled: true,
  },

  // ─── Standards Bodies ────────────────────────────────
  {
    id: "iso-ai",
    name: "ISO — Artificial Intelligence",
    type: "web",
    url: "https://www.iso.org/committee/6794475/x/catalogue/p/1/u/0/d/0",
    category: "standards",
    trustLevel: "institutional",
    region: "global",
    enabled: true,
  },
  {
    id: "nist-ai",
    name: "NIST — AI",
    type: "rss",
    url: "https://www.nist.gov/artificial-intelligence/rss.xml",
    category: "standards",
    trustLevel: "institutional",
    region: "global",
    enabled: true,
  },

  // ─── AI Vendor Newsrooms ─────────────────────────────
  // These are the official blogs/newsrooms of major AI vendors.
  // They announce product updates, compliance certifications,
  // EU data residency, and policy positions here.
  {
    id: "openai-blog",
    name: "OpenAI Blog",
    type: "rss",
    url: "https://openai.com/blog/rss.xml",
    category: "industry",
    trustLevel: "vendor",
    region: "global",
    enabled: true,
  },
  {
    id: "anthropic-blog",
    name: "Anthropic News",
    type: "rss",
    url: "https://www.anthropic.com/rss.xml",
    category: "industry",
    trustLevel: "vendor",
    region: "global",
    enabled: true,
  },
  {
    id: "google-ai-blog",
    name: "Google AI Blog",
    type: "rss",
    url: "https://blog.google/technology/ai/rss/",
    category: "industry",
    trustLevel: "vendor",
    region: "global",
    enabled: true,
  },
  {
    id: "microsoft-ai-blog",
    name: "Microsoft AI Blog",
    type: "rss",
    url: "https://blogs.microsoft.com/ai/feed/",
    category: "industry",
    trustLevel: "vendor",
    region: "global",
    enabled: true,
  },
  {
    id: "mistral-blog",
    name: "Mistral AI Blog",
    type: "rss",
    url: "https://mistral.ai/feed.xml",
    category: "industry",
    trustLevel: "vendor",
    region: "eu",
    enabled: true,
  },
  {
    id: "meta-ai-blog",
    name: "Meta AI Blog",
    type: "rss",
    url: "https://ai.meta.com/blog/rss/",
    category: "industry",
    trustLevel: "vendor",
    region: "global",
    enabled: true,
  },
  {
    id: "aws-ai-blog",
    name: "AWS Machine Learning Blog",
    type: "rss",
    url: "https://aws.amazon.com/blogs/machine-learning/feed/",
    category: "industry",
    trustLevel: "vendor",
    region: "global",
    enabled: true,
  },
  {
    id: "salesforce-ai",
    name: "Salesforce AI Blog",
    type: "rss",
    url: "https://blog.salesforce.com/category/ai/feed",
    category: "industry",
    trustLevel: "vendor",
    region: "global",
    enabled: true,
  },
  {
    id: "ibm-ai-blog",
    name: "IBM AI Blog",
    type: "rss",
    url: "https://www.ibm.com/blog/category/artificial-intelligence/feed/",
    category: "industry",
    trustLevel: "vendor",
    region: "global",
    enabled: true,
  },

  // ─── Press / Analysis ────────────────────────────────
  {
    id: "euractiv-digital",
    name: "Euractiv — Digital",
    type: "rss",
    url: "https://www.euractiv.com/sections/digital/feed/",
    category: "industry",
    trustLevel: "press",
    region: "eu",
    enabled: true,
  },
  {
    id: "iapp",
    name: "IAPP — Privacy & AI",
    type: "rss",
    url: "https://iapp.org/rss/",
    category: "guidance",
    trustLevel: "press",
    region: "global",
    enabled: true,
  },
  {
    id: "techcrunch-ai",
    name: "TechCrunch — AI",
    type: "rss",
    url: "https://techcrunch.com/category/artificial-intelligence/feed/",
    category: "industry",
    trustLevel: "press",
    region: "global",
    enabled: true,
  },
  {
    id: "the-ai-act",
    name: "The AI Act Blog",
    type: "rss",
    url: "https://artificialintelligenceact.eu/feed/",
    category: "regulation",
    trustLevel: "press",
    region: "eu",
    enabled: true,
  },
  {
    id: "wired-ai",
    name: "Wired — AI",
    type: "rss",
    url: "https://www.wired.com/feed/tag/ai/latest/rss",
    category: "industry",
    trustLevel: "press",
    region: "global",
    enabled: true,
  },
  {
    id: "reuters-tech",
    name: "Reuters — Technology",
    type: "rss",
    url: "https://www.rss.reuters.com/technology",
    category: "industry",
    trustLevel: "press",
    region: "global",
    enabled: true,
  },
];

/**
 * Get all enabled sources, optionally filtered by category.
 */
export function getEnabledSources(category?: NewsSource["category"]): NewsSource[] {
  return NEWS_SOURCES.filter((s) => {
    if (!s.enabled) return false;
    if (category && s.category !== category) return false;
    return true;
  });
}

/**
 * Keywords that indicate EU AI regulatory relevance.
 * Used by the LLM classifier to filter out noise from general feeds.
 */
export const RELEVANCE_KEYWORDS = [
  "AI Act", "artificial intelligence act", "EU AI", "European AI",
  "GDPR", "data protection", "DPA", "supervisory authority",
  "DORA", "digital operational resilience", "ICT risk",
  "NIS2", "cybersecurity directive", "essential entities",
  "Data Act", "data governance", "data sharing",
  "DSA", "DMA", "digital services", "digital markets",
  "ISO 42001", "AI management system",
  "AI compliance", "AI regulation", "AI governance",
  "algorithmic", "automated decision", "high-risk AI",
  "foundation model", "general-purpose AI", "GPAI",
  "AI safety", "AI transparency", "AI audit",
  "machine learning regulation", "model risk",
  "conformity assessment", "CE marking AI",
  "AI sandbox", "regulatory sandbox",
  "deepfake", "synthetic media", "biometric",
  "ChatGPT", "Claude", "Gemini", "Copilot", "Mistral",
];
