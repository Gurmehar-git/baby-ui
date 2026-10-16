---
title: Bar Chart
description: "Categories as grouped or stacked bars, flat, as square cells or as glass blocks with depth."
component: bar-chart
category: charts
tags: [bar, column, chart, stacked, grouped]
---

Needs `chart`. Each `<Bar dataKey>` registers a series, so grouping, stacking, the value
domain, tooltip rows, summary and data table follow the bars you render. Hiding a series
in the legend collapses its bars to the baseline and the rest retween.

`BarXAxis` and `BarYAxis` swap roles with `orientation`: whichever runs along the
categories shows category labels, the other shows value ticks.

Render `BarTooltip` before the bars so its hover band sits behind them.

`variant="squares"` quantises each bar into square cells; `variant="depth"` adds side and
lid faces toward the chart centre, in either orientation and below zero, and pulses the
active bar from base to tip. Set `texture` on a `Bar` when colour alone must not carry the
series.
