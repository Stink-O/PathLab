"use client";

import { cn } from "@/lib/cn";
import type { Mode } from "@/lib/constants";

const MODES: { id: Mode; label: string }[] = [
  { id: "pathfinding", label: "Pathfinding" },
  { id: "sorting", label: "Sorting" },
];

export function ModeSwitch({
  mode,
  onMode,
}: {
  mode: Mode;
  onMode: (mode: Mode) => void;
}) {
  return (
    <nav aria-label="Mode" className="flex items-stretch self-stretch">
      {MODES.map((item) => {
        const active = mode === item.id;
        return (
          <button
            key={item.id}
            type="button"
            aria-current={active ? "page" : undefined}
            onClick={() => onMode(item.id)}
            className={cn(
              "relative px-4 text-[15px] font-medium transition-colors duration-150",
              "focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--accent)]",
              active
                ? "text-[var(--text)]"
                : "text-[var(--muted)] hover:text-[var(--text)]",
            )}
          >
            {item.label}
            {active && (
              <span
                aria-hidden="true"
                className="absolute inset-x-3 -bottom-px h-[2px] bg-[var(--accent)]"
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
