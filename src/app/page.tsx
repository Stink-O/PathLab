"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AppHeader } from "@/components/app-shell/AppHeader";
import { ControlBar } from "@/components/app-shell/ControlBar";
import { ComparisonGrid } from "@/components/comparison/ComparisonGrid";
import { MazeToolbar } from "@/components/pathfinding/MazeToolbar";
import { SortToolbar } from "@/components/sorting/SortToolbar";
import type { PathStep, MazeState, PathAlgorithmId } from "@/algorithms/pathfinding/types";
import { keyOf } from "@/algorithms/pathfinding/types";
import type { SortAlgorithmId, SortStep } from "@/algorithms/sorting/types";
import { PATH_ALGORITHMS, SORT_ALGORITHMS, SPEED_CONFIG } from "@/lib/constants";
import { makeMaze, makeOpenGrid } from "@/lib/maze";
import { pairFrom, randomInt } from "@/lib/random";
import { makeArray } from "@/lib/sortData";
import { playSortStepTone } from "@/lib/sortAudio";
import { createPathGenerator } from "@/simulation/pathfindingRunner";
import { createSortGenerator } from "@/simulation/sortingRunner";
import { comparePathResults, compareSortResults } from "@/simulation/simulationController";
import { useAlgorithmStore } from "@/store/useAlgorithmStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useSimulationStore } from "@/store/useSimulationStore";

function algorithmLabel(id: string) {
  return (
    PATH_ALGORITHMS.find((item) => item.id === id)?.label ??
    SORT_ALGORITHMS.find((item) => item.id === id)?.label ??
    id
  );
}

function algorithmMeta(id: string) {
  const path = PATH_ALGORITHMS.find((item) => item.id === id);
  if (path) {
    return `${path.complexity} · ${path.optimal ? "shortest path guaranteed" : "not always shortest"}`;
  }
  const sort = SORT_ALGORITHMS.find((item) => item.id === id);
  if (sort) return `avg ${sort.average} · worst ${sort.worst}`;
  return "";
}

function randomOpenPoint(maze: MazeState) {
  const open: string[] = [];
  for (let y = 0; y < maze.rows; y += 1) {
    for (let x = 0; x < maze.cols; x += 1) {
      const key = keyOf({ x, y });
      if (!maze.walls.has(key)) open.push(key);
    }
  }
  const key = open[randomInt(open.length)];
  const [x, y] = key.split(",").map(Number);
  return { x, y };
}

