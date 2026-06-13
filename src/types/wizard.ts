import type { Lang } from "@/lib/i18n";

// =====================================================================
// Funeral Compass — full consultation wizard state
// =====================================================================

export type EntryMode = "bereavement" | "preplanning" | null;
export type PrePlanningFor = "self" | "other" | null;

// 2. Funeral type
export type BurialType = "earth" | "cremation";
export type LocationType = "cemetery" | "friedwald" | "sea";
export type SeaRegion = "nordsee" | "ostsee" | "international";

// 3. Final goodbye
export type FinalGoodbye = "coffin_closed" | "coffin_open" | "urn";

// 4. Ceremony outline
export type CemeteryCeremony =
  | "combined" // combined ceremony with burial afterwards
  | "separate" // separate ceremony before burial
  | "none"; // no main ceremony
export type CemeteryNoCeremonyFollowup = "short_at_grave" | "none";
export type CemeterySeparateCeremonyType = "coffin" | "urn";

export type FriedwaldCeremony = "andachtsplatz" | "elsewhere" | "none";

export type SeaMainCeremony = "yes" | "no";
export type SeaShipMode = "accompanied" | "unaccompanied";

// 5. Main ceremony
export type SpeakerType = "cleric" | "free_speaker" | "relative" | "none";
export type MusicType = "playback" | "organ" | "live" | "none";
export type DecorationStyle = "normal" | "simple" | "none";

// 6. Sub-ceremony at grave / tree / sea
export type SeaSpeakerType = "captain" | "speaker" | "relative" | "none";

// 7. Coffin & urn
export type CoffinSelection = "catalogue" | "other" | "unsure";
export type CatalogueCoffin =
  | "cremation_standard"
  | "cremation_simple"
  | "cremation_eco"
  | "oak_classic"
  | "pine_natural"
  | "walnut_dark"
  | "willow_woven"
  | "white_simple"
  | "cardboard_eco";
export type CatalogueUrn =
  | "ceramic_white"
  | "wooden_oak"
  | "bronze_classic"
  | "bio_natural"
  | "stone_grey"
  | "glass_modern";
export type ClothingChoice = "own" | "shroud" | "current";
export type PillowsChoice = "catalogue" | "own" | "none";
export type PillowsCatalogue = "satin_white" | "linen_natural" | "silk_cream";
export type FlowerChoice = "wreath" | "bouquet" | "single_flowers" | "none";
export type CeremonyVenue = "cemetery" | "elsewhere";

// 8. Grave
export type GraveTypeKind = "single" | "family" | "tree" | "anonymous";
export type GraveExisting = "yes" | "no" | "anonymous";
export type CemeteryEarthGraveType = "classical" | "lawn";
export type CemeteryCremationGraveType =
  | "classical"
  | "lawn"
  | "tree"
  | "urn_wall"
  | "gardened_field";
export type FriedwaldGraveOption =
  | "partner_tree"
  | "generation_tree"
  | "shared_tree"
  | "shared_base_site";

// 9 & 10
export type SympathyAmount = "10" | "50" | "100";

export interface WizardState {
  // 1. Introduction
  mode: EntryMode;
  deceasedName: string;
  deceasedLocation: string;
  prePlanningFor: PrePlanningFor;
  prePlanningName: string;

  // 2. Funeral type
  burialType: BurialType | null;
  locationType: LocationType | null;
  cemeteryName: string;
  friedwaldName: string;
  seaRegion: SeaRegion | null;

  // 3. Final goodbye
  finalGoodbye: FinalGoodbye | null;

  // 4. Ceremony outline
  cemeteryCeremony: CemeteryCeremony | null;
  cemeteryNoCeremonyFollowup: CemeteryNoCeremonyFollowup | null;
  cemeterySeparateCeremonyType: CemeterySeparateCeremonyType | null;
  friedwaldCeremony: FriedwaldCeremony | null;
  friedwaldElsewhereCeremonyType: CemeterySeparateCeremonyType | null;
  friedwaldTreeCeremony: boolean | null;
  seaMainCeremony: SeaMainCeremony | null;
  seaSeparateCeremonyType: CemeterySeparateCeremonyType | null;
  seaShipMode: SeaShipMode | null;

