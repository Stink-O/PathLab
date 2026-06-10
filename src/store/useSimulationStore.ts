"use client";

import { create } from "zustand";
import type { PathStep } from "@/algorithms/pathfinding/types";
import type { SortStep } from "@/algorithms/sorting/types";

export type SimulationStatus =
  | "idle"
  | "ready"
  | "running"
  | "paused"
  | "complete"
  | "failed";

export type PanelRunState = {
  status: SimulationStatus;
  steps: number;
  elapsed: number;
  startedAt: number | null;
  finishedAt: number | null;
  pathStep?: PathStep;
  sortStep?: SortStep;
  resultLabels: string[];
};

type SimulationState = {
  globalStatus: SimulationStatus;
  panels: { a: PanelRunState; b: PanelRunState };
  setGlobalStatus: (globalStatus: SimulationStatus) => void;
  updatePanel: (panel: "a" | "b", patch: Partial<PanelRunState>) => void;
  reset: () => void;
};

const initialPanel: PanelRunState = {
  status: "ready",
  steps: 0,
  elapsed: 0,
  startedAt: null,
  finishedAt: null,
  resultLabels: [],
};

export const useSimulationStore = create<SimulationState>((set) => ({
  globalStatus: "ready",
  panels: { a: { ...initialPanel }, b: { ...initialPanel } },
  setGlobalStatus: (globalStatus) => set({ globalStatus }),
  updatePanel: (panel, patch) =>
    set((state) => ({
      panels: {
        ...state.panels,
        [panel]: { ...state.panels[panel], ...patch },
      },
    })),
  reset: () =>
    set({
      globalStatus: "ready",
      panels: { a: { ...initialPanel }, b: { ...initialPanel } },
    }),
}));
