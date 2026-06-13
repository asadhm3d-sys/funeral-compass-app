import { beforeEach, describe, expect, it } from "vitest";
import { LocalRepository } from "@/lib/plans/localRepository";
import { newReference } from "@/lib/plans/types";
import { buildInvoiceModel } from "@/lib/invoicePdf";
import { initialState } from "@/types/wizard";
import type { SavedPlan } from "@/lib/plans/types";

describe("LocalRepository", () => {
  beforeEach(() => localStorage.clear());

  it("supports the full plan lifecycle: create, list, update, multiple plans, delete", async () => {
    const repo = new LocalRepository();
    const owner = "test@example.com";

    const a = await repo.create({ name: "Plan A", state: initialState, owner });
    const b = await repo.create({ name: "Plan B", state: initialState, owner });
    await repo.create({ name: "Other user", state: initialState, owner: "someone@else.com" });

    const mine = await repo.list(owner);
    expect(mine.map((p) => p.name).sort()).toEqual(["Plan A", "Plan B"]);
    expect(mine.every((p) => p.status === "draft")).toBe(true);

    const submitted = await repo.update(a.id, {
      status: "submitted",
      submission: {
        reference: newReference(),
        contactName: "Heidi",
        contactEmail: "heidi@example.com",
        submittedAt: new Date().toISOString(),
      },
    });
    expect(submitted.status).toBe("submitted");
    expect(submitted.submission?.reference).toMatch(/^FC-\d{4}-[A-Z2-9]{5}$/);

    await repo.remove(b.id);
    expect((await repo.list(owner)).map((p) => p.id)).toEqual([submitted.id]);
  });
});

describe("buildInvoiceModel", () => {
  const basePlan = (): SavedPlan => ({
    id: "11111111-2222-3333-4444-555555555555",
    name: "Test",
    status: "deposit_confirmed",
    state: initialState,
    owner: "heidi@example.com",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    submission: {
      reference: "FC-2026-ABCDE",
      contactName: "Heidi Müller",
      contactEmail: "heidi@example.com",
      submittedAt: new Date().toISOString(),
    },
  });

  it("contains the §14 UStG mandatory fields and consistent VAT math", () => {
    const m = buildInvoiceModel(basePlan(), "de");
    expect(m.title).toBe("Rechnung");
    expect(m.provider.taxId).toContain("USt-IdNr.");
    expect(m.invoiceNo).toContain("Rechnungsnr.");
    expect(m.customerLines[0]).toBe("Heidi Müller");
    expect(m.reference).toBe("FC-2026-ABCDE");
    expect(m.net + m.vat).toBeCloseTo(m.gross, 6);
    expect(m.vat / m.net).toBeCloseTo(0.19, 6);
    expect(m.demoBanner).toContain("DEMO");
  });

  it("localises to English with the demo disclaimer intact", () => {
    const m = buildInvoiceModel(basePlan(), "en");
    expect(m.title).toBe("Invoice");
    expect(m.demoBanner).toContain("DEMO");
    expect(m.filename).toMatch(/^demo-invoice-/);
  });
});
