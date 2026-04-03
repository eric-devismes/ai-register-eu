/**
 * Server Actions for Industries
 */

"use server";

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function requireAuth() {
  const authenticated = await getSession();
  if (!authenticated) redirect("/admin/login");
}

export async function createIndustry(formData: FormData) {
  await requireAuth();

  const name = formData.get("name") as string;
  const colorClass = formData.get("colorClass") as string;
  const iconName = formData.get("iconName") as string;

  await prisma.industry.create({
    data: { slug: slugify(name), name, colorClass: colorClass || "", iconName: iconName || "building" },
  });

  revalidatePath("/admin/industries");
  revalidatePath("/");
  redirect("/admin/industries");
}

export async function updateIndustry(id: string, formData: FormData) {
  await requireAuth();

  const name = formData.get("name") as string;
  const colorClass = formData.get("colorClass") as string;
  const iconName = formData.get("iconName") as string;

  await prisma.industry.update({
    where: { id },
    data: { slug: slugify(name), name, colorClass: colorClass || "", iconName: iconName || "building" },
  });

  revalidatePath("/admin/industries");
  revalidatePath("/");
  redirect("/admin/industries");
}

export async function deleteIndustry(id: string) {
  await requireAuth();
  await prisma.industry.delete({ where: { id } });
  revalidatePath("/admin/industries");
  revalidatePath("/");
}
