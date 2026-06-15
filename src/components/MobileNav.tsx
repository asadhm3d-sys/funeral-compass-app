import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useLang } from "@/lib/i18n";

const PAGES = [
  { to: "/", key: "nav_home" },
  { to: "/about", key: "nav_about" },
  { to: "/contact", key: "nav_contact" },
  { to: "/impressum", key: "nav_impressum" },
  { to: "/datenschutz", key: "nav_datenschutz" },
  { to: "/terms", key: "nav_terms" },
] as const;

const linkClass =
  "rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-smooth hover:bg-muted";

interface MobileNavProps {
  onViewSummary?: () => void;
}

export const MobileNav = ({ onViewSummary }: MobileNavProps) => {
  const { t } = useLang();
  return (
    <Sheet>
      <SheetTrigger className="inline-flex items-center justify-center rounded-full border border-border bg-background p-2 text-muted-foreground transition-smooth hover:border-primary/40 hover:text-primary focus:outline-none sm:hidden">
        <Menu className="h-4 w-4" />
        <span className="sr-only">{t("nav_pages")}</span>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col gap-1 overflow-y-auto">
        <SheetTitle>
          {t("brandLead")} {t("brand")}
        </SheetTitle>

        {onViewSummary && (
          <SheetClose asChild>
            <button type="button" onClick={onViewSummary} className={`${linkClass} text-left text-primary`}>
              {t("viewSummary")}
            </button>
          </SheetClose>
        )}

        <SheetClose asChild>
          <Link to="/plans" className={linkClass}>
            {t("nav_myPlans")}
          </Link>
        </SheetClose>
        <SheetClose asChild>
          <Link to="/account" className={linkClass}>
            {t("nav_account")}
          </Link>
        </SheetClose>

        <div className="my-2 border-t border-border" />

        {PAGES.map((page) => (
          <SheetClose key={page.to} asChild>
            <Link to={page.to} className={linkClass}>
              {t(page.key)}
            </Link>
          </SheetClose>
        ))}
      </SheetContent>
    </Sheet>
  );
};
