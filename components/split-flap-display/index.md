---
title: Split Flap Display
description: A departures-board display whose cells flip through the character drum to each new value.
component: split-flap-display
category: animated
tags: [split flap, solari, departures, board, flip]
---

Each cell is a tile with a hinge line and shaded halves. Per step the old glyph's top half falls on
`rotateX` and the new glyph's bottom half lands with a small settle, all CSS keyframes. Cells that
already match stay still; the rest start a stagger apart, so a change rolls across the board.

`value` is the whole board: a newline starts a row, and rows pad or cut to `columns`. Change it from
your own state; the display only animates toward it. Rows and columns open and close smoothly, and the
glyph size shrinks to fit the container, capped by `size`. Reduced motion shows the new value at once.
