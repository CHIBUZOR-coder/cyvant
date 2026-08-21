export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { notifyAdmins } from "@/lib/email";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admins = await db.adminUser.findMany({
    where: { role: "admin" },
    select: { email: true, name: true },
  });

  if (admins.length === 0) {
    return NextResponse.json({ error: "No admin users found in the database." }, { status: 404 });
  }

  try {
    await notifyAdmins(
      "Test notification",
      "<p>This is a test admin notification from CYVANT. If you received this, admin emails are working correctly.</p>",
    );

    return NextResponse.json({
      ok: true,
      sentTo: admins.map((a) => a.email),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message, sentTo: admins.map((a) => a.email) }, { status: 500 });
  }
}
