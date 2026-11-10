# Cubewise v1: Plan

Agreed during the design session on 2026-11-10. Vocabulary follows [GLOSSARY.md](../GLOSSARY.md); architectural decisions live in [docs/adr/](./adr/).

## Goal

A website that solves a user's scrambled 3×3 cube from the colours they enter, teaches them to solve it themselves, and is search-friendly on every page.

## Stack

- TanStack Start (React 19, file routing), Tailwind, Nitro. **No move to Astro**; see [ADR 0001](./adr/0001-tanstack-start-over-astro.md).
- Every page is server-rendered or prerendered to full HTML.
- Heavy parts (3D rendering, solvers) are always lazy-loaded and never in a content page's initial bundle.
- 3D: react-three-fiber (Three.js).
- Keyboard handling: written ourselves (plain keydown listener). TanStack Hotkeys (beta) not used for now; revisit if many global shortcuts appear.
- English only for v1, but built with i18n in mind: no hard-coded UI strings, and room for `/fr/...`-style prefixes with English unprefixed.

## Pages

| URL | What |
|---|---|
| `/` | Home page |
| `/solver` | The solver |
| `/learn` | List of lessons |
| `/learn/beginner/<stage>` | One lesson per stage, e.g. `/learn/beginner/cross` |

Room left for `/learn/cfop/...` later.

## Home page

- Headline and link to the solver, a "learn to solve it" section, a "how it works" section, and an FAQ.
- Shows a static cube picture first (part of the HTML).
- Desktop: the 3D cube loads automatically once the page is idle and replaces the picture.
- Phones: keep the picture; load 3D only if the user taps it.

## Solver: entering colours

- 3×3 only. The core cube logic must not assume 3×3; the keyboard input may.
- The user paints the **Front face**; the 3D cube is shown with placeholder **sticker numbers** 1–9.
- **Keyboard:** sticker number, then **colour key**. Only this order is supported (no colour-then-numbers).
  - Colour keys: `W Y R O B G` (white, yellow, red, orange, blue, green).
  - Arrow keys turn the cube to bring another face to the front: ← → for the side faces, ↑ ↓ for top and bottom. Numbers 1–9 always refer to whatever face is now in front.
  - No move-letter shortcuts while entering colours (avoids the R = red/right and B = blue/back clash).
- **Mouse/touch (phones, and laptop users who prefer the mouse):** pick a colour from the palette, then click or tap stickers. Keyboard and touch edit the same cube.
- A clickable **net** shows all 6 faces and progress; clicking a face jumps to it.
- **Centres** start pre-filled with the standard colour scheme (white top, green front) and can be repainted for cubes with other colours. Rule: the 6 centres must all be different colours. Someone with an unusual cube colour (e.g. pink) just uses any unused colour key for it, consistently.
- Undo/redo (`Ctrl+Z` / `Ctrl+Shift+Z`), clear face, reset cube.
- The painted cube is saved in localStorage so a refresh doesn't lose it.
- **Checking:** a live count per colour (each must reach 9). On Solve, a full validity check with clear messages ("two corners have the same colours", "an edge is flipped") and the bad stickers highlighted where possible.

## Solver: results

- The user chooses the method:
  - **Short solution** (default): about 21 moves. Our own two-phase (Kociemba) solver in `src/cube/solver.ts`, with no dependency; it replaces the earlier plan to use min2phase.js. It still has to be moved into a Web Worker and loaded only on the solver page. Measured on Node: about 0.6 s to build its tables once, then about 40 ms per cube on average with the default 200 ms limit, and 21 moves or fewer for about 96% of random cubes (the rest 22).
  - **Beginner solution:** our own solver (no maintained library exists). Grouped by **stage**, described in the user's own colour scheme, each stage linking to its lesson. It shares its algorithm table with the lessons.
- Animated 3D playback, with the move list shown and the current move highlighted.
- Two modes, each with its own keys:
  - Editing: number/colour keys and arrows turn the cube.
  - Playback: Space = play/pause, ← → = step back/forward. `E` or the "Edit cube" button returns to editing.
- Accessible: every sticker labelled ("Front face, sticker 3, red"), and the solution readable as text moves (`R U R' U'`).

## Lessons

- The beginner (layer-by-layer) method first; CFOP possibly later.
- 2D SVG cube pictures by default (fast, prerendered), with an optional "watch in 3D" button that loads the 3D player on demand.
- Stage names never mention a colour ("Cross", "First-layer corners"). Lessons show the standard colours; the solver's beginner solution shows the user's colours.
- Progress saved in localStorage; a lesson becomes done when the user clicks "Mark as complete". No accounts.

## Other

- Analytics: Cloudflare Web Analytics (free, no cookies, so no cookie banner), added at launch.
- Testing: run with `pnpm test` (Vitest, configured in `vitest.config.ts`). Thorough automated tests for the core cube logic (applying moves, the validity check, both solvers, and thousands of random scramble → solve → check-solved runs). No UI tests in v1.
- No money-making in v1.

## Postponed

- Lesson content and how lessons are written.
- How translation (i18n) will work.
- Camera input for scanning the cube.
- An input option for people without a full keyboard.

## Suggested build order

1. ~~Core cube logic and its tests (cube model, moves, validity check).~~ Done: `src/cube/cubie.ts`, `src/cube/stickers.ts`.
2. Short solution: solver done (`src/cube/solver.ts`); still to do: run it in a Web Worker.
3. Solver page: 3D cube, colour input, net, validation, playback.
4. Beginner solver and its algorithm table.
5. Home page and lesson pages (prerendered).
