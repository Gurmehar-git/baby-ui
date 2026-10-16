---
title: Sheet
description: Panel that slides in from any edge, with focus moved inside and Escape to close.
component: sheet
category: base
tags: [sheet]
---

All four sides share one keyframe, with the starting transform set per side through a CSS
variable. Adding a fifth direction would be a variable, not another animation.

## Bottom on phones

`side="bottom"` is the right default on a handset: it is the part of the screen a thumb
reaches. Right is the right default on a desktop, where it does not cover the content you
are filtering.

It uses the drawer easing rather than the standard ease-out, because a large surface
travelling a long distance needs the slower settle to not feel thrown.
