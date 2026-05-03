# Developer Guide — VendorScope

This guide covers everything a new developer needs to get productive on the VendorScope codebase.

## What This Project Does

VendorScope is a SaaS platform that rates AI tools (ChatGPT, Azure OpenAI, Mistral, etc.) against EU regulations (EU AI Act, GDPR, DORA). It serves European decision-makers (CTOs, DPOs, procurement leads) who need to understand whether an AI tool is safe to deploy in their regulated environment.

Key features:
- **AI Database**: 30+ AI systems with detailed compliance assessments
- **Regulation Library**: 6+ EU frameworks with structured sections and policy statements
- **RAG Chatbot**: AI-powered Q&A grounded in the platform's own data (Claude Haiku)
- **Comparison Tool**: LLM-powered use-case matching + side-by-side comparison tables
- **Subscriber Dashboard**: Personalised newsfeed, preferences, GDPR data export
- **Admin CMS**: Full CRUD for all content, changelog, users, cases, companies
- **Multi-language**: 14 EU languages via DeepL auto-translation
- **Stripe Payments**: Freemium tiers (Free / Pro / Enterprise)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, TypeScript) |
| Database | PostgreSQL (Neon on Vercel) |
| ORM | Prisma 7 with `@prisma/adapter-pg` |
| Styling | Tailwind CSS v4 |
| Auth | JWT sessions (jose) + bcrypt passwords + TOTP 2FA (otpauth) |
| AI | Anthropic Claude Haiku (`@anthropic-ai/sdk`) |
| Payments | Stripe (subscriptions + webhooks) |
| Email | Resend (magic links + digest emails) |
| Translation | DeepL API (`deepl-node`) |
| Deployment | Vercel |
| Node | v22 (via nvm) |

## Local Setup

### Prerequisites
- Node.js 22+ (via nvm: `nvm use 22`)
- PostgreSQL (local or Neon free tier)
- Git

### Steps

```bash
# 1. Clone and install
git clone <repo-url>
cd ai-register-eu
npm install

# 2. Set up environment
cp .env.example .env.local
# Edit .env.local — at minimum you need:
#   DATABASE_URL    (PostgreSQL connection string)
#   JWT_SECRET      (random 64-char hex — see .env.example for generator)

# 3. Generate Prisma client
npx prisma generate

# 4. Push schema to database (creates tables)
npx prisma db push

# 5. Seed the database (see src/data/SEEDS.md for full order)
npx tsx src/data/seed.ts                     # Core frameworks + systems
npx tsx src/data/seed-vendors.ts             # Extended vendor profiles
npx tsx src/data/seed-all-framework-sections.ts  # Sections + statements
npx tsx src/data/seed-admin-owner.ts         # Admin account

# 6. Start dev server
./dev.sh
# Or manually: npm run dev
```

The app runs at `http://localhost:3000`.

### Optional Services

These are not required for local dev — each gracefully degrades:

| Service | Without It | How to Enable |
|---------|-----------|---------------|
| Anthropic API | Chat returns placeholder text | Add `ANTHROPIC_API_KEY` |
| Resend | Magic links logged to console | Add `RESEND_API_KEY` |
| DeepL | English-only (no translations) | Add `DEEPL_API_KEY` |
| Stripe | Checkout returns 503 | Add `STRIPE_*` keys |
| Plausible | No analytics | Add `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` |

## Project Structure

```
src/
  app/
    [lang]/              # Public pages (locale-prefixed: /en/, /fr/, /de/...)
      page.tsx           # Homepage
      database/          # AI system listing grid
      regulations/       # Framework listing + detail pages
      systems/[slug]/    # System assessment detail + cross-reports
      compare/           # AI matching + comparison tool
      pricing/           # Subscription tiers
      account/           # Subscriber settings + preferences
      subscribe/         # Magic link auth flow
      ...
    admin/               # Admin panel (no locale prefix)
      frameworks/        # CRUD for regulatory frameworks
      systems/           # CRUD for AI systems + scores
      changelog/         # CRUD for changelog entries
      industries/        # CRUD for industries
      sources/           # Approved external URLs for chatbot
      subscribers/       # CRM: subscriber management
      companies/         # CRM: company management
      cases/             # Support case management
      chat/              # Chat log viewer
      feedback/          # Contact form submissions
      team/              # Admin user management (owner only)
    api/                 # API routes
      auth/              # Admin login + TOTP + logout
      subscribe/         # Subscriber signup + verify + logout
      chat/              # RAG chatbot endpoint
      compare/           # LLM matching + comparison data
      account/           # Subscriber preferences + GDPR export/delete
      feed/              # Personalised changelog feed
      export/            # CSV/JSON export (Pro+)
      feedback/          # Contact form
      stripe/            # Checkout + webhook
      admin/             # Admin CRUD APIs (cases, subscribers, companies, team)
      v1/                # Enterprise REST API (Bearer auth)
  components/
    layout/              # Header, Footer, LanguageSwitcher
    home/                # Homepage sections (Hero, StatsBar, FeaturedSystems, etc.)
    charts/              # SpiderChart, ComparisonSpiderChart (SVG radar charts)
    chat/                # ChatWidget (floating chat bubble)
    ui/                  # Shared UI (CollapsibleSection, CookieConsent, FrameworkPillars)
  lib/                   # Core logic — the heart of the app
    db.ts                # Prisma singleton
    queries.ts           # All database query functions
    auth.ts              # Admin auth (JWT + TOTP + roles)
    subscriber-auth.ts   # Subscriber auth (magic links)
    api-auth.ts          # Enterprise API auth (Bearer tokens)
    chat-guard.ts        # Input validation + injection detection
    chat-rag.ts          # RAG context retrieval (keyword search)
    chat-rate-limit.ts   # Tiered rate limiting
    llm.ts               # Claude API wrapper
    scoring.ts           # Grade conversion + dimension scoring heuristics
    tier-access.ts       # Subscription tier gating logic
    constants.ts         # Centralised config (brand, LLM model, session durations)
    translate.ts         # DeepL translation service
    email.ts             # Resend email service (magic links + digests)
    i18n.ts              # 14-locale configuration + DeepL mapping
    get-translation.ts   # Translation retrieval from DB
    get-locale-server.ts # Server-side locale detection from URL
  data/                  # Seed scripts (see SEEDS.md)
  generated/prisma/      # Auto-generated Prisma client (gitignored)
prisma/
  schema.prisma          # Database schema (15 models)
prisma.config.ts         # Prisma connection configuration
```

