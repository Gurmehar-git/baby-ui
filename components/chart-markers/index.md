---
title: Chart Markers
description: "Event markers above a time-series chart that spring in after the reveal and fan out when stacked."
component: chart-markers
category: charts
tags: [markers, events, annotations, timeline]
---

Render `<ChartMarkers items>` inside a time-series chart such as `LineChart`. Markers
on the same day stack under a count badge and fan out on hover, focus or click. Give
the chart a larger top margin (around 32) so the markers clear the plot.

A marker with `href` is a link and one with `onClick` (`onclick` in Svelte) is a
button. Markers with neither are labelled images, so nothing looks clickable that
isn't.

Pair `ChartMarkerTooltip` with `ChartTooltipContent` inside the tooltip `content` to
list the day's events next to its values.
