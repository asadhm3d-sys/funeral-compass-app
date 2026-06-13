import { StepShell } from "./StepShell";
import { Field, Section } from "./Field";
import { Pill, YesNo } from "./Pill";
import { Input } from "@/components/ui/input";
import { useLang } from "@/lib/i18n";
import { WizardState } from "@/types/wizard";

interface Props {
  state: WizardState;
  update: (p: Partial<WizardState>) => void;
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
}



type Mode = "known" | "local" | "region" | null;

export const ObituaryStep = (p: Props) => {
  const { t } = useLang();

  const renderModeBlock = (
    mode: "before" | "after",
    modeValue: Mode,
    whereValue: string,
  ) => {
    const knows = modeValue === "known" ? true : modeValue === "local" || modeValue === "region" ? false : null;
    const setMode = (m: Mode) =>
      p.update(mode === "before" ? { obituaryBeforeMode: m } : { obituaryAfterMode: m });
    const setWhere = (v: string) =>
      p.update(mode === "before" ? { obituaryBeforeWhere: v } : { obituaryAfterWhere: v });

    return (
      <>
        <Field label={t("ob_knowsQ")}>
          <YesNo
            value={knows}
            onChange={(v) => {
              if (v === true) setMode("known");
              else if (v === false) setMode(modeValue === "region" ? "region" : "local");
              else setMode(null);
            }}
          />
        </Field>
        {knows === true && (
          <Field label={t("ob_papers")} hint={t("ob_papersHint")}>
            <Input
              value={whereValue}
              onChange={(e) => setWhere(e.target.value)}
              placeholder={t("ob_papersPh")}
            />
          </Field>
        )}
        {knows === false && (
          <Field label={t("ob_whereLabel")}>
            <div className="flex flex-wrap gap-2">
              <Pill active={modeValue === "local"} onClick={() => setMode("local")}>
                {t("ob_local")}
              </Pill>
              <Pill active={modeValue === "region"} onClick={() => setMode("region")}>
                {t("ob_region")}
              </Pill>
            </div>
          </Field>
        )}
      </>
    );
  };

  return (
    <StepShell
      title={t("ob_title")}
      subtitle={t("ob_subtitle")}
      onBack={p.onBack}
      onNext={p.onNext}
      onSkip={p.onSkip}
    >
      <div className="space-y-5">

        <Section title={t("ob_before")} description={t("ob_beforeDesc")}>
          <Field label={t("ob_publishBeforeQ")}>
            <YesNo value={p.state.obituaryBefore} onChange={(v) => p.update({ obituaryBefore: v })} />
          </Field>
          {p.state.obituaryBefore && (
            <>
              {renderModeBlock("before", p.state.obituaryBeforeMode, p.state.obituaryBeforeWhere)}
              <Field label={t("ob_includeDateQ")}>
                <YesNo
                  value={p.state.obituaryBeforeIncludeDate}
                  onChange={(v) => p.update({ obituaryBeforeIncludeDate: v })}
                />
              </Field>
            </>
          )}
        </Section>

        <Section title={t("ob_after")} description={t("ob_afterDesc")}>
          <Field label={t("ob_publishAfterQ")}>
            <YesNo value={p.state.obituaryAfter} onChange={(v) => p.update({ obituaryAfter: v })} />
          </Field>
          {p.state.obituaryAfter && renderModeBlock("after", p.state.obituaryAfterMode, p.state.obituaryAfterWhere)}
        </Section>
      </div>
    </StepShell>
  );
};
