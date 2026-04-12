"use client";

/**
 * CompareClient — The full interactive comparison tool.
 *
 * Phases:
 *   1. "input"    — User describes use case + optional filters
 *   2. "matches"  — AI shows ranked matching systems; user selects
 *   3. "compare"  — Side-by-side comparison table
 */

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useLocale } from "@/lib/locale-context";
import { Tooltip } from "@/components/ui/Tooltip";
import { RISK_TOOLTIPS } from "@/lib/constants";

// ─── Spider chart dimensions ─────────────────────────────
const RADAR_DIMENSIONS = [
  { key: "compliance", label: "Compliance", section: "EU Compliance" },
  { key: "security", label: "Security", section: "Security" },
  { key: "dataSovereignty", label: "Data Sovereignty", section: "Data & Infrastructure" },
  { key: "integration", label: "Integration", section: "Supply Chain" },
  { key: "pricing", label: "Pricing", section: "Vendor & Product" },
  { key: "euReadiness", label: "EU Readiness", section: "Governance & Legal" },
] as const;

// ─── Score to numeric conversion ─────────────────────────
function scoreToNumeric(score: string): number {
  const map: Record<string, number> = {
    "A+": 100, "A": 92, "A-": 85,
    "B+": 78, "B": 70, "B-": 62,
    "C+": 55, "C": 48, "C-": 40,
    "D+": 32, "D": 25, "D-": 18,
    "F": 10, "N/A": 0,
  };
  return map[score] ?? 0;
}

// ─── Derive radar scores from compare data ───────────────
function deriveRadarScores(system: CompareSystem): number[] {
  // Compliance: avg of AI Act + GDPR scores
  const compliance = avg([
    scoreToNumeric(system["score_eu-ai-act"] || "N/A"),
    scoreToNumeric(system["score_gdpr"] || "N/A"),
  ]);
  // Security: avg of DORA + NIS2
  const security = avg([
    scoreToNumeric(system["score_dora"] || "N/A"),
    scoreToNumeric(system["score_nis2"] || "N/A"),
  ]);
  // Data Sovereignty: based on EU residency presence + encryption info
  const dataSov = system.euResidency?.toLowerCase().includes("eu") ? 85
    : system.euResidency ? 55 : 30;
  // Integration: based on deployment model + data portability presence
  const integration = (system.deploymentModel ? 50 : 25) + (system.dataPortability ? 30 : 0);
  // Pricing: invert risk (lower risk = better pricing/value)
  const pricing = system.risk === "Minimal" ? 85 : system.risk === "Limited" ? 65 : 40;
  // EU Readiness: avg of EBA/EIOPA + MDR/IVDR + overall
  const euReadiness = avg([
    scoreToNumeric(system["score_eba-eiopa-guidelines"] || "N/A"),
    scoreToNumeric(system["score_mdr-ivdr"] || "N/A"),
    scoreToNumeric(system.overallScore || "N/A"),
  ]);

  return [compliance, security, dataSov, Math.min(integration, 100), pricing, euReadiness];
}

function avg(nums: number[]): number {
  const valid = nums.filter((n) => n > 0);
  return valid.length ? Math.round(valid.reduce((a, b) => a + b, 0) / valid.length) : 30;
}

