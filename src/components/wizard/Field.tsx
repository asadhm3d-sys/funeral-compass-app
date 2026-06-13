import { ReactNode } from "react";

interface FieldProps {
  label: string;
  hint?: string;
  children: ReactNode;
}

export const Field = ({ label, hint, children }: FieldProps) => (
  <div className="theme-field space-y-2">
    <label className="theme-field-label block text-sm font-medium text-foreground">{label}</label>
    {hint && <p className="theme-field-hint text-xs text-muted-foreground">{hint}</p>}
    {children}
  </div>
);

export const Section = ({
  title,
  description,
  titleAction,
  children,
}: {
  title: string;
  description?: string;
  titleAction?: ReactNode;
  children: ReactNode;
}) => (
  <section className="theme-section space-y-4 rounded-xl border border-border bg-card p-5 shadow-card sm:p-6">
    <div className="theme-section-header">
      <div className="flex items-center gap-2">
        <h3 className="theme-section-title text-base font-medium text-foreground">{title}</h3>
        {titleAction}
      </div>
      {description && <p className="theme-section-description mt-1 text-sm text-muted-foreground">{description}</p>}
    </div>
    {children}
  </section>
);
