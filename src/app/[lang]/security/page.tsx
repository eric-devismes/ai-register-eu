/**
 * Security Policy Page — DORA & NIS2 aligned security posture for AI Compass EU.
 *
 * Documents ICT risk management framework, incident response overview,
 * supply chain risk assessment, business continuity, security testing,
 * and NIS2 cybersecurity hygiene measures.
 *
 * URL: /[lang]/security
 */

import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Security Policy — AI Compass EU",
    description:
      "AI Compass EU security policy: ICT risk management (DORA Chapter II), incident response, supply chain risk assessment, business continuity, and NIS2 alignment.",
  };
}

export default async function SecurityPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  await params;
  const lastUpdated = "11 April 2026";

  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          {/* Page header */}
          <div className="border-b border-gray-200 pb-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#003399]">
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Security Policy
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Last updated: {lastUpdated}
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              This document describes the security posture, ICT risk management
              framework, and operational resilience measures of AI Compass EU.
              It is aligned with the Digital Operational Resilience Act (DORA)
              and the Network and Information Security Directive (NIS2).
            </p>
          </div>

          <div className="mt-10 space-y-12 text-sm leading-relaxed text-gray-700">
            {/* ───────────────────────────────────────────────── */}
            {/* 1. ICT Risk Management Framework (DORA Ch. II) */}
            {/* ───────────────────────────────────────────────── */}
            <section>
              <h2 className="flex items-center gap-2 text-lg font-bold text-[#0d1b3e]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#003399] text-xs font-bold text-white">
                  1
                </span>
                ICT Risk Management Framework
              </h2>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-400">
                DORA Chapter II, Articles 5-16
              </p>

              <p className="mt-4">
                AI Compass EU maintains a structured ICT risk management
                framework proportionate to the scale and complexity of its
                operations. The framework is reviewed at least annually and
                after any significant incident.
              </p>

              <div className="mt-6 space-y-4">
                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="font-semibold text-gray-900">
                    Risk Identification
                  </p>
                  <p className="mt-1 text-gray-600">
                    We maintain an asset inventory covering all ICT systems,
                    third-party dependencies, and data flows. Each asset is
                    classified by criticality (critical, important, standard) and
                    mapped to the business functions it supports.
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="font-semibold text-gray-900">
                    Risk Assessment
                  </p>
                  <p className="mt-1 text-gray-600">
                    Risks are evaluated using a likelihood-impact matrix (5x5)
                    with quarterly reviews. Threat scenarios include supply chain
                    compromise, data breach, service unavailability, and AI model
                    misuse. Residual risk is tracked and accepted only with
                    documented justification.
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="font-semibold text-gray-900">
                    Risk Mitigation
                  </p>
                  <p className="mt-1 text-gray-600">
                    Controls are implemented following a defence-in-depth
                    strategy: network segmentation, encryption at rest and in
                    transit, least-privilege access, automated vulnerability
                    scanning, and continuous monitoring. All mitigations are
                    mapped to the risks they address.
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="font-semibold text-gray-900">Governance</p>
                  <p className="mt-1 text-gray-600">
                    The ICT risk management framework is owned by the platform
                    operator, with clear accountability for risk decisions.
                    Changes to the risk profile are documented and communicated
                    to relevant stakeholders.
                  </p>
                </div>
              </div>
            </section>

            {/* ───────────────────────────────────────────────── */}
            {/* 2. Incident Response Procedure                   */}
            {/* ───────────────────────────────────────────────── */}
            <section>
              <h2 className="flex items-center gap-2 text-lg font-bold text-[#0d1b3e]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#003399] text-xs font-bold text-white">
                  2
                </span>
                Incident Response Procedure
              </h2>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-400">
                DORA Chapter III, Articles 17-23
              </p>

              <p className="mt-4">
                All ICT-related incidents are classified, tracked, and resolved
                according to the following severity matrix. For the full
                incident response plan, see{" "}
                <a
                  href="/en/incident-response"
                  className="text-[#003399] hover:underline"
                >
                  our Incident Response Plan
                </a>
                .
              </p>

              <div className="mt-6 overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#0d1b3e] text-xs uppercase text-white">
                    <tr>
                      <th className="px-4 py-3">Severity</th>
                      <th className="px-4 py-3">Definition</th>
                      <th className="px-4 py-3">Acknowledge</th>
                      <th className="px-4 py-3">Resolve</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="bg-red-50">
                      <td className="px-4 py-3 font-bold text-red-700">
                        Critical (P1)
                      </td>
                      <td className="px-4 py-3">
                        Full service outage or confirmed data breach affecting
                        personal data
                      </td>
                      <td className="px-4 py-3 font-medium">1 hour</td>
                      <td className="px-4 py-3 font-medium">4 hours</td>
                    </tr>
                    <tr className="bg-orange-50">
                      <td className="px-4 py-3 font-bold text-orange-700">
                        Major (P2)
                      </td>
                      <td className="px-4 py-3">
                        Significant degradation of core functionality (database,
                        AI chatbot, authentication)
                      </td>
                      <td className="px-4 py-3 font-medium">4 hours</td>
                      <td className="px-4 py-3 font-medium">24 hours</td>
                    </tr>
                    <tr className="bg-yellow-50">
                      <td className="px-4 py-3 font-bold text-yellow-700">
                        Minor (P3)
                      </td>
                      <td className="px-4 py-3">
                        Isolated issue affecting non-critical features or a
                        small number of users
                      </td>
                      <td className="px-4 py-3 font-medium">24 hours</td>
                      <td className="px-4 py-3 font-medium">72 hours</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-bold text-gray-600">
                        Informational (P4)
                      </td>
                      <td className="px-4 py-3">
                        Cosmetic defect, minor UX issue, or proactive
                        vulnerability patching
                      </td>
                      <td className="px-4 py-3 font-medium">Best effort</td>
                      <td className="px-4 py-3 font-medium">Best effort</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-4 rounded-lg border-l-4 border-[#ffc107] bg-amber-50 p-4">
                <p className="font-semibold text-gray-900">
                  Escalation &amp; Notification
                </p>
                <p className="mt-1 text-gray-600">
                  P1 incidents trigger immediate escalation to the platform
                  operator. If the incident involves personal data, the relevant
                  Data Protection Authority is notified within 72 hours per GDPR
                  Article 33. Under DORA, major ICT-related incidents are
                  reported to the competent authority using the prescribed
                  templates.
                </p>
              </div>
            </section>

            {/* ───────────────────────────────────────────────── */}
            {/* 3. Supply Chain / Third-Party Risk Assessment     */}
            {/* ───────────────────────────────────────────────── */}
            <section>
              <h2 className="flex items-center gap-2 text-lg font-bold text-[#0d1b3e]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#003399] text-xs font-bold text-white">
                  3
                </span>
                Supply Chain &amp; Third-Party Risk Assessment
              </h2>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-400">
                DORA Chapter V, Articles 28-44 &middot; NIS2 Article 21(2)(d)
              </p>

              <p className="mt-4">
                All third-party ICT service providers are subject to due
                diligence before onboarding and continuous monitoring thereafter.
                Contracts include security requirements, audit rights, and exit
                strategies.
              </p>

              <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#0d1b3e] text-xs uppercase text-white">
                    <tr>
                      <th className="px-4 py-3">Provider</th>
                      <th className="px-4 py-3">Service</th>
                      <th className="px-4 py-3">Data Processed</th>
                      <th className="px-4 py-3">Security Posture</th>
                      <th className="px-4 py-3">Location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        Anthropic
                      </td>
                      <td className="px-4 py-3">
                        AI inference (Claude API)
                      </td>
                      <td className="px-4 py-3">
                        User queries (no PII), system prompts
                      </td>
                      <td className="px-4 py-3">
                        SOC 2 Type II, zero data retention on API tier, EU SCCs
                        in place
                      </td>
                      <td className="px-4 py-3">US</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        Vercel
                      </td>
                      <td className="px-4 py-3">
                        Hosting, CDN, serverless functions
                      </td>
                      <td className="px-4 py-3">
                        HTTP requests, server logs
                      </td>
                      <td className="px-4 py-3">
                        SOC 2 Type II, ISO 27001, EU region (Frankfurt),
                        DDoS protection via Cloudflare
                      </td>
                      <td className="px-4 py-3">EU (fra1)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        Neon
                      </td>
                      <td className="px-4 py-3">
                        PostgreSQL database
                      </td>
                      <td className="px-4 py-3">
                        All application data (accounts, preferences, content)
                      </td>
                      <td className="px-4 py-3">
                        SOC 2 Type II, encryption at rest (AES-256) and in
                        transit (TLS 1.3), EU region, automatic failover
                      </td>
                      <td className="px-4 py-3">EU</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        Resend
                      </td>
                      <td className="px-4 py-3">
                        Transactional email delivery
                      </td>
                      <td className="px-4 py-3">
                        Email addresses, email content
                      </td>
                      <td className="px-4 py-3">
                        SOC 2 Type II, TLS in transit, EU SCCs in place
                      </td>
                      <td className="px-4 py-3">US</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        LemonSqueezy
                      </td>
                      <td className="px-4 py-3">
                        Payment processing
                      </td>
                      <td className="px-4 py-3">
                        Email, subscription metadata
                      </td>
                      <td className="px-4 py-3">
                        PCI DSS Level 1, SOC 2, EU SCCs in place
                      </td>
                      <td className="px-4 py-3">US</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-4 rounded-lg bg-gray-50 p-4">
                <p className="font-semibold text-gray-900">
                  Concentration Risk
                </p>
                <p className="mt-1 text-gray-600">
                  We monitor for concentration risk on critical ICT third-party
                  providers. AI inference depends on Anthropic; however, the
                  platform remains fully functional (ratings, database, content)
                  without the chatbot feature. Database services are
                  provider-portable (standard PostgreSQL).
                </p>
              </div>
            </section>

            {/* ───────────────────────────────────────────────── */}
            {/* 4. Business Continuity                            */}
            {/* ───────────────────────────────────────────────── */}
            <section>
              <h2 className="flex items-center gap-2 text-lg font-bold text-[#0d1b3e]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#003399] text-xs font-bold text-white">
                  4
                </span>
                Business Continuity &amp; Disaster Recovery
              </h2>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-400">
                DORA Chapter II, Article 11
              </p>

              <div className="mt-6 space-y-4">
                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="font-semibold text-gray-900">
                    Hosting &amp; CDN Failover
                  </p>
                  <p className="mt-1 text-gray-600">
                    The platform is deployed on Vercel&apos;s edge network with
                    automatic CDN failover across multiple points of presence.
                    Static assets are served from the nearest edge node. If the
                    primary EU region (Frankfurt) becomes unavailable, traffic is
                    rerouted automatically. Target RTO: 5 minutes for static
                    content, 15 minutes for serverless functions.
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="font-semibold text-gray-900">
                    Database Resilience
                  </p>
                  <p className="mt-1 text-gray-600">
                    Neon PostgreSQL provides automatic failover with
                    point-in-time recovery. Database backups are performed
                    continuously (WAL streaming) with a 7-day retention window.
                    RPO: near-zero (continuous replication). RTO: under 30
                    seconds for automatic failover.
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="font-semibold text-gray-900">
                    Code &amp; Configuration
                  </p>
                  <p className="mt-1 text-gray-600">
                    All source code is version-controlled in Git with remote
                    backups. Infrastructure is defined as code (Vercel project
                    configuration, environment variables). A full redeployment
                    from source can be completed within 10 minutes.
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="font-semibold text-gray-900">
                    Graceful Degradation
                  </p>
                  <p className="mt-1 text-gray-600">
                    The platform is designed for graceful degradation. If the AI
                    provider (Anthropic) is unavailable, the chatbot displays a
                    maintenance message while all other features (database,
                    ratings, content, search) remain fully operational. If the
                    email provider (Resend) is unavailable, users can still
                    access all platform features; only digest delivery is
                    delayed.
                  </p>
                </div>
              </div>
            </section>

            {/* ───────────────────────────────────────────────── */}
            {/* 5. Security Testing                               */}
            {/* ───────────────────────────────────────────────── */}
            <section>
              <h2 className="flex items-center gap-2 text-lg font-bold text-[#0d1b3e]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#003399] text-xs font-bold text-white">
                  5
                </span>
                Security Testing &amp; Technical Controls
              </h2>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-400">
                DORA Chapter IV, Articles 24-27
              </p>

              <div className="mt-6 overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                      <th className="px-4 py-3">Control</th>
                      <th className="px-4 py-3">Implementation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        Encryption in Transit
                      </td>
                      <td className="px-4 py-3">
                        TLS 1.2+ enforced on all endpoints. HSTS enabled with
                        includeSubDomains. Certificate managed by Vercel (auto-renewal).
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        Encryption at Rest
                      </td>
                      <td className="px-4 py-3">
                        AES-256 encryption on all database storage (Neon).
                        Secrets stored in Vercel environment variables (encrypted, not
                        committed to source control).
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        Input Validation
                      </td>
                      <td className="px-4 py-3">
                        All user inputs are validated and sanitised server-side.
                        Chatbot inputs are length-limited and filtered for prompt
                        injection patterns. Form inputs use parameterised queries
                        (no raw SQL).
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        Injection Prevention
                      </td>
                      <td className="px-4 py-3">
                        SQL injection prevented via parameterised queries
                        (Drizzle ORM). XSS mitigated by React&apos;s default
                        escaping and Content Security Policy headers. Prompt
                        injection mitigated by system prompt hardening and input
                        filtering.
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        Rate Limiting
                      </td>
                      <td className="px-4 py-3">
                        API endpoints are rate-limited per IP and per session.
                        Chatbot: 20 requests per hour (free), 100 per hour
                        (Pro). Authentication: 5 magic link requests per hour.
                        Brute-force protection on all auth endpoints.
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        Dependency Management
                      </td>
                      <td className="px-4 py-3">
                        Dependencies audited via <code>npm audit</code> on every
                        build. Critical vulnerabilities are patched within 48
                        hours. Dependabot alerts enabled for automated
                        vulnerability detection.
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        Security Headers
                      </td>
                      <td className="px-4 py-3">
                        Strict-Transport-Security, X-Content-Type-Options
                        (nosniff), X-Frame-Options (DENY),
                        Referrer-Policy (strict-origin-when-cross-origin),
                        Content-Security-Policy configured per Vercel deployment.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* ───────────────────────────────────────────────── */}
            {/* 6. NIS2 Alignment                                 */}
            {/* ───────────────────────────────────────────────── */}
            <section>
              <h2 className="flex items-center gap-2 text-lg font-bold text-[#0d1b3e]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#003399] text-xs font-bold text-white">
                  6
                </span>
                NIS2 Alignment
              </h2>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-400">
                Directive (EU) 2022/2555, Article 21
              </p>

              <p className="mt-4">
                While AI Compass EU may not fall within the scope of NIS2 as an
                essential or important entity, we voluntarily align with its
                cybersecurity risk management measures as a matter of best
                practice and to demonstrate commitment to our users.
              </p>

              <div className="mt-6 space-y-4">
                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="font-semibold text-gray-900">
                    Cybersecurity Hygiene (Art. 21(2)(g))
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-gray-600">
                    <li>
                      All infrastructure access requires multi-factor
                      authentication (MFA)
                    </li>
                    <li>
                      Principle of least privilege applied to all service
                      accounts and API keys
                    </li>
                    <li>
                      API keys rotated quarterly and immediately upon suspected
                      compromise
                    </li>
                    <li>
                      Production environment variables never committed to source
                      control
                    </li>
                    <li>
                      Employee security awareness training conducted annually
                    </li>
                  </ul>
                </div>

                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="font-semibold text-gray-900">
                    Vulnerability Handling (Art. 21(2)(e))
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-gray-600">
                    <li>
                      Continuous vulnerability scanning via dependency audit
                      tooling
                    </li>
                    <li>
                      Critical vulnerabilities (CVSS 9.0+): patched within 48
                      hours
                    </li>
                    <li>
                      High vulnerabilities (CVSS 7.0-8.9): patched within 7
                      days
                    </li>
                    <li>
                      Medium/low vulnerabilities: patched in the next scheduled
                      release
                    </li>
                    <li>
                      Responsible disclosure: security researchers can report
                      vulnerabilities to{" "}
                      <a
                        href="mailto:security@aicompass.eu"
                        className="text-[#003399] hover:underline"
                      >
                        security@aicompass.eu
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="font-semibold text-gray-900">
                    Access Management (Art. 21(2)(i))
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-gray-600">
                    <li>
                      Role-based access control (RBAC) for all administrative
                      functions
                    </li>
                    <li>
                      Infrastructure access limited to authorised personnel with
                      MFA
                    </li>
                    <li>
                      Third-party access reviewed quarterly and revoked upon
                      contract termination
                    </li>
                    <li>
                      User authentication via cryptographic tokens (JWT) with
                      expiry; no password storage
                    </li>
                    <li>
                      Session management: 30-day expiry, single-use magic links
                      with 15-minute TTL
                    </li>
                  </ul>
                </div>

                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="font-semibold text-gray-900">
                    Incident Handling (Art. 21(2)(b))
                  </p>
                  <p className="mt-1 text-gray-600">
                    Our incident response procedure (Section 2 above) and{" "}
                    <a
                      href="/en/incident-response"
                      className="text-[#003399] hover:underline"
                    >
                      detailed Incident Response Plan
                    </a>{" "}
                    align with NIS2 requirements for incident handling,
                    including classification, response timelines, escalation,
                    and reporting to competent authorities.
                  </p>
                </div>
              </div>
            </section>

            {/* ───────────────────────────────────────────────── */}
            {/* 7. Responsible AI Security                        */}
            {/* ───────────────────────────────────────────────── */}
            <section>
              <h2 className="flex items-center gap-2 text-lg font-bold text-[#0d1b3e]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#003399] text-xs font-bold text-white">
                  7
                </span>
                Responsible AI Security
              </h2>

              <p className="mt-4">
                As a platform that evaluates AI systems, we hold ourselves to
                high standards in our own use of AI:
              </p>

              <ul className="mt-4 list-disc space-y-2 pl-5 text-gray-600">
                <li>
                  <strong>No training on user data:</strong> AI API calls are
                  made under Anthropic&apos;s commercial API terms, which
                  prohibit using inputs/outputs for model training.
                </li>
                <li>
                  <strong>PII minimisation:</strong> No personally identifiable
                  information (email, name) is included in AI API requests.
                  Only the user&apos;s question and optional role/industry
                  context are sent.
                </li>
                <li>
                  <strong>Prompt injection defences:</strong> System prompts
                  include guardrails against prompt injection. User inputs are
                  filtered for known attack patterns before being sent to the
                  API.
                </li>
                <li>
                  <strong>Output validation:</strong> AI responses are scoped to
                  EU regulatory topics. The system prompt constrains the model
                  to decline off-topic or harmful requests.
                </li>
              </ul>
            </section>

            {/* ───────────────────────────────────────────────── */}
            {/* 8. Contact                                        */}
            {/* ───────────────────────────────────────────────── */}
            <section className="rounded-lg border-2 border-[#003399] bg-blue-50 p-6">
              <h2 className="text-lg font-bold text-[#0d1b3e]">
                Security Contact
              </h2>
              <p className="mt-2 text-gray-700">
                To report a security vulnerability, ask about our security
                practices, or request additional documentation:
              </p>
              <p className="mt-3">
                <a
                  href="mailto:security@aicompass.eu"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#003399] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0d1b3e]"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                    />
                  </svg>
                  security@aicompass.eu
                </a>
              </p>
              <p className="mt-4 text-xs text-gray-500">
                We aim to acknowledge security reports within 24 hours and
                provide an initial assessment within 72 hours. We support
                responsible disclosure and will not take legal action against
                researchers who report vulnerabilities in good faith.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
