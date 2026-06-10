import { runSearch } from "./search";
import type { MazeState } from "./types";

export const greedyBestFirst = (maze: MazeState) => runSearch(maze, "greedy");
