/**
 * PATCH /api/feedback/[id]/status — Update feedback status.
 * Accepts { status: "new" | "read" | "responded" }.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const VALID_STATUSES = ["new", "read", "responded"] as const;

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let body: { status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.status || !VALID_STATUSES.includes(body.status as (typeof VALID_STATUSES)[number])) {
    return NextResponse.json(
      { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` },
      { status: 400 }
    );
  }

  try {
    const updated = await prisma.feedback.update({
      where: { id },
      data: { status: body.status },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Feedback not found" }, { status: 404 });
  }
}
