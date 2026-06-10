import { snapshot, type SortStep } from "./types";

export function* cocktailSort(input: number[]): Generator<SortStep> {
  const array = [...input];
  const counters = { comparisons: 0, swaps: 0, accesses: 0 };
  const sorted = new Set<number>();
  let start = 0;
  let end = array.length - 1;
  let swapped = true;

  while (swapped) {
    swapped = false;
    for (let i = start; i < end; i += 1) {
      counters.comparisons += 1;
      counters.accesses += 2;
      yield snapshot(array, counters, { compared: new Set([i, i + 1]), sorted });
      if (array[i] > array[i + 1]) {
        [array[i], array[i + 1]] = [array[i + 1], array[i]];
        counters.swaps += 1;
        counters.accesses += 2;
        swapped = true;
        yield snapshot(array, counters, { swapped: new Set([i, i + 1]), sorted });
      }
    }
    sorted.add(end);
    end -= 1;
    if (!swapped) break;
    swapped = false;
    for (let i = end; i > start; i -= 1) {
      counters.comparisons += 1;
      counters.accesses += 2;
      yield snapshot(array, counters, { compared: new Set([i - 1, i]), sorted });
      if (array[i - 1] > array[i]) {
        [array[i - 1], array[i]] = [array[i], array[i - 1]];
        counters.swaps += 1;
        counters.accesses += 2;
        swapped = true;
        yield snapshot(array, counters, { swapped: new Set([i - 1, i]), sorted });
      }
    }
    sorted.add(start);
    start += 1;
  }

  array.forEach((_, index) => sorted.add(index));
  yield snapshot(array, counters, { sorted, done: true });
}
