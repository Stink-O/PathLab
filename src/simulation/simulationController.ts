import type { PanelRunState } from "@/store/useSimulationStore";

export function comparePathResults(a: PanelRunState, b: PanelRunState) {
  const labels = { a: [] as string[], b: [] as string[] };
  const aStep = a.pathStep;
  const bStep = b.pathStep;
  const aFound = !!aStep?.path?.length && !aStep.failed;
  const bFound = !!bStep?.path?.length && !bStep.failed;

  if (!aFound) labels.a.push("No route found");
  if (!bFound) labels.b.push("No route found");
  if (aFound && bFound) {
    if (a.elapsed < b.elapsed) labels.a.push("Finished first");
    if (b.elapsed < a.elapsed) labels.b.push("Finished first");
    if ((aStep.path?.length ?? Infinity) < (bStep.path?.length ?? Infinity))
      labels.a.push("Shortest route");
    if ((bStep.path?.length ?? Infinity) < (aStep.path?.length ?? Infinity))
      labels.b.push("Shortest route");
  }
  if ((aStep?.visited.size ?? Infinity) < (bStep?.visited.size ?? Infinity))
    labels.a.push("Fewest visited nodes");
  if ((bStep?.visited.size ?? Infinity) < (aStep?.visited.size ?? Infinity))
    labels.b.push("Fewest visited nodes");
  return labels;
}

export function compareSortResults(a: PanelRunState, b: PanelRunState) {
  const labels = { a: [] as string[], b: [] as string[] };
  if (a.elapsed < b.elapsed) labels.a.push("Finished first");
  if (b.elapsed < a.elapsed) labels.b.push("Finished first");
  const aComparisons = a.sortStep?.counters.comparisons ?? Infinity;
  const bComparisons = b.sortStep?.counters.comparisons ?? Infinity;
  if (aComparisons < bComparisons) labels.a.push("Fewest comparisons");
  if (bComparisons < aComparisons) labels.b.push("Fewest comparisons");
  return labels;
}
