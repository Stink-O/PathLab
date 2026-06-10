import { runSearch } from "./search";
import type { MazeState } from "./types";

export const dfs = (maze: MazeState) => runSearch(maze, "dfs");
