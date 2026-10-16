---
title: Funnel Chart
description: "Stage-by-stage drop-off as layered bands that grow in turn and swell around the stage under the pointer."
component: funnel-chart
category: charts
tags: [funnel, conversion, drop-off, stages]
---

Needs `chart`. Stages step down the `--chart-scale-*` ramp in order, stopping short of the
lightest step so the last stage still reads against the page. Every band prints its value,
share of the first stage and name; `displayValue` replaces the formatted number.
`pattern` lays lines, dots or a grid over each stage's solid ring.

Percentages use the container's `locale`, and the hidden table adds each stage's share of
the one before it.
