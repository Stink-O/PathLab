import { cn } from "@/lib/cn";

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[10px] border border-[var(--border)] bg-[var(--surface)] px-2 py-1 font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--muted)]",
        className,
      )}
    >
      {children}
    </span>
  );
}
