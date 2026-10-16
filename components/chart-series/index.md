---
title: Chart Series
description: "Series extras for line and area charts: loading pulse and sweep, hover highlight, markers, dashed tail."
component: chart-series
category: charts
tags: [chart, series, loading, markers]
---

Installed alongside `line-chart` and `area-chart`; you rarely render these parts yourself.
`Line` turns them on through props: `loadingStyle`, `showMarkers`, `terminalMarker`,
`dashFromIndex` and `showHighlight`.

## Loading

While the chart's `status` is `loading`, the first series draws a placeholder. It is a
seeded silhouette, never your data, and the plot's table and live region still carry the
real values once they arrive. When status flips to `ready` the pulse finishes from where
it is instead of cutting off.
