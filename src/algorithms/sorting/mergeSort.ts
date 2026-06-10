import { snapshot, type SortStep } from "./types";

export function* mergeSort(input: number[]): Generator<SortStep> {
  const array = [...input];
  const counters = { comparisons: 0, swaps: 0, accesses: 0 };

  function* merge(left: number, mid: number, right: number): Generator<SortStep> {
    const copy = array.slice(left, right + 1);
    let i = 0;
    let j = mid - left + 1;
    let k = left;
    while (i <= mid - left && j <= right - left) {
      counters.comparisons += 1;
      counters.accesses += 2;
      yield snapshot(array, counters, {
        compared: new Set([left + i, left + j]),
        active: new Set([k]),
      });
      if (copy[i] <= copy[j]) array[k] = copy[i++];
      else array[k] = copy[j++];
      counters.swaps += 1;
      counters.accesses += 1;
      yield snapshot(array, counters, { swapped: new Set([k]) });
      k += 1;
    }
    while (i <= mid - left) array[k++] = copy[i++];
    while (j <= right - left) array[k++] = copy[j++];
    yield snapshot(array, counters, {
      active: new Set(Array.from({ length: right - left + 1 }, (_, n) => left + n)),
    });
  }

  function* divide(left: number, right: number): Generator<SortStep> {
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);
    yield* divide(left, mid);
    yield* divide(mid + 1, right);
    yield* merge(left, mid, right);
  }

  yield* divide(0, array.length - 1);
  yield snapshot(array, counters, {
    sorted: new Set(array.map((_, index) => index)),
    done: true,
  });
}
