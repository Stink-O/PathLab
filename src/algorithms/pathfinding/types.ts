export type PathAlgorithmId =
  | "astar"
  | "dijkstra"
  | "bfs"
  | "dfs"
  | "greedy"
  | "weightedAstar"
  | "bidirectionalBfs"
  | "jps"
  | "idaStar"
  | "tremaux"
  | "deadEndFill";

export type Point = { x: number; y: number };
export type GridNode = Point & { wall: boolean };

export type MazeState = {
  cols: number;
  rows: number;
  walls: Set<string>;
  start: Point;
  goal: Point;
};

export type PathStep = {
  current?: string;
  frontier: Set<string>;
  visited: Set<string>;
  parents: Map<string, string>;
  costs: Map<string, number>;
  path?: string[];
  done?: boolean;
  failed?: boolean;
  /** Step belongs to the post-search path trace, not the algorithm. */
  verify?: boolean;
};

export type PathResult = {
  status: "complete" | "failed";
  path: string[];
  visited: number;
  steps: number;
};

export const keyOf = (point: Point) => `${point.x},${point.y}`;

export function pointFromKey(key: string): Point {
  const [x, y] = key.split(",").map(Number);
  return { x, y };
}
