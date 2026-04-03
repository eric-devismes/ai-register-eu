/**
 * POST /api/subscribe/logout — Clear the subscriber session.
 */

import { NextResponse } from "next/server";
import { logoutSubscriber } from "@/lib/subscriber-auth";

export async function POST() {
  await logoutSubscriber();
  return NextResponse.json({ success: true });
}
