"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ArraySize, GridSize, Mode, Speed } from "@/lib/constants";

type SettingsState = {
  theme: "light" | "dark";
  mode: Mode;
  speed: Speed;
  gridSize: GridSize;
  arraySize: ArraySize;
  stopOnFirst: boolean;
  mirrorTest: boolean;
  setTheme: (theme: "light" | "dark") => void;
  setMode: (mode: Mode) => void;
  setSpeed: (speed: Speed) => void;
  setGridSize: (gridSize: GridSize) => void;
  setArraySize: (arraySize: ArraySize) => void;
  setStopOnFirst: (stopOnFirst: boolean) => void;
  setMirrorTest: (mirrorTest: boolean) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: "light",
      mode: "pathfinding",
      speed: "medium",
      gridSize: "medium",
      arraySize: 64,
      stopOnFirst: false,
      mirrorTest: false,
      setTheme: (theme) => set({ theme }),
      setMode: (mode) => set({ mode }),
      setSpeed: (speed) => set({ speed }),
      setGridSize: (gridSize) => set({ gridSize }),
      setArraySize: (arraySize) => set({ arraySize }),
      setStopOnFirst: (stopOnFirst) => set({ stopOnFirst }),
      setMirrorTest: (mirrorTest) => set({ mirrorTest }),
    }),
    { name: "pathlab-settings" },
  ),
);
