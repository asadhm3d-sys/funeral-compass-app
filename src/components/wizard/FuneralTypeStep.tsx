import { OptionCard } from "./OptionCard";
import { StepShell } from "./StepShell";
import { Field, Section } from "./Field";
import { Pill } from "./Pill";
import { InfoPopover } from "./InfoPopover";
import { Input } from "@/components/ui/input";
import { useLang, DictKey } from "@/lib/i18n";
import { WizardState, BurialType, LocationType } from "@/types/wizard";

interface Props {
  state: WizardState;
  update: (p: Partial<WizardState>) => void;
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
}

export const FuneralTypeStep = (p: Props) => {
  const { t } = useLang();
  const isCremation = p.state.burialType === "cremation";

  const burialOptions: { value: BurialType; titleKey: DictKey; descKey: DictKey; image: string }[] = [
    { value: "earth", titleKey: "ft_earth", descKey: "ft_earthDesc", image: "/1a2c85e5-d9f0-4f08-86b0-e82476153c47.jpg" },
    { value: "cremation", titleKey: "ft_cremation", descKey: "ft_cremationDesc", image: "/d1aa1631-70c4-48dd-b2a6-32a916fbebc0.jpg" },
  ];

  const locationOptions: { value: LocationType; titleKey: DictKey; descKey: DictKey; image: string; show: boolean }[] = [
    { value: "cemetery", titleKey: "ft_cemetery", descKey: "ft_cemeteryDesc", image: "/63a24df0-48a8-4c33-a1da-8ff8638a4cb2.png", show: true },
    { value: "friedwald", titleKey: "ft_friedwald", descKey: "ft_friedwaldDesc", image: "/b6616bec-d005-4c51-977b-7f9a9fdf3477.jpg", show: isCremation },
    { value: "sea", titleKey: "ft_sea", descKey: "ft_seaDesc", image: "/c5eaf151-2af6-40c6-b3af-ff5f3dec8da3.png", show: isCremation },
  ];

  return (
    <StepShell
      title={t("ft_title")}
      subtitle={t("ft_subtitle")}
      onBack={p.onBack}
      onNext={p.onNext}
      onSkip={p.onSkip}
    >
      <div className="space-y-6">
        <Section
          title={t("ft_careOfBody")}
          description={t("ft_careOfBodyDesc")}
          titleAction={
            <InfoPopover
              title={t("ft_careOfBody")}
              content={
                <div className="space-y-4">
                  <p>
                    Die Bestattungsform legt fest, wie der Körper der verstorbenen Person nach dem Tod behandelt wird. In Deutschland sind vor allem zwei Formen verbreitet: die <strong>Erdbestattung</strong> und die <strong>Feuerbestattung</strong> (Kremation). Die Entscheidung beeinflusst alle weiteren Schritte – etwa die Wahl von Sarg oder Urne, den möglichen Bestattungsort und den Ablauf der Trauerfeier.
                  </p>
                  <div>
                    <h4 className="mb-1 text-sm font-medium text-foreground">Erdbestattung</h4>
                    <p>
                      Der oder die Verstorbene wird in einem Sarg auf einem Friedhof beigesetzt. Sie ist die traditionellste Form und in vielen Religionen und Kulturen verankert. Erdbestattungen sind in Deutschland nur auf ausgewiesenen Friedhöfen möglich (Friedhofszwang).
                    </p>
                  </div>
                  <div>
                    <h4 className="mb-1 text-sm font-medium text-foreground">Feuerbestattung</h4>
                    <p>
                      Der Körper wird in einem Krematorium eingeäschert; die Asche wird anschließend in einer Urne beigesetzt. Diese Form ermöglicht zusätzliche Bestattungsorte wie Friedwald (Baumbestattung) oder eine Seebestattung. Sie ist meist günstiger und flexibler in Ort und Zeit.
                    </p>
                  </div>
                  <p className="text-xs">
                    Tipp: Hatte die verstorbene Person hierzu Wünsche geäußert (z. B. in einer Bestattungsverfügung), sollten diese nach Möglichkeit berücksichtigt werden.
                  </p>
                </div>
              }
            />
          }
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {burialOptions.map((o) => (
              <OptionCard
                key={o.value}
                title={t(o.titleKey)}
                description={t(o.descKey)}
                image={o.image}
                selected={p.state.burialType === o.value}
                onClick={() => {
                  if (p.state.burialType === o.value) {
                    p.update({ burialType: null });
                    return;
                  }
                  const patch: Partial<WizardState> = { burialType: o.value };
                  if (o.value === "earth" && p.state.locationType && p.state.locationType !== "cemetery") {
                    patch.locationType = null;
                  }
                  p.update(patch);
                }}
              />
            ))}
          </div>
        </Section>

        {p.state.burialType && (
          <Section title={t("ft_place")} description={t("ft_placeDesc")}>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {locationOptions.filter((o) => o.show).map((o) => (
                <OptionCard
                  key={o.value}
                  title={t(o.titleKey)}
                  description={t(o.descKey)}
                  image={o.image}
                  selected={p.state.locationType === o.value}
                  onClick={() => p.update({ locationType: p.state.locationType === o.value ? null : o.value })}
                />
              ))}
            </div>

            {p.state.locationType === "cemetery" && (
              <div className="mt-2 max-w-md">
                <Field label={t("ft_whichCemetery")} hint={t("ft_whichCemeteryHint")}>
                  <Input
                    value={p.state.cemeteryName}
                    onChange={(e) => p.update({ cemeteryName: e.target.value })}
                    placeholder={t("ft_whichCemeteryPh")}
                  />
                </Field>
              </div>
            )}

            {p.state.locationType === "friedwald" && (
              <div className="mt-2 max-w-md">
                <Field label={t("ft_whichFriedwald")} hint={t("ft_whichFriedwaldHint")}>
                  <Input
                    value={p.state.friedwaldName}
                    onChange={(e) => p.update({ friedwaldName: e.target.value })}
                    placeholder={t("ft_whichFriedwaldPh")}
                  />
                </Field>
              </div>
            )}

            {p.state.locationType === "sea" && (
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">{t("ft_seaMovedHint")}</p>
              </div>
            )}
          </Section>
        )}
      </div>
    </StepShell>
  );
};
