import { describe, expect, it } from "vitest";
import { buildSummaryPdfModel, createSummaryPdfFilename } from "./exportPdf";
import { calculateBreakdown, formatEUR, initialState, type WizardState } from "@/types/wizard";

const filledState: WizardState = {
  ...initialState,
  mode: "bereavement",
  deceasedName: "Anna Muller",
  burialType: "cremation",
  locationType: "friedwald",
  finalGoodbye: "urn",
  coffinSelection: "catalogue",
  coffinCatalogue: "pine_natural",
  urnSelection: "catalogue",
  urnCatalogue: "ceramic_white",
  friedwaldGraveOption: "shared_tree",
  sympathyBefore: true,
  sympathyBeforeAmount: "50",
  assistanceWanted: true,
};

describe("PDF export data", () => {
  it("builds a German summary model with localized costs, images and contact details", () => {
    const model = buildSummaryPdfModel(filledState, "de", new Date("2026-06-04T12:00:00Z"));
    const costLabels = model.costGroups.flatMap((group) => group.lines.map((line) => line.label));

    expect(model.brand).toBe("Bestattungs Kompass");
    expect(model.title).toContain("Zusammenfassung");
    expect(model.title).toContain("Anna Muller");
    expect(model.generatedLine).toContain("4. Juni 2026");
    expect(model.contactTitle).toBe("Kontakt");
    expect(model.contactLines[0]).toContain("Sie erreichen uns");
    expect(model.selectedItemsTitle).toBe("Sarg & Urne");
    expect(model.selectedItems).toHaveLength(2);
    expect(model.selectedItems[0]).toMatchObject({
      kind: "coffin",
      image: "/images/coffins/pine_natural.jpg",
    });
    expect(model.selectedItems[1]).toMatchObject({
      kind: "urn",
      image: "/images/urns/ceramic_white.jpg",
    });
    expect(costLabels).toContain("Feuerbestattung");
    expect(costLabels).toContain("FriedWald-Platz");
    expect(costLabels).toContain("Trauerkarten vor der Feier (50)");
    expect(model.filename).toBe("bestattungsplanung-anna-muller.pdf");
  });

  it("keeps English as the default for cost breakdowns and filenames", () => {
    const labels = calculateBreakdown(filledState).map((line) => line.label);

    expect(labels).toContain("Cremation");
    expect(labels).toContain("FriedWald placement");
    expect(createSummaryPdfFilename("Anna Muller", "en")).toBe("funeral-plan-anna-muller.pdf");
  });

  it("formats EUR amounts for the selected language", () => {
    expect(formatEUR(1200, "en")).toMatch(/1,200/);
    expect(formatEUR(1200, "de")).toMatch(/1\.200/);
  });
});
