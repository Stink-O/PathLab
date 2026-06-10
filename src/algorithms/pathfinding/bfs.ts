import { runSearch } from "./search";
import type { MazeState } from "./types";

export const bfs = (maze: MazeState) => runSearch(maze, "bfs");
