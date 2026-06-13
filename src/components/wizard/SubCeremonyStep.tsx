import { useState } from "react";
import { StepShell } from "./StepShell";
import { Field, Section } from "./Field";
import { Pill, YesNo } from "./Pill";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { OptionCard } from "./OptionCard";
import { urnWreathCatalogue } from "@/lib/flowerCatalogues";
import { useLang } from "@/lib/i18n";
import { WizardState, SpeakerType, SeaSpeakerType, MusicType } from "@/types/wizard";

interface Props {
  state: WizardState;
  update: (p: Partial<WizardState>) => void;
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
}

export const SubCeremonyStep = (p: Props) => {
  const { t } = useLang();
  const [seaWreathOpen, setSeaWreathOpen] = useState(false);
  const selectedSeaWreath = urnWreathCatalogue.find((u) => u.value === p.state.subSeaUrnWreath);
  const isCemetery = p.state.locationType === "cemetery";
  const isFriedwald = p.state.locationType === "friedwald";
  const isSea = p.state.locationType === "sea";

  const title = isCemetery ? t("sc_atGrave") : isFriedwald ? t("sc_atTree") : t("sc_atShip");

  const musicOptions: [MusicType, string][] = [
    ["playback", t("sc_playback")],
    ["live", t("sc_live")],
    ["none", t("sc_none")],
  ];

  return (
    <StepShell
      title={title}
      subtitle={t("sc_subtitle")}
      onBack={p.onBack}
      onNext={p.onNext}
      onSkip={p.onSkip}
    >
      <div className="space-y-5">
        {(isCemetery || isFriedwald) && (
          <Section title={t("sc_speaker")}>
            <div className="flex flex-wrap gap-2">
              {([
                ["cleric", t("sc_cleric")],
                ["free_speaker", t("mc_freeSpeaker")],
                ["relative", t("mc_relative")],
                ...(isCemetery ? ([["none", t("sc_noSpeaker")]] as [SpeakerType, string][]) : []),
              ] as [SpeakerType, string][]).map(([v, l]) => (
                <Pill key={v} active={p.state.subSpeaker === v} onClick={() => p.update({ subSpeaker: v })}>
                  {l}
                </Pill>
              ))}
            </div>
            {p.state.subSpeaker && p.state.subSpeaker !== "none" && (
              <Field label={t("mc_speakerWishes")} hint={t("mc_speakerWishesHint")}>
                <Textarea
                  rows={3}
                  value={p.state.subSpeakerWishes}
                  onChange={(e) => p.update({ subSpeakerWishes: e.target.value })}
                  placeholder={t("mc_speakerWishesPh")}
                />
              </Field>
            )}
          </Section>
        )}

        {isSea && (
          <Section title={t("sc_speaker")}>
            <div className="flex flex-wrap gap-2">
              {([
                ["captain", t("sc_captain")],
                ["speaker", t("mc_freeSpeaker")],
                ["relative", t("mc_relative")],
                ["none", t("sc_noSpeaker")],
              ] as [SeaSpeakerType, string][]).map(([v, l]) => (
                <Pill key={v} active={p.state.subSeaSpeaker === v} onClick={() => p.update({ subSeaSpeaker: p.state.subSeaSpeaker === v ? null : v })}>
                  {l}
                </Pill>
              ))}
            </div>
            {p.state.subSeaSpeaker && p.state.subSeaSpeaker !== "none" && (
              <Field label={t("mc_speakerWishes")} hint={t("mc_speakerWishesHint")}>
                <Textarea
                  rows={3}
                  value={p.state.subSpeakerWishes}
                  onChange={(e) => p.update({ subSpeakerWishes: e.target.value })}
                  placeholder={t("mc_speakerWishesPh")}
                />
              </Field>
            )}
          </Section>
        )}

        <Section title={t("mc_music")}>
          <div className="flex flex-wrap gap-2">
            {musicOptions.map(([v, l]) => (
              <Pill key={v} active={p.state.subMusic === v} onClick={() => p.update({ subMusic: v })}>
                {l}
              </Pill>
            ))}
          </div>
          {p.state.subMusic && p.state.subMusic !== "none" && (
            <Field label={t("mc_songWishes")} hint={t("mc_songWishesHint")}>
              <Textarea
                rows={2}
                value={p.state.subMusicWishes}
                onChange={(e) => p.update({ subMusicWishes: e.target.value })}
                placeholder={t("mc_songWishesPh")}
              />
            </Field>
          )}
        </Section>

        <Section title={t("sc_picture")}>
          <Field label={t("sc_pictureQ")}>
            <YesNo value={p.state.subPicture} onChange={(v) => p.update({ subPicture: v })} />
          </Field>
        </Section>

        {isSea && (
          <>
            <Section title={t("sc_seaFlowers")}>
              <Field label={t("mc_urnWreathLabel")}>
                <Dialog open={seaWreathOpen} onOpenChange={setSeaWreathOpen}>
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
                          selected={p.state.subSeaUrnWreath === o.value}
                          onClick={() => {
                            p.update({ subSeaUrnWreath: o.value });
                            setSeaWreathOpen(false);
                          }}
                        />
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
                {selectedSeaWreath && (
                  <div className="mt-3 flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                    <img src={selectedSeaWreath.image} alt={t(selectedSeaWreath.titleKey)} className="h-16 w-16 rounded-md object-cover" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{t(selectedSeaWreath.titleKey)}</div>
                      <div className="text-xs text-muted-foreground">{t(selectedSeaWreath.descKey)}</div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => p.update({ subSeaUrnWreath: null })}>
                      {t("cancel")}
                    </Button>
                  </div>
                )}
              </Field>
            </Section>


            <Section title={t("sc_seaCatering")}>
              <Field label={t("sc_seaCateringQ")}>
                <YesNo value={p.state.subSeaCatering} onChange={(v) => p.update({ subSeaCatering: v, subSeaCateringItems: v ? p.state.subSeaCateringItems : [] })} />
              </Field>
              {p.state.subSeaCatering && (
                <div className="flex flex-wrap gap-2">
                  {([
                    ["drinks", t("sc_seaCat_drinks")],
                    ["cake", t("sc_seaCat_cake")],
                    ["savoury", t("sc_seaCat_savoury")],
                  ] as [string, string][]).map(([v, l]) => {
                    const active = p.state.subSeaCateringItems.includes(v);
                    return (
                      <Pill
                        key={v}
                        active={active}
                        onClick={() =>
                          p.update({
                            subSeaCateringItems: active
                              ? p.state.subSeaCateringItems.filter((x) => x !== v)
                              : [...p.state.subSeaCateringItems, v],
                          })
                        }
                      >
                        {l}
                      </Pill>
                    );
                  })}
                </div>
              )}
            </Section>

            <Section title={t("sc_seaRituals")}>
              <Field label={t("sc_seaPetalsQ")}>
                <YesNo value={p.state.subSeaPetals} onChange={(v) => p.update({ subSeaPetals: v })} />
              </Field>
            </Section>
          </>
        )}
      </div>
    </StepShell>
  );
};
