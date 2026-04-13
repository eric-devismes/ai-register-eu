#!/usr/bin/env bash
# ─── Daily Digest Cron (manual fallback) ───────────────
#
# Compiles the daily digest and sends to Telegram.
# Normally called by Vercel Cron at 20:00 Paris (vercel.json).
# Use this script for manual triggering or non-Vercel environments.
#
# Requires: CRON_SECRET, BASE_URL

set -euo pipefail

CRON_SECRET="${CRON_SECRET:-}"
BASE_URL="${BASE_URL:-https://ai-register-eu.vercel.app}"

if [ -z "$CRON_SECRET" ]; then
  echo "ERROR: CRON_SECRET not set"
  exit 1
fi

ENDPOINT="${BASE_URL}/api/admin/daily-digest"
echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] Triggering daily digest: ${ENDPOINT}"

RESPONSE=$(curl -s -w "\n%{http_code}" \
  -X POST "$ENDPOINT" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${CRON_SECRET}" \
  --max-time 300)

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

echo "HTTP ${HTTP_CODE}"
echo "$BODY" | head -20
echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] Done."
