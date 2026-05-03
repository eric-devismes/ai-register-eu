"use client";

/**
 * SystemDetailClient — Interactive drill-down system assessment view.
 *
 * Design philosophy: consolidated overview first, details on demand.
 * - Quick facts strip at the top
 * - Score dashboard with clickable framework cards
 * - Collapsible accordion sections for detailed info
 * - Everything scannable, nothing forced on the user
 */

import { useState } from "react";
import Link from "next/link";
import SpiderChart from "@/components/charts/SpiderChart";
import RoleDrillDown from "@/components/systems/RoleDrillDown";
import { gradeColor } from "@/lib/scoring";
import { Tooltip } from "@/components/ui/Tooltip";
import { RISK_BADGES, RISK_TOOLTIPS } from "@/lib/constants";
import EvidenceReviewBanner from "@/components/evidence/EvidenceReviewBanner";
import { ClaimChip, VerifiedBadge } from "@/components/evidence/ClaimEvidence";
import { useT } from "@/lib/locale-context";
import type { ClaimRow } from "@/types/claims";
import { FIELD_TO_CLAIM_PREFIX } from "@/types/claims";

// ─── Types ──────────────────────────────────────────────

interface FrameworkScore {
  id: string;
  score: string;
  framework: { slug: string; name: string; criteriaCount: number };
}

interface Industry {
  id: string;
  slug: string;
  name: string;
}

interface SystemData {
  slug: string;
  vendor: string;
  name: string;
  type: string;
  risk: string;
  description: string;
  capabilityType: string;
  vendorHq: string;
  euPresence: string;
  useCases: string;
  dataStorage: string;
  dataProcessing: string;
  trainingDataUse: string;
  subprocessors: string;
  dpaDetails: string;
  slaDetails: string;
  dataPortability: string;
  exitTerms: string;
  ipTerms: string;
  certifications: string;
  encryptionInfo: string;
  accessControls: string;
  modelDocs: string;
  explainability: string;
  biasTesting: string;
  aiActStatus: string;
  gdprStatus: string;
  euResidency: string;
  deploymentModel: string;
  sourceModel: string;
  employeeCount: string;
  fundingStatus: string;
  marketPresence: string;
  notableCustomers: string;
  customerStories: string;
  customerCount: string;
  assessedAt: string | null;
  assessmentNote: string;
  industries: Industry[];
  scores: FrameworkScore[];
}

export type { ClaimRow };

interface Props {
  system: SystemData;
  overall: string;
  locale: string;
  dimensionScores?: Record<string, number>;
  claims?: ClaimRow[];
}

// ─── Helpers ────────────────────────────────────────────
// gradeColor() is imported from @/lib/scoring (single source of truth)

const riskStyles: Record<string, string> = {
  High: "bg-red-100 text-red-700 border-red-200",
  Limited: "bg-amber-100 text-amber-700 border-amber-200",
  Minimal: "bg-green-100 text-green-700 border-green-200",
};

const capabilityKeys: Record<string, string> = {
  "generative-ai": "system.capability.generativeAi",
  "supervised-ml": "system.capability.supervisedMl",
  "unsupervised-ml": "system.capability.unsupervisedMl",
  "conversational-ai": "system.capability.conversationalAi",
  "autonomous-agents": "system.capability.autonomousAgents",
  "search-retrieval": "system.capability.searchRetrieval",
  "computer-vision": "system.capability.computerVision",
  "decision-intelligence": "system.capability.decisionIntelligence",
  "nlp": "system.capability.nlp",
  "ai-infrastructure": "system.capability.aiInfrastructure",
  "cybersecurity-ai": "system.capability.cybersecurityAi",
};

// ─── Accordion Section ──────────────────────────────────

