"use client";

/**
 * RoleDrillDown — Role-based drill-down views for AI system detail pages.
 *
 * Shows 4 role tabs (CISO, DPO, Architect, Procurement) that filter and
 * reorganise enriched system fields into what each role cares about most.
 * Designed for enterprise decision-makers evaluating AI systems against
 * EU regulatory requirements.
 */

import { useState } from "react";
import { useT } from "@/lib/locale-context";
import type { ClaimRow } from "@/types/claims";
import { FIELD_TO_CLAIM_PREFIX } from "@/types/claims";
import { ClaimChip, VerifiedBadge } from "@/components/evidence/ClaimEvidence";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface RoleDrillDownProps {
  claims?: ClaimRow[];
  system: {
    certifications?: string | null;
    encryptionInfo?: string | null;
    accessControls?: string | null;
    subprocessors?: string | null;
    slaDetails?: string | null;
    deploymentModel?: string | null;
    sourceModel?: string | null;
    dataStorage?: string | null;
    euResidency?: string | null;
    dataProcessing?: string | null;
    trainingDataUse?: string | null;
    dpaDetails?: string | null;
    dataPortability?: string | null;
    gdprStatus?: string | null;
    biasTesting?: string | null;
    useCases?: string | null;
    modelDocs?: string | null;
    explainability?: string | null;
    exitTerms?: string | null;
    ipTerms?: string | null;
    vendorHq?: string | null;
    euPresence?: string | null;
    employeeCount?: string | null;
    fundingStatus?: string | null;
    marketPresence?: string | null;
    notableCustomers?: string | null;
    customerStories?: string | null;
    customerCount?: string | null;
    aiActStatus?: string | null;
  };
  scores: Array<{ framework: { name: string }; score: string }>;
}

type RoleKey = "ciso" | "dpo" | "architect" | "procurement";

interface FieldDef {
  label: string;
  key: keyof RoleDrillDownProps["system"];
}

interface RoleConfig {
  key: RoleKey;
  label: string;
  title: string;
  icon: React.ReactNode;
  sections: { heading: string; fields: FieldDef[] }[];
  showScores: boolean;
  /** If provided, only show scores whose framework name matches one of these (case-insensitive substring). */
  scoreFilter?: string[];
}

/* ------------------------------------------------------------------ */
/*  Icons (inline SVG to avoid extra deps)                             */
/* ------------------------------------------------------------------ */

const ShieldIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
  </svg>
);

const LockIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
  </svg>
);

const CpuIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5M4.5 15.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h9v9h-9v-9Z" />
  </svg>
);

const BriefcaseIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Score colour helper                                                */
/* ------------------------------------------------------------------ */

function scoreColor(score: string): string {
  const n = parseFloat(score);
  if (Number.isNaN(n)) return "bg-gray-100 text-gray-600";
  if (n >= 8) return "bg-emerald-100 text-emerald-700";
  if (n >= 6) return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function FieldCard({ label, value, notAssessedLabel, fieldClaims }: {
  label: string;
  value: string | null | undefined;
  notAssessedLabel: string;
  fieldClaims?: ClaimRow[];
}) {
  const hasValue = value != null && value.trim() !== "";
  const hasChips = fieldClaims && fieldClaims.length > 0;
  const verifiedAt = hasChips
    ? fieldClaims.reduce<string | null>((latest, c) => {
        if (!c.verifiedAt) return latest;
        return !latest || c.verifiedAt > latest ? c.verifiedAt : latest;
      }, null)
    : null;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-center gap-2">
        <dt className="text-xs font-semibold uppercase tracking-wide text-[#003399]">{label}</dt>
        {verifiedAt && <VerifiedBadge dateStr={verifiedAt} />}
      </div>
      <dd className={`mt-1.5 text-sm leading-relaxed ${hasValue || hasChips ? "text-gray-800" : "italic text-gray-400"}`}>
        {hasChips ? (
          <span>
            {fieldClaims.map((c, i) => (
              <span key={c.id} className="inline">
                {i > 0 && <span className="text-gray-300 mx-1.5 select-none">·</span>}
                <ClaimChip claim={c} />
              </span>
            ))}
          </span>
        ) : hasValue ? value : notAssessedLabel}
      </dd>
    </div>
  );
}

