/**
 * Frameworks List Page — Shows all regulatory frameworks in a table.
 */

export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/db";
import { DeleteFrameworkButton } from "./DeleteButton";

export default async function FrameworksListPage() {
  const frameworks = await prisma.regulatoryFramework.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-text-primary">
          Regulatory Frameworks
        </h1>
        <Link
          href="/admin/frameworks/new"
          className="inline-flex items-center gap-2 rounded-lg bg-eu-blue px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-eu-blue-light"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Framework
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-border-light bg-white">
        {frameworks.length === 0 ? (
          <div className="p-12 text-center text-sm text-text-secondary">
            No frameworks yet. Click &quot;Add Framework&quot; to create one.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border-lighter bg-surface-alt text-xs uppercase tracking-wider text-text-muted">
              <tr>
                <th className="px-6 py-3">Framework</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Criteria</th>
                <th className="px-6 py-3">Effective</th>
                <th className="px-6 py-3">Published</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-lighter">
              {frameworks.map((fw) => (
                <tr key={fw.id} className="hover:bg-surface-alt/50">
                  <td className="px-6 py-4 font-medium text-text-primary">{fw.name}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                      fw.badgeType === "EU" ? "bg-[#003399]/10 text-[#003399]" :
                      fw.badgeType === "Sector" ? "bg-emerald-100 text-emerald-700" :
                      "bg-amber-100 text-amber-700"
                    }`}>
                      {fw.badgeType}
                    </span>
                  </td>
                  <td className="px-6 py-4">{fw.criteriaCount}</td>
                  <td className="px-6 py-4 text-text-muted">{fw.effectiveDate}</td>
                  <td className="px-6 py-4">
                    {fw.published ? <span className="text-score-green">Yes</span> : <span className="text-text-muted">Draft</span>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/frameworks/${fw.id}/edit`} className="rounded-lg px-3 py-1.5 text-xs font-medium text-eu-blue hover:bg-navy-50">
                        Edit
                      </Link>
                      <DeleteFrameworkButton id={fw.id} name={fw.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
