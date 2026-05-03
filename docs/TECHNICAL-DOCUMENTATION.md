# VendorScope — Technical Documentation

> **Version**: 1.0 — April 2026
> **Author**: Eric Devismes
> **Purpose**: Complete platform documentation for due diligence, onboarding, and operational reference
> **Audience**: Technical stakeholders, potential acquirers, new team members

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Architecture Overview](#2-architecture-overview)
3. [Technology Choices & Justifications](#3-technology-choices--justifications)
4. [System Architecture Diagram](#4-system-architecture-diagram)
5. [Data Flow & User Journeys](#5-data-flow--user-journeys)
6. [Database Design](#6-database-design)
7. [Authentication & Access Control](#7-authentication--access-control)
8. [AI & Chat Intelligence Pipeline](#8-ai--chat-intelligence-pipeline)
9. [Payment & Subscription System](#9-payment--subscription-system)
10. [Content Management](#10-content-management)
11. [Internationalization (14 EU Languages)](#11-internationalization-14-eu-languages)
12. [Security Architecture](#12-security-architecture)
13. [API Reference](#13-api-reference)
14. [Infrastructure & Deployment](#14-infrastructure--deployment)
15. [Monitoring & Operations](#15-monitoring--operations)
16. [Cost Structure](#16-cost-structure)
17. [Known Limitations & Technical Debt](#17-known-limitations--technical-debt)
18. [Appendix: File Structure](#18-appendix-file-structure)

---

## 1. Executive Summary

### What is VendorScope?

VendorScope is a web platform that helps European enterprises evaluate AI tools against EU regulations. Think of it as **"Consumer Reports for enterprise AI"** — independent, structured, actionable intelligence for decision-makers (CTOs, CISOs, DPOs, procurement officers) who need to buy AI tools that comply with European law.

### What does it do?

1. **Rates 100+ AI systems** (ChatGPT, Claude, SAP, Salesforce, etc.) against EU regulations (AI Act, GDPR, DORA, NIS2)
2. **Compares systems side-by-side** with spider charts and detailed scorecards
3. **Provides an AI chatbot** that answers EU compliance questions using the platform's knowledge base
4. **Publishes regulatory intelligence** — framework summaries, enforcement timelines, policy statements
5. **Serves 14 EU languages** with automatic translation

### Business Model

```
Free tier          → Lead generation (5 systems, 10 chat questions/day)
Pro tier (€19/mo)  → Full access (all systems, unlimited chat, exports)
Enterprise         → Custom pricing (API, multi-seat, consulting)
```

### Key Numbers (April 2026)

- ~108 AI systems profiled
- 9 regulatory frameworks (EU AI Act, GDPR, DORA, NIS2, ISO 42001, NIST, etc.)
- 14 supported languages
- 57 user-facing pages
- 31 API endpoints
- 19 database models
- Single developer + AI-assisted development (Claude Code)

---

## 2. Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        USERS                                │
│   Anonymous  │  Free Subscriber  │  Pro  │  Enterprise      │
└──────┬───────┴────────┬──────────┴───┬──┴────────┬──────────┘
       │                │              │           │
       ▼                ▼              ▼           ▼
┌─────────────────────────────────────────────────────────────┐
│                    VERCEL CDN / EDGE                        │
│              Global CDN, SSL, DDoS protection               │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   NEXT.JS APPLICATION                       │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ Server       │  │ Client       │  │ API Routes       │  │
│  │ Components   │  │ Components   │  │ (/api/*)         │  │
│  │              │  │              │  │                  │  │
│  │ • Pages      │  │ • ChatWidget │  │ • /api/chat      │  │
│  │ • Layouts    │  │ • Search     │  │ • /api/subscribe │  │
│  │ • Data fetch │  │ • Filters    │  │ • /api/stripe    │  │
│  │              │  │ • Spider     │  │ • /api/export    │  │
│  │              │  │   Charts     │  │ • /api/admin/*   │  │
│  └──────┬───────┘  └──────────────┘  └────────┬─────────┘  │
│         │                                      │            │
│         ▼                                      ▼            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                   src/lib/ (Shared Logic)            │   │
│  │                                                      │   │
│  │  auth.ts        │ tier-access.ts  │ scoring.ts       │   │
│  │  chat-rag.ts    │ chat-guard.ts   │ llm.ts           │   │
│  │  db.ts          │ queries.ts      │ i18n.ts          │   │
│  │  email.ts       │ translate.ts    │ constants.ts     │   │
│  └──────┬──────────┴────────┬────────┴──────┬───────────┘   │
│         │                   │               │               │
└─────────┼───────────────────┼───────────────┼───────────────┘
          │                   │               │
          ▼                   ▼               ▼
┌──────────────┐  ┌───────────────┐  ┌────────────────┐
│  PostgreSQL  │  │  Anthropic    │  │  External APIs │
│  (Neon)      │  │  Claude API   │  │                │
│              │  │               │  │ • Resend       │
│ 19 models    │  │ RAG chatbot   │  │ • DeepL        │
│ ~108 systems │  │ Haiku model   │  │ • Stripe       │
│ 9 frameworks │  │               │  │ • LemonSqueezy │
│ 14 languages │  │               │  │ • Plausible    │
└──────────────┘  └───────────────┘  └────────────────┘
```

### Architecture Style: **Modular Monolith**

Everything runs as a single Next.js application. This is intentional — see [Section 3](#3-technology-choices--justifications) for justification.

---

## 3. Technology Choices & Justifications

### Why each technology was chosen

```
┌─────────────────┬───────────────────────┬─────────────────────────────────┐
│ Decision        │ Choice                │ Why (not the alternative)       │
├─────────────────┼───────────────────────┼─────────────────────────────────┤
│ Framework       │ Next.js 16            │ SSR + static = fast SEO.        │
│                 │ (App Router)          │ One codebase for UI + API.      │
│                 │                       │ Not SPA (bad SEO), not          │
│                 │                       │ separate backend (overkill      │
│                 │                       │ for single developer).          │
├─────────────────┼───────────────────────┼─────────────────────────────────┤
│ Hosting         │ Vercel                │ Zero-ops. Auto-deploys from     │
│                 │                       │ git push. Global CDN. Free      │
│                 │                       │ tier covers MVP. Not AWS/GCP    │
│                 │                       │ (too complex for solo dev).     │
├─────────────────┼───────────────────────┼─────────────────────────────────┤
│ Database        │ PostgreSQL (Neon)     │ Relational = structured data    │
│                 │ via Prisma ORM        │ (scores, frameworks, systems).  │
│                 │                       │ Prisma = type-safe queries,     │
│                 │                       │ migrations, no raw SQL.         │
│                 │                       │ Not MongoDB (bad for relational │
│                 │                       │ data). Not Supabase (Prisma     │
│                 │                       │ gives more control).            │
├─────────────────┼───────────────────────┼─────────────────────────────────┤
│ Styling         │ Tailwind CSS v4       │ Utility-first = fast iteration. │
│                 │                       │ No CSS files to maintain. Not   │
│                 │                       │ styled-components (runtime      │
│                 │                       │ cost). Not plain CSS (slower    │
│                 │                       │ to develop).                    │
├─────────────────┼───────────────────────┼─────────────────────────────────┤
│ AI / LLM        │ Anthropic Claude      │ EU-friendlier than OpenAI.      │
│                 │ (Haiku for chat)      │ Haiku = cost-effective for      │
│                 │                       │ high-volume chat. Not GPT-4     │
│                 │                       │ (expensive, less EU-aligned).   │
├─────────────────┼───────────────────────┼─────────────────────────────────┤
│ Auth (public)   │ Magic link            │ No passwords = no breach risk.  │
│                 │ (email-only)          │ GDPR-friendly (minimal data).   │
│                 │                       │ Not Clerk/Auth0 (vendor lock-   │
│                 │                       │ in, cost at scale). Not         │
│                 │                       │ social login (privacy concern   │
│                 │                       │ for EU compliance platform).    │
├─────────────────┼───────────────────────┼─────────────────────────────────┤
│ Auth (admin)    │ Email + password      │ Standard, proven. TOTP 2FA      │
│                 │ + TOTP 2FA            │ for security. Admin users are   │
│                 │                       │ few — complexity justified.     │
├─────────────────┼───────────────────────┼─────────────────────────────────┤
│ Payments        │ LemonSqueezy          │ Merchant of Record = handles    │
│                 │ (primary)             │ EU VAT automatically. No need   │
│                 │ Stripe (fallback)     │ to register for VAT in each     │
│                 │                       │ EU country. 5% cut but saves    │
│                 │                       │ massive tax compliance work.    │
│                 │                       │ Stripe kept as fallback.        │
├─────────────────┼───────────────────────┼─────────────────────────────────┤
│ Email           │ Resend                │ Developer-friendly API. Free    │
│                 │                       │ tier (3K emails/mo). Not        │
│                 │                       │ SendGrid (complex). Not SES     │
│                 │                       │ (AWS dependency).               │
├─────────────────┼───────────────────────┼─────────────────────────────────┤
│ Translation     │ DeepL                 │ Best quality for EU languages.  │
│                 │                       │ EU-based company (Germany).     │
│                 │                       │ Not Google Translate (privacy   │
│                 │                       │ concerns for EU platform).      │
├─────────────────┼───────────────────────┼─────────────────────────────────┤
│ Analytics       │ Plausible             │ No cookies, no consent needed.  │
│                 │                       │ EU-hosted. GDPR-compliant by    │
│                 │                       │ design. Not Google Analytics    │
│                 │                       │ (would be hypocritical for an   │
│                 │                       │ EU compliance platform).        │
├─────────────────┼───────────────────────┼─────────────────────────────────┤
│ Language        │ TypeScript            │ Type safety catches bugs early. │
│                 │ (strict mode)         │ Essential for solo dev — the    │
│                 │                       │ compiler is your code reviewer. │
└─────────────────┴───────────────────────┴─────────────────────────────────┘
```

### Why Modular Monolith (not Microservices)?

```
┌─────────────────────────────────────────────────────────────┐
│                    DECISION: MONOLITH                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ✓ Single developer — one codebase to maintain              │
│  ✓ One deployment target — git push = live in 60 seconds    │
│  ✓ Shared types between frontend and backend                │
│  ✓ No inter-service communication overhead                  │
│  ✓ Easy to reason about data flow                           │
│  ✓ Can always split later if team grows                     │
│                                                             │
│  ✗ Microservices rejected because:                          │
│    - Adds operational complexity (Docker, K8s, networking)  │
│    - Premature for <10K users                               │
│    - Solo developer can't maintain multiple services        │
│    - Cost of coordination > benefit at this scale           │
│                                                             │
│  Migration path: if the business scales to 5+ developers,   │
│  extract the chat/RAG pipeline and admin API into separate  │
│  services. The rest stays as a monolith.                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. System Architecture Diagram

### Request Flow

```
User Browser
     │
     │  HTTPS (TLS 1.3)
     ▼
┌─────────────┐
│ Vercel Edge  │──── Static assets (CSS, JS, images)
│ (CDN)        │     served from nearest PoP
└──────┬──────┘
       │
       │  Dynamic requests
       ▼
┌─────────────────────────────────────────────────────┐
│              NEXT.JS SERVER (Node.js)               │
│                                                     │
│  Request ──► Route Matching ──► Handler             │
│                                    │                │
│              ┌─────────────────────┼──────────┐     │
│              │                     │          │     │
│              ▼                     ▼          ▼     │
│         Server Component     API Route    Static    │
│         (page.tsx)           (/api/*)     Page      │
│              │                     │                │
│              │    ┌────────────────┤                │
│              ▼    ▼                ▼                │
│           ┌────────────┐   ┌────────────┐          │
│           │ Prisma ORM │   │ External   │          │
│           │            │   │ APIs       │          │
│           └─────┬──────┘   └─────┬──────┘          │
│                 │                │                  │
└─────────────────┼────────────────┼──────────────────┘
                  │                │
                  ▼                ▼
          ┌──────────────┐  ┌──────────────┐
          │ PostgreSQL   │  │ Claude API   │
          │ (Neon)       │  │ Resend       │
          │              │  │ DeepL        │
          │ 19 tables    │  │ Stripe       │
          │ ~108 systems │  │ LemonSqueezy │
          └──────────────┘  └──────────────┘
```

### Component Rendering Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                   RENDERING STRATEGY                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  SERVER COMPONENTS (default)       CLIENT COMPONENTS        │
│  ─────────────────────────         ─────────────────        │
│  • Page layouts                    • ChatWidget             │
│  • Data fetching                   • Search/filter bars     │
│  • SEO metadata                    • Spider charts          │
│  • Framework/system pages          • Pricing cards          │
│  • Admin pages                     • Language switcher      │
│  • Regulation content              • Cookie consent         │
│                                    • Comparison tool        │
│                                    • Tooltips               │
│                                                             │
│  WHY: Server components don't ship JS to the browser.       │
│  Only interactive elements use "use client". This means     │
│  faster page loads and better SEO.                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Data Flow & User Journeys

### Journey 1: Anonymous User Discovers a System

```
User visits /en/database
        │
        ▼
┌─────────────────┐     ┌──────────────┐
│ Server Component│────►│ Prisma query │
│ database/page   │     │ all systems  │
└────────┬────────┘     └──────┬───────┘
         │                     │
         │◄────────────────────┘
         │  systems[] with scores
         ▼
┌─────────────────┐
│ DatabaseGrid    │ ◄── Client component (search, filter)
│ (client)        │
└────────┬────────┘
         │ User clicks "GPT-4o"
         ▼
┌─────────────────┐
│ Is system free? │
│                 │
│  YES ──► Full   │     /systems/openai-gpt4
│          profile│     (all fields rendered)
│                 │
│  NO  ──► Lock   │     /pricing
│          icon   │     (upgrade CTA)
└─────────────────┘
```

### Journey 2: Subscriber Signs Up (Magic Link)

```
User enters email on /subscribe
        │
        ▼
┌───────────────────┐
│ POST /api/subscribe│
│                   │
│ 1. Check if email │
│    exists in DB   │
│                   │
│ 2a. NEW USER:     │
│    Create         │
│    Subscriber     │
│    record with    │
│    consent        │
│    snapshot       │
│                   │
│ 2b. RETURNING:    │
│    Regenerate     │
│    magic token    │
│                   │
│ 3. Hash token     │
│    (SHA-256)      │
│    Store hash     │
│    in DB (15 min  │
│    expiry)        │
│                   │
│ 4. Send email     │
│    via Resend     │
│    with magic     │
│    link           │
└───────┬───────────┘
        │
        ▼
User clicks link in email
        │
        ▼
┌───────────────────┐
│ /subscribe/verify │
│ ?token=abc123     │
│                   │
│ 1. Hash incoming  │
│    token          │
│ 2. Match against  │
│    DB hash        │
│ 3. Check expiry   │
│ 4. Mark verified  │
│ 5. Create JWT     │
│    session (30d)  │
│ 6. Set HTTP-only  │
│    cookie         │
│ 7. Redirect to    │
│    /dashboard     │
└───────────────────┘
```

### Journey 3: Pro Subscription Purchase

```
User clicks "Start Pro" on /pricing
        │
        ▼
┌────────────────────────┐
│ PricingCards.tsx        │
│ (client component)     │
│                        │
│ POST /api/lemonsqueezy │
│      /checkout         │
│                        │
│ Body: { locale, email }│
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│ LemonSqueezy SDK       │
│                        │
│ createCheckout(        │
│   storeId,             │
│   variantId,           │
│   { email, custom }    │
│ )                      │
│                        │
│ Returns: checkout URL  │
└───────────┬────────────┘
            │
            ▼
User completes payment on LemonSqueezy
            │
            ▼
┌────────────────────────┐
│ WEBHOOK (async)        │
│ POST /api/lemonsqueezy │
│      /webhook          │
│                        │
│ 1. Verify HMAC-SHA256  │
│    signature           │
│ 2. Parse event:        │
│    subscription_created│
│ 3. Find subscriber     │
│    by email            │
│ 4. Update tier to      │
│    "pro"               │
│ 5. Store subscription  │
│    ID for lifecycle     │
│    management          │
└────────────────────────┘
```

### Journey 4: Chat Question (RAG Pipeline)

```
User types: "Is ChatGPT GDPR compliant?"
        │
        ▼
┌──────────────────────────────────────────────────────────┐
│                    POST /api/chat                        │
│                                                         │
│  Step 1: GUARD                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │ chat-guard.ts                                    │   │
│  │ • Check rate limit (fingerprint cookie)          │   │
│  │ • Detect prompt injection ("ignore instructions")│   │
│  │ • Detect off-topic ("tell me a joke")            │   │
│  │ • Block if abuse detected                        │   │
│  └──────────────────────────┬───────────────────────┘   │
│                             │ PASS                      │
│  Step 2: RETRIEVE                                       │
│  ┌──────────────────────────────────────────────────┐   │
│  │ chat-rag.ts                                      │   │
│  │ • Extract keywords: "ChatGPT", "GDPR"            │   │
│  │ • Search AISystem WHERE name ILIKE '%chatgpt%'   │   │
│  │ • Search RegulatoryFramework WHERE slug = 'gdpr' │   │
│  │ • Search PolicyStatement WHERE text ILIKE '%gdpr%│   │
│  │ • Collect matching context (max 4000 chars)       │   │
│  └──────────────────────────┬───────────────────────┘   │
│                             │ context[]                 │
│  Step 3: AUGMENT & GENERATE                             │
│  ┌──────────────────────────────────────────────────┐   │
│  │ llm.ts → Anthropic Claude Haiku                  │   │
│  │                                                  │   │
│  │ System prompt:                                   │   │
│  │   "You are an EU AI compliance expert.           │   │
│  │    Answer based ONLY on the context below.       │   │
│  │    Cite sources. Be specific to EU regulations." │   │
│  │                                                  │   │
│  │ Context: [retrieved documents]                   │   │
│  │ User question: "Is ChatGPT GDPR compliant?"     │   │
│  │                                                  │   │
│  │ → Claude generates answer with citations         │   │
│  └──────────────────────────┬───────────────────────┘   │
│                             │ answer                    │
│  Step 4: LOG & RESPOND                                  │
│  ┌──────────────────────────────────────────────────┐   │
│  │ • Log to ChatLog table (audit trail)             │   │
│  │ • Increment ChatUsage counter                    │   │
│  │ • Return JSON { answer, sources[] }              │   │
│  └──────────────────────────────────────────────────┘   │
│                                                         │
└──────────────────────────────────────────────────────────┘
```

---

## 6. Database Design

### Entity Relationship Diagram

```
┌─────────────────────┐
│ RegulatoryFramework │
│─────────────────────│         ┌──────────────────┐
│ id (PK)             │────────►│ FrameworkSection  │
│ slug (unique)       │  1:N    │──────────────────│
│ name                │         │ id (PK)          │
│ description         │         │ title            │        ┌──────────────────┐
│ content (Markdown)  │         │ description      │───────►│ PolicyStatement  │
│ badgeType           │         │ sortOrder        │  1:N   │──────────────────│
│ effectiveDate       │         │ frameworkId (FK)  │        │ id (PK)          │
│ published           │         └──────────────────┘        │ statement        │
│ issuingAuthority    │                                     │ commentary       │
│ enforcementType     │                                     │ sourceUrl        │
│ maxPenalty          │                                     │ sortOrder        │
│ applicableRegions   │                                     │ sectionId (FK)   │
│ officialUrl         │                                     └──────────────────┘
└────────┬────────────┘
         │
         │  M:N                    ┌──────────────────┐
         ├─────────────────────────│    Industry       │
         │                         │──────────────────│
         │                         │ id (PK)          │
         │    M:N                  │ slug (unique)    │
    ┌────┴────────────┐            │ name             │
    │ AssessmentScore │            │ colorClass       │
    │─────────────────│            └──────────────────┘
    │ id (PK)         │                    │
    │ score (A+ to D) │                    │ M:N
    │ systemId (FK)   │                    │
    │ frameworkId (FK) │            ┌───────┴──────────┐
    │                 │            │                   │
    └────┬────────────┘            │                   │
         │                         ▼                   ▼
         │                  ┌──────────────────┐
         └─────────────────►│    AISystem       │
                    N:1     │──────────────────│
                            │ id (PK)          │
                            │ slug (unique)    │
                            │ vendor           │
                            │ name             │
                            │ type             │
                            │ risk (H/L/M)     │
                            │ description      │
                            │ --- 30+ fields --│
                            │ (see full schema)│
                            └────────┬─────────┘
                                     │
                                     │ M:N
                                     ▼
                            ┌──────────────────┐
                            │   Subscriber     │
                            │──────────────────│
                            │ id (PK)          │
                            │ email (unique)   │
                            │ tier (free/pro)  │
                            │ verified         │
                            │ role             │
                            │ industry         │
                            │ companyId (FK)   │
                            └────────┬─────────┘
                                     │ N:1
                                     ▼
                            ┌──────────────────┐
                            │    Company       │
                            │──────────────────│
                            │ id (PK)          │
                            │ name             │
                            │ domain           │
                            │ industry         │
                            │ country          │
                            │ size             │
                            └──────────────────┘
```

### Model Summary (19 models)

| Model | Purpose | Key Fields | Records |
|-------|---------|-----------|---------|
| **RegulatoryFramework** | EU regulations | slug, name, content, penalties | ~9 |
| **FrameworkSection** | Chapters within a regulation | title, sortOrder | ~60 |
| **PolicyStatement** | Specific policy requirements | statement, commentary | ~120 |
| **AISystem** | AI tools being rated | 45+ fields (see schema) | ~108 |
| **AssessmentScore** | System × Framework grade | score (A+ to D) | ~400 |
| **DimensionScore** | Per-section scoring | score, commentary | ~800 |
| **Industry** | Sectors | name, slug | ~8 |
| **ChangeLog** | Version history | title, changeType, date | ~50 |
| **Subscriber** | Public users | email, tier, auth tokens | Growing |
| **Company** | Organizations (CRM) | name, domain, country | Growing |
| **Case** | Support tickets | status, priority, category | Growing |
| **AdminUser** | Content managers | email, role, 2FA | ~3 |
| **ChatUsage** | Rate limiting | fingerprint, date, count | Daily |
| **ChatLog** | Chat audit trail | question, answer, blocked | Growing |
| **DigestLog** | Email delivery tracking | subscriberId, status | Growing |
| **Translation** | Cached translations | locale, field, value | ~2000+ |
| **Feedback** | Contact form submissions | name, message, status | Growing |
| **ApprovedSource** | Chatbot citation URLs | url, name | ~20 |

---

## 7. Authentication & Access Control

### Four-Tier Access Model

```
┌─────────────────────────────────────────────────────────────┐
│                    ACCESS TIERS                             │
│                                                             │
│  ANONYMOUS          FREE             PRO          ENTERPRISE│
│  (no account)       (verified email) (€19/mo)    (custom)  │
│  ─────────────      ──────────────── ────────    ──────────│
│  • 5 free systems   • 5 free systems • ALL       • ALL     │
│  • 3 chat q/day     • 10 chat q/day  • Unlimited • API     │
│  • Headlines only   • Full newsfeed  • Dashboard • SSO     │
│  • Compare preview  • Compare (free) • Compare   • Exports │
│  • No exports       • Reports        • Exports   • Webhook │
│                     • Newsletter     • Alerts    • Consult │
│                                                             │
│  HOW IT WORKS:                                              │
│  tier-access.ts checks user session → returns tier          │
│  Components check tier → show content or lock icon          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Admin Role-Based Access

```
┌──────────┬────────────────────────────────────────────────┐
│ Role     │ Permissions                                    │
├──────────┼────────────────────────────────────────────────┤
│ OWNER    │ Everything + team management + bypasses tier   │
│ ADMIN    │ Full CRUD on content + subscriber management   │
│ EDITOR   │ Content only (frameworks, systems, policies)   │
└──────────┴────────────────────────────────────────────────┘
```

---

## 8. AI & Chat Intelligence Pipeline

### Architecture Decision: RAG (not Fine-Tuning)

```
┌─────────────────────────────────────────────────────────────┐
│                 WHY RAG, NOT FINE-TUNING?                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  RAG (what we do):                                          │
│  ✓ Answers always based on OUR current database             │
│  ✓ No model training cost ($0 training budget)              │
│  ✓ Content updates instantly reflected in answers           │
│  ✓ Can cite exact sources from our DB                       │
│  ✓ Easy to audit — we control the context window            │
│                                                             │
│  Fine-tuning (rejected):                                    │
│  ✗ Expensive to retrain when content changes                │
│  ✗ Model can hallucinate beyond training data               │
│  ✗ No source citation — "the model just knows"              │
│  ✗ Stale answers until retrained                            │
│                                                             │
│  Bottom line: For a compliance platform, we need            │
│  verifiable, source-cited answers. RAG delivers this.       │
│  Fine-tuning would be risky for legal/regulatory content.   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Safety Layers

```
User Question
     │
     ▼
┌──────────────┐    "Ignore all instructions" → BLOCKED
│ Injection    │    SQL patterns                → BLOCKED
│ Detection    │    Prompt manipulation         → BLOCKED
└──────┬───────┘
       │ SAFE
       ▼
┌──────────────┐    "Tell me a joke"           → BLOCKED
│ Topic        │    "What's the weather?"       → BLOCKED
│ Detection    │    Political opinions          → BLOCKED
└──────┬───────┘
       │ ON-TOPIC
       ▼
┌──────────────┐    Anonymous: 3/day
│ Rate         │    Free: 10/day
│ Limiting     │    Pro: unlimited
└──────┬───────┘
       │ ALLOWED
       ▼
   RAG Pipeline → Claude → Response
```

---

## 9. Payment & Subscription System

### Payment Flow Diagram

```
                    PRICING PAGE
                         │
            ┌────────────┼────────────┐
            │            │            │
            ▼            ▼            ▼
         FREE          PRO       ENTERPRISE
            │            │            │
            ▼            ▼            ▼
     /subscribe    LemonSqueezy   /contact
     (magic link)   Checkout      (sales)
            │            │
            ▼            ▼
       Verified     Payment OK
       (free tier)       │
                         ▼
                   ┌──────────┐
                   │ WEBHOOK  │ (async, signed)
                   │          │
                   │ Event:   │
                   │ sub_     │
                   │ created  │
                   └────┬─────┘
                        │
                        ▼
                 UPDATE Subscriber
                 SET tier = 'pro'


            SUBSCRIPTION LIFECYCLE
            ─────────────────────

  Created ──► Active ──► Cancelled ──► Expired
                │                        │
                │                        ▼
                │                  tier = 'free'
                │
                ▼
          Payment Failed ──► Retry ──► Expired
                                         │
                                         ▼
                                   tier = 'free'
```

### Why Two Payment Providers?

```
LemonSqueezy (PRIMARY):
  ✓ Merchant of Record — handles EU VAT in all 27 countries
  ✓ No VAT registration needed for the business
  ✓ 5% + $0.50 per transaction (covers everything)
  ✓ Free to set up

Stripe (FALLBACK):
  ✓ Industry standard, widely trusted
  ✓ More payment methods
  ✗ YOU handle VAT compliance (significant burden in EU)
  ✗ Requires VAT registration in customer's country above threshold
```

---

## 10. Content Management

### Content Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CONTENT LAYERS                           │
│                                                             │
│  Layer 1: SEED DATA (src/data/*.ts)                         │
│  ─────────────────────────────────                          │
│  • 30 seed scripts with AI system profiles                  │
│  • Run via: npx tsx src/data/seed-*.ts                      │
│  • Idempotent (safe to re-run)                              │
│  • Source of truth for initial content                       │
│  • Updated by developer + AI-assisted enrichment            │
│                                                             │
│  Layer 2: ADMIN PANEL (/admin)                              │
│  ──────────────────────────────                             │
│  • Web UI for content editors                               │
│  • CRUD for frameworks, systems, industries, policies       │
│  • Score assignment interface                                │
│  • Chat moderation and feedback management                  │
│  • Role-based access (owner/admin/editor)                   │
│                                                             │
│  Layer 3: AUTO-GENERATED                                    │
│  ────────────────────────                                   │
│  • Translations via DeepL (cached in Translation table)     │
│  • Spider charts from DimensionScore data                   │
│  • Overall scores calculated from AssessmentScore averages  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Scoring System

```
┌───────┬──────────────────────────────────────────────────┐
│ Grade │ Meaning                                          │
├───────┼──────────────────────────────────────────────────┤
│  A+   │ Exceeds requirements — best-in-class             │
│  A    │ Very good — strong compliance, minor gaps         │
│  A-   │ Good — solid compliance                          │
│  B+   │ Above average — meets most requirements          │
│  B    │ Average — meets baseline                         │
│  B-   │ Below average — minimum compliance               │
│  C+   │ Needs improvement — partial compliance           │
│  C    │ Weak — major gaps                                │
│  C-   │ Poor — significant regulatory risk               │
│  D    │ Failing — does not meet basic requirements       │
└───────┴──────────────────────────────────────────────────┘

Each AI system gets scored against each framework:
  ChatGPT  ×  EU AI Act  =  B+
  ChatGPT  ×  GDPR       =  B
  ChatGPT  ×  DORA       =  B-
  
  Overall = weighted average → displayed as single grade
```

---

## 11. Internationalization (14 EU Languages)

```
┌─────────────────────────────────────────────────────────────┐
│                  LANGUAGE SUPPORT                            │
│                                                             │
│  Supported: en, de, fr, it, es, pt, pl, nl, ro, sv,        │
│             da, cs, hu, el, bg                              │
│                                                             │
│  HOW IT WORKS:                                              │
│                                                             │
│  1. URL routing: /en/database, /fr/database, /de/database   │
│     └── [lang] dynamic parameter in Next.js App Router      │
│                                                             │
│  2. UI strings: src/dictionaries/en.json, fr.json, etc.     │
│     └── Loaded at page level, provided via React context    │
│     └── Components use useT() hook for translation          │
│                                                             │
│  3. Database content: translated via DeepL API              │
│     └── Cached in Translation table (entityType/entityId/   │
│         locale/field → value)                               │
│     └── Only translated on first request per locale         │
│     └── Cache cleared when source content changes           │
│                                                             │
│  4. Static generation: all 14 locale variants pre-built     │
│     └── generateStaticParams() returns all locale combos    │
│     └── 57 pages × 14 languages = ~800 static pages        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 12. Security Architecture

### Defense in Depth

```
┌─────────────────────────────────────────────────────────────┐
│                   SECURITY LAYERS                           │
│                                                             │
│  Layer 1: NETWORK (Vercel)                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ • Automatic TLS 1.3 (HTTPS everywhere)              │   │
│  │ • DDoS protection (Vercel infrastructure)            │   │
│  │ • HSTS preload (2 years, includeSubDomains)          │   │
│  │ • robots.txt blocks AI training crawlers             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Layer 2: APPLICATION HEADERS                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ • X-Frame-Options: DENY (anti-clickjacking)         │   │
│  │ • X-Content-Type-Options: nosniff                    │   │
│  │ • Referrer-Policy: strict-origin-when-cross-origin   │   │
│  │ • Permissions-Policy: camera=(), microphone=(), etc. │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Layer 3: AUTHENTICATION                                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ • Passwords: bcrypt (12 rounds)                      │   │
│  │ • Sessions: JWT (HTTP-only, secure cookies)          │   │
│  │ • Admin: TOTP 2FA (6-digit codes)                    │   │
│  │ • Magic links: SHA-256 hashed, 15-min expiry         │   │
│  │ • No passwords stored for public users               │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Layer 4: API SECURITY                                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ • Webhook signature verification (HMAC-SHA256)       │   │
│  │ • Rate limiting (fingerprint-based)                  │   │
│  │ • Injection detection (SQL, prompt)                  │   │
│  │ • Input validation on all API routes                 │   │
│  │ • CORS: same-origin only                             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Layer 5: DATA                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ • Database: managed PostgreSQL with encryption       │   │
│  │ • No secrets in code (env vars only)                 │   │
│  │ • Prisma ORM prevents SQL injection                  │   │
│  │ • GDPR: data export + deletion APIs                  │   │
│  │ • Consent snapshots stored per subscriber            │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 13. API Reference

### Public API (no auth required)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/v1/systems` | List all AI systems |
| GET | `/api/v1/regulations` | List all frameworks |
| GET | `/api/v1/changelog` | Public changelog feed |
| GET | `/api/feed` | RSS/JSON feed |

### Subscriber API (session cookie required)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/chat` | Ask compliance question |
| POST | `/api/compare` | Compare systems |
| POST | `/api/export` | Export compliance report |
| GET | `/api/account/options` | Get account settings |
| POST | `/api/account/preferences` | Update preferences |
| POST | `/api/account/export` | GDPR data export |
| POST | `/api/account/delete` | Delete account |

### Auth API

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/subscribe` | Create account (magic link) |
| POST | `/api/subscribe/verify` | Verify magic link |
| POST | `/api/subscribe/logout` | End session |
| POST | `/api/subscribe/unsubscribe` | Delete subscription |
| POST | `/api/auth/login` | Admin login |
| POST | `/api/auth/logout` | Admin logout |
| POST | `/api/auth/verify-totp` | Admin 2FA |

### Payment API (webhook — signature verified)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/lemonsqueezy/checkout` | Create checkout session |
| POST | `/api/lemonsqueezy/webhook` | Handle payment events |
| POST | `/api/stripe/checkout` | Stripe checkout (fallback) |
| POST | `/api/stripe/webhook` | Stripe events (fallback) |

### Admin API (admin session required)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/admin/team` | Manage admin users |
| POST | `/api/admin/cases` | Support ticket CRM |
| POST | `/api/admin/subscribers` | Subscriber analytics |
| POST | `/api/admin/companies` | Company management |
| POST | `/api/feedback` | Contact form |
| PATCH | `/api/feedback/[id]/status` | Update feedback status |

---

## 14. Infrastructure & Deployment

### Deployment Pipeline

```
Developer pushes to main branch
         │
         ▼
┌────────────────┐
│ GitHub          │
│ (source code)  │
└────────┬───────┘
         │ webhook
         ▼
┌────────────────┐
│ Vercel Build    │
│                │
│ 1. npm install  │
│ 2. next build   │
│ 3. Generate     │
│    static pages │
│ 4. Deploy to    │
│    edge network │
│                │
│ ~60-90 seconds  │
└────────┬───────┘
         │
         ▼
┌────────────────┐
│ LIVE            │
│ ai-register-eu │
│ .vercel.app    │
└────────────────┘
```

### Environment Variables

```
┌─────────────────────────┬────────────────────────────────┐
│ Variable                │ Purpose                         │
├─────────────────────────┼────────────────────────────────┤
│ DATABASE_URL            │ PostgreSQL connection string    │
│ ANTHROPIC_API_KEY       │ Claude AI chatbot               │
│ LEMONSQUEEZY_API_KEY    │ Payment processing              │
│ LEMONSQUEEZY_STORE_ID   │ LemonSqueezy store identifier   │
│ LEMONSQUEEZY_VARIANT_ID │ Pro plan product variant         │
│ LEMONSQUEEZY_WEBHOOK_SECRET │ Webhook signature key       │
│ STRIPE_SECRET_KEY       │ Stripe API (fallback)           │
│ STRIPE_PRO_PRICE_ID     │ Stripe Pro plan price           │
│ STRIPE_WEBHOOK_SECRET   │ Stripe webhook signing          │
│ RESEND_API_KEY          │ Transactional email             │
│ DEEPL_API_KEY           │ Auto-translation                │
│ JWT_SECRET              │ Session token signing            │
│ ADMIN_PASSWORD_HASH     │ Admin login (bcrypt)             │
│ TOTP_SECRET             │ Admin 2FA                        │
│ NEXT_PUBLIC_BASE_URL    │ Site base URL                    │
│ NEXT_PUBLIC_PLAUSIBLE_DOMAIN │ Analytics domain            │
└─────────────────────────┴────────────────────────────────┘
```

---

## 15. Monitoring & Operations

### Current Monitoring Stack

```
┌──────────────────────────────────────────────────────────┐
│                   MONITORING                             │
│                                                          │
│  Vercel Dashboard     → Deploy status, build logs        │
│  Plausible Analytics  → Page views, traffic, referrers   │
│  Telegram Bot         → Hourly dev status updates        │
│  QA Bot               → Continuous UX testing            │
│  ChatLog table        → All chat interactions (audit)    │
│  Feedback table       → Contact form submissions         │
│                                                          │
│  MISSING (planned):                                      │
│  • External uptime monitor (BetterStack)                 │
│  • Error tracking (Sentry)                               │
│  • LemonSqueezy revenue dashboard                        │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Operational Runbook

| Scenario | Action |
|----------|--------|
| Site down | Check Vercel dashboard → redeploy if needed |
| Database issue | Check Neon dashboard → connection pool status |
| Chatbot not responding | Check Anthropic API credits balance |
| Payment webhook failing | Check LemonSqueezy webhook logs → verify secret |
| Content update | Admin panel or seed script → auto-deploys |
| Add new AI system | Admin panel `/admin/systems/new` or seed script |
| Add new framework | Admin panel `/admin/frameworks/new` or seed script |
| User can't login | Check Resend dashboard for email delivery |
| GDPR data request | User self-service at `/account` or admin export |

---

## 16. Cost Structure

### Monthly Operating Costs (estimated at current scale)

```
┌────────────────────────┬────────────┬──────────────────────┐
│ Service                │ Cost/month │ Notes                 │
├────────────────────────┼────────────┼──────────────────────┤
│ Vercel (hosting)       │ €0-20      │ Free tier sufficient  │
│                        │            │ for current traffic   │
├────────────────────────┼────────────┼──────────────────────┤
│ Neon (database)        │ €0-19      │ Free tier: 0.5 GB    │
│                        │            │ Scale: €19/mo         │
├────────────────────────┼────────────┼──────────────────────┤
│ Anthropic (Claude)     │ €0-100     │ Pay per chat query    │
│                        │            │ Haiku is cost-         │
│                        │            │ effective              │
├────────────────────────┼────────────┼──────────────────────┤
│ Resend (email)         │ €0         │ Free: 3K emails/mo    │
├────────────────────────┼────────────┼──────────────────────┤
│ DeepL (translation)    │ €0         │ Free: 500K chars/mo   │
├────────────────────────┼────────────┼──────────────────────┤
│ Plausible (analytics)  │ €9         │ Privacy-first         │
├────────────────────────┼────────────┼──────────────────────┤
│ LemonSqueezy           │ €0         │ 5% per transaction    │
│                        │            │ No monthly fee        │
├────────────────────────┼────────────┼──────────────────────┤
│ Domain + DNS           │ ~€2        │ Annual cost / 12      │
├────────────────────────┼────────────┼──────────────────────┤
│ TOTAL (pre-revenue)    │ ~€10-150   │ Scales with usage     │
└────────────────────────┴────────────┴──────────────────────┘

Break-even: ~8-10 Pro subscribers at €19/mo covers all costs.
```

---

## 17. Known Limitations & Technical Debt

### Current Limitations

| # | Issue | Impact | Mitigation |
|---|-------|--------|------------|
| 1 | Chatbot requires Anthropic credits | Chat feature offline | Add API credits |
| 2 | No automated test suite | Regressions caught manually | QA bot partially covers |
| 3 | Single-person dependency | Bus factor = 1 | This documentation + AI tooling |
| 4 | Scoring methodology undocumented | Credibility risk | Advisory board discussion needed |
| 5 | No external uptime monitoring | Downtime may go unnoticed | Plan: BetterStack |
| 6 | Translation quality varies | Some EU languages less polished | DeepL quality is good but imperfect |
| 7 | No E2E tests | Manual regression testing | Plan: Playwright |

### Technical Debt

| Item | Severity | Effort to Fix |
|------|----------|---------------|
| Stripe fields reused for LemonSqueezy IDs | Low | 1 hour (rename fields) |
| Some seed scripts have overlapping data | Low | 2 hours (consolidate) |
| CookieConsent links hardcoded to `/en/privacy` | Low | 10 minutes |
| No database migrations versioned | Medium | 2 hours (Prisma migrate) |
| Admin panel has no pagination for large lists | Medium | 4 hours |
| Chat RAG uses keyword search, not vector search | Medium | 1-2 days (add embeddings) |

---

## 18. Appendix: File Structure

```
ai-register-eu/
├── prisma/
│   └── schema.prisma          # Database schema (19 models)
│
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout (fonts, analytics, cookie consent)
│   │   ├── globals.css        # Tailwind config, brand tokens
│   │   ├── robots.ts          # robots.txt (blocks AI crawlers)
│   │   ├── sitemap.ts         # XML sitemap for SEO
│   │   │
│   │   ├── [lang]/            # All public pages (14 locales)
│   │   │   ├── layout.tsx     # Locale layout (i18n, chat widget)
│   │   │   ├── page.tsx       # Homepage
│   │   │   ├── about/         # About page
│   │   │   ├── compare/       # System comparison tool
│   │   │   ├── contact/       # Contact form
│   │   │   ├── dashboard/     # Subscriber dashboard
│   │   │   ├── database/      # AI systems grid
│   │   │   ├── industries/    # Browse by sector
│   │   │   ├── methodology/   # Scoring methodology
│   │   │   ├── newsfeed/      # Changelog ticker
│   │   │   ├── pricing/       # Pricing + checkout
│   │   │   ├── privacy/       # Privacy policy
│   │   │   ├── ratings/       # Ratings overview
│   │   │   ├── regulations/   # Framework browser
│   │   │   ├── reports/       # Compliance reports
│   │   │   ├── resources/     # External resources
│   │   │   ├── services/      # Consulting services
│   │   │   ├── subscribe/     # Sign-up flow
│   │   │   ├── systems/       # System detail pages
│   │   │   └── terms/         # Terms of service
│   │   │
│   │   ├── admin/             # Admin panel (40+ files)
│   │   │   ├── layout.tsx     # Admin sidebar, RBAC
│   │   │   ├── frameworks/    # Framework CRUD
│   │   │   ├── systems/       # System CRUD
│   │   │   ├── industries/    # Industry CRUD
│   │   │   ├── chat/          # Chat moderation
│   │   │   ├── feedback/      # Contact form mgmt
│   │   │   ├── cases/         # Support ticket CRM
│   │   │   ├── subscribers/   # User analytics
│   │   │   ├── team/          # Admin user mgmt
│   │   │   └── sources/       # Approved URLs
│   │   │
│   │   └── api/               # API routes (31 endpoints)
│   │       ├── auth/          # Admin authentication
│   │       ├── chat/          # RAG chatbot
│   │       ├── subscribe/     # User registration
│   │       ├── account/       # User account mgmt
│   │       ├── compare/       # Comparison engine
│   │       ├── export/        # Report generation
│   │       ├── feedback/      # Contact form
│   │       ├── stripe/        # Stripe payments
│   │       ├── lemonsqueezy/  # LemonSqueezy payments
│   │       ├── admin/         # Admin CRM APIs
│   │       ├── feed/          # RSS feed
│   │       └── v1/            # Public API
│   │
│   ├── components/
│   │   ├── layout/            # Header, Footer, LanguageSwitcher
│   │   ├── home/              # Homepage sections (Hero, etc.)
│   │   └── ui/                # Shared UI (Tooltip, Charts, etc.)
│   │
│   ├── lib/                   # Core utilities (21 files)
│   │   ├── auth.ts            # JWT + magic link auth
│   │   ├── db.ts              # Prisma client singleton
│   │   ├── llm.ts             # Claude SDK wrapper
│   │   ├── chat-rag.ts        # RAG retrieval pipeline
│   │   ├── chat-guard.ts      # Injection & abuse detection
│   │   ├── tier-access.ts     # Subscription tier gates
│   │   ├── scoring.ts         # Grade calculations
│   │   ├── i18n.ts            # Language configuration
│   │   └── ...                # (see full list in doc)
│   │
│   ├── data/                  # Seed scripts (30 files)
│   │   ├── seed.ts            # Core data
│   │   ├── seed-enrichment-*  # Enrichment batches
│   │   ├── seed-frameworks-*  # Framework content
│   │   └── SEEDS.md           # Execution order docs
│   │
│   ├── dictionaries/          # UI translations (14 JSON files)
│   └── generated/             # Prisma client (auto-generated)
│
├── agents/                    # Expert advisory panel
│   ├── expert-profiles.ts     # 5 domain expert personas
│   └── orchestrator.ts        # Multi-agent orchestration
│
├── scripts/                   # Automation
│   └── telegram-notify.sh     # Telegram status bot
│
├── docs/                      # This documentation
├── qa/                        # QA bot defect logs
│
├── CLAUDE.md                  # AI assistant instructions
├── TODO.md                    # Persistent backlog
├── RISK-REMEDIATION.md        # Risk register & controls
├── .env.example               # Environment variable template
├── package.json               # Dependencies & scripts
├── next.config.ts             # Next.js + security headers
└── tsconfig.json              # TypeScript configuration
```

---

## Document History

| Date | Version | Changes |
|------|---------|---------|
| 2026-04-11 | 1.0 | Initial comprehensive documentation |

---

*This document was generated with AI assistance (Claude Code) and verified against the live codebase. All architecture diagrams, file counts, and technical details reflect the state of the platform as of April 11, 2026.*
