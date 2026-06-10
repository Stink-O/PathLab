"use client";

import { cn } from "@/lib/cn";

export function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <label
      className="flex cursor-pointer items-center gap-2 text-sm text-[var(--muted)]"
      title={description}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        aria-label={description ? `${label}: ${description}` : label}
        className="peer sr-only"
      />
      <span
        className={cn(
          "relative h-5 w-9 rounded-[10px] border border-[var(--border)] bg-[var(--bg)] transition",
          "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--accent)]",
          checked && "border-[var(--accent)] bg-[var(--accent)]",
        )}
      >
        <span
          className={cn(
            "absolute left-0.5 top-0.5 h-4 w-4 rounded-[8px] bg-[var(--surface)] transition",
            checked && "translate-x-4 bg-[#16120C]",
          )}
        />
      </span>
      {label}
    </label>
  );
}
