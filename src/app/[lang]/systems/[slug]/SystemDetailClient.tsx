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

interface Props {
  system: SystemData;
  overall: string;
  locale: string;
  dimensionScores?: Record<string, number>;
}

// ─── Helpers ────────────────────────────────────────────
// gradeColor() is imported from @/lib/scoring (single source of truth)

const riskStyles: Record<string, string> = {
  High: "bg-red-100 text-red-700 border-red-200",
  Limited: "bg-amber-100 text-amber-700 border-amber-200",
  Minimal: "bg-green-100 text-green-700 border-green-200",
};

const capabilityLabels: Record<string, string> = {
  "generative-ai": "Generative AI",
  "supervised-ml": "Supervised Machine Learning",
  "unsupervised-ml": "Unsupervised Machine Learning",
  "conversational-ai": "Conversational AI",
  "autonomous-agents": "Autonomous AI Agents",
  "search-retrieval": "AI Search & Retrieval",
  "computer-vision": "Computer Vision",
  "decision-intelligence": "Decision Intelligence",
  "nlp": "Natural Language Processing",
  "ai-infrastructure": "AI Infrastructure",
  "cybersecurity-ai": "Cybersecurity AI",
};

// ─── Accordion Section ──────────────────────────────────

function AccordionSection({
  title,
  icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon: React.ReactNode;
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
        </div>
        <svg
          className={`h-5 w-5 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
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

function Field({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="py-2.5 border-b border-gray-50 last:border-0">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</span>
      <p className="mt-0.5 text-sm text-gray-700 leading-relaxed">{value}</p>
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

// Dimension labels for the spider chart
const DIMENSION_CONFIG: { key: string; label: string; grade: (v: number) => string }[] = [
  { key: "compliance", label: "Regulatory Compliance", grade: numToGrade },
  { key: "security", label: "Security Posture", grade: numToGrade },
  { key: "maturity", label: "Vendor Maturity", grade: numToGrade },
  { key: "sovereignty", label: "Data Sovereignty", grade: numToGrade },
  { key: "transparency", label: "AI Transparency", grade: numToGrade },
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

export default function SystemDetailClient({ system, overall, locale, dimensionScores }: Props) {
  const capLabel = capabilityLabels[system.capabilityType] || system.type;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-gray-400">
        <Link href={`/${locale}`} className="hover:text-[#003399]">Home</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/database`} className="hover:text-[#003399]">Database</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">{system.name}</span>
      </nav>

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
                  {system.risk} Risk ⓘ
                </span>
              </Tooltip>
              {system.vendorHq && (
                <span className="rounded-full bg-white/10 border border-white/20 px-2.5 py-0.5 text-xs text-blue-200">
                  HQ: {system.vendorHq}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`inline-flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white ${gradeColor(overall)} ring-4 ring-white/20`}>
              {overall}
            </span>
            <div className="text-right">
              <p className="text-xs text-blue-200">Overall</p>
              <p className="text-xs text-blue-200">Score</p>
            </div>
          </div>
        </div>

        {/* Description — one-liner, not a wall */}
        <p className="mt-4 text-sm leading-relaxed text-blue-100/80 max-w-3xl">{system.description}</p>
      </div>

      {/* ── Spider Chart — Compliance Overview ── */}
      {dimensionScores && (
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider text-center mb-4">
            Compliance Overview
          </h2>
          <SpiderChart
            dimensions={DIMENSION_CONFIG.map((d) => ({
              id: d.key,
              label: d.label,
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
            <p className="text-[10px] font-semibold text-gray-400 uppercase">EU Presence</p>
            <p className="mt-0.5 text-sm font-medium text-gray-800 line-clamp-2">{system.euPresence.split(".")[0]}</p>
          </div>
        )}
        {system.certifications && (
          <div className="rounded-xl border border-gray-200 bg-white p-3">
            <p className="text-[10px] font-semibold text-gray-400 uppercase">Certifications</p>
            <p className="mt-0.5 text-sm font-medium text-gray-800 line-clamp-2">{system.certifications.split(".")[0]}</p>
          </div>
        )}
        {system.euResidency && (
          <div className="rounded-xl border border-gray-200 bg-white p-3">
            <p className="text-[10px] font-semibold text-gray-400 uppercase">EU Data Residency</p>
            <p className="mt-0.5 text-sm font-medium text-gray-800 line-clamp-2">{system.euResidency.split(".")[0]}</p>
          </div>
        )}
        {system.assessedAt && (
          <div className="rounded-xl border border-gray-200 bg-white p-3">
            <p className="text-[10px] font-semibold text-gray-400 uppercase">Last Assessed</p>
            <p className="mt-0.5 text-sm font-medium text-gray-800">
              {new Date(system.assessedAt).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
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
        <h2 className="text-lg font-bold text-gray-900">Compliance Scores</h2>
        <p className="mt-1 text-sm text-gray-500">
          Each framework is assessed independently. Click to see the detailed breakdown.
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
                <p className="text-[10px] text-gray-400">{s.framework.criteriaCount} criteria assessed</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Role-Based Drill-Down ── */}
      <div className="mt-10">
        <RoleDrillDown system={system} scores={system.scores} />
      </div>

      {/* ── Drill-Down Sections (Accordion) ── */}
      <div className="mt-10 space-y-3">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Detailed Profile</h2>

        {/* Data Handling */}
        {(system.dataStorage || system.dataProcessing || system.trainingDataUse) && (
          <AccordionSection title="Data Handling" icon={icons.data}>
            <Field label="Storage Locations" value={system.dataStorage} />
            <Field label="Processing Locations" value={system.dataProcessing} />
            <Field label="Training Data Usage" value={system.trainingDataUse} />
            <Field label="Subprocessors" value={system.subprocessors} />
          </AccordionSection>
        )}

        {/* Contractual */}
        {(system.dpaDetails || system.slaDetails) && (
          <AccordionSection title="Contractual Commitments" icon={icons.contract}>
            <Field label="Data Processing Agreement" value={system.dpaDetails} />
            <Field label="Service Level Agreements" value={system.slaDetails} />
            <Field label="Data Portability" value={system.dataPortability} />
            <Field label="Exit Terms" value={system.exitTerms} />
            <Field label="IP Terms" value={system.ipTerms} />
          </AccordionSection>
        )}

        {/* Security */}
        {(system.certifications || system.encryptionInfo) && (
          <AccordionSection title="Security Posture" icon={icons.security}>
            <Field label="Certifications" value={system.certifications} />
            <Field label="Encryption" value={system.encryptionInfo} />
            <Field label="Access Controls" value={system.accessControls} />
          </AccordionSection>
        )}

        {/* AI Transparency */}
        {(system.modelDocs || system.explainability) && (
          <AccordionSection title="AI Transparency" icon={icons.transparency}>
            <Field label="Model Documentation" value={system.modelDocs} />
            <Field label="Explainability" value={system.explainability} />
            <Field label="Bias Testing" value={system.biasTesting} />
          </AccordionSection>
        )}

        {/* EU Compliance */}
        {(system.aiActStatus || system.gdprStatus) && (
          <AccordionSection title="EU Compliance Status" icon={icons.eu}>
            <Field label="EU AI Act" value={system.aiActStatus} />
            <Field label="GDPR" value={system.gdprStatus} />
            <Field label="EU Data Residency" value={system.euResidency} />
            <Field label="EU Presence" value={system.euPresence} />
          </AccordionSection>
        )}
      </div>

      {/* ── Procurement Tools CTA ── */}
      <div className="mt-10 rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-white p-6">
        <h3 className="text-sm font-bold text-[#003399] mb-3">Procurement Tools for {system.vendor} {system.name}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link href={`/${locale}/business-case`}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm hover:border-[#003399] hover:shadow-sm transition">
            <span className="text-lg">📊</span>
            <div>
              <p className="font-medium text-gray-900">Business Case</p>
              <p className="text-xs text-gray-500">Generate ROI/TCO report</p>
            </div>
          </Link>
          <Link href={`/${locale}/vendor-prep`}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm hover:border-[#003399] hover:shadow-sm transition">
            <span className="text-lg">🤝</span>
            <div>
              <p className="font-medium text-gray-900">Vendor Prep</p>
              <p className="text-xs text-gray-500">Meeting preparation kit</p>
            </div>
          </Link>
          <Link href={`/${locale}/compare`}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm hover:border-[#003399] hover:shadow-sm transition">
            <span className="text-lg">⚖️</span>
            <div>
              <p className="font-medium text-gray-900">Compare</p>
              <p className="text-xs text-gray-500">Side-by-side analysis</p>
            </div>
          </Link>
        </div>
      </div>

      {/* ── Disclaimer ── */}
      <div className="mt-6 rounded-xl bg-amber-50 border border-amber-200 p-4">
        <p className="text-xs text-amber-800">
          <strong>Assessment Disclaimer:</strong> Based on publicly available information as of the last review.
          Scores reflect what can be verified from vendor documentation, trust centers, and public certifications.
          For a verified assessment tailored to your use case,{" "}
          <Link href={`/${locale}/contact?category=services`} className="underline hover:text-amber-900">
            contact our consulting team
          </Link>.
        </p>
      </div>
    </div>
  );
}
