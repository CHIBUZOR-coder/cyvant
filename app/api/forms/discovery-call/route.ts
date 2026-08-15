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

  try {
    const lead = await upsertLead({
      name,
      email,
      phone,
      leadSource: "discovery_call",
    }, 3);

    await addLeadNote(lead.id, "Discovery call request via website");

    const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL ?? "";

    await Promise.all([
      sendConfirmation({
        to: email,
        name,
        subject: "CYVANT — Let's book your discovery call",
        bodyHtml: `<p>Hi ${name},</p><p>We received your request for a discovery call. Use the link below to pick a time that works for you:</p>${calendlyUrl ? `<p><a href="${calendlyUrl}">Book your slot →</a></p>` : ""}<p>If you have any questions in the meantime, just reply to this email.</p><p>— The CYVANT Team</p>`,
      }),
      notifyMarketer(
        `New discovery call request: ${name}`,
        `<p><strong>${name}</strong> (${email}${phone ? `, ${phone}` : ""}) requested a discovery call.</p>`
      ),
    ]);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[api/forms/discovery-call]", err);
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}
