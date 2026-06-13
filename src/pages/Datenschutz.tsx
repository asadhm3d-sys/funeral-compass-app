import { StaticPageLayout } from "@/components/StaticPageLayout";
import { useLang } from "@/lib/i18n";

export const Datenschutz = () => {
  const { t } = useLang();
  return (
    <StaticPageLayout>
      <div className="mx-auto max-w-3xl">
        <h1 className="entry-title mb-4 text-foreground">{t("ds_title")}</h1>
        <p className="entry-lead mb-10 text-muted-foreground">{t("ds_lead")}</p>

        <div className="theme-section entry-card rounded-3xl border border-border/60 bg-card/80 p-8 backdrop-blur-sm">
          <div className="space-y-6 text-foreground">
            <section>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">
                {t("ds_s1_title")}
              </h2>
              <p>{t("ds_s1_body")}</p>
            </section>
            <section>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">
                {t("ds_s2_title")}
              </h2>
              <p>{t("ds_s2_body")}</p>
            </section>
            <section>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">
                {t("ds_s3_title")}
              </h2>
              <p>{t("ds_s3_body")}</p>
            </section>
            <section>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">
                {t("ds_s4_title")}
              </h2>
              <p className="text-muted-foreground">{t("ds_s4_body")}</p>
            </section>
          </div>
        </div>
      </div>
    </StaticPageLayout>
  );
};

export default Datenschutz;
