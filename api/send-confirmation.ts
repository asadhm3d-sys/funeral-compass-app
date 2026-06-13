import { Resend } from "resend";

export const config = { runtime: "edge" };

interface BreakdownLine {
  label: string;
  amount: number;
  estimated: boolean;
}

interface Body {
  email: string;
  name: string;
  reference: string;
  lang: "en" | "de";
  breakdown: BreakdownLine[];
  total: number;
  office?: string;
}

function formatEUR(n: number, de: boolean) {
  return new Intl.NumberFormat(de ? "de-DE" : "en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

function buildHtml(body: Body): string {
  const { name, reference, lang, breakdown, total, office } = body;
  const de = lang === "de";

  const rows = breakdown
    .map(
      (l) => `
      <tr>
        <td style="padding:7px 0;color:#374151;font-size:14px;border-bottom:1px solid #f3f4f6;">
          ${l.label}${l.estimated ? " *" : ""}
        </td>
        <td style="padding:7px 0;text-align:right;color:#374151;font-size:14px;border-bottom:1px solid #f3f4f6;white-space:nowrap;">
          ${formatEUR(l.amount, de)}
        </td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="${lang}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:32px 16px;background:#f5f4f2;font-family:system-ui,-apple-system,sans-serif;">
  <div style="max-width:560px;margin:0 auto;">

    <div style="background:#5c4a3a;border-radius:12px 12px 0 0;padding:28px 32px;">
      <p style="margin:0 0 6px;color:#c8b8a8;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;">
        Funeral Compass
      </p>
      <h1 style="margin:0;color:#fff;font-size:20px;font-weight:600;line-height:1.3;">
        ${de ? "Ihre Planung ist bei uns eingegangen" : "Your plan has been received"}
      </h1>
    </div>

    <div style="background:#fff;padding:32px;border-radius:0 0 12px 12px;box-shadow:0 2px 8px rgba(0,0,0,0.06);">

      <p style="margin:0 0 20px;color:#374151;font-size:15px;">
        ${de ? `Guten Tag ${name},` : `Dear ${name},`}
      </p>
      <p style="margin:0 0 28px;color:#6b7280;font-size:14px;line-height:1.7;">
        ${de
          ? "Vielen Dank für Ihre Planung. Wir haben Ihre Anfrage erhalten und melden uns innerhalb von 24 Stunden bei Ihnen."
          : "Thank you for planning with us. We have received your request and will be in touch within 24 hours."}
      </p>

      <div style="background:#f9f7f5;border-left:4px solid #5c4a3a;border-radius:0 8px 8px 0;padding:16px 20px;margin-bottom:28px;">
        <p style="margin:0 0 4px;color:#9ca3af;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;">
          ${de ? "Ihre Referenznummer" : "Your reference number"}
        </p>
        <p style="margin:0;color:#1f2937;font-size:24px;font-weight:700;letter-spacing:0.06em;">
          ${reference}
        </p>
        ${office
          ? `<p style="margin:8px 0 0;color:#6b7280;font-size:13px;">
              ${de ? "Gewünschter Standort" : "Preferred office"}: <strong>${office}</strong>
             </p>`
          : ""}
      </div>

      <h2 style="margin:0 0 14px;color:#1f2937;font-size:15px;font-weight:600;">
        ${de ? "Übersicht Ihrer Auswahl" : "Plan summary"}
      </h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:10px;">
        ${rows}
        <tr>
          <td style="padding:12px 0 0;color:#1f2937;font-size:15px;font-weight:700;">
            ${de ? "Geschätzter Gesamtbetrag" : "Estimated total"}
          </td>
          <td style="padding:12px 0 0;text-align:right;color:#1f2937;font-size:15px;font-weight:700;white-space:nowrap;">
            ${formatEUR(total, de)}
          </td>
        </tr>
      </table>
      <p style="margin:0 0 28px;color:#9ca3af;font-size:12px;">
        * ${de
          ? "Schätzpreis — abhängig von Ihrer endgültigen Auswahl"
          : "Estimated price — subject to your final selection"}
      </p>

      <div style="border-top:1px solid #f3f4f6;padding-top:20px;">
        <p style="margin:0;color:#9ca3af;font-size:12px;line-height:1.6;">
          ${de
            ? "Dies ist eine automatische Bestätigung Ihrer Demo-Planung mit Funeral Compass."
            : "This is an automated confirmation of your demo plan with Funeral Compass."}
        </p>
      </div>
    </div>

  </div>
</body>
</html>`;
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

  const { email, name, reference, lang = "en" } = body;
  if (!email || !name || !reference) {
    return new Response(JSON.stringify({ ok: false, error: "Missing required fields" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const de = lang === "de";
  const from = process.env.RESEND_FROM ?? "Funeral Compass <onboarding@resend.dev>";
  const subject = de
    ? `Ihre Bestattungsplanung – Referenz ${reference}`
    : `Your funeral plan – Reference ${reference}`;

  const resend = new Resend(apiKey);

  try {
    await resend.emails.send({ from, to: email, subject, html: buildHtml(body) });
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[send-confirmation]", err);
    return new Response(JSON.stringify({ ok: false }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
