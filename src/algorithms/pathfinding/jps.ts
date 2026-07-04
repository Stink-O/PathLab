import { manhattan } from "./heuristics";
import { keyOf, pointFromKey, type MazeState, type PathStep, type Point } from "./types";

const DIRECTIONS: Point[] = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
];

/**
 * Orthogonal Jump Point Search: A* that skips down corridors and only
 * expands nodes where the path could actually turn (forced neighbors).
 * Vertical scans probe horizontally so turning points are never missed.
 * Cells passed over during jumps are added to `visited` for display.
 */
export function* jps(maze: MazeState): Generator<PathStep> {
  const startKey = keyOf(maze.start);
  const goalKey = keyOf(maze.goal);

  const walkable = (x: number, y: number) =>
    x >= 0 && x < maze.cols && y >= 0 && y < maze.rows && !maze.walls.has(`${x},${y}`);

  const scanned = new Set<string>();

  function jump(fromX: number, fromY: number, dx: number, dy: number): Point | null {
    let x = fromX;
    let y = fromY;
    while (true) {
      x += dx;
      y += dy;
      if (!walkable(x, y)) return null;
      const key = `${x},${y}`;
      scanned.add(key);
      if (key === goalKey) return { x, y };
      if (dx !== 0) {
        // Forced neighbor beside a horizontal corridor: a wall just behind
        // us opens up above or below at this cell.
        if (
          (walkable(x, y - 1) && !walkable(x - dx, y - 1)) ||
          (walkable(x, y + 1) && !walkable(x - dx, y + 1))
        ) {
          return { x, y };
        }
      } else {
        if (
          (walkable(x - 1, y) && !walkable(x - 1, y - dy)) ||
          (walkable(x + 1, y) && !walkable(x + 1, y - dy))
        ) {
          return { x, y };
        }
        // Vertical scans look sideways so horizontal turning points stop the jump.
        if (jump(x, y, 1, 0) || jump(x, y, -1, 0)) return { x, y };
      }
    }
  }

  const open: string[] = [startKey];
  const openSet = new Set(open);
  const closed = new Set<string>();
  const parents = new Map<string, string>();
  const costs = new Map<string, number>([[startKey, 0]]);

  const displayVisited = () => new Set([...scanned, ...closed]);

  while (open.length) {
    open.sort(
      (a, b) =>
        (costs.get(a) ?? Infinity) +
        manhattan(pointFromKey(a), maze.goal) -
        ((costs.get(b) ?? Infinity) + manhattan(pointFromKey(b), maze.goal)),
    );
    const current = open.shift()!;
    openSet.delete(current);
    if (closed.has(current)) continue;
    closed.add(current);
    scanned.add(current);

    yield {
      current,
      frontier: new Set(openSet),
      visited: displayVisited(),
      parents: new Map(parents),
      costs: new Map(costs),
    };

    if (current === goalKey) {
      yield {
        current,
        frontier: new Set(openSet),
        visited: displayVisited(),
        parents: new Map(parents),
        costs: new Map(costs),
        path: expandJumpPath(parents, startKey, goalKey),
        done: true,
      };
      return;
    }

    const point = pointFromKey(current);
    for (const dir of DIRECTIONS) {
      const jumpPoint = jump(point.x, point.y, dir.x, dir.y);
      if (!jumpPoint) continue;
      const jumpKey = keyOf(jumpPoint);
      if (closed.has(jumpKey)) continue;
      const nextCost = (costs.get(current) ?? 0) + manhattan(point, jumpPoint);
      const existing = costs.get(jumpKey);
      if (existing === undefined || nextCost < existing) {
        parents.set(jumpKey, current);
        costs.set(jumpKey, nextCost);
        if (!openSet.has(jumpKey)) {
          open.push(jumpKey);
          openSet.add(jumpKey);
        }
      }
    }
  }

  yield {
    frontier: new Set(),
    visited: displayVisited(),
    parents: new Map(parents),
    costs: new Map(costs),
    path: [],
    done: true,
    failed: true,
  };
}

/** Jump points can be several cells apart; fill in the straight segments. */
function expandJumpPath(parents: Map<string, string>, startKey: string, goalKey: string) {
  const jumpChain: string[] = [goalKey];
  let cursor = goalKey;
  while (cursor !== startKey) {
    const parent = parents.get(cursor);
    if (!parent) return [];
    jumpChain.push(parent);
    cursor = parent;
  }
  jumpChain.reverse();

  const path: string[] = [startKey];
  for (let i = 1; i < jumpChain.length; i += 1) {
    const from = pointFromKey(jumpChain[i - 1]);
    const to = pointFromKey(jumpChain[i]);
    const dx = Math.sign(to.x - from.x);
    const dy = Math.sign(to.y - from.y);
    let x = from.x;
    let y = from.y;
    while (x !== to.x || y !== to.y) {
      x += dx;
      y += dy;
      path.push(`${x},${y}`);
    }
  }
  return path;
}
