export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendConfirmation } from "@/lib/email";

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    await db.lead.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete lead.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

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

    // Fire-and-forget — email failure must not block the 200 response
    sendConfirmation({
      to: lead.email,
      name: lead.name,
      subject: "Welcome to CYVANT: You're Enrolled!",
      bodyHtml: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
          <h2 style="color:#6d28d9">Welcome aboard, ${lead.name}!</h2>
          <p>We're thrilled to confirm your enrolment in <strong>${lead.courseInterest ?? "the CYVANT programme"}</strong>.</p>
          <p>Our team will be in touch shortly with your next steps, schedule, and onboarding materials.</p>
          <p>In the meantime, if you have any questions feel free to reply to this email.</p>
          <br/>
          <p style="color:#6b7280;font-size:13px">The CYVANT Team</p>
        </div>
      `,
    }).catch((err) => console.error("[email] enrollment confirmation failed:", err));
  }

  return NextResponse.json(lead);
}
