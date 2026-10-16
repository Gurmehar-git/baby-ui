---
title: Sticky Scroll Cards
description: Photo cards that pin as they scroll in and shrink back into a tilted stack as later ones land.
component: sticky-scroll-cards
category: animated
tags: [scroll, sticky, stack, cards, photos]
---

Every card sticks to the top of the scroll box and later cards land on top. Each one scales down
from its own start point to the end of the stack, so the earliest cards end up smallest.

The scaling is a CSS view timeline with a per-card range, with a scroll-listener fallback for
browsers without scroll timelines. `size` gives it its own scroll box; `auto` follows the nearest
scrolling ancestor.
