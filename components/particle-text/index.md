---
title: Particle Text
description: Text drawn as canvas particles that scatter from the pointer and spring back into place.
component: particle-text
category: text
tags: [particles, canvas, text, cursor]
---

The text is rasterised once at the device pixel ratio and turned into a grid of particles, each
with a home position. Near the pointer they are pushed away; everywhere else a spring pulls them
home. The frame loop only runs while something is moving, so a settled heading costs nothing.

Particles take the element's own text colour and resample when the container resizes, the font
finishes loading or the theme changes.
