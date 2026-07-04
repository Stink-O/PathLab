import { snapshot, type SortStep } from "./types";

export function* cycleSort(input: number[]): Generator<SortStep> {
  const array = [...input];
  const counters = { comparisons: 0, swaps: 0, accesses: 0 };
  const sorted = new Set<number>();

  for (let cycleStart = 0; cycleStart < array.length - 1; cycleStart += 1) {
    let item = array[cycleStart];
    counters.accesses += 1;
    let position = cycleStart;

    for (let i = cycleStart + 1; i < array.length; i += 1) {
      counters.comparisons += 1;
      counters.accesses += 1;
      yield snapshot(array, counters, {
        compared: new Set([i, cycleStart]),
        active: new Set([position]),
        sorted,
      });
      if (array[i] < item) position += 1;
    }

    if (position === cycleStart) {
      sorted.add(cycleStart);
      continue;
    }

    while (item === array[position]) position += 1;
    [array[position], item] = [item, array[position]];
    counters.swaps += 1;
    counters.accesses += 2;
    yield snapshot(array, counters, { swapped: new Set([position]), sorted });

    while (position !== cycleStart) {
      position = cycleStart;
      for (let i = cycleStart + 1; i < array.length; i += 1) {
        counters.comparisons += 1;
        counters.accesses += 1;
        if (array[i] < item) position += 1;
      }
      while (item === array[position]) position += 1;
      [array[position], item] = [item, array[position]];
      counters.swaps += 1;
      counters.accesses += 2;
      yield snapshot(array, counters, { swapped: new Set([position]), sorted });
    }
    sorted.add(cycleStart);
  }

  yield snapshot(array, counters, {
    sorted: new Set(array.map((_, index) => index)),
    done: true,
  });
}
