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

/**
 * After a search finds a route, replay it start-to-goal on the fixed
 * verification clock so the path draws itself instead of appearing at
 * once — the pathfinding cousin of the sorting verification sweep.
 */
function* withPathTrace(generator: Generator<PathStep>): Generator<PathStep> {
  let final: PathStep | undefined;
  for (const step of generator) {
    if (step.done) {
      final = step;
      break;
    }
    yield step;
  }
  if (!final) return;

  const path = final.path ?? [];
  if (final.failed || path.length === 0) {
    yield final;
    return;
  }

  const perStep = Math.max(1, Math.ceil(path.length / 48));
  for (let end = perStep; end < path.length; end += perStep) {
    yield {
      ...final,
      done: false,
      path: path.slice(0, end),
      current: path[end - 1],
      verify: true,
    };
  }
  yield { ...final, verify: true };
}

function generatorFor(id: PathAlgorithmId, maze: MazeState) {
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

export function createPathGenerator(id: PathAlgorithmId, maze: MazeState) {
  return withPathTrace(generatorFor(id, maze));
}
