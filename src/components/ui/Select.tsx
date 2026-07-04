import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "select-field h-10 min-w-0 rounded-[4px] border border-[var(--border)] bg-[var(--surface)] pl-3 pr-8 text-[15px] text-[var(--text)] outline-none transition-colors duration-150",
        "hover:border-[var(--muted)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
