"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PathAlgorithmId } from "@/algorithms/pathfinding/types";
import type { SortAlgorithmId } from "@/algorithms/sorting/types";

type AlgorithmState = {
  pathA: PathAlgorithmId;
  pathB: PathAlgorithmId;
  sortA: SortAlgorithmId;
  sortB: SortAlgorithmId;
  pairNote: string;
  setPathAlgorithms: (a: PathAlgorithmId, b: PathAlgorithmId) => void;
  setSortAlgorithms: (a: SortAlgorithmId, b: SortAlgorithmId) => void;
  setPairNote: (pairNote: string) => void;
};

export const useAlgorithmStore = create<AlgorithmState>()(
  persist(
    (set) => ({
      pathA: "astar",
      pathB: "dijkstra",
      sortA: "quick",
      sortB: "merge",
      pairNote: "",
      setPathAlgorithms: (pathA, pathB) =>
        set({ pathA, pathB, pairNote: "" }),
      setSortAlgorithms: (sortA, sortB) =>
        set({ sortA, sortB, pairNote: "" }),
      setPairNote: (pairNote) => set({ pairNote }),
    }),
    { name: "pathlab-algorithms" },
  ),
);
