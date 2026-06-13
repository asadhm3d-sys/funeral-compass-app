import { WizardState, initialState } from "@/types/wizard";

// Map every wizard field to a friendly label so cleared-field notifications read naturally.
const FIELD_LABELS: Partial<Record<keyof WizardState, string>> = {
  deceasedName: "name of the deceased",
  deceasedLocation: "current location",
  prePlanningFor: "who you're planning for",
  prePlanningName: "name",

  locationType: "place of burial",
  cemeteryName: "cemetery name",
  friedwaldName: "Friedwald name",
  seaRegion: "sea region",

  finalGoodbye: "final goodbye",

  cemeteryCeremony: "cemetery ceremony choice",
  cemeteryNoCeremonyFollowup: "follow-up at the grave",
  friedwaldCeremony: "Friedwald ceremony choice",
  friedwaldTreeCeremony: "ceremony at the tree",
  seaMainCeremony: "main ceremony before the sea burial",
  seaShipMode: "ship arrangement",

  ceremonyPlace: "place of ceremony",
  ceremonyFinalGoodbye: "final goodbye at the ceremony",
  ceremonySpeaker: "speaker",
  ceremonyMusic: "music",
  ceremonyDecoration: "decoration style",
  ceremonyPicture: "picture on display",
  ceremonyPersonalItems: "personal items",
  ceremonyPersonalItemsText: "personal items description",
  ceremonyFlowers: "flowers",
  ceremonyDecorationText: "decoration notes",
  ceremonyRituals: "rituals",

  subSpeaker: "speaker at the grave",
  subSeaSpeaker: "speaker on the ship",
  subMusic: "music",
  subPicture: "picture on display",
  subFlowersAtUrn: "flowers at the urn",

  coffinSelection: "coffin selection",
  coffinOther: "coffin description",
  publicViewing: "public viewing",
  clothing: "clothing",
  pillows: "pillows & blankets",
  graveGoods: "grave goods",
  graveGoodsText: "grave goods description",
  urnSelection: "urn selection",
  urnOther: "urn description",

  existingGrave: "existing grave",
  graveNumber: "grave number",
  graveFuturePeople: "future burials",
  cemeteryEarthGrave: "grave type",
  cemeteryCremationGrave: "grave type",
  graveCross: "grave cross",
  friedwaldExisting: "reserved tree",
  friedwaldTreeNumber: "tree number",
  friedwaldGraveOption: "type of place",
  friedwaldNamePlate: "name plate",

  obituaryBeforeWhere: "obituary placement (before)",
  obituaryAfterWhere: "obituary placement (after)",

  sympathyBeforeAmount: "sympathy card amount (before)",
  sympathyAfterAmount: "sympathy card amount (after)",
};

type Patch = Partial<WizardState>;

// Helper: clear a list of keys back to their initial values, but only if they currently hold a non-default value.
function clearKeys(state: WizardState, keys: (keyof WizardState)[], cleared: Set<keyof WizardState>, patch: Patch) {
  for (const k of keys) {
    const current = (k in patch ? patch[k] : state[k]) as unknown;
    const init = initialState[k] as unknown;
    const isEmpty =
      current === null ||
      current === undefined ||
      current === "" ||
      (typeof current === "boolean" && current === init);
    // Treat a value as "set" if it differs from initial and isn't empty string.
    if (!isEmpty && current !== init) {
      (patch as Record<string, unknown>)[k as string] = init;
      cleared.add(k);
    } else if (current !== init) {
      // Still normalise (e.g. empty string already matches initial — skip)
      (patch as Record<string, unknown>)[k as string] = init;
    }
  }
}

/**
 * Apply a user patch and cascade-reset any dependent fields that would otherwise be invalid.
 * Returns the next state and the human-readable labels of fields that were cleared.
 */
