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
        "rounded-[16px] border border-[var(--border)] bg-[var(--surface)] shadow-[0_1px_0_rgba(255,255,255,.45)_inset,0_8px_18px_rgba(29,27,24,.06)]",
        className,
      )}
    >
      {children}
    </section>
  );
}
