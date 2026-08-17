import { NextRequest, NextResponse } from "next/server";
import { isValidEmail, validateContactFields } from "@/lib/validation";
import { upsertLead, addLeadNote } from "@/lib/leads";
import { sendConfirmation, notifyMarketer } from "@/lib/email";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, phone, qualifyingAnswer, consent, webinarId, webinarTitle } = body ?? {};

  const errors = validateContactFields({ name: name ?? "", email: email ?? "", phone, consent: !!consent });
  if (!qualifyingAnswer?.trim()) errors.qualifying = "Qualifying answer is required.";
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ errors: { email: "Invalid email." } }, { status: 400 });
  }

  try {
    const lead = await upsertLead({
      name,
      email,
      phone,
      leadSource: "webinar_registration",
      qualifyingAnswer,
    }, 1);

    const noteText = [
      `Webinar registration${webinarTitle ? ` — "${webinarTitle}"` : ""}`,
      webinarId ? `Webinar ID: ${webinarId}` : null,
      `Qualifying answer: ${qualifyingAnswer}`,
    ].filter(Boolean).join(" | ");

    await addLeadNote(lead.id, noteText);
  } catch (err) {
    console.error("[api/forms/webinar]", err);
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }

  const results = await Promise.allSettled([
    sendConfirmation({
      to: email,
      name,
      subject: `You're registered${webinarTitle ? ` for "${webinarTitle}"` : " for the CYVANT webinar"}!`,
      bodyHtml: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
          <h2 style="color:#6d28d9">You're in, ${name}!</h2>
          ${webinarTitle ? `<p>You've successfully registered for <strong>${webinarTitle}</strong>.</p>` : "<p>You've successfully registered for our upcoming webinar.</p>"}
          <p>We'll send the join link closer to the date. Keep an eye on your inbox.</p>
          <br/>
          <p style="color:#6b7280;font-size:13px">— The CYVANT Team</p>
        </div>
      `,
    }),
    notifyMarketer(
      `New webinar registration from ${name}`,
      `<table style="font-size:14px;color:#1a1a1a;border-collapse:collapse;width:100%">
        <tr><td style="padding:6px 12px 6px 0;color:#6b7280;white-space:nowrap">Name</td><td style="padding:6px 0"><strong>${name}</strong></td></tr>
        <tr><td style="padding:6px 12px 6px 0;color:#6b7280">Email</td><td style="padding:6px 0"><a href="mailto:${email}" style="color:#6d28d9">${email}</a></td></tr>
        ${phone ? `<tr><td style="padding:6px 12px 6px 0;color:#6b7280">Phone</td><td style="padding:6px 0">${phone}</td></tr>` : ""}
        ${webinarTitle ? `<tr><td style="padding:6px 12px 6px 0;color:#6b7280">Webinar</td><td style="padding:6px 0">${webinarTitle}</td></tr>` : ""}
        <tr><td style="padding:6px 12px 6px 0;color:#6b7280;vertical-align:top">Qualifying Answer</td><td style="padding:6px 0"><em>${qualifyingAnswer}</em></td></tr>
        <tr><td style="padding:6px 12px 6px 0;color:#6b7280">Source</td><td style="padding:6px 0">Webinar Registration</td></tr>
      </table>`,
      email,
    ),
  ]);
  results.forEach((r, i) => { if (r.status === "rejected") console.error(`[api/forms/webinar] email[${i}] failed:`, r.reason); });

  return NextResponse.json({ success: true }, { status: 200 });
}
