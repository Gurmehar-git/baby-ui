---
title: Closing Plasma
description: A ridged simplex plasma in WebGL that follows the theme between dark and light.
component: closing-plasma
category: backgrounds
tags: [background, plasma, webgl, shader]
---

Five octaves of simplex noise feed a flow field and a ridge mask, mixed from the surface into a token hue. Dark themes get a darkening vignette and cool sparkles; light themes fade the edges back to the surface instead.

The root fills its nearest positioned parent (or the viewport with `position="fixed"`) and renders `children` above the effect. The loop pauses off screen and in hidden tabs, reduced motion draws one still frame, and browsers without WebGL get a token gradient.
