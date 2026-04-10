/**
 * Date formatting utilities.
 *
 * Consistent date formatting across the application.
 * Uses Intl.DateTimeFormat for locale-aware formatting.
 */

/** Format an ISO date string as "9 Apr 2026" */
export function formatDateShort(iso: string | null): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

/** Format an ISO date string as "April 2026" */
export function formatDateMonth(iso: string | null): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

/** Get today's date as ISO string (YYYY-MM-DD) */
export function todayIso(): string {
  return new Date().toISOString().split("T")[0];
}
