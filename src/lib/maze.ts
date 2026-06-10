import { GRID_SIZES, type GridSize } from "@/lib/constants";
import { keyOf, type MazeState, type Point } from "@/algorithms/pathfinding/types";

export function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}

function shuffleDirections(random: () => number) {
  const directions = [
    { x: 2, y: 0 },
    { x: -2, y: 0 },
    { x: 0, y: 2 },
    { x: 0, y: -2 },
  ];
  for (let i = directions.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [directions[i], directions[j]] = [directions[j], directions[i]];
  }
  return directions;
}

function openNeighbors(point: Point, walls: Set<string>, cols: number, rows: number) {
  return [
    { x: point.x + 1, y: point.y },
    { x: point.x - 1, y: point.y },
    { x: point.x, y: point.y + 1 },
    { x: point.x, y: point.y - 1 },
  ].filter(
    (next) =>
      next.x > 0 &&
      next.x < cols - 1 &&
      next.y > 0 &&
      next.y < rows - 1 &&
      !walls.has(keyOf(next)),
  );
}

function braidMaze(walls: Set<string>, cols: number, rows: number, random: () => number) {
  const candidates: Point[] = [];
  for (let y = 1; y < rows - 1; y += 1) {
    for (let x = 1; x < cols - 1; x += 1) {
      const point = { x, y };
      if (walls.has(keyOf(point))) continue;
      const exits = openNeighbors(point, walls, cols, rows).length;
      if (exits <= 1) candidates.push(point);
    }
  }

  for (const point of candidates) {
    if (random() > 0.62) continue;
    const wallsToOpen = shuffleDirections(random)
      .map((dir) => ({
        wall: { x: point.x + dir.x / 2, y: point.y + dir.y / 2 },
        beyond: { x: point.x + dir.x, y: point.y + dir.y },
      }))
      .filter(
        ({ wall, beyond }) =>
          beyond.x > 0 &&
          beyond.x < cols - 1 &&
          beyond.y > 0 &&
          beyond.y < rows - 1 &&
          walls.has(keyOf(wall)) &&
          !walls.has(keyOf(beyond)),
      )
      .map(({ wall }) => wall);
    if (wallsToOpen[0]) walls.delete(keyOf(wallsToOpen[0]));
  }

  const connectorCount = Math.floor((cols * rows) / 95);
  for (let i = 0; i < connectorCount; i += 1) {
    const x = 2 + Math.floor(random() * Math.max(1, cols - 4));
    const y = 2 + Math.floor(random() * Math.max(1, rows - 4));
    const point = { x, y };
    if (!walls.has(keyOf(point))) continue;
    const exits = openNeighbors(point, walls, cols, rows);
    if (exits.length >= 2) walls.delete(keyOf(point));
  }
}

function clampPoint(point: Point, cols: number, rows: number): Point {
  return {
    x: Math.min(Math.max(point.x, 1), cols - 2),
    y: Math.min(Math.max(point.y, 1), rows - 2),
  };
}

function nearestOpenPoint(point: Point, walls: Set<string>, cols: number, rows: number) {
  const start = clampPoint(point, cols, rows);
  if (!walls.has(keyOf(start))) return start;

  let best: Point | null = null;
  let bestDistance = Infinity;
  for (let y = 1; y < rows - 1; y += 1) {
    for (let x = 1; x < cols - 1; x += 1) {
      const candidate = { x, y };
      if (walls.has(keyOf(candidate))) continue;
      const distance = Math.abs(candidate.x - start.x) + Math.abs(candidate.y - start.y);
      if (distance < bestDistance) {
        best = candidate;
        bestDistance = distance;
      }
    }
  }

  return best ?? start;
}

export function makeMaze(
  size: GridSize,
  seed = 1427,
  preserved?: Partial<Pick<MazeState, "start" | "goal">>,
): MazeState {
  const random = seededRandom(seed);
  const { cols, rows } = GRID_SIZES[size];
  const walls = new Set<string>();

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      walls.add(keyOf({ x, y }));
    }
  }

  const carve = (point: Point) => walls.delete(keyOf(point));
  const startCell = { x: 1, y: Math.max(1, Math.floor(rows / 2) | 1) };
  const stack: Point[] = [startCell];
  carve(startCell);

  while (stack.length) {
    const current = stack[stack.length - 1];
    const next = shuffleDirections(random)
      .map((dir) => ({ x: current.x + dir.x, y: current.y + dir.y, dir }))
      .find(
        ({ x, y }) =>
          x > 0 && x < cols - 1 && y > 0 && y < rows - 1 && walls.has(keyOf({ x, y })),
      );

    if (!next) {
      stack.pop();
      continue;
    }

    carve({ x: current.x + next.dir.x / 2, y: current.y + next.dir.y / 2 });
    carve({ x: next.x, y: next.y });
    stack.push({ x: next.x, y: next.y });
  }

  let start = preserved?.start
    ? nearestOpenPoint(preserved.start, walls, cols, rows)
    : { x: 1, y: startCell.y };
  let goal = preserved?.goal
    ? nearestOpenPoint(preserved.goal, walls, cols, rows)
    : {
        x: cols - 2,
        y: Math.max(1, Math.floor(rows / 2) | 1),
      };

  if (keyOf(start) === keyOf(goal)) {
    goal = nearestOpenPoint({ x: cols - 2, y: goal.y }, walls, cols, rows);
    if (keyOf(start) === keyOf(goal)) start = nearestOpenPoint({ x: 1, y: start.y }, walls, cols, rows);
  }

  carve(start);
  carve(goal);
  for (let x = 1; x <= goal.x; x += 1) {
    if (x > goal.x - 3) carve({ x, y: goal.y });
  }

  braidMaze(walls, cols, rows, random);
  carve(start);
  carve(goal);

  return { cols, rows, walls, start, goal };
}

export function makeOpenGrid(size: GridSize): MazeState {
  const { cols, rows } = GRID_SIZES[size];
  return {
    cols,
    rows,
    walls: new Set(),
    start: { x: 1, y: Math.floor(rows / 2) },
    goal: { x: cols - 2, y: Math.floor(rows / 2) },
  };
}
