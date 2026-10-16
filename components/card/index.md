---
title: Card
description: Surface composed from header, title, description, action, content and footer parts.
component: card
category: base
tags: [card, surface, panel]
---

Seven parts, each a plain element that takes `class` and every other attribute:
`Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`
and `CardFooter`.

## Variants

`default` sits on the page colour with a border. `secondary` is the borderless grey card step,
for grouped or nested areas. `ghost` drops both fill and border, and `framed` wraps the body in
the same inset rim as Dialog.

## Drop-in for shadcn

The part names, the `data-slot` values and the class shape are shadcn/ui's. Adding
this over an existing `card` in a shadcn project replaces the file without touching a
single call site, and the `interactive` prop is the only thing that is ours.

That constraint is why the header is a grid rather than a flex row: `CardAction`
places itself in the second column through `has-data-[slot=card-action]`, so a card
with no action never pays for the column.

## The `framed` variant

`variant="framed"` wraps the card body in the same inset frame as Dialog and Command:
a thin `bg-background` rim around a `bg-card` surface, instead of a flat bordered box.
It adds one wrapping element, so it isn't a shadcn drop-in the way the default variant is.

## interactive is a promise

Setting `interactive` adds a hover lift. Only set it when the entire card is a link or
button. A card that lifts under the cursor and then does nothing when clicked is worse
than a card that never moved, because the hover state made a promise.

Put the real link inside the card and let it fill the surface. The hover style is
decoration on top of a real affordance, not a substitute for one.
