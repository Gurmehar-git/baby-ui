---
title: Projection Line
description: "Dashed forecast from the last point to a horizon; the chart widens its axes to fit it."
component: projection-line
category: charts
tags: [forecast, projection, trend]
---

Render `<ProjectionLine data>` inside a time-series chart. It registers its extent, so
the x-axis stretches to the horizon and the y-domain includes the forecast.

`buildProjection` makes the two points from your series: by default a linear regression
over the history, or `method: "lastSegment"` to follow the final step, or
`mode: "target"` with a `target` value to aim for a number.
