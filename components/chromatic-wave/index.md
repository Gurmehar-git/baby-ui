---
title: Chromatic Wave
description: Dozens of fine flowing contour lines with a chromatic gradient along them, drawn in WebGL.
component: chromatic-wave
category: backgrounds
tags: [lines, contour, wave, chromatic]
---

The shader draws the contour lines of a tilted ramp plus two slow waves, so dozens of fine strands flow in parallel and bunch where the waves steepen. Each strand is held near one pixel wide at any density, and its colour drifts through the three tone tokens.

The root fills its nearest positioned parent (or the viewport with `position="fixed"`) and renders `children` above the effect. It draws at most 30 frames a second on a low-power WebGL context, pauses off screen and in hidden tabs, draws one still frame under reduced motion, and falls back to a token gradient without WebGL.
