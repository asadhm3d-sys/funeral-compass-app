import { cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n";

interface PillProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export const Pill = ({ active, onClick, children }: PillProps) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "theme-pill rounded-full border px-4 py-2 text-sm font-medium transition-smooth",
      active
        ? "border-primary bg-primary text-primary-foreground"
        : "border-border bg-background text-foreground hover:border-primary/40",
    )}
  >
    {children}
  </button>
);

/** Helper: toggling a pill — returns null if the same value is clicked again. */
export function toggleValue<T>(current: T | null | undefined, value: T): T | null {
  return current === value ? null : value;
}

interface PillGroupProps<T extends string> {
  value: T | null;
  options: readonly (readonly [T, string])[];
  onChange: (next: T | null) => void;
}

export function PillGroup<T extends string>({ value, options, onChange }: PillGroupProps<T>) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(([v, l]) => (
        <Pill key={v} active={value === v} onClick={() => onChange(value === v ? null : v)}>
          {l}
        </Pill>
      ))}
    </div>
  );
}

interface YesNoProps {
  value: boolean | null;
  onChange: (v: boolean | null) => void;
  yesLabel?: string;
  noLabel?: string;
}


export const YesNo = ({ value, onChange, yesLabel, noLabel }: YesNoProps) => {
  const { t } = useLang();
  const yes = yesLabel ?? t("yes");
  const no = noLabel ?? t("no");
  return (
    <div className="flex flex-wrap gap-2">
      <Pill active={value === true} onClick={() => onChange(value === true ? null : true)}>
        {yes}
      </Pill>
      <Pill active={value === false} onClick={() => onChange(value === false ? null : false)}>
        {no}
      </Pill>
    </div>
  );
};

