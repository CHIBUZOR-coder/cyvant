export const dynamic = "force-dynamic";

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

    await addLeadNote(lead.id, `Services lead. Service: ${serviceInterest ?? "Not specified"} | Company: ${company ?? "N/A"}`);
  } catch (err) {
    console.error("[api/forms/service-inquiry]", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }

  const results = await Promise.allSettled([
    sendConfirmation({
      to: email,
      name,
      subject: "CYVANT: Service inquiry received",
      bodyHtml: `<p>Hi ${name},</p><p>We received your inquiry about <strong>${serviceInterest ?? "our services"}</strong>. A team member will be in touch shortly.</p><p>The CYVANT Team</p>`,
    }),
    notifyMarketer(
      `New service inquiry from ${name}`,
      `<table style="font-size:14px;color:#1a1a1a;border-collapse:collapse;width:100%">
        <tr><td style="padding:6px 12px 6px 0;color:#6b7280;white-space:nowrap">Name</td><td style="padding:6px 0"><strong>${name}</strong></td></tr>
        <tr><td style="padding:6px 12px 6px 0;color:#6b7280">Email</td><td style="padding:6px 0"><a href="mailto:${email}" style="color:#6d28d9">${email}</a></td></tr>
        ${company ? `<tr><td style="padding:6px 12px 6px 0;color:#6b7280">Company</td><td style="padding:6px 0">${company}</td></tr>` : ""}
        <tr><td style="padding:6px 12px 6px 0;color:#6b7280">Service Interest</td><td style="padding:6px 0">${serviceInterest ?? "Not specified"}</td></tr>
        <tr><td style="padding:6px 12px 6px 0;color:#6b7280">Source</td><td style="padding:6px 0">Service Inquiry</td></tr>
      </table>`,
      email,
    ),
  ]);
  results.forEach((r, i) => { if (r.status === "rejected") console.error(`[api/forms/service-inquiry] email[${i}] failed:`, r.reason); });

  return NextResponse.json({ success: true }, { status: 200 });
}
