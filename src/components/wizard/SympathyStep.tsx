import { StepShell } from "./StepShell";
import { Field, Section } from "./Field";
import { Pill, YesNo } from "./Pill";
import { useLang } from "@/lib/i18n";
import { WizardState, SympathyAmount } from "@/types/wizard";

interface Props {
  state: WizardState;
  update: (p: Partial<WizardState>) => void;
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
}

const amounts: [SympathyAmount, string][] = [
  ["10", "≈ 10"],
  ["50", "≈ 50"],
  ["100", "100+"],
];

export const SympathyStep = (p: Props) => {
  const { t } = useLang();
  return (
    <StepShell
      title={t("sy_title")}
      subtitle={t("sy_subtitle")}
      onBack={p.onBack}
      onNext={p.onNext}
      onSkip={p.onSkip}
    >
      <div className="space-y-5">
        <Section title={t("sy_before")} description={t("sy_beforeDesc")}>
          <Field label={t("sy_sendBeforeQ")}>
            <YesNo value={p.state.sympathyBefore} onChange={(v) => p.update({ sympathyBefore: v })} />
          </Field>
          {p.state.sympathyBefore && (
            <>
              <Field label={t("sy_amount")}>
                <div className="flex flex-wrap gap-2">
                  {amounts.map(([v, l]) => (
                    <Pill
                      key={v}
                      active={p.state.sympathyBeforeAmount === v}
                      onClick={() => p.update({ sympathyBeforeAmount: p.state.sympathyBeforeAmount === v ? null : v })}
                    >
                      {l}
                    </Pill>
                  ))}
                </div>
              </Field>
              <Field label={t("sy_includeDateQ")}>
                <YesNo
                  value={p.state.sympathyBeforeIncludeDate}
                  onChange={(v) => p.update({ sympathyBeforeIncludeDate: v })}
                />
              </Field>
            </>
          )}
        </Section>


        <Section title={t("sy_after")} description={t("sy_afterDesc")}>
          <Field label={t("sy_sendAfterQ")}>
            <YesNo value={p.state.sympathyAfter} onChange={(v) => p.update({ sympathyAfter: v })} />
          </Field>
          {p.state.sympathyAfter && (
            <Field label={t("sy_amount")}>
              <div className="flex flex-wrap gap-2">
                {amounts.map(([v, l]) => (
                  <Pill
                    key={v}
                    active={p.state.sympathyAfterAmount === v}
                    onClick={() => p.update({ sympathyAfterAmount: p.state.sympathyAfterAmount === v ? null : v })}
                  >
                    {l}
                  </Pill>
                ))}
              </div>
            </Field>
          )}
        </Section>

        <Section title={t("sy_jewelry")} description={t("sy_jewelryDesc")}>
          <Field label={t("sy_jewelryQ")}>
            <YesNo value={p.state.memorialJewelry} onChange={(v) => p.update({ memorialJewelry: v })} />
          </Field>
        </Section>
      </div>
    </StepShell>
  );
};
