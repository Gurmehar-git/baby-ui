---
title: Gradient Hero 01
description: A centred hero with a pill, headline, copy and actions over a soft glow rising from the bottom edge.
component: gradient-hero-01
category: blocks
tags: [hero, landing, gradient, headline]
---

The glow is four stacked gradients mixed from theme tokens, so it follows light and dark mode
and any palette. `tone` picks chart colour 1, chart colours 1 to 3, or the primary colour.

`GradientHero01Content` holds the badge, title, description and `GradientHero01Actions`; give
the primary action `variant="default"` and the rest `outline`. Composes `badge` and `button`.

`GradientHero01Install` adds a copyable command pill under the actions and
`GradientHero01Meta` a row of small facts. Add `GradientHero01Media` (a product shot, a live
card) and the hero switches to a split layout with the copy beside it.
