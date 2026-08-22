export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

function slugify(text: string): string {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const services = await db.service.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  return NextResponse.json(services);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { title, description, cta = "Talk to us", icon = "shield", number, published = true, order = 0 } = await req.json();

    if (!title?.trim() || !description?.trim()) {
      return NextResponse.json({ error: "Title and description are required." }, { status: 400 });
    }

    const slug = slugify(title);

    const service = await db.service.create({
      data: {
        slug,
        title: title.trim(),
        description: description.trim(),
        cta: cta.trim() || "Talk to us",
        icon,
        number: number?.trim() || "01",
        published,
        order: Number(order) || 0,
      },
    });

    revalidatePath("/services");
    revalidatePath("/");
    return NextResponse.json(service, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create service.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
