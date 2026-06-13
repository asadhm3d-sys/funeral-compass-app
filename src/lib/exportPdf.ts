import jsPDF from "jspdf";
import type { DictKey, Lang } from "@/lib/i18n";
import { translate } from "@/lib/i18n";
import {
  buildSteps,
  calculateBreakdown,
  calculateTotal,
  formatEUR,
  type CatalogueCoffin,
  type CatalogueUrn,
  type WizardState,
} from "@/types/wizard";
import { buildSummaryGroups, type SummaryGroup } from "./wizardLabels";

type Color = readonly [number, number, number];

type CatalogItem<T extends string> = {
  value: T;
  titleKey: DictKey;
  descKey: DictKey;
  image: string;
};

type SelectedItem = {
  kind: "coffin" | "urn";
  title: string;
  description: string;
  image: string;
};

interface PdfTheme {
  page: Color;
  band: Color;
  surface: Color;
  surfaceSoft: Color;
  border: Color;
  ink: Color;
  muted: Color;
  primary: Color;
  primaryForeground: Color;
  accent: Color;
  primaryRaw: string;
  logoRingDarkRaw: string;
  logoRingSoftRaw: string;
  logoPathRaw: string;
  logoPathDarkRaw: string;
  logoFlameRaw: string;
  logoCutoutRaw: string;
}

type CostGroup = {
  key: string;
  label: string;
  lines: ReturnType<typeof calculateBreakdown>;
  subtotal: number;
};

export interface SummaryPdfModel {
  lang: Lang;
  brand: string;
  title: string;
  lead: string;
  generatedLine: string;
  emptyText: string;
  summaryGroups: SummaryGroup[];
  selectedItemsTitle: string;
  selectedItems: SelectedItem[];
  costsTitle: string;
  estimatedLabel: string;
  costGroups: CostGroup[];
  totalLabel: string;
  total: number;
  disclaimer: string;
  contactTitle: string;
  contactLines: string[];
  footer: string;
  filename: string;
}

const pdfCopy: Record<
  Lang,
  {
    generatedOn: (date: string) => string;
    page: (page: number, total: number) => string;
    filenamePrefix: string;
  }
> = {
  en: {
    generatedOn: (date) => `Generated on ${date}`,
    page: (page, total) => `Page ${page} of ${total}`,
    filenamePrefix: "funeral-plan",
  },
  de: {
    generatedOn: (date) => `Erstellt am ${date}`,
    page: (page, total) => `Seite ${page} von ${total}`,
    filenamePrefix: "bestattungsplanung",
  },
};

const coffinCatalogue: CatalogItem<CatalogueCoffin>[] = [
  { value: "cremation_standard", titleKey: "coffin_cremation_standard", descKey: "coffin_cremation_standard_d", image: "/images/coffins/pine_natural.jpg" },
  { value: "cremation_simple", titleKey: "coffin_cremation_simple", descKey: "coffin_cremation_simple_d", image: "/images/coffins/white_simple.jpg" },
  { value: "cremation_eco", titleKey: "coffin_cremation_eco", descKey: "coffin_cremation_eco_d", image: "/images/coffins/cardboard_eco.jpg" },
  { value: "oak_classic", titleKey: "coffin_oak_classic", descKey: "coffin_oak_classic_d", image: "/images/coffins/oak_classic.jpg" },
  { value: "pine_natural", titleKey: "coffin_pine_natural", descKey: "coffin_pine_natural_d", image: "/images/coffins/pine_natural.jpg" },
  { value: "walnut_dark", titleKey: "coffin_walnut_dark", descKey: "coffin_walnut_dark_d", image: "/images/coffins/walnut_dark.jpg" },
  { value: "willow_woven", titleKey: "coffin_willow_woven", descKey: "coffin_willow_woven_d", image: "/images/coffins/willow_woven.jpg" },
  { value: "white_simple", titleKey: "coffin_white_simple", descKey: "coffin_white_simple_d", image: "/images/coffins/white_simple.jpg" },
  { value: "cardboard_eco", titleKey: "coffin_cardboard_eco", descKey: "coffin_cardboard_eco_d", image: "/images/coffins/cardboard_eco.jpg" },
];

