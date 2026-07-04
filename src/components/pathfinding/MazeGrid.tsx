"use client";

import { MazeCell } from "./MazeCell";
import type { PointerEvent } from "react";
import {
  keyOf,
  type MazeState,
  type PathStep,
  type Point,
} from "@/algorithms/pathfinding/types";

export function MazeGrid({
  maze,
  step,
  editable,
  onToggleWall,
  onMovePoint,
}: {
  maze: MazeState;
  step?: PathStep;
  editable?: boolean;
  onToggleWall?: (key: string) => void;
  onMovePoint?: (kind: "start" | "goal", point: Point) => void;
}) {
  const path = new Set(step?.path ?? []);
  const visitedCount = step?.visited.size ?? 0;
  const frontierCount = step?.frontier.size ?? 0;
  const wallCount = maze.walls.size;
  const clearDrawingState = () => {
    document.body.removeAttribute("data-drawing");
    document.body.removeAttribute("data-drawn-cells");
  };
  const clearMoveState = () => {
    document.body.removeAttribute("data-moving-point");
    document.body.removeAttribute("data-moved-point");
  };
  const clearPointerState = () => {
    clearDrawingState();
    if (document.body.getAttribute("data-moved-point") === "true") {
      clearMoveState();
    }
  };

  function stateFor(key: string) {
    if (key === keyOf(maze.start)) return "start" as const;
    if (key === keyOf(maze.goal)) return "goal" as const;
    if (maze.walls.has(key)) return "wall" as const;
    if (path.has(key)) return "path" as const;
    if (step?.current === key) return "current" as const;
    if (step?.frontier.has(key)) return "frontier" as const;
    if (step?.visited.has(key)) return "visited" as const;
    return "empty" as const;
  }

  function pointFor(index: number): Point {
    return { x: index % maze.cols, y: Math.floor(index / maze.cols) };
  }

  function targetCell(event: PointerEvent<HTMLDivElement>) {
    const element = (event.target as HTMLElement).closest<HTMLButtonElement>(
      "button[data-cell-key]",
    );
    if (!element) return null;
    const key = element.dataset.cellKey;
    const x = Number(element.dataset.cellX);
    const y = Number(element.dataset.cellY);
    if (!key || Number.isNaN(x) || Number.isNaN(y)) return null;
    return { key, point: { x, y }, state: stateFor(key) };
  }

  function movePoint(kind: "start" | "goal", point: Point) {
    const key = keyOf(point);
    if (maze.walls.has(key)) return;
    if (kind === "start" && key === keyOf(maze.goal)) return;
    if (kind === "goal" && key === keyOf(maze.start)) return;
    onMovePoint?.(kind, point);
  }

  function handlePointerDown(key: string, point: Point, state: ReturnType<typeof stateFor>) {
    if (!editable) return;
    if (state === "start" || state === "goal") {
      clearDrawingState();
      document.body.setAttribute("data-moving-point", state);
      document.body.removeAttribute("data-moved-point");
      return;
    }

    const moving = document.body.getAttribute("data-moving-point");
    if (moving === "start" || moving === "goal") {
      movePoint(moving, point);
      clearMoveState();
      return;
    }

    document.body.setAttribute("data-drawing", "true");
    document.body.setAttribute("data-drawn-cells", key);
    onToggleWall?.(key);
  }

  function handlePointerEnter(key: string, point: Point) {
    if (!editable) return;
    const moving = document.body.getAttribute("data-moving-point");
    if (moving === "start" || moving === "goal") {
      movePoint(moving, point);
      document.body.setAttribute("data-moved-point", "true");
      return;
    }
    if (document.body.getAttribute("data-drawing") !== "true") return;
    const drawn = new Set((document.body.getAttribute("data-drawn-cells") ?? "").split("|"));
    if (drawn.has(key)) return;
    drawn.add(key);
    document.body.setAttribute("data-drawn-cells", [...drawn].join("|"));
    onToggleWall?.(key);
  }

  return (
    <div
      role="grid"
      tabIndex={0}
      aria-label={`${maze.cols} by ${maze.rows} maze. Start at column ${maze.start.x + 1}, row ${maze.start.y + 1}. Goal at column ${maze.goal.x + 1}, row ${maze.goal.y + 1}. ${wallCount} walls, ${visitedCount} visited cells, ${frontierCount} frontier cells.`}
      className="grid max-w-full overflow-hidden rounded-[4px] border border-[var(--border)] bg-[var(--border)]"
      style={{ gridTemplateColumns: `repeat(${maze.cols}, minmax(0, 1fr))` }}
      onPointerDown={(event) => {
        const cell = targetCell(event);
        if (cell) handlePointerDown(cell.key, cell.point, cell.state);
      }}
      onPointerMove={(event) => {
        const cell = targetCell(event);
        if (cell) handlePointerEnter(cell.key, cell.point);
      }}
      onPointerUp={clearPointerState}
      onPointerLeave={clearPointerState}
    >
      {Array.from({ length: maze.rows * maze.cols }, (_, index) => {
        const point = pointFor(index);
        const key = keyOf(point);
        const state = stateFor(key);
        return (
          <MazeCell
            key={key}
            state={state}
            keyValue={key}
            x={point.x}
            y={point.y}
          />
        );
      })}
    </div>
  );
}
