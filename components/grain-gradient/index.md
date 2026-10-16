---
title: Grain Gradient
description: A full-bleed glow and diffused shadow edge that breathe slowly under a static film grain.
component: grain-gradient
category: backgrounds
tags: [background, gradient, grain, noise]
---

A token-coloured glow and a curved shadow edge breathe out of phase on CSS keyframes inside a scene you can rotate with `angle`. The grain is one seamless `feTurbulence` tile, rendered once and repeated, never animated.

The root fills its nearest positioned parent and renders `children` above the effect. Reduced motion holds the composition still.
