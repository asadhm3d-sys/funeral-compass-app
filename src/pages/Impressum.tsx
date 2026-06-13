import { StaticPageLayout } from "@/components/StaticPageLayout";
import { useLang } from "@/lib/i18n";

export const Impressum = () => {
  const { t } = useLang();
  return (
    <StaticPageLayout>
      <div className="mx-auto max-w-3xl">
        <h1 className="entry-title mb-4 text-foreground">{t("impressum_title")}</h1>
        <p className="entry-lead mb-10 text-muted-foreground">{t("impressum_lead")}</p>

        <div className="theme-section entry-card rounded-3xl border border-border/60 bg-card/80 p-8 backdrop-blur-sm">
          <div className="space-y-6 text-foreground">
            <p>{t("impressum_info1")}</p>
            <p>{t("impressum_info2")}</p>
            <p className="text-muted-foreground">{t("impressum_info3")}</p>
          </div>
        </div>
      </div>
    </StaticPageLayout>
  );
};

export default Impressum;
