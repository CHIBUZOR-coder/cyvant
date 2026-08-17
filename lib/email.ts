import { db } from "@/lib/db";

interface ConfirmationEmail {
  to: string;
  name: string;
  subject: string;
  bodyHtml: string;
}

async function resendRequest(path: string, body: object) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY not configured — skipping email");
    return;
  }

  const res = await fetch(`https://api.resend.com${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend API error ${res.status}: ${err}`);
  }

  return res.json();
}

export async function sendConfirmation({ to, name, subject, bodyHtml }: ConfirmationEmail) {
  return resendRequest("/emails", {
    from: "CYVANT <admin@cyvant.org>",
    to,
    subject,
    html: bodyHtml,
  });
}

export async function sendPasswordReset({ to, name, resetUrl }: { to: string; name: string; resetUrl: string }) {
  return resendRequest("/emails", {
    from: "CYVANT Admin <admin@cyvant.org>",
    to,
    subject: "Reset your CYVANT admin password",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;">
        <p style="font-size:20px;font-weight:700;margin:0 0 8px;">Password Reset</p>
        <p style="color:#6b7280;margin:0 0 24px;">Hi ${name}, click the button below to set a new password. This link expires in 1 hour.</p>
        <a href="${resetUrl}" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-size:14px;">Reset Password</a>
        <p style="color:#9ca3af;font-size:12px;margin:24px 0 0;">If you didn't request this, ignore this email. Your password won't change.</p>
      </div>
    `,
  });
}

function adminEmailHtml(bodyHtml: string, replyTo?: string) {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#6d28d9;padding:14px 24px;border-radius:8px 8px 0 0">
        <span style="color:#ffffff;font-weight:700;font-size:15px;letter-spacing:0.5px">CYVANT — Admin Notification</span>
      </div>
      <div style="background:#ffffff;border:1px solid #e5e7eb;border-top:none;padding:24px;border-radius:0 0 8px 8px">
        ${bodyHtml}
        ${replyTo ? `<p style="margin-top:20px;font-size:13px;color:#6b7280">You can reply directly to this email to contact the lead.</p>` : ""}
        <hr style="border:none;border-top:1px solid #f3f4f6;margin:20px 0"/>
        <p style="font-size:11px;color:#9ca3af;margin:0">This is an automated admin alert from CYVANT. Do not forward.</p>
      </div>
    </div>
  `;
}

/** Sends an admin notification to every AdminUser with role = "admin" in the DB. */
export async function notifyAdmins(subject: string, bodyHtml: string, replyTo?: string) {
  const admins = await db.adminUser.findMany({
    where: { role: "admin" },
    select: { email: true },
  });

  if (admins.length === 0) {
    console.warn("[email] notifyAdmins: no admin users found in DB — skipping notification");
    return;
  }

  const to = admins.map((a) => a.email);

  return resendRequest("/emails", {
    from: "CYVANT Admin Alerts <admin@cyvant.org>",
    to,
    ...(replyTo ? { reply_to: replyTo } : {}),
    subject: `[CYVANT Admin] ${subject}`,
    html: adminEmailHtml(bodyHtml, replyTo),
  });
}

/** @deprecated Use notifyAdmins instead — reads admin emails from DB automatically. */
export async function notifyMarketer(subject: string, bodyHtml: string, replyTo?: string) {
  return notifyAdmins(subject, bodyHtml, replyTo);
}
