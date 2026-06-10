import { cn } from "@/lib/cn";
import { memo } from "react";

export const MazeCell = memo(function MazeCell({
  state,
  keyValue,
  x,
  y,
}: {
  state: "empty" | "wall" | "start" | "goal" | "visited" | "frontier" | "current" | "path";
  keyValue: string;
  x: number;
  y: number;
}) {
  return (
    <button
      type="button"
      aria-label={`${state} cell, column ${x + 1}, row ${y + 1}`}
      tabIndex={-1}
      data-cell-key={keyValue}
      data-cell-x={x}
      data-cell-y={y}
      className={cn(
        "aspect-square min-w-0 border border-[color-mix(in_srgb,var(--border)_55%,transparent)] transition-colors duration-75",
        state === "empty" && "bg-[var(--cell)]",
        state === "wall" && "bg-[var(--wall)]",
        state === "visited" && "bg-[var(--visited)]",
        state === "frontier" && "bg-[var(--frontier)]",
        state === "path" && "bg-[var(--path)]",
        state === "start" && "cursor-grab bg-[var(--start)] active:cursor-grabbing",
        state === "goal" && "cursor-grab bg-[var(--goal)] active:cursor-grabbing",
        state === "current" &&
          "bg-[var(--frontier)] outline outline-2 outline-offset-[-3px] outline-[var(--text)]",
      )}
    />
  );
});
