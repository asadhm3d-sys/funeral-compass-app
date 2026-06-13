import { WizardState } from "@/types/wizard";
import type { Lang } from "@/lib/i18n";

// ── English labels ────────────────────────────────────────────────────────────

const labelsEN = {
  burial: { earth: "Traditional burial", cremation: "Cremation" },
  location: { cemetery: "Cemetery", friedwald: "FriedWald (forest burial)", sea: "Sea burial" },
  seaRegion: { nordsee: "North Sea", ostsee: "Baltic Sea", international: "International" },
  finalGoodbye: {
    coffin_closed: "At the closed coffin",
    coffin_open: "At the open coffin",
    urn: "At the urn",
  },
  cemeteryCeremony: {
    combined: "Ceremony with burial",
    separate: "Ceremony before burial (separate)",
    none: "No main ceremony",
  },
  friedwaldCeremony: {
    andachtsplatz: "At the FriedWald forest site",
    elsewhere: "At another location",
    none: "No ceremony",
  },
  shipMode: { accompanied: "Accompanied (family on board)", unaccompanied: "Unaccompanied" },
  speaker: { cleric: "Clergy", free_speaker: "Funeral celebrant", relative: "Family member or friend", none: "No speaker" },
  seaSpeaker: { captain: "Captain", speaker: "Funeral celebrant", relative: "Family member or friend" },
  music: { playback: "Recorded music", organ: "Organ", live: "Live musicians", none: "No music" },
  decoration: { normal: "Traditional", simple: "Minimalist", none: "None" },
  coffinSelection: { catalogue: "From catalogue", other: "Custom request", unsure: "Decide later" },
  clothing: { own: "Personal clothing", shroud: "Traditional shroud", current: "Remaining clothing" },
  pillows: { catalogue: "From catalogue", own: "Personal bedding", none: "None" },
  existing: { yes: "Existing grave", no: "New grave needed", anonymous: "Anonymous burial" },
  cemEarthGrave: { classical: "Traditional plot", lawn: "Lawn grave" },
  cemCremGrave: {
    classical: "Traditional urn plot",
    lawn: "Urn lawn grave",
    tree: "Cemetery tree burial",
    urn_wall: "Urn wall (Columbarium)",
    gardened_field: "Managed memorial field",
  },
  friedwaldOption: {
    partner_tree: "Partner tree",
    generation_tree: "Family / generation tree",
    shared_tree: "Shared community tree",
    shared_base_site: "Standard base tree",
  },
  amount: { "10": "≈ 10", "50": "≈ 50", "100": "100+" },

  // Summary group titles
  groups: {
    intro: "Introduction",
    funeralType: "Type of farewell",
    finalGoodbye: "Personal farewell",
    ceremonyOutline: "Ceremony structure",
    mainCeremony: "The ceremony",
    subCeremony: "Graveside service",
    coffinUrn: "Coffin & Urn",
    grave: "Resting place",
    obituary: "Obituary",
    sympathy: "Sympathy cards",
    assistance: "Post-bereavement support",
  },

  // Summary row labels
  rows: {
    mode: "Reason for visit",
    modeBereavement: "Recent bereavement",
    modePreplanning: "Pre-planning",
    deceasedName: "Name of the deceased",
    deceasedLocation: "Current location",
    planningFor: "Planning for",
    planningForSelf: "Myself",
    planningForOther: "A loved one",
    name: "Name",
    burialType: "Method of burial",
    locationType: "Place of rest",
    cemetery: "Cemetery",
    friedwald: "FriedWald",
    seaRegion: "Sea region",
    finalGoodbyeType: "Farewell type",
    ceremony: "Ceremony",
    atGrave: "At the grave",
    shortAtGrave: "Brief graveside ceremony",
    noCeremony: "No ceremony",
    ceremonyAtTree: "Ceremony at the tree",
    mainCeremonyBefore: "Ceremony before burial",
    onBoard: "On board",
    ceremonyPlace: "Location",
    ceremonyFinalGoodbye: "Farewell ritual",
    speaker: "Speaker",
    music: "Music",
    decoration: "Decoration",
    decorationNotes: "Decoration notes",
    picture: "Photograph displayed",
    personalItems: "Personal items",
    flowers: "Floral arrangements",
    rituals: "Rituals",
    publicViewing: "Public viewing",
    clothing: "Clothing",
    pillows: "Pillow & blanket",
    graveGoods: "Coffin keepsakes",
    urn: "Urn",
    existingGrave: "Grave",
    graveNumber: "Grave reference",
    graveFuturePeople: "Future family burials",
    graveType: "Grave style",
    graveCross: "Grave cross",
    reservedTree: "Tree",
    treeNumber: "Tree reference",
    placeType: "Placement type",
    namePlate: "Name plate on tree",
    beforeService: "Before the service",
    memorialJewelry: "Memorial jewellery",
    afterService: "After the service",
    helpWanted: "Assistance requested",
    yes: "Yes",
    no: "No",
  },
} as const;

