export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

const TAKE = 50;

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const source = searchParams.get("source");
  const status = searchParams.get("status");
  const q = searchParams.get("q");
  const page = Math.max(0, parseInt(searchParams.get("page") ?? "0", 10));

  const where = {
    ...(source ? { leadSource: source } : {}),
    ...(status ? { status } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" as const } },
            { email: { contains: q, mode: "insensitive" as const } },
            { courseInterest: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [data, total] = await Promise.all([
    db.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { notes: true } } },
      take: TAKE,
      skip: page * TAKE,
    }),
    db.lead.count({ where }),
  ]);

  return NextResponse.json({ data, total, page, pages: Math.ceil(total / TAKE) });
}
