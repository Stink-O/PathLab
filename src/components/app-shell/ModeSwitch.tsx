"use client";

import { GitCompareArrows, ListOrdered } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Mode } from "@/lib/constants";

export function ModeSwitch({
  mode,
  onMode,
}: {
  mode: Mode;
  onMode: (mode: Mode) => void;
}) {
  return (
    <div className="grid grid-cols-2 rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-1">
      {[
        { id: "pathfinding" as const, label: "Pathfinding", icon: GitCompareArrows },
        { id: "sorting" as const, label: "Sorting", icon: ListOrdered },
      ].map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onMode(item.id)}
            className={cn(
              "flex h-9 items-center justify-center gap-2 rounded-[10px] px-3 text-sm transition",
              mode === item.id
                ? "bg-[var(--text)] text-[var(--bg)]"
                : "text-[var(--muted)] hover:text-[var(--text)]",
            )}
          >
            <Icon size={16} strokeWidth={1.5} />
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
