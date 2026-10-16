---
title: ASCII Effect
description: A full-bleed canvas that redraws an image as ASCII glyphs in the element's own font.
component: ascii-effect
category: backgrounds
tags: [background, ascii, image, canvas]
---

The image is sampled to one pixel per glyph cell, dithered onto the `chars` ramp and drawn in the root's font (`font-mono` by default). `src` must be same-origin or served with CORS.

`image` draws once, `flow` drifts and ripples under the pointer while visible, and `glitch` redraws only when a row tears or heals. On a light surface the mapping flips so bright areas read as empty paper. Reduced motion draws a still frame.
