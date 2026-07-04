import { cn } from "@/lib/cn";

export function Panel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-[16px] border border-[var(--border)] bg-[var(--surface)] shadow-[0_1px_0_var(--edge)_inset,0_8px_18px_var(--panel-shadow)]",
        className,
      )}
    >
      {children}
    </section>
  );
}
