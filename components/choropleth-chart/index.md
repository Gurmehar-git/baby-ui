---
title: Choropleth Chart
description: "Map that shades regions on a five-step scale, fades in, dims around the pointer and zooms."
component: choropleth-chart
category: charts
tags: [map, choropleth, geo, world]
---

Needs `chart` and `d3-geo`. Pass any GeoJSON `FeatureCollection` as `data` and a
`values` record keyed by a feature property (`keyProp`, default `name`). Nothing is
fetched at runtime: `world-atlas` with `topojson-client` is a common source.

## Scale

Values fall into five equal steps over their range, drawn with `--chart-scale-1` to
`--chart-scale-5`. Regions without a value use the muted fill and get their own
legend entry, so a missing number never reads as a low one.

## Zoom

`zoomable` turns on wheel, drag and pinch, plus zoom buttons. From the keyboard, `+`
and `-` zoom, `0` resets and shift with an arrow pans; plain arrows still walk regions.
Control it with `zoom` and `onZoomChange` (bindable in Svelte).
