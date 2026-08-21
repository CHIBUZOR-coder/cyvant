export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const now = new Date();
    const webinar = await db.webinar.findFirst({
      where: { date: { gte: now } },
      orderBy: { date: "asc" },
    });
    return NextResponse.json({ webinar });
  } catch {
    return NextResponse.json({ webinar: null });
  }
}
