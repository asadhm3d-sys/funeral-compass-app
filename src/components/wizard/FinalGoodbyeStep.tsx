import { useState } from "react";
import { OptionCard } from "./OptionCard";
import { Section } from "./Field";
import { StepShell } from "./StepShell";
import { useLang, DictKey } from "@/lib/i18n";
import { WizardState, FinalGoodbye } from "@/types/wizard";
import { cn } from "@/lib/utils";

interface Props {
  state: WizardState;
  update: (p: Partial<WizardState>) => void;
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
}

export const FinalGoodbyeStep = (p: Props) => {
  const { t } = useLang();
  const isCremation = p.state.burialType === "cremation";

  // Local yes/no decision. If a finalGoodbye value already exists, default to "yes".
  const [decision, setDecision] = useState<"yes" | "no" | null>(
    p.state.finalGoodbye ? "yes" : null
  );

  const options: { value: FinalGoodbye; titleKey: DictKey; descKey: DictKey; image: string; show: boolean }[] = [
    { value: "coffin_open", titleKey: "fg_open", descKey: "fg_openDesc", image: "https://cf.ltkcdn.net/dying/images/std/264846-800x515r1-closed-casket-funeral.webp", show: true },
    { value: "coffin_closed", titleKey: "fg_closed", descKey: "fg_closedDesc", image: "https://titancasket.com/cdn/shop/articles/pexels-pavel-danilyuk-7317916-_1.webp?v=1666706925", show: true },
    { value: "urn", titleKey: "fg_urn", descKey: "fg_urnDesc", image: "https://images.t-online.de/2025/11/rz4MJbhv8sc2/0x107:2048x1152/fit-in/646x0/urnenbestattung-ist-eine-der-in-baden-wuerttemberg-zulaessigen-bestattungsformen-aber-nicht-zu-hause-archivbild.jpg", show: isCremation },
  ];

  const choose = (val: "yes" | "no") => {
    const next = decision === val ? null : val;
    setDecision(next);
    if (next !== "yes" && p.state.finalGoodbye) {
      p.update({ finalGoodbye: null });
    }
  };

  return (
    <SteShellWrapper p={p} t={t}>
      <Section title={t("fg_question")}>
        <div className="flex flex-wrap gap-2">
          {(["yes", "no"] as const).map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => choose(val)}
              className={cn(
                "theme-pill rounded-full border px-5 py-2 text-sm font-medium transition-smooth",
                decision === val
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground hover:border-primary/40"
              )}
            >
              {t(val)}
            </button>
          ))}
        </div>

        {decision === "yes" && (
          <div className="grid animate-fade-in gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {options.filter((o) => o.show).map((o) => (
              <OptionCard
                key={o.value}
                title={t(o.titleKey)}
                description={t(o.descKey)}
                image={o.image}
                selected={p.state.finalGoodbye === o.value}
                onClick={() => p.update({ finalGoodbye: p.state.finalGoodbye === o.value ? null : o.value })}
              />
            ))}
          </div>
        )}
      </Section>
    </SteShellWrapper>
  );
};

const SteShellWrapper = ({ p, t, children }: { p: Props; t: (k: DictKey) => string; children: React.ReactNode }) => (
  <StepShell
    title={t("fg_title")}
    subtitle={t("fg_subtitle")}
    onBack={p.onBack}
    onNext={p.onNext}
    onSkip={p.onSkip}
  >
    {children}
  </StepShell>
);
