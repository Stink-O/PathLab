import { manhattan } from "./heuristics";
import { reconstructPath } from "./reconstructPath";
import { keyOf, pointFromKey, type MazeState, type PathStep } from "./types";

type Strategy =
  | "astar"
  | "dijkstra"
  | "bfs"
  | "dfs"
  | "greedy"
  | "weightedAstar";

function neighbors(key: string, maze: MazeState) {
  const { x, y } = pointFromKey(key);
  const options = [
    { x: x + 1, y },
    { x: x - 1, y },
    { x, y: y + 1 },
    { x, y: y - 1 },
  ];
  return options
    .filter((p) => p.x >= 0 && p.x < maze.cols && p.y >= 0 && p.y < maze.rows)
    .map(keyOf)
    .filter((k) => !maze.walls.has(k));
}

function priorityFor(strategy: Strategy, key: string, cost: number, maze: MazeState) {
  if (strategy === "dijkstra" || strategy === "bfs") return cost;
  if (strategy === "greedy") return manhattan(pointFromKey(key), maze.goal);
  if (strategy === "weightedAstar")
    return cost + manhattan(pointFromKey(key), maze.goal) * 1.8;
  return cost + manhattan(pointFromKey(key), maze.goal);
}

export function* runSearch(maze: MazeState, strategy: Strategy): Generator<PathStep> {
  const startKey = keyOf(maze.start);
  const goalKey = keyOf(maze.goal);
  const frontier: string[] = [startKey];
  const frontierSet = new Set(frontier);
  const visited = new Set<string>();
  const parents = new Map<string, string>();
  const costs = new Map<string, number>([[startKey, 0]]);

  while (frontier.length) {
    let current: string;
    if (strategy === "dfs") {
      current = frontier.pop()!;
    } else {
      frontier.sort(
        (a, b) =>
          priorityFor(strategy, a, costs.get(a) ?? Infinity, maze) -
          priorityFor(strategy, b, costs.get(b) ?? Infinity, maze),
      );
      current = frontier.shift()!;
    }
    frontierSet.delete(current);
    if (visited.has(current)) continue;
    visited.add(current);

    yield {
      current,
      frontier: new Set(frontierSet),
      visited: new Set(visited),
      parents: new Map(parents),
      costs: new Map(costs),
    };

    if (current === goalKey) {
      yield {
        current,
        frontier: new Set(frontierSet),
        visited: new Set(visited),
        parents: new Map(parents),
        costs: new Map(costs),
        path: reconstructPath(parents, startKey, goalKey),
        done: true,
      };
      return;
    }

    for (const next of neighbors(current, maze)) {
      if (visited.has(next)) continue;
      const nextCost = (costs.get(current) ?? 0) + 1;
      const existing = costs.get(next);
      const shouldUpdate =
        existing === undefined || nextCost < existing || strategy === "dfs";
      if (shouldUpdate) {
        parents.set(next, current);
        costs.set(next, nextCost);
      }
      if (!frontierSet.has(next)) {
        frontier.push(next);
        frontierSet.add(next);
      }
    }
  }

  yield {
    frontier: new Set(),
    visited: new Set(visited),
    parents: new Map(parents),
    costs: new Map(costs),
    path: [],
    done: true,
    failed: true,
  };
}
