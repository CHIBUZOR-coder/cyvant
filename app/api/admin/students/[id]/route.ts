import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendConfirmation } from "@/lib/email";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const student = await db.student.findUnique({
    where: { id },
    include: { lead: { include: { notes: { orderBy: { createdAt: "desc" } } } } },
  });

  if (!student) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(student);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { cohort, startDate, paymentStatus, amountPaid, notes } = body;

  const validPayment = ["pending", "partial", "paid"];
  if (paymentStatus && !validPayment.includes(paymentStatus)) {
    return NextResponse.json({ error: "Invalid payment status" }, { status: 400 });
  }

  const prevStudent = await db.student.findUnique({ where: { id }, select: { paymentStatus: true } });

  const student = await db.student.update({
    where: { id },
    data: {
      ...(cohort !== undefined && { cohort }),
      ...(startDate !== undefined && { startDate: startDate ? new Date(startDate) : null }),
      ...(paymentStatus && { paymentStatus }),
      ...(amountPaid !== undefined && { amountPaid: Number(amountPaid) }),
      ...(notes !== undefined && { notes }),
    },
  });

  // Send receipt only when transitioning into "paid" for the first time
  if (paymentStatus === "paid" && prevStudent?.paymentStatus !== "paid") {
    sendConfirmation({
      to: student.email,
      name: student.name,
      subject: "Payment Confirmed: CYVANT",
      bodyHtml: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
          <h2 style="color:#6d28d9">Payment Received, ${student.name}!</h2>
          <p>We've confirmed your payment for <strong>${student.courseName}</strong>.</p>
          ${student.amountPaid ? `<p><strong>Amount paid:</strong> ₦${Number(student.amountPaid).toLocaleString()}</p>` : ""}
          <p>Your place is fully secured. We'll reach out with any remaining onboarding details.</p>
          <p>Thank you for choosing CYVANT. We're excited to have you!</p>
          <br/>
          <p style="color:#6b7280;font-size:13px">The CYVANT Team</p>
        </div>
      `,
    }).catch((err) => console.error("[email] payment confirmation failed:", err));
  }

  return NextResponse.json(student);
}
