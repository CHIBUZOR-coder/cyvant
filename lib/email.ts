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
    from: "CYVANT <hello@cyvant.org>",
    to,
    subject,
    html: bodyHtml,
  });
}

export async function notifyMarketer(subject: string, bodyHtml: string) {
  const notificationEmail = process.env.NOTIFICATION_EMAIL;
  if (!notificationEmail) return;

  return resendRequest("/emails", {
    from: "CYVANT Forms <forms@cyvant.org>",
    to: notificationEmail,
    subject,
    html: bodyHtml,
  });
}
