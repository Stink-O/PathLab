import { keyOf, pointFromKey, type MazeState, type PathStep } from "./types";

/**
 * Dead-end filling: repeatedly seal every dead-end corridor (open cells with
 * one exit, excluding start and goal) until only through-routes remain, then
 * walk the surviving corridor. Filled cells are shown as visited.
 */
export function* deadEndFill(maze: MazeState): Generator<PathStep> {
  const startKey = keyOf(maze.start);
  const goalKey = keyOf(maze.goal);
  const filled = new Set<string>();

  const openNeighbors = (key: string) => {
    const { x, y } = pointFromKey(key);
    return [
      { x: x + 1, y },
      { x: x - 1, y },
      { x, y: y + 1 },
      { x, y: y - 1 },
    ]
      .filter((p) => p.x >= 0 && p.x < maze.cols && p.y >= 0 && p.y < maze.rows)
      .map(keyOf)
      .filter((k) => !maze.walls.has(k) && !filled.has(k));
  };

  const snapshot = (current?: string): PathStep => ({
    current,
    frontier: new Set<string>(),
    visited: new Set(filled),
    parents: new Map<string, string>(),
    costs: new Map<string, number>(),
  });

  // Seed with the current dead ends, then propagate down corridors.
  let queue: string[] = [];
  for (let y = 0; y < maze.rows; y += 1) {
    for (let x = 0; x < maze.cols; x += 1) {
      const key = keyOf({ x, y });
      if (maze.walls.has(key) || key === startKey || key === goalKey) continue;
      if (openNeighbors(key).length <= 1) queue.push(key);
    }
  }

  while (queue.length) {
    const next: string[] = [];
    for (const key of queue) {
      if (filled.has(key)) continue;
      if (openNeighbors(key).length > 1) continue;
      const exits = openNeighbors(key);
      filled.add(key);
      yield snapshot(key);
      for (const exit of exits) {
        if (exit === startKey || exit === goalKey) continue;
        if (openNeighbors(exit).length <= 1) next.push(exit);
      }
    }
    queue = next;
  }

  // Walk the remaining corridors (BFS, no yields) to produce the route.
  const parents = new Map<string, string>();
  const seen = new Set([startKey]);
  const bfsQueue = [startKey];
  let found = false;
  while (bfsQueue.length) {
    const current = bfsQueue.shift()!;
    if (current === goalKey) {
      found = true;
      break;
    }
    for (const next of openNeighbors(current)) {
      if (seen.has(next)) continue;
      seen.add(next);
      parents.set(next, current);
      bfsQueue.push(next);
    }
  }

  if (!found) {
    yield { ...snapshot(), path: [], done: true, failed: true };
    return;
  }

  const path: string[] = [goalKey];
  let cursor = goalKey;
  while (cursor !== startKey) {
    cursor = parents.get(cursor)!;
    path.push(cursor);
  }
  path.reverse();
  yield { ...snapshot(goalKey), path, done: true };
}
