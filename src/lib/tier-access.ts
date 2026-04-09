/**
 * Tier-based access control.
 *
 * Defines what each subscription tier can access:
 * - Free: 5 widely-used AI systems (top-level scores only), 5 chats/day, newsfeed, reports
 * - Pro: All systems with full assessments, unlimited chat, personalized dashboard, comparison tool, exports, tailored alerts
 * - Enterprise: Everything in Pro + REST API, multi-seat SSO, custom reports, webhooks, consulting
 */

export type SubscriptionTier = "free" | "pro" | "enterprise";

/**
 * AI system slugs available in the Free tier.
 * These are the most widely-used systems where compliance posture is
 * already widely discussed — giving them away builds trust and SEO traffic.
 */
export const FREE_TIER_SYSTEM_SLUGS = [
  "openai-chatgpt-enterprise",             // ChatGPT / GPT-4
  "microsoft-azure-openai-service",        // Microsoft Azure OpenAI / Copilot
  "google-gemini-vertex-ai",              // Google Gemini / Vertex AI
  "anthropic-claude-enterprise",           // Anthropic Claude
  "mistral-ai",                           // Mistral AI (EU champion)
] as const;

/**
 * Check if a system is accessible in the Free tier.
 */
export function isSystemFree(slug: string): boolean {
  return (FREE_TIER_SYSTEM_SLUGS as readonly string[]).includes(slug);
}

/**
 * Features available per tier.
 */
export const TIER_FEATURES = {
  free: {
    allSystems: false,
    fullAssessments: false,       // Top-level scores only
    comparisonTool: false,
    personalizedDashboard: false,
    exports: false,               // No PDF/CSV
    tailoredAlerts: false,
    apiAccess: false,
    multiSeat: false,
    chatLimit: 10,                // per day
    newsfeed: true,               // general, non-personalized
    reports: true,                // full access to white papers
    newsletter: "weekly",
  },
  pro: {
    allSystems: true,
    fullAssessments: true,
    comparisonTool: true,
    personalizedDashboard: true,
    exports: true,                // PDF/CSV
    tailoredAlerts: true,
    apiAccess: false,
    multiSeat: false,
    chatLimit: -1,                // unlimited
    newsfeed: true,
    reports: true,
    newsletter: "realtime",       // real-time tailored alerts
  },
  enterprise: {
    allSystems: true,
    fullAssessments: true,
    comparisonTool: true,
    personalizedDashboard: true,
    exports: true,                // PDF/CSV + bulk JSON
    tailoredAlerts: true,
    apiAccess: true,              // REST API
    multiSeat: true,              // SSO + team seats
    chatLimit: -1,                // unlimited
    newsfeed: true,
    reports: true,
    newsletter: "realtime",
  },
} as const;

/**
 * Check if a tier has access to a specific feature.
 */
export function hasFeature(
  tier: SubscriptionTier,
  feature: keyof (typeof TIER_FEATURES)["pro"]
): boolean {
  const tierConfig = TIER_FEATURES[tier];
  const value = tierConfig[feature];
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value > 0 || value === -1;
  return !!value;
}

/**
 * Check if a tier can access a specific AI system.
 */
export function canAccessSystem(tier: SubscriptionTier, slug: string): boolean {
  if (tier === "pro" || tier === "enterprise") return true;
  return isSystemFree(slug);
}

/**
 * Get the effective tier for the current user.
 * Admin owners get "enterprise" tier (full access) for testing.
 * Otherwise returns the subscriber's actual tier.
 */
export async function getEffectiveTier(): Promise<SubscriptionTier> {
  // Check if admin owner (bypasses all restrictions)
  try {
    const { isOwnerSession } = await import("@/lib/auth");
    if (await isOwnerSession()) return "enterprise";
  } catch {
    // Auth module not available (e.g., during build)
  }

  // Check subscriber tier
  try {
    const { getSubscriber } = await import("@/lib/subscriber-auth");
    const sub = await getSubscriber();
    if (sub?.tier) return sub.tier as SubscriptionTier;
  } catch {
    // Not logged in
  }

  return "free";
}

/**
 * Get the upgrade message for a gated feature.
 */
export function getUpgradeMessage(feature: string): string {
  const messages: Record<string, string> = {
    allSystems: "Upgrade to Pro to access all 30+ AI systems with full compliance assessments.",
    comparisonTool: "Upgrade to Pro to compare AI systems side-by-side.",
    exports: "Upgrade to Pro to export compliance reports as PDF or CSV.",
    personalizedDashboard: "Upgrade to Pro to create a personalized dashboard for your AI stack.",
    tailoredAlerts: "Upgrade to Pro to receive real-time alerts for your AI systems.",
    apiAccess: "Contact us for Enterprise access to the REST API.",
  };
  return messages[feature] || "Upgrade to Pro for full access.";
}
