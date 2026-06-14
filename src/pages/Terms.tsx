import { StaticPageLayout } from "@/components/StaticPageLayout";
import { useLang } from "@/lib/i18n";

export const Terms = () => {
  const { t } = useLang();
  return (
    <StaticPageLayout>
      <div className="mx-auto max-w-3xl">
        <h1 className="entry-title mb-4 text-foreground">{t("terms_title")}</h1>
        <p className="entry-lead mb-10 text-muted-foreground">{t("terms_lead")}</p>

        <div className="theme-section entry-card rounded-3xl border border-border/60 bg-card/80 p-8 backdrop-blur-sm">
          <div className="space-y-6 text-foreground">
            <section>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">
                {t("terms_s1_title")}
              </h2>
              <p>{t("terms_s1_body")}</p>
            </section>
            <section>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">
                {t("terms_s2_title")}
              </h2>
              <p>{t("terms_s2_body")}</p>
            </section>
            <section>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">
                {t("terms_s3_title")}
              </h2>
              <p>{t("terms_s3_body")}</p>
            </section>
            <section>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">
                {t("terms_s4_title")}
              </h2>
              <p>{t("terms_s4_body")}</p>
            </section>
            <section>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">
                {t("terms_s5_title")}
              </h2>
              <p className="text-muted-foreground">{t("terms_s5_body")}</p>
            </section>
          </div>
        </div>
      </div>
    </StaticPageLayout>
  );
};

export default Terms;
