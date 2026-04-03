/**
 * Admin Chat Logs — View all chat interactions for monitoring and abuse detection.
 */

export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";

const REASON_LABELS: Record<string, string> = {
  injection: "Injection attempt",
  "off-topic": "Off-topic",
  "rate-limit": "Rate limited",
  "too-long": "Too long",
};

export default async function ChatLogsPage() {
  const logs = await prisma.chatLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const stats = {
    total: logs.length,
    blocked: logs.filter((l) => l.blocked).length,
    today: logs.filter((l) => l.createdAt.toISOString().split("T")[0] === new Date().toISOString().split("T")[0]).length,
  };

  return (
    <>
      <h1 className="font-heading text-2xl font-bold text-text-primary">Chat Logs</h1>
      <p className="mt-1 text-sm text-text-secondary">Monitor chatbot usage, blocked attempts, and potential abuse.</p>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-border-light bg-white p-4">
          <p className="text-sm text-text-secondary">Total (last 100)</p>
          <p className="text-2xl font-bold text-text-primary">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-border-light bg-white p-4">
          <p className="text-sm text-text-secondary">Blocked</p>
          <p className="text-2xl font-bold text-red-600">{stats.blocked}</p>
        </div>
        <div className="rounded-xl border border-border-light bg-white p-4">
          <p className="text-sm text-text-secondary">Today</p>
          <p className="text-2xl font-bold text-eu-blue">{stats.today}</p>
        </div>
      </div>

      {/* Logs */}
      <div className="mt-6 overflow-hidden rounded-xl border border-border-light bg-white">
        {logs.length === 0 ? (
          <div className="p-12 text-center text-sm text-text-secondary">No chat logs yet.</div>
        ) : (
          <div className="divide-y divide-border-lighter">
            {logs.map((log) => (
              <div key={log.id} className={`px-6 py-4 ${log.blocked ? "bg-red-50/50" : ""}`}>
                <div className="flex items-center gap-3 text-xs text-text-muted">
                  <span>{log.createdAt.toLocaleString()}</span>
                  <span className="rounded bg-gray-100 px-1.5 py-0.5">{log.locale}</span>
                  {log.blocked && (
                    <span className="rounded bg-red-100 px-1.5 py-0.5 text-red-700 font-semibold">
                      {REASON_LABELS[log.blockReason] || log.blockReason || "Blocked"}
                    </span>
                  )}
                  {log.subscriberId && (
                    <span className="rounded bg-eu-blue/10 px-1.5 py-0.5 text-eu-blue">Subscriber</span>
                  )}
                </div>
                <p className="mt-2 text-sm font-medium text-text-primary">{log.question}</p>
                {log.answer && (
                  <p className="mt-1 text-sm text-text-secondary line-clamp-2">{log.answer}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
