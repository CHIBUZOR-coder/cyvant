import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

const TAKE = 50;

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const paymentStatus = searchParams.get("paymentStatus") ?? "";
  const page = Math.max(0, parseInt(searchParams.get("page") ?? "0", 10));

  const where = {
    ...(q && {
      OR: [
        { name: { contains: q, mode: "insensitive" as const } },
        { email: { contains: q, mode: "insensitive" as const } },
        { courseName: { contains: q, mode: "insensitive" as const } },
      ],
    }),
    ...(paymentStatus && { paymentStatus }),
  };

  const [data, total] = await Promise.all([
    db.student.findMany({
      where,
      orderBy: { enrolledAt: "desc" },
      include: { lead: { select: { status: true, leadSource: true } } },
      take: TAKE,
      skip: page * TAKE,
    }),
    db.student.count({ where }),
  ]);

  return NextResponse.json({ data, total, page, pages: Math.ceil(total / TAKE) });
}
