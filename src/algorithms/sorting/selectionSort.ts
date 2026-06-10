import { snapshot, type SortStep } from "./types";

export function* selectionSort(input: number[]): Generator<SortStep> {
  const array = [...input];
  const counters = { comparisons: 0, swaps: 0, accesses: 0 };
  const sorted = new Set<number>();
  for (let i = 0; i < array.length - 1; i += 1) {
    let min = i;
    for (let j = i + 1; j < array.length; j += 1) {
      counters.comparisons += 1;
      counters.accesses += 2;
      yield snapshot(array, counters, {
        compared: new Set([min, j]),
        active: new Set([i, min, j]),
        sorted,
      });
      if (array[j] < array[min]) min = j;
    }
    if (min !== i) {
      [array[i], array[min]] = [array[min], array[i]];
      counters.swaps += 1;
      counters.accesses += 2;
      yield snapshot(array, counters, { swapped: new Set([i, min]), sorted });
    }
    sorted.add(i);
  }
  array.forEach((_, index) => sorted.add(index));
  yield snapshot(array, counters, { sorted, done: true });
}
