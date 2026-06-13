import { StepShell } from "./StepShell";
import { Field, Section } from "./Field";
import { Pill, YesNo } from "./Pill";
import { OptionCard } from "./OptionCard";
import { Input } from "@/components/ui/input";
import { useLang, DictKey } from "@/lib/i18n";
import {
  WizardState,
  GraveExisting,
  CemeteryEarthGraveType,
  CemeteryCremationGraveType,
  FriedwaldGraveOption,
  GraveTypeKind,
  SeaRegion,
} from "@/types/wizard";

interface Props {
  state: WizardState;
  update: (p: Partial<WizardState>) => void;
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
}

export const GraveDetailsStep = (p: Props) => {
  const { t } = useLang();
  const loc = p.state.locationType;
  const isEarth = p.state.burialType === "earth";
  const isCremation = p.state.burialType === "cremation";

  const existingOptions: [GraveExisting, string][] = [
    ["yes", t("grave_yesExisting")],
    ["no", t("grave_noNew")],
    ["anonymous", t("grave_anonymous")],
  ];

  const graveTypeKinds: { value: GraveTypeKind; titleKey: DictKey; descKey: DictKey; image: string }[] = [
    { value: "single", titleKey: "graveSingle", descKey: "graveSingleDesc", image: "https://media.istockphoto.com/id/183387658/photo/tombstone-with-flowers.jpg?s=612x612&w=0&k=20&c=Q0fwGYrgQBM4wHYb4-jWa2usAFmOiF4vrEtxd8gxENM=" },
    { value: "family", titleKey: "graveFamily", descKey: "graveFamilyDesc", image: "https://media.istockphoto.com/id/1170742096/photo/family-grave-plot-in-a-suffolk-churchyard.jpg?s=1024x1024&w=is&k=20&c=s6Y6Vf5NvlKgpMbfojX2NNPHSQxfuW8qfmL2uJ5PXmo=" },
    { value: "tree", titleKey: "graveTree", descKey: "graveTreeDesc", image: "/b6616bec-d005-4c51-977b-7f9a9fdf3477.jpg" },
    { value: "anonymous", titleKey: "graveAnonymous", descKey: "graveAnonymousDesc", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=70" },
  ];

  const earthGraves: { value: CemeteryEarthGraveType; titleKey: DictKey; descKey: DictKey; image: string }[] = [
    { value: "classical", titleKey: "grave_classical", descKey: "grave_classicalDesc", image: "https://media.istockphoto.com/id/183387658/photo/tombstone-with-flowers.jpg?s=612x612&w=0&k=20&c=Q0fwGYrgQBM4wHYb4-jWa2usAFmOiF4vrEtxd8gxENM=" },
    { value: "lawn", titleKey: "grave_lawn", descKey: "grave_lawnDesc", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=70" },
  ];

  const cremationGraves: { value: CemeteryCremationGraveType; titleKey: DictKey; descKey: DictKey; image: string }[] = [
    { value: "classical", titleKey: "grave_classicalUrn", descKey: "grave_classicalUrnDesc", image: "https://media.istockphoto.com/id/183387658/photo/tombstone-with-flowers.jpg?s=612x612&w=0&k=20&c=Q0fwGYrgQBM4wHYb4-jWa2usAFmOiF4vrEtxd8gxENM=" },
    { value: "lawn", titleKey: "grave_lawnUrn", descKey: "grave_lawnUrnDesc", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=70" },
    { value: "tree", titleKey: "grave_treeCem", descKey: "grave_treeCemDesc", image: "/b6616bec-d005-4c51-977b-7f9a9fdf3477.jpg" },
    { value: "urn_wall", titleKey: "grave_urnWall", descKey: "grave_urnWallDesc", image: "https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?auto=format&fit=crop&w=800&q=70" },
    { value: "gardened_field", titleKey: "grave_gardened", descKey: "grave_gardenedDesc", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=70" },
  ];

  return (
    <StepShell
      title={t("grave_title")}
      subtitle={t("grave_subtitle")}
      onBack={p.onBack}
      onNext={p.onNext}
      onSkip={p.onSkip}
    >
      <div className="space-y-5">
        {!isCremation && (
          <Section title={t("graveTypeSection")}>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {graveTypeKinds.map((o) => (
                <OptionCard
                  key={o.value}
                  title={t(o.titleKey)}
                  description={t(o.descKey)}
                  image={o.image}
                  selected={p.state.graveTypeKind === o.value}
                  onClick={() => p.update({ graveTypeKind: p.state.graveTypeKind === o.value ? null : o.value })}
                />
              ))}
            </div>
          </Section>
        )}

        {loc === "cemetery" && (
          <>
            <Section title={t("grave_existingQ")} description={t("graveTypeSectionDesc")}>
              <div className="flex flex-wrap gap-2">
                {existingOptions.map(([v, l]) => (
                  <Pill
                    key={v}
                    active={p.state.existingGrave === v}
                    onClick={() => p.update({ existingGrave: p.state.existingGrave === v ? null : v })}
                  >
                    {l}
                  </Pill>
                ))}
              </div>
              {p.state.existingGrave === "yes" && (
                <Field label={t("grave_number")} hint={t("grave_numberHint")}>
                  <Input
                    value={p.state.graveNumber}
                    onChange={(e) => p.update({ graveNumber: e.target.value })}
                    placeholder={t("grave_numberPh")}
                  />
                </Field>
              )}
              {p.state.existingGrave === "no" && (
                <Field label={t("grave_futureQ")}>
                  <YesNo value={p.state.graveFuturePeople} onChange={(v) => p.update({ graveFuturePeople: v })} />
                </Field>
              )}
            </Section>

            {isEarth && p.state.existingGrave !== "anonymous" && (
              <Section title={t("grave_typeLabel")} description={t("grave_typeDesc")}>
                <div className="grid gap-4 sm:grid-cols-2">
                  {earthGraves.map((o) => (
                    <OptionCard
                      key={o.value}
                      title={t(o.titleKey)}
                      description={t(o.descKey)}
                      image={o.image}
                      selected={p.state.cemeteryEarthGrave === o.value}
                      onClick={() => p.update({ cemeteryEarthGrave: p.state.cemeteryEarthGrave === o.value ? null : o.value })}
                    />
                  ))}
                </div>
              </Section>
            )}

            {isCremation && p.state.existingGrave !== "anonymous" && (
              <Section title={t("grave_typeLabel")} description={t("grave_typeDesc")}>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {cremationGraves.map((o) => (
                    <OptionCard
                      key={o.value}
                      title={t(o.titleKey)}
                      description={t(o.descKey)}
                      image={o.image}
                      selected={p.state.cemeteryCremationGrave === o.value}
                      onClick={() => p.update({ cemeteryCremationGrave: p.state.cemeteryCremationGrave === o.value ? null : o.value })}
                    />
                  ))}
                </div>
              </Section>
            )}
          </>
        )}

        {loc === "friedwald" && (
          <>
            <Section title={t("grave_fwReservedQ")} description={t("grave_fwReservedDesc")}>
              <div className="flex flex-wrap gap-2">
                {([
                  ["yes", t("grave_fwYes")],
                  ["no", t("grave_fwNo")],
                ] as [GraveExisting, string][]).map(([v, l]) => (
                  <Pill
                    key={v}
                    active={p.state.friedwaldExisting === v}
                    onClick={() => p.update({ friedwaldExisting: p.state.friedwaldExisting === v ? null : v })}
                  >
                    {l}
                  </Pill>
                ))}
              </div>
              {p.state.friedwaldExisting === "yes" && (
                <Field label={t("grave_fwTreeNumber")}>
                  <Input
                    value={p.state.friedwaldTreeNumber}
                    onChange={(e) => p.update({ friedwaldTreeNumber: e.target.value })}
                    placeholder={t("grave_fwTreeNumberPh")}
                  />
                </Field>
              )}
            </Section>

            {p.state.friedwaldExisting === "no" && (
              <Section title={t("grave_fwTypeOf")} description={t("grave_fwTypeOfDesc")}>
                <div className="flex flex-wrap gap-2">
                  {([
                    ["partner_tree", t("grave_fw_partner")],
                    ["generation_tree", t("grave_fw_generation")],
                    ["shared_tree", t("grave_fw_shared")],
                    ["shared_base_site", t("grave_fw_base")],
                  ] as [FriedwaldGraveOption, string][]).map(([v, l]) => (
                    <Pill
                      key={v}
                      active={p.state.friedwaldGraveOption === v}
                      onClick={() => p.update({ friedwaldGraveOption: p.state.friedwaldGraveOption === v ? null : v })}
                    >
                      {l}
                    </Pill>
                  ))}
                </div>
              </Section>
            )}

            <Section title={t("grave_fwNamePlateQ")} description={t("grave_fwNamePlateDesc")}>
              <YesNo value={p.state.friedwaldNamePlate} onChange={(v) => p.update({ friedwaldNamePlate: v })} />
            </Section>
          </>
        )}

        {loc === "sea" && (
          <>
            <Section title={t("grave_seaWhichSea")}>
              <div className="flex flex-wrap gap-2">
                {([
                  ["nordsee", t("ft_nordsee")],
                  ["ostsee", t("ft_ostsee")],
                  ["international", t("ft_international")],
                ] as [SeaRegion, string][]).map(([v, l]) => (
                  <Pill
                    key={v}
                    active={p.state.seaRegion === v}
                    onClick={() => p.update({ seaRegion: p.state.seaRegion === v ? null : v })}
                  >
                    {l}
                  </Pill>
                ))}
              </div>
            </Section>
            <Section title={t("grave_seaDeparturePort")}>
              <Input
                value={p.state.seaDeparturePort}
                onChange={(e) => p.update({ seaDeparturePort: e.target.value })}
                placeholder={t("grave_seaDeparturePortPh")}
              />
            </Section>
            <p className="text-sm text-muted-foreground">{t("grave_seaNote")}</p>
          </>
        )}
      </div>
    </StepShell>
  );
};
