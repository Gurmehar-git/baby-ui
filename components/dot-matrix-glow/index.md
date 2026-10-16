---
title: Dot Matrix Glow
description: A hero dot grid that brightens and swells around the pointer and ripples outward on press.
component: dot-matrix-glow
category: backgrounds
tags: [background, dot grid, hero, cursor, glow, ripple, canvas]
---

Put it behind a hero or a pricing header. Dots inside `glowRadius` ease up to the tone colour and swell, and a press sends a ring of light outward, even through `children`.

The frame loop runs only while some dot is still changing, so a settled grid costs nothing. `ambient` adds a slow shimmer that keeps it running while visible; leave it off on pages that already move.

Pick density with `size`, or pass `gap` and `dotSize` directly. Reduced motion drops ripples and shimmer and lights dots without easing.
