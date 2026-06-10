import { snapshot, type SortStep } from "./types";

export function* insertionSort(input: number[]): Generator<SortStep> {
  const array = [...input];
  const counters = { comparisons: 0, swaps: 0, accesses: 0 };
  for (let i = 1; i < array.length; i += 1) {
    let j = i;
    while (j > 0) {
      counters.comparisons += 1;
      counters.accesses += 2;
      yield snapshot(array, counters, {
        compared: new Set([j - 1, j]),
        active: new Set([i, j]),
      });
      if (array[j - 1] <= array[j]) break;
      [array[j - 1], array[j]] = [array[j], array[j - 1]];
      counters.swaps += 1;
      counters.accesses += 2;
      yield snapshot(array, counters, { swapped: new Set([j - 1, j]) });
      j -= 1;
    }
  }
  yield snapshot(array, counters, {
    sorted: new Set(array.map((_, index) => index)),
    done: true,
  });
}
