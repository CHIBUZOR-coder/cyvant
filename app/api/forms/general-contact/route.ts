import { NextRequest, NextResponse } from "next/server";
import { validateContactFields } from "@/lib/validation";
import { upsertLead, addLeadNote } from "@/lib/leads";
import { sendConfirmation, notifyMarketer } from "@/lib/email";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, message, consent } = body ?? {};

  const errors = validateContactFields({ name: name ?? "", email: email ?? "", consent: !!consent });
  if (!message?.trim()) errors.message = "Message is required.";
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  try {
    const lead = await upsertLead({
      name,
      email,
      leadSource: "general_contact",
      message,
    });

    await addLeadNote(lead.id, `General contact message: ${message}`);
  } catch (err) {
    console.error("[api/forms/general-contact]", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }

  const results = await Promise.allSettled([
    sendConfirmation({
      to: email,
      name,
      subject: "CYVANT — We got your message",
      bodyHtml: `<p>Hi ${name},</p><p>Thanks for reaching out. We'll reply within 24 hours.</p><p>— The CYVANT Team</p>`,
    }),
    notifyMarketer(
      `New general contact from ${name}`,
      `<table style="font-size:14px;color:#1a1a1a;border-collapse:collapse;width:100%">
        <tr><td style="padding:6px 12px 6px 0;color:#6b7280;white-space:nowrap">Name</td><td style="padding:6px 0"><strong>${name}</strong></td></tr>
        <tr><td style="padding:6px 12px 6px 0;color:#6b7280">Email</td><td style="padding:6px 0"><a href="mailto:${email}" style="color:#6d28d9">${email}</a></td></tr>
        <tr><td style="padding:6px 12px 6px 0;color:#6b7280;vertical-align:top">Message</td><td style="padding:6px 0"><em>${message}</em></td></tr>
        <tr><td style="padding:6px 12px 6px 0;color:#6b7280">Source</td><td style="padding:6px 0">General Contact</td></tr>
      </table>`,
      email,
    ),
  ]);
  results.forEach((r, i) => { if (r.status === "rejected") console.error(`[api/forms/general-contact] email[${i}] failed:`, r.reason); });

  return NextResponse.json({ success: true }, { status: 200 });
}
