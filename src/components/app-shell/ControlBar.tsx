"use client";

import { Pause, Play, RotateCcw, Shuffle, StepForward } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Toggle } from "@/components/ui/Toggle";
import { Field } from "@/components/ui/Field";
import {
  PATH_ALGORITHMS,
  SORT_ALGORITHMS,
  SPEED_OPTIONS,
  type Mode,
  type Speed,
} from "@/lib/constants";
import type { PathAlgorithmId } from "@/algorithms/pathfinding/types";
import type { SortAlgorithmId } from "@/algorithms/sorting/types";
import type { SimulationStatus } from "@/store/useSimulationStore";

const SHORTCUTS: [string, string][] = [
  ["Space", "run / pause"],
  ["R", "reset"],
  ["N", "random pair"],
  ["→", "step"],
];

export function ControlBar({
  mode,
  status,
  speed,
  mirrorTest,
  stopOnFirst,
  algorithmA,
  algorithmB,
  pairNote,
  children,
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
  children?: React.ReactNode;
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
    <section aria-label="Run controls" className="border-b border-[var(--border)]">
      <div className="flex flex-wrap items-end gap-x-4 gap-y-4 py-5">
        <Field label="Algorithm A" className="min-w-52 flex-1 md:max-w-72">
          <Select value={algorithmA} onChange={(event) => onAlgorithmA(event.target.value as never)} className="w-full">
            {options.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </Select>
        </Field>
        <span aria-hidden="true" className="hidden pb-2.5 font-mono text-[14px] text-[var(--muted)] sm:block">
          vs
        </span>
        <Field label="Algorithm B" className="min-w-52 flex-1 md:max-w-72">
          <Select value={algorithmB} onChange={(event) => onAlgorithmB(event.target.value as never)} className="w-full">
            {options.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </Select>
        </Field>
        <Button onClick={onRandomPair}>
          <Shuffle size={17} strokeWidth={1.5} />
          Random pair
        </Button>

        <div className="flex flex-wrap items-center gap-2 md:ml-auto">
          <Button variant="primary" className="px-5" onClick={onStart} disabled={isRunning || duplicateBlocked}>
            <Play size={17} strokeWidth={1.75} />
            {status === "paused" ? "Resume" : "Start"}
          </Button>
          <div className="flex overflow-hidden rounded-[4px] border border-[var(--border)]">
            <Button
              className="rounded-none border-0 focus-visible:-outline-offset-2"
              onClick={onPause}
              disabled={!isRunning}
            >
              <Pause size={17} strokeWidth={1.5} />
              Pause
            </Button>
            <Button
              className="rounded-none border-0 border-l border-l-[var(--border)] focus-visible:-outline-offset-2"
              onClick={onManualStep}
              disabled={speed !== "manual" && status !== "paused"}
            >
              <StepForward size={17} strokeWidth={1.5} />
              Step
            </Button>
            <Button
              className="rounded-none border-0 border-l border-l-[var(--border)] focus-visible:-outline-offset-2"
              onClick={onReset}
            >
              <RotateCcw size={17} strokeWidth={1.5} />
              Reset
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-x-4 gap-y-4 border-t border-[var(--border)] py-4">
        {children}
        <Field label="Step delay">
          <Select value={speed} onChange={(event) => onSpeed(event.target.value as Speed)}>
            {SPEED_OPTIONS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </Select>
        </Field>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pb-2">
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
        </div>
        <div className="hidden items-center gap-4 pb-2.5 text-[13px] text-[var(--muted)] xl:ml-auto xl:flex">
          {SHORTCUTS.map(([key, label]) => (
            <span key={key} className="inline-flex items-center gap-1.5">
              <kbd className="rounded-[4px] border border-[var(--border)] bg-[var(--surface)] px-1.5 py-0.5 font-mono text-[13px] text-[var(--text)]">
                {key}
              </kbd>
              {label}
            </span>
          ))}
        </div>
      </div>

      {(duplicateBlocked || pairNote) && (
        <div className="flex flex-wrap gap-x-6 gap-y-1 border-t border-[var(--border)] py-2.5 text-[14px]">
          {duplicateBlocked && (
            <p className="font-medium text-[var(--danger)]">
              Select two different algorithms, or turn on Mirror test to race identical ones.
            </p>
          )}
          {pairNote && !duplicateBlocked && <p className="text-[var(--muted)]">{pairNote}</p>}
        </div>
      )}
    </section>
  );
}