  // 5. Main ceremony
  ceremonyVenue: CeremonyVenue | null;
  ceremonyPlace: string;
  ceremonyFinalGoodbye: string;
  ceremonyFinalGoodbyeRituals: string[];
  ceremonySpeaker: SpeakerType | null;
  ceremonyMusic: MusicType | null;
  ceremonyMusicWishes: string;
  ceremonyDecoration: DecorationStyle | null;
  ceremonyPicture: boolean | null;
  ceremonyPersonalItems: boolean | null;
  ceremonyPersonalItemsText: string;
  ceremonyFlowers: boolean | null;
  ceremonyFlowerType: FlowerChoice | null;
  ceremonyFlowerTypes: FlowerChoice[];
  ceremonyFlowerStyle: "normal" | "simple" | null;
  ceremonySpeakerWishes: string;
  ceremonyFlowerWreath: boolean | null;
  ceremonyFlowerBouquet: boolean | null;
  ceremonyFlowerSingle: boolean | null;
  urnFlowerWreath: string | null;
  urnFlowerArrangement: string | null;
  coffinFlowerWreath: string | null;
  coffinFlowerBouquet: string | null;
  ceremonyDecorationText: string;
  ceremonyRituals: string;
  ceremonyRitualOwnIdeas: string;
  ceremonyMemorialCards: boolean | null;
  ceremonyMemorialCardsCount: string;

  // 6. Sub-ceremony
  subSpeaker: SpeakerType | null;
  subSeaSpeaker: SeaSpeakerType | null;
  subSpeakerWishes: string;
  subMusic: MusicType | null;
  subMusicWishes: string;
  subPicture: boolean | null;
  subFlowersAtUrn: boolean | null;
  subSeaFlowerType: "wreath" | "bouquet" | "none" | null;
  subSeaUrnWreath: string | null;
  subSeaCatering: boolean | null;
  subSeaCateringItems: string[];
  subSeaPetals: boolean | null;
  seaDeparturePort: string;

  // 7. Coffin & urn
  coffinSelection: CoffinSelection | null;
  coffinCatalogue: CatalogueCoffin | null;
  coffinOther: string;
  publicViewing: boolean | null;
  clothing: ClothingChoice | null;
  pillows: PillowsChoice | null;
  pillowsCatalogue: PillowsCatalogue | null;
  graveGoods: boolean | null;
  graveGoodsText: string;
  urnSelection: CoffinSelection | null;
  urnCatalogue: CatalogueUrn | null;
  urnOther: string;

  // 8. Grave
  graveTypeKind: GraveTypeKind | null;
  existingGrave: GraveExisting | null;
  graveNumber: string;
  graveFuturePeople: boolean | null;
  cemeteryEarthGrave: CemeteryEarthGraveType | null;
  cemeteryCremationGrave: CemeteryCremationGraveType | null;
  graveCross: boolean | null;
  friedwaldExisting: GraveExisting | null;
  friedwaldTreeNumber: string;
  friedwaldGraveOption: FriedwaldGraveOption | null;
  friedwaldNamePlate: boolean | null;

  // 9. Obituary
  obituaryBefore: boolean | null;
  obituaryBeforeMode: "known" | "local" | "region" | null;
  obituaryBeforeWhere: string;
  obituaryBeforeIncludeDate: boolean | null;
  obituaryAfter: boolean | null;
  obituaryAfterMode: "known" | "local" | "region" | null;
  obituaryAfterWhere: string;


  // 10. Sympathy cards
  sympathyBefore: boolean | null;
  sympathyBeforeAmount: SympathyAmount | null;
  sympathyBeforeIncludeDate: boolean | null;
  sympathyAfter: boolean | null;
  sympathyAfterAmount: SympathyAmount | null;
  memorialJewelry: boolean | null;


  // 11. Post-death assistance
  assistanceWanted: boolean | null;
}

