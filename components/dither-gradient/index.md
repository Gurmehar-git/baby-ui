---
title: Dither Gradient
description: A full-bleed token-coloured gradient drawn with ordered Bayer dithering on a canvas.
component: dither-gradient
category: backgrounds
tags: [background, gradient, dither, canvas]
---

Each cell picks one of two neighbouring ramp colours against a Bayer threshold, so the gradient is drawn with a handful of flat token colours. It renders at cell resolution (`pixelSize`) and scales up unsmoothed.

The loop pauses offscreen, in a hidden tab and at `speed` 0; reduced motion draws one still frame. Ramp colours resample on theme change.
