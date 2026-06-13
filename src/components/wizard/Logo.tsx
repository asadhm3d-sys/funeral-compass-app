import { useLang } from "@/lib/i18n";

export const Logo = ({ className = "" }: { className?: string }) => {
  const { t } = useLang();
  return (
    <div className={`app-logo flex items-center gap-2 ${className}`}>
      <div className="app-logo-mark flex h-12 w-12 items-center justify-center bg-transparent">
        <svg
          className="app-logo-svg"
          viewBox="0 0 512 512"
          role="img"
          aria-label={`${t("brandLead")} ${t("brand")}`}
        >
          <path className="logo-ring-dark" d="M58 230a198 198 0 0 1 170-169" />
          <path className="logo-ring-dark" d="M285 61a198 198 0 0 1 169 169" />
          <path className="logo-ring-soft" d="M58 282a198 198 0 0 0 174 169" />
          <path className="logo-ring-soft" d="M280 451a198 198 0 0 0 174-169" />

          <path
            className="logo-path"
            d="M82 334c20-55 76-93 160-113 35-8 82-7 140 2-55 7-102 20-139 39-39 21-54 46-46 75 7 26 34 50 82 78 21 13 39 25 54 38h-71c-10-15-25-30-47-45-35-24-56-47-62-72-6-27 7-51 39-72-45 13-79 32-101 57-22 25-26 51-13 78 7 15 3 26-12 31-31-20-59-53-84-96Z"
          />
          <path
            className="logo-path logo-path-dark"
            d="M244 210c45 2 94 9 151 22-58 8-108 22-148 42-25 13-41 28-47 45-6 18 3 35 26 52-46-19-68-44-66-74 2-36 30-65 84-87Z"
          />

          <path className="logo-flame" d="M268 22c-23 62-39 119-46 171l32-66 11 104c25-73 31-141 3-209Z" />
          <path className="logo-cutout" d="M247 149c-6 27-10 52-11 76l18-47 4 52c6-35 5-62-11-81Z" />
          <path className="logo-flame" d="M214 189l-47-92" />
          <path className="logo-flame" d="M196 227l-75-21" />
          <path className="logo-flame" d="M301 179l46-48" />
          <path className="logo-flame" d="M325 220l66-14" />
        </svg>
      </div>
      <span className="app-logo-text text-lg font-medium tracking-tight text-foreground">
        {t("brandLead")} <span className="text-primary">{t("brand")}</span>
      </span>
    </div>
  );
};

