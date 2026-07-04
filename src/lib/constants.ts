import type { PathAlgorithmId } from "@/algorithms/pathfinding/types";
import type { SortAlgorithmId } from "@/algorithms/sorting/types";

export type Mode = "pathfinding" | "sorting";
export type Speed = "slow" | "medium" | "fast" | "turbo" | "ultra" | "manual";
export type GridSize = "small" | "medium" | "large" | "xl" | "xxl";
export type ArraySize = 32 | 64 | 128 | 256 | 512;
export type SortDistribution = "shuffled" | "nearlySorted" | "reversed" | "fewUnique";
export type SoundStyle = "classic" | "soft" | "arcade";

export const SOUND_STYLES: { id: SoundStyle; label: string }[] = [
  { id: "classic", label: "Classic tones" },
  { id: "soft", label: "Soft sine" },
  { id: "arcade", label: "Arcade" },
];

export const ARRAY_SIZES: ArraySize[] = [32, 64, 128, 256, 512];

export const SORT_DISTRIBUTIONS: { id: SortDistribution; label: string }[] = [
  { id: "shuffled", label: "Shuffled" },
  { id: "nearlySorted", label: "Nearly sorted" },
  { id: "reversed", label: "Reversed" },
  { id: "fewUnique", label: "Few unique values" },
];

/** Tick delay in ms plus how many algorithm steps run per tick. */
export const SPEED_CONFIG: Record<
  Exclude<Speed, "manual">,
  { delay: number; stepsPerTick: number }
> = {
  slow: { delay: 180, stepsPerTick: 1 },
  medium: { delay: 80, stepsPerTick: 1 },
  fast: { delay: 25, stepsPerTick: 1 },
  turbo: { delay: 16, stepsPerTick: 10 },
  ultra: { delay: 16, stepsPerTick: 40 },
};

export const SPEED_OPTIONS: { id: Speed; label: string }[] = [
  { id: "slow", label: "Slow - 180ms" },
  { id: "medium", label: "Medium - 80ms" },
  { id: "fast", label: "Fast - 25ms" },
  { id: "turbo", label: "Turbo - 10 steps/frame" },
  { id: "ultra", label: "Ultra - 40 steps/frame" },
  { id: "manual", label: "Manual step" },
];

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
  complexity: string;
  optimal: boolean;
}[] = [
  { id: "astar", label: "A*", complexity: "O(E log V)", optimal: true },
  { id: "dijkstra", label: "Dijkstra", complexity: "O(E log V)", optimal: true },
  { id: "bfs", label: "Breadth-first search", complexity: "O(V + E)", optimal: true },
  { id: "dfs", label: "Depth-first search", complexity: "O(V + E)", optimal: false },
  {
    id: "greedy",
    label: "Greedy best-first search",
    complexity: "O(E log V)",
    optimal: false,
  },
  {
    id: "weightedAstar",
    label: "Weighted A*",
    complexity: "O(E log V)",
    optimal: false,
  },
  {
    id: "bidirectionalBfs",
    label: "Bidirectional BFS",
    complexity: "O(V + E)",
    optimal: true,
  },
  { id: "jps", label: "Jump point search", complexity: "O(E log V)", optimal: true },
  { id: "idaStar", label: "IDA*", complexity: "O(bᵈ) low memory", optimal: true },
  {
    id: "tremaux",
    label: "Trémaux's algorithm",
    complexity: "O(V + E)",
    optimal: false,
  },
  {
    id: "deadEndFill",
    label: "Dead-end filling",
    complexity: "O(V)",
    optimal: false,
  },
];

export const SORT_ALGORITHMS: {
  id: SortAlgorithmId;
  label: string;
  average: string;
  worst: string;
}[] = [
  { id: "bubble", label: "Bubble sort", average: "O(n²)", worst: "O(n²)" },
  { id: "insertion", label: "Insertion sort", average: "O(n²)", worst: "O(n²)" },
  { id: "selection", label: "Selection sort", average: "O(n²)", worst: "O(n²)" },
  { id: "merge", label: "Merge sort", average: "O(n log n)", worst: "O(n log n)" },
  { id: "quick", label: "Quick sort", average: "O(n log n)", worst: "O(n²)" },
  { id: "heap", label: "Heap sort", average: "O(n log n)", worst: "O(n log n)" },
  { id: "shell", label: "Shell sort", average: "O(n log² n)", worst: "O(n²)" },
  { id: "cocktail", label: "Cocktail shaker sort", average: "O(n²)", worst: "O(n²)" },
  { id: "comb", label: "Comb sort", average: "O(n² / 2ᵖ)", worst: "O(n²)" },
  { id: "radix", label: "Radix sort (LSD)", average: "O(nk)", worst: "O(nk)" },
  { id: "tim", label: "Tim sort", average: "O(n log n)", worst: "O(n log n)" },
  { id: "counting", label: "Counting sort", average: "O(n + k)", worst: "O(n + k)" },
  { id: "bitonic", label: "Bitonic sort", average: "O(n log² n)", worst: "O(n log² n)" },
  { id: "cycle", label: "Cycle sort", average: "O(n²)", worst: "O(n²)" },
  { id: "oddEven", label: "Odd-even sort", average: "O(n²)", worst: "O(n²)" },
  { id: "pancake", label: "Pancake sort", average: "O(n²)", worst: "O(n²)" },
  { id: "gnome", label: "Gnome sort", average: "O(n²)", worst: "O(n²)" },
  { id: "stooge", label: "Stooge sort", average: "O(n^2.71)", worst: "O(n^2.71)" },
];
