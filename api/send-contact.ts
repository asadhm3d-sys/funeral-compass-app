import { Resend } from "resend";

export const config = { runtime: "edge" };

interface Body {
  name: string;
  email: string;
  message: string;
  lang?: "en" | "de";
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME_LENGTH = 200;
const MAX_EMAIL_LENGTH = 320;
const MAX_MESSAGE_LENGTH = 5000;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ ok: false, error: "Email service not configured" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const message = body.message?.trim() ?? "";
  const lang = body.lang === "de" ? "de" : "en";

  if (!name || !email || !message) {
    return new Response(JSON.stringify({ ok: false, error: "Missing required fields" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!EMAIL_RE.test(email)) {
    return new Response(JSON.stringify({ ok: false, error: "Invalid email address" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (name.length > MAX_NAME_LENGTH || email.length > MAX_EMAIL_LENGTH || message.length > MAX_MESSAGE_LENGTH) {
    return new Response(JSON.stringify({ ok: false, error: "Input too long" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const de = lang === "de";
  const from = process.env.RESEND_FROM ?? "Funeral Compass <onboarding@resend.dev>";
  const notifyTo = process.env.RESEND_TO ?? email;
  const resend = new Resend(apiKey);

  // Notification to the funeral home
  const notifyHtml = `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:32px 16px;background:#f5f4f2;font-family:system-ui,-apple-system,sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;padding:32px;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
    <p style="margin:0 0 6px;color:#9ca3af;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;">Funeral Compass — New contact message</p>
    <h1 style="margin:0 0 24px;color:#1f2937;font-size:18px;font-weight:600;">Message from ${escapeHtml(name)}</h1>
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
      <tr><td style="padding:6px 0;color:#6b7280;font-size:13px;width:80px;">Name</td><td style="padding:6px 0;color:#1f2937;font-size:14px;">${escapeHtml(name)}</td></tr>
      <tr><td style="padding:6px 0;color:#6b7280;font-size:13px;">Email</td><td style="padding:6px 0;color:#1f2937;font-size:14px;"><a href="mailto:${escapeHtml(email)}" style="color:#5c4a3a;">${escapeHtml(email)}</a></td></tr>
    </table>
    <div style="background:#f9f7f5;border-left:4px solid #5c4a3a;border-radius:0 8px 8px 0;padding:16px 20px;">
      <p style="margin:0;color:#374151;font-size:14px;line-height:1.7;white-space:pre-wrap;">${escapeHtml(message)}</p>
    </div>
  </div>
</body></html>`;

  // Auto-reply to the visitor
  const replyHtml = `<!DOCTYPE html>
<html lang="${lang}"><head><meta charset="utf-8"></head>
<body style="margin:0;padding:32px 16px;background:#f5f4f2;font-family:system-ui,-apple-system,sans-serif;">
  <div style="max-width:560px;margin:0 auto;">
    <div style="background:#5c4a3a;border-radius:12px 12px 0 0;padding:28px 32px;">
      <p style="margin:0 0 6px;color:#c8b8a8;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;">Funeral Compass</p>
      <h1 style="margin:0;color:#fff;font-size:20px;font-weight:600;line-height:1.3;">
        ${de ? "Ihre Nachricht ist bei uns eingegangen" : "We received your message"}
      </h1>
    </div>
    <div style="background:#fff;padding:32px;border-radius:0 0 12px 12px;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
      <p style="margin:0 0 20px;color:#374151;font-size:15px;">${de ? `Guten Tag ${escapeHtml(name)},` : `Dear ${escapeHtml(name)},`}</p>
      <p style="margin:0 0 28px;color:#6b7280;font-size:14px;line-height:1.7;">
        ${de
          ? "Vielen Dank für Ihre Nachricht. Wir melden uns innerhalb von 24 Stunden bei Ihnen."
          : "Thank you for reaching out. We will get back to you within 24 hours."}
      </p>
      <div style="border-top:1px solid #f3f4f6;padding-top:20px;">
        <p style="margin:0;color:#9ca3af;font-size:12px;line-height:1.6;">
          ${de ? "Dies ist eine automatische Bestätigung." : "This is an automated confirmation."}
        </p>
      </div>
    </div>
  </div>
</body></html>`;

  const [notifyResult, replyResult] = await Promise.all([
    resend.emails.send({
      from,
      to: notifyTo,
      subject: `New contact message from ${name}`,
      html: notifyHtml,
      replyTo: email,
    }),
    resend.emails.send({
      from,
      to: email,
      subject: de ? "Ihre Nachricht an Funeral Compass" : "Your message to Funeral Compass",
      html: replyHtml,
    }),
  ]);

  const error = notifyResult.error ?? replyResult.error;
  if (error) {
    console.error("[send-contact] Resend error:", JSON.stringify(error));
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  console.log("[send-contact] sent notify:", notifyResult.data?.id, "reply:", replyResult.data?.id);
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
