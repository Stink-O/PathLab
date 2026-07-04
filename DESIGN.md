# PathLab design system

The UI reads as a two-channel bench instrument: the maze and sorting visualizations are the signal, everything else is quiet chrome. Structure comes from hairline rules on one continuous surface, never from stacked boxes.

## Hard rules

- **No pills.** Corner radius is 4px maximum (2px for tiny markers like status dots and legend squares). Status is a square dot plus a word, results are text lines with a check, toggles are square checkboxes, tabs are flat text with a 2px accent underline.
- **No cards, and never a box inside a box.** Sections are separated by 1px rules (`--border`). The two algorithm panels are columns split by a center rule on `xl`, stacked with a horizontal rule below that.
- **13px text floor.** Base body is 15px. Field labels, legend, and shortcut hints sit at 13px; nothing goes smaller.

## Tokens (`src/app/globals.css`)

Cool graphite neutrals in both themes; all component colors come from CSS variables, never hardcoded.

- Chrome: `--bg`, `--surface` (fields), `--surface-2` (hover/kbd), `--border`, `--text`, `--muted`
- Semantic: `--accent` (magenta: primary action, selection, focus rings), `--on-accent`, `--success` (verdict lines), `--danger`
- Visualization: `--cell`, `--wall`, `--visited`, `--frontier`, `--path`, `--start`, `--goal`, `--swap`, `--bar`

The accent is magenta because the visualizations already own blue (start), amber (frontier), green (path), and red (goal). Keep the accent off inactive states.

## Type

Geist Sans for UI, Geist Mono for numbers, complexity notation, channel markers, and kbd. Scale: 24px panel titles, 20px readout values (`tabular-nums`), 19px wordmark, 15px controls/body, 14px status and hints, 13px labels/legend.

## Components (`src/components/ui`)

- `Button`: primary (accent fill), secondary (bordered surface), ghost. 40px tall, 4px radius. Transport group joins secondaries inside one bordered wrapper with internal 1px dividers.
- `Select`: flat bordered field with a custom chevron (`.select-field`).
- `Field`: 13px label above a control, no box.
- `Toggle`: 18px square checkbox, accent-filled when checked.
- `StatusIndicator`: 8px square dot + word; the dot pulses while running (disabled under reduced motion).

## Motion

150–250ms ease-out transitions for state only: tap scale on buttons, fade-in on verdict lines, pulse on the running dot. No page-load choreography. Everything respects `prefers-reduced-motion`.
