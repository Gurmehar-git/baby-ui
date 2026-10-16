---
title: Chart Brush
description: "Overview strip under a time-series chart; drag, resize or key the window the chart shows."
component: chart-brush
category: charts
tags: [brush, range, zoom, overview]
---

Place `<ChartBrush>` after the chart inside the same `ChartContainer`, and feed its
`range` to the chart's `xDomain`. The chart then plots, walks and tabulates only that
window, and retweens its y-domain as the window moves.

Drag the window to slide it, drag an edge to resize, or drag outside it to draw a new
one. The strip is a single slider: arrows slide, shift with an arrow resizes, Page Up
and Page Down move a whole span.

Use `margin` to match the chart's left and right margins if you changed them, so the
strip sits under the plot.
