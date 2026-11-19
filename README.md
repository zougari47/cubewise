# Cubewise

Cubewise solves a scrambled 3×3 Rubik's cube from the colours you enter, and teaches the methods people use to solve one by hand.

- **Solver.** Paint the six faces or scan the cube with your camera, then follow the moves on a 3D cube. Choose the short solution (about 21 moves) or a solution by the method you are learning, grouped by stage with a link to each lesson.
- **Lessons.** Six methods, stage by stage: beginner, keyhole, CFOP, Roux, ZZ and Petrus. A lesson and the solver read the same sequences, so what is taught is what is played.
- **Three languages.** English, French (`/fr`) and Arabic (`/ar`, right-to-left).
- **History.** Every cube you solve is kept in your browser, to replay it later or copy its solution.
- **Private.** Everything runs in the browser, including the camera scan and the solver. Nothing is uploaded and there is no account.

## Run it

You need Node and [pnpm](https://pnpm.io).

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

Before pushing a change:

```bash
pnpm test                # Vitest
pnpm exec tsc --noEmit   # types, including missing translations
pnpm build               # prerenders every page in every language
```

## How it is built

[TanStack Start](https://tanstack.com/start) with React, prerendered to static HTML and deployed on Vercel from `main`. Tailwind and shadcn for the interface, three.js for the 3D cube.

| Path | What is there |
|---|---|
| `src/core/cube/` | The cube model, moves, and the short-solution solver (our own Kociemba two-phase) |
| `src/core/methods/` | One folder per method: its stages, its solver and its sequences |
| `src/core/scan/` | Camera scan: finding a face in a picture and reading its colours |
| `src/pages/` | Page code: `home/`, `solver/`, `learn/`, `history/` |
| `src/routes/{-$locale}/` | Thin route files under an optional language prefix |
| `src/i18n/` | All site text: `en.ts`, `fr.ts`, `ar.ts`, and one file per method in each language |

`src/core/` is pure TypeScript with no React or browser APIs. Solvers run in a Web Worker and the 3D view is loaded on demand, so content pages stay light.

For more detail:

- [CLAUDE.md](CLAUDE.md): where things live, the rules, and how to add a method.
- [GLOSSARY.md](GLOSSARY.md): the vocabulary used in code and text, with its French and Arabic translations.
- [docs/adr/](docs/adr/): the architectural decisions.

## Configuration

Canonical and `hreflang` links use `SITE_URL` when it is set at build time, and otherwise Vercel's production URL. Local builds leave them root-relative.

## Contributing

- **Fix a lesson's text.** Every lesson page has a "Suggest an update" link that opens its text file on GitHub in the language you are reading.
- **Report a problem with the solver.** Use the "Report it" link on the solver page, which fills in the colours you entered, or open an [issue](https://github.com/zougari47/cubewise/issues).
- **Add text.** Add the key in `src/i18n/en.ts` (or `en/<method>.ts`), then in `fr` and `ar`; `tsc` fails until all three have it.

## Licence

[MIT](LICENSE)
