export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const partners = await db.partner.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(partners);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, logoUrl, website, order, published } = body;

  if (!name?.trim() || !logoUrl?.trim()) {
    return NextResponse.json({ error: "Name and logo are required." }, { status: 400 });
  }

  const partner = await db.partner.create({
    data: {
      name: name.trim(),
      logoUrl: logoUrl.trim(),
      website: website?.trim() || null,
      order: Number(order) || 0,
      published: published ?? true,
    },
  });

  return NextResponse.json(partner, { status: 201 });
}
