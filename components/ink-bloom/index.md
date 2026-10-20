---
title: Ink Bloom
description: Coloured ink diffusing and blooming through water, drawn from theme tokens.
component: ink-bloom
category: backgrounds
tags: [background, ink, water, bloom, fluid, watercolor, webgl, hero]
---

Two inks fold through still water. Domain-warped noise decides where each one blooms, so colours meet and part organically instead of cycling on a loop. It suits editorial, fashion and brand pages that want slow, quiet colour.

`tone` picks the two inks from theme tokens, `intensity` fades the scene toward the water colour for busier layouts, and `grain` adds film grain.

Frames are capped at 30 per second on a low-power WebGL context and stop offscreen, in a hidden tab or when `speed` is 0. Reduced motion draws one still frame. Without WebGL a gradient in the same tokens shows instead.
