import { NextRequest, NextResponse } from "next/server";
import { validateContactFields } from "@/lib/validation";
import { upsertLead, addLeadNote } from "@/lib/leads";
import { sendConfirmation, notifyMarketer } from "@/lib/email";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, phone, courseInterest, consent } = body ?? {};

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
    }, 2);

    await addLeadNote(lead.id, `Course inquiry — Course of interest: ${courseInterest ?? "Not specified"}`);
  } catch (err) {
    console.error("[api/forms/course-inquiry]", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }

  Promise.all([
    sendConfirmation({
      to: email,
      name,
      subject: "CYVANT — We received your course inquiry",
      bodyHtml: `<p>Hi ${name},</p><p>Thanks for your interest in <strong>${courseInterest ?? "our courses"}</strong>. We'll be in touch within 24 hours.</p><p>— The CYVANT Team</p>`,
    }),
    notifyMarketer(
      `New course inquiry: ${name}`,
      `<p><strong>${name}</strong> (${email}) inquired about: ${courseInterest ?? "unspecified"}</p>`
    ),
  ]).catch((err) => console.error("[api/forms/course-inquiry] email", err));

  return NextResponse.json({ success: true }, { status: 200 });
}
