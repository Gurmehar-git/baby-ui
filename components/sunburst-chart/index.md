---
title: Sunburst Chart
description: "Hierarchy as nested rings that sweep in, drill down on click or Enter, and grow along the hovered path."
component: sunburst-chart
category: charts
tags: [sunburst, hierarchy, tree, drill down]
---

Needs `chart`. Name each top-level branch with a `config` key so its colour and legend
toggle line up; its whole subtree takes that colour, stepping down in opacity per ring.
Unconfigured branches take `--chart-1` to `--chart-5` by position.

Click an arc with children, or press Enter on it, to zoom in. The centre, Backspace and the
breadcrumb all zoom back out. `focus` is the zoomed node's path joined by ` / `, so you can
drive it from a URL or your own controls.

Arcs grow in from 90% scale rather than zero, per the motion contract.
