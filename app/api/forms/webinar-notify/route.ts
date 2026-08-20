import { NextRequest, NextResponse } from "next/server";
import { isValidEmail } from "@/lib/validation";
import { upsertLead } from "@/lib/leads";
import { sendConfirmation, notifyMarketer } from "@/lib/email";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email } = body ?? {};

  if (!name?.trim()) {
    return NextResponse.json({ errors: { name: "Name is required." } }, { status: 400 });
  }
  if (!email?.trim() || !isValidEmail(email)) {
    return NextResponse.json({ errors: { email: "Valid email is required." } }, { status: 400 });
  }

  try {
    await upsertLead({ name, email, leadSource: "webinar_notify" }, 0);
  } catch (err) {
    console.error("[api/forms/webinar-notify]", err);
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cyvant.org";

  const results = await Promise.allSettled([
    sendConfirmation({
      to: email,
      name,
      subject: "You're on the CYVANT Webinar List!",
      bodyHtml: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
          <h2 style="color:#6d28d9">Hi ${name}, you&apos;re on the list!</h2>
          <p>Thanks for your interest in CYVANT webinars. We&apos;ll send you an email as soon as our next live session is ready for registration. Just keep an eye on your inbox.</p>
          <p>In the meantime, feel free to explore our courses and services.</p>
          <br/>
          <p style="color:#6b7280;font-size:13px">The CYVANT Team</p>
        </div>
      `,
    }),
    notifyMarketer(
      `New webinar notification request from ${name}`,
      `<table style="font-size:14px;color:#1a1a1a;border-collapse:collapse;width:100%">
        <tr><td style="padding:6px 12px 6px 0;color:#6b7280;white-space:nowrap">Name</td><td style="padding:6px 0"><strong>${name}</strong></td></tr>
        <tr><td style="padding:6px 12px 6px 0;color:#6b7280">Email</td><td style="padding:6px 0"><a href="mailto:${email}" style="color:#6d28d9">${email}</a></td></tr>
        <tr><td style="padding:6px 12px 6px 0;color:#6b7280">Source</td><td style="padding:6px 0">Webinar Notify</td></tr>
      </table>
      <p style="margin-top:16px;font-size:13px;color:#6b7280">
        Go to <a href="${siteUrl}/admin/leads" style="color:#6d28d9">Admin → Leads</a> to see all interested leads and notify them when a webinar is ready.
      </p>`,
      email,
    ),
  ]);
  results.forEach((r, i) => {
    if (r.status === "rejected") console.error(`[api/forms/webinar-notify] email[${i}] failed:`, r.reason);
  });

  return NextResponse.json({ success: true });
}
