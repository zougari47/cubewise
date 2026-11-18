# Cubewise

Solves a scrambled 3×3 cube from the colours the user enters and teaches the beginner method. TanStack Start, prerendered to static HTML, deployed on Vercel from `main`.

Use the vocabulary in [GLOSSARY.md](GLOSSARY.md) for names in code, text and commits. Architectural decisions are in [docs/adr/](docs/adr/).

## Where things live

Core logic is pure TypeScript: no React, no browser APIs, tested in Node.

- `src/cube/`: the cube model, moves, stickers, orientation, and the short-solution solver (`solver.ts`, our own Kociemba two-phase).
- `src/beginner/`: the beginner-method solver, its stages and the sequence table shared with the lessons.

Page code sits under `src/pages/`, one folder per page; core never imports from it.

- `src/pages/solver/`: colour entry (`entry.ts`), playback, the solution panel, and the Web Worker that runs both solvers.
- `src/pages/learn/`: lesson cases, pictures and progress.

Shared pieces:

- `src/routes/`: thin route files that set the page head and render a component from `src/pages/`.
- `src/components/`: shared components; `ui/` is shadcn.
- `src/i18n/en.ts`: every piece of site text.
- `src/lib/seo.ts`: the head tags each page uses.

## Rules

- All user-facing text goes in `src/i18n/en.ts` and is read through `m`.
- Load 3D (`cube-view.tsx`) with `lazy(() => import(...))`, and run solvers in the worker, so content pages stay light.
- Core cube logic stays general beyond 3×3; only keyboard entry may assume 3×3.
- Lesson and stage names are colour-free ("Cross", "First-layer corners").

## Checks

Run `pnpm test`, `pnpm exec tsc --noEmit` and `pnpm build` after a change; the build prerenders every page, so it catches broken routes.