// ─── Overall numeric score for podium ranking ────────────
function overallNumericScore(system: CompareSystem): number {
  const scores = deriveRadarScores(system);
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

// ─── Brand colors for systems ────────────────────────────
const SYSTEM_COLORS = [
  { fill: "rgba(0, 51, 153, 0.20)", stroke: "#003399" },   // EU Blue
  { fill: "rgba(255, 193, 7, 0.20)", stroke: "#d4a000" },   // Gold
  { fill: "rgba(205, 127, 50, 0.20)", stroke: "#CD7F32" },  // Bronze
  { fill: "rgba(16, 185, 129, 0.18)", stroke: "#059669" },   // Emerald
  { fill: "rgba(139, 92, 246, 0.18)", stroke: "#7c3aed" },   // Purple
];

// ─── Podium Component ────────────────────────────────────

function Podium({ systems }: { systems: { name: string; vendor: string; score: number; rank: number }[] }) {
  const medals = ["🥇", "🥈", "🥉"];
  const medalColors = ["#FFD700", "#C0C0C0", "#CD7F32"];
  const heights = [160, 200, 120]; // silver, gold, bronze (visual: center tallest)

  // Reorder for visual: 2nd, 1st, 3rd
  const podiumOrder = systems.length >= 3
    ? [systems[1], systems[0], systems[2]]
    : systems.length === 2
    ? [systems[1], systems[0]]
    : [systems[0]];

  const visualHeights = systems.length >= 3
    ? [heights[0], heights[1], heights[2]]
    : systems.length === 2
    ? [heights[0], heights[1]]
    : [heights[1]];

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Ranking</h3>
      <div className="flex items-end justify-center gap-2 sm:gap-3">
        {podiumOrder.map((sys, i) => (
          <div key={sys.vendor} className="flex flex-col items-center">
            {/* Medal + name above podium */}
            <div className="text-center mb-2">
              <span className="text-2xl">{medals[sys.rank - 1] || ""}</span>
              <div className="text-xs font-bold text-gray-800 max-w-[100px] truncate">{sys.vendor}</div>
              <div className="text-[10px] text-gray-500 max-w-[100px] truncate">{sys.name}</div>
              <div className="text-xs font-semibold text-gray-600 mt-0.5">{sys.score}pts</div>
            </div>
            {/* Podium step */}
            <div
              className="w-20 sm:w-24 rounded-t-lg flex items-start justify-center pt-3 transition-all"
              style={{
                height: `${visualHeights[i]}px`,
                backgroundColor: medalColors[sys.rank - 1] || "#e5e7eb",
                opacity: 0.85,
              }}
            >
              <span className="text-xl font-black text-white drop-shadow-sm">{sys.rank}</span>
            </div>
          </div>
        ))}
      </div>
      {/* Podium base */}
      <div
        className="rounded-b-lg bg-gray-200"
        style={{ width: `${podiumOrder.length * (96 + 12)}px`, height: "6px" }}
      />
    </div>
  );
}

// ─── Radar/Spider Chart (pure SVG) ───────────────────────

