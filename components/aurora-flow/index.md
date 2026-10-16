---
title: Aurora Flow
description: Silk light drifting through a WebGL field, as layered veils or three sheened ribbons, coloured from theme tokens.
component: aurora-flow
category: backgrounds
tags: [background, aurora, silk, ribbons, webgl, shader]
---

`veil` warps several octaves of value noise into three veils and a folded sheen, then adds a drifting light and a vignette. `silk` lays three soft ribbons with a pearlescent sheen that lifts toward the pointer. Every tone has a reading for both, and colours come from theme tokens; light themes render in inverted space so glows read as ink instead of washing out.

The root fills its nearest positioned parent (or the viewport with `position="fixed"`) and renders `children` above the effect. The loop pauses off screen and in hidden tabs, reduced motion draws one still frame, and browsers without WebGL get a token gradient.
