export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendConfirmation } from "@/lib/email";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const leads = await db.lead.findMany({
    where: { leadSource: "webinar_notify" },
    select: { id: true, name: true, email: true },
  });

  if (leads.length === 0) {
    return NextResponse.json({ ok: true, notified: 0 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cyvant.org";

  const results = await Promise.allSettled(
    leads.map((lead) =>
      sendConfirmation({
        to: lead.email,
        name: lead.name,
        subject: "CYVANT Webinar: Registration Is Now Open!",
        bodyHtml: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
            <h2 style="color:#6d28d9">Hi ${lead.name}, a new webinar is ready!</h2>
            <p>You asked us to let you know when our next live session opens for registration. The time is now.</p>
            <p>Visit our webinars page to see the details and secure your spot. It&apos;s free.</p>
            <div style="margin:28px 0;text-align:center">
              <a href="${siteUrl}/webinars"
                style="display:inline-block;background:#007dff;color:#fff;font-weight:600;padding:14px 32px;border-radius:10px;text-decoration:none;font-size:15px">
                View Webinars &amp; Register →
              </a>
            </div>
            <p style="color:#6b7280;font-size:13px">The CYVANT Team</p>
          </div>
        `,
      })
    )
  );

  const failed = results.filter((r) => r.status === "rejected").length;
  if (failed > 0) console.error(`[notify-all] ${failed} of ${leads.length} emails failed`);

  return NextResponse.json({ ok: true, notified: leads.length - failed, failed });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const leads = await db.lead.findMany({
    where: { leadSource: "webinar_notify" },
    select: { id: true, name: true, email: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ count: leads.length, leads });
}
