import { keyOf, pointFromKey, type MazeState, type PathStep } from "./types";

/**
 * Trémaux's maze-solving walk: a single explorer moves cell to cell, marks
 * passages, takes unmarked corridors first, and physically walks back out of
 * dead ends. Backtracking steps are yielded too, so the "mouse in a maze"
 * motion is visible. The current trail is shown as the frontier.
 */
export function* tremaux(maze: MazeState): Generator<PathStep> {
  const startKey = keyOf(maze.start);
  const goalKey = keyOf(maze.goal);
  const visited = new Set<string>();
  const parents = new Map<string, string>();
  const trail = new Set<string>();

  const neighbors = (key: string) => {
    const { x, y } = pointFromKey(key);
    return [
      { x: x + 1, y },
      { x, y: y + 1 },
      { x: x - 1, y },
      { x, y: y - 1 },
    ]
      .filter((p) => p.x >= 0 && p.x < maze.cols && p.y >= 0 && p.y < maze.rows)
      .map(keyOf)
      .filter((k) => !maze.walls.has(k));
  };

  const snapshot = (current: string): PathStep => ({
    current,
    frontier: new Set(trail),
    visited: new Set(visited),
    parents: new Map(parents),
    costs: new Map(),
  });

  function* walk(key: string): Generator<PathStep, boolean> {
    visited.add(key);
    trail.add(key);
    yield snapshot(key);
    if (key === goalKey) return true;
    for (const next of neighbors(key)) {
      if (visited.has(next)) continue;
      parents.set(next, key);
      if (yield* walk(next)) return true;
      // Walk back out of the dead branch so the retreat is visible.
      yield snapshot(key);
    }
    trail.delete(key);
    return false;
  }

  const found = yield* walk(startKey);
  if (found) {
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
      costs: new Map(),
      path,
      done: true,
    };
    return;
  }

  yield {
    frontier: new Set(),
    visited: new Set(visited),
    parents: new Map(parents),
    costs: new Map(),
    path: [],
    done: true,
    failed: true,
  };
}
