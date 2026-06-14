import { WizardState } from "@/types/wizard";
import type { Lang } from "@/lib/i18n";

export interface ChecklistItem {
  id: string;
  label: string;
  note?: string;
}

const labels: Record<Lang, Record<string, { label: string; note?: string }>> = {
  en: {
    idCard: { label: "ID card or passport of the deceased" },
    birthCertificate: { label: "Birth certificate" },
    deathCertificate: {
      label: "Medical certificate of death",
      note: "Issued by the attending doctor or hospital",
    },
    familyStatusDoc: {
      label: "Marriage certificate, divorce decree, or spouse's death certificate",
      note: "Whichever applies to the deceased's family status",
    },
    secondMedicalCert: {
      label: "Second medical certificate for cremation",
      note: "Required by law for cremations (second post-mortem examination)",
    },
    photo: { label: "A photo of the deceased", note: "For the obituary and/or ceremony" },
    healthInsuranceCard: { label: "Health insurance card or membership number" },
    pensionInsuranceNumber: { label: "Social security / pension insurance number" },
    bankDetails: { label: "Bank details (IBAN)", note: "For settling costs and reimbursements" },
    ownIdCard: { label: "Your own ID card or passport" },
    advanceDirective: {
      label: "Any existing advance directive or burial wishes",
      note: "If one has already been written down",
    },
  },
  de: {
    idCard: { label: "Personalausweis oder Reisepass der verstorbenen Person" },
    birthCertificate: { label: "Geburtsurkunde" },
    deathCertificate: {
      label: "Ärztliche Todesbescheinigung (Totenschein)",
      note: "Ausgestellt vom behandelnden Arzt oder Krankenhaus",
    },
    familyStatusDoc: {
      label: "Heirats-, Scheidungs- oder Sterbeurkunde des Ehepartners",
      note: "Je nach Familienstand der verstorbenen Person",
    },
    secondMedicalCert: {
      label: "Zweite ärztliche Bescheinigung für die Feuerbestattung",
      note: "Gesetzlich vorgeschrieben (zweite Leichenschau)",
    },
    photo: { label: "Ein Foto der verstorbenen Person", note: "Für Traueranzeige und/oder Trauerfeier" },
    healthInsuranceCard: { label: "Krankenversicherungskarte bzw. Mitgliedsnummer" },
    pensionInsuranceNumber: { label: "Sozialversicherungs- bzw. Rentenversicherungsnummer" },
    bankDetails: { label: "Bankverbindung (IBAN)", note: "Für die Begleichung von Kosten und Erstattungen" },
    ownIdCard: { label: "Ihr eigener Personalausweis oder Reisepass" },
    advanceDirective: {
      label: "Eine bereits vorhandene Patientenverfügung oder Bestattungsverfügung",
      note: "Falls bereits etwas schriftlich festgehalten wurde",
    },
  },
};

export function buildDocumentChecklist(state: WizardState, lang: Lang): ChecklistItem[] {
  const L = labels[lang];
  const items: ChecklistItem[] = [];

  const push = (id: keyof typeof L) => items.push({ id, ...L[id] });

  if (state.mode === "preplanning") {
    push("ownIdCard");
    push("advanceDirective");
    return items;
  }

  push("idCard");
  push("birthCertificate");
  push("deathCertificate");
  push("familyStatusDoc");

  if (state.burialType === "cremation") {
    push("secondMedicalCert");
  }

  if (state.ceremonyPicture || state.obituaryBefore || state.obituaryAfter) {
    push("photo");
  }

  if (state.assistanceWanted) {
    push("healthInsuranceCard");
    push("pensionInsuranceNumber");
    push("bankDetails");
  }

  return items;
}
