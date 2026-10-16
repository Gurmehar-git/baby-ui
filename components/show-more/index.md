---
title: Show More
description: Clamps long content to a line count and offers an expander only when it overflows.
component: show-more
category: base
tags: [show, more]
---

The control only renders when the content actually exceeds `lines`, measured with a
`ResizeObserver`. A "Show more" that expands nothing is worse than no control.

## Why the veil matters

A hard cut at the clamp height reads as the end of the text. The gradient is the only
thing telling you there is more, and it is why this is a component rather than a
`line-clamp` utility.

## Lines, not pixels

The clamp is a line count because that is what the reader sees. A pixel height cuts
through the middle of a line at the wrong font size, and it changes meaning the moment
someone bumps their browser's text size.

The expanded height is capped by `maxHeight`. Past that the region scrolls instead of
growing, and it only becomes a focusable landmark once it actually does, so keyboard
users never tab into a box that cannot move.
