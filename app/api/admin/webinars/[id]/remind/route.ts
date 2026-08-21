export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendConfirmation } from "@/lib/email";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const webinar = await db.webinar.findUnique({
    where: { id },
    select: { id: true, title: true, date: true, time: true },
  });

  if (!webinar) return NextResponse.json({ error: "Webinar not found" }, { status: 404 });

  const registrations = await db.webinarRegistration.findMany({
    where: { webinarId: id },
    select: { name: true, email: true },
  });

  if (registrations.length === 0) {
    return NextResponse.json({ ok: true, sent: 0 });
  }

  const dateStr = new Date(webinar.date).toLocaleDateString("en-NG", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cyvant.org";

  const results = await Promise.allSettled(
    registrations.map((r) =>
      sendConfirmation({
        to: r.email,
        name: r.name,
        subject: `Reminder: "${webinar.title}" is coming up`,
        bodyHtml: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
            <h2 style="color:#6d28d9">Hi ${r.name}, just a reminder!</h2>
            <p>You're registered for <strong>${webinar.title}</strong>.</p>
            <table style="margin:20px 0;border-collapse:collapse">
              <tr>
                <td style="padding:6px 16px 6px 0;color:#6b7280;white-space:nowrap">Date</td>
                <td style="padding:6px 0"><strong>${dateStr}</strong></td>
              </tr>
              <tr>
                <td style="padding:6px 16px 6px 0;color:#6b7280">Time</td>
                <td style="padding:6px 0"><strong>${webinar.time}</strong></td>
              </tr>
            </table>
            <p>We'll send you the join link soon. Keep an eye on your inbox.</p>
            <div style="margin:28px 0">
              <a href="${siteUrl}/webinars"
                style="display:inline-block;background:#007dff;color:#fff;font-weight:600;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:14px">
                View Webinar Details →
              </a>
            </div>
            <p style="color:#6b7280;font-size:13px">— The CYVANT Team</p>
          </div>
        `,
      })
    )
  );

  const failed = results.filter((r) => r.status === "rejected").length;
  if (failed > 0) console.error(`[remind] ${failed}/${registrations.length} emails failed`);

  return NextResponse.json({ ok: true, sent: registrations.length - failed, failed });
}
