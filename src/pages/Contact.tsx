import { useState } from "react";
import { StaticPageLayout } from "@/components/StaticPageLayout";
import { useLang } from "@/lib/i18n";

type Status = "idle" | "sending" | "success" | "error" | "rate-limited";

export const Contact = () => {
  const { t, lang } = useLang();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [formStartedAt] = useState(() => Date.now());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/send-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, lang, honeypot, formStartedAt }),
      });
      if (res.status === 429) {
        setStatus("rate-limited");
        return;
      }
      const json = await res.json() as { ok: boolean };
      setStatus(json.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <StaticPageLayout>
      <div className="mx-auto max-w-3xl">
        <h1 className="entry-title mb-4 text-foreground">{t("contact_title")}</h1>
        <p className="entry-lead mb-10 text-muted-foreground">{t("contact_lead")}</p>

        <div className="theme-section entry-card rounded-3xl border border-border/60 bg-card/80 p-8 backdrop-blur-sm">
          {status === "success" ? (
            <p className="text-sm leading-relaxed text-foreground">{t("contact_form_success")}</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Honeypot field: hidden from real users, bots tend to fill every field. */}
              <div className="absolute -left-[9999px]" aria-hidden="true">
                <label htmlFor="company">Company</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  {t("contact_form_name")}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  {t("contact_form_email")}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  {t("contact_form_message")}
                </label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                />
              </div>

              {status === "error" && (
                <p className="text-sm text-destructive">{t("contact_form_error")}</p>
              )}
              {status === "rate-limited" && (
                <p className="text-sm text-destructive">{t("contact_form_rate_limited")}</p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-smooth hover:opacity-90 disabled:opacity-50"
              >
                {status === "sending" ? t("contact_form_sending") : t("contact_form_submit")}
              </button>
            </form>
          )}
        </div>
      </div>
    </StaticPageLayout>
  );
};

export default Contact;
