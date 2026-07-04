import { snapshot, type SortStep } from "./types";

/**
 * Iterative bitonic sorting network. Assumes the input length is a power of
 * two (all PathLab array sizes are); out-of-range partners are skipped so
 * other lengths still terminate safely.
 */
export function* bitonicSort(input: number[]): Generator<SortStep> {
  const array = [...input];
  const counters = { comparisons: 0, swaps: 0, accesses: 0 };
  const n = array.length;

  for (let k = 2; k <= n; k *= 2) {
    for (let j = k / 2; j > 0; j = Math.floor(j / 2)) {
      for (let i = 0; i < n; i += 1) {
        const partner = i ^ j;
        if (partner <= i || partner >= n) continue;
        const ascending = (i & k) === 0;
        counters.comparisons += 1;
        counters.accesses += 2;
        yield snapshot(array, counters, {
          compared: new Set([i, partner]),
        });
        if (ascending ? array[i] > array[partner] : array[i] < array[partner]) {
          [array[i], array[partner]] = [array[partner], array[i]];
          counters.swaps += 1;
          counters.accesses += 2;
          yield snapshot(array, counters, { swapped: new Set([i, partner]) });
        }
      }
    }
  }

  yield snapshot(array, counters, {
    sorted: new Set(array.map((_, index) => index)),
    done: true,
  });
}