export const initialState: WizardState = {
  mode: null,
  deceasedName: "",
  deceasedLocation: "",
  prePlanningFor: null,
  prePlanningName: "",

  burialType: null,
  locationType: null,
  cemeteryName: "",
  friedwaldName: "",
  seaRegion: null,

  finalGoodbye: null,

  cemeteryCeremony: null,
  cemeteryNoCeremonyFollowup: null,
  cemeterySeparateCeremonyType: null,
  friedwaldCeremony: null,
  friedwaldElsewhereCeremonyType: null,
  friedwaldTreeCeremony: null,
  seaMainCeremony: null,
  seaSeparateCeremonyType: null,
  seaShipMode: null,

  ceremonyVenue: null,
  ceremonyPlace: "",
  ceremonyFinalGoodbye: "",
  ceremonyFinalGoodbyeRituals: [],
  ceremonySpeaker: null,
  ceremonyMusic: null,
  ceremonyMusicWishes: "",
  ceremonyDecoration: null,
  ceremonyPicture: null,
  ceremonyPersonalItems: null,
  ceremonyPersonalItemsText: "",
  ceremonyFlowers: null,
  ceremonyFlowerType: null,
  ceremonyFlowerTypes: [],
  ceremonyFlowerStyle: null,
  ceremonySpeakerWishes: "",
  ceremonyFlowerWreath: null,
  ceremonyFlowerBouquet: null,
  ceremonyFlowerSingle: null,
  urnFlowerWreath: null,
  urnFlowerArrangement: null,
  coffinFlowerWreath: null,
  coffinFlowerBouquet: null,
  ceremonyDecorationText: "",
  ceremonyRituals: "",
  ceremonyRitualOwnIdeas: "",
  ceremonyMemorialCards: null,
  ceremonyMemorialCardsCount: "",

  subSpeaker: null,
  subSeaSpeaker: null,
  subSpeakerWishes: "",
  subMusic: null,
  subMusicWishes: "",
  subPicture: null,
  subFlowersAtUrn: null,
  subSeaFlowerType: null,
  subSeaUrnWreath: null,
  subSeaCatering: null,
  subSeaCateringItems: [],
  subSeaPetals: null,
  seaDeparturePort: "",

  coffinSelection: null,
  coffinCatalogue: null,
  coffinOther: "",
  publicViewing: null,
  clothing: null,
  pillows: null,
  pillowsCatalogue: null,
  graveGoods: null,
  graveGoodsText: "",
  urnSelection: null,
  urnCatalogue: null,
  urnOther: "",

  graveTypeKind: null,
  existingGrave: null,
  graveNumber: "",
  graveFuturePeople: null,
  cemeteryEarthGrave: null,
  cemeteryCremationGrave: null,
  graveCross: null,
  friedwaldExisting: null,
  friedwaldTreeNumber: "",
  friedwaldGraveOption: null,
  friedwaldNamePlate: null,

  obituaryBefore: null,
  obituaryBeforeMode: null,
  obituaryBeforeWhere: "",
  obituaryBeforeIncludeDate: null,
  obituaryAfter: null,
  obituaryAfterMode: null,
  obituaryAfterWhere: "",

  sympathyBefore: null,
  sympathyBeforeAmount: null,
  sympathyBeforeIncludeDate: null,
  sympathyAfter: null,
  sympathyAfterAmount: null,
  memorialJewelry: null,


  assistanceWanted: null,
};

// =====================================================================
// Costs (illustrative EUR estimates)
// =====================================================================
export const COSTS = {
  base: 1200,
  burial: { earth: 800, cremation: 500 } as Record<BurialType, number>,
  location: { cemetery: 1000, friedwald: 1400, sea: 1800 } as Record<LocationType, number>,
  finalGoodbye: { coffin_closed: 0, coffin_open: 150, urn: 0 } as Record<FinalGoodbye, number>,
  mainCeremony: 600,
  subCeremony: 250,
  coffin: { catalogue: 900, other: 1200, unsure: 950 } as Record<CoffinSelection, number>,
  urn: { catalogue: 250, other: 350, unsure: 280 } as Record<CoffinSelection, number>,
  // Average fallbacks used when an option is left unselected
  avgBurial: 650,
  avgLocation: 1200,
  avgFinalGoodbye: 75,
  avgCoffin: 950,
  avgUrn: 280,
  avgGraveCemeteryEarth: 1500,
  avgGraveCemeteryCremation: 1150,
  avgFriedwald: 2200,
  avgPillows: 50,
  publicViewing: 200,
  pillows: { catalogue: 80, own: 0, none: 0 } as Record<PillowsChoice, number>,
  graveCemeteryEarth: { classical: 1800, lawn: 1200 } as Record<CemeteryEarthGraveType, number>,
  graveCemeteryCremation: {
    classical: 1500,
    lawn: 1000,
    tree: 1100,
    urn_wall: 900,
    gardened_field: 1300,
  } as Record<CemeteryCremationGraveType, number>,
  friedwald: {
    partner_tree: 2800,
    generation_tree: 4200,
    shared_tree: 1100,
    shared_base_site: 800,
  } as Record<FriedwaldGraveOption, number>,
  graveCross: 250,
  namePlate: 180,
  obituary: 350,
  sympathy: { "10": 40, "50": 180, "100": 320 } as Record<SympathyAmount, number>,
  memorialJewelry: 150,
  assistance: 450,
};

