export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/db";
import { DeleteIndustryButton } from "./DeleteButton";

export default async function IndustriesListPage() {
  const industries = await prisma.industry.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { systems: true } } },
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-text-primary">Industries</h1>
        <Link href="/admin/industries/new" className="inline-flex items-center gap-2 rounded-lg bg-eu-blue px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-eu-blue-light">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Industry
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-border-light bg-white">
        {industries.length === 0 ? (
          <div className="p-12 text-center text-sm text-text-secondary">No industries yet.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border-lighter bg-surface-alt text-xs uppercase tracking-wider text-text-muted">
              <tr>
                <th className="px-6 py-3">Industry</th>
                <th className="px-6 py-3">Badge</th>
                <th className="px-6 py-3">Systems</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-lighter">
              {industries.map((ind) => (
                <tr key={ind.id} className="hover:bg-surface-alt/50">
                  <td className="px-6 py-4 font-medium text-text-primary">{ind.name}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${ind.colorClass}`}>
                      {ind.name}
                    </span>
                  </td>
                  <td className="px-6 py-4">{ind._count.systems}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/industries/${ind.id}/edit`} className="rounded-lg px-3 py-1.5 text-xs font-medium text-eu-blue hover:bg-navy-50">Edit</Link>
                      <DeleteIndustryButton id={ind.id} name={ind.name} />
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
