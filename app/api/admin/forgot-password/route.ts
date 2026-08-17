import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendPasswordReset } from "@/lib/email";

const ONE_HOUR = 60 * 60 * 1000;

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email required." }, { status: 400 });
  }

  const admin = await db.adminUser.findUnique({ where: { email } });

  // Always return 200 — don't reveal whether the email exists
  if (!admin) {
    return NextResponse.json({ ok: true });
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
  const resetUrl = `${origin}/admin/reset-password?token=${token.token}`;

  await sendPasswordReset({ to: admin.email, name: admin.name, resetUrl }).catch((err) => {
    console.error("[forgot-password] email failed:", err);
  });

  return NextResponse.json({ ok: true });
}
