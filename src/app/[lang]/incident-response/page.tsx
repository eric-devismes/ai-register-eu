/**
 * Incident Response Plan — Public IRP aligned with DORA and NIS2.
 *
 * Documents incident classification (P1-P4), response timelines,
 * communication protocol, post-incident review, and regulatory
 * reporting obligations.
 *
 * URL: /[lang]/incident-response
 */

import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Incident Response Plan",
    description:
      "AI Compass EU incident response plan: incident classification (P1-P4), response timelines, communication protocol, post-incident review, and DORA/NIS2 reporting obligations.",
  };
}

export default async function IncidentResponsePage({
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
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Incident Response Plan
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Last updated: {lastUpdated}
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              This document defines how AI Compass EU detects, classifies,
              responds to, and learns from security and operational incidents.
              It is aligned with the Digital Operational Resilience Act (DORA,
              Chapter III) and the Network and Information Security Directive
              (NIS2, Article 23).
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-[#003399]">
                DORA Chapter III
              </span>
              <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-[#003399]">
                NIS2 Article 23
              </span>
              <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-[#003399]">
                GDPR Article 33-34
              </span>
            </div>
          </div>

          <div className="mt-10 space-y-12 text-sm leading-relaxed text-gray-700">
            {/* ───────────────────────────────────────────────── */}
            {/* 1. Scope & Purpose                                */}
            {/* ───────────────────────────────────────────────── */}
            <section>
              <h2 className="flex items-center gap-2 text-lg font-bold text-[#0d1b3e]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#003399] text-xs font-bold text-white">
                  1
                </span>
                Scope &amp; Purpose
              </h2>

              <p className="mt-4">
                This Incident Response Plan (IRP) covers all ICT-related
                incidents affecting the AI Compass EU platform, including but
                not limited to:
              </p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-gray-600">
                <li>
                  Service outages or significant degradation of platform
                  availability
                </li>
                <li>
                  Security breaches, including unauthorised access to systems or
                  data
                </li>
                <li>
                  Personal data breaches as defined by GDPR Article 4(12)
                </li>
                <li>
                  Third-party service provider incidents that impact platform
                  operations
                </li>
                <li>
                  AI-specific incidents (prompt injection exploitation, model
                  output integrity issues)
                </li>
              </ul>

              <p className="mt-4">
                The objective is to minimise the impact of incidents on users
                and stakeholders, ensure regulatory compliance, and
                continuously improve our security posture through structured
                post-incident learning.
              </p>
            </section>

            {/* ───────────────────────────────────────────────── */}
            {/* 2. Incident Classification                        */}
            {/* ───────────────────────────────────────────────── */}
            <section>
              <h2 className="flex items-center gap-2 text-lg font-bold text-[#0d1b3e]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#003399] text-xs font-bold text-white">
                  2
                </span>
                Incident Classification
              </h2>

              <p className="mt-4">
                All incidents are classified into one of four priority levels
                based on their impact on service availability, data integrity,
                and regulatory implications.
              </p>

              {/* P1 — Critical */}
              <div className="mt-6 rounded-lg border-l-4 border-red-600 bg-red-50 p-5">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">
                    P1 — Critical
                  </span>
                </div>
                <p className="mt-3 font-semibold text-gray-900">Definition</p>
                <p className="mt-1 text-gray-700">
                  Complete service outage affecting all users, or a confirmed
                  breach involving personal data or sensitive system
                  credentials. AI model compromise resulting in harmful or
                  manipulated outputs at scale.
                </p>
                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase text-gray-500">
                      Examples
                    </p>
                    <ul className="mt-1 list-disc space-y-1 pl-5 text-gray-600">
                      <li>Platform completely inaccessible</li>
                      <li>Database breach with personal data exfiltration</li>
                      <li>
                        API keys or credentials leaked publicly
                      </li>
                      <li>Successful prompt injection causing harmful outputs</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase text-gray-500">
                      Response Targets
                    </p>
                    <ul className="mt-1 space-y-1 text-gray-600">
                      <li>
                        <strong>Acknowledge:</strong> 1 hour
                      </li>
                      <li>
                        <strong>Mitigate:</strong> 2 hours
                      </li>
                      <li>
                        <strong>Resolve:</strong> 4 hours
                      </li>
                      <li>
                        <strong>Post-mortem:</strong> Within 48 hours
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* P2 — Major */}
              <div className="mt-4 rounded-lg border-l-4 border-orange-500 bg-orange-50 p-5">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white">
                    P2 — Major
                  </span>
                </div>
                <p className="mt-3 font-semibold text-gray-900">Definition</p>
                <p className="mt-1 text-gray-700">
                  Significant degradation of core platform functionality
                  affecting a majority of users, or a security event that does
                  not involve confirmed personal data compromise but requires
                  immediate investigation.
                </p>
                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase text-gray-500">
                      Examples
                    </p>
                    <ul className="mt-1 list-disc space-y-1 pl-5 text-gray-600">
                      <li>Database connectivity issues causing errors</li>
                      <li>AI chatbot returning incorrect/degraded responses</li>
                      <li>Authentication system failure</li>
                      <li>Suspected (unconfirmed) unauthorised access</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase text-gray-500">
                      Response Targets
                    </p>
                    <ul className="mt-1 space-y-1 text-gray-600">
                      <li>
                        <strong>Acknowledge:</strong> 4 hours
                      </li>
                      <li>
                        <strong>Mitigate:</strong> 8 hours
                      </li>
                      <li>
                        <strong>Resolve:</strong> 24 hours
                      </li>
                      <li>
                        <strong>Post-mortem:</strong> Within 5 business days
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* P3 — Minor */}
              <div className="mt-4 rounded-lg border-l-4 border-yellow-500 bg-yellow-50 p-5">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-yellow-500 px-3 py-1 text-xs font-bold text-white">
                    P3 — Minor
                  </span>
                </div>
                <p className="mt-3 font-semibold text-gray-900">Definition</p>
                <p className="mt-1 text-gray-700">
                  Isolated issue affecting a limited number of users or a
                  non-critical feature. No data compromise. Service remains
                  operational with workarounds available.
                </p>
                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase text-gray-500">
                      Examples
                    </p>
                    <ul className="mt-1 list-disc space-y-1 pl-5 text-gray-600">
                      <li>Single API endpoint returning errors</li>
                      <li>Email delivery delays</li>
                      <li>UI rendering issues on specific browsers</li>
                      <li>Rate limiter false positives</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase text-gray-500">
                      Response Targets
                    </p>
                    <ul className="mt-1 space-y-1 text-gray-600">
                      <li>
                        <strong>Acknowledge:</strong> 24 hours
                      </li>
                      <li>
                        <strong>Mitigate:</strong> 48 hours
                      </li>
                      <li>
                        <strong>Resolve:</strong> 72 hours
                      </li>
                      <li>
                        <strong>Post-mortem:</strong> Optional
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* P4 — Informational */}
              <div className="mt-4 rounded-lg border-l-4 border-gray-400 bg-gray-50 p-5">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-gray-500 px-3 py-1 text-xs font-bold text-white">
                    P4 — Informational
                  </span>
                </div>
                <p className="mt-3 font-semibold text-gray-900">Definition</p>
                <p className="mt-1 text-gray-700">
                  Cosmetic defect, proactive security patching, or minor
                  improvement opportunity. No user impact. Handled as part of
                  normal development workflow.
                </p>
                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase text-gray-500">
                      Examples
                    </p>
                    <ul className="mt-1 list-disc space-y-1 pl-5 text-gray-600">
                      <li>Minor UI inconsistency</li>
                      <li>Dependency update for non-critical vulnerability</li>
                      <li>Performance optimisation opportunity</li>
                      <li>Spelling or content corrections</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase text-gray-500">
                      Response Targets
                    </p>
                    <ul className="mt-1 space-y-1 text-gray-600">
                      <li>
                        <strong>Acknowledge:</strong> Best effort
                      </li>
                      <li>
                        <strong>Resolve:</strong> Best effort
                      </li>
                      <li>
                        <strong>Post-mortem:</strong> Not required
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* ───────────────────────────────────────────────── */}
            {/* 3. Response Lifecycle                              */}
            {/* ───────────────────────────────────────────────── */}
            <section>
              <h2 className="flex items-center gap-2 text-lg font-bold text-[#0d1b3e]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#003399] text-xs font-bold text-white">
                  3
                </span>
                Response Lifecycle
              </h2>

              <p className="mt-4">
                Every incident follows a structured lifecycle regardless of
                severity:
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#003399] text-xs font-bold text-white">
                      1
                    </div>
                    <div className="mt-1 h-full w-0.5 bg-gray-200" />
                  </div>
                  <div className="pb-6">
                    <p className="font-semibold text-gray-900">Detection</p>
                    <p className="mt-1 text-gray-600">
                      Incident detected via automated monitoring (Vercel
                      analytics, error tracking), user report, or third-party
                      notification. An incident ticket is created immediately.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#003399] text-xs font-bold text-white">
                      2
                    </div>
                    <div className="mt-1 h-full w-0.5 bg-gray-200" />
                  </div>
                  <div className="pb-6">
                    <p className="font-semibold text-gray-900">Triage &amp; Classification</p>
                    <p className="mt-1 text-gray-600">
                      The incident is assessed against the classification
                      matrix (Section 2) and assigned a priority level (P1-P4).
                      The scope of impact, affected systems, and potential data
                      exposure are documented.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#003399] text-xs font-bold text-white">
                      3
                    </div>
                    <div className="mt-1 h-full w-0.5 bg-gray-200" />
                  </div>
                  <div className="pb-6">
                    <p className="font-semibold text-gray-900">Containment</p>
                    <p className="mt-1 text-gray-600">
                      Immediate actions to limit the blast radius: isolate
                      affected systems, revoke compromised credentials, disable
                      vulnerable features, or failover to backup systems.
                      For AI-specific incidents, the chatbot may be
                      temporarily disabled.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#003399] text-xs font-bold text-white">
                      4
                    </div>
                    <div className="mt-1 h-full w-0.5 bg-gray-200" />
                  </div>
                  <div className="pb-6">
                    <p className="font-semibold text-gray-900">
                      Eradication &amp; Recovery
                    </p>
                    <p className="mt-1 text-gray-600">
                      Root cause is identified and eliminated. Affected systems
                      are restored from known-good state. Data integrity is
                      verified. Service is gradually restored with monitoring
                      in place to detect recurrence.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#003399] text-xs font-bold text-white">
                      5
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      Post-Incident Review
                    </p>
                    <p className="mt-1 text-gray-600">
                      A blameless post-mortem is conducted (see Section 5).
                      Findings are documented, lessons learned are extracted,
                      and preventive measures are implemented.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* ───────────────────────────────────────────────── */}
            {/* 4. Communication Protocol                         */}
            {/* ───────────────────────────────────────────────── */}
            <section>
              <h2 className="flex items-center gap-2 text-lg font-bold text-[#0d1b3e]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#003399] text-xs font-bold text-white">
                  4
                </span>
                Communication Protocol
              </h2>

              <p className="mt-4">
                Transparent, timely communication is central to our incident
                response. Notification scope scales with incident severity.
              </p>

              <div className="mt-6 overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#0d1b3e] text-xs uppercase text-white">
                    <tr>
                      <th className="px-4 py-3">Severity</th>
                      <th className="px-4 py-3">Internal</th>
                      <th className="px-4 py-3">Users</th>
                      <th className="px-4 py-3">Regulators</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="bg-red-50">
                      <td className="px-4 py-3 font-bold text-red-700">
                        P1
                      </td>
                      <td className="px-4 py-3">
                        Immediate alert to platform operator and all technical
                        staff
                      </td>
                      <td className="px-4 py-3">
                        Status page updated within 1 hour. Email notification
                        to affected users if personal data involved.
                      </td>
                      <td className="px-4 py-3">
                        DPA notified within 72 hours (GDPR Art. 33). Competent
                        authority notified per DORA/NIS2 timelines.
                      </td>
                    </tr>
                    <tr className="bg-orange-50">
                      <td className="px-4 py-3 font-bold text-orange-700">
                        P2
                      </td>
                      <td className="px-4 py-3">
                        Alert to platform operator and relevant technical staff
                      </td>
                      <td className="px-4 py-3">
                        Status page updated within 4 hours. In-app notice if
                        functionality is degraded.
                      </td>
                      <td className="px-4 py-3">
                        Only if escalated to P1 or if reporting thresholds are
                        met.
                      </td>
                    </tr>
                    <tr className="bg-yellow-50">
                      <td className="px-4 py-3 font-bold text-yellow-700">
                        P3
                      </td>
                      <td className="px-4 py-3">
                        Logged in incident tracker
                      </td>
                      <td className="px-4 py-3">
                        No proactive notification. Fix deployed in next
                        release.
                      </td>
                      <td className="px-4 py-3">Not required.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-bold text-gray-600">
                        P4
                      </td>
                      <td className="px-4 py-3">
                        Logged in backlog
                      </td>
                      <td className="px-4 py-3">None.</td>
                      <td className="px-4 py-3">Not required.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-4 rounded-lg border-l-4 border-[#ffc107] bg-amber-50 p-4">
                <p className="font-semibold text-gray-900">
                  Data Breach Notification (GDPR Art. 34)
                </p>
                <p className="mt-1 text-gray-600">
                  If a personal data breach is likely to result in a high risk
                  to the rights and freedoms of individuals, affected data
                  subjects are notified without undue delay via email. The
                  notification describes the nature of the breach, likely
                  consequences, measures taken, and the contact point for
                  further information.
                </p>
              </div>
            </section>

            {/* ───────────────────────────────────────────────── */}
            {/* 5. Post-Incident Review                           */}
            {/* ───────────────────────────────────────────────── */}
            <section>
              <h2 className="flex items-center gap-2 text-lg font-bold text-[#0d1b3e]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#003399] text-xs font-bold text-white">
                  5
                </span>
                Post-Incident Review
              </h2>

              <p className="mt-4">
                All P1 and P2 incidents require a formal post-incident review
                (post-mortem). P3 incidents may optionally include a review at
                the discretion of the platform operator.
              </p>

              <div className="mt-6 space-y-4">
                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="font-semibold text-gray-900">
                    Blameless Culture
                  </p>
                  <p className="mt-1 text-gray-600">
                    Reviews focus on systemic causes, not individual fault. The
                    goal is to understand what happened, why, and how to
                    prevent recurrence. Contributing factors are examined
                    without attribution of blame.
                  </p>
                </div>

                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="font-semibold text-gray-900">
                    Review Template
                  </p>
                  <div className="mt-2 rounded-lg bg-gray-50 p-4 font-mono text-xs text-gray-600">
                    <p>
                      <strong className="text-gray-900">Incident ID:</strong>{" "}
                      [INC-YYYY-NNN]
                    </p>
                    <p>
                      <strong className="text-gray-900">Severity:</strong>{" "}
                      [P1/P2/P3]
                    </p>
                    <p>
                      <strong className="text-gray-900">Duration:</strong>{" "}
                      [Detection to resolution]
                    </p>
                    <p>
                      <strong className="text-gray-900">Impact:</strong>{" "}
                      [Users affected, data exposed, revenue impact]
                    </p>
                    <p>
                      <strong className="text-gray-900">Timeline:</strong>{" "}
                      [Chronological events]
                    </p>
                    <p>
                      <strong className="text-gray-900">Root Cause:</strong>{" "}
                      [Technical root cause analysis]
                    </p>
                    <p>
                      <strong className="text-gray-900">
                        Contributing Factors:
                      </strong>{" "}
                      [Process/tooling gaps]
                    </p>
                    <p>
                      <strong className="text-gray-900">Action Items:</strong>{" "}
                      [Preventive measures with owners and deadlines]
                    </p>
                    <p>
                      <strong className="text-gray-900">
                        Lessons Learned:
                      </strong>{" "}
                      [What worked, what did not]
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="font-semibold text-gray-900">
                    Action Item Tracking
                  </p>
                  <p className="mt-1 text-gray-600">
                    Every post-mortem produces concrete action items with
                    assigned owners and deadlines. Actions are tracked to
                    completion. Recurring incident patterns trigger a review of
                    the underlying architecture or process.
                  </p>
                </div>
              </div>
            </section>

            {/* ───────────────────────────────────────────────── */}
            {/* 6. Regulatory Reporting Obligations               */}
            {/* ───────────────────────────────────────────────── */}
            <section>
              <h2 className="flex items-center gap-2 text-lg font-bold text-[#0d1b3e]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#003399] text-xs font-bold text-white">
                  6
                </span>
                Regulatory Reporting Obligations
              </h2>

              <div className="mt-6 space-y-6">
                {/* DORA */}
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#003399]">
                    DORA — Regulation (EU) 2022/2554
                  </p>
                  <p className="mt-2 font-semibold text-gray-900">
                    ICT-Related Incident Reporting (Articles 19-20)
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-gray-600">
                    <li>
                      <strong>Initial notification:</strong> Submitted to the
                      competent authority by end of business day of
                      classification (or within 4 hours if classified during
                      business hours)
                    </li>
                    <li>
                      <strong>Intermediate report:</strong> Within 72 hours of
                      initial notification, including root cause analysis and
                      estimated recovery timeline
                    </li>
                    <li>
                      <strong>Final report:</strong> Within 1 month of the
                      incident, including full root cause analysis, impact
                      assessment, and remedial actions taken
                    </li>
                    <li>
                      Reports follow the standardised templates prescribed by
                      the European Supervisory Authorities (ESAs)
                    </li>
                  </ul>
                </div>

                {/* NIS2 */}
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#003399]">
                    NIS2 — Directive (EU) 2022/2555
                  </p>
                  <p className="mt-2 font-semibold text-gray-900">
                    Incident Notification (Article 23)
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-gray-600">
                    <li>
                      <strong>Early warning:</strong> Within 24 hours of
                      becoming aware of a significant incident, to the
                      relevant CSIRT or competent authority
                    </li>
                    <li>
                      <strong>Incident notification:</strong> Within 72 hours,
                      including initial assessment of severity, impact, and
                      indicators of compromise
                    </li>
                    <li>
                      <strong>Final report:</strong> Within 1 month (or upon
                      incident resolution), including detailed description,
                      root cause, mitigation measures, and cross-border impact
                    </li>
                    <li>
                      If the incident affects users in other EU Member States,
                      the relevant single points of contact are notified
                    </li>
                  </ul>
                </div>

                {/* GDPR */}
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#003399]">
                    GDPR — Regulation (EU) 2016/679
                  </p>
                  <p className="mt-2 font-semibold text-gray-900">
                    Personal Data Breach Notification (Articles 33-34)
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-gray-600">
                    <li>
                      <strong>To supervisory authority:</strong> Within 72
                      hours of becoming aware of a personal data breach, unless
                      the breach is unlikely to result in a risk to the rights
                      and freedoms of natural persons
                    </li>
                    <li>
                      <strong>To data subjects:</strong> Without undue delay if
                      the breach is likely to result in a high risk to rights
                      and freedoms
                    </li>
                    <li>
                      Notification includes: nature of breach, categories and
                      approximate number of data subjects, likely consequences,
                      and measures taken or proposed
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* ───────────────────────────────────────────────── */}
            {/* 7. Testing & Maintenance                          */}
            {/* ───────────────────────────────────────────────── */}
            <section>
              <h2 className="flex items-center gap-2 text-lg font-bold text-[#0d1b3e]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#003399] text-xs font-bold text-white">
                  7
                </span>
                Plan Testing &amp; Maintenance
              </h2>

              <div className="mt-6 space-y-4">
                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="font-semibold text-gray-900">Annual Review</p>
                  <p className="mt-1 text-gray-600">
                    This IRP is reviewed at least annually and updated to
                    reflect changes in infrastructure, third-party providers,
                    regulatory requirements, or lessons learned from incidents.
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="font-semibold text-gray-900">
                    Tabletop Exercises
                  </p>
                  <p className="mt-1 text-gray-600">
                    Incident response scenarios are rehearsed at least annually
                    through tabletop exercises. Scenarios cover realistic threat
                    situations including data breach, supply chain compromise,
                    and AI-specific incidents.
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="font-semibold text-gray-900">
                    Post-Incident Updates
                  </p>
                  <p className="mt-1 text-gray-600">
                    After any P1 or P2 incident, this plan is reviewed and
                    updated if gaps are identified during the post-mortem
                    process.
                  </p>
                </div>
              </div>
            </section>

            {/* ───────────────────────────────────────────────── */}
            {/* 8. Contact                                        */}
            {/* ───────────────────────────────────────────────── */}
            <section className="rounded-lg border-2 border-[#003399] bg-blue-50 p-6">
              <h2 className="text-lg font-bold text-[#0d1b3e]">
                Report an Incident
              </h2>
              <p className="mt-2 text-gray-700">
                To report a security incident, suspected data breach, or
                platform issue requiring urgent attention:
              </p>
              <p className="mt-3">
                <a
                  href="mailto:incidents@aicompass.eu"
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
                  incidents@aicompass.eu
                </a>
              </p>
              <p className="mt-4 text-gray-600">
                For general security questions or to report a vulnerability,
                contact{" "}
                <a
                  href="mailto:security@aicompass.eu"
                  className="text-[#003399] hover:underline"
                >
                  security@aicompass.eu
                </a>
                . See our{" "}
                <a
                  href="/en/security"
                  className="text-[#003399] hover:underline"
                >
                  Security Policy
                </a>{" "}
                for full details.
              </p>
              <p className="mt-4 text-xs text-gray-500">
                When reporting an incident, please include: a description of the
                issue, when you first observed it, which features are affected,
                and any relevant screenshots or error messages.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
