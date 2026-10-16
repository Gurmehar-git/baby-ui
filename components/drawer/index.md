---
title: Drawer
description: "Draggable sheet on vaul, with snap points, an inset surface and the same rim as Dialog."
component: drawer
category: base
tags: [drawer, sheet, bottom sheet, vaul]
---

Built on vaul (React) and vaul-svelte (Svelte), the same libraries shadcn and shadcn-svelte
use, so the drag physics, snap points and body lock are theirs. The surface is ours: a
`bg-background` rim with the body on a `bg-card` panel inside it, like Dialog.

## Drawer or Sheet

Drawer follows the pointer and can rest at snap points; Sheet is a plain slide with no
drag. Use Drawer for phone-first flows and anything a thumb should be able to dismiss.

## Snap points

```svelte
<Drawer snapPoints={[0.4, 0.9]}>
```

Fractions of the viewport, or lengths such as `"320px"`. The overlay fades in from the
last snap point unless `fadeFromIndex` says otherwise.

## Motion

vaul animates on `cubic-bezier(0.32, 0.72, 0, 1)` over 500ms, which is `--ease-drawer` and
`--duration-drawer`. Reduced motion drops the slide and keeps the fade.
