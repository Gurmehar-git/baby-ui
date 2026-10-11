---
title: Installation
description: Add Baby UI components to a React or Svelte project with the shadcn CLI.
---

Baby UI installs with the shadcn CLI into any project that has Tailwind CSS v4. Already on
shadcn/ui or shadcn-svelte? Skip to step 2.

## 1. Set up shadcn

New project? Create it with Next.js, Vite or SvelteKit first; shadcn's
[React](https://ui.shadcn.com/docs/installation) and
[Svelte](https://shadcn-svelte.com/docs/installation) guides cover Tailwind and the `@` alias.
Then:

```bash
# tab: React
# pm: dlx shadcn@latest init
```

```bash
# tab: Svelte
# pm: dlx shadcn-svelte@latest init
```

Any style, preset and base colour works; components read the same variables.

## 2. Add a component

```bash
# tab: React
# pm: dlx shadcn@latest add https://baby-ui.pages.dev/r/button.json
```

```bash
# tab: Svelte
# pm: dlx shadcn-svelte@latest add https://baby-ui.pages.dev/svelte/r/button.json
```

Every component page has this command ready, plus a Manual tab for copying by hand.

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

To match this site's look, see [Theming](/docs/theming).

## Registry

React can use a namespace instead of full URLs (`shadcn-svelte` can't yet). In
`components.json`:

```json
{
	"registries": {
		"@baby-ui": "https://baby-ui.pages.dev/r/{name}.json"
	}
}
```

Then `npx shadcn@latest add @baby-ui/button`. Every item, `tokens`, `theme`, the
`registry.json` index and a light `index.json` are on all four routes:

| Framework | TypeScript | JavaScript |
| --- | --- | --- |
| React | `/r/{slug}.json` | `/r/js/{slug}.json` |
| Svelte | `/svelte/r/{slug}.json` | `/svelte/r/js/{slug}.json` |

## Troubleshooting

- **"Could not find valid path aliases"**: the project has no `@` alias. In Vite, add it to
  `vite.config.ts` and to `paths` in `tsconfig.json` and `tsconfig.app.json`; leave out
  `baseUrl`, which TypeScript 6 rejects.
- **Svelte imports use `$lib` on SvelteKit 3**: installed files import through the aliases in
  `components.json`. SvelteKit 3 removed `$lib`, so set them to `#lib` (`"lib": "#lib"`,
  `"ui": "#lib/components/ui"` and so on); SvelteKit 2 projects keep `$lib`.
- **`@/components/ui/button` imports the wrong Button**: `init` left shadcn's
  `components/ui/button.tsx`, which shadows the folder. Delete it.
- **Grey, unstyled controls**: `tokens` is missing; add `tokens.json` with the same command.
- **Nothing animates**: reduced motion is on in your OS, which keeps fades and drops travel.
