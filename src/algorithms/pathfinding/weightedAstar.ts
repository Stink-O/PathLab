import { runSearch } from "./search";
import type { MazeState } from "./types";

export const weightedAstar = (maze: MazeState) => runSearch(maze, "weightedAstar");
