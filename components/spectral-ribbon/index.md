---
title: Spectral Ribbon
description: A soft light trail with a prismatic fringe, drawn in WebGL from theme tokens.
component: spectral-ribbon
category: backgrounds
tags: [background, ribbon, prism, webgl]
---

A curved trail is sampled as 56 segments per pixel; distance to it drives a bright core, a body, a bloom and a wide haze. The fringe runs through five token colours from the warm belly to the cool rim, and square or portrait frames zoom out to keep the arc in view.

The root fills its nearest positioned parent (or the viewport with `position="fixed"`) and renders `children` above the effect. The loop pauses off screen and in hidden tabs, reduced motion draws one still frame, and browsers without WebGL get a token gradient.
