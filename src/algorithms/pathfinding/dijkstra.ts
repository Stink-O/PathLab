import { runSearch } from "./search";
import type { MazeState } from "./types";

export const dijkstra = (maze: MazeState) => runSearch(maze, "dijkstra");
