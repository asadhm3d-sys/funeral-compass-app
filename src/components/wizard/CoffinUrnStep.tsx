import { useState } from "react";
import { StepShell } from "./StepShell";
import { Field, Section } from "./Field";
import { Pill, YesNo } from "./Pill";
import { OptionCard } from "./OptionCard";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLang, DictKey } from "@/lib/i18n";
import {
  WizardState,
  CoffinSelection,
  ClothingChoice,
  PillowsChoice,
  PillowsCatalogue,
  CatalogueCoffin,
  CatalogueUrn,
} from "@/types/wizard";

interface Props {
  state: WizardState;
  update: (p: Partial<WizardState>) => void;
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
}

const coffinSelectOptions: { value: CoffinSelection; titleKey: DictKey }[] = [
  { value: "catalogue", titleKey: "fromCatalogue" },
  { value: "other", titleKey: "other" },
  { value: "unsure", titleKey: "unsure" },
];

type CoffinEntry = { value: CatalogueCoffin; titleKey: DictKey; descKey: DictKey; image: string };

const cremationCoffinCatalogue: CoffinEntry[] = [
  { value: "cremation_standard", titleKey: "coffin_cremation_standard", descKey: "coffin_cremation_standard_d", image: "/images/coffins/pine_natural.jpg" },
  { value: "cremation_simple", titleKey: "coffin_cremation_simple", descKey: "coffin_cremation_simple_d", image: "/images/coffins/white_simple.jpg" },
  { value: "cremation_eco", titleKey: "coffin_cremation_eco", descKey: "coffin_cremation_eco_d", image: "/images/coffins/cardboard_eco.jpg" },
];

const regularCoffinCatalogue: CoffinEntry[] = [
  { value: "oak_classic", titleKey: "coffin_oak_classic", descKey: "coffin_oak_classic_d", image: "/images/coffins/oak_classic.jpg" },
  { value: "pine_natural", titleKey: "coffin_pine_natural", descKey: "coffin_pine_natural_d", image: "/images/coffins/pine_natural.jpg" },
  { value: "walnut_dark", titleKey: "coffin_walnut_dark", descKey: "coffin_walnut_dark_d", image: "/images/coffins/walnut_dark.jpg" },
  { value: "willow_woven", titleKey: "coffin_willow_woven", descKey: "coffin_willow_woven_d", image: "/images/coffins/willow_woven.jpg" },
  { value: "white_simple", titleKey: "coffin_white_simple", descKey: "coffin_white_simple_d", image: "/images/coffins/white_simple.jpg" },
  { value: "cardboard_eco", titleKey: "coffin_cardboard_eco", descKey: "coffin_cardboard_eco_d", image: "/images/coffins/cardboard_eco.jpg" },
];

const allCoffinCatalogue: CoffinEntry[] = [...cremationCoffinCatalogue, ...regularCoffinCatalogue];

const urnCatalogue: { value: CatalogueUrn; titleKey: DictKey; descKey: DictKey; image: string }[] = [
  { value: "ceramic_white",  titleKey: "urn_ceramic_white",  descKey: "urn_ceramic_white_d",  image: "/images/urns/ceramic_white.jpg" },
  { value: "wooden_oak",     titleKey: "urn_wooden_oak",     descKey: "urn_wooden_oak_d",     image: "/images/urns/wooden_oak.jpg" },
  { value: "bronze_classic", titleKey: "urn_bronze_classic", descKey: "urn_bronze_classic_d", image: "/images/urns/bronze_classic.jpg" },
  { value: "bio_natural",    titleKey: "urn_bio_natural",    descKey: "urn_bio_natural_d",    image: "/images/urns/bio_natural.jpg" },
  { value: "stone_grey",     titleKey: "urn_stone_grey",     descKey: "urn_stone_grey_d",     image: "/images/urns/stone_grey.jpg" },
  { value: "glass_modern",   titleKey: "urn_glass_modern",   descKey: "urn_glass_modern_d",   image: "/images/urns/glass_modern.jpg" },
];

const clothingOptions: { value: ClothingChoice; titleKey: DictKey; descKey: DictKey }[] = [
  { value: "own", titleKey: "clothingOwn", descKey: "clothingOwnDesc" },
  { value: "shroud", titleKey: "clothingShroud", descKey: "clothingShroudDesc" },
  { value: "current", titleKey: "clothingCurrent", descKey: "clothingCurrentDesc" },
];

const pillowOptions: { value: PillowsChoice; titleKey: DictKey }[] = [
  { value: "catalogue", titleKey: "pillowCatalogue" },
  { value: "own", titleKey: "pillowOwn" },
  { value: "none", titleKey: "pillowNone" },
];

