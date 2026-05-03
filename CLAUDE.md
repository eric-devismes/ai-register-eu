@AGENTS.md

# VendorScope

AI intelligence platform for European decision-makers. Rates AI tools against EU regulations (AI Act, GDPR, DORA) with structured scoring for compliance, data sovereignty, multilingual quality, and pricing.

## Tech Stack

- **Framework**: Next.js 16 (App Router, TypeScript)
- **Styling**: Tailwind CSS v4
- **Fonts**: Merriweather (headings), Source Sans 3 (body) via Google Fonts
- **Deployment**: Vercel
- **Node**: v22 via nvm

## Project Structure

```
src/
  app/              # Next.js App Router pages
    page.tsx         # Homepage
    layout.tsx       # Root layout with metadata & fonts
    globals.css      # Tailwind config, brand tokens, base styles
    database/        # AI tools database listing
    regulations/     # Regulatory frameworks info
    industries/      # Industry-specific views
    ratings/         # Rating methodology & scores
    resources/       # Guides, reports, downloads
    pricing/         # Subscription tiers
    about/           # About the platform
    methodology/     # Scoring methodology
  components/
    layout/          # Header, Footer
    home/            # Homepage sections (Hero, StatsBar, FeaturedSystems, etc.)
    ui/              # Shared UI components (buttons, badges, cards)
  lib/               # Utilities, helpers
  data/              # Static data (AI tools, frameworks, scores)
```

## Brand & Design

- **Name**: VendorScope
- **Tagline**: AI Intelligence for European Decision-Makers
- **Primary**: EU Blue `#003399`
- **Secondary**: Navy `#0d1b3e`
- **Accent**: Gold `#ffc107` (EU flag gold)
- **Headings**: Merriweather serif
- **Body**: Source Sans 3 sans-serif

## Dev Commands

```bash
# Dev server (uses webpack, not Turbopack, due to nvm PATH issue)
./dev.sh
# Or manually:
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && npm run dev

npm run build    # Production build
npm run lint     # ESLint
```

## Conventions

- Server components by default; only use `"use client"` when state/interactivity is needed
- Keep data separate from components (in `src/data/`)
- Use Tailwind utility classes; brand colors defined as CSS custom properties in globals.css
- All pages should include Header and Footer from layout components
- SEO: every page needs proper metadata via `export const metadata`

## Revenue Model

Freemium subscription (Free / Pro €19/mo / Enterprise custom pricing) + education courses.
Payments: LemonSqueezy (Merchant of Record). Auth: magic link (passwordless).
