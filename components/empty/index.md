---
title: Empty
description: Empty state for lists, tables, search results and first runs.
component: empty
category: base
tags: [empty, empty state, blank slate, no results, zero state]
---

The same parts as shadcn/ui (Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription and
EmptyContent), so an existing empty state drops in unchanged.

## Variants

- `variant` frames it: `default` has no frame, `outline` is a dashed drop zone, `card` a surface.
- `layout="horizontal"` puts media and words on the left and actions on the right, for an empty
  table body or a slot inside a card.
- `size` scales padding, gaps and the title.
- `EmptyMedia variant="icon"` puts the icon on a tile, and `tone` colours it: `destructive` for a
  failed load, `success` for "all caught up", `primary` for a first-run invitation.

Error Boundary uses Empty for its default fallback.

`EmptyIllustration` is one drawing for four empty states (`search`, `offline`, `inbox`,
`map`). Change `scene` and every shape springs into the new picture; set `phase` to `loading`
or `done` as the work behind your action progresses, and the drawing resolves with it.
