---
title: Dispersion Rays
description: Spectral rays fanning from a light source through soft volumetric haze.
component: dispersion-rays
category: backgrounds
tags: [background, rays, light, dispersion, spectrum, webgl, hero]
---

Light falls in from above the top-left corner and fans across the section. Each colour channel reads the rays at a slightly shifted angle, so every beam edge splits into a spectral fringe, and slow haze drifts through the light.

`tone` picks the token colours, `intensity` fades the scene toward the base colour for busier layouts, and `grain` adds film grain.

Frames are capped at 30 per second on a low-power WebGL context and stop offscreen, in a hidden tab or when `speed` is 0. Reduced motion draws one still frame. Without WebGL a gradient in the same tokens shows instead.
