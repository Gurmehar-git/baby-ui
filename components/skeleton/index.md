---
title: Skeleton
description: Loading placeholder that shimmers along the reading direction.
component: skeleton
category: base
tags: [skeleton, loading, placeholder]
---

The shimmer sweeps left to right over two seconds, matching reading direction. It
animates `background-position`, so it stays off the layout and paint path no matter how
many placeholders are on screen.

## Where the loading state belongs

Each skeleton is `aria-hidden`. Announcing "loading" once per placeholder turns a card
grid into forty announcements. Put `aria-busy` on the region being loaded instead, and
let the skeletons be purely visual.

Match the skeleton's dimensions to the content it replaces. A placeholder that is the
wrong size causes a layout shift the moment real content arrives, which is the one thing
a skeleton exists to prevent.