## Database Architecture

15 models across 4 domains:

**Compliance Data** (the product):
- `RegulatoryFramework` → `FrameworkSection` → `PolicyStatement`
- `AISystem` → `AssessmentScore` (per framework), `DimensionScore` (per section)
- `Industry` (many-to-many with both frameworks and systems)
- `ChangeLog` (polymorphic: links to framework, system, or both)

**Users**:
- `AdminUser` (roles: owner/admin/editor, bcrypt+TOTP auth)
- `Subscriber` (email-only, magic link auth, GDPR-compliant)
- `Company`, `Case` (CRM features)

**Operational**:
- `ChatUsage` (rate limiting), `ChatLog` (interaction logging)
- `DigestLog` (email delivery tracking)
- `Translation` (cached DeepL translations)
- `Feedback` (contact form), `ApprovedSource` (chatbot URL whitelist)

## Authentication

Two separate auth systems:

**Admin** (JWT cookie, 24h expiry):
- Login: email + bcrypt password → optional TOTP → JWT cookie
- Roles: `owner` (full access + bypasses tier limits), `admin`, `editor`
- Legacy fallback: `ADMIN_PASSWORD_HASH` env var (for initial setup)

**Subscriber** (JWT cookie, 30 days):
- Signup: email → magic link (15 min expiry) → JWT cookie
- No passwords, no names stored (GDPR minimal)
- Tiers: `free`, `pro` (Stripe), `enterprise` (manual)

**Enterprise API** (Bearer token):
- Same JWT as subscriber session, passed in `Authorization: Bearer <token>`
- Only `enterprise` tier subscribers can access `/api/v1/*`

## Chat Pipeline

```
User question
  → chat-guard.ts    (injection detection, off-topic filter, length check)
  → chat-rate-limit  (fingerprint cookie + tier-based daily limit)
  → chat-rag.ts      (keyword search: frameworks, statements, systems, changelog)
  → llm.ts           (Claude Haiku with profile-aware system prompt)
  → ChatLog          (logged for admin review)
  → Response         (answer + remaining quota)
```

## Key Commands

```bash
npm run dev          # Dev server (or ./dev.sh for nvm)
npm run build        # Production build
npm run lint         # ESLint
npx prisma generate  # Regenerate Prisma client after schema changes
npx prisma db push   # Push schema changes to database
npx prisma studio    # Visual database browser (localhost:5555)
```

## Deployment

Deployed on Vercel. Push to `main` triggers auto-deploy.

- Database: Neon PostgreSQL (managed via Vercel integration)
- Environment variables: set in Vercel dashboard
- Prisma generates at build time (postinstall hook)

## Common Tasks

**Add a new AI system**: Admin panel → Systems → New. Fill in vendor, name, type, risk level, and all profile fields. Set per-framework scores. The system appears on the public site immediately.

**Add a framework section**: Admin panel → Frameworks → [framework] → Sections → New. Add policy statements under each section. These feed into the RAG chatbot context.

**Upgrade a subscriber to Pro**: Either via Stripe checkout flow, or manually in Admin panel → Subscribers → PATCH the tier field.

**Change the LLM model**: Edit `LLM_MODEL` in `src/lib/constants.ts`. All API routes reference this constant.

**Add a new language**: Add the locale code to `locales` array in `src/lib/i18n.ts`, add the DeepL mapping, and create a dictionary file in `src/dictionaries/`.
