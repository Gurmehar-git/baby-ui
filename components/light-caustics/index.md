---
title: Light Caustics
description: Rippling underwater caustic filaments over a tinted base, drawn in WebGL from theme tokens.
component: light-caustics
category: backgrounds
tags: [caustics, water, light, webgl]
---

Three crossing wave trains drift over each other; wherever their sum crosses zero the light focuses into a bright filament, and a second finer layer adds the smaller network. The base takes a faint tint of the first tone token.

The root fills its nearest positioned parent (or the viewport with `position="fixed"`) and renders `children` above the effect. It draws at most 30 frames a second on a low-power WebGL context, pauses off screen and in hidden tabs, draws one still frame under reduced motion, and falls back to a token gradient without WebGL.
