import type { SortStep } from "@/algorithms/sorting/types";
import type { SoundStyle } from "@/lib/constants";

/**
 * "Sound of Sorting"-style audio: steps play short tones whose pitch is the
 * value being touched, so the array is literally audible. Three voices:
 *
 * - classic: plain triangle blips, flat pitch, same voice for compares and
 *   swaps — closest to the original Sound of Sorting videos.
 * - soft: sine waves with a long decay; mellow, no edge.
 * - arcade: square-wave swaps with pitch bends and an octave accent.
 */

let audioContext: AudioContext | null = null;
let masterGain: GainNode | null = null;
let lastToneAt = 0;

function context() {
  if (typeof window === "undefined") return null;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!audioContext) {
    audioContext = new AudioContextClass();
    const compressor = audioContext.createDynamicsCompressor();
    compressor.threshold.value = -22;
    compressor.ratio.value = 8;
    compressor.connect(audioContext.destination);
    masterGain = audioContext.createGain();
    masterGain.gain.value = 0.5;
    masterGain.connect(compressor);
  }
  if (audioContext.state === "suspended") void audioContext.resume();
  return audioContext;
}

/** Map a value onto ~3 octaves, low values low, high values high. */
function frequencyOf(value: number, max: number) {
  const normalized = max <= 0 ? 0 : Math.min(1, value / max);
  return 130 * 2 ** (normalized * 3.1);
}

type Blip = {
  frequency: number;
  gain: number;
  duration: number;
  type: OscillatorType;
  /** Multiply frequency by this over the blip (arcade pitch bend). */
  bendTo?: number;
  /** Add a second oscillator one octave up (arcade swap accent). */
  accent?: boolean;
};

function play(ctx: AudioContext, when: number, blip: Blip) {
  if (!masterGain) return;
  const envelope = ctx.createGain();
  envelope.gain.setValueAtTime(0.0001, when);
  envelope.gain.exponentialRampToValueAtTime(blip.gain, when + 0.006);
  envelope.gain.exponentialRampToValueAtTime(0.0001, when + blip.duration);
  envelope.connect(masterGain);

  const osc = ctx.createOscillator();
  osc.type = blip.type;
  osc.frequency.setValueAtTime(blip.frequency, when);
  if (blip.bendTo) {
    osc.frequency.exponentialRampToValueAtTime(
      blip.frequency * blip.bendTo,
      when + blip.duration * 0.6,
    );
  }
  osc.connect(envelope);
  osc.start(when);
  osc.stop(when + blip.duration + 0.02);

  if (blip.accent) {
    const accent = ctx.createOscillator();
    accent.type = "sine";
    accent.frequency.setValueAtTime(blip.frequency * 2, when);
    accent.connect(envelope);
    accent.start(when);
    accent.stop(when + blip.duration * 0.5);
  }
}

export function playSortStepTone(step: SortStep, style: SoundStyle = "classic") {
  const ctx = context();
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
    play(ctx, now, {
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
      play(ctx, now, {
        frequency,
        gain: isSwap ? 0.13 : 0.09,
        duration: 0.045,
        type: "triangle",
      });
    } else if (style === "soft") {
      play(ctx, now, {
        frequency,
        gain: isSwap ? 0.11 : 0.08,
        duration: 0.11,
        type: "sine",
      });
    } else {
      play(ctx, now, {
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

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
