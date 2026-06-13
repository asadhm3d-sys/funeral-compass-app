import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, SkipForward } from "lucide-react";
import { useLang } from "@/lib/i18n";

interface StepShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  onBack?: () => void;
  onNext?: () => void;
  onSkip?: () => void;
  nextLabel?: string;
  canSkip?: boolean;
}

export const StepShell = ({
  title,
  subtitle,
  children,
  onBack,
  onNext,
  onSkip,
  nextLabel,
  canSkip = true,
}: StepShellProps) => {
  const { t } = useLang();
  return (
  <div className="step-shell animate-fade-in">
    <header className="step-header mb-8 max-w-2xl">
      <h1 className="step-title text-2xl font-medium text-foreground sm:text-3xl">{title}</h1>
      {subtitle && <p className="step-subtitle mt-2 text-base leading-relaxed text-muted-foreground">{subtitle}</p>}
    </header>

    <div className="step-body mb-10">{children}</div>

    <footer className="step-footer flex flex-col-reverse items-stretch gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        {onBack && (
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> {t("back")}
          </Button>
        )}
      </div>
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
        {canSkip && onSkip && (
          <Button variant="ghost" onClick={onSkip} className="gap-2 text-muted-foreground">
            <SkipForward className="h-4 w-4" /> {t("skip")}
          </Button>
        )}
        {onNext && (
          <Button onClick={onNext} className="gap-2" size="lg">
            {nextLabel ?? t("continue")} <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </footer>
  </div>
  );
};