export interface CostBreakdown {
  step: StepId | "base";
  label: string;
  amount: number;
  estimated: boolean;
}

const costLabels: Record<Lang, {
  base: string;
  burialFallback: string;
  locationFallback: string;
  finalGoodbye: string;
  mainCeremony: string;
  subCeremony: string;
  coffin: string;
  urn: string;
  bedding: string;
  publicViewing: string;
  cemeteryGrave: string;
  graveCross: string;
  namePlate: string;
  obituaryBefore: string;
  obituaryAfter: string;
  sympathyBefore: (amount: SympathyAmount) => string;
  sympathyAfter: (amount: SympathyAmount) => string;
  memorialJewelry: string;
  assistance: string;
  burial: Record<BurialType, string>;
  location: Record<LocationType, string>;
  earthGrave: Record<CemeteryEarthGraveType, string>;
  cremGrave: Record<CemeteryCremationGraveType, string>;
  friedwald: Record<FriedwaldGraveOption, string>;
}> = {
  en: {
    base: "Base service fee",
    burialFallback: "Method of burial",
    locationFallback: "Place of rest",
    finalGoodbye: "Personal farewell",
    mainCeremony: "Funeral ceremony",
    subCeremony: "Graveside service",
    coffin: "Coffin",
    urn: "Urn",
    bedding: "Bedding",
    publicViewing: "Public viewing",
    cemeteryGrave: "Cemetery grave",
    graveCross: "Grave cross",
    namePlate: "Name plate on tree",
    obituaryBefore: "Obituary (before service)",
    obituaryAfter: "Obituary (after service)",
    sympathyBefore: (amount) => `Sympathy cards - before service (${amount})`,
    sympathyAfter: (amount) => `Sympathy cards - after service (${amount})`,
    memorialJewelry: "Memorial jewellery (keepsake)",
    assistance: "Administrative support",
    burial: { earth: "Traditional burial", cremation: "Cremation" },
    location: { cemetery: "Cemetery plot", friedwald: "FriedWald placement", sea: "Sea burial" },
    earthGrave: { classical: "Traditional plot", lawn: "Lawn grave" },
    cremGrave: {
      classical: "Traditional urn plot",
      lawn: "Urn lawn grave",
      tree: "Cemetery tree burial",
      urn_wall: "Urn wall (Columbarium)",
      gardened_field: "Managed memorial field",
    },
    friedwald: {
      partner_tree: "Partner tree",
      generation_tree: "Family / generation tree",
      shared_tree: "Shared tree",
      shared_base_site: "Standard base tree",
    },
  },
  de: {
    base: "Grundservice",
    burialFallback: "Bestattungsform",
    locationFallback: "Beisetzungsort",
    finalGoodbye: "Letzter Abschied",
    mainCeremony: "Trauerfeier",
    subCeremony: "Zeremonie am Grab",
    coffin: "Sarg",
    urn: "Urne",
    bedding: "Kissen & Decke",
    publicViewing: "Aufbahrung",
    cemeteryGrave: "Friedhofsgrab",
    graveCross: "Grabkreuz",
    namePlate: "Namensschild am Baum",
    obituaryBefore: "Traueranzeige vor der Feier",
    obituaryAfter: "Traueranzeige nach der Feier",
    sympathyBefore: (amount) => `Trauerkarten vor der Feier (${amount})`,
    sympathyAfter: (amount) => `Trauerkarten nach der Feier (${amount})`,
    memorialJewelry: "Erinnerungsschmuck",
    assistance: "Unterstützung bei Formalitäten",
    burial: { earth: "Erdbestattung", cremation: "Feuerbestattung" },
    location: { cemetery: "Friedhofsgrab", friedwald: "FriedWald-Platz", sea: "Seebestattung" },
    earthGrave: { classical: "Klassisches Grab", lawn: "Rasengrab" },
    cremGrave: {
      classical: "Klassisches Urnengrab",
      lawn: "Urnen-Rasengrab",
      tree: "Baumgrab auf dem Friedhof",
      urn_wall: "Urnenwand (Kolumbarium)",
      gardened_field: "Gärtnerbetreutes Grabfeld",
    },
    friedwald: {
      partner_tree: "Partnerbaum",
      generation_tree: "Familien-/Generationenbaum",
      shared_tree: "Platz am Gemeinschaftsbaum",
      shared_base_site: "Platz am Basisbaum",
    },
  },
};