const pillowCatalogueEntries: { value: PillowsCatalogue; titleKey: DictKey; descKey: DictKey; image: string }[] = [
  { value: "satin_white", titleKey: "pillow_satin_white", descKey: "pillow_satin_white_d", image: "https://clientassets.floristtouch.co.uk/user/site109/productImages/1071/std-p1071-1051.jpg?v=1.03" },
  { value: "linen_natural", titleKey: "pillow_linen_natural", descKey: "pillow_linen_natural_d", image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=70" },
  { value: "silk_cream", titleKey: "pillow_silk_cream", descKey: "pillow_silk_cream_d", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=70" },
];

export const CoffinUrnStep = (p: Props) => {
  const { t } = useLang();
  const isCremation = p.state.burialType === "cremation";
  const [pillowsOpen, setPillowsOpen] = useState(false);
  const [coffinCatOpen, setCoffinCatOpen] = useState(false);
  const [urnCatOpen, setUrnCatOpen] = useState(false);

  const selectedCoffin = allCoffinCatalogue.find((c) => c.value === p.state.coffinCatalogue);
  const selectedUrn = urnCatalogue.find((u) => u.value === p.state.urnCatalogue);
  const selectedPillow = pillowCatalogueEntries.find((c) => c.value === p.state.pillowsCatalogue);

  return (
    <StepShell
      title={t("coffinUrnTitle")}
      subtitle={t("coffinUrnSubtitle")}
      onBack={p.onBack}
      onNext={p.onNext}
      onSkip={p.onSkip}
    >
      <div className="space-y-5">
        {(
        <Section title={t("coffinSection")} description={t("coffinSectionDesc")}>
          {isCremation && p.state.finalGoodbye !== "coffin_open" && p.state.finalGoodbye !== "coffin_closed" && (
            <div className="rounded-lg border border-primary/30 bg-primary-soft/40 p-3 text-sm text-foreground/80">
              {t("coffin_cremationStandardHint")}
            </div>
          )}
          <Field label={t("selection")}>
            <div className="flex flex-wrap items-center gap-2">
              {coffinSelectOptions.map((o) => (
                <Pill
                  key={o.value}
                  active={p.state.coffinSelection === o.value}
                  onClick={() => {
                    const next = p.state.coffinSelection === o.value ? null : o.value;
                    p.update({ coffinSelection: next });
                    if (next === "catalogue") setCoffinCatOpen(true);
                  }}
                >
                  {t(o.titleKey)}
                </Pill>
              ))}
              {p.state.coffinSelection === "catalogue" && (
                <Dialog open={coffinCatOpen} onOpenChange={setCoffinCatOpen}>
                  <DialogTrigger asChild>
                    <Button variant="link" size="sm" className="text-primary">
                      {t("viewCatalogue")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{t("coffinCatalogue")}</DialogTitle>
                    </DialogHeader>
                    {isCremation && (
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-sm font-semibold text-foreground">{t("coffin_cremationSectionTitle")}</h4>
                          <p className="mt-1 text-xs text-muted-foreground">{t("coffin_cremationSectionHint")}</p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {cremationCoffinCatalogue.map((o) => (
                            <OptionCard
                              key={o.value}
                              title={t(o.titleKey)}
                              description={t(o.descKey)}
                              image={o.image}
                              selected={p.state.coffinCatalogue === o.value}
                              onClick={() => {
                                p.update({ coffinCatalogue: o.value });
                                setCoffinCatOpen(false);
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="space-y-3">
                      {isCremation && (
                        <h4 className="text-sm font-semibold text-foreground">{t("coffin_regularSectionTitle")}</h4>
                      )}
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {regularCoffinCatalogue.map((o) => (
                          <OptionCard
                            key={o.value}
                            title={t(o.titleKey)}
                            description={t(o.descKey)}
                            image={o.image}
                            selected={p.state.coffinCatalogue === o.value}
                            onClick={() => {
                              p.update({ coffinCatalogue: o.value });
                              setCoffinCatOpen(false);
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
            {selectedCoffin && (
              <div className="mt-3 flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                <img src={selectedCoffin.image} alt={t(selectedCoffin.titleKey)} className="h-16 w-16 rounded-md object-cover" />
                <div className="flex-1">
                  <div className="text-sm font-medium">{t(selectedCoffin.titleKey)}</div>
                  <div className="text-xs text-muted-foreground">{t(selectedCoffin.descKey)}</div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setCoffinCatOpen(true)}>
                  {t("change")}
                </Button>
              </div>
            )}
          </Field>
          {p.state.coffinSelection === "other" && (
            <Field label={t("describeCoffin")}>
              <Input
                value={p.state.coffinOther}
                onChange={(e) => p.update({ coffinOther: e.target.value })}
                placeholder={t("describeCoffinPh")}
              />
            </Field>
          )}
          <Field label={t("clothing")} hint={t("clothing_hint")}>
            <div className="flex flex-wrap gap-2">
              {clothingOptions.map((c) => (
                <Pill
                  key={c.value}
                  active={p.state.clothing === c.value}
                  onClick={() => p.update({ clothing: p.state.clothing === c.value ? null : c.value })}
                >
                  {t(c.titleKey)}
                </Pill>
              ))}
            </div>
          </Field>
          <Field label={t("pillows")} hint={t("pillows_hint")}>
            <div className="flex flex-wrap items-center gap-2">
              {pillowOptions.map((o) => (
                <Pill
                  key={o.value}
                  active={p.state.pillows === o.value}
                  onClick={() => {
                    const next = p.state.pillows === o.value ? null : o.value;
                    p.update({ pillows: next });
                    if (next === "catalogue") setPillowsOpen(true);
                  }}
                >
                  {t(o.titleKey)}
                </Pill>
              ))}
              {p.state.pillows === "catalogue" && (
                <Dialog open={pillowsOpen} onOpenChange={setPillowsOpen}>
                  <DialogTrigger asChild>
                    <Button variant="link" size="sm" className="text-primary">
                      {t("viewCatalogue")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{t("pillowCatalogueTitle")}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 sm:grid-cols-3">
                      {pillowCatalogueEntries.map((o) => (
                        <OptionCard
                          key={o.value}
                          title={t(o.titleKey)}
                          description={t(o.descKey)}
                          image={o.image}
                          selected={p.state.pillowsCatalogue === o.value}
                          onClick={() => {
                            p.update({ pillowsCatalogue: o.value });
                            setPillowsOpen(false);
                          }}
                        />
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
            {selectedPillow && (
              <div className="mt-3 flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                <img src={selectedPillow.image} alt={t(selectedPillow.titleKey)} className="h-16 w-16 rounded-md object-cover" />
                <div className="flex-1">
                  <div className="text-sm font-medium">{t(selectedPillow.titleKey)}</div>
                  <div className="text-xs text-muted-foreground">{t(selectedPillow.descKey)}</div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setPillowsOpen(true)}>
                  {t("change")}
                </Button>
              </div>
            )}
          </Field>
          <Field label={t("graveGoods")} hint={t("graveGoodsHint")}>
            <YesNo value={p.state.graveGoods} onChange={(v) => p.update({ graveGoods: v })} />
          </Field>
          {p.state.graveGoods && (
            <Field label={t("graveGoodsLabel")}>
              <Textarea
                rows={2}
                value={p.state.graveGoodsText}
                onChange={(e) => p.update({ graveGoodsText: e.target.value })}
                placeholder={t("graveGoodsPh")}
              />
            </Field>
          )}
        </Section>
        )}

        {isCremation && (
        <Section title={t("urnSection")} description={t("urnSectionDescCremation")}>
            <Field label={t("selection")}>
              <div className="flex flex-wrap items-center gap-2">
                {coffinSelectOptions.map((o) => (
                  <Pill
                    key={o.value}
                    active={p.state.urnSelection === o.value}
                    onClick={() => {
                      const next = p.state.urnSelection === o.value ? null : o.value;
                      p.update({ urnSelection: next });
                      if (next === "catalogue") setUrnCatOpen(true);
                    }}
                  >
                    {t(o.titleKey)}
                  </Pill>
                ))}
                {p.state.urnSelection === "catalogue" && (
                  <Dialog open={urnCatOpen} onOpenChange={setUrnCatOpen}>
                    <DialogTrigger asChild>
                      <Button variant="link" size="sm" className="text-primary">
                        {t("viewCatalogue")}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{t("urnCatalogue")}</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {urnCatalogue.map((o) => (
                          <OptionCard
                            key={o.value}
                            title={t(o.titleKey)}
                            description={t(o.descKey)}
                            image={o.image}
                            selected={p.state.urnCatalogue === o.value}
                            onClick={() => {
                              p.update({ urnCatalogue: o.value });
                              setUrnCatOpen(false);
                            }}
                          />
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
              {selectedUrn && (
                <div className="mt-3 flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                  <img src={selectedUrn.image} alt={t(selectedUrn.titleKey)} className="h-16 w-16 rounded-md object-cover" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{t(selectedUrn.titleKey)}</div>
                    <div className="text-xs text-muted-foreground">{t(selectedUrn.descKey)}</div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setUrnCatOpen(true)}>
                    {t("change")}
                  </Button>
                </div>
              )}
            </Field>
            {p.state.urnSelection === "other" && (
              <Field label={t("describeUrn")}>
                <Input
                  value={p.state.urnOther}
                  onChange={(e) => p.update({ urnOther: e.target.value })}
                  placeholder={t("describeUrnPh")}
                />
              </Field>
            )}
        </Section>
        )}

      </div>
    </StepShell>
  );
};
