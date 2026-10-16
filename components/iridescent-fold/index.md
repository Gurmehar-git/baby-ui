---
title: Iridescent Fold
description: "Holographic foil or satin: crumpled creases or long draped folds, a pastel thin-film sheen and specular streaks, drawn in WebGL."
component: iridescent-fold
category: backgrounds
tags: [iridescent, holographic, foil, satin, silk, webgl]
---

`variant="foil"` folds ridged noise into sharp creases over soft billows, like crumpled plastic foil, and lets a full rainbow glint off the brightest facets. `variant="silk"` drapes a twice-warped sine field into long folds with broad sheens and a fine sparkle in the lit weave. In both, the colour follows each fold's height and angle, so the tone splits across the surface the way thin film does. Faces turned away from the light sink toward `--background`, so in dark mode it reads as foil in low light.

`holo`, `pearl`, `opal` and `lavender` are pastel palettes sampled from real foil and satin; `spectrum`, `cool`, `warm` and `mono` draw from theme tokens instead. The root fills its nearest positioned parent (or the viewport with `position="fixed"`) and renders `children` above the effect. It draws at most 30 frames a second on a low-power WebGL context, pauses off screen and in hidden tabs, draws one still frame under reduced motion, and falls back to a gradient without WebGL.
