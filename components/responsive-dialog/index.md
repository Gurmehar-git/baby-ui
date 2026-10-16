---
title: Responsive Dialog
description: "Dialog on desktop, Drawer on mobile, behind one prop API."
component: responsive-dialog
category: base
tags: [responsive, dialog, drawer, modal, sheet]
---

Renders Dialog above the `md` breakpoint (768px) and Drawer below it, switching live as the
viewport crosses it. Same markup, same parts (`Trigger`, `Content`, `Header`, `Footer`,
`Title`, `Description`, `Close`) either way: each part forwards to the real Dialog or
Drawer component underneath, so focus trapping, `aria-labelledby`/`aria-describedby` wiring
and motion all come from whichever surface is active.

## Desktop-only and mobile-only props

`size` and `dismissOnBackdrop` only affect the Dialog branch; `direction` and `dismissible`
only affect the Drawer branch. `variant` (`"default"` / `"framed"`) applies to both, since
Dialog and Drawer share the same two-variant frame treatment.

## Why not one primitive

Dialog is Base UI (React) / bits-ui (Svelte); Drawer is vaul / vaul-svelte. They're
different libraries with different gesture and focus models, so ResponsiveDialog composes
the two existing components rather than inventing a third primitive.
