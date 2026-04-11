#!/bin/bash
# Send a Telegram notification to the project owner.
#
# Usage:
#   ./scripts/telegram-notify.sh "Your message here"
#   ./scripts/telegram-notify.sh "Message" --buttons "Option A|Option B|Option C"
#
# --buttons creates inline keyboard buttons for fast decisions.
# User can also type a free-text reply instead of clicking.
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

MESSAGE=""
BUTTONS=""

# Parse arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    --buttons)
      BUTTONS="$2"
      shift 2
      ;;
    *)
      MESSAGE="$1"
      shift
      ;;
  esac
done

if [ -z "$MESSAGE" ]; then
  echo "Usage: $0 \"message\" [--buttons \"Option A|Option B|Option C\"]"
  exit 1
fi

if [ -n "$BUTTONS" ]; then
  # Build inline keyboard JSON from pipe-separated options
  KEYBOARD_ROWS=""
  IFS='|' read -ra OPTIONS <<< "$BUTTONS"
  for opt in "${OPTIONS[@]}"; do
    opt=$(echo "$opt" | xargs) # trim whitespace
    if [ -n "$KEYBOARD_ROWS" ]; then
      KEYBOARD_ROWS="$KEYBOARD_ROWS,"
    fi
    KEYBOARD_ROWS="$KEYBOARD_ROWS[{\"text\":\"$opt\",\"callback_data\":\"$opt\"}]"
  done

  curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
    -H "Content-Type: application/json" \
    -d "{
      \"chat_id\": \"$TELEGRAM_CHAT_ID\",
      \"text\": \"$MESSAGE\",
      \"parse_mode\": \"Markdown\",
      \"reply_markup\": {
        \"inline_keyboard\": [$KEYBOARD_ROWS]
      }
    }" \
    > /dev/null 2>&1
else
  curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
    -d chat_id="$TELEGRAM_CHAT_ID" \
    -d text="$MESSAGE" \
    -d parse_mode="Markdown" \
    > /dev/null 2>&1
fi

echo "Sent."
