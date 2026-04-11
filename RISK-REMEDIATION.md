# AI Compass EU — Risk Remediation Plan

> Created: 11 April 2026
> Owner: Eric Devismes (CEO)
> Review cycle: Monthly

---

## Risk Register Summary

| # | Risk | Category | Likelihood | Impact | Rating | Status |
|---|------|----------|-----------|--------|--------|--------|
| R1 | No revenue / payment system | Financial | High | Critical | 🔴 Critical | Open |
| R2 | Chatbot non-functional (API credits) | Product | Confirmed | High | 🔴 Critical | Open |
| R3 | Scoring methodology not documented | Reputational | Medium | High | 🟠 High | Open |
| R4 | No anti-scraping / IP protection | Business | Medium | High | 🟠 High | Open |
| R5 | Single-person dependency | Operational | High | High | 🟠 High | Accepted |
| R6 | Content accuracy liability | Legal | Low | High | 🟡 Medium | Mitigated |
| R7 | GDPR compliance gaps | Legal | Low | Critical | 🟡 Medium | Mitigated |
| R8 | No monitoring / alerting | Operational | Medium | Medium | 🟡 Medium | Open |
| R9 | Vercel vendor lock-in | Technical | Low | Medium | 🟢 Low | Accepted |
| R10 | Limited test coverage | Technical | Medium | Medium | 🟡 Medium | Open |

---

## Detailed Remediation Plans

### R1: No Revenue / Payment System 🔴 Critical

**Risk**: Site is live but cannot collect payments. Free tier users have no upgrade path. Revenue = €0.

**Controls**:
| Control | Type | Owner | Deadline |
|---------|------|-------|----------|
| Integrate LemonSqueezy checkout for Pro/Enterprise tiers | Preventive | Dev | April 2026 |
| Webhook handler for subscription lifecycle events | Preventive | Dev | April 2026 |
| Subscription status stored in DB, checked on protected routes | Detective | Dev | April 2026 |
| Monthly revenue dashboard (LemonSqueezy analytics) | Detective | CEO | May 2026 |
| Cancellation/refund self-service flow | Corrective | Dev | May 2026 |

**Metrics**:
- KPI: Monthly Recurring Revenue (MRR) — target: €500 by Month 3
- KPI: Conversion rate (free → pro) — target: 3-5%
- KPI: Churn rate — target: <5% monthly
- Alert: Zero new subscriptions for 7 consecutive days

**Residual risk after controls**: Low (standard SaaS payment risk)

---

### R2: Chatbot Non-Functional 🔴 Critical

**Risk**: Chatbot is a core differentiator but returns errors due to zero Anthropic API credits.

**Controls**:
| Control | Type | Owner | Deadline |
|---------|------|-------|----------|
| Add Anthropic API credits (min €50) | Corrective | CEO | Immediate |
| Set up billing alerts at 80% credit usage | Detective | CEO | Immediate |
| Implement graceful fallback message when API is down | Preventive | Dev | April 2026 |
| Rate limiting per user tier (already implemented) | Preventive | Dev | ✅ Done |
| Monthly API cost tracking | Detective | CEO | Ongoing |

**Metrics**:
- KPI: Chatbot uptime — target: 99.5%
- KPI: Average response time — target: <3 seconds
- KPI: Monthly API cost — budget: €100/month initially
- Alert: API error rate > 5% in any 1-hour window

**Residual risk after controls**: Low

---

### R3: Scoring Methodology Not Documented 🟠 High

**Risk**: Users may challenge scores as arbitrary. Competitors could claim bias. No defensible methodology = credibility risk.

**Controls**:
| Control | Type | Owner | Deadline |
|---------|------|-------|----------|
| Document scoring methodology (public-facing summary) | Preventive | CEO + Advisory | May 2026 |
| Internal detailed methodology doc (proprietary) | Preventive | CEO | May 2026 |
| Add "How we score" section to each system page | Preventive | Dev | May 2026 |
| Advisory board review of methodology | Detective | Advisory Panel | May 2026 |
| Vendor dispute/correction process documented | Corrective | CEO | June 2026 |
| Disclaimer on all scores ("independent assessment, not legal advice") | Preventive | Dev | ✅ Done (in ToS) |

