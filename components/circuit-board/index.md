---
title: Circuit Board
description: Nodes joined by right-angled SVG traces that draw in, then carry glowing pulses.
component: circuit-board
category: animated
tags: [circuit, svg, network, diagram]
---

Pass `nodes` with positions in board units and `connections` by node id. Each trace routes along the
longer axis first and jogs at the midpoint; the SVG scales to its container.

Traces carry `pathLength=100`, so draw-in and pulse dashes are exact on any route. All motion is CSS
keyframes on stroke-dashoffset, with no frame loop. Node `status` sets its colour; busy nodes breathe.
