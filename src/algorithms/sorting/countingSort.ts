import { snapshot, type SortStep } from "./types";

export function* countingSort(input: number[]): Generator<SortStep> {
  const array = [...input];
  const counters = { comparisons: 0, swaps: 0, accesses: 0 };
  const max = Math.max(...array, 0);
  const counts = new Array(max + 1).fill(0);

  for (let i = 0; i < array.length; i += 1) {
    counters.accesses += 1;
    counts[array[i]] += 1;
    yield snapshot(array, counters, { active: new Set([i]) });
  }

  let index = 0;
  const sorted = new Set<number>();
  for (let value = 0; value <= max; value += 1) {
    for (let c = 0; c < counts[value]; c += 1) {
      array[index] = value;
      counters.accesses += 1;
      counters.swaps += 1;
      sorted.add(index);
      yield snapshot(array, counters, {
        swapped: new Set([index]),
        sorted,
      });
      index += 1;
    }
  }

  yield snapshot(array, counters, {
    sorted: new Set(array.map((_, i) => i)),
    done: true,
  });
}
