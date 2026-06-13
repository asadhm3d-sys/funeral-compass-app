import { StepShell } from "./StepShell";
import { Section } from "./Field";
import { YesNo } from "./Pill";
import { useLang } from "@/lib/i18n";
import { WizardState } from "@/types/wizard";

interface Props {
  state: WizardState;
  update: (p: Partial<WizardState>) => void;
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
}

export const AssistanceStep = (p: Props) => {
  const { t } = useLang();
  return (
    <StepShell
      title={t("as_title")}
      subtitle={t("as_subtitle")}
      onBack={p.onBack}
      onNext={p.onNext}
      onSkip={p.onSkip}
      nextLabel={t("as_seeSummary")}
    >
      <div className="space-y-5">
        <div className="rounded-xl border border-border bg-primary-soft/40 p-5 text-sm leading-relaxed text-foreground/80">
          {t("as_intro")}
        </div>
        <Section title={t("as_q")}>
          <YesNo value={p.state.assistanceWanted} onChange={(v) => p.update({ assistanceWanted: v })} />
          {p.state.assistanceWanted === true && (
            <p className="mt-3 rounded-lg border border-primary/30 bg-primary-soft/40 p-3 text-sm text-foreground/80">
              {t("as_contact")}
            </p>
          )}
        </Section>
      </div>
    </StepShell>
  );
};
