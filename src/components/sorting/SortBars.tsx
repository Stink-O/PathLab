"use client";

import { useCallback, useEffect, useRef } from "react";
import type { SortStep } from "@/algorithms/sorting/types";
import { useSettingsStore } from "@/store/useSettingsStore";

const HEIGHT = 300;

function cssVar(element: HTMLElement, name: string) {
  return getComputedStyle(element).getPropertyValue(name).trim();
}

export function SortBars({ step, seed }: { step?: SortStep; seed: number[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useSettingsStore((s) => s.theme);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = canvas.clientWidth;
    if (!width) return;
    const dpr = window.devicePixelRatio || 1;
    if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(HEIGHT * dpr)) {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(HEIGHT * dpr);
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const colors = {
      idle: cssVar(canvas, "--bar"),
      active: cssVar(canvas, "--visited"),
      compared: cssVar(canvas, "--frontier"),
      swapped: cssVar(canvas, "--swap"),
      sorted: cssVar(canvas, "--path"),
      background: cssVar(canvas, "--cell"),
    };

    const array = step?.array ?? seed;
    const n = array.length;
    const max = Math.max(...array, 1);
    const gap = n <= 128 ? 1 : 0;
    const slot = width / n;
    const inset = 4;
    const usableHeight = HEIGHT - inset * 2;

    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, width, HEIGHT);

    for (let i = 0; i < n; i += 1) {
      let fill = colors.idle;
      if (step?.sorted.has(i)) fill = colors.sorted;
      if (step?.active.has(i)) fill = colors.active;
      if (step?.compared.has(i)) fill = colors.compared;
      if (step?.swapped.has(i)) fill = colors.swapped;
      const barHeight = Math.max(2, (array[i] / max) * usableHeight);
      const x = i * slot;
      ctx.fillStyle = fill;
      ctx.fillRect(x, HEIGHT - inset - barHeight, Math.max(slot - gap, 0.75), barHeight);
    }
  }, [seed, step]);

  useEffect(() => {
    draw();
  }, [draw, theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const observer = new ResizeObserver(() => draw());
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="block h-[300px] w-full rounded-[4px] border border-[var(--border)] bg-[var(--cell)]"
      role="img"
      aria-label="Bar chart of the array being sorted"
    />
  );
}
