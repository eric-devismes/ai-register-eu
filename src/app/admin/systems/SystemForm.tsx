"use client";

/**
 * SystemForm — Reusable form for creating and editing AI systems.
 *
 * Key features:
 *   - Industry checkboxes (from database, not hardcoded)
 *   - Dynamic compliance scores: one dropdown per published framework
 *   - Computed overall score displayed as read-only
 *
 * The frameworks and industries are passed as props from the server component parent.
 */

import { useState } from "react";
import { ALL_GRADES, gradeToNumber, numberToGrade, gradeColor } from "@/lib/scoring";

// Risk categories as defined by the EU AI Act
const RISK_LEVELS = ["High", "Limited", "Minimal"];

// Industry categories for the homepage filter pills
const CATEGORIES = [
  "Financial", "Healthcare", "Insurance", "Public Sector",
  "HR", "Telecommunications", "Manufacturing", "Energy",
];

// ─── Types ───────────────────────────────────────────────

interface Framework {
  id: string;
  name: string;
}

interface Industry {
  id: string;
  name: string;
}

interface ExistingScore {
  frameworkId: string;
  score: string;
}

interface SystemFormProps {
  frameworks: Framework[];
  industries: Industry[];
  system?: {
    id: string;
    vendor: string;
    name: string;
    type: string;
    risk: string;
    description: string;
    category: string;
    featured: boolean;
    industryIds: string[];
    scores: ExistingScore[];
    // Extended profile fields
    vendorHq?: string;
    euPresence?: string;
    useCases?: string;
    dataStorage?: string;
    dataProcessing?: string;
    trainingDataUse?: string;
    subprocessors?: string;
    dpaDetails?: string;
    slaDetails?: string;
    dataPortability?: string;
    exitTerms?: string;
    ipTerms?: string;
    certifications?: string;
    encryptionInfo?: string;
    accessControls?: string;
    modelDocs?: string;
    explainability?: string;
    biasTesting?: string;
    aiActStatus?: string;
    gdprStatus?: string;
    euResidency?: string;
    assessmentNote?: string;
  };
  action: (formData: FormData) => Promise<void>;
}

// ─── Component ───────────────────────────────────────────

