---
title: Magnet Lines
description: A grid of short lines that turn to face the pointer.
component: magnet-lines
category: animated
tags: [pointer, grid, lines, cursor]
---

Each pointer move writes one angle variable per line and a CSS `rotate` transition does the easing. Lines take the shortest turn modulo 180 degrees, so a line never spins all the way around when the pointer crosses it.

`rows` and `columns` set the grid, `size` its footprint and line length, `tone` the colour token. `baseAngle` offsets every line; at `90` they point at the pointer instead of circling it. Reduced motion keeps every line at rest.
