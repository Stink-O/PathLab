import { manhattan } from "./heuristics";
import { keyOf, pointFromKey, type MazeState, type PathStep } from "./types";

/**
 * Iterative deepening A*: depth-first probes with a growing f-cost budget.
 * Each iteration restarts from scratch, which reads as expanding "waves".
 * A per-iteration g-value cache keeps grid re-expansions linear.
 */
export function* idaStar(maze: MazeState): Generator<PathStep> {
  const startKey = keyOf(maze.start);
  const goalKey = keyOf(maze.goal);
  const maxThreshold = maze.cols * maze.rows;

  const neighbors = (key: string) => {
    const { x, y } = pointFromKey(key);
    return [
      { x: x + 1, y },
      { x: x - 1, y },
      { x, y: y + 1 },
      { x, y: y - 1 },
    ]
      .filter((p) => p.x >= 0 && p.x < maze.cols && p.y >= 0 && p.y < maze.rows)
      .map(keyOf)
      .filter((k) => !maze.walls.has(k));
  };

  const heuristic = (key: string) => manhattan(pointFromKey(key), maze.goal);
  const parents = new Map<string, string>();

  let threshold = heuristic(startKey);
  while (threshold <= maxThreshold) {
    const gSeen = new Map<string, number>([[startKey, 0]]);
    const visited = new Set<string>();
    const trail = new Set<string>([startKey]);

    function* probe(key: string, g: number): Generator<PathStep, number> {
      const f = g + heuristic(key);
      if (f > threshold) return f;
      visited.add(key);
      yield {
        current: key,
        frontier: new Set(trail),
        visited: new Set(visited),
        parents: new Map(parents),
        costs: new Map(gSeen),
      };
      if (key === goalKey) return -1;
      let min = Infinity;
      for (const next of neighbors(key)) {
        const nextG = g + 1;
        if ((gSeen.get(next) ?? Infinity) <= nextG) continue;
        gSeen.set(next, nextG);
        parents.set(next, key);
        trail.add(next);
        const result = yield* probe(next, nextG);
        if (result === -1) return -1;
        if (result < min) min = result;
        trail.delete(next);
      }
      return min;
    }

    const outcome = yield* probe(startKey, 0);
    if (outcome === -1) {
      const path: string[] = [goalKey];
      let cursor = goalKey;
      while (cursor !== startKey) {
        cursor = parents.get(cursor)!;
        path.push(cursor);
      }
      path.reverse();
      yield {
        current: goalKey,
        frontier: new Set(),
        visited: new Set(visited),
        parents: new Map(parents),
        costs: new Map(gSeen),
        path,
        done: true,
      };
      return;
    }
    if (outcome === Infinity) break;
    threshold = outcome;
  }

  yield {
    frontier: new Set(),
    visited: new Set(),
    parents: new Map(),
    costs: new Map(),
    path: [],
    done: true,
    failed: true,
  };
}
