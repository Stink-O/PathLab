import { snapshot, type SortStep } from "./types";

export function* shellSort(input: number[]): Generator<SortStep> {
  const array = [...input];
  const counters = { comparisons: 0, swaps: 0, accesses: 0 };

  for (let gap = Math.floor(array.length / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < array.length; i += 1) {
      let j = i;
      while (j >= gap) {
        counters.comparisons += 1;
        counters.accesses += 2;
        yield snapshot(array, counters, {
          compared: new Set([j - gap, j]),
          active: new Set([i, j]),
        });
        if (array[j - gap] <= array[j]) break;
        [array[j - gap], array[j]] = [array[j], array[j - gap]];
        counters.swaps += 1;
        counters.accesses += 2;
        yield snapshot(array, counters, { swapped: new Set([j - gap, j]) });
        j -= gap;
      }
    }
  }

  yield snapshot(array, counters, {
    sorted: new Set(array.map((_, index) => index)),
    done: true,
  });
}