export default function Home() {
  const theme = useSettingsStore((s) => s.theme);
  const mode = useSettingsStore((s) => s.mode);
  const speed = useSettingsStore((s) => s.speed);
  const gridSize = useSettingsStore((s) => s.gridSize);
  const arraySize = useSettingsStore((s) => s.arraySize);
  const distribution = useSettingsStore((s) => s.distribution);
  const soundStyle = useSettingsStore((s) => s.soundStyle);
  const stopOnFirst = useSettingsStore((s) => s.stopOnFirst);
  const mirrorTest = useSettingsStore((s) => s.mirrorTest);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const setMode = useSettingsStore((s) => s.setMode);
  const setSpeed = useSettingsStore((s) => s.setSpeed);
  const setGridSize = useSettingsStore((s) => s.setGridSize);
  const setArraySize = useSettingsStore((s) => s.setArraySize);
  const setDistribution = useSettingsStore((s) => s.setDistribution);
  const setSoundStyle = useSettingsStore((s) => s.setSoundStyle);
  const setStopOnFirst = useSettingsStore((s) => s.setStopOnFirst);
  const setMirrorTest = useSettingsStore((s) => s.setMirrorTest);
  const pathA = useAlgorithmStore((s) => s.pathA);
  const pathB = useAlgorithmStore((s) => s.pathB);
  const sortA = useAlgorithmStore((s) => s.sortA);
  const sortB = useAlgorithmStore((s) => s.sortB);
  const pairNote = useAlgorithmStore((s) => s.pairNote);
  const setPathAlgorithms = useAlgorithmStore((s) => s.setPathAlgorithms);
  const setSortAlgorithms = useAlgorithmStore((s) => s.setSortAlgorithms);
  const setPairNote = useAlgorithmStore((s) => s.setPairNote);
  const globalStatus = useSimulationStore((s) => s.globalStatus);
  const panels = useSimulationStore((s) => s.panels);
  const setGlobalStatus = useSimulationStore((s) => s.setGlobalStatus);
  const updatePanel = useSimulationStore((s) => s.updatePanel);
  const resetSimulation = useSimulationStore((s) => s.reset);
  const [maze, setMaze] = useState(() => makeMaze(gridSize));
  const [seedArray, setSeedArray] = useState(() => makeArray(arraySize, distribution));
  const [audioPanel, setAudioPanel] = useState<"a" | "b" | null>("a");
  const pathGenerators = useRef<{ a?: Generator<PathStep>; b?: Generator<PathStep> }>({});
  const sortGenerators = useRef<{ a?: Generator<SortStep>; b?: Generator<SortStep> }>({});
  const completedRef = useRef({ a: false, b: false });
  const verifyingRef = useRef({ a: false, b: false });
  const startedRef = useRef({ a: 0, b: 0 });
  const audioPanelRef = useRef<"a" | "b" | null>(audioPanel);
  const soundStyleRef = useRef(soundStyle);

  const currentAlgorithms =
    mode === "pathfinding" ? { a: pathA, b: pathB } : { a: sortA, b: sortB };

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    audioPanelRef.current = audioPanel;
  }, [audioPanel]);

  useEffect(() => {
    soundStyleRef.current = soundStyle;
  }, [soundStyle]);

  const resetRun = useCallback(() => {
    pathGenerators.current = {};
    sortGenerators.current = {};
    completedRef.current = { a: false, b: false };
    verifyingRef.current = { a: false, b: false };
    startedRef.current = { a: 0, b: 0 };
    resetSimulation();
  }, [resetSimulation]);

  useEffect(() => {
    queueMicrotask(() => {
      setMaze((current) => makeMaze(gridSize, Date.now(), current));
      resetRun();
    });
  }, [gridSize, resetRun]);

  useEffect(() => {
    queueMicrotask(() => {
      setSeedArray(makeArray(arraySize, distribution, Date.now()));
      resetRun();
    });
  }, [arraySize, distribution, resetRun]);

  const finalizeIfDone = useCallback(() => {
    if (!completedRef.current.a || !completedRef.current.b) return;
    const panels = useSimulationStore.getState().panels;
    const labels =
      mode === "pathfinding"
        ? comparePathResults(panels.a, panels.b)
        : compareSortResults(panels.a, panels.b);
    updatePanel("a", { resultLabels: labels.a });
    updatePanel("b", { resultLabels: labels.b });
    setGlobalStatus("complete");
  }, [mode, setGlobalStatus, updatePanel]);

  const tickPanel = useCallback(
    (panel: "a" | "b", stepCount = 1) => {
      if (completedRef.current[panel]) return;
      const startedAt = startedRef.current[panel] || performance.now();
      startedRef.current[panel] = startedAt;
      const generator =
        mode === "pathfinding"
          ? pathGenerators.current[panel]
          : sortGenerators.current[panel];

      let consumed = 0;
      let last: PathStep | SortStep | undefined;
      let exhausted = false;
      while (consumed < stepCount) {
        const next = generator?.next();
        if (!next || next.done) {
          exhausted = true;
          break;
        }
        consumed += 1;
        last = next.value;
        if (last.done || ("failed" in last && last.failed)) break;
        // The verification sweep runs on its own fixed clock: never batch
        // past its first step, whatever the speed setting.
        if ("verify" in last && last.verify) {
          verifyingRef.current[panel] = true;
          break;
        }
      }

      const elapsed = performance.now() - startedAt;
      if (!last) {
        completedRef.current[panel] = true;
        updatePanel(panel, { status: "complete", elapsed, finishedAt: performance.now() });
        finalizeIfDone();
        return;
      }

      const failed = "failed" in last && !!last.failed;
      const done = !!last.done || exhausted;
      if (mode === "sorting" && audioPanelRef.current === panel) {
        playSortStepTone(last as SortStep, soundStyleRef.current);
      }
      const patch =
        mode === "pathfinding"
          ? { pathStep: last as PathStep }
          : { sortStep: last as SortStep };
      updatePanel(panel, {
        ...patch,
        status: failed ? "failed" : done ? "complete" : "running",
        steps: useSimulationStore.getState().panels[panel].steps + consumed,
        elapsed,
        startedAt,
        finishedAt: done ? performance.now() : null,
      });
      if (done || failed) {
        completedRef.current[panel] = true;
        if (stopOnFirst) {
          completedRef.current = { a: true, b: true };
        }
        // Hand audio focus to the other panel if it's still sorting.
        const other = panel === "a" ? "b" : "a";
        if (
          mode === "sorting" &&
          audioPanelRef.current === panel &&
          !completedRef.current[other]
        ) {
          audioPanelRef.current = other;
          setAudioPanel(other);
        }
        finalizeIfDone();
      }
    },
    [finalizeIfDone, mode, stopOnFirst, updatePanel],
  );

  const start = useCallback(() => {
    if (
      currentAlgorithms.a === currentAlgorithms.b &&
      !mirrorTest
    )
      return;
    if (!pathGenerators.current.a && mode === "pathfinding") {
      pathGenerators.current = {
        a: createPathGenerator(pathA, maze),
        b: createPathGenerator(pathB, maze),
      };
    }
    if (!sortGenerators.current.a && mode === "sorting") {
      sortGenerators.current = {
        a: createSortGenerator(sortA, seedArray),
        b: createSortGenerator(sortB, seedArray),
      };
    }
    updatePanel("a", { status: "running", startedAt: performance.now() });
    updatePanel("b", { status: "running", startedAt: performance.now() });
    startedRef.current = {
      a: startedRef.current.a || performance.now(),
      b: startedRef.current.b || performance.now(),
    };
    setGlobalStatus(speed === "manual" ? "paused" : "running");
  }, [
    currentAlgorithms.a,
    currentAlgorithms.b,
    maze,
    mirrorTest,
    mode,
    pathA,
    pathB,
    seedArray,
    setGlobalStatus,
    sortA,
    sortB,
    speed,
    updatePanel,
  ]);

  const manualStep = useCallback(() => {
    if (globalStatus === "ready") start();
    tickPanel("a");
    tickPanel("b");
  }, [globalStatus, start, tickPanel]);

  useEffect(() => {
    if (globalStatus !== "running" || speed === "manual") return;
    const { delay, stepsPerTick } = SPEED_CONFIG[speed];
    const interval = window.setInterval(() => {
      if (!verifyingRef.current.a) tickPanel("a", stepsPerTick);
      if (!verifyingRef.current.b) tickPanel("b", stepsPerTick);
    }, delay);
    return () => window.clearInterval(interval);
  }, [speed, globalStatus, tickPanel]);

  // Verification sweeps always animate at the fast (25ms) cadence,
  // regardless of the chosen step delay — including manual mode.
  useEffect(() => {
    if (globalStatus === "ready" || globalStatus === "idle") return;
    const interval = window.setInterval(() => {
      for (const panel of ["a", "b"] as const) {
        if (verifyingRef.current[panel] && !completedRef.current[panel]) {
          tickPanel(panel, 1);
        }
      }
    }, 25);
    return () => window.clearInterval(interval);
  }, [globalStatus, tickPanel]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement) return;
      if (event.code === "Space") {
        event.preventDefault();
        if (globalStatus === "running") {
          setGlobalStatus("paused");
        } else {
          start();
        }
      }
      if (event.key.toLowerCase() === "r") resetRun();
      if (event.key.toLowerCase() === "n") randomPair();
      if (event.key === "ArrowRight") manualStep();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  function randomPair() {
    if (mode === "pathfinding") {
      const [a, b] = pairFrom(PATH_ALGORITHMS.map((item) => item.id));
      setPathAlgorithms(a, b);
    } else {
      const [a, b] = pairFrom(SORT_ALGORITHMS.map((item) => item.id));
      setSortAlgorithms(a, b);
    }
    setPairNote("Pair selected");
    resetRun();
  }

  const titles = useMemo(
    () => ({
      a: algorithmLabel(currentAlgorithms.a),
      b: algorithmLabel(currentAlgorithms.b),
    }),
    [currentAlgorithms.a, currentAlgorithms.b],
  );

  const subtitles = useMemo(
    () => ({
      a: algorithmMeta(currentAlgorithms.a),
      b: algorithmMeta(currentAlgorithms.b),
    }),
    [currentAlgorithms.a, currentAlgorithms.b],
  );

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <div className="noise-layer" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-4 md:px-6">
        <AppHeader
          mode={mode}
          theme={theme}
          onMode={(mode) => {
            setMode(mode);
            resetRun();
          }}
          onTheme={setTheme}
        />
        <ControlBar
          mode={mode}
          status={globalStatus}
          speed={speed}
          mirrorTest={mirrorTest}
          stopOnFirst={stopOnFirst}
          algorithmA={currentAlgorithms.a}
          algorithmB={currentAlgorithms.b}
          pairNote={pairNote}
          onSpeed={setSpeed}
          onMirrorTest={setMirrorTest}
          onStopOnFirst={setStopOnFirst}
          onAlgorithmA={(value) => {
            if (mode === "pathfinding") {
              setPathAlgorithms(value as PathAlgorithmId, pathB);
            } else {
              setSortAlgorithms(value as SortAlgorithmId, sortB);
            }
            resetRun();
          }}
          onAlgorithmB={(value) => {
            if (mode === "pathfinding") {
              setPathAlgorithms(pathA, value as PathAlgorithmId);
            } else {
              setSortAlgorithms(sortA, value as SortAlgorithmId);
            }
            resetRun();
          }}
          onRandomPair={randomPair}
          onStart={start}
          onPause={() => setGlobalStatus("paused")}
          onReset={resetRun}
          onManualStep={manualStep}
        />

        <div className="mb-4">
          {mode === "pathfinding" ? (
            <MazeToolbar
              gridSize={gridSize}
              onGridSize={setGridSize}
              onGenerate={() => {
                setMaze((current) => makeMaze(gridSize, Date.now(), current));
                resetRun();
              }}
              onClear={() => {
                setMaze(makeOpenGrid(gridSize));
                resetRun();
              }}
              onRandomPoints={() => {
                setMaze((current) => {
                  const start = randomOpenPoint(current);
                  let goal = randomOpenPoint(current);
                  while (keyOf(goal) === keyOf(start)) {
                    goal = randomOpenPoint(current);
                  }
                  return { ...current, start, goal };
                });
                resetRun();
              }}
            />
          ) : (
            <SortToolbar
              arraySize={arraySize}
              distribution={distribution}
              soundStyle={soundStyle}
              onArraySize={setArraySize}
              onDistribution={setDistribution}
              onSoundStyle={setSoundStyle}
              onShuffle={() => {
                setSeedArray(makeArray(arraySize, distribution, Date.now()));
                resetRun();
              }}
            />
          )}
        </div>

        <ComparisonGrid
          mode={mode}
          titles={titles}
          subtitles={subtitles}
          panels={panels}
          maze={maze}
          seedArray={seedArray}
          editable={globalStatus !== "running" && mode === "pathfinding"}
          onToggleWall={(key) => {
            if (key === keyOf(maze.start) || key === keyOf(maze.goal)) return;
            setMaze((current) => {
              const walls = new Set(current.walls);
              if (walls.has(key)) walls.delete(key);
              else walls.add(key);
              return { ...current, walls };
            });
            resetRun();
          }}
          onMovePoint={(kind, point) => {
            setMaze((current) => ({
              ...current,
              [kind]: point,
            }));
            resetRun();
          }}
          audioPanel={mode === "sorting" ? audioPanel : null}
          onAudioPanel={setAudioPanel}
        />
      </div>
    </div>
  );
}
