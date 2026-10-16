---
title: Bento Grid
description: Asymmetric feature grid where each cell declares its own span and collapses to a single column on small screens.
component: bento-grid
category: blocks
tags: [bento, grid, layout]
---

Each cell declares how much room it wants with `span`, and the grid does the rest. Row
height is fixed rather than content-driven, so cells align to a shared baseline instead
of drifting as copy changes length.

## Spans stop at the breakpoint

Below `md` every cell is one column wide regardless of its `span`. A `2x2` cell on a
phone would either force a horizontal scroll or crush its neighbours, and neither is
worth the layout it was trying to preserve.

## Composition

`BentoCell` takes an optional `title` and `description` and renders whatever you pass
as children underneath. Cells carry no list semantics; if a cell is a link, put the link
inside it and the accessible name comes from your content, not from the grid.
