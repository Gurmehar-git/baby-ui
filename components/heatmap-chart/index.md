---
title: Heatmap Chart
description: "Calendar heatmap of daily values in five levels, with a legend that isolates a level."
component: heatmap-chart
category: charts
tags: [heatmap, calendar, activity]
---

Needs `chart`. Every day between the first and last row is drawn; days without a row
count as 0. Levels split the max into quarters unless `thresholds` pins the cut points.

`HeatmapLegend` is a separate part: hovering or focusing a level dims the other days, and
clicking pins it. Turn on `patterns` so the levels still read without colour.

Pass the same `locale` as `ChartContainer` for month, weekday and date labels.
