---
title: Area Chart
description: "Filled time series that reveal, stack and morph fill and stroke together."
component: area-chart
category: charts
tags: [area, chart, stacked, time series]
---

Needs `chart`, `chart-series` and `line-chart` (for curves). `<AreaChart stacked>` piles
areas in render order and grows the y-domain to the tallest total; hiding one in the
legend restacks the rest and retweens the axis.

## Beyond colour

`variant="pattern"` hatches the fill, so stacked series stay apart for readers who can't
separate the hues. Markers only draw on unstacked areas, since they mark raw values.
