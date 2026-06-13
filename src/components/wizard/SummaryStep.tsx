import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit3, FileDown } from "lucide-react";
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
import { WizardState, calculateTotal, calculateBreakdown, formatEUR, buildSteps } from "@/types/wizard";
import { exportSummaryPdf } from "@/lib/exportPdf";
import { buildSummaryGroups } from "@/lib/wizardLabels";
import { PlanActions } from "@/components/wizard/PlanActions";
import { useLang } from "@/lib/i18n";
import { toast } from "sonner";

interface Props {
  state: WizardState;
  onBack: () => void;
  onEdit: (stepIndex: number) => void;
  onRestart: () => void;
}

export const SummaryStep = ({ state, onBack, onEdit, onRestart }: Props) => {
  const { t, lang } = useLang();
  const total = calculateTotal(state, lang);
  const steps = buildSteps(state);
  const stepIndexOf = (id: string) => steps.findIndex((s) => s.id === id);
  const groups = buildSummaryGroups(state, stepIndexOf, lang);
  const breakdown = calculateBreakdown(state, lang);

  const stepLabel = (key: string) => {
    const map: Record<string, string> = {
      base: t("step_intro"),
      funeralType: t("step_funeralType"),
      finalGoodbye: t("step_finalGoodbye"),
      mainCeremony: t("step_mainCeremony"),
      subCeremony: t("step_subCeremony"),
      coffinUrn: t("step_coffinUrn"),
      grave: t("step_grave"),
      obituary: t("step_obituary"),
      sympathy: t("step_sympathy"),
      assistance: t("step_assistance"),
    };
    return map[key] ?? key;
  };

  const grouped = breakdown.reduce<Record<string, { label: string; lines: typeof breakdown; subtotal: number }>>((acc, l) => {
    const key = l.step;
    if (!acc[key]) acc[key] = { label: stepLabel(key), lines: [], subtotal: 0 };
    acc[key].lines.push(l);
    acc[key].subtotal += l.amount;
    return acc;
  }, {});

  const subjectName = state.deceasedName || state.prePlanningName;

  return (
    <div className="animate-fade-in">
      <header className="mb-8 max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-wide text-primary">{t("su_yourPlan")}</p>
        <h1 className="mt-2 text-2xl font-medium text-foreground sm:text-3xl">
          {subjectName ? t("su_titleFor", { name: subjectName }) : t("su_titleGeneric")}
        </h1>
        <p className="mt-2 text-base leading-relaxed text-muted-foreground">{t("su_lead")}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="space-y-4">
          {groups.length === 0 && (
            <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
              {t("su_empty")}
            </div>
          )}
          {groups.map((g) => (
            <div key={g.title} className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
              <div className="flex items-center justify-between border-b border-border bg-muted/40 px-5 py-3">
                <h2 className="text-sm font-medium text-foreground">{g.title}</h2>
                {g.stepIndex >= 0 && (
                  <Button variant="ghost" size="sm" onClick={() => onEdit(g.stepIndex)} className="gap-1.5">
                    <Edit3 className="h-3.5 w-3.5" /> {t("edit")}
                  </Button>
                )}
              </div>
              <dl className="divide-y divide-border">
                {g.rows.map((r, i) => (
                  <div key={i} className="flex flex-col gap-1 px-5 py-3 sm:flex-row sm:items-baseline sm:gap-6">
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground sm:w-44 sm:shrink-0">
                      {r.label}
                    </dt>
                    <dd className="text-sm leading-relaxed text-foreground">{r.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}

          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
            <div className="border-b border-border bg-muted/40 px-5 py-3">
              <h2 className="text-sm font-medium text-foreground">{t("su_breakdown")}</h2>
            </div>
            <div className="divide-y divide-border">
              {Object.entries(grouped).map(([key, g]) => (
                <div key={key} className="px-5 py-3">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-sm font-medium text-foreground">{g.label}</h3>
                    <span className="text-sm font-semibold text-foreground">{formatEUR(g.subtotal, lang)}</span>
                  </div>
                  <ul className="mt-1 space-y-0.5">
                    {g.lines.map((l, i) => (
                      <li key={i} className="flex items-baseline justify-between gap-3 text-xs text-muted-foreground">
                        <span>
                          {l.label}
                          {l.estimated && <span className="ml-1 italic">· {t("su_estimated")}</span>}
                        </span>
                        <span>{formatEUR(l.amount, lang)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <p className="px-2 text-xs italic leading-relaxed text-muted-foreground">{t("su_disclaimer")}</p>
        </section>

        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-xl border border-border bg-gradient-hero p-6 shadow-soft">
            <p className="text-sm font-medium text-foreground/70">{t("su_estTotal")}</p>
            <p className="mt-2 text-4xl font-semibold tracking-tight text-foreground">
              {formatEUR(total, lang)}
            </p>
            <p className="mt-3 text-xs leading-relaxed text-foreground/60">{t("su_estNote")}</p>
            <div className="mt-5 space-y-2">
              <Button
                className="w-full gap-2"
                size="lg"
                onClick={async () => {
                  try {
                    await exportSummaryPdf(state, lang);
                    toast(t("su_planDownloaded"), { description: t("su_planDownloadedDesc") });
                  } catch {
                    toast.error(t("su_pdfError"), { description: t("su_pdfErrorDesc") });
                  }
                }}
              >
                <FileDown className="h-4 w-4" /> {t("su_downloadPdf")}
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full">{t("su_startOver")}</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t("su_startOverQ")}</AlertDialogTitle>
                    <AlertDialogDescription>{t("su_startOverDesc")}</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                    <AlertDialogAction onClick={onRestart}>{t("su_yesStartOver")}</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <PlanActions state={state} />
            </div>
          </div>
        </aside>
      </div>

      <footer className="mt-10 border-t border-border pt-6">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> {t("back")}
        </Button>
      </footer>
    </div>
  );
};
