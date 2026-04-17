"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toggleSystemStatus } from "./actions";

export function StatusToggle({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const isActive = status === "active";

  return (
    <button
      onClick={() =>
        start(async () => {
          await toggleSystemStatus(id);
          router.refresh();
        })
      }
      disabled={pending}
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold transition ${
        isActive
          ? "bg-green-100 text-green-800 hover:bg-green-200"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      } ${pending ? "opacity-50" : ""}`}
      title={isActive ? "Click to hide from public pages" : "Click to show on public pages"}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-green-600" : "bg-gray-500"}`} />
      {isActive ? "Active" : "Inactive"}
    </button>
  );
}
