import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface OptionCardProps {
  title: string;
  description: string;
  image?: string;
  badge?: string;
  selected: boolean;
  onClick: () => void;
}

export const OptionCard = ({ title, description, image, badge, selected, onClick }: OptionCardProps) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "option-card group relative flex flex-col overflow-hidden rounded-xl border bg-card text-left shadow-card transition-smooth",
      "hover:-translate-y-0.5 hover:shadow-soft focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
      selected ? "is-selected border-primary ring-2 ring-primary/30" : "border-border hover:border-primary/40"
    )}
  >
    {image && (
      <div className="option-card-media aspect-[4/3] w-full overflow-hidden bg-muted">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-smooth group-hover:scale-[1.03]"
        />
      </div>
    )}
    {selected && (
      <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-soft">
        <Check className="h-4 w-4" strokeWidth={2.5} />
      </div>
    )}
    <div className="option-card-content flex flex-1 flex-col gap-1.5 p-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="option-card-title font-medium text-foreground">{title}</h3>
        {badge && (
          <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
            {badge}
          </span>
        )}
      </div>
      <p className="option-card-description text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  </button>
);
