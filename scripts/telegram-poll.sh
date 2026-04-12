#!/bin/bash
# Telegram polling daemon — checks for new messages every 60 seconds.
# Writes new messages to a file that Claude Code can read.
#
# Usage: ./scripts/telegram-poll.sh &
# Output: /tmp/telegram-incoming.log

set -euo pipefail

POLL_INTERVAL=60
OUTPUT_FILE="/tmp/telegram-incoming.log"
OFFSET_FILE="/tmp/telegram-offset"

# Load env
if [ -f "$(dirname "$0")/../.env.local" ]; then
  export $(grep -v '^#' "$(dirname "$0")/../.env.local" | grep -E '^TELEGRAM_' | xargs)
fi

if [ -z "${TELEGRAM_BOT_TOKEN:-}" ] || [ -z "${TELEGRAM_CHAT_ID:-}" ]; then
  echo "Telegram not configured" > "$OUTPUT_FILE"
  exit 1
fi

# Get initial offset
if [ -f "$OFFSET_FILE" ]; then
  OFFSET=$(cat "$OFFSET_FILE")
else
  # Get current max update_id so we only see NEW messages
  LATEST=$(curl -s "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates?limit=1&offset=-1" | python3 -c "
import json, sys
data = json.load(sys.stdin)
results = data.get('result', [])
if results:
    print(results[-1]['update_id'] + 1)
else:
    print(0)
" 2>/dev/null || echo "0")
  OFFSET=$LATEST
  echo "$OFFSET" > "$OFFSET_FILE"
fi

echo "Telegram poll started. Offset: $OFFSET. Checking every ${POLL_INTERVAL}s." >> "$OUTPUT_FILE"

while true; do
  RESPONSE=$(curl -s "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates?offset=${OFFSET}&limit=10&timeout=30" 2>/dev/null || echo '{"result":[]}')

  # Parse new messages
  NEW_MESSAGES=$(echo "$RESPONSE" | python3 -c "
import json, sys, datetime

data = json.load(sys.stdin)
results = data.get('result', [])
chat_id = '${TELEGRAM_CHAT_ID}'
max_id = ${OFFSET}

for u in results:
    msg = u.get('message', {})
    if str(msg.get('chat', {}).get('id', '')) != chat_id:
        continue
    if not msg.get('text'):
        continue
    uid = u['update_id']
    if uid >= max_id:
        max_id = uid + 1
    ts = datetime.datetime.fromtimestamp(msg.get('date', 0)).strftime('%H:%M')
    who = msg.get('from', {}).get('first_name', '?')
    text = msg['text']
    print(f'NEW|{ts}|{who}|{text}')

print(f'OFFSET|{max_id}')
" 2>/dev/null || echo "")

  # Process output
  while IFS= read -r line; do
    if [[ "$line" == NEW\|* ]]; then
      echo "$line" >> "$OUTPUT_FILE"
    elif [[ "$line" == OFFSET\|* ]]; then
      NEW_OFFSET="${line#OFFSET|}"
      if [ "$NEW_OFFSET" != "$OFFSET" ]; then
        OFFSET="$NEW_OFFSET"
        echo "$OFFSET" > "$OFFSET_FILE"
      fi
    fi
  done <<< "$NEW_MESSAGES"

  sleep "$POLL_INTERVAL"
done
