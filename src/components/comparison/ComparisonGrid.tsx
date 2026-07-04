"use client";

import { AlgorithmPanel } from "./AlgorithmPanel";
import type { MazeState, Point } from "@/algorithms/pathfinding/types";
import type { Mode } from "@/lib/constants";
import type { PanelRunState } from "@/store/useSimulationStore";

const PATH_LEGEND = [
  { label: "Start", color: "var(--start)" },
  { label: "Goal", color: "var(--goal)" },
  { label: "Wall", color: "var(--wall)" },
  { label: "Visited", color: "var(--visited)" },
  { label: "Frontier", color: "var(--frontier)" },
  { label: "Path", color: "var(--path)" },
];

const SORT_LEGEND = [
  { label: "Idle", color: "var(--bar)" },
  { label: "Active", color: "var(--visited)" },
  { label: "Compared", color: "var(--frontier)" },
  { label: "Swapped", color: "var(--swap)" },
  { label: "Sorted", color: "var(--path)" },
];

export function ComparisonGrid({
  mode,
  titles,
  subtitles,
  panels,
  maze,
  seedArray,
  editable,
  onToggleWall,
  onMovePoint,
  audioPanel,
  onAudioPanel,
}: {
  mode: Mode;
  titles: { a: string; b: string };
  subtitles?: { a: string; b: string };
  panels: { a: PanelRunState; b: PanelRunState };
  maze: MazeState;
  seedArray: number[];
  editable?: boolean;
  onToggleWall?: (key: string) => void;
  onMovePoint?: (kind: "start" | "goal", point: Point) => void;
  audioPanel?: "a" | "b" | null;
  onAudioPanel?: (panel: "a" | "b" | null) => void;
}) {
  const legend = mode === "pathfinding" ? PATH_LEGEND : SORT_LEGEND;
  const hint =
    mode === "pathfinding"
      ? "Draw walls on either maze, drag the start or goal, then run."
      : "Both panels sort the same data. The speaker button picks which one you hear.";

  return (
    <main className="pb-10">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-4">
        <p className="text-[14px] text-[var(--muted)]">{hint}</p>
        <ul className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          {legend.map((item) => (
            <li key={item.label} className="flex items-center gap-1.5 text-[13px] text-[var(--muted)]">
              <span
                aria-hidden="true"
                className="h-3 w-3 rounded-[2px] border border-[var(--border)]"
                style={{ backgroundColor: item.color }}
              />
              {item.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid xl:grid-cols-2">
        <AlgorithmPanel
          side="A"
          mode={mode}
          title={titles.a}
          subtitle={subtitles?.a}
          run={panels.a}
          maze={maze}
          seedArray={seedArray}
          editable={editable}
          onToggleWall={onToggleWall}
          onMovePoint={onMovePoint}
          audioEnabled={audioPanel === "a"}
          onToggleAudio={() => onAudioPanel?.(audioPanel === "a" ? null : "a")}
          className="xl:border-r xl:border-[var(--border)] xl:pr-10"
        />
        <AlgorithmPanel
          side="B"
          mode={mode}
          title={titles.b}
          subtitle={subtitles?.b}
          run={panels.b}
          maze={maze}
          seedArray={seedArray}
          editable={editable}
          onToggleWall={onToggleWall}
          onMovePoint={onMovePoint}
          audioEnabled={audioPanel === "b"}
          onToggleAudio={() => onAudioPanel?.(audioPanel === "b" ? null : "b")}
          className="mt-8 border-t border-[var(--border)] pt-6 xl:mt-0 xl:border-t-0 xl:pt-0 xl:pl-10"
        />
      </div>
    </main>
  );
}