function AccordionSection({
  title,
  icon,
  verifiedAt,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon: React.ReactNode;
  verifiedAt?: string | null;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition hover:bg-gray-50"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#003399]/10 text-[#003399]">
            {icon}
          </span>
          <span className="text-sm font-semibold text-gray-900">{title}</span>
          {verifiedAt && <VerifiedBadge dateStr={verifiedAt} />}
        </div>
        <svg
          className={`h-5 w-5 shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {open && (
        <div className="border-t border-gray-100 px-5 py-4">
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Field row ──────────────────────────────────────────

function Field({ label, value, sourceUrl, stale, fieldClaims }: {
  label: string;
  value: string;
  sourceUrl?: string;
  stale?: boolean;
  fieldClaims?: ClaimRow[];
}) {
  if (!value) return null;
  const hasChips = fieldClaims && fieldClaims.length > 0;
  const fieldVerifiedAt = hasChips
    ? fieldClaims.reduce<string | null>((latest, c) => {
        if (!c.verifiedAt) return latest;
        return !latest || c.verifiedAt > latest ? c.verifiedAt : latest;
      }, null)
    : null;

  return (
    <div className="py-2.5 border-b border-gray-50 last:border-0">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</span>
        {fieldVerifiedAt && <VerifiedBadge dateStr={fieldVerifiedAt} />}
      </div>
      {hasChips ? (
        <p className="mt-1 text-sm text-gray-700 leading-relaxed">
          {fieldClaims.map((c, i) => (
            <span key={c.id} className="inline">
              {i > 0 && <span className="text-gray-300 mx-1.5 select-none">·</span>}
              <ClaimChip claim={c} />
            </span>
          ))}
        </p>
      ) : stale ? (
        <p className="mt-0.5 text-sm text-gray-400 italic">Not currently verifiable — pending re-check</p>
      ) : sourceUrl ? (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-0.5 block text-sm text-[#003399] hover:underline leading-relaxed"
        >
          {value}
        </a>
      ) : (
        <p className="mt-0.5 text-sm text-gray-700 leading-relaxed">{value}</p>
      )}
    </div>
  );
}

// ─── SVG Icons (inline, tiny) ───────────────────────────

const icons = {
  data: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375" />
    </svg>
  ),
  contract: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
  ),
  security: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
    </svg>
  ),
  transparency: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  ),
  eu: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582" />
    </svg>
  ),
};

// ─── Main Component ─────────────────────────────────────

// Dimension keys for the spider chart — labels resolved via t() at render time
const DIMENSION_KEYS: { key: string; labelKey: string; grade: (v: number) => string }[] = [
  { key: "compliance", labelKey: "system.dimension.compliance", grade: numToGrade },
  { key: "security", labelKey: "system.dimension.security", grade: numToGrade },
  { key: "maturity", labelKey: "system.dimension.maturity", grade: numToGrade },
  { key: "sovereignty", labelKey: "system.dimension.sovereignty", grade: numToGrade },
  { key: "transparency", labelKey: "system.dimension.transparency", grade: numToGrade },
];

function numToGrade(v: number): string {
  if (v >= 9.5) return "A+";
  if (v >= 8.5) return "A";
  if (v >= 7.5) return "A-";
  if (v >= 6.5) return "B+";
  if (v >= 5.5) return "B";
  if (v >= 4.5) return "B-";
  if (v >= 3.5) return "C+";
  if (v >= 2.5) return "C";
  if (v >= 1.5) return "C-";
  return "D";
}

function toFragment(url: string, quote: string): string {
  try { return `${url}#:~:text=${encodeURIComponent(quote.trim().slice(0, 120))}`; }
  catch { return url; }
}

export default function SystemDetailClient({ system, overall, locale, dimensionScores, claims = [] }: Props) {
  const t = useT();
  const capLabel = capabilityKeys[system.capabilityType] ? t(capabilityKeys[system.capabilityType]) : system.type;
  const hasClaims = claims.length > 0;

  // Build prefix → best claim (first non-stale, else first) — for src() / isStale() / sectionVerified()
  const prefixToClaim = new Map<string, ClaimRow>();
  // Build prefix → all claims — for chip rendering
  const prefixToClaims = new Map<string, ClaimRow[]>();
  for (const c of claims) {
    const prefix = c.field.split(".")[0];
    const existing = prefixToClaim.get(prefix);
    if (!existing || existing.stale) prefixToClaim.set(prefix, c);
    if (!prefixToClaims.has(prefix)) prefixToClaims.set(prefix, []);
    prefixToClaims.get(prefix)!.push(c);
  }

  // Returns all non-stale published claims for a field (for chip rendering).
  // Falls back to stale claims if that's all we have (stale chips still show the overlay).
  const claimsFor = (fieldName: string): ClaimRow[] => {
    const prefix = FIELD_TO_CLAIM_PREFIX[fieldName];
    if (!prefix) return [];
    const all = prefixToClaims.get(prefix) ?? [];
    const fresh = all.filter((c) => !c.stale);
    return fresh.length > 0 ? fresh : [];
  };

  // Source link for a field — text-fragment URL if claim has quote, else plain URL.
  // Returns undefined if claim is stale (we hide stale data).
  const src = (fieldName: string): string | undefined => {
    const prefix = FIELD_TO_CLAIM_PREFIX[fieldName];
    if (!prefix) return undefined;
    const claim = prefixToClaim.get(prefix);
    if (!claim?.source?.url || claim.stale) return undefined;
    return claim.evidenceQuote ? toFragment(claim.source.url, claim.evidenceQuote) : claim.source.url;
  };

  const isStale = (fieldName: string): boolean => {
    const prefix = FIELD_TO_CLAIM_PREFIX[fieldName];
    if (!prefix) return false;
    return prefixToClaim.get(prefix)?.stale ?? false;
  };

  // Most recent verifiedAt across a set of field names (for section badge)
  const sectionVerified = (fieldNames: string[]): string | null => {
    const dates = fieldNames
      .map(f => {
        const prefix = FIELD_TO_CLAIM_PREFIX[f];
        return prefix ? (prefixToClaim.get(prefix)?.verifiedAt ?? null) : null;
      })
      .filter(Boolean)
      .sort() as string[];
    return dates.at(-1) ?? null;
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-gray-400">
        <Link href={`/${locale}`} className="hover:text-[#003399]">{t("system.breadcrumb.home")}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/database`} className="hover:text-[#003399]">{t("system.breadcrumb.database")}</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">{system.name}</span>
      </nav>

      {/* ── Evidence review banner — shown until claims backfill is complete ── */}
      {!hasClaims && (
        <div className="mb-6">
          <EvidenceReviewBanner />
        </div>
      )}

      {/* ── Hero Header ── */}
      <div className="rounded-2xl bg-gradient-to-br from-[#0d1b3e] to-[#003399] p-6 sm:p-8 text-white">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-[#ffc107] uppercase tracking-wider">{system.vendor}</p>
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{system.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white/10 border border-white/20 px-2.5 py-0.5 text-xs text-blue-100">
                {capLabel}
              </span>
              <Tooltip
                text={RISK_TOOLTIPS[system.risk]?.short || "EU AI Act Risk Level"}
                detail={RISK_TOOLTIPS[system.risk]?.detail}
                clickable
                position="bottom"
              >
                <span className={`cursor-pointer rounded-full border px-2.5 py-0.5 text-xs font-semibold ${riskStyles[system.risk] || riskStyles.Limited}`}>
                  {t("system.riskLabel").replace("{risk}", system.risk)} ⓘ
                </span>
              </Tooltip>
              {system.vendorHq && (
                <span className="rounded-full bg-white/10 border border-white/20 px-2.5 py-0.5 text-xs text-blue-200">
                  {t("system.hqLabel").replace("{location}", system.vendorHq)}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`inline-flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white ${gradeColor(overall)} ring-4 ring-white/20`}>
              {overall}
            </span>
            <div className="text-right">
              <p className="text-xs text-blue-200">{t("system.overallScore")}</p>
            </div>
          </div>
        </div>

        {/* Description — one-liner, not a wall */}
        <p className="mt-4 text-sm leading-relaxed text-blue-100/80 max-w-3xl">{system.description}</p>
      </div>

      {/* ── Evidence commitment strip ── */}
      {hasClaims && (
        <p className="mt-4 text-xs text-gray-400">
          {t("system.evidenceCommitment")}{" "}
          <a
            href={`mailto:corrections@vendorscope.eu?subject=Error%20report%20—%20${encodeURIComponent(system.name)}`}
            className="underline hover:text-gray-600"
          >
            {t("system.reportError")}
          </a>
        </p>
      )}

      {/* ── Spider Chart — Compliance Overview ── */}
      {dimensionScores && (
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider text-center mb-4">
            {t("system.complianceOverview")}
          </h2>
          <SpiderChart
            dimensions={DIMENSION_KEYS.map((d) => ({
              id: d.key,
              label: t(d.labelKey),
              score: dimensionScores[d.key] || 0,
              grade: d.grade(dimensionScores[d.key] || 0),
            }))}
            size={360}
          />
        </div>
      )}

      {/* ── Quick Facts Strip ── */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {system.euPresence && (
          <div className="rounded-xl border border-gray-200 bg-white p-3">
            <p className="text-[10px] font-semibold text-gray-400 uppercase">{t("system.quickFact.euPresence")}</p>
            <p className="mt-0.5 text-sm font-medium text-gray-800 line-clamp-2">{system.euPresence.split(".")[0]}</p>
          </div>
        )}
        {system.certifications && (
          <div className="rounded-xl border border-gray-200 bg-white p-3">
            <p className="text-[10px] font-semibold text-gray-400 uppercase">{t("system.quickFact.certifications")}</p>
            <p className="mt-0.5 text-sm font-medium text-gray-800 line-clamp-2">{system.certifications.split(".")[0]}</p>
          </div>
        )}
        {system.euResidency && (
          <div className="rounded-xl border border-gray-200 bg-white p-3">
            <p className="text-[10px] font-semibold text-gray-400 uppercase">{t("system.quickFact.euDataResidency")}</p>
            <p className="mt-0.5 text-sm font-medium text-gray-800 line-clamp-2">{system.euResidency.split(".")[0]}</p>
          </div>
        )}
        {system.assessedAt && (
          <div className="rounded-xl border border-gray-200 bg-white p-3">
            <p className="text-[10px] font-semibold text-gray-400 uppercase">{t("system.quickFact.lastAssessed")}</p>
            <p className="mt-0.5 text-sm font-medium text-gray-800">
              {new Date(system.assessedAt).toLocaleDateString(locale, { month: "short", year: "numeric" })}
            </p>
          </div>
        )}
      </div>

      {/* ── Industries & Use Cases (pills) ── */}
      <div className="mt-6 flex flex-wrap gap-2">
        {system.industries.map((ind) => (
          <Link key={ind.id} href={`/${locale}/industries/${ind.slug}`}
            className="rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100 transition">
            {ind.name}
          </Link>
        ))}
        {system.useCases && system.useCases.split("\n").filter(Boolean).slice(0, 8).map((uc, i) => {
          // Extract the short title before brackets/details
          const label = uc.replace(/\s*\[.*$/, "").trim();
          return (
            <span key={i} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
              {label}
            </span>
          );
        })}
      </div>

      {/* ── Score Dashboard ── */}
      <div className="mt-10">
        <h2 className="text-lg font-bold text-gray-900">{t("system.complianceScores")}</h2>
        <p className="mt-1 text-sm text-gray-500">
          {t("system.complianceScoresSubtitle")}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {system.scores.map((s) => (
            <Link
              key={s.id}
              href={`/${locale}/systems/${system.slug}/${s.framework.slug}`}
              className="group flex items-center gap-3 rounded-xl border-2 border-gray-200 bg-white p-4 transition hover:border-[#003399]/40 hover:shadow-md"
            >
              <span className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${gradeColor(s.score)}`}>
                {s.score}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 group-hover:text-[#003399] truncate">{s.framework.name}</p>
                <p className="text-[10px] text-gray-400">{t("system.criteriaAssessed").replace("{count}", String(s.framework.criteriaCount))}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Role-Based Drill-Down ── */}
      <div className="mt-10">
        <RoleDrillDown system={system} scores={system.scores} claims={claims} />
      </div>

      {/* ── Drill-Down Sections (Accordion) ── */}
      <div className="mt-10 space-y-3">
        <h2 className="text-lg font-bold text-gray-900 mb-1">{t("system.detailedProfile")}</h2>

        {/* Data Handling — dim: sovereignty */}
        {(system.dataStorage || system.dataProcessing || system.trainingDataUse) && (
          <div id="dim-sovereignty" className="scroll-mt-24">
            <AccordionSection title={t("system.accordion.dataHandling")} icon={icons.data}
              verifiedAt={sectionVerified(["dataStorage","dataProcessing","trainingDataUse","subprocessors"])}>
              <Field label={t("system.field.storageLocations")} value={system.dataStorage} sourceUrl={src("dataStorage")} stale={isStale("dataStorage")} fieldClaims={claimsFor("dataStorage")} />
              <Field label={t("system.field.processingLocations")} value={system.dataProcessing} sourceUrl={src("dataProcessing")} stale={isStale("dataProcessing")} fieldClaims={claimsFor("dataProcessing")} />
              <Field label={t("system.field.trainingDataUsage")} value={system.trainingDataUse} sourceUrl={src("trainingDataUse")} stale={isStale("trainingDataUse")} fieldClaims={claimsFor("trainingDataUse")} />
              <Field label={t("system.field.subprocessors")} value={system.subprocessors} sourceUrl={src("subprocessors")} stale={isStale("subprocessors")} fieldClaims={claimsFor("subprocessors")} />
            </AccordionSection>
          </div>
        )}

        {/* Contractual — dim: maturity */}
        {(system.dpaDetails || system.slaDetails) && (
          <div id="dim-maturity" className="scroll-mt-24">
            <AccordionSection title={t("system.accordion.contractualCommitments")} icon={icons.contract}
              verifiedAt={sectionVerified(["dpaDetails","dataPortability","exitTerms"])}>
              <Field label={t("system.field.dpa")} value={system.dpaDetails} sourceUrl={src("dpaDetails")} stale={isStale("dpaDetails")} fieldClaims={claimsFor("dpaDetails")} />
              <Field label={t("system.field.sla")} value={system.slaDetails} />
              <Field label={t("system.field.dataPortability")} value={system.dataPortability} sourceUrl={src("dataPortability")} stale={isStale("dataPortability")} fieldClaims={claimsFor("dataPortability")} />
              <Field label={t("system.field.exitTerms")} value={system.exitTerms} sourceUrl={src("exitTerms")} stale={isStale("exitTerms")} fieldClaims={claimsFor("exitTerms")} />
              <Field label={t("system.field.ipTerms")} value={system.ipTerms} />
            </AccordionSection>
          </div>
        )}

        {/* Security — dim: security */}
        {(system.certifications || system.encryptionInfo) && (
          <div id="dim-security" className="scroll-mt-24">
            <AccordionSection title={t("system.accordion.securityPosture")} icon={icons.security}
              verifiedAt={sectionVerified(["certifications","encryptionInfo","accessControls"])}>
              <Field label={t("system.field.certifications")} value={system.certifications} sourceUrl={src("certifications")} stale={isStale("certifications")} fieldClaims={claimsFor("certifications")} />
              <Field label={t("system.field.encryption")} value={system.encryptionInfo} sourceUrl={src("encryptionInfo")} stale={isStale("encryptionInfo")} fieldClaims={claimsFor("encryptionInfo")} />
              <Field label={t("system.field.accessControls")} value={system.accessControls} sourceUrl={src("accessControls")} stale={isStale("accessControls")} fieldClaims={claimsFor("accessControls")} />
            </AccordionSection>
          </div>
        )}

        {/* AI Transparency — dim: transparency */}
        {(system.modelDocs || system.explainability) && (
          <div id="dim-transparency" className="scroll-mt-24">
            <AccordionSection title={t("system.accordion.aiTransparency")} icon={icons.transparency}>
              <Field label={t("system.field.modelDocumentation")} value={system.modelDocs} />
              <Field label={t("system.field.explainability")} value={system.explainability} />
              <Field label={t("system.field.biasTesting")} value={system.biasTesting} />
            </AccordionSection>
          </div>
        )}

        {/* EU Compliance — dim: compliance */}
        {(system.aiActStatus || system.gdprStatus) && (
          <div id="dim-compliance" className="scroll-mt-24">
            <AccordionSection title={t("system.accordion.euComplianceStatus")} icon={icons.eu}
              verifiedAt={sectionVerified(["aiActStatus","gdprStatus","euResidency"])}>
              <Field label={t("system.field.euAiAct")} value={system.aiActStatus} sourceUrl={src("aiActStatus")} stale={isStale("aiActStatus")} fieldClaims={claimsFor("aiActStatus")} />
              <Field label={t("system.field.gdpr")} value={system.gdprStatus} sourceUrl={src("gdprStatus")} stale={isStale("gdprStatus")} fieldClaims={claimsFor("gdprStatus")} />
              <Field label={t("system.field.euDataResidency")} value={system.euResidency} sourceUrl={src("euResidency")} stale={isStale("euResidency")} fieldClaims={claimsFor("euResidency")} />
              <Field label={t("system.field.euPresence")} value={system.euPresence} />
            </AccordionSection>
          </div>
        )}
      </div>

      {/* ── Procurement Tools CTA ── */}
      <div className="mt-10 rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-white p-6">
        <h3 className="text-sm font-bold text-[#003399] mb-3">{t("system.procurementTools").replace("{vendor}", system.vendor).replace("{name}", system.name)}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link href={`/${locale}/vendor-prep`}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm hover:border-[#003399] hover:shadow-sm transition">
            <span className="text-lg">🤝</span>
            <div>
              <p className="font-medium text-gray-900">{t("system.meetingPrep")}</p>
              <p className="text-xs text-gray-500">{t("system.meetingPrepDesc")}</p>
            </div>
          </Link>
          <Link href={`/${locale}/compare`}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm hover:border-[#003399] hover:shadow-sm transition">
            <span className="text-lg">⚖️</span>
            <div>
              <p className="font-medium text-gray-900">{t("system.compare")}</p>
              <p className="text-xs text-gray-500">{t("system.compareDesc")}</p>
            </div>
          </Link>
        </div>
      </div>

      {/* ── Disclaimer ── */}
      <div className="mt-6 rounded-xl bg-amber-50 border border-amber-200 p-4">
        <p className="text-xs text-amber-800">
          <strong>{t("system.disclaimerTitle")}</strong> {t("system.disclaimerText")}{" "}
          <Link href={`/${locale}/contact?category=services`} className="underline hover:text-amber-900">
            {t("system.disclaimerLink")}
          </Link>.
        </p>
      </div>
    </div>
  );
}