// ── German labels ─────────────────────────────────────────────────────────────

const labelsDE = {
  burial: { earth: "Erdbestattung", cremation: "Feuerbestattung" },
  location: { cemetery: "Friedhof", friedwald: "FriedWald", sea: "Seebestattung" },
  seaRegion: { nordsee: "Nordsee", ostsee: "Ostsee", international: "International" },
  finalGoodbye: {
    coffin_closed: "Am geschlossenen Sarg",
    coffin_open: "Am offenen Sarg (Aufbahrung)",
    urn: "An der Urne",
  },
  cemeteryCeremony: {
    combined: "Trauerfeier mit anschließender Beisetzung",
    separate: "Trauerfeier getrennt von der Beisetzung",
    none: "Keine Trauerfeier",
  },
  friedwaldCeremony: {
    andachtsplatz: "Am FriedWald-Andachtsplatz",
    elsewhere: "An einem anderen Ort",
    none: "Keine Zeremonie",
  },
  shipMode: { accompanied: "Begleitet (Familie an Bord)", unaccompanied: "Unbegleitet" },
  speaker: { cleric: "Geistlicher", free_speaker: "Freier Redner", relative: "Angehöriger oder Freund", none: "Kein Redner" },
  seaSpeaker: { captain: "Kapitän", speaker: "Freier Redner", relative: "Angehöriger oder Freund" },
  music: { playback: "Musikanlage", organ: "Orgel", live: "Live-Musik", none: "Keine Musik" },
  decoration: { normal: "Klassisch", simple: "Schlicht", none: "Keine" },
  coffinSelection: { catalogue: "Aus dem Katalog", other: "Individuelle Auswahl", unsure: "Noch unsicher" },
  clothing: { own: "Eigene Kleidung", shroud: "Sterbehemd", current: "Kleidung beibehalten" },
  pillows: { catalogue: "Aus dem Katalog", own: "Eigene Kissen/Decke", none: "Keine" },
  existing: { yes: "Bestehendes Grab", no: "Neues Grab benötigt", anonymous: "Anonyme Beisetzung" },
  cemEarthGrave: { classical: "Klassisches Grab", lawn: "Rasengrab" },
  cemCremGrave: {
    classical: "Klassisches Urnengrab",
    lawn: "Urnen-Rasengrab",
    tree: "Baumgrab (Friedhof)",
    urn_wall: "Urnenwand (Kolumbarium)",
    gardened_field: "Gärtnerbetreutes Grabfeld",
  },
  friedwaldOption: {
    partner_tree: "Partnerbaum",
    generation_tree: "Familien-/Generationenbaum",
    shared_tree: "Platz am Gemeinschaftsbaum",
    shared_base_site: "Platz am Basisbaum",
  },
  amount: { "10": "≈ 10", "50": "≈ 50", "100": "100+" },

  groups: {
    intro: "Persönliche Angaben",
    funeralType: "Bestattungsart",
    finalGoodbye: "Letzter Abschied",
    ceremonyOutline: "Ablauf der Feier",
    mainCeremony: "Trauerfeier",
    subCeremony: "Zeremonie am Grab / Baum / Schiff",
    coffinUrn: "Sarg & Urne",
    grave: "Grabstätte",
    obituary: "Traueranzeige",
    sympathy: "Trauerkarten",
    assistance: "Unterstützung nach dem Sterbefall",
  },

  rows: {
    mode: "Art der Anfrage",
    modeBereavement: "Aktueller Trauerfall",
    modePreplanning: "Bestattungsvorsorge",
    deceasedName: "Name der verstorbenen Person",
    deceasedLocation: "Aktueller Aufenthaltsort",
    planningFor: "Planung für",
    planningForSelf: "Mich selbst",
    planningForOther: "Eine andere Person",
    name: "Name",
    burialType: "Bestattungsform",
    locationType: "Beisetzungsort",
    cemetery: "Friedhof",
    friedwald: "FriedWald",
    seaRegion: "Meeresgebiet",
    finalGoodbyeType: "Art des Abschieds",
    ceremony: "Ablauf",
    atGrave: "Am Grab",
    shortAtGrave: "Kurze Zeremonie am Grab",
    noCeremony: "Keine Zeremonie",
    ceremonyAtTree: "Zeremonie am Baum",
    mainCeremonyBefore: "Trauerfeier vor der Beisetzung",
    onBoard: "An Bord",
    ceremonyPlace: "Ort der Feier",
    ceremonyFinalGoodbye: "Abschiedsritual",
    speaker: "Redner",
    music: "Musik",
    decoration: "Dekoration",
    decorationNotes: "Gestaltungswünsche",
    picture: "Foto aufgestellt",
    personalItems: "Persönliche Gegenstände",
    flowers: "Blumenschmuck",
    rituals: "Rituale",
    publicViewing: "Öffentliche Aufbahrung",
    clothing: "Kleidung",
    pillows: "Kissen & Decke",
    graveGoods: "Sargbeigaben",
    urn: "Urne",
    existingGrave: "Grab",
    graveNumber: "Grabnummer",
    graveFuturePeople: "Weitere Beisetzungen geplant",
    graveType: "Grabart",
    graveCross: "Grabkreuz",
    reservedTree: "Baum",
    treeNumber: "Baumnummer",
    placeType: "Art des Platzes",
    namePlate: "Namensschild am Baum",
    beforeService: "Vor der Trauerfeier",
    memorialJewelry: "Erinnerungsschmuck",
    afterService: "Nach der Trauerfeier",
    helpWanted: "Unterstützung gewünscht",
    yes: "Ja",
    no: "Nein",
  },
} as const;

