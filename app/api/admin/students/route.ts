import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const paymentStatus = searchParams.get("paymentStatus") ?? "";

  const students = await db.student.findMany({
    where: {
      ...(q && {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
          { courseName: { contains: q, mode: "insensitive" } },
        ],
      }),
      ...(paymentStatus && { paymentStatus }),
    },
    orderBy: { enrolledAt: "desc" },
    include: { lead: { select: { status: true, leadSource: true } } },
  });

  return NextResponse.json(students);
}
