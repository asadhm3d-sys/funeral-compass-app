import { Phone } from "lucide-react";
import { useLang } from "@/lib/i18n";

// =====================================================================
// EmergencyHelp — a calm, always-available path to a human being.
// Mirrors the stakeholder's real 24h "Soforthilfe" service.
// =====================================================================

const PHONE_DISPLAY = "07262 205 3000";
const PHONE_TEL = "+4972622053000";

export const EmergencyHelp = () => {
  const { t } = useLang();
  return (
    <div className="border-t border-border/60 bg-primary/5">
      <div className="container flex flex-col items-center justify-center gap-1.5 py-4 text-center sm:flex-row sm:gap-3">
        <span className="text-sm text-muted-foreground">{t("eh_lead")}</span>
        <a
          href={`tel:${PHONE_TEL}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-smooth hover:opacity-80"
        >
          <Phone className="h-4 w-4" />
          {t("eh_phoneLabel")} {PHONE_DISPLAY}
        </a>
      </div>
    </div>
  );
};
