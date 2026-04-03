/**
 * Server Actions for ChangeLog entries.
 * Supports creating changelog entries linked to a framework, a system, or both.
 */

"use server";

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function requireAuth() {
  const authenticated = await getSession();
  if (!authenticated) redirect("/admin/login");
}

// CHANGE_TYPES moved to a separate non-server file to avoid "use server" export restriction

export async function createChangeLog(formData: FormData) {
  await requireAuth();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const changeType = formData.get("changeType") as string;
  const sourceUrl = (formData.get("sourceUrl") as string) || "";
  const sourceLabel = (formData.get("sourceLabel") as string) || "";
  const author = (formData.get("author") as string) || "AI Compass EU Editorial";
  const frameworkId = (formData.get("frameworkId") as string) || null;
  const systemId = (formData.get("systemId") as string) || null;
  const dateStr = formData.get("date") as string;
  const date = dateStr ? new Date(dateStr) : new Date();

  await prisma.changeLog.create({
    data: {
      title,
      description,
      changeType,
      sourceUrl,
      sourceLabel,
      author,
      date,
      frameworkId: frameworkId || null,
      systemId: systemId || null,
    },
  });

  revalidatePath("/admin/changelog");
  revalidatePath("/");

  // Redirect back to where we came from
  if (frameworkId) revalidatePath(`/admin/changelog?frameworkId=${frameworkId}`);
  if (systemId) revalidatePath(`/admin/changelog?systemId=${systemId}`);

  redirect("/admin/changelog");
}

export async function deleteChangeLog(id: string) {
  await requireAuth();
  await prisma.changeLog.delete({ where: { id } });
  revalidatePath("/admin/changelog");
  revalidatePath("/");
}
