import { snapshot, type SortStep } from "./types";

const RUN = 32;

/** Simplified TimSort: insertion-sorted runs merged bottom-up. */
export function* timSort(input: number[]): Generator<SortStep> {
  const array = [...input];
  const counters = { comparisons: 0, swaps: 0, accesses: 0 };
  const n = array.length;

  function* insertionRun(left: number, right: number): Generator<SortStep> {
    for (let i = left + 1; i <= right; i += 1) {
      const value = array[i];
      counters.accesses += 1;
      let j = i - 1;
      while (j >= left) {
        counters.comparisons += 1;
        counters.accesses += 1;
        yield snapshot(array, counters, {
          compared: new Set([j, j + 1]),
          active: new Set([i]),
        });
        if (array[j] <= value) break;
        array[j + 1] = array[j];
        counters.swaps += 1;
        counters.accesses += 2;
        yield snapshot(array, counters, {
          swapped: new Set([j, j + 1]),
          active: new Set([i]),
        });
        j -= 1;
      }
      array[j + 1] = value;
      counters.accesses += 1;
    }
  }

  function* merge(left: number, mid: number, right: number): Generator<SortStep> {
    const leftPart = array.slice(left, mid + 1);
    const rightPart = array.slice(mid + 1, right + 1);
    counters.accesses += leftPart.length + rightPart.length;
    let i = 0;
    let j = 0;
    let k = left;
    while (i < leftPart.length && j < rightPart.length) {
      counters.comparisons += 1;
      counters.accesses += 3;
      array[k] = leftPart[i] <= rightPart[j] ? leftPart[i++] : rightPart[j++];
      counters.swaps += 1;
      yield snapshot(array, counters, {
        swapped: new Set([k]),
        active: new Set([left, right]),
      });
      k += 1;
    }
    while (i < leftPart.length) {
      array[k] = leftPart[i++];
      counters.accesses += 2;
      counters.swaps += 1;
      yield snapshot(array, counters, { swapped: new Set([k]) });
      k += 1;
    }
    while (j < rightPart.length) {
      array[k] = rightPart[j++];
      counters.accesses += 2;
      counters.swaps += 1;
      yield snapshot(array, counters, { swapped: new Set([k]) });
      k += 1;
    }
  }

  for (let left = 0; left < n; left += RUN) {
    yield* insertionRun(left, Math.min(left + RUN - 1, n - 1));
  }
  for (let size = RUN; size < n; size *= 2) {
    for (let left = 0; left < n; left += size * 2) {
      const mid = left + size - 1;
      const right = Math.min(left + size * 2 - 1, n - 1);
      if (mid < right) yield* merge(left, mid, right);
    }
  }

  yield snapshot(array, counters, {
    sorted: new Set(array.map((_, index) => index)),
    done: true,
  });
}
