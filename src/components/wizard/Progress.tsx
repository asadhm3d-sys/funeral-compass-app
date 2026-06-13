import { cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n";

interface ProgressProps {
  current: number;
  total: number;
  labels: string[];
}

export const Progress = ({ current, total, labels }: ProgressProps) => {
  const { t } = useLang();
  const percent = ((current + 1) / total) * 100;
  return (
    <div className="theme-progress w-full">
      <div className="theme-progress-labels mb-2 flex items-center justify-between text-xs font-medium text-muted-foreground">
        <span>{t("stepXofY", { current: current + 1, total })}</span>
        <span className="text-primary">{labels[current]}</span>
      </div>
      <div className="theme-progress-track h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn("theme-progress-bar h-full rounded-full bg-primary transition-smooth")}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

