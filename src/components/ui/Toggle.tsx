"use client";

import { Check } from "lucide-react";
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
      className="flex cursor-pointer select-none items-center gap-2.5 text-[15px] text-[var(--text)]"
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
        aria-hidden="true"
        className={cn(
          "grid h-[18px] w-[18px] place-items-center rounded-[4px] border transition-colors duration-150",
          "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--accent)]",
          checked
            ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--on-accent)]"
            : "border-[var(--border)] bg-[var(--surface)] text-transparent",
        )}
      >
        <Check size={13} strokeWidth={3} />
      </span>
      {label}
    </label>
  );
}
