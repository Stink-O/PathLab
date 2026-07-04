"use client";

import { motion } from "framer-motion";
import { Check, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatusIndicator } from "@/components/ui/StatusIndicator";
import { MazeGrid } from "@/components/pathfinding/MazeGrid";
import { SortBars } from "@/components/sorting/SortBars";
import type { MazeState, Point } from "@/algorithms/pathfinding/types";
import { cn } from "@/lib/cn";
import type { Mode } from "@/lib/constants";
import { formatMs } from "@/lib/timing";
import type { PanelRunState } from "@/store/useSimulationStore";

export function AlgorithmPanel({
  side,
  mode,
  title,
  subtitle,
  run,
  maze,
  seedArray,
  editable,
  onToggleWall,
  onMovePoint,
  audioEnabled,
  onToggleAudio,
  className,
}: {
  side: "A" | "B";
  mode: Mode;
  title: string;
  subtitle?: string;
  run: PanelRunState;
  maze: MazeState;
  seedArray: number[];
  editable?: boolean;
  onToggleWall?: (key: string) => void;
  onMovePoint?: (kind: "start" | "goal", point: Point) => void;
  audioEnabled?: boolean;
  onToggleAudio?: () => void;
  className?: string;
}) {
  const pathStep = run.pathStep;
  const sortStep = run.sortStep;
  const stats: [string, React.ReactNode][] =
    mode === "pathfinding"
      ? [
          ["Elapsed", formatMs(run.elapsed)],
          ["Steps", run.steps],
          ["Visited", pathStep?.visited.size ?? 0],
          ["Path length", pathStep?.path?.length ?? 0],
        ]
      : [
          ["Elapsed", formatMs(run.elapsed)],
          ["Steps", run.steps],
          ["Comparisons", sortStep?.counters.comparisons ?? 0],
          ["Swaps", sortStep?.counters.swaps ?? 0],
          ["Accesses", sortStep?.counters.accesses ?? 0],
        ];

  return (
    <section aria-label={`Algorithm ${side}: ${title}`} className={cn("flex min-w-0 flex-col gap-5", className)}>
      <header className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <span
            aria-hidden="true"
            className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-[4px] bg-[var(--text)] font-mono text-[15px] font-bold text-[var(--bg)]"
          >
            {side}
          </span>
          <div className="min-w-0">
            <h2 className="text-[24px] font-semibold leading-tight tracking-[-0.015em] text-[var(--text)]">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-1 font-mono text-[13px] text-[var(--muted)]">{subtitle}</p>
            )}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3 pt-1.5">
          {mode === "sorting" && (
            <Button
              variant={audioEnabled ? "primary" : "secondary"}
              className="h-9 w-9 px-0"
              onClick={onToggleAudio}
              aria-label={
                audioEnabled
                  ? `Mute audio for algorithm ${side}`
                  : `Play audio for algorithm ${side}`
              }
              title={
                audioEnabled
                  ? `Mute audio for algorithm ${side}`
                  : `Play audio for algorithm ${side}`
              }
            >
              {audioEnabled ? (
                <Volume2 size={17} strokeWidth={1.5} />
              ) : (
                <VolumeX size={17} strokeWidth={1.5} />
              )}
            </Button>
          )}
          <StatusIndicator status={run.status} />
        </div>
      </header>

      {mode === "pathfinding" ? (
        <MazeGrid
          maze={maze}
          step={pathStep}
          editable={editable}
          onToggleWall={onToggleWall}
          onMovePoint={onMovePoint}
        />
      ) : (
        <SortBars step={sortStep} seed={seedArray} />
      )}

      <div className="overflow-hidden">
        {/* Row-start dividers are pulled outside and clipped so wrapping stays clean. */}
        <div className="ml-[calc(-1.25rem-1px)] flex flex-wrap gap-y-4">
          {stats.map(([label, value]) => (
            <div key={label} className="min-w-0 border-l border-[var(--border)] pl-5 pr-7">
              <div className="text-[13px] text-[var(--muted)]">{label}</div>
              <div className="mt-0.5 font-mono text-[20px] font-medium tabular-nums leading-tight text-[var(--text)]">
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="min-h-7">
        {run.resultLabels.length > 0 ? (
          <ul className="flex flex-wrap gap-x-6 gap-y-1.5">
            {run.resultLabels.map((label) => (
              <motion.li
                key={label}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex items-center gap-1.5 text-[15px] font-medium text-[var(--success)]"
              >
                <Check size={16} strokeWidth={2.5} aria-hidden="true" />
                {label}
              </motion.li>
            ))}
          </ul>
        ) : (
          <p className="text-[14px] text-[var(--muted)]">
            {run.status === "complete" || run.status === "failed"
              ? "No category wins this run."
              : "Run both algorithms to compare results."}
          </p>
        )}
      </div>
    </section>
  );
}
