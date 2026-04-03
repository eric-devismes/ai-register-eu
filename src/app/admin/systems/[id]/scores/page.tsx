/**
 * Dimension Scoring Page — Score an AI system per framework section.
 * Shows all frameworks and their sections with grade dropdowns + commentary.
 */

export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { ALL_GRADES } from "@/lib/scoring";
import { saveDimensionScores } from "./actions";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DimensionScoresPage({ params }: PageProps) {
  const { id } = await params;

  const system = await prisma.aISystem.findUnique({
    where: { id },
    include: {
      scores: { include: { framework: true } },
      dimensionScores: true,
    },
  });

  if (!system) notFound();

  // Get frameworks this system is scored against
  const frameworkIds = system.scores.map((s) => s.framework.id);
  const frameworks = await prisma.regulatoryFramework.findMany({
    where: { id: { in: frameworkIds } },
    orderBy: { name: "asc" },
    include: {
      sections: { orderBy: { sortOrder: "asc" } },
    },
  });

  const saveWithId = saveDimensionScores.bind(null, system.id);

  // Build a lookup for existing dimension scores
  const existingScores = new Map<string, { score: string; commentary: string }>();
  for (const ds of system.dimensionScores) {
    existingScores.set(ds.sectionId, { score: ds.score, commentary: ds.commentary });
  }

  return (
    <>
      <nav className="mb-4 text-sm text-text-muted">
        <Link href="/admin/systems" className="hover:text-eu-blue">AI Systems</Link>
        <span className="mx-2">/</span>
        <Link href={`/admin/systems/${id}/edit`} className="hover:text-eu-blue">{system.name}</Link>
        <span className="mx-2">/</span>
        <span>Dimension Scores</span>
      </nav>

      <h1 className="font-heading text-2xl font-bold text-text-primary">
        Per-Dimension Scoring: {system.name}
      </h1>
      <p className="mt-1 text-sm text-text-secondary">
        Score each framework section individually. These scores generate the spider chart on cross-report pages.
      </p>

      {frameworks.length === 0 ? (
        <div className="mt-8 rounded-xl border-2 border-dashed border-border-light p-12 text-center text-sm text-text-secondary">
          This system has no framework scores yet. Add overall framework scores first from the{" "}
          <Link href={`/admin/systems/${id}/edit`} className="text-eu-blue hover:underline">edit page</Link>.
        </div>
      ) : (
        <form action={saveWithId} className="mt-8 space-y-10">
          {frameworks.map((fw) => {
            const overallScore = system.scores.find((s) => s.framework.id === fw.id);
            return (
              <div key={fw.id} className="rounded-xl border border-border-light bg-white overflow-hidden">
                <div className="bg-surface-alt px-6 py-4 border-b border-border-lighter flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-text-primary">{fw.name}</h2>
                    <p className="text-xs text-text-muted">{fw.sections.length} dimensions &middot; Overall: {overallScore?.score || "N/A"}</p>
                  </div>
                </div>

                <div className="divide-y divide-border-lighter">
                  {fw.sections.map((section) => {
                    const existing = existingScores.get(section.id);
                    return (
                      <div key={section.id} className="px-6 py-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-text-primary">{section.title}</p>
                            {section.description && (
                              <p className="mt-0.5 text-xs text-text-muted">{section.description}</p>
                            )}
                          </div>
                          <select
                            name={`score_${section.id}`}
                            defaultValue={existing?.score || ""}
                            className="w-20 rounded-lg border border-border px-2 py-1.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue"
                          >
                            <option value="">—</option>
                            {ALL_GRADES.map((g) => (
                              <option key={g} value={g}>{g}</option>
                            ))}
                          </select>
                        </div>
                        <textarea
                          name={`commentary_${section.id}`}
                          defaultValue={existing?.commentary || ""}
                          placeholder="Why this score? What evidence supports it?"
                          rows={2}
                          className="mt-2 block w-full rounded-lg border border-border-lighter px-3 py-2 text-xs focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <div className="flex items-center gap-4">
            <button type="submit"
              className="rounded-lg bg-eu-blue px-6 py-3 text-sm font-semibold text-white transition hover:bg-eu-blue-light">
              Save All Dimension Scores
            </button>
            <Link href={`/admin/systems/${id}/edit`} className="text-sm text-text-secondary hover:text-text-primary">Back to system</Link>
          </div>
        </form>
      )}
    </>
  );
}