const urnCatalogue: CatalogItem<CatalogueUrn>[] = [
  { value: "ceramic_white", titleKey: "urn_ceramic_white", descKey: "urn_ceramic_white_d", image: "/images/urns/ceramic_white.jpg" },
  { value: "wooden_oak", titleKey: "urn_wooden_oak", descKey: "urn_wooden_oak_d", image: "/images/urns/wooden_oak.jpg" },
  { value: "bronze_classic", titleKey: "urn_bronze_classic", descKey: "urn_bronze_classic_d", image: "/images/urns/bronze_classic.jpg" },
  { value: "bio_natural", titleKey: "urn_bio_natural", descKey: "urn_bio_natural_d", image: "/images/urns/bio_natural.jpg" },
  { value: "stone_grey", titleKey: "urn_stone_grey", descKey: "urn_stone_grey_d", image: "/images/urns/stone_grey.jpg" },
  { value: "glass_modern", titleKey: "urn_glass_modern", descKey: "urn_glass_modern_d", image: "/images/urns/glass_modern.jpg" },
];

const fallbackTheme: PdfTheme = {
  page: [244, 238, 225],
  band: [238, 244, 230],
  surface: [250, 252, 247],
  surfaceSoft: [236, 241, 230],
  border: [190, 204, 176],
  ink: [27, 39, 34],
  muted: [92, 110, 101],
  primary: [46, 92, 71],
  primaryForeground: [249, 251, 246],
  accent: [199, 137, 47],
  primaryRaw: "154 33% 27%",
  logoRingDarkRaw: "#244938",
  logoRingSoftRaw: "#6c9583",
  logoPathRaw: "#8aa99b",
  logoPathDarkRaw: "#5f8274",
  logoFlameRaw: "#c7892f",
  logoCutoutRaw: "hsl(86 30% 94%)",
};

const fallbackPageRaw = "86 30% 94%";

const localeFor = (lang: Lang) => (lang === "de" ? "de-DE" : "en-IE");

const sanitizeFilenamePart = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

const normalizeCssColor = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  if (trimmed.startsWith("#") || trimmed.startsWith("rgb") || trimmed.startsWith("hsl")) return trimmed;
  return `hsl(${trimmed})`;
};

