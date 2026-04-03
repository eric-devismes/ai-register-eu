"use client";

/**
 * FrameworkForm — Reusable form for creating and editing regulatory frameworks.
 *
 * Includes:
 *   - Basic info (name, badge type, criteria, dates)
 *   - Meta info (issuing authority, enforcement type, penalties, regions, purpose)
 *   - Applicable industries (checkbox grid from DB)
 *   - Overview content (Markdown)
 *   - Link to manage sections & policies (for existing frameworks)
 */

const BADGE_TYPES = ["EU", "Sector", "National"];

const ENFORCEMENT_TYPES = [
  "Legal — Binding with penalties",
  "Legal — Binding without penalties",
  "Guideline — Non-binding recommendation",
  "Standard — Voluntary certification",
];

interface Industry {
  id: string;
  name: string;
}

interface FrameworkFormProps {
  industries: Industry[];
  framework?: {
    id: string;
    name: string;
    description: string;
    content: string;
    badgeType: string;
    criteriaCount: number;
    effectiveDate: string;
    published: boolean;
    issuingAuthority: string;
    enforcementType: string;
    maxPenalty: string;
    applicableRegions: string;
    purpose: string;
    officialUrl: string;
    industryIds: string[];
  };
  action: (formData: FormData) => Promise<void>;
}

