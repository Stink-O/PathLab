import { bubbleSort } from "@/algorithms/sorting/bubbleSort";
import { heapSort } from "@/algorithms/sorting/heapSort";
import { insertionSort } from "@/algorithms/sorting/insertionSort";
import { mergeSort } from "@/algorithms/sorting/mergeSort";
import { quickSort } from "@/algorithms/sorting/quickSort";
import { cocktailSort } from "@/algorithms/sorting/cocktailSort";
import { combSort } from "@/algorithms/sorting/combSort";
import { radixSort } from "@/algorithms/sorting/radixSort";
import { selectionSort } from "@/algorithms/sorting/selectionSort";
import { shellSort } from "@/algorithms/sorting/shellSort";
import { gnomeSort } from "@/algorithms/sorting/gnomeSort";
import { pancakeSort } from "@/algorithms/sorting/pancakeSort";
import { cycleSort } from "@/algorithms/sorting/cycleSort";
import { oddEvenSort } from "@/algorithms/sorting/oddEvenSort";
import { countingSort } from "@/algorithms/sorting/countingSort";
import { bitonicSort } from "@/algorithms/sorting/bitonicSort";
import { timSort } from "@/algorithms/sorting/timSort";
import { stoogeSort } from "@/algorithms/sorting/stoogeSort";
import type { SortAlgorithmId, SortStep } from "@/algorithms/sorting/types";

const SORTS: Record<SortAlgorithmId, (input: number[]) => Generator<SortStep>> = {
  bubble: bubbleSort,
  insertion: insertionSort,
  selection: selectionSort,
  merge: mergeSort,
  quick: quickSort,
  heap: heapSort,
  shell: shellSort,
  cocktail: cocktailSort,
  comb: combSort,
  radix: radixSort,
  gnome: gnomeSort,
  pancake: pancakeSort,
  cycle: cycleSort,
  oddEven: oddEvenSort,
  counting: countingSort,
  bitonic: bitonicSort,
  tim: timSort,
  stooge: stoogeSort,
};

/**
 * After a sort finishes, run the classic left-to-right verification sweep:
 * elements lock in green from left to right with a rising tone, like the
 * final pass in the "Sound of Sorting" videos.
 */
function* withVerification(generator: Generator<SortStep>): Generator<SortStep> {
  let final: SortStep | undefined;
  for (const step of generator) {
    if (step.done) {
      final = step;
      break;
    }
    yield step;
  }
  if (!final) return;

  const { array, counters } = final;
  const n = array.length;
  const perStep = Math.max(1, Math.ceil(n / 48));
  const sorted = new Set<number>();
  let i = 0;
  while (i < n) {
    const upTo = Math.min(n, i + perStep);
    while (i < upTo) {
      sorted.add(i);
      i += 1;
    }
    yield {
      array: [...array],
      active: new Set<number>(),
      compared: new Set(i < n ? [i - 1, i] : []),
      swapped: new Set<number>(),
      sorted: new Set(sorted),
      counters: { ...counters },
      verify: true,
    };
  }
  yield { ...final, verify: true };
}

export function createSortGenerator(id: SortAlgorithmId, input: number[]) {
  return withVerification(SORTS[id](input));
}
