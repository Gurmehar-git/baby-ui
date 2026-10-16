---
title: Notched Shelf
description: A bar that hangs from or rises into an edge on two curved wings, for tabs, navbars and back-to-top notches.
component: notched-shelf
category: blocks
tags: [notch, shelf, tab, navbar, footer]
---

The bar and both wings paint in `currentColor`, so one text colour class themes the whole
silhouette. A hairline traces the wing curve, so the shape still reads where the fill
matches the surface behind it. Mega Navbar's `notched` variant and Footer's `notched`
layout are built on it.

## Variants

- `solid`: fills with the page background, for a shelf cut into a card or footer.
- `muted`: fills with the card colour, for a shelf hanging over the page background.
- `inverse`: a foreground-coloured tab with background-coloured content.
- `outline`: no fill, only the hairline silhouette and the bar's bottom rule.

`fill` and `stroke` take a colour class when the surface is something else:

```svelte
<NotchedShelf size="lg" fill="text-card">
	<nav>…</nav>
</NotchedShelf>
```

## Layout, size and shape

- `layout`: `hanging` drops from a top edge; `rising` grows up from a bottom edge.
- `size`: `sm`, `md` and `lg` set the bar height. The wings keep their aspect, so they get
  deeper and wider with it.
- `shape`: `smooth` is Recast's eased shoulder, `soft` a plain S-curve, `sharp` a
  straight chamfer.
- `align` places the shelf at the start, centre or end of the edge; `edge` instead
  continues the hairline across the full width, so there is nothing to align.

```svelte
<NotchedShelf variant="outline" layout="rising" shape="sharp" edge>
	<span>Scroll for more</span>
</NotchedShelf>
```
