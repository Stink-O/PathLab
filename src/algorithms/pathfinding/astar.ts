import { runSearch } from "./search";
import type { MazeState } from "./types";

export const astar = (maze: MazeState) => runSearch(maze, "astar");