const parseComputedColor = (value: string): Color | null => {
  const match = value.match(/rgba?\(\s*(\d+)[^\d]+(\d+)[^\d]+(\d+)/i);
  if (!match) return null;
  return [Number(match[1]), Number(match[2]), Number(match[3])] as const;
};

const colorFromCss = (value: string, fallback: Color): Color => {
  if (typeof document === "undefined") return fallback;
  const probe = document.createElement("span");
  probe.style.color = normalizeCssColor(value);
  const parent = document.body || document.documentElement;
  parent.appendChild(probe);
  const computed = getComputedStyle(probe).color;
  probe.remove();
  return parseComputedColor(computed) ?? fallback;
};

const readCssVar = (style: CSSStyleDeclaration, name: string, fallback: string) =>
  style.getPropertyValue(name).trim() || fallback;

const resolveTheme = (): PdfTheme => {
  if (typeof document === "undefined") return fallbackTheme;

  const style = getComputedStyle(document.documentElement);
  const pageRaw = readCssVar(style, "--background", fallbackPageRaw);
  const bandRaw = readCssVar(style, "--secondary", "70 22% 86%");
  const surfaceRaw = readCssVar(style, "--card", "88 28% 98%");
  const surfaceSoftRaw = readCssVar(style, "--muted", "88 20% 88%");
  const borderRaw = readCssVar(style, "--border", "88 18% 75%");
  const inkRaw = readCssVar(style, "--foreground", "155 18% 13%");
  const mutedRaw = readCssVar(style, "--muted-foreground", "155 9% 40%");
  const primaryRaw = readCssVar(style, "--primary", fallbackTheme.primaryRaw);
  const primaryForegroundRaw = readCssVar(style, "--primary-foreground", "88 28% 98%");
  const accentRaw = readCssVar(style, "--accent", "26 44% 55%");
  const logoRingDarkRaw = readCssVar(style, "--logo-ring-dark", fallbackTheme.logoRingDarkRaw);
  const logoRingSoftRaw = readCssVar(style, "--logo-ring-soft", fallbackTheme.logoRingSoftRaw);
  const logoPathRaw = readCssVar(style, "--logo-path", fallbackTheme.logoPathRaw);
  const logoPathDarkRaw = readCssVar(style, "--logo-path-dark", fallbackTheme.logoPathDarkRaw);
  const logoFlameRaw = readCssVar(style, "--logo-flame", fallbackTheme.logoFlameRaw);
  const logoCutoutRaw = readCssVar(style, "--logo-cutout", fallbackTheme.logoCutoutRaw);

  return {
    page: colorFromCss(pageRaw, fallbackTheme.page),
    band: colorFromCss(bandRaw, fallbackTheme.band),
    surface: colorFromCss(surfaceRaw, fallbackTheme.surface),
    surfaceSoft: colorFromCss(surfaceSoftRaw, fallbackTheme.surfaceSoft),
    border: colorFromCss(borderRaw, fallbackTheme.border),
    ink: colorFromCss(inkRaw, fallbackTheme.ink),
    muted: colorFromCss(mutedRaw, fallbackTheme.muted),
    primary: colorFromCss(primaryRaw, fallbackTheme.primary),
    primaryForeground: colorFromCss(primaryForegroundRaw, fallbackTheme.primaryForeground),
    accent: colorFromCss(accentRaw, fallbackTheme.accent),
    primaryRaw,
    logoRingDarkRaw,
    logoRingSoftRaw,
    logoPathRaw,
    logoPathDarkRaw,
    logoFlameRaw,
    logoCutoutRaw,
  };
};

const colorToHex = (color: Color) =>
  `#${color
    .map((component) => Math.max(0, Math.min(255, Math.round(component))).toString(16).padStart(2, "0"))
    .join("")}`;

const applyTextColor = (doc: jsPDF, color: Color) => {
  doc.setTextColor(color[0], color[1], color[2]);
};

const applyDrawColor = (doc: jsPDF, color: Color) => {
  doc.setDrawColor(color[0], color[1], color[2]);
};

const applyFillColor = (doc: jsPDF, color: Color) => {
  doc.setFillColor(color[0], color[1], color[2]);
};

const roundRectPath = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
};