export function calculateBreakdown(s: WizardState, lang: Lang = "en"): CostBreakdown[] {
  const L = costLabels[lang];
  const out: CostBreakdown[] = [];
  out.push({ step: "base", label: L.base, amount: COSTS.base, estimated: false });

  // Funeral type
  out.push({
    step: "funeralType",
    label: s.burialType ? L.burial[s.burialType] : L.burialFallback,
    amount: s.burialType ? COSTS.burial[s.burialType] : COSTS.avgBurial,
    estimated: !s.burialType,
  });
  out.push({
    step: "funeralType",
    label: s.locationType ? L.location[s.locationType] : L.locationFallback,
    amount: s.locationType ? COSTS.location[s.locationType] : COSTS.avgLocation,
    estimated: !s.locationType,
  });

  // Final goodbye
  out.push({
    step: "finalGoodbye",
    label: L.finalGoodbye,
    amount: s.finalGoodbye ? COSTS.finalGoodbye[s.finalGoodbye] : COSTS.avgFinalGoodbye,
    estimated: !s.finalGoodbye,
  });

  // Main ceremony
  const hasMainCeremony =
    (s.locationType === "cemetery" && (s.cemeteryCeremony === "combined" || s.cemeteryCeremony === "separate")) ||
    (s.locationType === "friedwald" && (s.friedwaldCeremony === "andachtsplatz" || s.friedwaldCeremony === "elsewhere")) ||
    (s.locationType === "sea" && s.seaMainCeremony === "yes");
  if (hasMainCeremony) {
    out.push({ step: "mainCeremony", label: L.mainCeremony, amount: COSTS.mainCeremony, estimated: false });
  }

  const hasSub =
    (s.locationType === "cemetery" && (s.cemeteryCeremony === "separate" || (s.cemeteryCeremony === "none" && s.cemeteryNoCeremonyFollowup === "short_at_grave"))) ||
    (s.locationType === "friedwald" && s.friedwaldTreeCeremony === true && s.friedwaldCeremony !== "andachtsplatz") ||
    (s.locationType === "sea" && s.seaShipMode === "accompanied");
  if (hasSub) {
    out.push({ step: "subCeremony", label: L.subCeremony, amount: COSTS.subCeremony, estimated: false });
  }

  // Coffin & urn
  out.push({
    step: "coffinUrn",
    label: L.coffin,
    amount: s.coffinSelection ? COSTS.coffin[s.coffinSelection] : COSTS.avgCoffin,
    estimated: !s.coffinSelection,
  });
  if (s.burialType === "cremation") {
    out.push({
      step: "coffinUrn",
      label: L.urn,
      amount: s.urnSelection ? COSTS.urn[s.urnSelection] : COSTS.avgUrn,
      estimated: !s.urnSelection,
    });
  }
  if (s.pillows && s.pillows !== "none") {
    out.push({ step: "coffinUrn", label: L.bedding, amount: COSTS.pillows[s.pillows], estimated: false });
  }
  if (s.publicViewing) {
    out.push({ step: "mainCeremony", label: L.publicViewing, amount: COSTS.publicViewing, estimated: false });
  }

  // Grave
  if (s.locationType === "cemetery" && s.burialType === "earth") {
    out.push({
      step: "grave",
      label: s.cemeteryEarthGrave ? L.earthGrave[s.cemeteryEarthGrave] : L.cemeteryGrave,
      amount: s.cemeteryEarthGrave ? COSTS.graveCemeteryEarth[s.cemeteryEarthGrave] : COSTS.avgGraveCemeteryEarth,
      estimated: !s.cemeteryEarthGrave,
    });
  }
  if (s.locationType === "cemetery" && s.burialType === "cremation") {
    out.push({
      step: "grave",
      label: s.cemeteryCremationGrave ? L.cremGrave[s.cemeteryCremationGrave] : L.cemeteryGrave,
      amount: s.cemeteryCremationGrave ? COSTS.graveCemeteryCremation[s.cemeteryCremationGrave] : COSTS.avgGraveCemeteryCremation,
      estimated: !s.cemeteryCremationGrave,
    });
  }
  if (s.graveCross) out.push({ step: "grave", label: L.graveCross, amount: COSTS.graveCross, estimated: false });
  if (s.locationType === "friedwald") {
    out.push({
      step: "grave",
      label: s.friedwaldGraveOption ? L.friedwald[s.friedwaldGraveOption] : L.location.friedwald,
      amount: s.friedwaldGraveOption ? COSTS.friedwald[s.friedwaldGraveOption] : COSTS.avgFriedwald,
      estimated: !s.friedwaldGraveOption,
    });
    if (s.friedwaldNamePlate) out.push({ step: "grave", label: L.namePlate, amount: COSTS.namePlate, estimated: false });
  }

  // Obituary
  if (s.obituaryBefore) out.push({ step: "obituary", label: L.obituaryBefore, amount: COSTS.obituary, estimated: false });
  if (s.obituaryAfter) out.push({ step: "obituary", label: L.obituaryAfter, amount: COSTS.obituary, estimated: false });

  // Sympathy
  if (s.sympathyBefore && s.sympathyBeforeAmount) {
    out.push({ step: "sympathy", label: L.sympathyBefore(s.sympathyBeforeAmount), amount: COSTS.sympathy[s.sympathyBeforeAmount], estimated: false });
  }
  if (s.sympathyAfter && s.sympathyAfterAmount) {
    out.push({ step: "sympathy", label: L.sympathyAfter(s.sympathyAfterAmount), amount: COSTS.sympathy[s.sympathyAfterAmount], estimated: false });
  }
  if (s.memorialJewelry) {
    out.push({ step: "sympathy", label: L.memorialJewelry, amount: COSTS.memorialJewelry, estimated: true });
  }

  // Assistance
  if (s.assistanceWanted) out.push({ step: "assistance", label: L.assistance, amount: COSTS.assistance, estimated: false });

  return out;
}