export function applyWithCascade(
  state: WizardState,
  rawPatch: Patch
): { next: WizardState; clearedLabels: string[] } {
  const patch: Patch = { ...rawPatch };
  const cleared = new Set<keyof WizardState>();

  // ---------- 1. Mode (intro) ----------
  if ("mode" in patch && patch.mode !== state.mode) {
    if (patch.mode === "bereavement") {
      clearKeys(state, ["prePlanningFor", "prePlanningName"], cleared, patch);
    } else if (patch.mode === "preplanning") {
      clearKeys(state, ["deceasedName", "deceasedLocation"], cleared, patch);
    }
  }

  if ("prePlanningFor" in patch && patch.prePlanningFor !== state.prePlanningFor) {
    clearKeys(state, ["prePlanningName"], cleared, patch);
  }

  // ---------- 2. Burial type (earth ↔ cremation) ----------
  if ("burialType" in patch && patch.burialType !== state.burialType) {
    // Location: friedwald & sea require cremation
    const newBurial = patch.burialType;
    if (newBurial === "earth") {
      // Force location back to cemetery-only options
      const loc = state.locationType;
      if (loc === "friedwald" || loc === "sea") {
        clearKeys(
          state,
          [
            "locationType",
            "friedwaldName",
            "seaRegion",
            // ceremony branch
            "friedwaldCeremony",
            "friedwaldTreeCeremony",
            "seaMainCeremony",
            "seaShipMode",
            // grave branch
            "friedwaldExisting",
            "friedwaldTreeNumber",
            "friedwaldGraveOption",
            "friedwaldNamePlate",
            "cemeteryCremationGrave",
          ],
          cleared,
          patch
        );
      }
      // Earth has no "at the urn" goodbye, but urn keepsake is still allowed
      if (state.finalGoodbye === "urn") clearKeys(state, ["finalGoodbye"], cleared, patch);
      clearKeys(state, ["cemeteryCremationGrave"], cleared, patch);
    } else if (newBurial === "cremation") {
      // Cremation has no earth-grave selection and no top-level grave type kind
      clearKeys(state, ["cemeteryEarthGrave", "graveCross", "graveTypeKind"], cleared, patch);
    }
  }

  // ---------- 2b. Location type ----------
  const locChanging =
    "locationType" in patch && patch.locationType !== state.locationType;
  if (locChanging) {
    const newLoc = patch.locationType;
    // Always reset every location-specific name
    if (newLoc !== "cemetery") clearKeys(state, ["cemeteryName"], cleared, patch);
    if (newLoc !== "friedwald") clearKeys(state, ["friedwaldName"], cleared, patch);
    if (newLoc !== "sea") clearKeys(state, ["seaRegion"], cleared, patch);

    // Reset ceremony outline branch fully — different per location
    clearKeys(
      state,
      [
        "cemeteryCeremony",
        "cemeteryNoCeremonyFollowup",
        "friedwaldCeremony",
        "friedwaldTreeCeremony",
        "seaMainCeremony",
        "seaShipMode",
      ],
      cleared,
      patch
    );

    // Reset all main + sub ceremony details (they re-shape per location)
    clearKeys(
      state,
      [
        "ceremonyPlace",
        "ceremonyFinalGoodbye",
        "ceremonySpeaker",
        "ceremonyMusic",
        "ceremonyDecoration",
        "ceremonyDecorationText",
        "ceremonyPicture",
        "ceremonyPersonalItems",
        "ceremonyPersonalItemsText",
        "ceremonyFlowers",
        "ceremonyRituals",
        "subSpeaker",
        "subSeaSpeaker",
        "subMusic",
        "subPicture",
        "subFlowersAtUrn",
      ],
      cleared,
      patch
    );

    // Reset grave details from the *other* locations
    if (newLoc !== "cemetery") {
      clearKeys(
        state,
        [
          "existingGrave",
          "graveNumber",
          "graveFuturePeople",
          "cemeteryEarthGrave",
          "cemeteryCremationGrave",
          "graveCross",
        ],
        cleared,
        patch
      );
    }
    if (newLoc !== "friedwald") {
      clearKeys(
        state,
        ["friedwaldExisting", "friedwaldTreeNumber", "friedwaldGraveOption", "friedwaldNamePlate"],
        cleared,
        patch
      );
    }
  }

  // ---------- 3. Final goodbye ----------
  // (no children — handled by burialType above)

  // ---------- 4. Ceremony outline branches ----------
  // Cemetery ceremony
  if ("cemeteryCeremony" in patch && patch.cemeteryCeremony !== state.cemeteryCeremony) {
    const v = patch.cemeteryCeremony;
    // The "no main ceremony" follow-up is only relevant when "none"
    if (v !== "none") clearKeys(state, ["cemeteryNoCeremonyFollowup"], cleared, patch);
    if (v !== "separate") clearKeys(state, ["cemeterySeparateCeremonyType"], cleared, patch);
    // Main ceremony details disappear unless combined/separate
    if (v !== "combined" && v !== "separate") {
      clearKeys(
        state,
        [
          "ceremonyPlace",
          "ceremonyFinalGoodbye",
          "ceremonySpeaker",
          "ceremonyMusic",
          "ceremonyDecoration",
          "ceremonyDecorationText",
          "ceremonyPicture",
          "ceremonyPersonalItems",
          "ceremonyPersonalItemsText",
          "ceremonyFlowers",
          "ceremonyRituals",
        ],
        cleared,
        patch
      );
    }
    // Sub-ceremony only when none + short_at_grave — clear it whenever leaving that path
    clearKeys(state, ["subSpeaker", "subMusic", "subPicture"], cleared, patch);
  }

  if (
    "cemeteryNoCeremonyFollowup" in patch &&
    patch.cemeteryNoCeremonyFollowup !== state.cemeteryNoCeremonyFollowup &&
    patch.cemeteryNoCeremonyFollowup !== "short_at_grave"
  ) {
    clearKeys(state, ["subSpeaker", "subMusic", "subPicture"], cleared, patch);
  }

  // Friedwald ceremony
  if ("friedwaldCeremony" in patch && patch.friedwaldCeremony !== state.friedwaldCeremony) {
    const v = patch.friedwaldCeremony;
    if (v !== "andachtsplatz" && v !== "elsewhere") {
      clearKeys(
        state,
        [
          "ceremonyPlace",
          "ceremonyFinalGoodbye",
          "ceremonySpeaker",
          "ceremonyMusic",
          "ceremonyDecoration",
          "ceremonyDecorationText",
          "ceremonyPicture",
          "ceremonyPersonalItems",
          "ceremonyPersonalItemsText",
          "ceremonyFlowers",
          "ceremonyRituals",
        ],
        cleared,
        patch
      );
    }
  }

  if ("friedwaldTreeCeremony" in patch && patch.friedwaldTreeCeremony !== state.friedwaldTreeCeremony) {
    if (patch.friedwaldTreeCeremony !== true) {
      clearKeys(state, ["subSpeaker", "subMusic", "subPicture"], cleared, patch);
    }
  }

  // Sea ceremony
  if ("seaMainCeremony" in patch && patch.seaMainCeremony !== state.seaMainCeremony) {
    if (patch.seaMainCeremony !== "yes") {
      clearKeys(state, ["seaSeparateCeremonyType"], cleared, patch);
      clearKeys(
        state,
        [
          "ceremonyPlace",
          "ceremonyFinalGoodbye",
          "ceremonySpeaker",
          "ceremonyMusic",
          "ceremonyDecoration",
          "ceremonyDecorationText",
          "ceremonyPicture",
          "ceremonyPersonalItems",
          "ceremonyPersonalItemsText",
          "ceremonyFlowers",
          "ceremonyRituals",
        ],
        cleared,
        patch
      );
    }
  }

  if ("seaShipMode" in patch && patch.seaShipMode !== state.seaShipMode) {
    if (patch.seaShipMode !== "accompanied") {
      clearKeys(
        state,
        ["subSeaSpeaker", "subMusic", "subPicture", "subFlowersAtUrn"],
        cleared,
        patch
      );
    }
  }

  // ---------- 5. Main ceremony inner toggles ----------
  if (
    "ceremonyPersonalItems" in patch &&
    patch.ceremonyPersonalItems !== state.ceremonyPersonalItems &&
    !patch.ceremonyPersonalItems
  ) {
    clearKeys(state, ["ceremonyPersonalItemsText"], cleared, patch);
  }

  // ---------- 7. Coffin & urn ----------
  if ("coffinSelection" in patch && patch.coffinSelection !== state.coffinSelection) {
    if (patch.coffinSelection !== "other") clearKeys(state, ["coffinOther"], cleared, patch);
    if (patch.coffinSelection !== "catalogue") clearKeys(state, ["coffinCatalogue"], cleared, patch);
  }
  if ("urnSelection" in patch && patch.urnSelection !== state.urnSelection) {
    if (patch.urnSelection !== "other") clearKeys(state, ["urnOther"], cleared, patch);
    if (patch.urnSelection !== "catalogue") clearKeys(state, ["urnCatalogue"], cleared, patch);
  }
  if ("publicViewing" in patch && patch.publicViewing !== state.publicViewing) {
    if (patch.publicViewing === false) {
      clearKeys(state, ["clothing", "pillows", "pillowsCatalogue"], cleared, patch);
    }
  }
  if ("pillows" in patch && patch.pillows !== state.pillows) {
    if (patch.pillows !== "catalogue") clearKeys(state, ["pillowsCatalogue"], cleared, patch);
  }
  if ("graveGoods" in patch && patch.graveGoods !== state.graveGoods && !patch.graveGoods) {
    clearKeys(state, ["graveGoodsText"], cleared, patch);
  }

  // ---------- 8. Grave ----------
  if ("existingGrave" in patch && patch.existingGrave !== state.existingGrave) {
    const v = patch.existingGrave;
    if (v !== "yes") clearKeys(state, ["graveNumber"], cleared, patch);
    if (v !== "no") clearKeys(state, ["graveFuturePeople"], cleared, patch);
    if (v === "anonymous") {
      clearKeys(
        state,
        ["cemeteryEarthGrave", "cemeteryCremationGrave", "graveCross"],
        cleared,
        patch
      );
    }
  }
  if ("friedwaldExisting" in patch && patch.friedwaldExisting !== state.friedwaldExisting) {
    const v = patch.friedwaldExisting;
    if (v !== "yes") clearKeys(state, ["friedwaldTreeNumber"], cleared, patch);
    if (v !== "no") clearKeys(state, ["friedwaldGraveOption"], cleared, patch);
  }

  // ---------- 9. Obituary ----------
  if ("obituaryBefore" in patch && patch.obituaryBefore !== state.obituaryBefore && !patch.obituaryBefore) {
    clearKeys(state, ["obituaryBeforeWhere"], cleared, patch);
  }
  if ("obituaryAfter" in patch && patch.obituaryAfter !== state.obituaryAfter && !patch.obituaryAfter) {
    clearKeys(state, ["obituaryAfterWhere"], cleared, patch);
  }

  // ---------- 10. Sympathy ----------
  if ("sympathyBefore" in patch && patch.sympathyBefore !== state.sympathyBefore && !patch.sympathyBefore) {
    clearKeys(state, ["sympathyBeforeAmount"], cleared, patch);
  }
  if ("sympathyAfter" in patch && patch.sympathyAfter !== state.sympathyAfter && !patch.sympathyAfter) {
    clearKeys(state, ["sympathyAfterAmount"], cleared, patch);
  }

  const next = { ...state, ...patch };
  const clearedLabels = Array.from(cleared)
    .map((k) => FIELD_LABELS[k])
    .filter((l): l is string => Boolean(l));
  return { next, clearedLabels };
}
