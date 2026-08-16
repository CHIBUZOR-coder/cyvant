import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const lead = await db.lead.findUnique({
    where: { id },
    include: {
      notes: { orderBy: { createdAt: "desc" } },
      student: true,
    },
  });

  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(lead);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { status } = await req.json();
  const valid = ["new", "contacted", "enrolled", "closed"];
  if (!valid.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const lead = await db.lead.update({
    where: { id },
    data: { status },
    include: { student: true },
  });

  // Auto-create a student record the first time a lead is marked enrolled
  if (status === "enrolled" && !lead.student) {
    await db.student.create({
      data: {
        leadId: id,
        name: lead.name,
        email: lead.email,
        phone: lead.phone ?? undefined,
        courseName: lead.courseInterest ?? "Not specified",
      },
    });
  }

  return NextResponse.json(lead);
}