export default function SystemForm({ frameworks, industries, system, action }: SystemFormProps) {
  // Track scores in state so we can compute the overall score live
  const initialScores: Record<string, string> = {};
  for (const fw of frameworks) {
    const existing = system?.scores.find((s) => s.frameworkId === fw.id);
    initialScores[fw.id] = existing?.score || "";
  }
  const [scores, setScores] = useState(initialScores);

  // Compute overall score from current selections
  const activeGrades = Object.values(scores).filter((s) => s !== "");
  const overallNumber = activeGrades.length > 0
    ? activeGrades.reduce((sum, g) => sum + gradeToNumber(g), 0) / activeGrades.length
    : 0;
  const overallGrade = activeGrades.length > 0 ? numberToGrade(overallNumber) : "N/A";

  return (
    <form action={action} className="space-y-8">
      {/* ── Basic Information ── */}
      <fieldset className="rounded-xl border border-border-light bg-white p-6">
        <legend className="px-2 text-sm font-semibold text-text-primary">
          Basic Information
        </legend>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Vendor */}
          <div>
            <label htmlFor="vendor" className="block text-sm font-medium text-text-primary">Vendor</label>
            <input id="vendor" name="vendor" type="text" required
              defaultValue={system?.vendor} placeholder="e.g. Microsoft"
              className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue" />
          </div>

          {/* System Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text-primary">System Name</label>
            <input id="name" name="name" type="text" required
              defaultValue={system?.name} placeholder="e.g. Azure OpenAI Service"
              className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue" />
          </div>

          {/* Type */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-text-primary">Type</label>
            <input id="type" name="type" type="text" required
              defaultValue={system?.type} placeholder="e.g. Foundation Model Platform"
              className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue" />
          </div>

          {/* Risk Level */}
          <div>
            <label htmlFor="risk" className="block text-sm font-medium text-text-primary">Risk Level</label>
            <select id="risk" name="risk" defaultValue={system?.risk || "High"}
              className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue">
              {RISK_LEVELS.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          {/* Category (for homepage filtering) */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-text-primary">Category</label>
            <select id="category" name="category" defaultValue={system?.category || "Financial"}
              className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue">
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Featured toggle */}
          <div className="flex items-center gap-3 pt-6">
            <input id="featured" name="featured" type="checkbox"
              defaultChecked={system?.featured ?? false}
              className="h-4 w-4 rounded border-border text-eu-blue focus:ring-eu-blue" />
            <label htmlFor="featured" className="text-sm text-text-primary">Featured on homepage</label>
          </div>
        </div>

        {/* Description */}
        <div className="mt-6">
          <label htmlFor="description" className="block text-sm font-medium text-text-primary">Description</label>
          <textarea id="description" name="description" rows={3} required
            defaultValue={system?.description}
            placeholder="Brief description of what this AI system does..."
            className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue" />
        </div>
      </fieldset>

      {/* ── Industries (checkboxes from DB) ── */}
      <fieldset className="rounded-xl border border-border-light bg-white p-6">
        <legend className="px-2 text-sm font-semibold text-text-primary">
          Industries
        </legend>
        <p className="mb-4 text-xs text-text-secondary">
          Select which industries this system applies to.
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {industries.map((ind) => (
            <label key={ind.id} className="flex items-center gap-2 rounded-lg border border-border-lighter px-3 py-2 text-sm hover:bg-surface-alt">
              <input
                type="checkbox" name="industryIds" value={ind.id}
                defaultChecked={system?.industryIds.includes(ind.id)}
                className="h-4 w-4 rounded border-border text-eu-blue focus:ring-eu-blue"
              />
              {ind.name}
            </label>
          ))}
        </div>
      </fieldset>

      {/* ── Compliance Scores (one per framework from DB) ── */}
      <fieldset className="rounded-xl border border-border-light bg-white p-6">
        <legend className="px-2 text-sm font-semibold text-text-primary">
          Compliance Scores
        </legend>
        <p className="mb-4 text-xs text-text-secondary">
          Assign a letter grade for each regulatory framework. Leave blank if not assessed.
        </p>

        {/* Overall score badge (computed, read-only) */}
        <div className="mb-6 flex items-center gap-4 rounded-lg bg-surface-alt p-4">
          <span className={`inline-flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white ${gradeColor(overallGrade)}`}>
            {overallGrade}
          </span>
          <div>
            <p className="text-sm font-semibold text-text-primary">Overall Score</p>
            <p className="text-xs text-text-muted">
              Computed average of all framework scores ({activeGrades.length} rated)
            </p>
          </div>
        </div>

        {/* One dropdown per framework */}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
          {frameworks.map((fw) => (
            <div key={fw.id}>
              <label htmlFor={`score_${fw.id}`} className="block text-sm font-medium text-text-primary">
                {fw.name}
              </label>
              <select
                id={`score_${fw.id}`}
                name={`score_${fw.id}`}
                value={scores[fw.id] || ""}
                onChange={(e) => setScores({ ...scores, [fw.id]: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue"
              >
                <option value="">Not rated</option>
                {ALL_GRADES.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </fieldset>

      {/* ── Dimension Scoring (link for existing systems) ── */}
      {system && (
        <div className="rounded-xl border-2 border-dashed border-eu-blue/20 bg-eu-blue/5 p-6 text-center">
          <p className="text-sm text-text-secondary mb-3">
            Score this system per framework dimension to generate spider charts and detailed cross-reports.
          </p>
          <a
            href={`/admin/systems/${system.id}/scores`}
            className="inline-flex items-center gap-2 rounded-lg bg-eu-blue px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-eu-blue-light"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5" />
            </svg>
            Manage Dimension Scores &amp; Spider Charts
          </a>
        </div>
      )}

      {/* ── Vendor Profile ── */}
      <fieldset className="rounded-xl border border-border-light bg-white p-6">
        <legend className="px-2 text-sm font-semibold text-text-primary">Vendor Profile</legend>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="vendorHq" className="block text-sm font-medium text-text-primary">Vendor HQ</label>
            <input id="vendorHq" name="vendorHq" type="text" defaultValue={system?.vendorHq} placeholder="e.g. Redmond, USA"
              className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue" />
          </div>
          <div>
            <label htmlFor="euPresence" className="block text-sm font-medium text-text-primary">EU Presence</label>
            <input id="euPresence" name="euPresence" type="text" defaultValue={system?.euPresence} placeholder="e.g. Yes — subsidiaries in EU"
              className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="useCases" className="block text-sm font-medium text-text-primary">Key Use Cases (one per line)</label>
            <textarea id="useCases" name="useCases" rows={3} defaultValue={system?.useCases} placeholder="Document drafting&#10;Customer service automation&#10;Code generation"
              className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue" />
          </div>
        </div>
      </fieldset>

      {/* ── Data Handling ── */}
      <fieldset className="rounded-xl border border-border-light bg-white p-6">
        <legend className="px-2 text-sm font-semibold text-text-primary">Data Handling</legend>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div><label htmlFor="dataStorage" className="block text-sm font-medium text-text-primary">Data Storage Locations</label>
            <textarea id="dataStorage" name="dataStorage" rows={2} defaultValue={system?.dataStorage} className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue" /></div>
          <div><label htmlFor="dataProcessing" className="block text-sm font-medium text-text-primary">Processing Locations</label>
            <textarea id="dataProcessing" name="dataProcessing" rows={2} defaultValue={system?.dataProcessing} className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue" /></div>
          <div><label htmlFor="trainingDataUse" className="block text-sm font-medium text-text-primary">Training Data Usage</label>
            <textarea id="trainingDataUse" name="trainingDataUse" rows={2} defaultValue={system?.trainingDataUse} className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue" /></div>
          <div><label htmlFor="subprocessors" className="block text-sm font-medium text-text-primary">Subprocessors</label>
            <textarea id="subprocessors" name="subprocessors" rows={2} defaultValue={system?.subprocessors} className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue" /></div>
        </div>
      </fieldset>

      {/* ── Contractual ── */}
      <fieldset className="rounded-xl border border-border-light bg-white p-6">
        <legend className="px-2 text-sm font-semibold text-text-primary">Contractual Commitments</legend>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div><label htmlFor="dpaDetails" className="block text-sm font-medium text-text-primary">DPA Details</label>
            <textarea id="dpaDetails" name="dpaDetails" rows={2} defaultValue={system?.dpaDetails} className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue" /></div>
          <div><label htmlFor="slaDetails" className="block text-sm font-medium text-text-primary">SLA Details</label>
            <textarea id="slaDetails" name="slaDetails" rows={2} defaultValue={system?.slaDetails} className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue" /></div>
          <div><label htmlFor="dataPortability" className="block text-sm font-medium text-text-primary">Data Portability</label>
            <textarea id="dataPortability" name="dataPortability" rows={2} defaultValue={system?.dataPortability} className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue" /></div>
          <div><label htmlFor="exitTerms" className="block text-sm font-medium text-text-primary">Exit Terms</label>
            <textarea id="exitTerms" name="exitTerms" rows={2} defaultValue={system?.exitTerms} className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue" /></div>
          <div className="sm:col-span-2"><label htmlFor="ipTerms" className="block text-sm font-medium text-text-primary">IP Terms</label>
            <input id="ipTerms" name="ipTerms" type="text" defaultValue={system?.ipTerms} className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue" /></div>
        </div>
      </fieldset>

      {/* ── Security ── */}
      <fieldset className="rounded-xl border border-border-light bg-white p-6">
        <legend className="px-2 text-sm font-semibold text-text-primary">Security Posture</legend>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2"><label htmlFor="certifications" className="block text-sm font-medium text-text-primary">Certifications</label>
            <input id="certifications" name="certifications" type="text" defaultValue={system?.certifications} placeholder="ISO 27001, SOC 2 Type II, C5..."
              className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue" /></div>
          <div><label htmlFor="encryptionInfo" className="block text-sm font-medium text-text-primary">Encryption</label>
            <textarea id="encryptionInfo" name="encryptionInfo" rows={2} defaultValue={system?.encryptionInfo} className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue" /></div>
          <div><label htmlFor="accessControls" className="block text-sm font-medium text-text-primary">Access Controls</label>
            <textarea id="accessControls" name="accessControls" rows={2} defaultValue={system?.accessControls} className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue" /></div>
        </div>
      </fieldset>

      {/* ── AI Transparency ── */}
      <fieldset className="rounded-xl border border-border-light bg-white p-6">
        <legend className="px-2 text-sm font-semibold text-text-primary">AI Transparency</legend>
        <div className="grid grid-cols-1 gap-6">
          <div><label htmlFor="modelDocs" className="block text-sm font-medium text-text-primary">Model Documentation</label>
            <textarea id="modelDocs" name="modelDocs" rows={2} defaultValue={system?.modelDocs} className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue" /></div>
          <div><label htmlFor="explainability" className="block text-sm font-medium text-text-primary">Explainability</label>
            <textarea id="explainability" name="explainability" rows={2} defaultValue={system?.explainability} className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue" /></div>
          <div><label htmlFor="biasTesting" className="block text-sm font-medium text-text-primary">Bias Testing</label>
            <textarea id="biasTesting" name="biasTesting" rows={2} defaultValue={system?.biasTesting} className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue" /></div>
        </div>
      </fieldset>

      {/* ── EU Compliance Status ── */}
      <fieldset className="rounded-xl border border-border-light bg-white p-6">
        <legend className="px-2 text-sm font-semibold text-text-primary">EU Compliance Status</legend>
        <div className="grid grid-cols-1 gap-6">
          <div><label htmlFor="aiActStatus" className="block text-sm font-medium text-text-primary">AI Act Status</label>
            <textarea id="aiActStatus" name="aiActStatus" rows={2} defaultValue={system?.aiActStatus} className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue" /></div>
          <div><label htmlFor="gdprStatus" className="block text-sm font-medium text-text-primary">GDPR Status</label>
            <textarea id="gdprStatus" name="gdprStatus" rows={2} defaultValue={system?.gdprStatus} className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue" /></div>
          <div><label htmlFor="euResidency" className="block text-sm font-medium text-text-primary">EU Data Residency</label>
            <textarea id="euResidency" name="euResidency" rows={2} defaultValue={system?.euResidency} className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue" /></div>
        </div>
      </fieldset>

      {/* ── Internal Notes ── */}
      <fieldset className="rounded-xl border border-border-light bg-white p-6">
        <legend className="px-2 text-sm font-semibold text-text-primary">Internal Notes</legend>
        <textarea id="assessmentNote" name="assessmentNote" rows={3} defaultValue={system?.assessmentNote}
          placeholder="Internal assessor notes (not shown publicly)..."
          className="block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue" />
      </fieldset>

      {/* ── Submit ── */}
      <div className="flex items-center gap-4">
        <button type="submit"
          className="rounded-lg bg-eu-blue px-6 py-3 text-sm font-semibold text-white transition hover:bg-eu-blue-light">
          {system ? "Save Changes" : "Create System"}
        </button>
        <a href="/admin/systems" className="text-sm text-text-secondary hover:text-text-primary">Cancel</a>
      </div>
    </form>
  );
}
