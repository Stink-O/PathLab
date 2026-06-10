import { snapshot, type SortStep } from "./types";

export function* combSort(input: number[]): Generator<SortStep> {
  const array = [...input];
  const counters = { comparisons: 0, swaps: 0, accesses: 0 };
  let gap = array.length;
  let swapped = true;

  while (gap > 1 || swapped) {
    gap = Math.max(1, Math.floor(gap / 1.3));
    swapped = false;
    for (let i = 0; i + gap < array.length; i += 1) {
      const j = i + gap;
      counters.comparisons += 1;
      counters.accesses += 2;
      yield snapshot(array, counters, { compared: new Set([i, j]) });
      if (array[i] > array[j]) {
        [array[i], array[j]] = [array[j], array[i]];
        counters.swaps += 1;
        counters.accesses += 2;
        swapped = true;
        yield snapshot(array, counters, { swapped: new Set([i, j]) });
      }
    }
  }

  yield snapshot(array, counters, {
    sorted: new Set(array.map((_, index) => index)),
    done: true,
  });
}
