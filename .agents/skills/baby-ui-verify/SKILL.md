---
name: baby-ui-verify
description: Run every baby-ui gate and the headless-browser checks before reporting work as done. Use after any change to packages/ui-*, packages/demos, packages/registry-*, packages/tokens, pro/ or apps/site.
metadata:
  internal: true
---

# baby-ui verify

Report nothing as done until every step below has run and its output is in the reply.

## 1. Static gates

```bash
pnpm fix              # format + autofixes
pnpm verify           # what CI runs: generated files, biome ci, gates, tests, every type check
```

Comment gate flags a long comment: cut words, never reflow onto one line.

## 2. Build

```bash
pnpm verify:full      # verify + build + worker size + Pro hidden + browser sweep of every page
```

`@baby-ui/site#build` failing with `EBUSY ... .svelte-kit/cloudflare` means `pnpm dev` is
running in apps/site. Prerendered output in `.svelte-kit/output` is still complete; say
so in the report instead of killing the user's processes.

## 2b. Consumer install (each new or changed component)

The cases in `.agents/rules.md` "Consumer installs". Static part, always:

```bash
pnpm --filter @baby-ui/registry-build test   # emitted imports, barrels, theme utilities
npx biome lint <changed ui-react folders>    # with the react domain on, as consumers have it
```

Real install, once per batch (procedure in the `isolated-registry-install-tests` memory: build
with `BABY_UI_REGISTRY_OUT` + a localhost URL into a temp dir, serve it, never write localhost
into `apps/site/static`):

- Fresh Vite + React 19 + Tailwind v4 app with only `@import "tailwindcss"` and no `shadcn init`.
- `npx shadcn add @baby-ui/theme @baby-ui/<slug>` (and its registry dependencies' blocks).
- `tsc --noEmit` clean with no hand edits; Biome `recommended` clean on `src/components`.
- Open it: surfaces have their colour (popover, primary fill), focus rings show.
- Same for Svelte with `shadcn-svelte add` and `svelte-check`.
- Stop the server and delete the temp app afterwards.

## 3. Runtime checks (headless Edge, no browser download)

Repo scripts, no scratchpad copies (they serve the last build unless `--url` is given):

- `pnpm probe <slug ...>` (or `--all`): page 200, no page or console errors, demo renders, no
  demo overflowing its frame, no horizontal page scroll. Add `--width=390` and `--dark`.
- `pnpm probe <slug ...> --dials`: every select and switch changes the demo DOM, or is a known
  interaction-only prop.
- Motion timelines (exits mirror entrances) still need a one-off probe built on
  `scripts/probe/browser.mjs`; keep any reusable one in `scripts/probe/`.

## 4. Design and premium audit (skills/baby-ui-design, skills/baby-ui-premium)

```bash
node skills/baby-ui-design/scripts/scan-source.mjs <changed ui-react/ui-svelte/pro folders>
pnpm design:audit <slug ...> --url=http://localhost:<dev port>     # light, dark, 390px
pnpm design:premium <slug ...> --url=http://localhost:<dev port>   # new or reworked components
```

- Blockers fail the report.
- A premium Block on a new or reworked component fails it too.
- Score purpose, UX laws and cohesion by hand with `--manual` and evidence.
- No screenshots: measurements only. The owner reviews visuals.

## 5. Report

Lead with what changed and what was measured. List the gate outputs. Note anything skipped
and why. Nothing is committed.
