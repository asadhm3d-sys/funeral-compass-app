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
      <DropdownMenuTrigger className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-smooth hover:text-primary focus:outline-none">
        <Menu className="h-4 w-4" />
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
