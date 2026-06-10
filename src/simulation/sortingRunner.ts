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
import type { SortAlgorithmId, SortStep } from "@/algorithms/sorting/types";

export function createSortGenerator(id: SortAlgorithmId, input: number[]) {
  const generators: Record<SortAlgorithmId, Generator<SortStep>> = {
    bubble: bubbleSort(input),
    insertion: insertionSort(input),
    selection: selectionSort(input),
    merge: mergeSort(input),
    quick: quickSort(input),
    heap: heapSort(input),
    shell: shellSort(input),
    cocktail: cocktailSort(input),
    comb: combSort(input),
    radix: radixSort(input),
  };
  return generators[id];
}
