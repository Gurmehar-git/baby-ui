---
title: Scatter Chart
description: "Time series as markers with a shape per series, revealed left to right and picked by true nearest point."
component: scatter-chart
category: charts
tags: [scatter, chart, points, markers]
---

Needs `chart`. Each `<Scatter dataKey>` registers a series and takes the next shape in
circle, square, diamond, triangle order, so series stay distinguishable without colour.
A series keeps its shape when others are hidden in the legend.

The pointer picks the closest marker in both directions, not just the nearest date, and
the tooltip shows that series. Arrow keys walk whole rows instead.
