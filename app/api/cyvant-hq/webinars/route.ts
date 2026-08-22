export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const webinars = await db.webinar.findMany({ orderBy: { date: "desc" } });
  return NextResponse.json(webinars);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, subtitle, date, time, description, formatSummary, registrationOpen, qualifyingQuestion, thumbnailImage } = body;

  if (!title?.trim() || !date || !time?.trim()) {
    return NextResponse.json({ error: "Title, date, and time are required." }, { status: 400 });
  }

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    + "-" + new Date(date).getFullYear();

  const webinar = await db.webinar.create({
    data: {
      slug,
      title: title.trim(),
      subtitle: subtitle?.trim() || null,
      date: new Date(date),
      time: time.trim(),
      description: description?.trim() || null,
      formatSummary: formatSummary?.trim() || null,
      registrationOpen: registrationOpen ?? true,
      qualifyingQuestion: qualifyingQuestion?.trim() || "What's pulling you toward cybersecurity or AI?",
      thumbnailImage: thumbnailImage ?? null,
    },
  });

  revalidatePath("/webinars");
  revalidatePath("/");
  return NextResponse.json(webinar, { status: 201 });
}
