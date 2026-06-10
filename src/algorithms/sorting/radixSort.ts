import { snapshot, type SortStep } from "./types";

export function* radixSort(input: number[]): Generator<SortStep> {
  const array = [...input];
  const counters = { comparisons: 0, swaps: 0, accesses: 0 };
  const max = Math.max(...array);

  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    const buckets = Array.from({ length: 10 }, () => [] as number[]);
    for (let i = 0; i < array.length; i += 1) {
      counters.accesses += 1;
      const digit = Math.floor(array[i] / exp) % 10;
      buckets[digit].push(array[i]);
      yield snapshot(array, counters, { active: new Set([i]) });
    }

    let index = 0;
    for (const bucket of buckets) {
      for (const value of bucket) {
        array[index] = value;
        counters.swaps += 1;
        counters.accesses += 1;
        yield snapshot(array, counters, { swapped: new Set([index]) });
        index += 1;
      }
    }
  }

  yield snapshot(array, counters, {
    sorted: new Set(array.map((_, index) => index)),
    done: true,
  });
}
