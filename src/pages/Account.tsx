import { useState } from "react";
import { Link } from "react-router-dom";
import { StaticPageLayout } from "@/components/StaticPageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLang } from "@/lib/i18n";
import { useAuth } from "@/lib/plans";
import { toast } from "sonner";
import { Mail, LogOut, UserRound, FolderOpen } from "lucide-react";

const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

export const Account = () => {
  const { t } = useLang();
  const { session, backend, requestMagicLink, completeLocalSignIn, signOut } = useAuth();
  const [email, setEmail] = useState("");
  const [linkRequested, setLinkRequested] = useState(false);
  const [busy, setBusy] = useState(false);

  const sendLink = async () => {
    if (!isValidEmail(email)) {
      toast(t("acc_invalidEmail"));
      return;
    }
    setBusy(true);
    try {
      await requestMagicLink(email);
      setLinkRequested(true);
      if (backend === "supabase") {
        toast(t("acc_linkSent"), { description: t("acc_linkSentDesc") });
      }
    } catch (e) {
      toast(t("sv_error"), { description: String(e) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <StaticPageLayout>
      <div className="mx-auto max-w-xl">
        <h1 className="entry-title mb-4 text-foreground">{t("acc_title")}</h1>

        {session ? (
          <div className="theme-section entry-card rounded-3xl border border-border/60 bg-card/80 p-8 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <UserRound className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm text-muted-foreground">{t("acc_signedInAs")}</p>
                <p className="font-medium text-foreground">{session.email}</p>
              </div>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              {backend === "supabase" ? t("acc_backendSupabase") : t("acc_backendLocal")}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="secondary">
                <Link to="/plans">
                  <FolderOpen className="mr-2 h-4 w-4" />
                  {t("nav_myPlans")}
                </Link>
              </Button>
              <Button variant="outline" onClick={() => void signOut()}>
                <LogOut className="mr-2 h-4 w-4" />
                {t("acc_signOut")}
              </Button>
            </div>
          </div>
        ) : (
          <div className="theme-section entry-card rounded-3xl border border-border/60 bg-card/80 p-8 backdrop-blur-sm">
            <p className="entry-lead mb-8 text-muted-foreground">{t("acc_lead")}</p>

            <label className="mb-2 block text-sm font-medium text-foreground" htmlFor="account-email">
              {t("acc_email")}
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                id="account-email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button onClick={() => void sendLink()} disabled={busy}>
                <Mail className="mr-2 h-4 w-4" />
                {t("acc_sendLink")}
              </Button>
            </div>

            {linkRequested && backend === "local" && (
              <div className="mt-6 rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-4">
                <p className="text-sm text-muted-foreground">{t("acc_demoMode")}</p>
                <Button className="mt-3" variant="secondary" onClick={() => completeLocalSignIn(email)}>
                  {t("acc_demoComplete")}
                </Button>
              </div>
            )}

            <p className="mt-6 text-xs text-muted-foreground">
              {backend === "supabase" ? t("acc_backendSupabase") : t("acc_backendLocal")}
            </p>
          </div>
        )}
      </div>
    </StaticPageLayout>
  );
};

export default Account;