**Metrics**:
- KPI: Methodology page visits — indicates user interest in transparency
- KPI: Vendor disputes received — target: <2/month
- KPI: Score correction requests processed within 5 business days
- Alert: Public criticism of methodology (monitor mentions)

**Residual risk after controls**: Medium (inherent in any rating business)

---

### R4: No Anti-Scraping / IP Protection 🟠 High

**Risk**: Competitors or AI crawlers can bulk-scrape all system assessments, destroying the value of the Pro tier.

**Controls**:
| Control | Type | Owner | Deadline |
|---------|------|-------|----------|
| Rate limiting on API/page requests (basic) | Preventive | Dev | May 2026 |
| robots.txt restricting AI crawlers (GPTBot, CCBot, etc.) | Preventive | Dev | April 2026 |
| Server-side rendering of Pro content only for authenticated users | Preventive | Dev | April 2026 |
| Honeypot pages to detect scrapers | Detective | Dev | June 2026 |
| Vercel WAF rules for suspicious patterns | Preventive | Dev | May 2026 |
| DMCA / IP enforcement policy in ToS | Preventive | Legal | ✅ Done (in ToS) |

**Metrics**:
- KPI: Unusual traffic spikes (>10x normal for a page) — auto-alert
- KPI: Bot traffic percentage — target: <30% of total
- Alert: Single IP requesting >100 pages/hour

**Residual risk after controls**: Medium (determined scrapers always find ways)

---

### R5: Single-Person Dependency 🟠 High

**Risk**: Eric is sole developer, content creator, sales, and support. Bus factor = 1.

**Controls**:
| Control | Type | Owner | Deadline |
|---------|------|-------|----------|
| Document architecture and processes (retro-doc) | Preventive | Dev | May 2026 |
| Infrastructure as code (Vercel, managed DB) — no custom ops | Preventive | - | ✅ Done |
| AI-assisted development (Claude Code) reduces dependency | Mitigating | - | ✅ Done |
| Automated monitoring and Telegram alerts | Detective | Dev | ✅ Done |
| Revenue milestone → hire first contractor | Corrective | CEO | At €2K MRR |

**Metrics**:
- KPI: Documentation coverage — target: all key systems documented
- KPI: Time to onboard a new contributor — target: <1 day with docs
- Alert: No commits for 7+ days (may indicate blocker)

**Residual risk after controls**: Medium (accepted risk for bootstrapped startup)

---

### R6: Content Accuracy Liability 🟡 Medium

**Risk**: If AI system scores are inaccurate, vendors could claim defamation or users could claim reliance damages.

**Controls**:
| Control | Type | Owner | Deadline |
|---------|------|-------|----------|
| Disclaimer in ToS: "not legal advice, independent assessment" | Preventive | Legal | ✅ Done |
| "Last updated" dates on all assessments | Preventive | Dev | ✅ Done |
| Vendor correction request process | Corrective | CEO | June 2026 |
| Source citations for factual claims | Preventive | Dev | Ongoing |
| Advisory board peer review of top 20 assessments | Detective | Advisory | May 2026 |

**Metrics**:
- KPI: Content freshness — % of systems updated in last 90 days, target: >80%
- KPI: Vendor complaints — target: 0 legal threats
- Alert: Any vendor legal communication → immediate CEO escalation

**Residual risk after controls**: Low (standard for rating/review platforms)

---

### R7: GDPR Compliance Gaps 🟡 Medium

**Risk**: EU-focused platform must be exemplary on GDPR. Any gap = credibility destroyer.

**Controls**:
| Control | Type | Owner | Deadline |
|---------|------|-------|----------|
| Privacy Policy published | Preventive | Legal | ✅ Done |
| Cookie consent banner (essential-only) | Preventive | Dev | ✅ Done |
| Plausible Analytics (cookie-free, EU-hosted) | Preventive | Dev | ✅ Done |
| Data processing on Vercel (EU region available) | Preventive | Dev | Verify |
| No third-party trackers, no Google Analytics | Preventive | Dev | ✅ Done |
| Data Subject Access Request process documented | Corrective | CEO | May 2026 |
| Sub-processor register maintained | Detective | CEO | May 2026 |