// ── Helpers ───────────────────────────────────────────────────────────────────

const getLabels = (lang: Lang) => (lang === "de" ? labelsDE : labelsEN);

/** Kept for backward compatibility — English only. */
export const labels = labelsEN;

export const yesNo = (v: boolean | null, lang: Lang = "en") =>
  v === null ? null : v ? getLabels(lang).rows.yes : getLabels(lang).rows.no;

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SummaryGroup {
  title: string;
  stepIndex: number;
  rows: { label: string; value: string }[];
}

// ── buildSummaryGroups ────────────────────────────────────────────────────────

export function buildSummaryGroups(
  s: WizardState,
  stepIndexOf: (id: string) => number,
  lang: Lang = "en",
): SummaryGroup[] {
  const L = getLabels(lang);
  const groups: SummaryGroup[] = [];

  // Introduction
  const introRows: { label: string; value: string }[] = [];
  if (s.mode === "bereavement") {
    introRows.push({ label: L.rows.mode, value: L.rows.modeBereavement });
    if (s.deceasedName) introRows.push({ label: L.rows.deceasedName, value: s.deceasedName });
    if (s.deceasedLocation) introRows.push({ label: L.rows.deceasedLocation, value: s.deceasedLocation });
  } else if (s.mode === "preplanning") {
    introRows.push({ label: L.rows.mode, value: L.rows.modePreplanning });
    if (s.prePlanningFor) {
      introRows.push({
        label: L.rows.planningFor,
        value: s.prePlanningFor === "self" ? L.rows.planningForSelf : L.rows.planningForOther,
      });
    }
    if (s.prePlanningName) introRows.push({ label: L.rows.name, value: s.prePlanningName });
  }
  if (introRows.length)
    groups.push({ title: L.groups.intro, stepIndex: stepIndexOf("intro"), rows: introRows });

  // Funeral type
  const ftRows: { label: string; value: string }[] = [];
  if (s.burialType) ftRows.push({ label: L.rows.burialType, value: L.burial[s.burialType] });
  if (s.locationType) ftRows.push({ label: L.rows.locationType, value: L.location[s.locationType] });
  if (s.cemeteryName) ftRows.push({ label: L.rows.cemetery, value: s.cemeteryName });
  if (s.friedwaldName) ftRows.push({ label: L.rows.friedwald, value: s.friedwaldName });
  if (s.seaRegion) ftRows.push({ label: L.rows.seaRegion, value: L.seaRegion[s.seaRegion] });
  if (ftRows.length)
    groups.push({ title: L.groups.funeralType, stepIndex: stepIndexOf("funeralType"), rows: ftRows });

  // Final goodbye
  if (s.finalGoodbye) {
    groups.push({
      title: L.groups.finalGoodbye,
      stepIndex: stepIndexOf("finalGoodbye"),
      rows: [{ label: L.rows.finalGoodbyeType, value: L.finalGoodbye[s.finalGoodbye] }],
    });
  }

  // Ceremony outline
  const coRows: { label: string; value: string }[] = [];
  if (s.locationType === "cemetery" && s.cemeteryCeremony) {
    coRows.push({ label: L.rows.ceremony, value: L.cemeteryCeremony[s.cemeteryCeremony] });
    if (s.cemeteryCeremony === "none" && s.cemeteryNoCeremonyFollowup) {
      coRows.push({
        label: L.rows.atGrave,
        value:
          s.cemeteryNoCeremonyFollowup === "short_at_grave"
            ? L.rows.shortAtGrave
            : L.rows.noCeremony,
      });
    }
  }
  if (s.locationType === "friedwald" && s.friedwaldCeremony) {
    coRows.push({ label: L.rows.ceremony, value: L.friedwaldCeremony[s.friedwaldCeremony] });
    const t = yesNo(s.friedwaldTreeCeremony, lang);
    if (t) coRows.push({ label: L.rows.ceremonyAtTree, value: t });
  }
  if (s.locationType === "sea") {
    if (s.seaMainCeremony)
      coRows.push({
        label: L.rows.mainCeremonyBefore,
        value: s.seaMainCeremony === "yes" ? L.rows.yes : L.rows.no,
      });
    if (s.seaShipMode)
      coRows.push({ label: L.rows.onBoard, value: L.shipMode[s.seaShipMode] });
  }
  if (coRows.length)
    groups.push({ title: L.groups.ceremonyOutline, stepIndex: stepIndexOf("ceremonyOutline"), rows: coRows });

  // Main ceremony
  const mcRows: { label: string; value: string }[] = [];
  if (s.ceremonyPlace) mcRows.push({ label: L.rows.ceremonyPlace, value: s.ceremonyPlace });
  if (s.ceremonyFinalGoodbye) mcRows.push({ label: L.rows.ceremonyFinalGoodbye, value: s.ceremonyFinalGoodbye });
  if (s.ceremonyFinalGoodbyeRituals && s.ceremonyFinalGoodbyeRituals.length) {
    mcRows.push({ label: L.rows.ceremonyFinalGoodbye, value: s.ceremonyFinalGoodbyeRituals.join(", ") });
  }
  if (s.ceremonySpeaker) mcRows.push({ label: L.rows.speaker, value: L.speaker[s.ceremonySpeaker] });
  if (s.ceremonyMusic) mcRows.push({ label: L.rows.music, value: L.music[s.ceremonyMusic] });
  if (s.ceremonyDecoration) mcRows.push({ label: L.rows.decoration, value: L.decoration[s.ceremonyDecoration] });
  if (s.ceremonyDecorationText) mcRows.push({ label: L.rows.decorationNotes, value: s.ceremonyDecorationText });
  const pic = yesNo(s.ceremonyPicture, lang);
  if (pic) mcRows.push({ label: L.rows.picture, value: pic });
  const items = yesNo(s.ceremonyPersonalItems, lang);
  if (items)
    mcRows.push({
      label: L.rows.personalItems,
      value: s.ceremonyPersonalItems ? `${L.rows.yes} — ${s.ceremonyPersonalItemsText || "—"}` : L.rows.no,
    });
  const fl = yesNo(s.ceremonyFlowers, lang);
  if (fl) mcRows.push({ label: L.rows.flowers, value: fl });
  if (s.ceremonyFlowerTypes && s.ceremonyFlowerTypes.length) {
    mcRows.push({ label: L.rows.flowers, value: s.ceremonyFlowerTypes.join(", ") });
  }
  if (s.ceremonyRituals) mcRows.push({ label: L.rows.rituals, value: s.ceremonyRituals });
  if (mcRows.length)
    groups.push({ title: L.groups.mainCeremony, stepIndex: stepIndexOf("mainCeremony"), rows: mcRows });

  // Sub ceremony
  const subRows: { label: string; value: string }[] = [];
  if (s.subSpeaker) subRows.push({ label: L.rows.speaker, value: L.speaker[s.subSpeaker] });
  if (s.subSeaSpeaker) subRows.push({ label: L.rows.speaker, value: L.seaSpeaker[s.subSeaSpeaker] });
  if (s.subMusic) subRows.push({ label: L.rows.music, value: L.music[s.subMusic] });
  const sp = yesNo(s.subPicture, lang);
  if (sp) subRows.push({ label: L.rows.picture, value: sp });
  const sf = yesNo(s.subFlowersAtUrn, lang);
  if (sf) subRows.push({ label: L.rows.flowers, value: sf });
  if (subRows.length)
    groups.push({ title: L.groups.subCeremony, stepIndex: stepIndexOf("subCeremony"), rows: subRows });

  // Coffin & urn
  const cuRows: { label: string; value: string }[] = [];
  if (s.coffinSelection)
    cuRows.push({
      label: lang === "de" ? "Sarg" : "Coffin",
      value:
        s.coffinSelection === "other" && s.coffinOther
          ? `${L.coffinSelection.other} — ${s.coffinOther}`
          : L.coffinSelection[s.coffinSelection],
    });
  const pv = yesNo(s.publicViewing, lang);
  if (pv) cuRows.push({ label: L.rows.publicViewing, value: pv });
  if (s.clothing) cuRows.push({ label: L.rows.clothing, value: L.clothing[s.clothing] });
  if (s.pillows) cuRows.push({ label: L.rows.pillows, value: L.pillows[s.pillows] });
  const gg = yesNo(s.graveGoods, lang);
  if (gg)
    cuRows.push({
      label: L.rows.graveGoods,
      value: s.graveGoods ? `${L.rows.yes} — ${s.graveGoodsText || "—"}` : L.rows.no,
    });
  if (s.urnSelection)
    cuRows.push({
      label: L.rows.urn,
      value:
        s.urnSelection === "other" && s.urnOther
          ? `${L.coffinSelection.other} — ${s.urnOther}`
          : L.coffinSelection[s.urnSelection],
    });
  if (cuRows.length)
    groups.push({ title: L.groups.coffinUrn, stepIndex: stepIndexOf("coffinUrn"), rows: cuRows });

  // Grave
  const gRows: { label: string; value: string }[] = [];
  if (s.locationType === "cemetery") {
    if (s.existingGrave) gRows.push({ label: L.rows.existingGrave, value: L.existing[s.existingGrave] });
    if (s.graveNumber) gRows.push({ label: L.rows.graveNumber, value: s.graveNumber });
    const fp = yesNo(s.graveFuturePeople, lang);
    if (fp) gRows.push({ label: L.rows.graveFuturePeople, value: fp });
    if (s.cemeteryEarthGrave) gRows.push({ label: L.rows.graveType, value: L.cemEarthGrave[s.cemeteryEarthGrave] });
    if (s.cemeteryCremationGrave) gRows.push({ label: L.rows.graveType, value: L.cemCremGrave[s.cemeteryCremationGrave] });
    const cr = yesNo(s.graveCross, lang);
    if (cr) gRows.push({ label: L.rows.graveCross, value: cr });
  }
  if (s.locationType === "friedwald") {
    if (s.friedwaldExisting) gRows.push({ label: L.rows.reservedTree, value: L.existing[s.friedwaldExisting] });
    if (s.friedwaldTreeNumber) gRows.push({ label: L.rows.treeNumber, value: s.friedwaldTreeNumber });
    if (s.friedwaldGraveOption) gRows.push({ label: L.rows.placeType, value: L.friedwaldOption[s.friedwaldGraveOption] });
    const np = yesNo(s.friedwaldNamePlate, lang);
    if (np) gRows.push({ label: L.rows.namePlate, value: np });
  }
  if (gRows.length)
    groups.push({ title: L.groups.grave, stepIndex: stepIndexOf("grave"), rows: gRows });

  // Obituary
  const oRows: { label: string; value: string }[] = [];
  const ob = yesNo(s.obituaryBefore, lang);
  if (ob)
    oRows.push({
      label: L.rows.beforeService,
      value: s.obituaryBefore ? `${L.rows.yes} — ${s.obituaryBeforeWhere || "—"}` : L.rows.no,
    });
  const oa = yesNo(s.obituaryAfter, lang);
  if (oa)
    oRows.push({
      label: L.rows.afterService,
      value: s.obituaryAfter ? `${L.rows.yes} — ${s.obituaryAfterWhere || "—"}` : L.rows.no,
    });
  if (oRows.length)
    groups.push({ title: L.groups.obituary, stepIndex: stepIndexOf("obituary"), rows: oRows });

  // Sympathy
  const syRows: { label: string; value: string }[] = [];
  const sb = yesNo(s.sympathyBefore, lang);
  if (sb)
    syRows.push({
      label: L.rows.beforeService,
      value: s.sympathyBefore
        ? `${L.rows.yes} — ${s.sympathyBeforeAmount ? L.amount[s.sympathyBeforeAmount] : "—"}`
        : L.rows.no,
    });
  const sa = yesNo(s.sympathyAfter, lang);
  if (sa)
    syRows.push({
      label: L.rows.afterService,
      value: s.sympathyAfter
        ? `${L.rows.yes} — ${s.sympathyAfterAmount ? L.amount[s.sympathyAfterAmount] : "—"}`
        : L.rows.no,
    });
  const mj = yesNo(s.memorialJewelry, lang);
  if (mj)
    syRows.push({ label: L.rows.memorialJewelry, value: s.memorialJewelry ? L.rows.yes : L.rows.no });
  if (syRows.length)
    groups.push({ title: L.groups.sympathy, stepIndex: stepIndexOf("sympathy"), rows: syRows });

  // Assistance
  const aw = yesNo(s.assistanceWanted, lang);
  if (aw)
    groups.push({
      title: L.groups.assistance,
      stepIndex: stepIndexOf("assistance"),
      rows: [{ label: L.rows.helpWanted, value: aw }],
    });

  return groups;
}
