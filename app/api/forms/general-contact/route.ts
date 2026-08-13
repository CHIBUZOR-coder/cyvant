import { NextRequest, NextResponse } from "next/server";
import { validateContactFields } from "@/lib/validation";
import { upsertContact, addNote } from "@/lib/hubspot";
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
    const contact = await upsertContact({
      email,
      firstname: name,
      hs_lead_status: "NEW",
      lifecyclestage: "lead",
    });

    await addNote({
      body: `General contact message:\n${message}`,
      associations: { contactId: Number(contact.id) },
    });

    await Promise.all([
      sendConfirmation({
        to: email,
        name,
        subject: "CYVANT — We got your message",
        bodyHtml: `<p>Hi ${name},</p><p>Thanks for reaching out. We'll reply within 24 hours.</p><p>— The CYVANT Team</p>`,
      }),
      notifyMarketer(
        `New general contact: ${name}`,
        `<p><strong>${name}</strong> (${email}) sent a message:</p><blockquote>${message}</blockquote>`
      ),
    ]);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[api/forms/general-contact]", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
