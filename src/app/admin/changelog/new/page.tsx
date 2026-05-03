/**
 * New ChangeLog Entry Page
 */

import Link from "next/link";
import { prisma } from "@/lib/db";
import { createChangeLog } from "../actions";
import { CHANGE_TYPES, TYPE_LABELS } from "../constants";

export default async function NewChangeLogPage() {
  const [frameworks, systems] = await Promise.all([
    prisma.regulatoryFramework.findMany({ orderBy: { name: "asc" } }),
    prisma.aISystem.findMany({ orderBy: [{ vendor: "asc" }, { name: "asc" }] }),
  ]);

  return (
    <>
      <h1 className="font-heading text-2xl font-bold text-text-primary">Log a Change</h1>
      <p className="mt-1 text-sm text-text-secondary">
        Record a change to a regulatory framework or AI system assessment. Every entry must cite a trusted source.
      </p>

      <form action={createChangeLog} className="mt-8 space-y-8">
        <fieldset className="rounded-xl border border-border-light bg-white p-6">
          <legend className="px-2 text-sm font-semibold text-text-primary">Change Details</legend>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-text-primary">Title</label>
              <input id="title" name="title" type="text" required placeholder="e.g. EU AI Act: Implementing act on high-risk classification published"
                className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue" />
            </div>
            <div>
              <label htmlFor="changeType" className="block text-sm font-medium text-text-primary">Change Type</label>
              <select id="changeType" name="changeType"
                className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue">
                {CHANGE_TYPES.map((t) => (
                  <option key={t} value={t}>{TYPE_LABELS[t] || t}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-text-primary">Date</label>
              <input id="date" name="date" type="date" defaultValue={new Date().toISOString().split("T")[0]}
                className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue" />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-text-primary">Description</label>
              <textarea id="description" name="description" rows={4} required
                placeholder="Describe what changed, why it matters, and what the impact is..."
                className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue" />
            </div>
          </div>
        </fieldset>

        <fieldset className="rounded-xl border border-border-light bg-white p-6">
          <legend className="px-2 text-sm font-semibold text-text-primary">Source Citation</legend>
          <p className="mb-4 text-xs text-text-secondary">
            Every change must reference a trusted source. This builds credibility and proves we are not making things up.
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="sourceUrl" className="block text-sm font-medium text-text-primary">Source URL</label>
              <input id="sourceUrl" name="sourceUrl" type="url" placeholder="https://eur-lex.europa.eu/..."
                className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue" />
            </div>
            <div>
              <label htmlFor="sourceLabel" className="block text-sm font-medium text-text-primary">Source Label</label>
              <input id="sourceLabel" name="sourceLabel" type="text" placeholder="e.g. EUR-Lex, Microsoft Blog, CJEU Ruling C-123/25"
                className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue" />
            </div>
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-text-primary">Author</label>
              <input id="author" name="author" type="text" defaultValue="VendorScope Editorial"
                className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue" />
            </div>
          </div>
        </fieldset>

        <fieldset className="rounded-xl border border-border-light bg-white p-6">
          <legend className="px-2 text-sm font-semibold text-text-primary">Link To</legend>
          <p className="mb-4 text-xs text-text-secondary">
            Link this change to a framework, an AI system, or both.
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="frameworkId" className="block text-sm font-medium text-text-primary">Regulatory Framework</label>
              <select id="frameworkId" name="frameworkId"
                className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue">
                <option value="">None</option>
                {frameworks.map((fw) => (
                  <option key={fw.id} value={fw.id}>{fw.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="systemId" className="block text-sm font-medium text-text-primary">AI System</label>
              <select id="systemId" name="systemId"
                className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue">
                <option value="">None</option>
                {systems.map((s) => (
                  <option key={s.id} value={s.id}>{s.vendor} — {s.name}</option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <div className="flex items-center gap-4">
          <button type="submit" className="rounded-lg bg-eu-blue px-6 py-3 text-sm font-semibold text-white transition hover:bg-eu-blue-light">Log Change</button>
          <Link href="/admin/changelog" className="text-sm text-text-secondary hover:text-text-primary">Cancel</Link>
        </div>
      </form>
    </>
  );
}