**Metrics**:
- KPI: DSAR response time — target: <30 days (GDPR requirement)
- KPI: Number of third-party data processors — keep minimal
- Audit: Quarterly review of data flows and processors

**Residual risk after controls**: Low

---

### R8: No Monitoring / Alerting 🟡 Medium

**Risk**: Site could go down or degrade without anyone knowing until a user reports it.

**Controls**:
| Control | Type | Owner | Deadline |
|---------|------|-------|----------|
| Vercel built-in monitoring (deploy status) | Detective | - | ✅ Done |
| Telegram status bot (hourly) | Detective | Dev | ✅ Done |
| QA Bot continuous testing | Detective | Dev | ✅ Done |
| Uptime monitoring (external, e.g., BetterStack) | Detective | Dev | May 2026 |
| Error tracking (Sentry or similar) | Detective | Dev | May 2026 |

**Metrics**:
- KPI: Uptime — target: 99.9%
- KPI: P95 page load time — target: <2 seconds
- KPI: Error rate — target: <0.1% of requests
- Alert: Downtime > 5 minutes → Telegram notification

**Residual risk after controls**: Low

---

### R9: Vercel Vendor Lock-in 🟢 Low

**Risk**: Hosting dependency on Vercel. Migration would require effort but is feasible.

**Controls**:
| Control | Type | Owner | Deadline |
|---------|------|-------|----------|
| Standard Next.js — portable to any Node.js host | Mitigating | - | ✅ Done |
| Database on Neon (independent of Vercel) | Mitigating | - | ✅ Done |
| No Vercel-specific features beyond deployment | Mitigating | Dev | Ongoing |

**Metrics**:
- Review: Annual assessment of hosting costs vs. alternatives

**Residual risk after controls**: Low (accepted)

---

### R10: Limited Test Coverage 🟡 Medium

**Risk**: No automated tests. Regressions caught only by manual QA bot or user reports.

**Controls**:
| Control | Type | Owner | Deadline |
|---------|------|-------|----------|
| QA Bot continuous testing (functional) | Detective | Dev | ✅ Done |
| Add critical path E2E tests (Playwright) | Preventive | Dev | June 2026 |
| Build-time type checking (TypeScript strict) | Preventive | Dev | ✅ Done |
| Pre-commit lint checks | Preventive | Dev | ✅ Done |

**Metrics**:
- KPI: Number of E2E test scenarios — target: 20+ by June 2026
- KPI: Build success rate — target: >95%
- Alert: Build failure on main branch

**Residual risk after controls**: Medium (until E2E tests are in place)

---

## Priority Remediation Roadmap

| Priority | Action | Risk Addressed | Timeline |
|----------|--------|---------------|----------|
| 🥇 1 | Add Anthropic API credits | R2 | Immediate |
| 🥇 1 | LemonSqueezy payment integration | R1 | April 2026 |
| 🥈 2 | robots.txt for AI crawlers | R4 | This week |
| 🥈 2 | Pro content server-side gating | R4 | April 2026 |
| 🥉 3 | Scoring methodology documentation | R3 | May 2026 |
| 🥉 3 | Retro-documentation | R5 | May 2026 |
| 4 | External uptime monitoring | R8 | May 2026 |
| 4 | DSAR process + sub-processor register | R7 | May 2026 |
| 5 | E2E test suite | R10 | June 2026 |
| 5 | Vendor dispute process | R3, R6 | June 2026 |

---

## Risk Acceptance Log

| Risk | Accepted By | Date | Rationale |
|------|------------|------|-----------|
| R5 (Single-person) | Eric Devismes | 2026-04-11 | Bootstrapped startup; mitigated by AI tooling + docs |
| R9 (Vercel lock-in) | Eric Devismes | 2026-04-11 | Standard Next.js; migration feasible if needed |

---

## Review Schedule

- **Weekly**: Check open action items, update status
- **Monthly**: Review full risk register, update ratings
- **Quarterly**: Deep review with advisory board input
