import { seededRandom } from "@/lib/maze";
import type { ArraySize, SortDistribution } from "@/lib/constants";

/** Build the input array for a sorting run: values 1..n in a chosen shape. */
export function makeArray(
  size: ArraySize,
  distribution: SortDistribution = "shuffled",
  seed = 2049,
) {
  const random = seededRandom(seed);
  const items = Array.from({ length: size }, (_, index) => index + 1);

  if (distribution === "reversed") {
    return items.reverse();
  }

  if (distribution === "nearlySorted") {
    const disturbances = Math.max(2, Math.floor(size / 12));
    for (let d = 0; d < disturbances; d += 1) {
      const i = Math.floor(random() * size);
      const j = Math.min(size - 1, i + 1 + Math.floor(random() * 4));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  }

  if (distribution === "fewUnique") {
    const buckets = 8;
    const values = items.map(
      (_, index) => Math.ceil(((index % buckets) + 1) * (size / buckets)),
    );
    for (let i = values.length - 1; i > 0; i -= 1) {
      const j = Math.floor(random() * (i + 1));
      [values[i], values[j]] = [values[j], values[i]];
    }
    return values;
  }

  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}
