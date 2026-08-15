import { NextRequest, NextResponse } from "next/server";
import { validateContactFields } from "@/lib/validation";
import { upsertLead, addLeadNote } from "@/lib/leads";
import { sendConfirmation, notifyMarketer } from "@/lib/email";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, company, serviceInterest, consent } = body ?? {};

  const errors = validateContactFields({ name: name ?? "", email: email ?? "", consent: !!consent });
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  try {
    const lead = await upsertLead({
      name,
      email,
      company: company ?? "",
      leadSource: "service_inquiry",
      serviceInterest: serviceInterest ?? "",
    }, 1);

    await addLeadNote(lead.id, `Services lead — Service: ${serviceInterest ?? "Not specified"} | Company: ${company ?? "N/A"}`);

    await Promise.all([
      sendConfirmation({
        to: email,
        name,
        subject: "CYVANT — Service inquiry received",
        bodyHtml: `<p>Hi ${name},</p><p>We received your inquiry about <strong>${serviceInterest ?? "our services"}</strong>. A team member will be in touch shortly.</p><p>— The CYVANT Team</p>`,
      }),
      notifyMarketer(
        `New Services lead: ${name}`,
        `<p><strong>${name}</strong> (${email}) — Company: ${company ?? "N/A"}</p><p>Service: ${serviceInterest ?? "unspecified"}</p>`
      ),
    ]);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[api/forms/service-inquiry]", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
