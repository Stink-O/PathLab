import type { SortStep } from "@/algorithms/sorting/types";

let audioContext: AudioContext | null = null;
let lastToneAt = 0;

function context() {
  if (typeof window === "undefined") return null;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  audioContext ??= new AudioContextClass();
  if (audioContext.state === "suspended") void audioContext.resume();
  return audioContext;
}

function primaryIndex(step: SortStep) {
  return (
    [...step.swapped][0] ??
    [...step.compared][0] ??
    [...step.active][0] ??
    0
  );
}

function toneFrequency(value: number, max: number) {
  const scale = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24];
  const normalized = max <= 1 ? 0 : value / max;
  const note = scale[Math.min(scale.length - 1, Math.floor(normalized * scale.length))];
  return 174.61 * 2 ** (note / 12);
}

export function playSortStepTone(step: SortStep) {
  const ctx = context();
  if (!ctx || !step.array.length) return;

  const now = ctx.currentTime;
  if (now - lastToneAt < 0.012) return;
  lastToneAt = now;

  const index = primaryIndex(step);
  const value = step.array[index] ?? step.array[0] ?? 1;
  const max = Math.max(...step.array, 1);
  const baseFrequency = toneFrequency(value, max);
  const isSwap = step.swapped.size > 0;

  const output = ctx.createGain();
  output.gain.setValueAtTime(0.0001, now);
  output.gain.exponentialRampToValueAtTime(isSwap ? 0.08 : 0.045, now + 0.008);
  output.gain.exponentialRampToValueAtTime(0.0001, now + (isSwap ? 0.09 : 0.055));
  output.connect(ctx.destination);

  const osc = ctx.createOscillator();
  osc.type = isSwap ? "square" : "triangle";
  osc.frequency.setValueAtTime(baseFrequency, now);
  osc.frequency.exponentialRampToValueAtTime(baseFrequency * (isSwap ? 0.74 : 1.12), now + 0.045);
  osc.connect(output);
  osc.start(now);
  osc.stop(now + 0.1);

  if (isSwap) {
    const accent = ctx.createOscillator();
    accent.type = "sine";
    accent.frequency.setValueAtTime(baseFrequency * 2, now);
    accent.connect(output);
    accent.start(now);
    accent.stop(now + 0.045);
  }
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
