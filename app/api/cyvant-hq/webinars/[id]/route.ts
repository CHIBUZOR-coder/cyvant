export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await db.webinar.delete({ where: { id } });
  revalidatePath("/webinars");
  revalidatePath("/");
  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const webinar = await db.webinar.update({
    where: { id },
    data: {
      ...(body.registrationOpen !== undefined && { registrationOpen: body.registrationOpen }),
      ...(body.recordingUrl !== undefined && { recordingUrl: body.recordingUrl || null }),
      ...(body.recordingPermissionConfirmed !== undefined && { recordingPermissionConfirmed: body.recordingPermissionConfirmed }),
      ...(body.recapContent !== undefined && { recapContent: body.recapContent || null }),
    },
  });

  revalidatePath("/webinars");
  revalidatePath("/");
  return NextResponse.json(webinar);
}
