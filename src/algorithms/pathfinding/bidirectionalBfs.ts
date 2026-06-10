import { keyOf, pointFromKey, type MazeState, type PathStep } from "./types";

function neighbors(key: string, maze: MazeState) {
  const { x, y } = pointFromKey(key);
  return [
    { x: x + 1, y },
    { x: x - 1, y },
    { x, y: y + 1 },
    { x, y: y - 1 },
  ]
    .filter((p) => p.x >= 0 && p.x < maze.cols && p.y >= 0 && p.y < maze.rows)
    .map(keyOf)
    .filter((key) => !maze.walls.has(key));
}

function combinedPath(
  meet: string,
  startParents: Map<string, string>,
  goalParents: Map<string, string>,
) {
  const left = [meet];
  while (startParents.has(left[0])) {
    left.unshift(startParents.get(left[0])!);
  }

  const right: string[] = [];
  let cursor = meet;
  while (goalParents.has(cursor)) {
    cursor = goalParents.get(cursor)!;
    right.push(cursor);
  }

  return [...left, ...right];
}

export function* bidirectionalBfs(maze: MazeState): Generator<PathStep> {
  const startKey = keyOf(maze.start);
  const goalKey = keyOf(maze.goal);
  const startQueue = [startKey];
  const goalQueue = [goalKey];
  const startVisited = new Set([startKey]);
  const goalVisited = new Set([goalKey]);
  const startParents = new Map<string, string>();
  const goalParents = new Map<string, string>();
  const costs = new Map<string, number>([
    [startKey, 0],
    [goalKey, 0],
  ]);

  while (startQueue.length && goalQueue.length) {
    const fromStart = startQueue.shift()!;
    for (const next of neighbors(fromStart, maze)) {
      if (startVisited.has(next)) continue;
      startVisited.add(next);
      startParents.set(next, fromStart);
      costs.set(next, (costs.get(fromStart) ?? 0) + 1);
      startQueue.push(next);
      if (goalVisited.has(next)) {
        const path = combinedPath(next, startParents, goalParents);
        yield {
          current: next,
          frontier: new Set([...startQueue, ...goalQueue]),
          visited: new Set([...startVisited, ...goalVisited]),
          parents: new Map([...startParents, ...goalParents]),
          costs,
          path,
          done: true,
        };
        return;
      }
    }

    const fromGoal = goalQueue.shift()!;
    for (const next of neighbors(fromGoal, maze)) {
      if (goalVisited.has(next)) continue;
      goalVisited.add(next);
      goalParents.set(next, fromGoal);
      costs.set(next, (costs.get(fromGoal) ?? 0) + 1);
      goalQueue.push(next);
      if (startVisited.has(next)) {
        const path = combinedPath(next, startParents, goalParents);
        yield {
          current: next,
          frontier: new Set([...startQueue, ...goalQueue]),
          visited: new Set([...startVisited, ...goalVisited]),
          parents: new Map([...startParents, ...goalParents]),
          costs,
          path,
          done: true,
        };
        return;
      }
    }

    yield {
      current: fromStart,
      frontier: new Set([...startQueue, ...goalQueue]),
      visited: new Set([...startVisited, ...goalVisited]),
      parents: new Map([...startParents, ...goalParents]),
      costs: new Map(costs),
    };
  }

  yield {
    frontier: new Set(),
    visited: new Set([...startVisited, ...goalVisited]),
    parents: new Map([...startParents, ...goalParents]),
    costs,
    path: [],
    done: true,
    failed: true,
  };
}
