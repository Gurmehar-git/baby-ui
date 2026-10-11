# baby-ui: field report from docvia

Written while evaluating baby-ui to replace the hand-built components on docvia's site
(`apps/web`: SvelteKit 3, Tailwind v4, a settled violet-on-`#16171D` palette). The swap was
rejected. Every finding below was checked against the published Svelte registry
(`https://baby-ui.pages.dev/svelte/r/*.json`, fetched 2026-10-05) and against
`packages/tokens/src/tokens.css`.

Severity: **P0** breaks a consumer's app on install. **P1** forces a workaround. **P2** DX.

The core problem: shadcn's contract is "components read semantic tokens, the app owns their
values". baby-ui adds components that rewrite the app's semantic tokens. Installing one
button should add tokens, never redefine existing ones.

---

## P0: installing any component rewrites the host's theme

### 1. `--primary` is re-pointed at `--accent`, inverting shadcn's token roles

`tokens.json` (a `registryDependency` of button, badge, card, accordion and the rest) ships a
`css` block, from `packages/tokens/src/tokens.css:134-158`:

```css
:root,
.dark {
	--primary: var(--accent);
	--primary-foreground: var(--accent-fg);
	--accent-foreground: var(--accent-fg);
	--secondary: var(--muted);
	--destructive: var(--danger);
	--input: var(--border);
	--accent-ink: var(--accent);
	--ring: var(--accent-ink);
	--card-foreground: var(--foreground);
	--popover-foreground: var(--foreground);
}
```

In shadcn, `--primary` is the brand fill and `--accent` is the subtle hover surface
(near-white in light mode). baby-ui treats `--accent` as the brand colour and derives
`--primary` from it. In any existing shadcn app:

- `--primary` becomes the pale hover gray, so every primary button, badge and link loses
  its brand colour.
- `--ring` follows `--accent`, so focus rings go pale and fail contrast.
- Every existing `hover:bg-accent` (shadcn's ghost/outline buttons, menu items, command
  rows) keeps `--accent`, while `--accent-foreground` is overwritten with `--accent-fg`
  (white in light mode), so hover text turns white on gray.
- `--secondary`, `--destructive`, `--input`, `--card-foreground` and `--popover-foreground`
  are clobbered with aliases to names the host may not define (`--danger`, `--muted` used as a
  fill).

The block sits in `css`, not `cssVars`, so it bypasses the CLI's theme merge. It also
overrides the host's own `.dark` values, because it is scoped to `:root, .dark`.

### 2. The alias ships without the value it points at

The published `tokens.json` defines `--accent-fg` but not `--accent` (the light and dark values
exist only at `tokens.css:18` and `:90`). So `--primary: var(--accent)` resolves to whatever the
host's `--accent` is. In a stock shadcn theme that is the hover gray. A consumer cannot get
baby-ui's intended look and keep their own, because the result depends on a variable baby-ui
neither owns nor documents.

### 3. Tailwind defaults are overridden globally

`cssVars.theme` re-points framework-level theme keys, not only baby-ui's own:

- `ease-out`, `ease-in-out`, `default-transition-timing-function` become
  `cubic-bezier(0.16, 1, 0.3, 1)`, which changes every `ease-out` and every `transition`
  utility in the host app.
- `default-transition-duration` becomes `150ms` via `--duration-fast`.
- The type scale is redefined: `text-xs` through `text-6xl` with line heights and letter
  spacing.
- `@layer base` sets `cursor: pointer` on every button, summary, label and range input.

None of these is needed to render a button. All of them change pages that never use a
baby-ui component.

---

## P1: forced workarounds

### 4. Hover states bypass `--accent` entirely

Components hard-code their hover fills instead of using the semantic token:

```
button   ghost/outline: hover:bg-foreground/[0.06] hover:text-foreground
accordion trigger:      hover:bg-foreground/[0.03]
```

shadcn routes these through `hover:bg-accent hover:text-accent-foreground`, so an app's theme
decides them. Here a theme cannot restyle the hover state without forking the component. The
tokens file even defines `--default` / `--default-hover` for this role, but the components
don't use them.

### 5. Naming drifts from the shadcn convention

`--accent-fg` (shadcn uses `-foreground`), `--danger` beside `--destructive`, `--accent-ink`,
`--primary-hover`, `--surface`, `--overlay`, `--default`. Each is reasonable alone. Together
they create a second vocabulary that maps onto shadcn's in neither direction, which is why
item 1 needs aliases at all.

### 6. The accordion drags in a SvelteKit 2 peer

`accordion.json` depends on `bits-ui`, whose dependency `runed@0.37.1` (latest) declares
`@sveltejs/kit: ^2.21.0`. On SvelteKit 3 that is an unmet peer warning on every install. docvia
removed bits-ui for exactly this reason and kept a 50-line hand-written accordion.

---

## P2: DX

7. **One button pulls 67 light, 28 dark and 52 theme variables.** That includes chart scales,
   glass, gradients and OG shadows. Split `tokens.json` into a core layer (the variables a
   component actually reads) and opt-in layers (motion, charts, surfaces), and list the core
   variables per component in its registry item.
8. **No way to install components against an existing theme.** There's no "bring your own
   tokens" mode and no documented table of "which baby-ui variable maps to which shadcn
   variable".
9. **The registry has no index.** `.../svelte/r/index.json` is a 404; only the 330 KB
   `registry.json` exists, so tooling has to download everything to find one item.

---

## What would make it shadcn-compatible

- **Additive tokens only.** Ship new variables (`--duration-*`, `--ease-*`, `--press-scale*`,
  `--success*`, `--warning*`, `--info*`) under `cssVars`, and never redefine `--primary`,
  `--secondary`, `--accent`, `--accent-foreground`, `--ring`, `--input`, `--destructive`,
  `--card-foreground` or `--popover-foreground`.
- **Keep shadcn's roles.** `--primary` is the brand. `--accent` is the hover surface. If
  baby-ui wants a brand variable, read `--primary` and derive `--primary-hover` from it,
  which is the one alias that is genuinely additive.
- **Prefix framework overrides.** Use `ease-baby-out` and `--baby-text-*` (or ship them as an
  opt-in preset) instead of overriding Tailwind's `ease-out`, transition defaults and type
  scale.
- **Route hovers through tokens.** Use `hover:bg-accent hover:text-accent-foreground` (or
  `--default-hover`) instead of `foreground/[0.06]`.
- **Install test.** In CI, add one component to a stock `shadcn-svelte init` app and to a
  stock shadcn React app, then assert the computed `--primary`, `--accent` and `--ring` and a
  screenshot of an untouched page are unchanged.

docvia would adopt baby-ui the day installing a button leaves the rest of the app as it was.
