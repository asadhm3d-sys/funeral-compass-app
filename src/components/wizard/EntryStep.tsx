import { Heart, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useLang } from "@/lib/i18n";
import { EntryMode, PrePlanningFor, WizardState } from "@/types/wizard";

interface EntryStepProps {
  state: WizardState;
  update: (patch: Partial<WizardState>) => void;
  onContinue: () => void;
}

export const EntryStep = ({ state, update, onContinue }: EntryStepProps) => {
  const { t } = useLang();
  const select = (mode: EntryMode) => update({ mode });
  const canContinue = state.mode !== null;

  return (
    <div className="entry-step animate-fade-in">
      <div className="entry-hero mb-10 max-w-2xl">
        <h1 className="entry-title text-3xl font-medium leading-tight text-foreground sm:text-4xl">
          {t("entry_h1")}
        </h1>
        <p className="entry-lead mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {t("entry_lead")}
        </p>
      </div>

      <div className="entry-card-grid grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => select("bereavement")}
          className={cn(
            "entry-card group flex flex-col overflow-hidden rounded-xl border bg-card text-left shadow-card transition-smooth hover:-translate-y-0.5 hover:shadow-soft",
            state.mode === "bereavement"
              ? "is-selected border-primary ring-2 ring-primary/30"
              : "border-border hover:border-primary/40"
          )}
        >
          <div className="entry-card-media aspect-[16/9] w-full overflow-hidden bg-muted">
            <img
              src="/96208bf2-975c-4e3e-b164-688db040b7e8.png"
              alt={t("entry_recentLoss")}
              loading="lazy"
              className="h-full w-full object-cover transition-smooth group-hover:scale-[1.03]"
            />
          </div>
          <div className="entry-card-content flex flex-1 flex-col gap-3 p-6">
            <div className="entry-card-icon flex h-11 w-11 items-center justify-center rounded-full text-primary bg-primary-foreground">
              <Heart className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <h3 className="entry-card-title text-lg font-medium">{t("entry_recentLoss")}</h3>
            <p className="entry-card-description text-sm leading-relaxed text-muted-foreground">{t("entry_recentLossDesc")}</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => select("preplanning")}
          className={cn(
            "entry-card group flex flex-col overflow-hidden rounded-xl border bg-card text-left shadow-card transition-smooth hover:-translate-y-0.5 hover:shadow-soft",
            state.mode === "preplanning"
              ? "is-selected border-primary ring-2 ring-primary/30"
              : "border-border hover:border-primary/40"
          )}
        >
          <div className="entry-card-media aspect-[16/9] w-full overflow-hidden bg-muted">
            <img
              src="/e34a4aeb-6cbf-4899-8501-f4150ae02bb1.png"
              alt={t("entry_preplan")}
              loading="lazy"
              className="h-full w-full object-cover transition-smooth group-hover:scale-[1.03]"
            />
          </div>
          <div className="entry-card-content flex flex-1 flex-col gap-3 p-6">
            <div className="entry-card-icon flex h-11 w-11 items-center justify-center rounded-full text-primary bg-primary-foreground">
              <Sparkles className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <h3 className="entry-card-title text-lg font-medium">{t("entry_preplan")}</h3>
            <p className="entry-card-description text-sm leading-relaxed text-muted-foreground">{t("entry_preplanDesc")}</p>
          </div>
        </button>
      </div>

      {state.mode === "bereavement" && (
        <div className="entry-detail-panel mt-8 grid animate-fade-in gap-5 rounded-xl border border-border bg-card p-6 shadow-card sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">{t("entry_nameDeceased")}</Label>
            <Input
              id="name"
              placeholder={t("optional")}
              value={state.deceasedName}
              onChange={(e) => update({ deceasedName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="loc">{t("entry_whereCurrent")}</Label>
            <Input
              id="loc"
              placeholder={t("entry_whereCurrentPh")}
              value={state.deceasedLocation}
              onChange={(e) => update({ deceasedLocation: e.target.value })}
            />
          </div>
        </div>
      )}

      {state.mode === "preplanning" && (
        <div className="entry-detail-panel mt-8 animate-fade-in space-y-5 rounded-xl border border-border bg-card p-6 shadow-card">
          <div>
            <Label className="mb-3 block">{t("entry_whoFor")}</Label>
            <div className="flex flex-wrap gap-2">
              {([
                ["self", t("entry_self")],
                ["other", t("entry_other")],
              ] as [PrePlanningFor, string][]).map(([val, label]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => update({ prePlanningFor: val })}
                  className={cn(
                  "theme-pill rounded-full border px-4 py-2 text-sm font-medium transition-smooth",
                    state.prePlanningFor === val
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-foreground hover:border-primary/40"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          {state.prePlanningFor && (
            <div className="space-y-2">
              <Label htmlFor="ppname">{t("entry_nameOptional")}</Label>
              <Input
                id="ppname"
                placeholder={state.prePlanningFor === "self" ? t("entry_yourName") : t("entry_theirName")}
                value={state.prePlanningName}
                onChange={(e) => update({ prePlanningName: e.target.value })}
              />
            </div>
          )}
        </div>
      )}

      {state.mode === "bereavement" && (
        <p className="mt-8 rounded-2xl border border-border/60 bg-muted/30 px-5 py-4 text-sm leading-relaxed text-muted-foreground">
          {t("stars_notice")}{" "}
          <Link to="/contact" className="font-medium text-primary underline-offset-4 hover:underline">
            {t("stars_contact")} →
          </Link>
        </p>
      )}

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {(["trust_master", "trust_personal", "trust_around"] as const).map((k) => (
          <div
            key={k}
            className="rounded-2xl border border-border/60 bg-card/60 px-4 py-3 text-center text-xs font-medium text-muted-foreground"
          >
            {t(k)}
          </div>
        ))}
      </div>

      <div className="entry-actions mt-10 border-t border-border pt-6">
        <Button onClick={onContinue} disabled={!canContinue} size="lg" className="w-full sm:w-auto">
          {t("entry_begin")}
        </Button>
      </div>
    </div>
  );
};
