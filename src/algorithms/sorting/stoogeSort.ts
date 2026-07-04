import { snapshot, type SortStep } from "./types";

/** Famously terrible O(n^2.7) recursion. Best enjoyed on small arrays. */
export function* stoogeSort(input: number[]): Generator<SortStep> {
  const array = [...input];
  const counters = { comparisons: 0, swaps: 0, accesses: 0 };

  function* sort(low: number, high: number): Generator<SortStep> {
    counters.comparisons += 1;
    counters.accesses += 2;
    yield snapshot(array, counters, {
      compared: new Set([low, high]),
      active: new Set([low, high]),
    });
    if (array[low] > array[high]) {
      [array[low], array[high]] = [array[high], array[low]];
      counters.swaps += 1;
      counters.accesses += 2;
      yield snapshot(array, counters, { swapped: new Set([low, high]) });
    }
    if (high - low + 1 > 2) {
      const third = Math.floor((high - low + 1) / 3);
      yield* sort(low, high - third);
      yield* sort(low + third, high);
      yield* sort(low, high - third);
    }
  }

  if (array.length > 1) yield* sort(0, array.length - 1);
  yield snapshot(array, counters, {
    sorted: new Set(array.map((_, index) => index)),
    done: true,
  });
}
