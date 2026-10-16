---
title: Animated Gradient
description: A full-bleed background of soft token-coloured blobs drifting on a CSS-only loop.
component: animated-gradient
category: backgrounds
tags: [background, gradient, mesh, css]
---

Two oversized layers of radial blobs drift, rotate and scale against each other on CSS keyframes. Only `transform` animates, so the loop stays on the compositor and costs no script.

The root fills its nearest positioned parent (`position="fixed"` fills the viewport) and renders `children` above the blobs. Colours are theme tokens, so a theme switch recolours it for free. Reduced motion holds the blobs still.
