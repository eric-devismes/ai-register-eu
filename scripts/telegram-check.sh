#!/bin/bash
# Check for unread Telegram messages from the CEO.
# Run at the start of each Claude Code session to pick up async messages.
#
# Usage: ./scripts/telegram-check.sh
#
# Requires: .env.local with TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID

set -euo pipefail

# Load env
if [ -f ".env.local" ]; then
  export $(grep -v '^#' .env.local | grep -E '^TELEGRAM_' | xargs)
fi

if [ -z "${TELEGRAM_BOT_TOKEN:-}" ] || [ -z "${TELEGRAM_CHAT_ID:-}" ]; then
  echo "⚠️  Telegram not configured (missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID)"
  exit 0
fi

echo "📨 Checking Telegram for messages from CEO..."

# Fetch recent messages
RESPONSE=$(curl -s "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates?limit=20")

# Parse and display messages from our chat
echo "$RESPONSE" | python3 -c "
import json, sys, datetime

data = json.load(sys.stdin)
results = data.get('result', [])
chat_id = '${TELEGRAM_CHAT_ID}'

messages = []
for u in results:
    msg = u.get('message', {})
    if str(msg.get('chat', {}).get('id', '')) != chat_id:
        continue
    if not msg.get('text'):
        continue
    ts = msg.get('date', 0)
    dt = datetime.datetime.fromtimestamp(ts)
    who = msg.get('from', {}).get('first_name', '?')
    messages.append({
        'date': dt.strftime('%Y-%m-%d %H:%M'),
        'who': who,
        'text': msg['text']
    })

if not messages:
    print('No new messages.')
else:
    print(f'{len(messages)} message(s) found:\n')
    for m in messages:
        print(f\"  📩 {m['date']} | {m['who']}: {m['text']}\")
    print()
    print('Consider adding relevant items to TODO.md')
" 2>/dev/null || echo "Failed to parse Telegram response"
