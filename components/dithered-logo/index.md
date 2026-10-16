---
title: Dithered Logo
description: A logo dithered into a dot grid in token colours; dots shy from the pointer and ripple on click.
component: dithered-logo
category: backgrounds
tags: [logo, dither, dots, canvas, cursor]
---

The image is rasterised at `gridSize`, softened by `blur` and dithered with serpentine Floyd-Steinberg error diffusion. `inverted` dots a rounded plate and knocks the logo out of it.

Dots inside the pointer radius ease away and back, and a click sends a ring outward. The loop stops once every dot settles, offscreen or in a hidden tab; reduced motion draws a static grid. Remote images need CORS headers.
