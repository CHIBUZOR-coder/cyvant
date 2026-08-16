import { NextRequest, NextResponse } from "next/server";
import { isValidEmail, validateContactFields } from "@/lib/validation";
import { upsertLead, addLeadNote } from "@/lib/leads";
import { sendConfirmation, notifyMarketer } from "@/lib/email";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, phone, qualifyingAnswer, consent } = body ?? {};

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

    await addLeadNote(lead.id, `Webinar registration — Qualifying answer: ${qualifyingAnswer}`);
  } catch (err) {
    console.error("[api/forms/webinar]", err);
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }

  Promise.all([
    sendConfirmation({
      to: email,
      name,
      subject: "You're registered for the CYVANT webinar!",
      bodyHtml: `<p>Hi ${name},</p><p>You're registered. We'll send the webinar link closer to the date.</p><p>— The CYVANT Team</p>`,
    }),
    notifyMarketer(
      `New webinar registration: ${name}`,
      `<p><strong>${name}</strong> (${email}) registered for the webinar.</p><p>Qualifying answer: ${qualifyingAnswer}</p>`
    ),
  ]).catch((err) => console.error("[api/forms/webinar] email", err));

  return NextResponse.json({ success: true }, { status: 200 });
}
