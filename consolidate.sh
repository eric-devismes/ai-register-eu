#!/bin/bash
# Consolidation script — run from ~/Documents/Claude-Work/PROJECTS/ai-register-eu/
# This commits all uncommitted work and moves duplicate folders to Trash.

set -e

echo "=== Step 1: Commit all uncommitted work ==="
cd ~/Documents/Claude-Work/PROJECTS/ai-register-eu

# Stage all modified files
git add prisma/schema.prisma \
  "src/app/[lang]/systems/[slug]/SystemDetailClient.tsx" \
  src/app/admin/cases/CasesClient.tsx \
  src/app/admin/companies/CompaniesClient.tsx \
  src/app/admin/sources/actions.ts \
  src/app/api/chat/route.ts \
  src/app/api/compare/route.ts \
  src/app/api/feedback/route.ts \
  src/app/api/stripe/checkout/route.ts \
  src/app/api/stripe/webhook/route.ts \
  src/components/charts/ComparisonSpiderChart.tsx \
  src/components/charts/SpiderChart.tsx \
  src/components/chat/ChatWidget.tsx \
  src/components/home/Hero.tsx \
  src/generated/prisma/browser.ts \
  src/generated/prisma/internal/class.ts \
  src/generated/prisma/models.ts \
  src/lib/auth.ts \
  src/lib/chat-guard.ts \
  src/lib/chat-rag.ts \
  src/lib/chat-rate-limit.ts \
  src/lib/llm.ts \
  src/lib/scoring.ts \
  src/lib/subscriber-auth.ts

# Stage deleted duplicate Prisma files
git add "src/generated/prisma/browser 2.ts" \
  "src/generated/prisma/client 2.ts" \
  "src/generated/prisma/commonInputTypes 2.ts" \
  "src/generated/prisma/enums 2.ts" \
  "src/generated/prisma/models 2.ts"

# Stage new files
git add DEVELOPER.md \
  src/data/SEEDS.md \
  src/data/seed-capability-types.ts \
  src/lib/constants.ts \
  src/lib/utils/

echo "Staged all files. Committing..."

git commit -m "$(cat <<'EOF'
refactor: code quality — deduplicate, extract shared utilities, add docs

Critical fixes:
- Removed duplicate computeOverallScore from compare route (now imports from scoring.ts)
- Extracted renderMarkdownInline to shared utils/markdown.ts (was in Hero + ChatWidget)
- Extracted wrapLabel to shared utils/chart-helpers.ts (was in both spider charts)
- Cleaned up Prisma generated file duplicates

New shared modules:
- src/lib/constants.ts — brand colors, emails, badge styles, role/industry labels
- src/lib/utils/markdown.ts — markdown-to-React rendering
- src/lib/utils/date-format.ts — consistent date formatting
- src/lib/utils/chart-helpers.ts — SVG label wrapping

Documentation & improvements:
- DEVELOPER.md — full developer guide
- src/data/SEEDS.md — seed data documentation
- Prisma schema: added database indexes for performance
- Improved JSDoc comments across API routes and lib modules
- Better error messages in admin CRM pages

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"

echo "✓ Committed successfully"
echo ""

echo "=== Step 2: Move duplicate folders to Trash ==="
# Move ai-register-eu-dev to Trash (subset of this repo)
if [ -d ~/Projects/ai-register-eu-dev ]; then
  mv ~/Projects/ai-register-eu-dev ~/.Trash/ai-register-eu-dev
  echo "✓ Moved ~/Projects/ai-register-eu-dev to Trash"
else
  echo "⚠ ~/Projects/ai-register-eu-dev not found, skipping"
fi

# Move ai-register-eu stub to Trash (no source code, just deployment artifacts)
if [ -d ~/Projects/ai-register-eu ]; then
  mv ~/Projects/ai-register-eu ~/.Trash/ai-register-eu-stub
  echo "✓ Moved ~/Projects/ai-register-eu to Trash (renamed to ai-register-eu-stub)"
else
  echo "⚠ ~/Projects/ai-register-eu not found, skipping"
fi

echo ""
echo "=== Step 3: Verify ==="
git log --oneline -3
echo ""
git status --short
echo ""
echo "=== Done! ==="
echo "Single source of truth: ~/Documents/Claude-Work/PROJECTS/ai-register-eu"
echo "Trashed folders can be restored from Trash if needed."
