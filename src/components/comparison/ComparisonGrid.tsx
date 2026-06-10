"use client";

import { AlgorithmPanel } from "./AlgorithmPanel";
import type { MazeState, Point } from "@/algorithms/pathfinding/types";
import type { Mode } from "@/lib/constants";
import type { PanelRunState } from "@/store/useSimulationStore";

export function ComparisonGrid({
  mode,
  titles,
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
  panels: { a: PanelRunState; b: PanelRunState };
  maze: MazeState;
  seedArray: number[];
  editable?: boolean;
  onToggleWall?: (key: string) => void;
  onMovePoint?: (kind: "start" | "goal", point: Point) => void;
  audioPanel?: "a" | "b" | null;
  onAudioPanel?: (panel: "a" | "b" | null) => void;
}) {
  return (
    <main className="grid gap-4 pb-6 xl:grid-cols-2">
      <AlgorithmPanel
        side="A"
        mode={mode}
        title={titles.a}
        run={panels.a}
        maze={maze}
        seedArray={seedArray}
        editable={editable}
        onToggleWall={onToggleWall}
        onMovePoint={onMovePoint}
        audioEnabled={audioPanel === "a"}
        onToggleAudio={() => onAudioPanel?.(audioPanel === "a" ? null : "a")}
      />
      <AlgorithmPanel
        side="B"
        mode={mode}
        title={titles.b}
        run={panels.b}
        maze={maze}
        seedArray={seedArray}
        editable={editable}
        onToggleWall={onToggleWall}
        onMovePoint={onMovePoint}
        audioEnabled={audioPanel === "b"}
        onToggleAudio={() => onAudioPanel?.(audioPanel === "b" ? null : "b")}
      />
    </main>
  );
}
