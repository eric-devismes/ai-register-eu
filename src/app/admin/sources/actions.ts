"use server";

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function requireAuth() {
  const authenticated = await getSession();
  if (!authenticated) redirect("/admin/login");
}

export async function createSource(formData: FormData) {
  await requireAuth();
  const url = formData.get("url") as string;
  const name = formData.get("name") as string;
  const description = (formData.get("description") as string) || "";

  await prisma.approvedSource.create({ data: { url, name, description } });
  revalidatePath("/admin/sources");
  redirect("/admin/sources");
}

export async function deleteSource(id: string) {
  await requireAuth();
  await prisma.approvedSource.delete({ where: { id } });
  revalidatePath("/admin/sources");
}
