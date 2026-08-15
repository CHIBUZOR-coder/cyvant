import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { content, type = "note" } = await req.json();
  if (!content?.trim()) {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }

  const note = await db.note.create({
    data: {
      leadId: params.id,
      content,
      type,
      createdBy: session.user?.name ?? session.user?.email ?? "Admin",
    },
  });

  return NextResponse.json(note, { status: 201 });
}
