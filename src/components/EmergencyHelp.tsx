import { Phone } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { PROVIDER } from "@/lib/providerConfig";

// =====================================================================
// EmergencyHelp — a calm, always-available path to a human being.
// =====================================================================

export const EmergencyHelp = () => {
  const { t } = useLang();
  return (
    <div className="border-t border-border/60 bg-primary/5">
      <div className="container flex flex-col items-center justify-center gap-1.5 py-4 text-center sm:flex-row sm:gap-3">
        <span className="text-sm text-muted-foreground">{t("eh_lead")}</span>
        <a
          href={`tel:${PROVIDER.phoneTel}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-smooth hover:opacity-80"
        >
          <Phone className="h-4 w-4" />
          {t("eh_phoneLabel")} {PROVIDER.phoneDisplay}
        </a>
      </div>
    </div>
  );
};
