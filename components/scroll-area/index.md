---
title: Scroll Area
description: Scroll container with edge fades that appear only when there is more to see.
component: scroll-area
category: base
tags: [scroll, area]
---

Native scrolling. Not a JavaScript reimplementation, so keyboard scrolling, momentum,
trackpad overscroll and screen-reader virtual cursors all keep working for free.

## The scrollbar is thinned, not hidden

Hiding it is the popular choice and it removes the only affordance a mouse user has for
knowing the region scrolls. `scrollbar-width: thin` keeps the signal and loses the bulk.

The top and bottom fades only appear when content is genuinely clipped in that direction,
so a list that happens to fit has no false edge.
