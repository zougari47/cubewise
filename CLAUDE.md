# Cubewise

Solves a scrambled 3×3 cube from the colours the user enters, by a short solution or by a method the user is learning, and teaches those methods. TanStack Start, prerendered to static HTML, deployed on Vercel from `main`.

Use the vocabulary in [GLOSSARY.md](GLOSSARY.md) for names in code, text and commits. Architectural decisions are in [docs/adr/](docs/adr/).

## Where things live

Core logic sits under `src/core/` and is pure TypeScript: no React, no browser APIs, tested in Node.

- `src/core/cube/`: the cube model, moves, stickers, orientation, and the short-solution solver (`solver.ts`, our own Kociemba two-phase).
- `src/core/methods/`: one folder per solving method people learn (`beginner/`, `cfop/`, `roux/`, …), each with its stages (`stages.ts`), its solver (`solver.ts`) and the sequence table shared with its lessons (`sequences.ts`). `index.ts` lists the methods and their stages; `solvers.ts` lists their solvers and is imported only by the worker. `shared/` holds what solvers build on: full notation and the view (`turns.ts`), the stage bookkeeping (`method.ts`), searches (`search.ts`) and the last-layer finish several methods end with (`last-layer.ts`).
- `src/core/scan/`: camera-scan logic on plain pixel data: finding a face anywhere in a picture, reading its stickers, working out every colour from all six faces together, the order faces are shown.

Page code sits under `src/pages/`, one folder per page; core never imports from it.

- `src/pages/solver/`: colour entry (`entry.ts`), playback, the solution panel, and the Web Worker that runs every solver; `scan/` is the camera panel, loaded on demand.
- `src/pages/learn/`: the list of methods, a method's stages, the lesson page, pictures and progress. `lessons.ts` is the lesson-case model; `lessons/<method>.ts` holds each method's cases.

Shared pieces:

- `src/routes/`: thin route files that set the page head and render a component from `src/pages/`.
- `src/components/`: shared components; `ui/` is shadcn.
- `src/i18n/en.ts`: every piece of site text; the text of each method is in `src/i18n/en/<method>.ts` and joined in there.
- `src/lib/seo.ts`: the head tags each page uses.

## Rules

- All user-facing text goes in `src/i18n/en.ts` (method text in `src/i18n/en/<method>.ts`) and is read through `m`.
- A method is added in four places: its folder under `src/core/methods/` (registered in `index.ts` and `solvers.ts`), `src/pages/learn/lessons/<method>.ts` (registered in `lessons/index.ts`), and `src/i18n/en/<method>.ts` (registered in `en.ts`). Its lessons must pass `describeLessons` from `src/pages/learn/lesson-contract.ts`.
- A solver and its lessons read sequences from the same `sequences.ts`, so what is taught is what is played.
- Load 3D (`cube-view.tsx`) with `lazy(() => import(...))`, and run solvers in the worker, so content pages stay light.
- Core cube logic stays general beyond 3×3; only keyboard entry may assume 3×3.
- Lesson and stage names are colour-free ("Cross", "First-layer corners").

## Checks

Run `pnpm test`, `pnpm exec tsc --noEmit` and `pnpm build` after a change; the build prerenders every page, so it catches broken routes.
