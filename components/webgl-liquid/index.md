---
title: WebGL Liquid
description: A rising liquid field that fades up into the surface, drawn in WebGL from theme tokens.
component: webgl-liquid
category: backgrounds
tags: [background, liquid, fluid, webgl]
---

Three nested noise layers rise from the bottom edge and band from the surface colour into the mid and highlight tokens. The field is transparent above, so it settles into whatever surface sits behind it; with `reveal` it sweeps in from the left the first time it is on screen.

The root fills its nearest positioned parent (or the viewport with `position="fixed"`) and renders `children` above the effect. The loop pauses off screen and in hidden tabs, reduced motion draws one still frame, and browsers without WebGL get a token gradient.
