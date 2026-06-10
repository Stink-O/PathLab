import type { PathAlgorithmId } from "@/algorithms/pathfinding/types";
import type { SortAlgorithmId } from "@/algorithms/sorting/types";

export type Mode = "pathfinding" | "sorting";
export type Speed = "slow" | "medium" | "fast" | "manual";
export type GridSize = "small" | "medium" | "large" | "xl" | "xxl";
export type ArraySize = 32 | 64 | 128;

export const STEP_DELAYS: Record<Exclude<Speed, "manual">, number> = {
  slow: 180,
  medium: 80,
  fast: 25,
};

export const GRID_SIZES: Record<GridSize, { cols: number; rows: number }> = {
  small: { cols: 21, rows: 13 },
  medium: { cols: 33, rows: 19 },
  large: { cols: 49, rows: 27 },
  xl: { cols: 65, rows: 35 },
  xxl: { cols: 81, rows: 43 },
};

export const PATH_ALGORITHMS: {
  id: PathAlgorithmId;
  label: string;
  locked?: boolean;
}[] = [
  { id: "astar", label: "A*" },
  { id: "dijkstra", label: "Dijkstra" },
  { id: "bfs", label: "Breadth-first search" },
  { id: "dfs", label: "Depth-first search" },
  { id: "greedy", label: "Greedy best-first search" },
  { id: "weightedAstar", label: "Weighted A*" },
  { id: "bidirectionalBfs", label: "Bidirectional BFS" },
  { id: "jps", label: "Jump point search", locked: true },
];

export const SORT_ALGORITHMS: { id: SortAlgorithmId; label: string }[] = [
  { id: "bubble", label: "Bubble sort" },
  { id: "insertion", label: "Insertion sort" },
  { id: "selection", label: "Selection sort" },
  { id: "merge", label: "Merge sort" },
  { id: "quick", label: "Quick sort" },
  { id: "heap", label: "Heap sort" },
  { id: "shell", label: "Shell sort" },
  { id: "cocktail", label: "Cocktail shaker sort" },
  { id: "comb", label: "Comb sort" },
  { id: "radix", label: "Radix sort" },
];
