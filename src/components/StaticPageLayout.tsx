import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/wizard/Logo";
import { LanguageSwitcher, useLang } from "@/lib/i18n";
import { EmergencyHelp } from "@/components/EmergencyHelp";

export const StaticPageLayout = ({ children }: { children: ReactNode }) => {
  const { t } = useLang();
  return (
    <div className="app-shell min-h-screen bg-gradient-warm">
      <header className="app-header border-b border-border/60 bg-background/70 backdrop-blur-sm">
        <div className="app-header-inner container flex h-16 items-center justify-between gap-3">
          <Link to="/" aria-label={t("nav_home")}>
            <Logo />
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/plans"
              className="text-sm font-medium text-muted-foreground transition-smooth hover:text-primary"
            >
              {t("nav_myPlans")}
            </Link>
            <Link
              to="/account"
              className="text-sm font-medium text-muted-foreground transition-smooth hover:text-primary"
            >
              {t("nav_account")}
            </Link>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="app-main container max-w-5xl py-8 sm:py-12">
        {children}
      </main>

      <EmergencyHelp />

      <footer className="app-footer border-t border-border/60 py-6">
        <div className="container flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between">
          <span className="text-xs text-muted-foreground">
            {t("footer")}
          </span>
          <nav className="flex flex-wrap items-center gap-4 text-xs">
            <Link
              to="/contact"
              className="text-muted-foreground transition-smooth hover:text-primary"
            >
              {t("nav_contact")}
            </Link>
            <Link
              to="/about"
              className="text-muted-foreground transition-smooth hover:text-primary"
            >
              {t("nav_about")}
            </Link>
            <Link
              to="/impressum"
              className="text-muted-foreground transition-smooth hover:text-primary"
            >
              {t("nav_impressum")}
            </Link>
            <Link
              to="/datenschutz"
              className="text-muted-foreground transition-smooth hover:text-primary"
            >
              {t("nav_datenschutz")}
            </Link>
            <Link
              to="/terms"
              className="text-muted-foreground transition-smooth hover:text-primary"
            >
              {t("nav_terms")}
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
};
