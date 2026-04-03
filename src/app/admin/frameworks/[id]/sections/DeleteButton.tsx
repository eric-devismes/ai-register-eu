"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteSection, deleteStatement } from "./actions";

export function DeleteSectionButton({ sectionId, frameworkId, title }: { sectionId: string; frameworkId: string; title: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);

  async function handleDelete() {
    await deleteSection(sectionId, frameworkId);
    router.refresh();
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <span className="text-xs text-red-600">Delete &quot;{title}&quot;?</span>
        <button onClick={handleDelete} className="rounded-lg px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50">Yes</button>
        <button onClick={() => setConfirming(false)} className="rounded-lg px-2 py-1 text-xs font-medium text-text-secondary hover:bg-gray-100">No</button>
      </div>
    );
  }

  return (
    <button onClick={() => setConfirming(true)} className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50">Delete</button>
  );
}

export function DeleteStatementButton({ statementId, sectionId, frameworkId }: { statementId: string; sectionId: string; frameworkId: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);

  async function handleDelete() {
    await deleteStatement(statementId, sectionId, frameworkId);
    router.refresh();
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <span className="text-xs text-red-600">Delete?</span>
        <button onClick={handleDelete} className="rounded-lg px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50">Yes</button>
        <button onClick={() => setConfirming(false)} className="rounded-lg px-2 py-1 text-xs font-medium text-text-secondary hover:bg-gray-100">No</button>
      </div>
    );
  }

  return (
    <button onClick={() => setConfirming(true)} className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50">Delete</button>
  );
}
