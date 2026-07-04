import { astar } from "@/algorithms/pathfinding/astar";
import { bfs } from "@/algorithms/pathfinding/bfs";
import { bidirectionalBfs } from "@/algorithms/pathfinding/bidirectionalBfs";
import { dfs } from "@/algorithms/pathfinding/dfs";
import { dijkstra } from "@/algorithms/pathfinding/dijkstra";
import { greedyBestFirst } from "@/algorithms/pathfinding/greedyBestFirst";
import { jps } from "@/algorithms/pathfinding/jps";
import { idaStar } from "@/algorithms/pathfinding/idaStar";
import { tremaux } from "@/algorithms/pathfinding/tremaux";
import { deadEndFill } from "@/algorithms/pathfinding/deadEndFill";
import { weightedAstar } from "@/algorithms/pathfinding/weightedAstar";
import type {
  MazeState,
  PathAlgorithmId,
  PathStep,
} from "@/algorithms/pathfinding/types";

export function createPathGenerator(id: PathAlgorithmId, maze: MazeState) {
  if (id === "astar") return astar(maze);
  if (id === "dijkstra") return dijkstra(maze);
  if (id === "bfs") return bfs(maze);
  if (id === "dfs") return dfs(maze);
  if (id === "greedy") return greedyBestFirst(maze);
  if (id === "weightedAstar") return weightedAstar(maze);
  if (id === "bidirectionalBfs") return bidirectionalBfs(maze);
  if (id === "jps") return jps(maze);
  if (id === "idaStar") return idaStar(maze);
  if (id === "tremaux") return tremaux(maze);
  if (id === "deadEndFill") return deadEndFill(maze);
  return greedyBestFirst(maze) as Generator<PathStep>;
}
