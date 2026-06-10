"use client";

import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
import { MazeGrid } from "@/components/pathfinding/MazeGrid";
import { SortBars } from "@/components/sorting/SortBars";
import { ResultBadge } from "./ResultBadge";
import type { MazeState, Point } from "@/algorithms/pathfinding/types";
import type { Mode } from "@/lib/constants";
import { formatMs } from "@/lib/timing";
import type { PanelRunState } from "@/store/useSimulationStore";

const pathLegend = [
  { label: "Start", color: "var(--start)" },
  { label: "Goal", color: "var(--goal)" },
  { label: "Wall", color: "var(--wall)" },
  { label: "Visited", color: "var(--visited)" },
  { label: "Frontier", color: "var(--frontier)" },
  { label: "Path", color: "var(--path)" },
];

const sortLegend = [
  { label: "Idle", color: "var(--bar)" },
  { label: "Active", color: "var(--visited)" },
  { label: "Compared", color: "var(--frontier)" },
  { label: "Swapped", color: "var(--swap)" },
  { label: "Sorted", color: "var(--path)" },
];

export function AlgorithmPanel({
  side,
  mode,
  title,
  run,
  maze,
  seedArray,
  editable,
  onToggleWall,
  onMovePoint,
  audioEnabled,
  onToggleAudio,
}: {
  side: "A" | "B";
  mode: Mode;
  title: string;
  run: PanelRunState;
  maze: MazeState;
  seedArray: number[];
  editable?: boolean;
  onToggleWall?: (key: string) => void;
  onMovePoint?: (kind: "start" | "goal", point: Point) => void;
  audioEnabled?: boolean;
  onToggleAudio?: () => void;
}) {
  const pathStep = run.pathStep;
  const sortStep = run.sortStep;
  const legend = mode === "pathfinding" ? pathLegend : sortLegend;
  const hint =
    mode === "pathfinding"
      ? "Draw walls, drag start or goal, then run."
      : "Shuffle data, choose two algorithms, then run.";
  const stats =
    mode === "pathfinding"
      ? [
          ["Time elapsed", formatMs(run.elapsed)],
          ["Step count", run.steps],
          ["Visited nodes", pathStep?.visited.size ?? 0],
          ["Path length", pathStep?.path?.length ?? 0],
        ]
      : [
          ["Time elapsed", formatMs(run.elapsed)],
          ["Step count", run.steps],
          ["Comparisons", sortStep?.counters.comparisons ?? 0],
          ["Swaps", sortStep?.counters.swaps ?? 0],
          ["Array accesses", sortStep?.counters.accesses ?? 0],
        ];

  return (
    <motion.div initial={false} animate={{ opacity: 1, y: 0 }} className="min-w-0">
      <Panel className="overflow-hidden">
        <div className="border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_72%,var(--bg))] px-4 py-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <Badge>Algorithm {side}</Badge>
              <h2 className="mt-2 truncate text-xl font-semibold tracking-[-0.015em] text-[var(--text)]">
                {title}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {mode === "sorting" && (
                <Button
                  variant={audioEnabled ? "primary" : "secondary"}
                  className="h-9 w-9 px-0"
                  onClick={onToggleAudio}
                  aria-label={
                    audioEnabled
                      ? `Audio enabled for Algorithm ${side}`
                      : `Enable audio for Algorithm ${side}`
                  }
                  title={
                    audioEnabled
                      ? `Audio enabled for Algorithm ${side}`
                      : `Enable audio for Algorithm ${side}`
                  }
                >
                  {audioEnabled ? (
                    <Volume2 size={16} strokeWidth={1.5} />
                  ) : (
                    <VolumeX size={16} strokeWidth={1.5} />
                  )}
                </Button>
              )}
              <Badge className="bg-[var(--bg)] text-[var(--text)]">{run.status}</Badge>
            </div>
          </div>
        </div>
        <div className="grid gap-4 p-4">
          <div className="grid min-w-0 gap-2 text-xs text-[var(--muted)] md:grid-cols-[1fr_auto] md:items-center">
            <p className="min-w-0">{hint}</p>
            <div className="grid w-full min-w-0 grid-cols-3 gap-x-2 gap-y-1 sm:flex sm:w-auto sm:flex-wrap sm:items-center sm:gap-x-3">
              {legend.map((item) => (
                <span key={item.label} className="inline-flex min-w-0 items-center gap-1.5">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-[3px] border border-[var(--border)]"
                    style={{ backgroundColor: item.color }}
                    aria-hidden="true"
                  />
                  <span className="truncate">{item.label}</span>
                </span>
              ))}
            </div>
          </div>
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

          <div className="grid gap-3 border-t border-[var(--border)] pt-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="min-h-10 min-w-0">
              {run.resultLabels.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {run.resultLabels.map((label) => (
                    <ResultBadge key={label} label={label} />
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[var(--muted)]">Run both algorithms to compare results.</p>
              )}
            </div>
            <div className="grid min-w-0 grid-cols-2 gap-x-4 gap-y-2 lg:min-w-[260px]">
              {stats.map(([label, value]) => (
                <div key={label} className="min-w-0 border-b border-[var(--border)] pb-1">
                  <div className="truncate text-[11px] text-[var(--muted)]">{label}</div>
                  <div className="mt-0.5 truncate font-mono text-xs text-[var(--text)]">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Panel>
    </motion.div>
  );
}
