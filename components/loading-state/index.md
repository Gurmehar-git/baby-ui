---
title: Loading State
description: "Pixel-grid wavefront loader with a shimmering label and a live elapsed timer."
component: loading-state
category: agents
tags: [loading, loader, spinner, progress, agent]
---

A 3x3 pixel grid with a wavefront animation, paired with a shimmering status label and a
live elapsed timer in tabular monospace figures.

## Variants

- `drive` / `dots` sweep a chevron wavefront across the grid: square cells for `drive`,
  round for `dots`.
- `orbit` laps a comet around the grid's perimeter instead of sweeping through it.
- `surfer` is `drive` plus a looping video card underneath, for a "look away while this
  runs" long task. Pass `videoSrc`; without one it falls back to a "Video unavailable"
  placeholder rather than a broken player.

## Motion

Every cell shares one `pixel-on` keyframe; the wavefront comes entirely from staggering
each cell's `animation-delay`, not per-cell state. Reduced motion freezes the grid to its
dim resting state and stops the label shimmer; the elapsed timer keeps ticking, since
that's the real status information.
