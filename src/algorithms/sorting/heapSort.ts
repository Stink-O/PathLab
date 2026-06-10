import { snapshot, type SortStep } from "./types";

export function* heapSort(input: number[]): Generator<SortStep> {
  const array = [...input];
  const counters = { comparisons: 0, swaps: 0, accesses: 0 };
  const sorted = new Set<number>();

  function* heapify(size: number, root: number): Generator<SortStep> {
    let largest = root;
    const left = root * 2 + 1;
    const right = root * 2 + 2;
    if (left < size) {
      counters.comparisons += 1;
      counters.accesses += 2;
      yield snapshot(array, counters, { compared: new Set([largest, left]), sorted });
      if (array[left] > array[largest]) largest = left;
    }
    if (right < size) {
      counters.comparisons += 1;
      counters.accesses += 2;
      yield snapshot(array, counters, { compared: new Set([largest, right]), sorted });
      if (array[right] > array[largest]) largest = right;
    }
    if (largest !== root) {
      [array[root], array[largest]] = [array[largest], array[root]];
      counters.swaps += 1;
      counters.accesses += 2;
      yield snapshot(array, counters, { swapped: new Set([root, largest]), sorted });
      yield* heapify(size, largest);
    }
  }

  for (let i = Math.floor(array.length / 2) - 1; i >= 0; i -= 1) {
    yield* heapify(array.length, i);
  }
  for (let end = array.length - 1; end > 0; end -= 1) {
    [array[0], array[end]] = [array[end], array[0]];
    counters.swaps += 1;
    sorted.add(end);
    yield snapshot(array, counters, { swapped: new Set([0, end]), sorted });
    yield* heapify(end, 0);
  }
  array.forEach((_, index) => sorted.add(index));
  yield snapshot(array, counters, { sorted, done: true });
}
