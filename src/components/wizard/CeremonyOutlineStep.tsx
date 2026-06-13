import { OptionCard } from "./OptionCard";
import { StepShell } from "./StepShell";
import { Section } from "./Field";
import { YesNo, Pill } from "./Pill";
import { useLang, DictKey } from "@/lib/i18n";
import {
  WizardState,
  CemeteryCeremony,
  CemeteryNoCeremonyFollowup,
  CemeterySeparateCeremonyType,
  FriedwaldCeremony,
  SeaShipMode,
} from "@/types/wizard";

interface Props {
  state: WizardState;
  update: (p: Partial<WizardState>) => void;
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
}

export const CeremonyOutlineStep = (p: Props) => {
  const { t } = useLang();
  const loc = p.state.locationType;
  const effectiveLoc = loc ?? (p.state.burialType === "earth" ? "cemetery" : null);

  const cemeteryOptions: { value: CemeteryCeremony; titleKey: DictKey; descKey: DictKey; image: string }[] = [
    { value: "combined", titleKey: "co_combined", descKey: "co_combinedDesc", image: "/2cdc6435-ef5f-46dc-8d4b-98644f986c5b.jpg" },
    { value: "separate", titleKey: "co_separate", descKey: "co_separateDesc", image: "/359d64d2-291e-4888-9452-2a128283fda7.jpg" },
    { value: "none", titleKey: "co_none", descKey: "co_noneDesc", image: "https://media.istockphoto.com/id/520135037/de/foto/blumen-auf-frischen-grab-in-friedhof.jpg?s=1024x1024&w=is&k=20&c=CJq66M5MMVvUtZRBKgko02vzHseKNSFs9VLFsYXk4Gg=" },
  ];

  const friedwaldOptions: { value: FriedwaldCeremony; titleKey: DictKey; descKey: DictKey; image: string }[] = [
    { value: "andachtsplatz", titleKey: "co_fwAndacht", descKey: "co_fwAndachtDesc", image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=70" },
    { value: "elsewhere", titleKey: "co_fwElsewhere", descKey: "co_fwElsewhereDesc", image: "/c83981f3-4da9-48d8-ae29-c746686311d1.jpg" },
    { value: "none", titleKey: "co_fwNone", descKey: "co_fwNoneDesc", image: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=800&q=70" },
  ];

  return (
    <StepShell
      title={t("co_title")}
      subtitle={t("co_subtitle")}
      onBack={p.onBack}
      onNext={p.onNext}
      onSkip={p.onSkip}
    >
      <div className="space-y-6">
        {effectiveLoc === "cemetery" && (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              {cemeteryOptions.map((o) => (
                <OptionCard
                  key={o.value}
                  title={t(o.titleKey)}
                  description={t(o.descKey)}
                  image={o.image}
                  selected={p.state.cemeteryCeremony === o.value}
                  onClick={() => p.update({ cemeteryCeremony: p.state.cemeteryCeremony === o.value ? null : o.value })}
                />
              ))}
            </div>
            {p.state.cemeteryCeremony === "separate" && (
              <Section title={t("co_separateTypeQ")}>
                <div className="grid gap-4 sm:grid-cols-2">
                  {([
                    ["coffin", t("co_separateCoffin"), t("co_separateCoffinDesc"), "/359d64d2-291e-4888-9452-2a128283fda7.jpg"],
                    ["urn", t("co_separateUrn"), t("co_separateUrnDesc"), "/images/urns/ceramic_white.jpg"],
                  ] as [CemeterySeparateCeremonyType, string, string, string][]).map(([v, title, desc, img]) => (
                    <OptionCard
                      key={v}
                      title={title}
                      description={desc}
                      image={img}
                      selected={p.state.cemeterySeparateCeremonyType === v}
                      onClick={() => p.update({ cemeterySeparateCeremonyType: p.state.cemeterySeparateCeremonyType === v ? null : v })}
                    />
                  ))}
                </div>
              </Section>
            )}
            {p.state.cemeteryCeremony === "none" && (
              <Section title={t("co_shortAtGraveQ")}>
                <div className="flex flex-wrap gap-2">
                  {([
                    ["short_at_grave", t("co_shortAtGrave")],
                    ["none", t("co_noneAtAll")],
                  ] as [CemeteryNoCeremonyFollowup, string][]).map(([v, l]) => (
                    <Pill
                      key={v}
                      active={p.state.cemeteryNoCeremonyFollowup === v}
                      onClick={() => p.update({ cemeteryNoCeremonyFollowup: p.state.cemeteryNoCeremonyFollowup === v ? null : v })}
                    >
                      {l}
                    </Pill>
                  ))}
                </div>
              </Section>
            )}
          </>
        )}

        {effectiveLoc === "friedwald" && (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              {friedwaldOptions.map((o) => (
                <OptionCard
                  key={o.value}
                  title={t(o.titleKey)}
                  description={t(o.descKey)}
                  image={o.image}
                  selected={p.state.friedwaldCeremony === o.value}
                  onClick={() => p.update({ friedwaldCeremony: p.state.friedwaldCeremony === o.value ? null : o.value })}
                />
              ))}
            </div>
            {p.state.friedwaldCeremony === "elsewhere" && (
              <Section title={t("co_separateTypeQ")}>
                <div className="grid gap-4 sm:grid-cols-2">
                  {([
                    ["coffin", t("co_separateCoffin"), t("co_separateCoffinDesc"), "/359d64d2-291e-4888-9452-2a128283fda7.jpg"],
                    ["urn", t("co_separateUrn"), t("co_separateUrnDesc"), "/images/urns/ceramic_white.jpg"],
                  ] as [CemeterySeparateCeremonyType, string, string, string][]).map(([v, title, desc, img]) => (
                    <OptionCard
                      key={v}
                      title={title}
                      description={desc}
                      image={img}
                      selected={p.state.friedwaldElsewhereCeremonyType === v}
                      onClick={() => p.update({ friedwaldElsewhereCeremonyType: p.state.friedwaldElsewhereCeremonyType === v ? null : v })}
                    />
                  ))}
                </div>
              </Section>
            )}
            {p.state.friedwaldCeremony !== "andachtsplatz" && (
              <Section title={t("co_treeCeremonyQ")}>
                <YesNo
                  value={p.state.friedwaldTreeCeremony}
                  onChange={(v) => p.update({ friedwaldTreeCeremony: v })}
                />
              </Section>
            )}
          </>
        )}

        {effectiveLoc === "sea" && (
          <>
            <Section title={t("co_seaMainQ")} description={t("co_seaMainDesc")}>
              <img
                src="/d852709e-605a-41e7-89ae-1bcfde4c50d5.jpg"
                alt="Memorial at sea"
                className="w-full rounded-lg object-cover"
                style={{ maxHeight: "220px" }}
              />
              <YesNo
                value={p.state.seaMainCeremony === null ? null : p.state.seaMainCeremony === "yes"}
                onChange={(v) => p.update({ seaMainCeremony: v === null ? null : v ? "yes" : "no" })}
              />
            </Section>
            {p.state.seaMainCeremony === "yes" && (
              <Section title={t("co_separateTypeQ")}>
                <div className="grid gap-4 sm:grid-cols-2">
                  {([
                    ["coffin", t("co_separateCoffin"), t("co_separateCoffinDesc"), "/359d64d2-291e-4888-9452-2a128283fda7.jpg"],
                    ["urn", t("co_separateUrn"), t("co_separateUrnDesc"), "/images/urns/ceramic_white.jpg"],
                  ] as [CemeterySeparateCeremonyType, string, string, string][]).map(([v, title, desc, img]) => (
                    <OptionCard
                      key={v}
                      title={title}
                      description={desc}
                      image={img}
                      selected={p.state.seaSeparateCeremonyType === v}
                      onClick={() => p.update({ seaSeparateCeremonyType: p.state.seaSeparateCeremonyType === v ? null : v })}
                    />
                  ))}
                </div>
              </Section>
            )}
            <Section title={t("co_seaShip")} description={t("co_seaShipDesc")}>
              <div className="grid gap-4 sm:grid-cols-2">
                {([
                  ["accompanied", t("co_accompanied"), "/5b4a46f4-0198-4a8a-a3a7-ac65c2e82703.jpg"],
                  ["unaccompanied", t("co_unaccompanied"), "https://images.unsplash.com/photo-1505142468610-359e7d316be0?auto=format&fit=crop&w=800&q=70"],
                ] as [SeaShipMode, string, string][]).map(([v, l, img]) => (
                  <OptionCard
                    key={v}
                    title={l}
                    description=""
                    image={img}
                    selected={p.state.seaShipMode === v}
                    onClick={() => p.update({ seaShipMode: p.state.seaShipMode === v ? null : v })}
                  />
                ))}
              </div>
            </Section>
          </>
        )}

        {!effectiveLoc && (
          <p className="text-sm text-muted-foreground">{t("co_choosePrev")}</p>
        )}
      </div>
    </StepShell>
  );
};
