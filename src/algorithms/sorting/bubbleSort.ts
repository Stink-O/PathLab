import { snapshot, type SortStep } from "./types";

export function* bubbleSort(input: number[]): Generator<SortStep> {
  const array = [...input];
  const counters = { comparisons: 0, swaps: 0, accesses: 0 };
  const sorted = new Set<number>();
  for (let end = array.length - 1; end > 0; end -= 1) {
    for (let i = 0; i < end; i += 1) {
      counters.comparisons += 1;
      counters.accesses += 2;
      yield snapshot(array, counters, {
        compared: new Set([i, i + 1]),
        active: new Set([i, i + 1]),
        sorted,
      });
      if (array[i] > array[i + 1]) {
        [array[i], array[i + 1]] = [array[i + 1], array[i]];
        counters.swaps += 1;
        counters.accesses += 2;
        yield snapshot(array, counters, {
          swapped: new Set([i, i + 1]),
          active: new Set([i, i + 1]),
          sorted,
        });
      }
    }
    sorted.add(end);
  }
  array.forEach((_, index) => sorted.add(index));
  yield snapshot(array, counters, { sorted, done: true });
}
