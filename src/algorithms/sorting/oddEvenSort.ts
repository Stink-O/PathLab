import { snapshot, type SortStep } from "./types";

export function* oddEvenSort(input: number[]): Generator<SortStep> {
  const array = [...input];
  const counters = { comparisons: 0, swaps: 0, accesses: 0 };
  let sortedPass = false;

  while (!sortedPass) {
    sortedPass = true;
    for (const parity of [1, 0]) {
      for (let i = parity; i < array.length - 1; i += 2) {
        counters.comparisons += 1;
        counters.accesses += 2;
        yield snapshot(array, counters, {
          compared: new Set([i, i + 1]),
        });
        if (array[i] > array[i + 1]) {
          [array[i], array[i + 1]] = [array[i + 1], array[i]];
          counters.swaps += 1;
          counters.accesses += 2;
          sortedPass = false;
          yield snapshot(array, counters, { swapped: new Set([i, i + 1]) });
        }
      }
    }
  }

  yield snapshot(array, counters, {
    sorted: new Set(array.map((_, index) => index)),
    done: true,
  });
}
