import type { SortStep } from "@/algorithms/sorting/types";
import type { SoundStyle } from "@/lib/constants";
import { getAudioContext, playBlip } from "@/lib/audioEngine";

/**
 * "Sound of Sorting"-style audio: steps play short tones whose pitch is the
 * value being touched, so the array is literally audible. Three voices:
 *
 * - classic: plain triangle blips, flat pitch, same voice for compares and
 *   swaps — closest to the original Sound of Sorting videos.
 * - soft: sine waves with a long decay; mellow, no edge.
 * - arcade: square-wave swaps with pitch bends and an octave accent.
 */

let lastToneAt = 0;

/** Map a value onto ~3 octaves, low values low, high values high. */
function frequencyOf(value: number, max: number) {
  const normalized = max <= 0 ? 0 : Math.min(1, value / max);
  return 130 * 2 ** (normalized * 3.1);
}

export function playSortStepTone(step: SortStep, style: SoundStyle = "classic") {
  const ctx = getAudioContext();
  if (!ctx || !step.array.length) return;

  const now = ctx.currentTime;
  if (now - lastToneAt < 0.011) return;
  lastToneAt = now;

  const max = step.array.length;
  const isSwap = step.swapped.size > 0;
  const indices = isSwap
    ? [...step.swapped]
    : step.compared.size > 0
      ? [...step.compared]
      : [...step.active];
  if (!indices.length) return;

  if (step.verify) {
    const index = Math.max(...indices);
    const frequency = frequencyOf(step.array[index] ?? 1, max);
    playBlip(ctx, now, {
      frequency,
      gain: style === "soft" ? 0.1 : 0.13,
      duration: style === "soft" ? 0.1 : 0.06,
      type: style === "soft" ? "sine" : "triangle",
    });
    return;
  }

  for (const index of indices.slice(0, 2)) {
    const value = step.array[index];
    if (value === undefined) continue;
    const frequency = frequencyOf(value, max);
    if (style === "classic") {
      playBlip(ctx, now, {
        frequency,
        gain: isSwap ? 0.13 : 0.09,
        duration: 0.045,
        type: "triangle",
      });
    } else if (style === "soft") {
      playBlip(ctx, now, {
        frequency,
        gain: isSwap ? 0.11 : 0.08,
        duration: 0.11,
        type: "sine",
      });
    } else {
      playBlip(ctx, now, {
        frequency,
        gain: isSwap ? 0.14 : 0.08,
        duration: isSwap ? 0.07 : 0.045,
        type: isSwap ? "square" : "triangle",
        bendTo: isSwap ? 0.74 : 1.12,
        accent: isSwap,
      });
    }
  }
}
