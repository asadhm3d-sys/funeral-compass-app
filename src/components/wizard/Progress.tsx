import { Check, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n";

interface ProgressProps {
  current: number;
  total: number;
  labels: string[];
  onJump?: (index: number) => void;
}

export const Progress = ({ current, total, labels, onJump }: ProgressProps) => {
  const { t } = useLang();
  const percent = ((current + 1) / total) * 100;

  const header = (
    <>
      <span>{t("stepXofY", { current: current + 1, total })}</span>
      <span className="flex items-center gap-1 text-primary">
        {labels[current]}
        {onJump && <ChevronDown className="h-3.5 w-3.5" />}
      </span>
    </>
  );

  return (
    <div className="theme-progress w-full">
      {onJump ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="theme-progress-labels mb-2 flex w-full items-center justify-between text-xs font-medium text-muted-foreground focus:outline-none"
            >
              {header}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="max-h-72 w-64 overflow-y-auto">
            {labels.map((label, i) => (
              <DropdownMenuItem
                key={label + i}
                disabled={i > current}
                onSelect={() => onJump(i)}
                className={cn("gap-2", i === current && "font-medium text-primary")}
              >
                <Check className={cn("h-3.5 w-3.5", i <= current ? "opacity-100" : "opacity-0")} />
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="theme-progress-labels mb-2 flex items-center justify-between text-xs font-medium text-muted-foreground">
          {header}
        </div>
      )}
      <div className="theme-progress-track h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn("theme-progress-bar h-full rounded-full bg-primary transition-smooth")}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};
