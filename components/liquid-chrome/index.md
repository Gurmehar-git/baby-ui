---
title: Liquid Chrome
description: Domain-warped liquid metal with silver and specular bands, drawn in WebGL from theme tokens.
component: liquid-chrome
category: backgrounds
tags: [background, chrome, metal, webgl]
---

Two passes of domain warping bend a noise field into molten bands of shadow, base, silver and specular colour. The surface bulges away from the pointer, or from the centre when `interactive` is off.

The root fills its nearest positioned parent (or the viewport with `position="fixed"`) and renders `children` above the effect. The loop pauses off screen and in hidden tabs, reduced motion draws one still frame, and browsers without WebGL get a token gradient.
