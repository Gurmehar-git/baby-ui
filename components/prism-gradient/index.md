---
title: Prism Gradient
description: Swirled prism bands in a WebGL field, coloured from theme tokens.
component: prism-gradient
category: backgrounds
tags: [background, prism, webgl, shader]
---

The shader swirls the plane through sixteen cosine passes and bands it between `--background`, a `tone` token and `--foreground`, so light and dark themes invert the look without extra config. Colours resample when the theme changes.

The root fills its nearest positioned parent (or the viewport with `position="fixed"`) and renders `children` above the effect. The loop pauses off screen and in hidden tabs, reduced motion draws one still frame, and browsers without WebGL get a token gradient.
