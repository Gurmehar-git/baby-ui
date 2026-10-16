---
title: Composed Chart
description: "Bars, lines and areas on one time axis, sharing the domain, tooltip and legend."
component: composed-chart
category: charts
tags: [composed, combo, bar, line, area]
---

Needs `chart`, `chart-series`, `line-chart` and `area-chart`. `<SeriesBar>` groups side
by side by default; `stacked` on the chart piles them instead while lines and areas stay
unstacked.

Each bar runs its own growth, so the last one in the stagger lands in full rather than
snapping when the reveal ends.
