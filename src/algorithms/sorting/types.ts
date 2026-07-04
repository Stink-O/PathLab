export type SortAlgorithmId =
  | "bubble"
  | "insertion"
  | "selection"
  | "merge"
  | "quick"
  | "heap"
  | "shell"
  | "cocktail"
  | "comb"
  | "radix"
  | "gnome"
  | "pancake"
  | "cycle"
  | "oddEven"
  | "counting"
  | "bitonic"
  | "tim"
  | "stooge";

export type SortCounters = {
  comparisons: number;
  swaps: number;
  accesses: number;
};

export type SortStep = {
  array: number[];
  active: Set<number>;
  compared: Set<number>;
  swapped: Set<number>;
  sorted: Set<number>;
  counters: SortCounters;
  done?: boolean;
  /** Marks steps of the post-sort verification sweep. */
  verify?: boolean;
};

export function snapshot(
  array: number[],
  counters: SortCounters,
  partial: Partial<Omit<SortStep, "array" | "counters">> = {},
): SortStep {
  return {
    array: [...array],
    active: partial.active ?? new Set(),
    compared: partial.compared ?? new Set(),
    swapped: partial.swapped ?? new Set(),
    sorted: partial.sorted ?? new Set(),
    counters: { ...counters },
    done: partial.done,
  };
}
