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
  SpeakerType,
  MusicType,
  CeremonyVenue,
} from "@/types/wizard";

interface Props {
  state: WizardState;
  update: (p: Partial<WizardState>) => void;
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
}

const decorationGallery: { key: string; titleKey: DictKey; descKey: DictKey; image: string }[] = [
  { key: "normal", titleKey: "mc_decoNormal", descKey: "mc_decoNormalDesc", image: "/359d64d2-291e-4888-9452-2a128283fda7.jpg" },
  { key: "simple", titleKey: "mc_decoSimple", descKey: "mc_decoSimpleDesc", image: "/8cb010dc-ec8b-4e05-8449-f22f9cc4ffdb.jpg" },
  { key: "none", titleKey: "mc_decoNone", descKey: "mc_decoNoneDesc", image: "/cd85c214-ed83-4cfd-b664-cd33227d5438.jpg" },
];

const urnWreathCatalogue: { value: string; titleKey: DictKey; descKey: DictKey; image: string }[] = [
  { value: "classic", titleKey: "urnWreath_classic", descKey: "urnWreath_classic_d", image: "https://images.unsplash.com/photo-1487070183336-b863922373d4?auto=format&fit=crop&w=600&q=70" },
  { value: "white", titleKey: "urnWreath_white", descKey: "urnWreath_white_d", image: "https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=600&q=70" },
  { value: "seasonal", titleKey: "urnWreath_seasonal", descKey: "urnWreath_seasonal_d", image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=600&q=70" },
  { value: "smallArr", titleKey: "urnWreath_smallArr", descKey: "urnWreath_smallArr_d", image: "https://images.unsplash.com/photo-1455659817273-f96807779a8a?auto=format&fit=crop&w=600&q=70" },
  { value: "classicArr", titleKey: "urnWreath_classicArr", descKey: "urnWreath_classicArr_d", image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=600&q=70" },
  { value: "modernArr", titleKey: "urnWreath_modernArr", descKey: "urnWreath_modernArr_d", image: "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=600&q=70" },
];

const urnArrangementCatalogue: { value: string; titleKey: DictKey; descKey: DictKey; image: string }[] = [
  { value: "heart", titleKey: "genFlower_heart", descKey: "genFlower_heart_d", image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=600&q=70" },
  { value: "hangingWreath", titleKey: "genFlower_hangingWreath", descKey: "genFlower_hangingWreath_d", image: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=600&q=70" },
  { value: "planter", titleKey: "genFlower_planter", descKey: "genFlower_planter_d", image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=70" },
  { value: "cross", titleKey: "genFlower_cross", descKey: "genFlower_cross_d", image: "https://images.unsplash.com/photo-1513279014891-1d0e0e9f1de1?auto=format&fit=crop&w=600&q=70" },
];

const coffinWreathCatalogue: { value: string; titleKey: DictKey; descKey: DictKey; image: string }[] = [
  { value: "classic", titleKey: "coffinWreath_classic", descKey: "coffinWreath_classic_d", image: "https://images.unsplash.com/photo-1487070183336-b863922373d4?auto=format&fit=crop&w=600&q=70" },
  { value: "white", titleKey: "coffinWreath_white", descKey: "coffinWreath_white_d", image: "https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=600&q=70" },
  { value: "seasonal", titleKey: "coffinWreath_seasonal", descKey: "coffinWreath_seasonal_d", image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=600&q=70" },
  { value: "lush", titleKey: "coffinWreath_lush", descKey: "coffinWreath_lush_d", image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=600&q=70" },
];

const coffinBouquetCatalogue: { value: string; titleKey: DictKey; descKey: DictKey; image: string }[] = [
  { value: "classic", titleKey: "coffinBouquet_classic", descKey: "coffinBouquet_classic_d", image: "https://images.unsplash.com/photo-1455659817273-f96807779a8a?auto=format&fit=crop&w=600&q=70" },
  { value: "white", titleKey: "coffinBouquet_white", descKey: "coffinBouquet_white_d", image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=600&q=70" },
  { value: "seasonal", titleKey: "coffinBouquet_seasonal", descKey: "coffinBouquet_seasonal_d", image: "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=600&q=70" },
  { value: "modern", titleKey: "coffinBouquet_modern", descKey: "coffinBouquet_modern_d", image: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=600&q=70" },
];

const finalGoodbyeKeys: DictKey[] = ["mc_fg_balloons", "mc_fg_candle"];

export const MainCeremonyStep = (p: Props) => {
  const { t } = useLang();
  const [decoOpen, setDecoOpen] = useState(false);
  const [urnWreathOpen, setUrnWreathOpen] = useState(false);
  const [urnArrOpen, setUrnArrOpen] = useState(false);
  const [coffinWreathOpen, setCoffinWreathOpen] = useState(false);
  const [coffinBouquetOpen, setCoffinBouquetOpen] = useState(false);
  const isCemetery = p.state.locationType === "cemetery";
  const isFriedwald = p.state.locationType === "friedwald";
  const isFwAndacht = isFriedwald && p.state.friedwaldCeremony === "andachtsplatz";
  const isCremation = p.state.burialType === "cremation";
  const isSea = p.state.locationType === "sea";
  const seaIsCoffin = isSea && p.state.seaSeparateCeremonyType === "coffin";
  const isUrnFlowers = ((isCremation && p.state.urnSelection !== null) || isFriedwald || isSea) && !seaIsCoffin;

  const musicOptions: [MusicType, string][] = [
    ["playback", t("mc_playback")],
    ...(isCemetery ? ([["organ", t("mc_organ")]] as [MusicType, string][]) : []),
    ["live", t("mc_live")],
    ["none", t("mc_noMusic")],
  ];

  const isSeparate = p.state.cemeteryCeremony === "separate";

  const venueOptions: { value: CeremonyVenue; titleKey: DictKey; descKey: DictKey; image: string }[] = [
    { value: "cemetery", titleKey: "mc_atCemetery", descKey: "mc_atCemeteryDesc", image: "/2cdc6435-ef5f-46dc-8d4b-98644f986c5b.jpg" },
    { value: "elsewhere", titleKey: "mc_elsewhere", descKey: "mc_elsewhereDesc", image: "/c83981f3-4da9-48d8-ae29-c746686311d1.jpg" },
  ];

  const finalGoodbyeOptions = finalGoodbyeKeys.map((k) => t(k));

  const toggleRitual = (val: string) => {
    const current = p.state.ceremonyFinalGoodbyeRituals ?? [];
    const next = current.includes(val) ? current.filter((v) => v !== val) : [...current, val];
    p.update({ ceremonyFinalGoodbyeRituals: next });
  };

  const selectedUrnWreath = urnWreathCatalogue.find((u) => u.value === p.state.urnFlowerWreath);
  const selectedUrnArr = urnArrangementCatalogue.find((u) => u.value === p.state.urnFlowerArrangement);
  const selectedCoffinWreath = coffinWreathCatalogue.find((u) => u.value === p.state.coffinFlowerWreath);
  const selectedCoffinBouquet = urnArrangementCatalogue.find((u) => u.value === p.state.coffinFlowerBouquet);

  return (
    <StepShell
      title={t("mc_title")}
      subtitle={t("mc_subtitle")}
      onBack={p.onBack}
      onNext={p.onNext}
      onSkip={p.onSkip}
    >
      <div className="space-y-5">
        {!isFwAndacht && (
        <Section title={t("mc_place")} description={t("mc_placeDesc")}>
          <div className="grid gap-3 sm:grid-cols-2">
            {venueOptions.map((o) => (
              <OptionCard
                key={o.value}
                title={t(o.titleKey)}
                description={t(o.descKey)}
                image={o.image}
                selected={p.state.ceremonyVenue === o.value}
                onClick={() =>
                  p.update({
                    ceremonyVenue: p.state.ceremonyVenue === o.value ? null : o.value,
                    ceremonyPlace: o.value === "elsewhere" ? p.state.ceremonyPlace : "",
                  })
                }
              />
            ))}
          </div>
          {p.state.ceremonyVenue === "elsewhere" && (
            <Field label={t("mc_whereExactly")}>
              <Input
                value={p.state.ceremonyPlace}
                onChange={(e) => p.update({ ceremonyPlace: e.target.value })}
                placeholder={t("mc_whereExactlyPh")}
              />
            </Field>
          )}
          {(() => {
            const s = p.state;
            const ceremonyAtCoffin =
              s.burialType === "earth" ||
              (s.burialType === "cremation" &&
                ((s.cemeteryCeremony === "combined" &&
                  (s.finalGoodbye === "coffin_open" || s.finalGoodbye === "coffin_closed")) ||
                  (s.cemeteryCeremony === "separate" && s.cemeterySeparateCeremonyType === "coffin") ||
                  (s.locationType === "friedwald" && s.friedwaldCeremony === "elsewhere" && s.friedwaldElsewhereCeremonyType === "coffin") ||
                  (s.locationType === "sea" && s.seaSeparateCeremonyType === "coffin")));
            if (!ceremonyAtCoffin) return null;
            return (
              <Field label={t("mc_publicViewing")} hint={t("mc_publicViewingHint")}>
                <YesNo value={s.publicViewing} onChange={(v) => p.update({ publicViewing: v })} />
              </Field>
            );
          })()}
        </Section>
        )}

        <Section title={t("mc_speech")} description={t("mc_speechDesc")}>
          <div className="flex flex-wrap gap-2">
            {([
              ["cleric", t("mc_cleric")],
              ["free_speaker", t("mc_freeSpeaker")],
              ["relative", t("mc_relative")],
            ] as [SpeakerType, string][]).map(([v, l]) => (
              <Pill
                key={v}
                active={p.state.ceremonySpeaker === v}
                onClick={() => p.update({ ceremonySpeaker: p.state.ceremonySpeaker === v ? null : v })}
              >
                {l}
              </Pill>
            ))}
          </div>
          <Field label={t("mc_speakerWishes")} hint={t("mc_speakerWishesHint")}>
            <Textarea
              rows={3}
              value={p.state.ceremonySpeakerWishes}
              onChange={(e) => p.update({ ceremonySpeakerWishes: e.target.value })}
              placeholder={t("mc_speakerWishesPh")}
            />
          </Field>
        </Section>

        <Section title={t("mc_music")} description={t("mc_musicDesc")}>
          <div className="flex flex-wrap gap-2">
            {musicOptions.map(([v, l]) => (
              <Pill
                key={v}
                active={p.state.ceremonyMusic === v}
                onClick={() => p.update({ ceremonyMusic: p.state.ceremonyMusic === v ? null : v })}
              >
                {l}
              </Pill>
            ))}
          </div>
          {p.state.ceremonyMusic !== "none" && (
            <Field label={t("mc_songWishes")} hint={t("mc_songWishesHint")}>
              <Textarea
                rows={2}
                value={p.state.ceremonyMusicWishes}
                onChange={(e) => p.update({ ceremonyMusicWishes: e.target.value })}
                placeholder={t("mc_songWishesPh")}
              />
            </Field>
          )}
        </Section>

        <Section title={t("mc_decoration")} description={isFwAndacht ? undefined : t("mc_decoExamplesDesc")}>
          {isFwAndacht ? (
            <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm text-foreground/80">
              {t("mc_fwDecoHint")}
            </div>
          ) : (
            <>
              <Dialog open={decoOpen} onOpenChange={setDecoOpen}>
                <DialogTrigger asChild>
                  <Button variant="link" size="sm" className="text-primary px-0">
                    {t("mc_viewExamples")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{t("mc_decoExamplesTitle")}</DialogTitle>
                  </DialogHeader>
                  <p className="text-xs text-muted-foreground">{t("mc_decoExamplesHint")}</p>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {decorationGallery.map((d) => (
                      <div key={d.key} className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
                        <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
                          <img src={d.image} alt={t(d.titleKey)} loading="lazy" className="h-full w-full object-cover" />
                        </div>
                        <div className="p-3">
                          <div className="text-sm font-medium text-foreground">{t(d.titleKey)}</div>
                          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t(d.descKey)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
              <Field label={t("mc_decoNotes")} hint={t("mc_decoNotesHint")}>
                <Textarea
                  rows={3}
                  value={p.state.ceremonyDecorationText}
                  onChange={(e) => p.update({ ceremonyDecorationText: e.target.value })}
                  placeholder={t("mc_decoNotesPh")}
                />
              </Field>
            </>
          )}
          <Field label={t("mc_picture")}>
            <YesNo value={p.state.ceremonyPicture} onChange={(v) => p.update({ ceremonyPicture: v })} />
          </Field>
          <Field label={t("mc_personalItems")}>
            <YesNo value={p.state.ceremonyPersonalItems} onChange={(v) => p.update({ ceremonyPersonalItems: v })} />
          </Field>
          {p.state.ceremonyPersonalItems && (
            <Field label={t("mc_whichItems")}>
              <Textarea
                rows={2}
                value={p.state.ceremonyPersonalItemsText}
                onChange={(e) => p.update({ ceremonyPersonalItemsText: e.target.value })}
                placeholder={t("mc_whichItemsPh")}
              />
            </Field>
          )}
        </Section>

        {isUrnFlowers ? (
          <Section title={t("mc_urnSection")} description={isFwAndacht ? undefined : t("mc_flowersUrnDesc")}>
            {isFwAndacht ? (
              <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm text-foreground/80">
                {t("mc_fwFlowerHint")}
              </div>
            ) : (
              <>
                {isSeparate && (
                  <div className="rounded-lg border border-primary/30 bg-primary-soft/40 p-3 text-sm text-foreground/80">
                    {t("mc_separateTip")}
                  </div>
                )}
                <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm text-foreground/80">
                  {t("mc_floristHint")}
                </div>
              </>
            )}

            <Field label={t("mc_urnWreathLabel")}>
              <Dialog open={urnWreathOpen} onOpenChange={setUrnWreathOpen}>
                <DialogTrigger asChild>
                  <Button variant="link" size="sm" className="text-primary px-0">
                    {t("viewCatalogue")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{t("mc_urnWreathLabel")}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {urnWreathCatalogue.map((o) => (
                      <OptionCard
                        key={o.value}
                        title={t(o.titleKey)}
                        description={t(o.descKey)}
                        image={o.image}
                        selected={p.state.urnFlowerWreath === o.value}
                        onClick={() => {
                          p.update({ urnFlowerWreath: o.value });
                          setUrnWreathOpen(false);
                        }}
                      />
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
              {selectedUrnWreath && (
                <div className="mt-3 flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                  <img src={selectedUrnWreath.image} alt={t(selectedUrnWreath.titleKey)} className="h-16 w-16 rounded-md object-cover" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{t(selectedUrnWreath.titleKey)}</div>
                    <div className="text-xs text-muted-foreground">{t(selectedUrnWreath.descKey)}</div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => p.update({ urnFlowerWreath: null })}>
                    {t("cancel")}
                  </Button>
                </div>
              )}
            </Field>

            {!isFwAndacht && (
            <Field label={t("mc_urnArrangementLabel")}>
              <Dialog open={urnArrOpen} onOpenChange={setUrnArrOpen}>
                <DialogTrigger asChild>
                  <Button variant="link" size="sm" className="text-primary px-0">
                    {t("viewCatalogue")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{t("mc_urnArrangementLabel")}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {urnArrangementCatalogue.map((o) => (
                      <OptionCard
                        key={o.value}
                        title={t(o.titleKey)}
                        description={t(o.descKey)}
                        image={o.image}
                        selected={p.state.urnFlowerArrangement === o.value}
                        onClick={() => {
                          p.update({ urnFlowerArrangement: o.value });
                          setUrnArrOpen(false);
                        }}
                      />
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
              {selectedUrnArr && (
                <div className="mt-3 flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                  <img src={selectedUrnArr.image} alt={t(selectedUrnArr.titleKey)} className="h-16 w-16 rounded-md object-cover" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{t(selectedUrnArr.titleKey)}</div>
                    <div className="text-xs text-muted-foreground">{t(selectedUrnArr.descKey)}</div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => p.update({ urnFlowerArrangement: null })}>
                    {t("cancel")}
                  </Button>
                </div>
              )}
            </Field>
            )}
          </Section>
        ) : (
          <Section title={t("mc_flowers")} description={t("mc_flowersCoffinDesc")}>
            {isSeparate && (
              <div className="rounded-lg border border-primary/30 bg-primary-soft/40 p-3 text-sm text-foreground/80">
                {t("mc_separateTip")}
              </div>
            )}
            <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm text-foreground/80">
              {t("mc_floristHint")}
            </div>
            <Field label={t("mc_coffinWreathLabel")}>
              <Dialog open={coffinWreathOpen} onOpenChange={setCoffinWreathOpen}>
                <DialogTrigger asChild>
                  <Button variant="link" size="sm" className="text-primary px-0">
                    {t("viewCatalogue")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{t("mc_coffinWreathLabel")}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {coffinWreathCatalogue.map((o) => (
                      <OptionCard
                        key={o.value}
                        title={t(o.titleKey)}
                        description={t(o.descKey)}
                        image={o.image}
                        selected={p.state.coffinFlowerWreath === o.value}
                        onClick={() => {
                          p.update({ coffinFlowerWreath: o.value });
                          setCoffinWreathOpen(false);
                        }}
                      />
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
              {selectedCoffinWreath && (
                <div className="mt-3 flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                  <img src={selectedCoffinWreath.image} alt={t(selectedCoffinWreath.titleKey)} className="h-16 w-16 rounded-md object-cover" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{t(selectedCoffinWreath.titleKey)}</div>
                    <div className="text-xs text-muted-foreground">{t(selectedCoffinWreath.descKey)}</div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => p.update({ coffinFlowerWreath: null })}>
                    {t("cancel")}
                  </Button>
                </div>
              )}
            </Field>
            <Field label={t("mc_urnArrangementLabel")}>
              <Dialog open={coffinBouquetOpen} onOpenChange={setCoffinBouquetOpen}>
                <DialogTrigger asChild>
                  <Button variant="link" size="sm" className="text-primary px-0">
                    {t("viewCatalogue")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{t("mc_urnArrangementLabel")}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {urnArrangementCatalogue.map((o) => (
                      <OptionCard
                        key={o.value}
                        title={t(o.titleKey)}
                        description={t(o.descKey)}
                        image={o.image}
                        selected={p.state.coffinFlowerBouquet === o.value}
                        onClick={() => {
                          p.update({ coffinFlowerBouquet: o.value });
                          setCoffinBouquetOpen(false);
                        }}
                      />
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
              {selectedCoffinBouquet && (
                <div className="mt-3 flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                  <img src={selectedCoffinBouquet.image} alt={t(selectedCoffinBouquet.titleKey)} className="h-16 w-16 rounded-md object-cover" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{t(selectedCoffinBouquet.titleKey)}</div>
                    <div className="text-xs text-muted-foreground">{t(selectedCoffinBouquet.descKey)}</div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => p.update({ coffinFlowerBouquet: null })}>
                    {t("cancel")}
                  </Button>
                </div>
              )}
            </Field>
          </Section>
        )}

        <Section title={t("mc_rituals")} description={t("mc_ritualsDesc")}>
          <Field label={t("mc_memorialCards")} hint={t("mc_memorialCardsHint")}>
            <YesNo value={p.state.ceremonyMemorialCards} onChange={(v) => p.update({ ceremonyMemorialCards: v })} />
          </Field>
          {p.state.ceremonyMemorialCards && (
            <Field label={t("mc_memorialCardsCount")}>
              <Input
                type="number"
                min={0}
                value={p.state.ceremonyMemorialCardsCount}
                onChange={(e) => p.update({ ceremonyMemorialCardsCount: e.target.value })}
                placeholder={t("mc_memorialCardsCountPh")}
              />
            </Field>
          )}
          {!isFwAndacht && (
          <Field label={t("mc_finalGoodbye")} hint={t("mc_finalGoodbyeDesc")}>
            <div className="flex flex-wrap gap-2">
              {finalGoodbyeOptions.map((opt) => (
                <Pill
                  key={opt}
                  active={(p.state.ceremonyFinalGoodbyeRituals ?? []).includes(opt)}
                  onClick={() => toggleRitual(opt)}
                >
                  {opt}
                </Pill>
              ))}
            </div>
          </Field>
          )}
          <Field label={t("mc_ownIdeas")}>
            <Textarea
              rows={3}
              value={p.state.ceremonyRitualOwnIdeas}
              onChange={(e) => p.update({ ceremonyRitualOwnIdeas: e.target.value })}
              placeholder={t("mc_ownIdeasPh")}
            />
          </Field>
        </Section>

        <Section title={t("mc_moreIdeas")} description={t("mc_moreIdeasDesc")}>
          <Field label={t("mc_describeRituals")}>
            <Textarea
              rows={3}
              value={p.state.ceremonyRituals}
              onChange={(e) => p.update({ ceremonyRituals: e.target.value })}
              placeholder={t("mc_describeRitualsPh")}
            />
          </Field>
        </Section>
      </div>
    </StepShell>
  );
};