function ScoreBadge({ name, score }: { name: string; score: string }) {
  return (
    <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${scoreColor(score)}`}>
      <span>{name}</span>
      <span className="font-bold">{score}/10</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function RoleDrillDown({ system, scores, claims = [] }: RoleDrillDownProps) {
  const [active, setActive] = useState<RoleKey>("ciso");
  const t = useT();

  // Build prefix → all non-stale claims
  const prefixToClaims = new Map<string, ClaimRow[]>();
  for (const c of claims) {
    if (c.stale) continue;
    const prefix = c.field.split(".")[0];
    if (!prefixToClaims.has(prefix)) prefixToClaims.set(prefix, []);
    prefixToClaims.get(prefix)!.push(c);
  }
  const claimsFor = (key: string): ClaimRow[] => {
    const prefix = FIELD_TO_CLAIM_PREFIX[key];
    return prefix ? (prefixToClaims.get(prefix) ?? []) : [];
  };

  const ROLES: RoleConfig[] = [
    {
      key: "ciso",
      label: t("systemRoles.cisoLabel"),
      title: t("systemRoles.cisoTitle"),
      icon: <ShieldIcon />,
      showScores: true,
      scoreFilter: ["AI Act", "NIS2", "DORA"],
      sections: [
        {
          heading: t("systemRoles.securityPosture"),
          fields: [
            { label: t("systemRoles.securityCertifications"), key: "certifications" },
            { label: t("systemRoles.encryption"), key: "encryptionInfo" },
            { label: t("systemRoles.accessControls"), key: "accessControls" },
          ],
        },
        {
          heading: t("systemRoles.supplyChainResilience"),
          fields: [
            { label: t("systemRoles.subProcessors"), key: "subprocessors" },
            { label: t("systemRoles.slaIncidentResponse"), key: "slaDetails" },
            { label: t("systemRoles.deploymentModel"), key: "deploymentModel" },
          ],
        },
      ],
    },
    {
      key: "dpo",
      label: t("systemRoles.dpoLabel"),
      title: t("systemRoles.dpoTitle"),
      icon: <LockIcon />,
      showScores: false,
      sections: [
        {
          heading: t("systemRoles.dataResidencyProcessing"),
          fields: [
            { label: t("systemRoles.dataStorageLocation"), key: "dataStorage" },
            { label: t("systemRoles.euDataResidency"), key: "euResidency" },
            { label: t("systemRoles.dataProcessingDetails"), key: "dataProcessing" },
            { label: t("systemRoles.trainingDataUse"), key: "trainingDataUse" },
          ],
        },
        {
          heading: t("systemRoles.legalCompliance"),
          fields: [
            { label: t("systemRoles.gdprStatus"), key: "gdprStatus" },
            { label: t("systemRoles.dpaDetails"), key: "dpaDetails" },
            { label: t("systemRoles.subProcessors"), key: "subprocessors" },
          ],
        },
        {
          heading: t("systemRoles.dataRightsFairness"),
          fields: [
            { label: t("systemRoles.dataPortability"), key: "dataPortability" },
            { label: t("systemRoles.biasTesting"), key: "biasTesting" },
          ],
        },
      ],
    },
    {
      key: "architect",
      label: t("systemRoles.architectLabel"),
      title: t("systemRoles.architectTitle"),
      icon: <CpuIcon />,
      showScores: false,
      sections: [
        {
          heading: t("systemRoles.architectureDeployment"),
          fields: [
            { label: t("systemRoles.deploymentModel"), key: "deploymentModel" },
            { label: t("systemRoles.sourceModel"), key: "sourceModel" },
            { label: t("systemRoles.useCases"), key: "useCases" },
          ],
        },
        {
          heading: t("systemRoles.transparencyDocumentation"),
          fields: [
            { label: t("systemRoles.modelDocumentation"), key: "modelDocs" },
            { label: t("systemRoles.explainability"), key: "explainability" },
          ],
        },
        {
          heading: t("systemRoles.portabilityExit"),
          fields: [
            { label: t("systemRoles.dataPortability"), key: "dataPortability" },
            { label: t("systemRoles.exitTerms"), key: "exitTerms" },
            { label: t("systemRoles.slaDetails"), key: "slaDetails" },
          ],
        },
      ],
    },
    {
      key: "procurement",
      label: t("systemRoles.procurementLabel"),
      title: t("systemRoles.procurementTitle"),
      icon: <BriefcaseIcon />,
      showScores: true,
      sections: [
        {
          heading: t("systemRoles.vendorProfile"),
          fields: [
            { label: t("systemRoles.vendorHQ"), key: "vendorHq" },
            { label: t("systemRoles.euPresence"), key: "euPresence" },
            { label: t("systemRoles.employeeCount"), key: "employeeCount" },
            { label: t("systemRoles.fundingStatus"), key: "fundingStatus" },
            { label: t("systemRoles.marketPresence"), key: "marketPresence" },
          ],
        },
        {
          heading: t("systemRoles.customerEvidence"),
          fields: [
            { label: t("systemRoles.notableCustomers"), key: "notableCustomers" },
            { label: t("systemRoles.customerStories"), key: "customerStories" },
            { label: t("systemRoles.customerCount"), key: "customerCount" },
          ],
        },
        {
          heading: t("systemRoles.contractLegal"),
          fields: [
            { label: t("systemRoles.exitTerms"), key: "exitTerms" },
            { label: t("systemRoles.ipTerms"), key: "ipTerms" },
            { label: t("systemRoles.slaDetails"), key: "slaDetails" },
            { label: t("systemRoles.dpaDetails"), key: "dpaDetails" },
          ],
        },
      ],
    },
  ];

  const role = ROLES.find((r) => r.key === active)!;

  const filteredScores = role.showScores
    ? role.scoreFilter
      ? scores.filter((s) =>
          role.scoreFilter!.some((f) => s.framework.name.toLowerCase().includes(f.toLowerCase()))
        )
      : scores
    : [];

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* ---- Tab bar ---- */}
      <div className="border-b border-gray-200 bg-[#0d1b3e]">
        <nav className="flex" aria-label="Role views">
          {ROLES.map((r) => {
            const isActive = r.key === active;
            return (
              <button
                key={r.key}
                type="button"
                onClick={() => setActive(r.key)}
                className={`
                  relative flex items-center gap-2 px-5 py-3.5 text-sm font-semibold transition-colors
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffc107] focus-visible:ring-inset
                  ${isActive
                    ? "text-white"
                    : "text-gray-400 hover:text-gray-200"
                  }
                `}
                aria-selected={isActive}
                role="tab"
              >
                {r.icon}
                <span>{r.label}</span>
                {/* Gold underline for active tab */}
                {isActive && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#ffc107]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ---- Content ---- */}
      <div className="p-6">
        {/* Role header */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-[#0d1b3e]">{role.title}</h3>
          <p className="mt-1 text-sm text-gray-500">
            {t("systemRoles.keyDataPoints").replace("{role}", role.label)}
          </p>
        </div>

        {/* Compliance scores (when applicable) */}
        {filteredScores.length > 0 && (
          <div className="mb-6">
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
              {t("systemRoles.complianceScores")}
            </h4>
            <div className="flex flex-wrap gap-2">
              {filteredScores.map((s) => (
                <ScoreBadge key={s.framework.name} name={s.framework.name} score={s.score} />
              ))}
            </div>
          </div>
        )}

        {/* Field sections */}
        <div className="space-y-6">
          {role.sections.map((section) => (
            <div key={section.heading}>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                {section.heading}
              </h4>
              <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {section.fields.map((f) => (
                  <FieldCard key={f.key} label={f.label} value={system[f.key]} notAssessedLabel={t("systemRoles.notAssessed")} fieldClaims={claimsFor(f.key)} />
                ))}
              </dl>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
