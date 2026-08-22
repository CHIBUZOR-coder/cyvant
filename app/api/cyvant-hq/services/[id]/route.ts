export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const { title, description, cta, icon, number, published, order } = await req.json();

    const service = await db.service.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(description !== undefined && { description: description.trim() }),
        ...(cta !== undefined && { cta: cta.trim() }),
        ...(icon !== undefined && { icon }),
        ...(number !== undefined && { number: number.trim() }),
        ...(published !== undefined && { published }),
        ...(order !== undefined && { order: Number(order) }),
      },
    });

    revalidatePath("/services");
    revalidatePath("/");
    return NextResponse.json(service);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update service.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    await db.service.delete({ where: { id } });
    revalidatePath("/services");
    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete service.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
