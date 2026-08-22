export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendPasswordReset } from "@/lib/email";

const ONE_HOUR = 60 * 60 * 1000;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email = typeof body.email === "string" ? body.email.toLowerCase().trim() : "";

  if (!email) {
    return NextResponse.json({ error: "Email required." }, { status: 400 });
  }

  const admin = await db.adminUser.findUnique({ where: { email } });

  if (!admin) {
    return NextResponse.json({ error: "No admin account found for that email address." }, { status: 404 });
  }

  // Invalidate any existing tokens for this admin
  await db.passwordResetToken.deleteMany({ where: { adminId: admin.id } });

  const token = await db.passwordResetToken.create({
    data: {
      adminId: admin.id,
      expiresAt: new Date(Date.now() + ONE_HOUR),
    },
  });

  const origin = req.headers.get("origin") ?? process.env.NEXTAUTH_URL ?? "";
  const resetUrl = `${origin}/cyvant-hq/reset-password?token=${token.token}`;

  try {
    await sendPasswordReset({ to: admin.email, name: admin.name, resetUrl });
    console.log("[forgot-password] email sent to:", admin.email);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[forgot-password] email failed:", msg);
    // Return the error so you can see what Resend is rejecting
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
