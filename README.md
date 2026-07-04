# PathLab

An interactive algorithm comparison lab. Pick two algorithms, run them side by side on the same input, and watch (and hear) how differently they behave.

Two modes:

- **Pathfinding** — two searches race across the same maze. Draw walls, drag the start and goal, and compare visited nodes, path length, and time.
- **Sorting** — two sorts race on the same array, rendered as the classic bar visualization with "Sound of Sorting"-style audio: every comparison and swap plays a tone pitched to the value being touched, and every finished sort ends with the green verification sweep.

## Features

- **18 sorting algorithms** — bubble, insertion, selection, merge, quick, heap, shell, cocktail shaker, comb, radix (LSD), tim, counting, bitonic, cycle, odd-even, pancake, gnome, and stooge.
- **8 pathfinding algorithms** — A*, Dijkstra, BFS, DFS, greedy best-first, weighted A*, bidirectional BFS, and jump point search.
- **Audio** — WebAudio tones map array values to pitch; compares and swaps sound different, and the verification sweep is a rising glissando. Toggle audio per panel.
- **Input distributions** — shuffled, nearly sorted, reversed, or few unique values, from 32 up to 512 elements on a crisp canvas renderer.
- **Speed control** — from slow single steps to ultra (40 steps per frame), plus fully manual stepping.
- **Fair comparisons** — both panels always get the same maze or the same array, with per-panel counters (comparisons, swaps, array accesses, visited nodes) and result badges.

## Controls

| Key | Action |
| --- | --- |
| `Space` | Run / pause |
| `→` | Manual step |
| `R` | Reset |
| `N` | Random algorithm pair |

In pathfinding mode, click cells to toggle walls and drag the start/goal markers.

## Development

Next.js (App Router) + TypeScript + Tailwind CSS + Zustand.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
npm run lint
```

Algorithms are implemented as generators (`src/algorithms/`) that yield one visualization step at a time; the simulation loop (`src/app/page.tsx` + `src/simulation/`) pulls from both generators on a shared clock, so speed control, manual stepping, and pausing work the same for every algorithm.
