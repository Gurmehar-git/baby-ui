---
title: Installation
description: Add Baby UI components to a React or Svelte project with the Baby UI CLI.
---

Baby UI installs with [`@baby-ui/cli`](/docs/cli) into any project that has Tailwind CSS v4.
It reads the same `components.json` as shadcn and shadcn-svelte, so an existing shadcn
project needs no setup: skip to step 2.

## 1. Set up the project

New project? Create it with Next.js, Vite or SvelteKit first; shadcn's
[React](https://ui.shadcn.com/docs/installation) and
[Svelte](https://shadcn-svelte.com/docs/installation) guides cover Tailwind and the `@` alias.
Then:

```bash
# pm: dlx @baby-ui/cli init
```

`init` detects the framework, writes `components.json`, `utils` and the theme. On SvelteKit 3
it sets the aliases to `#lib`.

## 2. Add a component

```bash
# pm: dlx @baby-ui/cli add button
```

Bare names come from Baby UI. The framework and TypeScript or JavaScript come from
`components.json`, so the command is the same everywhere. Every component page has it ready,
plus a Manual tab for copying by hand.

## 3. Use it

```tsx
// tab: React
import { Button } from "@/components/ui/button";

export default function Page() {
	return <Button>Deploy</Button>;
}
```

```svelte
// tab: Svelte
<script lang="ts">
	import { Button } from "#lib/components/ui/button/index.js";
</script>

<Button>Deploy</Button>
```

## What `add` writes

- The component in its own folder with an `index` file, e.g. `components/ui/button/`, plus
  `lib/cn.ts`.
- Its npm packages and their `@types`, its CSS (in `@layer baby-ui`), and `tokens` the first
  time, plus `tokens-charts` or `tokens-effects` if it reads them.
  `tokens` only adds variables: your colours, fonts and Tailwind defaults are never touched.
- The folder follows the category: `ui`, `blocks`, `animated`, `text`, `backgrounds`,
  `agents`, `charts`, `og` or `emails`. Imports between items are rewritten to match.
- `.baby-ui/lock.json`, so `diff`, `update` and `undo` know what came from where. Commit it.

To match this site's look, see [Theming](/docs/theming).

## With the shadcn CLI

The files are the same either way; the stock CLIs take the item URL:

```bash
# tab: React
# pm: dlx shadcn@latest add https://baby-ui.pages.dev/r/button.json
```

```bash
# tab: Svelte
# pm: dlx shadcn-svelte@latest add https://baby-ui.pages.dev/svelte/r/button.json
```

`baby-ui init` also registers the `@baby-ui` namespace in `components.json`, so
`npx shadcn@latest add @baby-ui/button` works in React. Every item, `tokens`, `theme`, the
`registry.json` index and a light `index.json` are on all four routes:

| Framework | TypeScript | JavaScript |
| --- | --- | --- |
| React | `/r/{slug}.json` | `/r/js/{slug}.json` |
| Svelte | `/svelte/r/{slug}.json` | `/svelte/r/js/{slug}.json` |

Components added this way can join the lock later with `baby-ui repair --adopt`.

## Troubleshooting

- **"Could not find valid path aliases"**: the project has no `@` alias. In Vite, add it to
  `vite.config.ts` and to `paths` in `tsconfig.json` and `tsconfig.app.json`; leave out
  `baseUrl`, which TypeScript 6 rejects.
- **Svelte imports use `$lib` on SvelteKit 3**: installed files import through the aliases in
  `components.json`. SvelteKit 3 removed `$lib`, so set them to `#lib` (`"lib": "#lib"`,
  `"ui": "#lib/components/ui"` and so on); SvelteKit 2 projects keep `$lib`.
- **shadcn-svelte fails with "File '$app/tsconfig' not found"**: the stock CLI can't read
  SvelteKit 3's tsconfig yet. Use `@baby-ui/cli`, which can.
- **`@/components/ui/button` imports the wrong Button**: shadcn's `init` left
  `components/ui/button.tsx`, which shadows the folder. Delete it.
- **Grey, unstyled controls**: `tokens` is missing; run `baby-ui add tokens`.
- **Nothing animates**: reduced motion is on in your OS, which keeps fades and drops travel.
- **Something else looks off**: `baby-ui doctor` checks the config, stylesheet and every
  installed file.