export function calculateTotal(s: WizardState, lang: Lang = "en"): number {
  return calculateBreakdown(s, lang).reduce((sum, l) => sum + l.amount, 0);
}

export function formatEUR(n: number, lang: Lang = "en"): string {
  return new Intl.NumberFormat(lang === "de" ? "de-DE" : "en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

// =====================================================================
// Conditional step list
// =====================================================================
export type StepId =
  | "intro"
  | "funeralType"
  | "finalGoodbye"
  | "ceremonyOutline"
  | "mainCeremony"
  | "subCeremony"
  | "coffinUrn"
  | "grave"
  | "obituary"
  | "sympathy"
  | "assistance"
  | "summary";

export interface StepDef {
  id: StepId;
  label: string;
}

export function buildSteps(s: WizardState): StepDef[] {
  const steps: StepDef[] = [
    { id: "intro", label: "Introduction" },
    { id: "funeralType", label: "Funeral type" },
    { id: "finalGoodbye", label: "Final goodbye" },
    { id: "ceremonyOutline", label: "Ceremony outline" },
  ];

  const hasMainCeremony =
    (s.locationType === "cemetery" && (s.cemeteryCeremony === "combined" || s.cemeteryCeremony === "separate")) ||
    (s.locationType === "friedwald" && (s.friedwaldCeremony === "andachtsplatz" || s.friedwaldCeremony === "elsewhere")) ||
    (s.locationType === "sea" && s.seaMainCeremony === "yes");
  if (hasMainCeremony) steps.push({ id: "mainCeremony", label: "Main ceremony" });

  const hasSub =
    (s.locationType === "cemetery" && (s.cemeteryCeremony === "separate" || (s.cemeteryCeremony === "none" && s.cemeteryNoCeremonyFollowup === "short_at_grave"))) ||
    (s.locationType === "friedwald" && s.friedwaldTreeCeremony === true && s.friedwaldCeremony !== "andachtsplatz") ||
    (s.locationType === "sea" && s.seaShipMode === "accompanied");
  if (hasSub) steps.push({ id: "subCeremony", label: "Ceremony at grave" });

  steps.push({ id: "coffinUrn", label: "Coffin & urn" });
  steps.push({ id: "grave", label: "Grave" });
  steps.push({ id: "obituary", label: "Obituary" });
  steps.push({ id: "sympathy", label: "Sympathy cards" });
  steps.push({ id: "assistance", label: "Assistance" });
  steps.push({ id: "summary", label: "Summary" });

  return steps;
}
