---
title: Stats Band
description: "Three or four headline numbers that count up once seen, each with an optional tiny visual: a trend, an uptime strip, a histogram or a dotted world."
component: stats-band
category: blocks
tags: [stats, numbers, metrics, kpi, marketing, band, section]
---

Composes `rolling-digits` and `sparkline`. Each stat takes a `value` and `label`, with
`prefix`, `suffix`, `decimals` and `notation: "compact"` (which counts inside its final unit,
so 0.0M rises to 2.3M rather than jumping from K to M).

`visual` adds proof under the number: `trend` values, `uptime` days as percentages, a
`distribution` histogram inked below its `marker`, or a `map` of [longitude, latitude] points.
A stat's `context` replaces its `detail` while hovered or focused.
