import { cn } from "@/lib/cn";

/** Labelled form field: 13px label above the control, no box around it. */
export function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("grid content-start gap-1.5", className)}>
      <span className="text-[13px] font-medium text-[var(--muted)]">{label}</span>
      {children}
    </label>
  );
}
