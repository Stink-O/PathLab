/**
 * Shared WebAudio plumbing for the sorting and pathfinding step sounds:
 * one lazily-created context with a master gain feeding a compressor, and
 * a tiny envelope-shaped oscillator "blip" primitive both voices build on.
 */

let audioContext: AudioContext | null = null;
let masterGain: GainNode | null = null;

export function getAudioContext() {
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

export type Blip = {
  frequency: number;
  gain: number;
  duration: number;
  type: OscillatorType;
  /** Multiply frequency by this over the blip (pitch bend). */
  bendTo?: number;
  /** Add a second oscillator one octave up (accent). */
  accent?: boolean;
};

export function playBlip(ctx: AudioContext, when: number, blip: Blip) {
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

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