export default function FrameworkForm({ industries, framework, action }: FrameworkFormProps) {
  return (
    <form action={action} className="space-y-8">
      {/* ── Basic Information ── */}
      <fieldset className="rounded-xl border border-border-light bg-white p-6">
        <legend className="px-2 text-sm font-semibold text-text-primary">
          Framework Details
        </legend>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text-primary">Name</label>
            <input id="name" name="name" type="text" required defaultValue={framework?.name} placeholder="e.g. EU AI Act"
              className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue" />
          </div>
          <div>
            <label htmlFor="badgeType" className="block text-sm font-medium text-text-primary">Badge Type</label>
            <select id="badgeType" name="badgeType" defaultValue={framework?.badgeType || "EU"}
              className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue">
              {BADGE_TYPES.map((type) => (<option key={type} value={type}>{type}</option>))}
            </select>
          </div>
          <div>
            <label htmlFor="criteriaCount" className="block text-sm font-medium text-text-primary">Criteria Count</label>
            <input id="criteriaCount" name="criteriaCount" type="number" min="0" defaultValue={framework?.criteriaCount ?? 0}
              className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue" />
          </div>
          <div>
            <label htmlFor="effectiveDate" className="block text-sm font-medium text-text-primary">Effective Date</label>
            <input id="effectiveDate" name="effectiveDate" type="text" defaultValue={framework?.effectiveDate} placeholder="e.g. Aug 2025"
              className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue" />
          </div>
          <div className="flex items-center gap-3 pt-6">
            <input id="published" name="published" type="checkbox" defaultChecked={framework?.published ?? true}
              className="h-4 w-4 rounded border-border text-eu-blue focus:ring-eu-blue" />
            <label htmlFor="published" className="text-sm text-text-primary">Published (visible on website)</label>
          </div>
        </div>
        <div className="mt-6">
          <label htmlFor="description" className="block text-sm font-medium text-text-primary">Description</label>
          <textarea id="description" name="description" rows={2} required defaultValue={framework?.description}
            placeholder="Short summary shown on homepage cards..."
            className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue" />
        </div>
      </fieldset>

      {/* ── Regulatory Meta Information ── */}
      <fieldset className="rounded-xl border border-border-light bg-white p-6">
        <legend className="px-2 text-sm font-semibold text-text-primary">
          Regulatory Information
        </legend>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="issuingAuthority" className="block text-sm font-medium text-text-primary">Issuing Authority</label>
            <input id="issuingAuthority" name="issuingAuthority" type="text" defaultValue={framework?.issuingAuthority}
              placeholder="e.g. European Parliament & Council"
              className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue" />
          </div>
          <div>
            <label htmlFor="enforcementType" className="block text-sm font-medium text-text-primary">Enforcement Type</label>
            <select id="enforcementType" name="enforcementType" defaultValue={framework?.enforcementType || ENFORCEMENT_TYPES[0]}
              className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue">
              {ENFORCEMENT_TYPES.map((t) => (<option key={t} value={t}>{t}</option>))}
            </select>
          </div>
          <div>
            <label htmlFor="maxPenalty" className="block text-sm font-medium text-text-primary">Maximum Penalty</label>
            <input id="maxPenalty" name="maxPenalty" type="text" defaultValue={framework?.maxPenalty}
              placeholder="e.g. Up to €35M or 7% of global turnover"
              className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue" />
          </div>
          <div>
            <label htmlFor="applicableRegions" className="block text-sm font-medium text-text-primary">Applicable Regions</label>
            <input id="applicableRegions" name="applicableRegions" type="text" defaultValue={framework?.applicableRegions}
              placeholder="e.g. All EU/EEA member states"
              className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="officialUrl" className="block text-sm font-medium text-text-primary">Official Regulation URL</label>
            <input id="officialUrl" name="officialUrl" type="url" defaultValue={framework?.officialUrl}
              placeholder="https://eur-lex.europa.eu/..."
              className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="purpose" className="block text-sm font-medium text-text-primary">Overall Purpose</label>
            <textarea id="purpose" name="purpose" rows={3} defaultValue={framework?.purpose}
              placeholder="Describe the overall purpose and intent of this regulation..."
              className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue" />
          </div>
        </div>
      </fieldset>

      {/* ── Applicable Industries ── */}
      <fieldset className="rounded-xl border border-border-light bg-white p-6">
        <legend className="px-2 text-sm font-semibold text-text-primary">
          Applicable Industries
        </legend>
        <p className="mb-4 text-xs text-text-secondary">
          Select which industries this regulation applies to. Leave unchecked for regulations that apply to all industries.
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {industries.map((ind) => (
            <label key={ind.id} className="flex items-center gap-2 rounded-lg border border-border-lighter px-3 py-2 text-sm hover:bg-surface-alt">
              <input type="checkbox" name="industryIds" value={ind.id}
                defaultChecked={framework?.industryIds.includes(ind.id)}
                className="h-4 w-4 rounded border-border text-eu-blue focus:ring-eu-blue" />
              {ind.name}
            </label>
          ))}
        </div>
      </fieldset>

      {/* ── Overview Content ── */}
      <fieldset className="rounded-xl border border-border-light bg-white p-6">
        <legend className="px-2 text-sm font-semibold text-text-primary">
          Overview Content (Markdown)
        </legend>
        <p className="mb-3 text-xs text-text-secondary">
          General introduction/overview. Detailed policies should be added as Sections &amp; Policy Statements below.
        </p>
        <textarea id="content" name="content" rows={10} defaultValue={framework?.content}
          placeholder="# Overview&#10;&#10;Brief introduction to this regulation..."
          className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 font-mono text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue" />
      </fieldset>

      {/* ── Manage Sections (only for existing frameworks) ── */}
      {framework && (
        <div className="rounded-xl border-2 border-dashed border-eu-blue/20 bg-eu-blue/5 p-6 text-center">
          <p className="text-sm text-text-secondary mb-3">
            Add structured sections and policy statements to document this regulation in detail.
          </p>
          <a
            href={`/admin/frameworks/${framework.id}/sections`}
            className="inline-flex items-center gap-2 rounded-lg bg-eu-blue px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-eu-blue-light"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
            </svg>
            Manage Sections &amp; Policies
          </a>
        </div>
      )}

      {/* ── Submit ── */}
      <div className="flex items-center gap-4">
        <button type="submit"
          className="rounded-lg bg-eu-blue px-6 py-3 text-sm font-semibold text-white transition hover:bg-eu-blue-light">
          {framework ? "Save Changes" : "Create Framework"}
        </button>
        <a href="/admin/frameworks" className="text-sm text-text-secondary hover:text-text-primary">Cancel</a>
      </div>
    </form>
  );
}
