/**
 * Admin Evidence Review — Per-System Page
 *
 * Side-by-side draft vs published view. For every field the extractor
 * surfaced a draft on, the analyst sees:
 *   - The current PUBLISHED claim (if any), plus its source and quote
 *   - The new DRAFT claim, plus its source and verbatim evidence quote
 *   - Approve / Edit / Reject buttons
 *
 * Below the comparisons, a panel listing every fetched source with the
 * snapshot text, so the analyst can spot-check what the LLM was reading.
 */

export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import {
  approveDraft,
  rejectDraft,
  rejectAllDraftsForSystem,
  reExtractForSystem,
  approveHighConfidenceDrafts,
} from "./actions";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ bulk?: string }>;
}

export default async function EvidenceReviewPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { bulk } = await searchParams;
  const system = await prisma.aISystem.findUnique({
    where: { slug },
    select: { id: true, slug: true, vendor: true, name: true },
  });
  if (!system) notFound();

  // Pull all draft claims for this system, plus the matching published
  // claim (if any) for side-by-side display.
  const drafts = await prisma.systemClaim.findMany({
    where: { systemId: system.id, status: "draft" },
    include: {
      source: { select: { url: true, label: true, tier: true } },
      snapshot: { select: { fetchedAt: true } },
    },
    orderBy: [{ field: "asc" }],
  });

  const publishedByField = new Map<string, {
    id: string;
    value: string;
    evidenceQuote: string;
    confidence: string;
    verifiedAt: Date | null;
    source: { url: string; label: string } | null;
  }>();
  if (drafts.length > 0) {
    const fields = drafts.map((d) => d.field);
    const published = await prisma.systemClaim.findMany({
      where: { systemId: system.id, status: "published", field: { in: fields } },
      include: { source: { select: { url: true, label: true } } },
    });
    for (const p of published) {
      publishedByField.set(p.field, {
        id: p.id,
        value: p.value,
        evidenceQuote: p.evidenceQuote,
        confidence: p.confidence,
        verifiedAt: p.verifiedAt,
        source: p.source ? { url: p.source.url, label: p.source.label } : null,
      });
    }
  }

  // Sources panel — what the fetcher knows about for this system
  const sources = await prisma.source.findMany({
    where: { active: true, systemId: system.id },
    include: {
      snapshots: {
        orderBy: { fetchedAt: "desc" },
        take: 1,
        select: { fetchedAt: true, status: true, errorMessage: true, contentHash: true, rawText: true },
      },
    },
    orderBy: [{ tier: "asc" }, { label: "asc" }],
  });

  return (
    <>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-text-muted">
            <Link href="/admin/evidence" className="hover:text-eu-blue">← Evidence queue</Link>
          </div>
          <h1 className="mt-2 font-heading text-2xl font-bold text-text-primary">
            {system.vendor} — {system.name}
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            {drafts.length === 0
              ? "No drafts pending for this vendor."
              : `${drafts.length} draft claim(s) awaiting your review.`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/en/systems/${system.slug}`}
            target="_blank"
            className="inline-flex items-center gap-2 rounded-lg border border-border-light bg-white px-3 py-2 text-xs font-semibold text-text-primary transition hover:border-eu-blue hover:text-eu-blue"
          >
            View public page ↗
          </Link>
          <form action={reExtractForSystem}>
            <input type="hidden" name="systemId" value={system.id} />
            <input type="hidden" name="slug" value={system.slug} />
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg border border-border-light bg-white px-3 py-2 text-xs font-semibold text-text-primary transition hover:border-eu-blue hover:text-eu-blue"
            >
              Re-extract
            </button>
          </form>
          {drafts.length > 0 && (
            <>
              <form action={approveHighConfidenceDrafts}>
                <input type="hidden" name="systemId" value={system.id} />
                <input type="hidden" name="slug" value={system.slug} />
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100"
                  title="Promote every high-confidence draft that doesn't conflict with a currently-published value. Lower-confidence or conflicting drafts still need per-claim review."
                >
                  Approve high-confidence
                </button>
              </form>
              <form action={rejectAllDraftsForSystem}>
                <input type="hidden" name="systemId" value={system.id} />
                <input type="hidden" name="slug" value={system.slug} />
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50"
                >
                  Reject all
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      {bulk && (
        <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          Bulk action complete — <span className="font-mono text-xs">{bulk}</span>
          . High-confidence drafts with no published conflict were auto-promoted; everything else remains here for per-draft review.
        </div>
      )}

      {/* Drafts — side-by-side vs published */}
      {drafts.length > 0 && (
        <section className="mt-8 space-y-4">
          {drafts.map((d) => {
            const published = publishedByField.get(d.field);
            return <DraftCard key={d.id} draft={d} published={published} />;
          })}
        </section>
      )}

      {/* Sources panel */}
      <section className="mt-12">
        <h2 className="font-heading text-lg font-semibold text-text-primary">Sources for this vendor</h2>
        <p className="mt-1 text-sm text-text-secondary">
          The URLs the fetcher monitors. Latest snapshot status is shown for each.
        </p>
        <ul className="mt-4 space-y-3">
          {sources.map((src) => {
            const snap = src.snapshots[0];
            return (
              <li
                key={src.id}
                className="rounded-lg border border-border-light bg-white p-4 text-sm shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${tierBadge(src.tier)}`}>
                        Tier {src.tier}
                      </span>
                      <span className="font-medium text-text-primary">{src.label}</span>
                    </div>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 block text-xs text-text-muted hover:text-eu-blue"
                    >
                      {src.url}
                    </a>
                    {snap ? (
                      <div className={`mt-2 text-xs ${snap.status === "success" ? "text-text-muted" : "text-red-600 font-semibold"}`}>
                        {snap.status === "success"
                          ? `✓ Fetched ${snap.fetchedAt.toISOString().slice(0, 16).replace("T", " ")} · hash ${snap.contentHash.slice(0, 12)} · ${snap.rawText.length.toLocaleString()} chars`
                          : `✗ ${snap.status}: ${snap.errorMessage || "no detail"}`}
                      </div>
                    ) : (
                      <div className="mt-2 text-xs text-text-muted">No snapshot yet.</div>
                    )}
                  </div>
                </div>
                {snap && snap.status === "success" && (
                  <details className="mt-3">
                    <summary className="cursor-pointer text-xs font-semibold text-text-muted hover:text-eu-blue">
                      Show snapshot text ({(snap.rawText.length / 1024).toFixed(1)}KB)
                    </summary>
                    <pre className="mt-2 max-h-96 overflow-auto rounded bg-surface-alt p-3 text-xs leading-relaxed whitespace-pre-wrap text-text-secondary">
                      {snap.rawText.slice(0, 20_000)}
                      {snap.rawText.length > 20_000 && "\n\n[...truncated, full text in DB...]"}
                    </pre>
                  </details>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}

function tierBadge(tier: number): string {
  if (tier === 1) return "bg-emerald-100 text-emerald-700";
  if (tier === 2) return "bg-sky-100 text-sky-700";
  if (tier === 3) return "bg-violet-100 text-violet-700";
  return "bg-slate-100 text-slate-700";
}

interface DraftRow {
  id: string;
  field: string;
  value: string;
  evidenceQuote: string;
  confidence: string;
  source: { url: string; label: string; tier: number } | null;
  snapshot: { fetchedAt: Date } | null;
}

interface PublishedRow {
  id: string;
  value: string;
  evidenceQuote: string;
  confidence: string;
  verifiedAt: Date | null;
  source: { url: string; label: string } | null;
}

function DraftCard({ draft, published }: { draft: DraftRow; published?: PublishedRow }) {
  const isUpdate = !!published;
  return (
    <article className="rounded-xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
      <header className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
              {isUpdate ? "Update existing" : "New claim"}
            </span>
            <code className="rounded bg-white px-2 py-0.5 text-xs font-mono text-text-primary">{draft.field}</code>
          </div>
        </div>
      </header>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Published side */}
        <div className="rounded-lg border border-border-light bg-white p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-text-muted">Currently published</div>
          {published ? (
            <>
              <div className="mt-2 text-sm font-medium text-text-primary">{published.value}</div>
              <blockquote className="mt-2 border-l-2 border-border-lighter pl-3 text-xs italic text-text-muted">
                &ldquo;{published.evidenceQuote}&rdquo;
              </blockquote>
              <div className="mt-3 text-xs text-text-muted">
                {published.source && (
                  <a href={published.source.url} target="_blank" rel="noopener noreferrer" className="hover:text-eu-blue">
                    {published.source.label} ↗
                  </a>
                )}
                {published.verifiedAt && (
                  <span className="ml-2">verified {published.verifiedAt.toISOString().slice(0, 10)}</span>
                )}
                <span className="ml-2 rounded bg-surface-alt px-1.5 py-0.5 text-xs">
                  {published.confidence}
                </span>
              </div>
            </>
          ) : (
            <div className="mt-2 text-sm italic text-text-muted">Nothing published yet for this field.</div>
          )}
        </div>

        {/* Draft side — editable + actions */}
        <form action={approveDraft} className="rounded-lg border border-amber-300 bg-white p-4">
          <input type="hidden" name="draftId" value={draft.id} />
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-800">Draft from extractor</div>

          <label className="mt-2 block text-xs font-semibold text-text-muted">Value</label>
          <textarea
            name="editedValue"
            defaultValue={draft.value}
            rows={2}
            className="mt-1 w-full rounded border border-border-light bg-surface-alt px-2 py-1.5 text-sm text-text-primary focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue"
          />

          <div className="mt-3 text-xs font-semibold text-text-muted">Evidence quote (verbatim from source)</div>
          <blockquote className="mt-1 border-l-2 border-amber-300 bg-amber-50 px-3 py-2 text-xs italic text-text-secondary">
            &ldquo;{draft.evidenceQuote}&rdquo;
          </blockquote>

          <div className="mt-3 flex items-center gap-3 text-xs text-text-muted">
            {draft.source && (
              <a href={draft.source.url} target="_blank" rel="noopener noreferrer" className="hover:text-eu-blue">
                {draft.source.label} ↗
              </a>
            )}
            <label className="flex items-center gap-1">
              confidence:
              <select
                name="editedConfidence"
                defaultValue={draft.confidence}
                className="rounded border border-border-light bg-surface-alt px-1.5 py-0.5 text-xs"
              >
                <option value="high">high</option>
                <option value="medium">medium</option>
                <option value="low">low</option>
              </select>
            </label>
            {draft.snapshot && (
              <span>fetched {draft.snapshot.fetchedAt.toISOString().slice(0, 10)}</span>
            )}
          </div>

          <div className="mt-4 flex items-center gap-2">
            <button
              type="submit"
              className="flex-1 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              {isUpdate ? "Approve as update" : "Approve & publish"}
            </button>
          </div>
        </form>
      </div>

      {/* Reject — separate form so it doesn't submit the approve form */}
      <form action={rejectDraft} className="mt-3 flex justify-end">
        <input type="hidden" name="draftId" value={draft.id} />
        <button
          type="submit"
          className="text-xs font-semibold text-red-700 hover:underline"
        >
          Reject draft
        </button>
      </form>
    </article>
  );
}
