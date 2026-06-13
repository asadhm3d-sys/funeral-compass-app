import jsPDF from "jspdf";
import { translate, type Lang } from "@/lib/i18n";
import { calculateBreakdown, calculateTotal, formatEUR, type WizardState } from "@/types/wizard";
import type { SavedPlan } from "@/lib/plans/types";

// =====================================================================
// Mock invoice (Demo-Rechnung) — contains the mandatory invoice fields
// of § 14 Abs. 4 UStG, but is clearly marked as a demo document.
//
// Legal context (documented, not implemented): real German B2B
// e-invoices must follow EN 16931 (XRechnung / ZUGFeRD ≥ 2.x) — issuing
// becomes mandatory 2027 (> €800k turnover) and 2028 for all businesses.
// Invoices to consumers (B2C, our bereaved families) are NOT covered by
// the e-invoice mandate, so a PDF invoice is legally sufficient there.
// =====================================================================

const VAT_RATE = 0.19;

const DEMO_PROVIDER = {
  name: "Bestattungen Schöneberg (Demo)",
  street: "Mühlbacher Str. 10",
  city: "75031 Eppingen",
  taxId: "USt-IdNr. DE999999999 (Demo)", // placeholder — not the real tax id
};

export interface InvoiceModel {
  demoBanner: string;
  title: string;
  invoiceNo: string;
  dateLabel: string;
  date: string;
  provider: typeof DEMO_PROVIDER;
  customerLabel: string;
  customerLines: string[];
  referenceLabel: string;
  reference: string;
  columns: { item: string; amount: string };
  lines: { label: string; gross: number }[];
  netLabel: string;
  net: number;
  vatLabel: string;
  vat: number;
  grossLabel: string;
  gross: number;
  legalNote: string;
  eInvoiceNote: string;
  filename: string;
}

export function buildInvoiceModel(plan: SavedPlan, lang: Lang): InvoiceModel {
  const state: WizardState = plan.state;
  const breakdown = calculateBreakdown(state, lang);
  const gross = calculateTotal(state, lang);
  const net = gross / (1 + VAT_RATE);
  const vat = gross - net;
  const date = new Date();
  const dateStr = date.toLocaleDateString(lang === "de" ? "de-DE" : "en-IE");
  const invoiceNo = `${date.getFullYear()}-${(plan.submission?.reference ?? plan.id).replace(/^FC-\d+-/, "")}`;

  const customer = [
    plan.submission?.contactName || translate(lang, "inv_customer_fallback"),
    plan.submission?.contactEmail ?? "",
  ].filter(Boolean);

  return {
    demoBanner: translate(lang, "inv_demo_banner"),
    title: translate(lang, "inv_title"),
    invoiceNo: `${translate(lang, "inv_number")} ${invoiceNo}`,
    dateLabel: translate(lang, "inv_date"),
    date: dateStr,
    provider: DEMO_PROVIDER,
    customerLabel: translate(lang, "inv_customer"),
    customerLines: customer,
    referenceLabel: translate(lang, "inv_reference"),
    reference: plan.submission?.reference ?? plan.id.slice(0, 8),
    columns: { item: translate(lang, "inv_col_item"), amount: translate(lang, "inv_col_amount") },
    lines: breakdown.map((l) => ({ label: l.label, gross: l.amount })),
    netLabel: translate(lang, "inv_net"),
    net,
    vatLabel: translate(lang, "inv_vat"),
    vat,
    grossLabel: translate(lang, "inv_gross"),
    gross,
    legalNote: translate(lang, "inv_legal_note"),
    eInvoiceNote: translate(lang, "inv_einvoice_note"),
    filename: lang === "de" ? `Demo-Rechnung-${invoiceNo}.pdf` : `demo-invoice-${invoiceNo}.pdf`,
  };
}

export function exportInvoicePdf(plan: SavedPlan, lang: Lang = "en") {
  const m = buildInvoiceModel(plan, lang);
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const M = 48;
  let y = 52;

  doc.setProperties({ title: m.title, creator: "Funeral Compass (Demo)" });

  // demo banner
  doc.setFillColor(178, 60, 50);
  doc.rect(0, 0, W, 26, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(m.demoBanner, W / 2, 17, { align: "center" });

  // provider block
  doc.setTextColor(40, 50, 56);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text([m.provider.name, m.provider.street, m.provider.city, m.provider.taxId], W - M, y, {
    align: "right",
  });

  // title + meta
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(m.title, M, y + 14);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  y += 34;
  doc.text(`${m.invoiceNo}   ·   ${m.dateLabel}: ${m.date}`, M, y);
  y += 14;
  doc.text(`${m.referenceLabel}: ${m.reference}`, M, y);

  // customer
  y += 28;
  doc.setFont("helvetica", "bold");
  doc.text(m.customerLabel, M, y);
  doc.setFont("helvetica", "normal");
  y += 14;
  m.customerLines.forEach((line) => {
    doc.text(line, M, y);
    y += 13;
  });

  // table header
  y += 14;
  doc.setFillColor(240, 240, 235);
  doc.rect(M, y - 11, W - 2 * M, 18, "F");
  doc.setFont("helvetica", "bold");
  doc.text(m.columns.item, M + 6, y + 1);
  doc.text(m.columns.amount, W - M - 6, y + 1, { align: "right" });
  doc.setFont("helvetica", "normal");
  y += 18;

  m.lines.forEach((line) => {
    if (y > 760) {
      doc.addPage();
      y = 60;
    }
    doc.text(line.label, M + 6, y, { maxWidth: W - 2 * M - 110 });
    doc.text(formatEUR(line.gross, lang), W - M - 6, y, { align: "right" });
    y += 16;
  });

  // totals
  y += 6;
  doc.setDrawColor(180, 180, 175);
  doc.line(W / 2, y, W - M, y);
  y += 16;
  const totalRow = (label: string, value: number, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.text(label, W / 2 + 6, y);
    doc.text(formatEUR(value, lang), W - M - 6, y, { align: "right" });
    y += 16;
  };
  totalRow(m.netLabel, m.net);
  totalRow(m.vatLabel, m.vat);
  totalRow(m.grossLabel, m.gross, true);

  // legal + e-invoice notes
  y += 18;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(110, 115, 118);
  doc.text(m.legalNote, M, y, { maxWidth: W - 2 * M });
  y += 30;
  doc.text(m.eInvoiceNote, M, y, { maxWidth: W - 2 * M });

  doc.save(m.filename);
}
