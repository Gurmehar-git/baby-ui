---
title: Theming
description: CSS variables on :root, redefined under .dark. Components never name a colour.
---

Components read shadcn's variable names, so your existing theme already drives them.

## Use this site's look

The `theme` item brings this site's palette, radius and type stack:

```bash
# tab: React
# pm: dlx shadcn@latest add https://baby-ui.pages.dev/r/theme.json
```

```bash
# tab: Svelte
# pm: dlx shadcn-svelte@latest add https://baby-ui.pages.dev/svelte/r/theme.json
```

Or paste it over what `init` wrote, after `@import "tailwindcss"`:

```css
/* baby-ui:theme */
```

## Colours

```css
:root {
	--primary: oklch(58% 0.22 295);
	--primary-foreground: oklch(99% 0 0);
}
```

- `--primary` is the brand and `--accent` the neutral hover surface, as in shadcn. Hovers,
  highlighted menu rows and open triggers use `bg-accent`.
- The swatches in this site's Settings panel write `--primary`, `--primary-foreground` and
  `--ring`, nothing else.

## Bring your own theme

`tokens` only adds variables. It never redefines a shadcn variable or a Tailwind default, so
installing a component leaves the rest of your app as it was.

| Variable | Comes from | Notes |
| --- | --- | --- |
| `--background` … `--ring`, `--chart-1` … `--chart-5` | your theme | shadcn's set, read as is |
| `--success`, `--warning`, `--info` (+ `-foreground`, `-strong`) | `tokens` | status colours |
| `--destructive-strong`, `--destructive-foreground`, `--border-strong`, `--segment` | `tokens` | |
| `--primary-hover` | `tokens` | derived from your `--primary` |
| `--surface-shadow`, `--overlay-shadow`, `--field-shadow`, `--thumb-shadow` | `tokens` | |
| `--duration-*`, `--ease-ui-*`, `--ease-drawer`, `--ease-spring*` | `tokens` | motion |
| `--chart-scale-*`, `--chart-positive`, `--chart-negative` | `tokens-charts` | only with charts |
| `--glass-*`, `--gradient-*`, `--neon`, `--violet` | `tokens-effects` | only with effects |

Only `theme` (opt-in) changes your app: the palette, fonts, the type scale's letter spacing,
the default transition curve and `cursor: pointer` on buttons. Component CSS installs in
`@layer baby-ui`, so your own unlayered CSS overrides it.

## Dark mode

The `dark` class on `<html>`, as in shadcn, so `next-themes` and `mode-watcher` work unchanged.
Set `color-scheme` too, or native form controls stay light.

```js
document.documentElement.classList.toggle("dark", dark);
document.documentElement.style.colorScheme = dark ? "dark" : "light";
```

## Motion

Durations and easings are variables too. Reduced motion shortens them and removes travel;
fades stay.

```css
--duration-press: 140ms;
--duration-dropdown: 200ms;
--duration-overlay: 280ms;
--duration-exit: 120ms;
--ease-ui-out: cubic-bezier(0.16, 1, 0.3, 1);
```
