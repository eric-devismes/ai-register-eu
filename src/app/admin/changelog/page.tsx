/**
 * ChangeLog Admin Page — View and create changelog entries.
 * Can filter by framework or system via query params.
 */

export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/db";
import { DeleteChangeLogButton } from "./DeleteButton";

const TYPE_LABELS: Record<string, string> = {
  update: "Update",
  amendment: "Amendment",
  jurisprudence: "Jurisprudence",
  new_version: "New Version",
  incident: "Incident",
  certification: "Certification",
  correction: "Correction",
};

const TYPE_COLORS: Record<string, string> = {
  update: "bg-blue-100 text-blue-700",
  amendment: "bg-purple-100 text-purple-700",
  jurisprudence: "bg-amber-100 text-amber-700",
  new_version: "bg-emerald-100 text-emerald-700",
  incident: "bg-red-100 text-red-700",
  certification: "bg-cyan-100 text-cyan-700",
  correction: "bg-gray-100 text-gray-700",
};

export default async function ChangeLogPage() {
  const entries = await prisma.changeLog.findMany({
    orderBy: { date: "desc" },
    take: 50,
    include: {
      framework: true,
      system: true,
    },
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-text-primary">Change Log</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Track all updates to frameworks and AI system assessments with source citations.
          </p>
        </div>
        <Link href="/admin/changelog/new"
          className="inline-flex items-center gap-2 rounded-lg bg-eu-blue px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-eu-blue-light">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Log Change
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {entries.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-border-light p-12 text-center text-sm text-text-secondary">
            No changelog entries yet. Log your first update.
          </div>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="rounded-xl border border-border-light bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs text-text-muted">{entry.date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${TYPE_COLORS[entry.changeType] || TYPE_COLORS.update}`}>
                      {TYPE_LABELS[entry.changeType] || entry.changeType}
                    </span>
                    {entry.framework && (
                      <span className="rounded bg-[#003399]/10 px-2 py-0.5 text-xs font-medium text-[#003399]">
                        {entry.framework.name}
                      </span>
                    )}
                    {entry.system && (
                      <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                        {entry.system.vendor} {entry.system.name}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm font-semibold text-text-primary">{entry.title}</p>
                  <p className="mt-1 text-sm text-text-secondary">{entry.description}</p>
                  {entry.sourceUrl && (
                    <a href={entry.sourceUrl} target="_blank" rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-xs text-eu-blue hover:underline">
                      {entry.sourceLabel || "Source"}
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                    </a>
                  )}
                </div>
                <DeleteChangeLogButton id={entry.id} />
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
