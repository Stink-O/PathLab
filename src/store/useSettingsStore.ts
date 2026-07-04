"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  ArraySize,
  GridSize,
  Mode,
  SortDistribution,
  SoundStyle,
  Speed,
} from "@/lib/constants";

type SettingsState = {
  theme: "light" | "dark";
  mode: Mode;
  speed: Speed;
  gridSize: GridSize;
  arraySize: ArraySize;
  distribution: SortDistribution;
  soundStyle: SoundStyle;
  stopOnFirst: boolean;
  mirrorTest: boolean;
  setTheme: (theme: "light" | "dark") => void;
  setMode: (mode: Mode) => void;
  setSpeed: (speed: Speed) => void;
  setGridSize: (gridSize: GridSize) => void;
  setArraySize: (arraySize: ArraySize) => void;
  setDistribution: (distribution: SortDistribution) => void;
  setSoundStyle: (soundStyle: SoundStyle) => void;
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
      arraySize: 128,
      distribution: "shuffled",
      soundStyle: "classic",
      stopOnFirst: false,
      mirrorTest: false,
      setTheme: (theme) => set({ theme }),
      setMode: (mode) => set({ mode }),
      setSpeed: (speed) => set({ speed }),
      setGridSize: (gridSize) => set({ gridSize }),
      setArraySize: (arraySize) => set({ arraySize }),
      setDistribution: (distribution) => set({ distribution }),
      setSoundStyle: (soundStyle) => set({ soundStyle }),
      setStopOnFirst: (stopOnFirst) => set({ stopOnFirst }),
      setMirrorTest: (mirrorTest) => set({ mirrorTest }),
    }),
    { name: "pathlab-settings" },
  ),
);
