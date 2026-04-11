#!/usr/bin/env bash
# ─── News Monitor Cron ──────────────────────────────────
#
# Triggers the news monitoring pipeline via API.
# Run every 6 hours: 0 */6 * * * /path/to/news-monitor-cron.sh
#
# Requires:
#   CRON_SECRET  — shared secret for authenticating cron requests
#   BASE_URL     — e.g., https://aicompass.eu or https://ai-register-eu.vercel.app
#
# Optional:
#   TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID — for status notifications

set -euo pipefail

# ─── Config ─────────────────────────────────────────────

CRON_SECRET="${CRON_SECRET:-}"
BASE_URL="${BASE_URL:-https://ai-register-eu.vercel.app}"
TELEGRAM_BOT_TOKEN="${TELEGRAM_BOT_TOKEN:-}"
TELEGRAM_CHAT_ID="${TELEGRAM_CHAT_ID:-}"

if [ -z "$CRON_SECRET" ]; then
  echo "ERROR: CRON_SECRET not set"
  exit 1
fi

# ─── Run ────────────────────────────────────────────────

ENDPOINT="${BASE_URL}/api/admin/news-ingest"
echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] Triggering news monitor: ${ENDPOINT}"

RESPONSE=$(curl -s -w "\n%{http_code}" \
  -X POST "$ENDPOINT" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${CRON_SECRET}" \
  --max-time 90)

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

echo "HTTP ${HTTP_CODE}"
echo "$BODY" | head -20

# ─── Notify via Telegram ────────────────────────────────

if [ -n "$TELEGRAM_BOT_TOKEN" ] && [ -n "$TELEGRAM_CHAT_ID" ]; then
  INGESTED=$(echo "$BODY" | grep -o '"ingestedItems":[0-9]*' | cut -d: -f2 || echo "?")
  SOURCES=$(echo "$BODY" | grep -o '"sourcesFetched":[0-9]*' | cut -d: -f2 || echo "?")
  RAW=$(echo "$BODY" | grep -o '"rawItems":[0-9]*' | cut -d: -f2 || echo "?")
  DURATION=$(echo "$BODY" | grep -o '"duration":[0-9]*' | cut -d: -f2 || echo "?")

  MSG="📰 *News Monitor*
Sources: ${SOURCES} | Raw: ${RAW} | Ingested: ${INGESTED}
Duration: ${DURATION}ms | HTTP: ${HTTP_CODE}"

  curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
    -H "Content-Type: application/json" \
    -d "{\"chat_id\":\"${TELEGRAM_CHAT_ID}\",\"text\":\"${MSG}\",\"parse_mode\":\"Markdown\"}" \
    > /dev/null 2>&1 || true
fi

echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] Done."
