import { snapshot, type SortStep } from "./types";

export function* quickSort(input: number[]): Generator<SortStep> {
  const array = [...input];
  const counters = { comparisons: 0, swaps: 0, accesses: 0 };
  const sorted = new Set<number>();

  function* partition(low: number, high: number): Generator<SortStep, number> {
    const pivot = array[high];
    let i = low;
    for (let j = low; j < high; j += 1) {
      counters.comparisons += 1;
      counters.accesses += 2;
      yield snapshot(array, counters, {
        compared: new Set([j, high]),
        active: new Set([i, j, high]),
        sorted,
      });
      if (array[j] < pivot) {
        [array[i], array[j]] = [array[j], array[i]];
        counters.swaps += 1;
        counters.accesses += 2;
        yield snapshot(array, counters, { swapped: new Set([i, j]), sorted });
        i += 1;
      }
    }
    [array[i], array[high]] = [array[high], array[i]];
    counters.swaps += 1;
    yield snapshot(array, counters, { swapped: new Set([i, high]), sorted });
    return i;
  }

  function* sort(low: number, high: number): Generator<SortStep> {
    if (low > high) return;
    if (low === high) {
      sorted.add(low);
      yield snapshot(array, counters, { sorted });
      return;
    }
    const pivot = yield* partition(low, high);
    sorted.add(pivot);
    yield* sort(low, pivot - 1);
    yield* sort(pivot + 1, high);
  }

  yield* sort(0, array.length - 1);
  yield snapshot(array, counters, {
    sorted: new Set(array.map((_, index) => index)),
    done: true,
  });
}
