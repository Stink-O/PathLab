---
target: src/app/page.tsx
total_score: 25
p0_count: 0
p1_count: 2
timestamp: 2026-06-04T03-50-57Z
slug: src-app-page-tsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Panel badges and metrics communicate readiness/results; global run state could be more explicit. |
| 2 | Match System / Real World | 3 | The lab metaphor and algorithm labels fit technical visitors; maze editing needs clearer plain-language cues. |
| 3 | User Control and Freedom | 3 | Start, pause, step, reset, randomize, clear, and mode switching are present; undo for wall editing is absent. |
| 4 | Consistency and Standards | 3 | Buttons, selects, badges, panels, and colors are cohesive; custom toggles need stronger focus treatment. |
| 5 | Error Prevention | 2 | Duplicate algorithm prevention is good, but locked algorithms and edit constraints are under-explained. |
| 6 | Recognition Rather Than Recall | 2 | Core controls are visible, but keyboard shortcuts, color meanings, and grid interactions are hidden. |
| 7 | Flexibility and Efficiency | 3 | Keyboard shortcuts exist and manual stepping is useful, but accelerators are undiscoverable. |
| 8 | Aesthetic and Minimalist Design | 3 | The loaded UI is cohesive and portfolio-worthy; first view is still control-heavy before it teaches the visualization. |
| 9 | Error Recovery | 2 | Reset and clear actions recover common states; no-path/failure recovery needs clearer user-facing language. |
| 10 | Help and Documentation | 1 | No contextual help, legend, or interaction hints for first-time visitors. |
| **Total** | | **25/40** | **Acceptable** |

## Anti-Patterns Verdict

**LLM assessment**: This does not read as generic AI slop. The interface has a coherent restrained lab identity, a specific interaction model, and domain-shaped controls. The loaded desktop and mobile states show the comparison panels correctly, with a strong side-by-side concept and a clean tactile maze treatment. The main weakness is not visual polish, it is that the app assumes users already know what the colors and interactions mean.

**Deterministic scan**: `detect.mjs --json src/app/page.tsx src/components src/app/globals.css` returned `[]`. No detector hits for banned patterns, repeated generic scaffolds, gradient text, overlarge radii, clipped overflow rules, or slop signatures.

**Visual overlays**: No reliable user-visible overlay is available. The in-app Browser tab API was not exposed in this session, and Playwright was not installed. Fallback evidence came from Chrome DevTools Protocol screenshots after waiting for the loaded UI.

## Overall Impression

PathLab already looks like a real interactive GitHub project, not a template. The aesthetic direction should mostly stay as-is. The biggest opportunity is onboarding the visualization itself: explain the maze states, explain how to edit, and make the existing shortcuts discoverable without adding a heavy tutorial.

## What's Working

- The restrained color system fits the goal. The warm lab palette, dark theme support, and semantic maze colors feel intentional without turning into a fake SaaS dashboard.
- The comparison model is strong. Two algorithms, two panels, shared maze/data, and result metrics form a clear product idea.
- The responsive layout is better than the early capture suggested. On loaded mobile, controls wrap cleanly and both panels remain readable.

## Priority Issues

**[P1] First-time users get no legend or editing hints**

**Why it matters**: The maze states are color-coded, but users are not told what wall, frontier, visited, current, path, start, or goal colors mean. They also have to discover draw/drag behavior by experimenting.

**Fix**: Add a compact legend near the visualization and a one-line interaction hint that changes by mode: for pathfinding, "Draw walls, drag start/goal, then run"; for sorting, "Choose two algorithms, shuffle data, then run." Keep it small and integrated, not a tutorial panel.

**Suggested command**: `$impeccable onboard src/components/comparison/AlgorithmPanel.tsx`

**[P1] Maze cells create an accessibility and keyboard-navigation trap**

**Why it matters**: Every maze cell is a `<button>`. A medium grid creates 627 focusable cells per panel, before counting controls. For keyboard and screen reader users, that turns the page into hundreds of repeated "wall" or "empty" announcements.

**Fix**: Treat the maze as a composite widget rather than hundreds of independent tab stops. Use one focusable grid container with arrow-key navigation, or make cells `tabIndex={-1}` and provide explicit keyboard controls for moving start/goal and drawing walls. Add an accessible summary of the maze state.

**Suggested command**: `$impeccable audit src/components/pathfinding/MazeGrid.tsx`

**[P2] Keyboard shortcuts exist but are invisible**

**Why it matters**: Space, `R`, `N`, and ArrowRight are useful accelerators, but only someone reading the code knows they exist. This wastes one of the app's best power-user touches.

**Fix**: Add a compact shortcut affordance in the control area or footer row: Space run/pause, R reset, N random pair, ArrowRight step. Use real `<kbd>` elements or a small help popover.

**Suggested command**: `$impeccable clarify src/app/page.tsx`

**[P2] Advanced and disabled states need more explanation**

**Why it matters**: `Jump point search - Advanced` is disabled, but the UI does not say whether it is planned, unavailable, or locked for a reason. "Mirror test" and "Stop on first result" are useful but not self-evident for casual visitors.

**Fix**: Add short helper text or tooltips for the two toggles and disabled algorithms. Keep the copy concrete: "Compare the same algorithm against a mirrored maze" beats a generic label.

**Suggested command**: `$impeccable clarify src/components/app-shell/ControlBar.tsx`

**[P2] Custom toggles lose accessible focus clarity**

**Why it matters**: The checkbox input is `sr-only`, and the visible track does not expose a clear focus-visible style. Keyboard users can reach it but may not see where focus is.

**Fix**: Add `peer` focus-visible styling to the visual toggle track, and consider `aria-describedby` for the advanced behavior labels if the meaning is not obvious.

**Suggested command**: `$impeccable audit src/components/ui/Toggle.tsx`

## Persona Red Flags

**Alex (Power User)**: Alex benefits from the existing shortcuts, but the UI never reveals them. They can run and reset quickly only after reading source. Manual stepping is present, but its relationship to ArrowRight is hidden.

**Jordan (First-Timer)**: Jordan sees many controls before receiving a clear explanation of the maze colors or editing model. "Mirror test" and "Stop on first result" are not explained. They may run the visualization, enjoy it, and still not understand what frontier or visited states mean.

**Sam (Accessibility-Dependent User)**: Sam gets native selects and buttons, which is good. The problems are custom toggle focus visibility, hundreds of individually focusable maze cell buttons, and color-only visual states in the maze/sort displays.

## Minor Observations

- `Panel` combines a border with a large `0_18px_60px` shadow. It is subtle, but it is close to the ghost-card pattern the design rules warn against.
- The top label "Algorithm comparison lab" is acceptable as one brand cue, but the high letter spacing makes it feel more decorative than useful.
- The mobile layout is usable once fully loaded, though the first screen is still mostly controls. Letting the top of the first maze appear a little sooner would make the project feel more immediately interactive.
- Lint passes with no errors, but ESLint scans copied skill bundles under `.agents`, `.claude`, `.cursor`, and `.gemini`, causing 528 warnings unrelated to app code.

## Questions to Consider

- Should the first viewport prove the app's value by showing part of the maze before the user touches controls?
- Is the app meant to be understood in 10 seconds by a GitHub visitor, or is it acceptable as a tinkering surface?
- What would make the comparison result feel satisfying at the end: badges only, or a clearer visual summary of why one algorithm won?
