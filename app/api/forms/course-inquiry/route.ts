import { NextRequest, NextResponse } from "next/server";
import { validateContactFields } from "@/lib/validation";
import { upsertLead, addLeadNote } from "@/lib/leads";
import { sendConfirmation, notifyMarketer } from "@/lib/email";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, phone, courseInterest, consent, photoUrl } = body ?? {};

  const errors = validateContactFields({ name: name ?? "", email: email ?? "", phone, consent: !!consent });
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  try {
    const lead = await upsertLead({
      name,
      email,
      phone,
      leadSource: "course_inquiry",
      courseInterest: courseInterest ?? "",
      photoUrl: photoUrl ?? undefined,
    }, 2);

    await addLeadNote(lead.id, `Course inquiry: Course of interest: ${courseInterest ?? "Not specified"}`);
  } catch (err) {
    console.error("[api/forms/course-inquiry]", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }

  const results = await Promise.allSettled([
    sendConfirmation({
      to: email,
      name,
      subject: "CYVANT: We received your course inquiry",
      bodyHtml: `<p>Hi ${name},</p><p>Thanks for your interest in <strong>${courseInterest ?? "our courses"}</strong>. We'll be in touch within 24 hours.</p><p>The CYVANT Team</p>`,
    }),
    notifyMarketer(
      `New course inquiry from ${name}`,
      `<table style="font-size:14px;color:#1a1a1a;border-collapse:collapse;width:100%">
        <tr><td style="padding:6px 12px 6px 0;color:#6b7280;white-space:nowrap">Name</td><td style="padding:6px 0"><strong>${name}</strong></td></tr>
        <tr><td style="padding:6px 12px 6px 0;color:#6b7280">Email</td><td style="padding:6px 0"><a href="mailto:${email}" style="color:#6d28d9">${email}</a></td></tr>
        ${phone ? `<tr><td style="padding:6px 12px 6px 0;color:#6b7280">Phone</td><td style="padding:6px 0">${phone}</td></tr>` : ""}
        <tr><td style="padding:6px 12px 6px 0;color:#6b7280">Course Interest</td><td style="padding:6px 0">${courseInterest ?? "Not specified"}</td></tr>
        <tr><td style="padding:6px 12px 6px 0;color:#6b7280">Source</td><td style="padding:6px 0">Course Inquiry</td></tr>
      </table>`,
      email,
    ),
  ]);
  results.forEach((r, i) => { if (r.status === "rejected") console.error(`[api/forms/course-inquiry] email[${i}] failed:`, r.reason); });

  return NextResponse.json({ success: true }, { status: 200 });
}
