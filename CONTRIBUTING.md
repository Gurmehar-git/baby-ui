# Contributing

## Setup

Requirements: Node 22.17+, pnpm 11 (`corepack enable`), and Bun 1.3 (the registry build runs on
it).

```bash
pnpm install   # also generates indexes and installs the pre-commit hook
pnpm dev       # docs site at http://site.baby-ui.localhost
```

`pnpm playground` starts the React and Svelte runners (one demo each, by `?slug=&props=`),
which `pnpm parity` compares; it starts them itself when they are not running. Dev servers run
through [portless](https://portless.sh), so they get named `*.baby-ui.localhost` URLs;
`pnpm dev:list` and `pnpm dev:stop` show and clean them up.

## Layout

- `components/<slug>/`: one folder per component. `component.ts` is the spec, `index.md` the
  docs, `variants.ts` and any other framework-free `.ts` the code both ports import, `react/` and
  `svelte/` the ports, `examples/` the copy-ready examples. Shared helpers are `components/lib/`.
- A spec states what code can't: props, guidance, a11y, motion. `pnpm gen` derives each port's
  files, npm and registry dependencies from its imports, and `variantsOf(tv, axes)` reads the
  variant options from the `tv()`. List `files`/`dependencies`/`registryDependencies` only for
  extras the imports don't show (a peer, a version pin, a component the usage composes with).
- `packages/ui-react`, `packages/ui-svelte`: generated facades re-exporting `components/`.
- `packages/registry-schema`: the spec schema and `defineComponent`.
- `packages/demos`: demos and usage snippets for both ports.
- `packages/registry-build`: turns specs and sources into the shadcn registry JSON.
- `apps/site`: the docs site (SvelteKit). `apps/registry` serves the JSON.

## Adding a component

```bash
pnpm component create my-component --category=base
```

Scaffolds both ports, the spec and a docs page. Edit sources only: indexes, shared copies,
auto demos and usage are generated and gitignored.

## The dev loop

`pnpm dev` runs two watchers beside Vite, so adding or removing a component needs no restart:

- `gen:watch` regenerates indexes, shared copies and demos, and reloads itself when the
  generator's own code changes.
- `registry:watch` rebuilds the registry JSON the site's Code tab reads.

A generator error is logged and retried on the next save; the dev server keeps running. Each
process logs its memory when it moves by 10%, and every registry rebuild prints its peak.

## Checks

| Command | Does |
| --- | --- |
| `pnpm fix` | Strips `.js` from relative imports, runs `biome check --write`, then the comment gate |
| `pnpm lint` | The same checks, read-only, as CI runs them |
| `pnpm test` | Script tests, chart core, registry-build |
| `pnpm check` | Type-checks every package |
| `pnpm build` | Site and registry build |
| `pnpm verify:quick` | Generated files, Biome, comments, import extensions (seconds) |
| `pnpm verify` | Quick set + tests + every package's type check + Pro check, one at a time |
| `pnpm verify:full` | Everything CI and Deploy run, plus a browser sweep of every component page |
| `pnpm probe <slug ...>` | Opens component pages headless: no console errors, demo renders in its frame, no sideways scroll |
| `pnpm probe <slug> --dials` | Also operates every select and switch control and flags any that change nothing |
| `pnpm parity <slug ...>` (or `--all`) | Renders the demo in both runners and compares parts, ARIA, styles, sizes and console errors, at rest and after opening the first trigger; errors in `scripts/parity/baseline.json` are known |
| `pnpm component check <slug>` | One component's gates: spec validates, lint, comments, generated files, design-system source rules, parity. `--design` adds the page audit and premium score against the running site (or `--url=`); `--types` adds the package type checks |

`pnpm verify` runs in stages (gates, then tests and type checks, then build, then build checks);
steps inside a stage run in parallel, as many as free cores and memory allow (`--jobs=N` to
override). It stops at the first failure and prints the command to re-run that step alone;
`--keep-going` runs everything, `--verbose` shows passing steps' output too. `pnpm probe` checks the last `pnpm build` by default; pass
`--url=http://site.baby-ui.localhost` to check the running dev server instead, `--all` for every
page, `--width=390` for phone layout, `--dark` for dark mode. It needs Edge, Chrome or Chromium
installed (set `PROBE_BROWSER` to its path if it is somewhere unusual).

## Git hooks

Lefthook installs them on `pnpm install` (or run `pnpm exec lefthook install`):

- **pre-commit** fixes import extensions and Biome issues in staged files and re-stages them,
  runs the comment gate, and fails if generated files are stale (`pnpm gen` fixes that).
- **pre-push** runs `pnpm verify`: the CI type checks and tests, so a push never fails CI for
  something a laptop could have caught.

The comment gate can only block, since shortening a comment needs a person. Don't bypass the
hooks with `--no-verify`; fix what they report.

## Conventions

The house rules (shadcn API, Base UI and bits-ui primitives, motion contract, comment limits)
are in [`.agents/rules.md`](.agents/rules.md); the look-and-motion contract is
[`DESIGN.md`](DESIGN.md). React and Svelte change together in the same pull request.

## Pull requests

Branch from `main`, keep one change per PR, and make sure CI is green. Deployment is described
in [`DEPLOYMENT.md`](DEPLOYMENT.md).
