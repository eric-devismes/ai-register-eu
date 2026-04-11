#!/bin/bash
# Send a Telegram notification to the project owner.
# Usage: ./scripts/telegram-notify.sh "Your message here"
#
# Reads TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID from .env.local

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Load env vars
if [ -f "$PROJECT_DIR/.env.local" ]; then
  export TELEGRAM_BOT_TOKEN=$(grep TELEGRAM_BOT_TOKEN "$PROJECT_DIR/.env.local" | cut -d'=' -f2)
  export TELEGRAM_CHAT_ID=$(grep TELEGRAM_CHAT_ID "$PROJECT_DIR/.env.local" | cut -d'=' -f2)
fi

if [ -z "$TELEGRAM_BOT_TOKEN" ] || [ -z "$TELEGRAM_CHAT_ID" ]; then
  echo "Error: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set"
  exit 1
fi

MESSAGE="$1"
if [ -z "$MESSAGE" ]; then
  echo "Usage: $0 \"message\""
  exit 1
fi

curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
  -d chat_id="$TELEGRAM_CHAT_ID" \
  -d text="$MESSAGE" \
  -d parse_mode="Markdown" \
  > /dev/null 2>&1

echo "Sent."
