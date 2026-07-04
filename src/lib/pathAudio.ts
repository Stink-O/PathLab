import {
  pointFromKey,
  type MazeState,
  type PathStep,
} from "@/algorithms/pathfinding/types";
import type { SoundStyle } from "@/lib/constants";
import { getAudioContext, playBlip } from "@/lib/audioEngine";

/**
 * Pathfinding audio, in the spirit of the sorting sounds: every expanded
 * cell plays a blip whose pitch is its closeness to the goal, so a search
 * is literally audible homing in (or wandering). The path trace sweeps
 * upward as the route draws itself, ending in an arrival chime at the
 * goal; exhausting the maze plays a falling buzz. The three voices match
 * the sorting sound styles.
 */

let lastToneAt = 0;

/** 1 at the goal, 0 at the farthest possible cell. */
function goalProximity(key: string, maze: MazeState) {
  const { x, y } = pointFromKey(key);
  const distance = Math.abs(x - maze.goal.x) + Math.abs(y - maze.goal.y);
  const span = maze.cols + maze.rows - 2;
  return span <= 0 ? 1 : 1 - Math.min(1, distance / span);
}

/** Map goal-closeness onto ~3 octaves, far cells low, near cells high. */
function frequencyOf(proximity: number) {
  return 120 * 2 ** (proximity * 2.9);
}

/** Arrival chime at the goal, one octave accent on top. */
function playArrivalChime(ctx: AudioContext, when: number, style: SoundStyle) {
  playBlip(ctx, when, {
    frequency: frequencyOf(1),
    gain: 0.14,
    duration: 0.35,
    type: style === "arcade" ? "square" : style === "soft" ? "sine" : "triangle",
    accent: true,
  });
}

function playFailureBuzz(ctx: AudioContext, when: number, style: SoundStyle) {
  playBlip(ctx, when, {
    frequency: 130,
    gain: 0.15,
    duration: 0.5,
    type: style === "soft" ? "sine" : "sawtooth",
    bendTo: 0.5,
  });
  playBlip(ctx, when + 0.02, {
    frequency: 98,
    gain: 0.11,
    duration: 0.5,
    type: "triangle",
    bendTo: 0.5,
  });
}

export function playPathStepTone(
  step: PathStep,
  maze: MazeState,
  style: SoundStyle = "classic",
) {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  if (step.done) {
    if (step.failed || !step.path?.length) playFailureBuzz(ctx, now, style);
    else playArrivalChime(ctx, now, style);
    return;
  }

  if (!step.current) return;
  if (now - lastToneAt < 0.011) return;
  lastToneAt = now;

  if (step.verify) {
    // Path trace: a brighter tone per revealed cell, rising toward the goal.
    playBlip(ctx, now, {
      frequency: frequencyOf(goalProximity(step.current, maze)),
      gain: style === "soft" ? 0.1 : 0.13,
      duration: style === "soft" ? 0.1 : 0.06,
      type: style === "soft" ? "sine" : "triangle",
    });
    return;
  }

  const frequency = frequencyOf(goalProximity(step.current, maze));
  if (style === "classic") {
    playBlip(ctx, now, { frequency, gain: 0.1, duration: 0.05, type: "triangle" });
  } else if (style === "soft") {
    playBlip(ctx, now, { frequency, gain: 0.09, duration: 0.12, type: "sine" });
  } else {
    playBlip(ctx, now, {
      frequency,
      gain: 0.07,
      duration: 0.05,
      type: "square",
      bendTo: 1.15,
    });
  }
}
