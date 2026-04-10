/**
 * Shared constants for the AI Compass EU platform.
 *
 * Centralises values that are used across multiple files:
 * brand colors, contact emails, badge color mappings, etc.
 */

// ─── Brand Colors ───────────────────────────────────────
// These map to the CSS custom properties in globals.css.
// Use Tailwind classes (e.g., text-[#003399]) in components,
// but reference these constants when building dynamic styles.

export const BRAND = {
  primary: "#003399",       // EU Blue
  secondary: "#0d1b3e",    // Navy
  accent: "#ffc107",       // EU Gold
} as const;

// ─── Contact ────────────────────────────────────────────

export const CONTACT_EMAIL = "contact@aicompass.eu";
export const CONSULTING_EMAIL = "consulting@aicompass.eu";

// ─── Tier Badge Styles ──────────────────────────────────

export const TIER_BADGES: Record<string, string> = {
  anonymous: "bg-gray-50 text-gray-400",
  free: "bg-gray-100 text-gray-600",
  pro: "bg-blue-100 text-blue-700",
  enterprise: "bg-purple-100 text-purple-700",
};

// ─── Risk Badge Styles ──────────────────────────────────

export const RISK_BADGES: Record<string, string> = {
  High: "bg-red-100 text-red-700 border-red-200",
  Limited: "bg-amber-100 text-amber-700 border-amber-200",
  Minimal: "bg-green-100 text-green-700 border-green-200",
};

// ─── Case Status Styles ─────────────────────────────────

export const STATUS_BADGES: Record<string, string> = {
  open: "bg-blue-100 text-blue-700",
  in_progress: "bg-amber-100 text-amber-700",
  waiting: "bg-gray-100 text-gray-600",
  resolved: "bg-green-100 text-green-700",
  closed: "bg-gray-200 text-gray-500",
};

// ─── Change Type Styles (newsfeed) ──────────────────────

export const CHANGE_TYPE_BADGES: Record<string, { label: string; color: string }> = {
  update: { label: "Update", color: "bg-blue-100 text-blue-700" },
  amendment: { label: "Amendment", color: "bg-purple-100 text-purple-700" },
  jurisprudence: { label: "Ruling", color: "bg-amber-100 text-amber-700" },
  new_version: { label: "New Version", color: "bg-green-100 text-green-700" },
  incident: { label: "Incident", color: "bg-red-100 text-red-700" },
  certification: { label: "Certification", color: "bg-emerald-100 text-emerald-700" },
  correction: { label: "Correction", color: "bg-gray-100 text-gray-700" },
};

// ─── LLM Configuration ─────────────────────────────────
// Centralised here so model upgrades only require one change.

export const LLM_MODEL = "claude-haiku-4-5-20251001";
export const LLM_CHAT_MAX_TOKENS = 256;       // Short answers for chat
export const LLM_COMPARE_MAX_TOKENS = 2048;   // Longer structured output for comparison
export const LLM_TIMEOUT_MS = 30_000;         // 30 seconds

// ─── Session Durations ─────────────────────────────────

export const ADMIN_SESSION_HOURS = 24;
export const SUBSCRIBER_SESSION_DAYS = 30;
export const MAGIC_LINK_MINUTES = 15;

// ─── Role Labels ────────────────────────────────────────

export const ROLE_LABELS: Record<string, string> = {
  dpo: "DPO",
  procurement: "Procurement",
  cto: "CTO",
  ciso: "CISO",
  legal: "Legal",
  executive: "Executive",
  other: "Other",
};

// ─── Industry Labels ────────────────────────────────────

export const INDUSTRY_LABELS: Record<string, string> = {
  financial: "Financial Services",
  healthcare: "Healthcare",
  insurance: "Insurance",
  "public-sector": "Public Sector",
  manufacturing: "Manufacturing",
  telecommunications: "Telecom",
  energy: "Energy",
  hr: "HR",
  other: "Other",
};
