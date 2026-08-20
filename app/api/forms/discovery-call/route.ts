/**
 * @jest-environment node
 */
import { NextRequest, NextResponse } from "next/server";
import { validateContactFields } from "@/lib/validation";
import { upsertLead, addLeadNote } from "@/lib/leads";
import { sendConfirmation, notifyMarketer } from "@/lib/email";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, phone, consent } = body ?? {};

  const errors = validateContactFields({ name: name ?? "", email: email ?? "", phone, consent: !!consent });
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL ?? "";

  try {
    const lead = await upsertLead({
      name,
      email,
      phone,
      leadSource: "discovery_call",
    }, 3);

    await addLeadNote(lead.id, "Discovery call request via website");
  } catch (err) {
    console.error("[api/forms/discovery-call]", err);
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }

  const results = await Promise.allSettled([
    sendConfirmation({
      to: email,
      name,
      subject: "CYVANT: Let's book your discovery call",
      bodyHtml: `<p>Hi ${name},</p><p>We received your request for a discovery call. Use the link below to pick a time that works for you:</p>${calendlyUrl ? `<p><a href="${calendlyUrl}">Book your slot →</a></p>` : ""}<p>If you have any questions in the meantime, just reply to this email.</p><p>The CYVANT Team</p>`,
    }),
    notifyMarketer(
      `New discovery call request from ${name}`,
      `<table style="font-size:14px;color:#1a1a1a;border-collapse:collapse;width:100%">
        <tr><td style="padding:6px 12px 6px 0;color:#6b7280;white-space:nowrap">Name</td><td style="padding:6px 0"><strong>${name}</strong></td></tr>
        <tr><td style="padding:6px 12px 6px 0;color:#6b7280">Email</td><td style="padding:6px 0"><a href="mailto:${email}" style="color:#6d28d9">${email}</a></td></tr>
        ${phone ? `<tr><td style="padding:6px 12px 6px 0;color:#6b7280">Phone</td><td style="padding:6px 0">${phone}</td></tr>` : ""}
        <tr><td style="padding:6px 12px 6px 0;color:#6b7280">Source</td><td style="padding:6px 0">Discovery Call Request</td></tr>
      </table>`,
      email,
    ),
  ]);
  results.forEach((r, i) => { if (r.status === "rejected") console.error(`[api/forms/discovery-call] email[${i}] failed:`, r.reason); });

  return NextResponse.json({ success: true }, { status: 200 });
}