function RadarChart({
  systems,
  onDimensionClick,
}: {
  systems: { vendor: string; scores: number[]; colorIdx: number }[];
  onDimensionClick: (sectionKey: string) => void;
}) {
  const size = 300;
  const center = size / 2;
  const radius = 110;
  const levels = 4;
  const dims = RADAR_DIMENSIONS.length;

  // Angle for each dimension (starting from top, clockwise)
  function angle(i: number) {
    return (Math.PI * 2 * i) / dims - Math.PI / 2;
  }

  // Point on radar at given level (0-100) for dimension i
  function point(i: number, value: number): [number, number] {
    const r = (value / 100) * radius;
    return [center + r * Math.cos(angle(i)), center + r * Math.sin(angle(i))];
  }

  // Build polygon points string
  function polygon(scores: number[]) {
    return scores.map((s, i) => point(i, s).join(",")).join(" ");
  }

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Performance Radar</h3>
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[300px]" role="img" aria-label="Radar chart comparing AI systems">
        {/* Grid rings */}
        {Array.from({ length: levels }, (_, l) => {
          const r = (radius * (l + 1)) / levels;
          const pts = Array.from({ length: dims }, (_, i) => {
            const x = center + r * Math.cos(angle(i));
            const y = center + r * Math.sin(angle(i));
            return `${x},${y}`;
          }).join(" ");
          return (
            <polygon
              key={l}
              points={pts}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          );
        })}

        {/* Axis lines */}
        {Array.from({ length: dims }, (_, i) => {
          const [x, y] = point(i, 100);
          return (
            <line key={i} x1={center} y1={center} x2={x} y2={y} stroke="#d1d5db" strokeWidth="1" />
          );
        })}

        {/* System polygons */}
        {systems.map((sys) => {
          const colors = SYSTEM_COLORS[sys.colorIdx % SYSTEM_COLORS.length];
          return (
            <polygon
              key={sys.vendor}
              points={polygon(sys.scores)}
              fill={colors.fill}
              stroke={colors.stroke}
              strokeWidth="2"
            />
          );
        })}

        {/* Dimension labels (clickable) */}
        {RADAR_DIMENSIONS.map((dim, i) => {
          const labelRadius = radius + 28;
          const x = center + labelRadius * Math.cos(angle(i));
          const y = center + labelRadius * Math.sin(angle(i));
          return (
            <text
              key={dim.key}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[10px] font-semibold cursor-pointer hover:opacity-70 transition-opacity"
              fill="#003399"
              onClick={() => onDimensionClick(dim.section)}
              role="button"
              tabIndex={0}
            >
              {dim.label}
            </text>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-3 mt-2">
        {systems.map((sys) => {
          const colors = SYSTEM_COLORS[sys.colorIdx % SYSTEM_COLORS.length];
          return (
            <div key={sys.vendor} className="flex items-center gap-1.5 text-xs text-gray-600">
              <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: colors.stroke }} />
              {sys.vendor}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Collapsible Section ─────────────────────────────────

function CollapsibleSection({
  title,
  id,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  id: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className="rounded-xl border border-gray-200 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <span className="text-sm font-bold text-gray-700">{title}</span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-5 py-4">
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Types ────────────────────────────────────────────────

interface MatchResult {
  id: string;
  slug: string;
  vendor: string;
  name: string;
  type: string;
  risk: string;
  description: string;
  overallScore: string;
  relevanceScore: number;
  reason: string;
  useCaseMatch: string;
  riskNote: string;
  scores: Array<{ framework: string; frameworkSlug: string; score: string }>;
  industries: string[];
}

interface CompareAttribute {
  key: string;
  label: string;
  category: string;
}

interface CompareSystem {
  id: string;
  slug: string;
  vendor: string;
  name: string;
  overallScore: string;
  risk: string;
  [key: string]: string;
}

type Phase = "input" | "loading" | "matches" | "comparing" | "compare";

// ─── Filter options ─────────────────────────────────────

const INDUSTRY_OPTIONS = [
  { value: "", label: "Any industry" },
  { value: "financial-services", label: "Financial Services" },
  { value: "healthcare", label: "Healthcare" },
  { value: "insurance", label: "Insurance" },
  { value: "public-sector", label: "Public Sector" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "telecommunications", label: "Telecom" },
  { value: "energy-utilities", label: "Energy" },
  { value: "human-resources", label: "HR" },
];

const DEPLOYMENT_OPTIONS = [
  { value: "", label: "Any deployment" },
  { value: "cloud-only", label: "Cloud only" },
  { value: "self-hosted", label: "Self-hosted" },
  { value: "hybrid", label: "Hybrid" },
];

const CAPABILITY_OPTIONS = [
  { value: "", label: "Any capability" },
  { value: "conversational-ai", label: "Conversational AI" },
  { value: "document-processing", label: "Document processing" },
  { value: "decision-intelligence", label: "Decision intelligence" },
  { value: "workflow-automation", label: "Workflow automation" },
  { value: "code-generation", label: "Code generation" },
  { value: "analytics", label: "Analytics / BI" },
];

// ─── Score badge ─────────────────────────────────────────

function ScoreBadge({ score }: { score: string }) {
  const color = score.startsWith("A") ? "bg-emerald-500"
    : score.startsWith("B") ? "bg-blue-500"
    : score.startsWith("C") ? "bg-amber-500"
    : score === "N/A" ? "bg-gray-400"
    : "bg-red-500";
  return (
    <span className={`inline-flex items-center justify-center w-10 h-7 rounded text-white text-xs font-bold ${color}`}>
      {score}
    </span>
  );
}

function RiskBadge({ risk }: { risk: string }) {
  const color = risk === "High" ? "bg-red-100 text-red-700 border-red-200"
    : risk === "Limited" ? "bg-amber-100 text-amber-700 border-amber-200"
    : "bg-green-100 text-green-700 border-green-200";

  return (
    <Tooltip
      text={RISK_TOOLTIPS[risk]?.short || "EU AI Act Risk Level"}
      detail={RISK_TOOLTIPS[risk]?.detail}
      clickable
      position="bottom"
    >
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border cursor-pointer ${color}`}
      >
        {risk} Risk ⓘ
      </span>
    </Tooltip>
  );
}

function RelevanceBadge({ score }: { score: number }) {
  const color = score >= 85 ? "bg-emerald-100 text-emerald-700"
    : score >= 70 ? "bg-blue-100 text-blue-700"
    : "bg-gray-100 text-gray-600";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>
      {score}% match
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────

export function CompareClient({ tier = "anonymous" }: { tier?: string }) {
  const locale = useLocale();
  const hasFullAccess = tier === "pro" || tier === "enterprise";
  const isAnonymous = tier === "anonymous";

  // Anonymous users see a signup prompt instead of the tool
  if (isAnonymous) {
    return (
      <div className="mx-auto max-w-2xl text-center py-16">
        <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm opacity-60 pointer-events-none">
          <div className="space-y-4">
            <div className="h-10 w-full rounded-lg bg-gray-100 animate-pulse" />
            <div className="text-sm text-gray-400">Describe your AI use case...</div>
            <div className="grid grid-cols-3 gap-4 pt-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-lg border border-gray-100 p-4 space-y-2">
                  <div className="h-4 w-24 rounded bg-gray-100" />
                  <div className="h-3 w-full rounded bg-gray-50" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-2xl border-2 border-[#003399]/20 bg-gradient-to-br from-[#003399]/5 to-[#ffc107]/5 p-8">
          <h2 className="text-xl font-bold text-[#0d1b3e]">Create a Free Account to Compare</h2>
          <p className="mt-2 text-sm text-gray-600 max-w-md mx-auto">
            Sign up for free to compare AI systems side-by-side against EU compliance criteria.
            Upgrade to Pro for access to all 60+ systems.
          </p>
          <a href={`/${locale}/subscribe`}
            className="mt-5 inline-block rounded-lg bg-[#003399] px-8 py-3 text-sm font-semibold text-white hover:bg-[#002277] transition-colors shadow-sm">
            Create Free Account
          </a>
        </div>
      </div>
    );
  }
  const [phase, setPhase] = useState<Phase>("input");
  const [useCase, setUseCase] = useState("");
  const [industry, setIndustry] = useState("");
  const [deployment, setDeployment] = useState("");
  const [capability, setCapability] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [compareData, setCompareData] = useState<{
    systems: CompareSystem[];
    attributes: CompareAttribute[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [showExportUpgrade, setShowExportUpgrade] = useState(false);
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const toggleSection = useCallback((section: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  }, []);

  const scrollToSection = useCallback((section: string) => {
    // Open the section first, then scroll
    setOpenSections((prev) => {
      const next = new Set(prev);
      next.add(section);
      return next;
    });
    // Small delay to let the section render before scrolling
    setTimeout(() => {
      const el = sectionRefs.current[section];
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }, []);

  // ── Phase 1 → Match (direct, no follow-ups) ──────────
  async function handleMatch(e: React.FormEvent) {
    e.preventDefault();
    if (!useCase.trim()) return;
    setError(null);
    setPhase("loading");

    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          useCase,
          phase: "match",
          tier,
          filters: {
            industry: industry || undefined,
            deployment: deployment || undefined,
            capability: capability || undefined,
          },
        }),
      });
      const data = await res.json();

      if (data.error) { setError(data.error); setPhase("input"); return; }

      setAnalysis(data.analysis || "");
      setMatches(data.matches || []);
      setPhase("matches");
    } catch {
      setError("Something went wrong. Please try again.");
      setPhase("input");
    }
  }

  // ── Phase 3: Select systems → Compare ────────────────
  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < 5) next.add(id); // max 5 columns
      return next;
    });
  }

  async function handleCompare() {
    if (selectedIds.size < 1) return;
    setPhase("comparing");
    setError(null);

    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ systemIds: Array.from(selectedIds), phase: "compare" }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); setPhase("matches"); return; }
      setCompareData(data);
      setPhase("compare");
    } catch {
      setError("Something went wrong. Please try again.");
      setPhase("matches");
    }
  }

  function reset() {
    setPhase("input");
    setUseCase("");
    setIndustry("");
    setDeployment("");
    setCapability("");
    setAnalysis("");
    setMatches([]);
    setSelectedIds(new Set());
    setCompareData(null);
    setError(null);
    setCategoryFilter("All");
  }

  // ─── Render ──────────────────────────────────────────

  return (
    <div className="space-y-8">

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* ─── Phase 1: Input ────────────────────────────── */}
      {(phase === "input") && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <div className="max-w-2xl">
            <h2 className="text-xl font-bold text-gray-900 font-serif mb-2">
              Describe your use case
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Write in plain English. What problem are you solving? Who are the users? What data is involved? What decisions will the AI make or inform?
            </p>

            <form onSubmit={handleMatch} className="space-y-5">
              <textarea
                value={useCase}
                onChange={(e) => setUseCase(e.target.value)}
                placeholder="Example: We want to automate the first stage of candidate screening for our EU recruitment process. The AI would score CVs and rank candidates before our HR team reviews them. We receive about 500 applications per month across Germany, France, and the Netherlands."
                rows={5}
                className="w-full rounded-xl border border-gray-200 p-4 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#003399] resize-none"
                required
              />

              {/* Optional filters — simple dropdowns */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-[#003399]"
                >
                  {INDUSTRY_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>

                <select
                  value={deployment}
                  onChange={(e) => setDeployment(e.target.value)}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-[#003399]"
                >
                  {DEPLOYMENT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>

                <select
                  value={capability}
                  onChange={(e) => setCapability(e.target.value)}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-[#003399]"
                >
                  {CAPABILITY_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#003399] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0d1b3e] transition-colors"
                >
                  <span>✦</span>
                  Find matching AI systems
                </button>
                <p className="text-xs text-gray-400">AI will match your requirements against 60+ assessed systems</p>
              </div>
            </form>

            {/* Example prompts */}
            <div className="mt-8 border-t border-gray-100 pt-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Example use cases</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  "Customer service chatbot for a bank that can handle account queries and flag potential fraud",
                  "Medical imaging AI to assist radiologists in detecting anomalies in X-rays",
                  "HR performance management system that analyses employee productivity and suggests development paths",
                  "Credit scoring AI for consumer lending decisions at a fintech company",
                ].map((example) => (
                  <button
                    key={example}
                    onClick={() => setUseCase(example)}
                    className="text-left text-xs text-gray-500 hover:text-[#003399] p-2.5 rounded-lg border border-gray-100 hover:border-[#003399]/20 hover:bg-blue-50 transition-all"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Loading ─────────────────────────────────── */}
      {(phase === "loading" || phase === "comparing") && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#003399] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">
            {phase === "loading" ? "Analysing your use case against our database of 50+ AI systems…" : "Loading comparison data…"}
          </p>
        </div>
      )}

      {/* ─── Phase 2: Matches ─────────────────────────── */}
      {phase === "matches" && (
        <div className="space-y-6">
          {/* Analysis */}
          {analysis && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <p className="text-sm text-blue-800 leading-relaxed">
                <span className="font-semibold">✦ AI Analysis: </span>{analysis}
              </p>
            </div>
          )}

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 font-serif">
                {matches.length} matching AI systems
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Select up to 5 systems to compare side-by-side
              </p>
            </div>
            <div className="flex items-center gap-3">
              {selectedIds.size > 0 && (
                <button
                  onClick={handleCompare}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#003399] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0d1b3e] transition-colors"
                >
                  Compare {selectedIds.size} selected →
                </button>
              )}
              <button onClick={reset} className="text-sm text-gray-400 hover:text-gray-600 underline">
                Start over
              </button>
            </div>
          </div>

          {/* Match cards */}
          <div className="space-y-3">
            {matches.map((m) => (
              <div
                key={m.id}
                onClick={() => toggleSelect(m.id)}
                className={`bg-white rounded-xl border-2 cursor-pointer transition-all p-5 ${
                  selectedIds.has(m.id)
                    ? "border-[#003399] bg-blue-50/30 shadow-md"
                    : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <div className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center ${
                    selectedIds.has(m.id) ? "bg-[#003399] border-[#003399]" : "border-gray-300"
                  }`}>
                    {selectedIds.has(m.id) && <span className="text-white text-xs">✓</span>}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">{m.vendor}</span>
                      <span className="text-gray-400">—</span>
                      <span className="font-medium text-gray-700">{m.name}</span>
                      <RelevanceBadge score={m.relevanceScore} />
                      <RiskBadge risk={m.risk} />
                      <ScoreBadge score={m.overallScore} />
                    </div>

                    <p className="text-xs text-gray-500 mb-2">{m.type}</p>

                    {/* Match reason */}
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Why it matches</p>
                        <p className="text-sm text-gray-700">{m.reason}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Relevant capability</p>
                        <p className="text-sm text-gray-700">{m.useCaseMatch}</p>
                      </div>
                    </div>

                    {/* Risk note */}
                    {m.riskNote && (
                      <div className="mt-2 text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2 border border-amber-100">
                        ⚡ EU AI Act: {m.riskNote}
                      </div>
                    )}

                    {/* Framework scores */}
                    {m.scores.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {m.scores.map((s) => (
                          <span key={s.frameworkSlug} className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                            <ScoreBadge score={s.score} />
                            {s.framework}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* View link */}
                  <Link
                    href={`/${locale}/systems/${m.slug}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-shrink-0 text-xs text-[#003399] hover:underline mt-0.5"
                  >
                    View →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Compare CTA */}
          {selectedIds.size > 0 && (
            <div className="sticky bottom-4 bg-white rounded-2xl border-2 border-[#003399] shadow-xl p-4 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700">
                {selectedIds.size} system{selectedIds.size > 1 ? "s" : ""} selected
                <span className="text-gray-400 ml-2">(max 5)</span>
              </p>
              <button
                onClick={handleCompare}
                className="inline-flex items-center gap-2 rounded-xl bg-[#003399] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#0d1b3e] transition-colors"
              >
                Compare side-by-side →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Upgrade banner for free users */}
      {phase === "matches" && !hasFullAccess && (
        <div className="rounded-xl border border-[#003399]/20 bg-gradient-to-r from-[#003399]/5 to-[#ffc107]/5 p-5 text-center">
          <p className="text-sm font-medium text-[#0d1b3e]">
            Seeing limited results? Pro unlocks all 60+ AI systems.
          </p>
          <a
            href="/en/pricing"
            className="mt-2 inline-block rounded-lg bg-[#003399] px-5 py-2 text-xs font-semibold text-white hover:bg-[#002277]"
          >
            Upgrade to Pro — €19/month
          </a>
        </div>
      )}

      {/* ─── Phase 4: Compare Results ─────────────────── */}
      {phase === "compare" && compareData && (() => {
        // Compute podium ranking
        const ranked = compareData.systems
          .map((s) => ({
            ...s,
            numericScore: overallNumericScore(s),
          }))
          .sort((a, b) => b.numericScore - a.numericScore)
          .map((s, i) => ({ ...s, rank: i + 1 }));

        // Radar data
        const radarSystems = ranked.map((s, i) => ({
          vendor: s.vendor,
          scores: deriveRadarScores(s as unknown as CompareSystem),
          colorIdx: i,
        }));

        // Podium data (top 3)
        const podiumSystems = ranked.slice(0, 3).map((s) => ({
          name: s.name,
          vendor: s.vendor,
          score: s.numericScore,
          rank: s.rank,
        }));

        // Group attributes by category for collapsible sections
        const grouped: Record<string, CompareAttribute[]> = {};
        for (const attr of compareData.attributes) {
          if (!grouped[attr.category]) grouped[attr.category] = [];
          grouped[attr.category].push(attr);
        }

        return (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 font-serif">
                Side-by-side comparison
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {compareData.systems.length} systems · {compareData.attributes.length} assessment criteria
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              {hasFullAccess ? (
                <>
                  <button
                    onClick={() => {
                      const slugs = compareData.systems.map((s: CompareSystem) => s.slug).join(",");
                      window.open(`/api/export?compare=${slugs}&format=csv`, "_blank");
                    }}
                    className="rounded-xl bg-[#003399] px-4 py-2 text-sm font-medium text-white hover:bg-[#002277] transition-colors"
                  >
                    Export CSV
                  </button>
                  <button
                    onClick={() => {
                      const slugs = compareData.systems.map((s: CompareSystem) => s.slug).join(",");
                      window.open(`/api/export?compare=${slugs}&format=json`, "_blank");
                    }}
                    className="rounded-xl border border-[#003399] px-4 py-2 text-sm font-medium text-[#003399] hover:bg-[#003399]/5 transition-colors"
                  >
                    Export JSON
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowExportUpgrade(true)}
                  className="rounded-xl bg-[#003399] px-4 py-2 text-sm font-medium text-white hover:bg-[#002277] transition-colors"
                >
                  Export Report
                </button>
              )}
              <button
                onClick={() => setPhase("matches")}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-500 hover:bg-gray-50"
              >
                ← Back to matches
              </button>
              <button onClick={reset} className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-500 hover:bg-gray-50">
                New search
              </button>
            </div>
          </div>

          {/* Upgrade prompt for non-Pro users */}
          {showExportUpgrade && (
            <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 flex items-start gap-3">
              <span className="text-amber-500 text-lg mt-0.5">&#x1f512;</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Data exports are a Pro feature
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Upgrade to Pro to export comparison data as CSV or JSON for procurement workflows, RFPs, and internal reviews.
                </p>
                <div className="mt-3 flex gap-3">
                  <Link
                    href={`/${locale}/pricing`}
                    className="inline-flex items-center rounded-lg bg-[#003399] px-4 py-2 text-sm font-medium text-white hover:bg-[#002277] transition-colors"
                  >
                    View Pro Plans
                  </Link>
                  <button
                    onClick={() => setShowExportUpgrade(false)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Podium + Radar Chart ─────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Podium */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex items-center justify-center">
              <Podium systems={podiumSystems} />
            </div>

            {/* Right: Radar Chart */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex items-center justify-center">
              <RadarChart
                systems={radarSystems}
                onDimensionClick={scrollToSection}
              />
            </div>
          </div>

          {/* Procurement tools CTA */}
          <div className="flex flex-wrap gap-3 rounded-lg border border-blue-100 bg-blue-50/50 px-4 py-3">
            <span className="text-xs text-gray-500 self-center">Next steps:</span>
            <Link href={`/${locale}/rfp-engine`} className="text-xs font-medium text-[#003399] hover:underline">
              Answer RFP Questions →
            </Link>
            <Link href={`/${locale}/vendor-prep`} className="text-xs font-medium text-[#003399] hover:underline">
              Prepare for Vendor Meeting →
            </Link>
          </div>

          {/* Category filter */}
          {(() => {
            const categories = ["All", ...Array.from(new Set(compareData.attributes.map((a) => a.category)))];
            return (
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      categoryFilter === cat
                        ? "bg-[#003399] text-white"
                        : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            );
          })()}

          {/* ── Collapsible comparison sections ──────────── */}
          <div className="space-y-3">
            {Object.entries(grouped)
              .filter(([category]) => categoryFilter === "All" || category === categoryFilter)
              .map(([category, attrs]) => (
              <div key={category} ref={(el) => { sectionRefs.current[category] = el; }}>
                <CollapsibleSection
                  title={category}
                  id={`section-${category.replace(/\s+/g, "-").toLowerCase()}`}
                  isOpen={openSections.has(category)}
                  onToggle={() => toggleSection(category)}
                >
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-[#0d1b3e]">
                          <th className="sticky left-0 z-10 bg-[#0d1b3e] text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400 w-52 min-w-[200px]">
                            Attribute
                          </th>
                          {compareData.systems.map((s) => (
                            <th key={s.id} className="px-5 py-3 text-left min-w-[220px]">
                              <Link href={`/${locale}/systems/${s.slug}`} className="hover:underline">
                                <div className="text-white font-semibold text-sm">{s.vendor}</div>
                                <div className="text-blue-200 text-xs font-normal mt-0.5">{s.name}</div>
                              </Link>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {attrs.map((attr, rowIdx) => {
                          const isScore = attr.key.startsWith("score_") || attr.key === "overallScore";
                          return (
                            <tr
                              key={attr.key}
                              className={`border-b border-gray-100 ${rowIdx % 2 === 0 ? "bg-white" : "bg-gray-50/50"} hover:bg-blue-50/20 transition-colors`}
                            >
                              <td className="sticky left-0 z-10 bg-inherit px-5 py-3 text-xs font-semibold text-gray-600 border-r border-gray-100">
                                {attr.label}
                              </td>
                              {compareData.systems.map((s) => {
                                const val = s[attr.key] || "";
                                return (
                                  <td key={`${s.id}-${attr.key}`} className="px-5 py-3 align-top">
                                    {isScore ? (
                                      <ScoreBadge score={val || "N/A"} />
                                    ) : val ? (
                                      <p className="text-xs text-gray-700 leading-relaxed line-clamp-4 max-w-xs">
                                        {val}
                                      </p>
                                    ) : (
                                      <span className="text-gray-300 text-xs">—</span>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CollapsibleSection>
              </div>
            ))}
          </div>

          {/* Expand/collapse all toggle */}
          <div className="flex justify-center">
            <button
              onClick={() => {
                const allCategories = Object.keys(grouped);
                if (openSections.size === allCategories.length) {
                  setOpenSections(new Set());
                } else {
                  setOpenSections(new Set(allCategories));
                }
              }}
              className="text-xs text-[#003399] hover:underline font-medium"
            >
              {openSections.size === Object.keys(grouped).length ? "Collapse all sections" : "Expand all sections"}
            </button>
          </div>

          {/* View full profiles */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {compareData.systems.map((s) => (
              <Link
                key={s.id}
                href={`/${locale}/systems/${s.slug}`}
                className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 p-4 hover:border-[#003399] hover:shadow-sm transition-all"
              >
                <div className="flex-1">
                  <div className="font-semibold text-sm text-gray-900">{s.vendor}</div>
                  <div className="text-xs text-gray-500">{s.name}</div>
                </div>
                <span className="text-[#003399] text-xs font-medium">Full assessment →</span>
              </Link>
            ))}
          </div>
        </div>
        );
      })()}
    </div>
  );
}
