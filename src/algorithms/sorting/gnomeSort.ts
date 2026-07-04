import { snapshot, type SortStep } from "./types";

export function* gnomeSort(input: number[]): Generator<SortStep> {
  const array = [...input];
  const counters = { comparisons: 0, swaps: 0, accesses: 0 };
  let i = 0;
  while (i < array.length) {
    if (i === 0) {
      i += 1;
      continue;
    }
    counters.comparisons += 1;
    counters.accesses += 2;
    yield snapshot(array, counters, {
      compared: new Set([i - 1, i]),
      active: new Set([i]),
    });
    if (array[i] >= array[i - 1]) {
      i += 1;
    } else {
      [array[i], array[i - 1]] = [array[i - 1], array[i]];
      counters.swaps += 1;
      counters.accesses += 2;
      yield snapshot(array, counters, {
        swapped: new Set([i - 1, i]),
        active: new Set([i]),
      });
      i -= 1;
    }
  }
  yield snapshot(array, counters, {
    sorted: new Set(array.map((_, index) => index)),
    done: true,
  });
}
