import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { StaticPageLayout } from "@/components/StaticPageLayout";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useLang } from "@/lib/i18n";
import { getRepository, useAuth, useOwner } from "@/lib/plans";
import type { SavedPlan } from "@/lib/plans/types";
import { toast } from "sonner";
import { Copy, FolderOpen, Trash2 } from "lucide-react";

const WIZARD_KEY = "funeral-compass:v3";

export const MyPlans = () => {
  const { t, lang } = useLang();
  const { session } = useAuth();
  const owner = useOwner();
  const navigate = useNavigate();
  const [plans, setPlans] = useState<SavedPlan[]>([]);
  const repo = getRepository();

  const refresh = useCallback(() => {
    repo.list(owner).then(setPlans).catch(() => setPlans([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [owner]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const openPlan = (plan: SavedPlan) => {
    try {
      localStorage.setItem(WIZARD_KEY, JSON.stringify({ step: 0, state: plan.state }));
    } catch {
      // ignore
    }
    toast(t("mp_opened"), { description: t("mp_openedDesc", { name: plan.name }) });
    navigate("/");
  };

  const duplicatePlan = async (plan: SavedPlan) => {
    await repo.create({ name: plan.name + t("mp_copySuffix"), state: plan.state, owner });
    refresh();
  };

  const deletePlan = async (plan: SavedPlan) => {
    await repo.remove(plan.id);
    refresh();
  };

  const statusKey = (s: SavedPlan["status"]) =>
    s === "submitted" ? "mp_status_submitted" : s === "deposit_confirmed" ? "mp_status_deposit_confirmed" : "mp_status_draft";

  const statusClasses = (s: SavedPlan["status"]) =>
    s === "submitted"
      ? "bg-primary/10 text-primary"
      : s === "deposit_confirmed"
        ? "bg-emerald-600/10 text-emerald-700"
        : "bg-muted text-muted-foreground";

  return (
    <StaticPageLayout>
      <div className="mx-auto max-w-3xl">
        <h1 className="entry-title mb-4 text-foreground">{t("mp_title")}</h1>
        <p className="entry-lead mb-8 text-muted-foreground">{t("mp_lead")}</p>

        {!session && (
          <p className="mb-6 text-sm text-muted-foreground">
            {t("mp_signInHint")}{" "}
            <Link to="/account" className="font-medium text-primary underline-offset-4 hover:underline">
              {t("nav_account")} →
            </Link>
          </p>
        )}

        {plans.length === 0 ? (
          <div className="theme-section entry-card rounded-3xl border border-dashed border-border bg-card/60 p-10 text-center text-muted-foreground">
            {t("mp_empty")}
          </div>
        ) : (
          <ul className="space-y-4">
            {plans.map((plan) => (
              <li
                key={plan.id}
                className="theme-section entry-card flex flex-col gap-4 rounded-3xl border border-border/60 bg-card/80 p-6 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-medium text-foreground">{plan.name}</h2>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClasses(plan.status)}`}>
                      {t(statusKey(plan.status) as never)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t("mp_updated")}: {new Date(plan.updatedAt).toLocaleString(lang === "de" ? "de-DE" : "en-IE")}
                    {plan.submission ? ` · ${plan.submission.reference}` : ""}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button size="sm" onClick={() => openPlan(plan)}>
                    <FolderOpen className="mr-1.5 h-4 w-4" />
                    {t("mp_open")}
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => void duplicatePlan(plan)}>
                    <Copy className="mr-1.5 h-4 w-4" />
                    {t("mp_duplicate")}
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <Trash2 className="mr-1.5 h-4 w-4" />
                        {t("mp_delete")}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t("mp_deleteQ")}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {t("mp_deleteDesc", { name: plan.name })}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t("sv_cancel")}</AlertDialogCancel>
                        <AlertDialogAction onClick={() => void deletePlan(plan)}>
                          {t("mp_delete")}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </StaticPageLayout>
  );
};

export default MyPlans;
