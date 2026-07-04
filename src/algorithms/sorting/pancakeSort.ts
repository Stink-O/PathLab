import { snapshot, type SortStep } from "./types";

export function* pancakeSort(input: number[]): Generator<SortStep> {
  const array = [...input];
  const counters = { comparisons: 0, swaps: 0, accesses: 0 };
  const sorted = new Set<number>();

  function* flip(end: number): Generator<SortStep> {
    let low = 0;
    let high = end;
    while (low < high) {
      [array[low], array[high]] = [array[high], array[low]];
      counters.swaps += 1;
      counters.accesses += 2;
      yield snapshot(array, counters, {
        swapped: new Set([low, high]),
        active: new Set([end]),
        sorted,
      });
      low += 1;
      high -= 1;
    }
  }

  for (let end = array.length - 1; end > 0; end -= 1) {
    let maxIndex = 0;
    for (let i = 1; i <= end; i += 1) {
      counters.comparisons += 1;
      counters.accesses += 2;
      yield snapshot(array, counters, {
        compared: new Set([i, maxIndex]),
        active: new Set([end]),
        sorted,
      });
      if (array[i] > array[maxIndex]) maxIndex = i;
    }
    if (maxIndex !== end) {
      if (maxIndex > 0) yield* flip(maxIndex);
      yield* flip(end);
    }
    sorted.add(end);
  }
  yield snapshot(array, counters, {
    sorted: new Set(array.map((_, index) => index)),
    done: true,
  });
}
