"use client";

import { Pause, Play, RotateCcw, Shuffle, StepForward } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Toggle } from "@/components/ui/Toggle";
import {
  PATH_ALGORITHMS,
  SORT_ALGORITHMS,
  type Mode,
  type Speed,
} from "@/lib/constants";
import type { PathAlgorithmId } from "@/algorithms/pathfinding/types";
import type { SortAlgorithmId } from "@/algorithms/sorting/types";
import type { SimulationStatus } from "@/store/useSimulationStore";

export function ControlBar({
  mode,
  status,
  speed,
  mirrorTest,
  stopOnFirst,
  algorithmA,
  algorithmB,
  pairNote,
  onSpeed,
  onMirrorTest,
  onStopOnFirst,
  onAlgorithmA,
  onAlgorithmB,
  onRandomPair,
  onStart,
  onPause,
  onReset,
  onManualStep,
}: {
  mode: Mode;
  status: SimulationStatus;
  speed: Speed;
  mirrorTest: boolean;
  stopOnFirst: boolean;
  algorithmA: string;
  algorithmB: string;
  pairNote: string;
  onSpeed: (speed: Speed) => void;
  onMirrorTest: (value: boolean) => void;
  onStopOnFirst: (value: boolean) => void;
  onAlgorithmA: (value: PathAlgorithmId | SortAlgorithmId) => void;
  onAlgorithmB: (value: PathAlgorithmId | SortAlgorithmId) => void;
  onRandomPair: () => void;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onManualStep: () => void;
}) {
  const options = mode === "pathfinding" ? PATH_ALGORITHMS : SORT_ALGORITHMS;
  const isRunning = status === "running";
  const duplicateBlocked = algorithmA === algorithmB && !mirrorTest;

  return (
    <section className="my-4 rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-3 shadow-[inset_0_1px_rgba(255,255,255,.4)]">
      <div className="grid gap-3 xl:grid-cols-[1fr_auto] xl:items-center">
        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-[1fr_1fr_auto_auto]">
          <label className="grid gap-1">
            <span className="text-xs text-[var(--muted)]">Algorithm A</span>
            <Select value={algorithmA} onChange={(event) => onAlgorithmA(event.target.value as never)}>
              {options.map((item) => (
                <option key={item.id} value={item.id} disabled={"locked" in item && item.locked}>
                  {item.label}{"locked" in item && item.locked ? " - Advanced" : ""}
                </option>
              ))}
            </Select>
          </label>
          <label className="grid gap-1">
            <span className="text-xs text-[var(--muted)]">Algorithm B</span>
            <Select value={algorithmB} onChange={(event) => onAlgorithmB(event.target.value as never)}>
              {options.map((item) => (
                <option key={item.id} value={item.id} disabled={"locked" in item && item.locked}>
                  {item.label}{"locked" in item && item.locked ? " - Advanced" : ""}
                </option>
              ))}
            </Select>
          </label>
          <label className="grid gap-1">
            <span className="text-xs text-[var(--muted)]">Step delay</span>
            <Select value={speed} onChange={(event) => onSpeed(event.target.value as Speed)}>
              <option value="slow">Slow - 180ms</option>
              <option value="medium">Medium - 80ms</option>
              <option value="fast">Fast - 25ms</option>
              <option value="manual">Manual step</option>
            </Select>
          </label>
          <div className="flex items-end gap-2">
            <Button onClick={onRandomPair}>
              <Shuffle size={16} strokeWidth={1.5} />
              Random pair
            </Button>
          </div>
        </div>
        <div className="grid min-w-0 grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
          <Button variant="primary" onClick={onStart} disabled={isRunning || duplicateBlocked}>
            <Play size={16} strokeWidth={1.5} />
            {status === "paused" ? "Resume" : "Start"}
          </Button>
          <Button className="min-w-0" onClick={onPause} disabled={!isRunning}>
            <Pause size={16} strokeWidth={1.5} />
            Pause
          </Button>
          <Button
            className="min-w-0"
            onClick={onManualStep}
            disabled={speed !== "manual" && status !== "paused"}
          >
            <StepForward size={16} strokeWidth={1.5} />
            Step
          </Button>
          <Button className="min-w-0" onClick={onReset}>
            <RotateCcw size={16} strokeWidth={1.5} />
            Reset
          </Button>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
        <Toggle
          checked={mirrorTest}
          onChange={onMirrorTest}
          label="Mirror test"
          description="Allow the same algorithm on both sides for controlled comparisons."
        />
        <Toggle
          checked={stopOnFirst}
          onChange={onStopOnFirst}
          label="Stop on first result"
          description="Stop both panels as soon as either algorithm finishes."
        />
        {duplicateBlocked && (
          <span className="font-mono text-xs text-[var(--goal)]">
            Select different algorithms or enable Mirror test
          </span>
        )}
        {pairNote && <span className="font-mono text-xs text-[var(--accent)]">{pairNote}</span>}
      </div>
      <details className="mt-3 text-xs text-[var(--muted)]">
        <summary className="w-fit cursor-pointer rounded-[8px] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]">
          Shortcuts
        </summary>
        <div className="mt-2 flex flex-wrap gap-2">
          {[
            ["Space", "run or pause"],
            ["R", "reset"],
            ["N", "random pair"],
            ["Right", "step"],
          ].map(([key, label]) => (
            <span key={key} className="inline-flex items-center gap-1.5">
              <kbd className="rounded-[6px] border border-[var(--border)] bg-[var(--bg)] px-1.5 py-0.5 font-mono text-[11px] text-[var(--text)]">
                {key}
              </kbd>
              {label}
            </span>
          ))}
        </div>
      </details>
    </section>
  );
}
