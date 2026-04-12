/**
 * Admin: Expert Panel — Advisory board discussion system.
 *
 * Start discussions on any topic, watch domain experts debate,
 * and make CEO decisions when they disagree.
 */

import { prisma } from "@/lib/db";
import { ExpertPanelClient } from "./ExpertPanelClient";

export const metadata = { title: "Expert Panel — Admin" };
export const dynamic = "force-dynamic";

export default async function ExpertPanelPage() {
  // Fetch recent discussions with responses
  const discussions = await prisma.expertDiscussion.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
    include: {
      responses: {
        orderBy: [{ round: "asc" }, { createdAt: "asc" }],
      },
    },
  });

  // Stats
  const totalDiscussions = await prisma.expertDiscussion.count();
  const awaitingCeo = await prisma.expertDiscussion.count({
    where: { status: "awaiting_ceo" },
  });
  const consensusRate = totalDiscussions > 0
    ? await prisma.expertDiscussion.count({ where: { consensus: true } })
    : 0;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Expert Advisory Panel</h1>
        <p className="mt-1 text-sm text-gray-500">
          11 domain experts debate topics and advise you. You make the final call as CEO.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-3xl font-bold text-gray-900">{totalDiscussions}</p>
          <p className="text-sm text-gray-500">Discussions</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-3xl font-bold text-amber-600">{awaitingCeo}</p>
          <p className="text-sm text-gray-500">Awaiting CEO</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-3xl font-bold text-green-600">
            {totalDiscussions > 0 ? Math.round((consensusRate / totalDiscussions) * 100) : 0}%
          </p>
          <p className="text-sm text-gray-500">Consensus Rate</p>
        </div>
      </div>

      <ExpertPanelClient
        discussions={discussions.map((d) => ({
          id: d.id,
          topic: d.topic,
          context: d.context,
          status: d.status,
          consensus: d.consensus,
          summary: d.summary,
          ceoDecision: d.ceoDecision,
          createdAt: d.createdAt.toISOString(),
          responses: d.responses.map((r) => ({
            id: r.id,
            expertId: r.expertId,
            expertName: r.expertName,
            emoji: r.emoji,
            round: r.round,
            response: r.response,
            position: r.position,
          })),
        }))}
      />
    </div>
  );
}