const loadImage = (src: string) =>
  new Promise<HTMLImageElement | null>((resolve) => {
    if (typeof Image === "undefined") {
      resolve(null);
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });

const rasterizeSvgToPngDataUrl = async (svg: string, size = 256) => {
  if (typeof document === "undefined") return null;

  const img = await loadImage(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`);
  if (!img) return null;

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.clearRect(0, 0, size, size);
  ctx.drawImage(img, 0, 0, size, size);
  return canvas.toDataURL("image/png");
};

const rasterizeImageToPngDataUrl = async (
  src: string,
  width = 240,
  height = 180,
  background = "#ffffff",
) => {
  if (typeof document === "undefined") return null;

  const img = await loadImage(src);
  if (!img) return null;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);

  const scale = Math.max(width / img.naturalWidth, height / img.naturalHeight);
  const drawWidth = img.naturalWidth * scale;
  const drawHeight = img.naturalHeight * scale;
  const drawX = (width - drawWidth) / 2;
  const drawY = (height - drawHeight) / 2;

  ctx.save();
  roundRectPath(ctx, 0, 0, width, height, Math.min(16, Math.min(width, height) / 6));
  ctx.clip();
  ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
  ctx.restore();
  return canvas.toDataURL("image/png");
};

const buildLogoMarkSvg = (theme: PdfTheme) => {
  const ringDark = normalizeCssColor(theme.logoRingDarkRaw);
  const ringSoft = normalizeCssColor(theme.logoRingSoftRaw);
  const path = normalizeCssColor(theme.logoPathRaw);
  const pathDark = normalizeCssColor(theme.logoPathDarkRaw);
  const flame = normalizeCssColor(theme.logoFlameRaw);
  const cutout = normalizeCssColor(theme.logoCutoutRaw);

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <path d="M58 230a198 198 0 0 1 170-169" fill="none" stroke="${ringDark}" stroke-linecap="butt" stroke-width="27"/>
  <path d="M285 61a198 198 0 0 1 169 169" fill="none" stroke="${ringDark}" stroke-linecap="butt" stroke-width="27"/>
  <path d="M58 282a198 198 0 0 0 174 169" fill="none" stroke="${ringSoft}" stroke-linecap="butt" stroke-width="27"/>
  <path d="M280 451a198 198 0 0 0 174-169" fill="none" stroke="${ringSoft}" stroke-linecap="butt" stroke-width="27"/>
  <path d="M82 334c20-55 76-93 160-113 35-8 82-7 140 2-55 7-102 20-139 39-39 21-54 46-46 75 7 26 34 50 82 78 21 13 39 25 54 38h-71c-10-15-25-30-47-45-35-24-56-47-62-72-6-27 7-51 39-72-45 13-79 32-101 57-22 25-26 51-13 78 7 15 3 26-12 31-31-20-59-53-84-96Z" fill="${path}"/>
  <path d="M244 210c45 2 94 9 151 22-58 8-108 22-148 42-25 13-41 28-47 45-6 18 3 35 26 52-46-19-68-44-66-74 2-36 30-65 84-87Z" fill="${pathDark}" opacity="0.9"/>
  <path d="M268 22c-23 62-39 119-46 171l32-66 11 104c25-73 31-141 3-209Z" fill="${flame}" stroke="${flame}" stroke-linecap="round" stroke-linejoin="round" stroke-width="6"/>
  <path d="M247 149c-6 27-10 52-11 76l18-47 4 52c6-35 5-62-11-81Z" fill="${cutout}" stroke="none"/>
  <path d="M214 189l-47-92" fill="${flame}" stroke="${flame}" stroke-linecap="round" stroke-linejoin="round" stroke-width="6"/>
  <path d="M196 227l-75-21" fill="${flame}" stroke="${flame}" stroke-linecap="round" stroke-linejoin="round" stroke-width="6"/>
  <path d="M301 179l46-48" fill="${flame}" stroke="${flame}" stroke-linecap="round" stroke-linejoin="round" stroke-width="6"/>
  <path d="M325 220l66-14" fill="${flame}" stroke="${flame}" stroke-linecap="round" stroke-linejoin="round" stroke-width="6"/>
</svg>`;
};

const findCatalogueItem = <T extends string>(items: CatalogItem<T>[], value: T | null | undefined) =>
  items.find((item) => item.value === value) ?? null;

export const createSummaryPdfFilename = (subjectName: string | null | undefined, lang: Lang) => {
  const prefix = pdfCopy[lang].filenamePrefix;
  const slug = subjectName ? sanitizeFilenamePart(subjectName) : "";
  return slug ? `${prefix}-${slug}.pdf` : `${prefix}.pdf`;
};

export function buildSummaryPdfModel(
  state: WizardState,
  lang: Lang = "en",
  now: Date = new Date(),
): SummaryPdfModel {
  const steps = buildSteps(state);
  const stepIndexOf = (id: string) => steps.findIndex((s) => s.id === id);
  const summaryGroups = buildSummaryGroups(state, stepIndexOf, lang);
  const subjectName = state.deceasedName || state.prePlanningName;
  const breakdown = calculateBreakdown(state, lang);

  const stepLabel = (key: string) => {
    const map: Record<string, string> = {
      base: translate(lang, "step_intro"),
      funeralType: translate(lang, "step_funeralType"),
      finalGoodbye: translate(lang, "step_finalGoodbye"),
      mainCeremony: translate(lang, "step_mainCeremony"),
      subCeremony: translate(lang, "step_subCeremony"),
      coffinUrn: translate(lang, "step_coffinUrn"),
      grave: translate(lang, "step_grave"),
      obituary: translate(lang, "step_obituary"),
      sympathy: translate(lang, "step_sympathy"),
      assistance: translate(lang, "step_assistance"),
    };
    return map[key] ?? key;
  };

  const costGroups = breakdown.reduce<Record<string, CostGroup>>((acc, line) => {
    const key = line.step;
    if (!acc[key]) acc[key] = { key, label: stepLabel(key), lines: [], subtotal: 0 };
    acc[key].lines.push(line);
    acc[key].subtotal += line.amount;
    return acc;
  }, {});

  const selectedItems: SelectedItem[] = [];
  const selectedCoffin =
    state.coffinSelection === "catalogue" ? findCatalogueItem(coffinCatalogue, state.coffinCatalogue) : null;
  if (selectedCoffin) {
    selectedItems.push({
      kind: "coffin",
      title: translate(lang, selectedCoffin.titleKey),
      description: translate(lang, selectedCoffin.descKey),
      image: selectedCoffin.image,
    });
  }

  const selectedUrn =
    state.urnSelection === "catalogue" ? findCatalogueItem(urnCatalogue, state.urnCatalogue) : null;
  if (selectedUrn) {
    selectedItems.push({
      kind: "urn",
      title: translate(lang, selectedUrn.titleKey),
      description: translate(lang, selectedUrn.descKey),
      image: selectedUrn.image,
    });
  }

  const date = now.toLocaleDateString(localeFor(lang), {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return {
    lang,
    brand: `${translate(lang, "brandLead")} ${translate(lang, "brand")}`,
    title: subjectName
      ? translate(lang, "su_titleFor", { name: subjectName })
      : translate(lang, "su_titleGeneric"),
    lead: translate(lang, "su_lead"),
    generatedLine: pdfCopy[lang].generatedOn(date),
    emptyText: translate(lang, "su_empty"),
    summaryGroups,
    selectedItemsTitle: translate(lang, "step_coffinUrn"),
    selectedItems,
    costsTitle: translate(lang, "su_breakdown"),
    estimatedLabel: translate(lang, "su_estimated"),
    costGroups: Object.values(costGroups),
    totalLabel: translate(lang, "su_estTotal"),
    total: calculateTotal(state, lang),
    disclaimer: translate(lang, "su_disclaimer"),
    contactTitle: translate(lang, "contact_title"),
    contactLines: [
      translate(lang, "contact_info1"),
      translate(lang, "contact_info2"),
      translate(lang, "contact_info3"),
    ],
    footer: translate(lang, "footer"),
    filename: createSummaryPdfFilename(subjectName, lang),
  };
}

export async function exportSummaryPdf(state: WizardState, lang: Lang = "en") {
  const model = buildSummaryPdfModel(state, lang);
  const theme = resolveTheme();
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 34;
  const topMargin = 26;
  const footerHeight = 34;
  const contentWidth = pageWidth - marginX * 2;
  const locale = localeFor(lang);
  const logoDataUrl = await rasterizeSvgToPngDataUrl(buildLogoMarkSvg(theme), 320);
  const selectedItemsVisuals = await Promise.all(
    model.selectedItems.map(async (item) => ({
      ...item,
      imageDataUrl: await rasterizeImageToPngDataUrl(item.image, 320, 240, colorToHex(theme.surface)),
    })),
  );

  let y = topMargin;

  doc.setProperties({ title: model.title, subject: model.brand, creator: model.brand });
  doc.setLanguage?.(lang === "de" ? "de-DE" : "en-IE");

  const drawPageBackground = () => {
    applyFillColor(doc, theme.page);
    doc.rect(0, 0, pageWidth, pageHeight, "F");
    applyFillColor(doc, theme.accent);
    doc.rect(0, 0, pageWidth, 4, "F");
    applyFillColor(doc, theme.band);
    doc.rect(0, 4, pageWidth, 92, "F");
    applyDrawColor(doc, theme.border);
    doc.setLineWidth(0.4);
    doc.line(marginX, 96, pageWidth - marginX, 96);
  };

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - footerHeight - 8) {
      doc.addPage();
      drawPageBackground();
      y = topMargin;
    }
  };

  const drawWrappedText = (
    text: string,
    x: number,
    startY: number,
    width: number,
    fontSize: number,
    lineHeight: number,
    color: Color,
    style: "normal" | "bold" | "italic" = "normal",
  ) => {
    doc.setFont("helvetica", style);
    doc.setFontSize(fontSize);
    applyTextColor(doc, color);
    const lines = doc.splitTextToSize(text, width) as string[];
    doc.text(lines, x, startY);
    return lines.length * lineHeight;
  };

  const drawLogo = async (x: number, yPos: number, size: number) => {
    if (logoDataUrl) {
      doc.addImage(logoDataUrl, "PNG", x, yPos, size, size, undefined, "FAST");
      return;
    }

    applyDrawColor(doc, theme.primary);
    doc.setLineWidth(1.4);
    doc.circle(x + size / 2, yPos + size / 2, size / 3.2, "S");
    applyFillColor(doc, theme.accent);
    doc.circle(x + size / 2, yPos + size * 0.34, size / 11, "F");
  };

  const drawSectionTitle = (title: string, x: number, titleY: number, width: number, align: "left" | "right" = "left") => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.1);
    applyTextColor(doc, theme.primary);
    doc.text(title, align === "left" ? x : x + width, titleY, { align });
    applyDrawColor(doc, theme.accent);
    doc.setLineWidth(1.1);
    const lineX = align === "left" ? x : x + width - 34;
    doc.line(lineX, titleY + 5, lineX + 34, titleY + 5);
  };

  const renderSummaryCards = (groups: SummaryGroup[]) => {
    const columnGap = 10;
    const colWidth = (contentWidth - columnGap) / 2;
    const startY = y;
    let colY = [startY, startY];

    const measureCard = (rows: { label: string; value: string }[]) => {
      const valueWidth = colWidth - 20;
      const rowMetrics = rows.map((row) => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.8);
        const valueLines = doc.splitTextToSize(row.value, valueWidth) as string[];
        return { ...row, valueLines, height: Math.max(18, valueLines.length * 8 + 9) };
      });
      const height = 27 + rowMetrics.reduce((sum, row) => sum + row.height, 0) + 5;
      return { rowMetrics, height };
    };

    const drawCard = (
      title: string,
      rows: { label: string; value: string }[],
      x: number,
      cardY: number,
    ) => {
      const { rowMetrics, height } = measureCard(rows);

      applyFillColor(doc, theme.surface);
      applyDrawColor(doc, theme.border);
      doc.roundedRect(x, cardY, colWidth, height, 8, 8, "FD");
      const titleLines = doc.splitTextToSize(title, colWidth - 18) as string[];
      drawSectionTitle(titleLines[0], x + 10, cardY + 13, colWidth - 20);
      applyDrawColor(doc, theme.border);
      doc.setLineWidth(0.25);
      doc.line(x + 10, cardY + 24, x + colWidth - 10, cardY + 24);

      let rowY = cardY + 27;
      rowMetrics.forEach((row, index) => {
        if (index > 0) {
          applyDrawColor(doc, theme.border);
          doc.setLineWidth(0.25);
          doc.line(x + 9, rowY, x + colWidth - 9, rowY);
        }
        doc.setFont("helvetica", "bold");
        doc.setFontSize(6.1);
        applyTextColor(doc, theme.muted);
        doc.text(row.label.toLocaleUpperCase(locale), x + 9, rowY + 8);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        applyTextColor(doc, theme.ink);
        doc.text(row.valueLines, x + 9, rowY + 15.5);
        rowY += row.height;
      });

      return height;
    };

    const inputGroups = groups.length
      ? groups
      : [{ title: model.title, stepIndex: -1, rows: [{ label: "", value: model.emptyText }] }];

    inputGroups.forEach((group) => {
      const { height } = measureCard(group.rows);
      let col = colY[0] <= colY[1] ? 0 : 1;
      if (colY[col] + height > pageHeight - footerHeight - 8) {
        const other = col === 0 ? 1 : 0;
        if (colY[other] + height <= pageHeight - footerHeight - 8) {
          col = other;
        } else {
          doc.addPage();
          drawPageBackground();
          colY = [topMargin, topMargin];
          col = 0;
        }
      }

      const x = marginX + col * (colWidth + columnGap);
      const usedHeight = drawCard(group.title, group.rows, x, colY[col]);
      colY[col] += usedHeight + 8;
    });

    y = Math.max(colY[0], colY[1]) + 2;
  };

  const renderSelectedItemsCard = () => {
    if (!selectedItemsVisuals.length) return;

    const tileGap = 10;
    const columns = selectedItemsVisuals.length > 1 ? 2 : 1;
    const tileWidth = columns === 2 ? (contentWidth - tileGap) / 2 : contentWidth;
    const tileHeight = 104;
    const rows = Math.ceil(selectedItemsVisuals.length / columns);
    const cardHeight = 35 + rows * tileHeight + (rows - 1) * tileGap + 10;

    ensureSpace(cardHeight + 8);
    applyFillColor(doc, theme.surface);
    applyDrawColor(doc, theme.border);
    doc.roundedRect(marginX, y, contentWidth, cardHeight, 8, 8, "FD");
    drawSectionTitle(model.selectedItemsTitle, marginX + 12, y + 17, contentWidth - 24);
    applyDrawColor(doc, theme.border);
    doc.setLineWidth(0.25);
    doc.line(marginX + 12, y + 28, marginX + contentWidth - 12, y + 28);

    let tileIndex = 0;
    for (let row = 0; row < rows; row += 1) {
      const tileY = y + 39 + row * (tileHeight + tileGap);
      for (let col = 0; col < columns; col += 1) {
        const item = selectedItemsVisuals[tileIndex];
        if (!item) continue;
        const tileX = marginX + col * (tileWidth + tileGap);

        applyFillColor(doc, theme.surfaceSoft);
        applyDrawColor(doc, theme.border);
        doc.roundedRect(tileX, tileY, tileWidth, tileHeight, 8, 8, "FD");

        const imageX = tileX + 9;
        const imageY = tileY + 9;
        const imageWidth = 92;
        const imageHeight = 74;
        applyFillColor(doc, theme.surface);
        applyDrawColor(doc, theme.border);
        doc.roundedRect(imageX - 3, imageY - 3, imageWidth + 6, imageHeight + 6, 8, 8, "FD");
        if (item.imageDataUrl) {
          doc.addImage(item.imageDataUrl, "PNG", imageX, imageY, imageWidth, imageHeight, undefined, "FAST");
        } else {
          applyFillColor(doc, theme.band);
          doc.roundedRect(imageX, imageY, imageWidth, imageHeight, 8, 8, "F");
        }

        const textX = imageX + imageWidth + 12;
        const textWidth = tileWidth - (imageWidth + 34);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.8);
        applyTextColor(doc, theme.ink);
        const titleLines = doc.splitTextToSize(item.title, textWidth) as string[];
        doc.text(titleLines.slice(0, 2), textX, tileY + 24);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.1);
        applyTextColor(doc, theme.muted);
        const descLines = doc.splitTextToSize(item.description, textWidth) as string[];
        doc.text(descLines.slice(0, 4), textX, tileY + 43);

        tileIndex += 1;
      }
    }

    y += cardHeight + 8;
  };

  const renderCostsCard = () => {
    const headerHeight = 30;
    const groupHeaderHeight = 15;
    const lineHeight = 10.5;
    const totalHeight = 28;
    const contentHeight = model.costGroups.reduce(
      (sum, group) => sum + groupHeaderHeight + group.lines.length * lineHeight,
      0,
    );
    const cardHeight = headerHeight + contentHeight + totalHeight + 10;

    ensureSpace(cardHeight + 8);
    applyFillColor(doc, theme.surface);
    applyDrawColor(doc, theme.border);
    doc.roundedRect(marginX, y, contentWidth, cardHeight, 8, 8, "FD");
    drawSectionTitle(model.costsTitle, marginX + 12, y + 17, contentWidth - 24);
    applyDrawColor(doc, theme.border);
    doc.setLineWidth(0.25);
    doc.line(marginX + 12, y + 28, marginX + contentWidth - 12, y + 28);

    let rowY = y + headerHeight + 4;
    model.costGroups.forEach((group) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.3);
      applyTextColor(doc, theme.ink);
      doc.text(group.label, marginX + 12, rowY + 9.5);
      doc.text(formatEUR(group.subtotal, lang), marginX + contentWidth - 12, rowY + 9.5, { align: "right" });
      rowY += groupHeaderHeight;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.1);
      group.lines.forEach((line) => {
        const label = line.estimated ? `${line.label} (${model.estimatedLabel})` : line.label;
        const maxLabelWidth = contentWidth - 112;
        const clippedLabel = doc.getTextWidth(label) > maxLabelWidth ? `${label.slice(0, 78)}...` : label;
        applyTextColor(doc, theme.muted);
        doc.text(clippedLabel, marginX + 22, rowY + 7.2);
        doc.text(formatEUR(line.amount, lang), marginX + contentWidth - 12, rowY + 7.2, { align: "right" });
        rowY += lineHeight;
      });

      applyDrawColor(doc, theme.border);
      doc.setLineWidth(0.25);
      doc.line(marginX + 12, rowY + 1, marginX + contentWidth - 12, rowY + 1);
    });

    applyFillColor(doc, theme.surfaceSoft);
    doc.roundedRect(marginX + 10, rowY + 6, contentWidth - 20, 24, 8, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.2);
    applyTextColor(doc, theme.primary);
    doc.text(model.totalLabel, marginX + 22, rowY + 22);
    doc.setFontSize(14.5);
    doc.text(formatEUR(model.total, lang), marginX + contentWidth - 22, rowY + 22, { align: "right" });
    y += cardHeight + 8;
  };

  const renderDisclaimer = () => {
    const disclaimerLines = doc.splitTextToSize(model.disclaimer, contentWidth) as string[];
    const disclaimerHeight = disclaimerLines.length * 8.2 + 4;
    ensureSpace(disclaimerHeight + 8);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(6.9);
    applyTextColor(doc, theme.muted);
    doc.text(disclaimerLines, marginX, y + 5);
    y += disclaimerHeight + 6;
  };

  const renderContactCard = () => {
    const valueWidth = contentWidth - 24;
    const paragraphs = model.contactLines.map((line) => doc.splitTextToSize(line, valueWidth) as string[]);
    const textHeight = paragraphs.reduce((sum, lines) => sum + lines.length * 8.2 + 5, 0);
    const cardHeight = Math.max(64, 38 + textHeight);

    ensureSpace(cardHeight + 6);
    applyFillColor(doc, theme.surface);
    applyDrawColor(doc, theme.border);
    doc.roundedRect(marginX, y, contentWidth, cardHeight, 8, 8, "FD");
    drawSectionTitle(model.contactTitle, marginX + 12, y + 18, 120);
    applyDrawColor(doc, theme.border);
    doc.setLineWidth(0.25);
    doc.line(marginX + 12, y + 28, marginX + contentWidth - 12, y + 28);

    let textY = y + 43;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.4);
    applyTextColor(doc, theme.muted);
    paragraphs.forEach((lines) => {
      doc.text(lines, marginX + 12, textY);
      textY += lines.length * 8.2 + 5;
    });

    y += cardHeight + 6;
  };

  drawPageBackground();
  await drawLogo(marginX, y - 1, 42);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  applyTextColor(doc, theme.ink);
  doc.text(model.brand, marginX + 52, y + 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  applyTextColor(doc, theme.muted);
  doc.text(model.generatedLine, pageWidth - marginX, y + 16, { align: "right" });

  y += 52;
  doc.setFont("helvetica", "bold");
  applyTextColor(doc, theme.ink);
  const titleHeight = drawWrappedText(model.title, marginX, y, contentWidth, 17, 19, theme.ink, "bold");
  y += titleHeight + 10;

  renderSummaryCards(model.summaryGroups);
  renderSelectedItemsCard();
  renderCostsCard();
  renderDisclaimer();
  renderContactCard();

  const totalPages = doc.getNumberOfPages();
  for (let page = 1; page <= totalPages; page += 1) {
    doc.setPage(page);
    applyFillColor(doc, theme.band);
    doc.rect(0, pageHeight - footerHeight, pageWidth, footerHeight, "F");
    applyDrawColor(doc, theme.border);
    doc.line(marginX, pageHeight - footerHeight + 4, pageWidth - marginX, pageHeight - footerHeight + 4);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    applyTextColor(doc, theme.muted);
    doc.text(model.footer, marginX, pageHeight - 14);
    doc.text(pdfCopy[lang].page(page, totalPages), pageWidth - marginX, pageHeight - 14, { align: "right" });
  }

  doc.save(model.filename);
}
