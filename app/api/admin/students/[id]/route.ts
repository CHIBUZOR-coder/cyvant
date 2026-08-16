import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

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

  return NextResponse.json(student);
}
