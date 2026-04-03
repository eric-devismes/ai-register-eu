/**
 * New Policy Statement Page
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { createStatement } from "../../../actions";

interface PageProps { params: Promise<{ id: string; sectionId: string }> }

export default async function NewStatementPage({ params }: PageProps) {
  const { id, sectionId } = await params;

  const [framework, section] = await Promise.all([
    prisma.regulatoryFramework.findUnique({ where: { id } }),
    prisma.frameworkSection.findUnique({ where: { id: sectionId } }),
  ]);
  if (!framework || !section) notFound();

  const createWithIds = createStatement.bind(null, sectionId, id);

  return (
    <>
      <nav className="mb-4 text-sm text-text-muted">
        <Link href={`/admin/frameworks/${id}/sections`} className="hover:text-eu-blue">{framework.name}</Link>
        <span className="mx-2">/</span>
        <Link href={`/admin/frameworks/${id}/sections/${sectionId}/statements`} className="hover:text-eu-blue">{section.title}</Link>
        <span className="mx-2">/</span>
        <span>New Statement</span>
      </nav>

      <h1 className="font-heading text-2xl font-bold text-text-primary">Add Policy Statement</h1>

      <form action={createWithIds} className="mt-8 space-y-6">
        <fieldset className="rounded-xl border border-border-light bg-white p-6">
          <legend className="px-2 text-sm font-semibold text-text-primary">Statement Details</legend>
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="reference" className="block text-sm font-medium text-text-primary">Reference</label>
                <input id="reference" name="reference" type="text" placeholder="e.g. Article 9(1)"
                  className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue" />
                <p className="mt-1 text-xs text-text-muted">Article, recital, or section reference.</p>
              </div>
              <div>
                <label htmlFor="sortOrder" className="block text-sm font-medium text-text-primary">Sort Order</label>
                <input id="sortOrder" name="sortOrder" type="number" defaultValue={0}
                  className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue" />
              </div>
            </div>
            <div>
              <label htmlFor="statement" className="block text-sm font-medium text-text-primary">Policy Statement</label>
              <textarea id="statement" name="statement" rows={4} required
                placeholder="The actual requirement text from the regulation..."
                className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue" />
            </div>
            <div>
              <label htmlFor="commentary" className="block text-sm font-medium text-text-primary">Commentary</label>
              <textarea id="commentary" name="commentary" rows={4}
                placeholder="Plain-language explanation of what this means for organisations..."
                className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue" />
              <p className="mt-1 text-xs text-text-muted">Explain what this policy means in practice. This helps readers understand the impact.</p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="sourceUrl" className="block text-sm font-medium text-text-primary">Source URL</label>
                <input id="sourceUrl" name="sourceUrl" type="url" placeholder="https://eur-lex.europa.eu/..."
                  className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue" />
              </div>
              <div>
                <label htmlFor="sourceNote" className="block text-sm font-medium text-text-primary">Source Label</label>
                <input id="sourceNote" name="sourceNote" type="text" placeholder="e.g. EUR-Lex, Regulation 2024/1689"
                  className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue" />
              </div>
            </div>
          </div>
        </fieldset>
        <div className="flex items-center gap-4">
          <button type="submit" className="rounded-lg bg-eu-blue px-6 py-3 text-sm font-semibold text-white transition hover:bg-eu-blue-light">Create Statement</button>
          <Link href={`/admin/frameworks/${id}/sections/${sectionId}/statements`} className="text-sm text-text-secondary hover:text-text-primary">Cancel</Link>
        </div>
      </form>
    </>
  );
}
