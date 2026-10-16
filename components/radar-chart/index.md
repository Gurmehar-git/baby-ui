---
title: Radar Chart
description: "Series compared across metrics as polygons that grow out from the centre."
component: radar-chart
category: charts
tags: [radar, spider, chart, comparison]
---

Needs `chart`. Compose the parts you want inside `RadarChart`: `RadarGrid`, `RadarAxis`,
`RadarLabels`, one `RadarArea` per series and `RadarTooltip`. Parts render in the order you
write them.

The outer ring defaults to a nice ceiling over the data; pass `max` when every series shares
a fixed scale, such as ratings out of 100.

Each series gets its own stroke dash and marker shape as well as its colour, so series stay
apart in print and for colour-blind readers.
