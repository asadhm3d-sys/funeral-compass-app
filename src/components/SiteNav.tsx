import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLang } from "@/lib/i18n";

const PAGES = [
  { to: "/", key: "nav_home" },
  { to: "/about", key: "nav_about" },
  { to: "/contact", key: "nav_contact" },
  { to: "/impressum", key: "nav_impressum" },
  { to: "/datenschutz", key: "nav_datenschutz" },
  { to: "/terms", key: "nav_terms" },
] as const;

export const SiteNav = () => {
  const { t } = useLang();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-smooth hover:border-primary/40 hover:text-primary focus:outline-none">
        <Menu className="h-3.5 w-3.5" />
        {t("nav_pages")}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {PAGES.map((page) => (
          <DropdownMenuItem key={page.to} asChild>
            <Link to={page.to}>{t(page.key)}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
