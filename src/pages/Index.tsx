import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/wizard/Logo";
import { LanguageSwitcher, useLang } from "@/lib/i18n";
import { Progress } from "@/components/wizard/Progress";
import { EntryStep } from "@/components/wizard/EntryStep";
import { FuneralTypeStep } from "@/components/wizard/FuneralTypeStep";
import { FinalGoodbyeStep } from "@/components/wizard/FinalGoodbyeStep";
import { CeremonyOutlineStep } from "@/components/wizard/CeremonyOutlineStep";
import { MainCeremonyStep } from "@/components/wizard/MainCeremonyStep";
import { SubCeremonyStep } from "@/components/wizard/SubCeremonyStep";
import { CoffinUrnStep } from "@/components/wizard/CoffinUrnStep";
import { GraveDetailsStep } from "@/components/wizard/GraveDetailsStep";
import { ObituaryStep } from "@/components/wizard/ObituaryStep";
import { SympathyStep } from "@/components/wizard/SympathyStep";
import { AssistanceStep } from "@/components/wizard/AssistanceStep";
import { SummaryStep } from "@/components/wizard/SummaryStep";
import { initialState, WizardState, buildSteps, StepId } from "@/types/wizard";
import { applyWithCascade } from "@/lib/wizardCascade";
import { toast } from "sonner";
import { EmergencyHelp } from "@/components/EmergencyHelp";


const STORAGE_KEY = "funeral-compass:v3";

const Index = () => {
  const { t } = useLang();
  const [hydrated, setHydrated] = useState(false);
  const [step, setStep] = useState(0);
  const [state, setState] = useState<WizardState>(initialState);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { step?: number; state?: WizardState };
        if (parsed.state) setState({ ...initialState, ...parsed.state });
        if (typeof parsed.step === "number") setStep(Math.max(0, parsed.step));
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  const steps = useMemo(() => buildSteps(state), [state]);
  const labels = steps.map((s) => t(`step_${s.id}` as never));
  const totalSteps = steps.length;
  const safeStep = Math.min(step, totalSteps - 1);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ step: safeStep, state }));
    } catch {
      // ignore
    }
  }, [safeStep, state, hydrated]);

  const update = (patch: Partial<WizardState>) =>
    setState((s) => {
      const { next, clearedLabels } = applyWithCascade(s, patch);
      if (clearedLabels.length > 0) {
        const unique = Array.from(new Set(clearedLabels));
        const preview = unique.slice(0, 3).join(", ");
        const more = unique.length > 3 ? t("cleared_more", { n: unique.length - 3 }) : "";
        toast(t("cleared_title"), {
          description: t("cleared_desc", { preview, more }),
        });
      }
      return next;
    });
  const goNext = () => setStep((s) => Math.min(s + 1, totalSteps - 1));
  const goBack = () => setStep((s) => Math.max(s - 1, 0));
  const restart = () => {
    setState(initialState);
    setStep(0);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const stepProps = { state, update, onBack: goBack, onNext: goNext, onSkip: goNext };
  const currentId: StepId = steps[safeStep]?.id ?? "intro";
  const summaryIndex = steps.findIndex((s) => s.id === "summary");

  return (
    <div className="app-shell min-h-screen bg-gradient-warm">
      <header className="app-header border-b border-border/60 bg-background/70 backdrop-blur-sm">
        <div className="app-header-inner container flex h-16 items-center justify-between gap-3">
          <Logo />
          <div className="flex items-center gap-3">
            {currentId !== "intro" && currentId !== "summary" && summaryIndex >= 0 && (
              <button
                type="button"
                onClick={() => setStep(summaryIndex)}
                className="text-sm font-medium text-muted-foreground transition-smooth hover:text-primary"
              >
                {t("viewSummary")}
              </button>
            )}
            <Link
              to="/plans"
              className="text-sm font-medium text-muted-foreground transition-smooth hover:text-primary"
            >
              {t("nav_myPlans")}
            </Link>
            <Link
              to="/account"
              className="text-sm font-medium text-muted-foreground transition-smooth hover:text-primary"
            >
              {t("nav_account")}
            </Link>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="app-main container max-w-5xl py-8 sm:py-12">
        {currentId !== "intro" && currentId !== "summary" && (
          <div className="app-progress mb-10">
            <Progress current={safeStep} total={totalSteps} labels={labels} />
          </div>
        )}

        {currentId === "intro" && <EntryStep state={state} update={update} onContinue={goNext} />}
        {currentId === "funeralType" && <FuneralTypeStep {...stepProps} />}
        {currentId === "finalGoodbye" && <FinalGoodbyeStep {...stepProps} />}
        {currentId === "ceremonyOutline" && <CeremonyOutlineStep {...stepProps} />}
        {currentId === "mainCeremony" && <MainCeremonyStep {...stepProps} />}
        {currentId === "subCeremony" && <SubCeremonyStep {...stepProps} />}
        {currentId === "coffinUrn" && <CoffinUrnStep {...stepProps} />}
        {currentId === "grave" && <GraveDetailsStep {...stepProps} />}
        {currentId === "obituary" && <ObituaryStep {...stepProps} />}
        {currentId === "sympathy" && <SympathyStep {...stepProps} />}
        {currentId === "assistance" && <AssistanceStep {...stepProps} />}
        {currentId === "summary" && (
          <SummaryStep state={state} onBack={goBack} onEdit={(i) => setStep(i)} onRestart={restart} />
        )}
      </main>

      <EmergencyHelp />

      <footer className="app-footer border-t border-border/60 py-6">
        <div className="container flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between">
          <span className="text-xs text-muted-foreground">
            {t("footer")}
          </span>
          <nav className="flex flex-wrap items-center gap-4 text-xs">
            <Link
              to="/contact"
              className="text-muted-foreground transition-smooth hover:text-primary"
            >
              {t("nav_contact")}
            </Link>
            <Link
              to="/about"
              className="text-muted-foreground transition-smooth hover:text-primary"
            >
              {t("nav_about")}
            </Link>
            <Link
              to="/impressum"
              className="text-muted-foreground transition-smooth hover:text-primary"
            >
              {t("nav_impressum")}
            </Link>
            <Link
              to="/datenschutz"
              className="text-muted-foreground transition-smooth hover:text-primary"
            >
              {t("nav_datenschutz")}
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default Index;
