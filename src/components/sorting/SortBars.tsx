import type { SortStep } from "@/algorithms/sorting/types";
import { cn } from "@/lib/cn";

export function SortBars({ step, seed }: { step?: SortStep; seed: number[] }) {
  const array = step?.array ?? seed;
  const max = Math.max(...array, 1);
  return (
    <div className="flex h-[260px] items-end gap-[2px] rounded-[14px] border border-[var(--border)] bg-[var(--cell)] p-3">
      {array.map((value, index) => {
        const state = step?.sorted.has(index)
          ? "sorted"
          : step?.swapped.has(index)
            ? "swapped"
            : step?.compared.has(index)
              ? "compared"
              : step?.active.has(index)
                ? "active"
                : "idle";
        return (
          <div
            key={`${index}-${value}`}
            className={cn(
              "min-w-0 flex-1 rounded-t-[6px] transition-all",
              state === "idle" && "bg-[var(--bar)]",
              state === "active" && "bg-[var(--visited)]",
              state === "compared" && "bg-[var(--frontier)]",
              state === "swapped" && "bg-[var(--swap)]",
              state === "sorted" && "bg-[var(--path)]",
            )}
            style={{ height: `${Math.max(6, (value / max) * 100)}%` }}
          />
        );
      })}
    </div>
  );
}
