---
title: Pie Chart
description: "Pie or donut that sweeps in slice by slice and pops the slice under the pointer."
component: pie-chart
category: charts
tags: [pie, donut, chart, share]
---

Needs `chart` and `counter`. Name each row with a `config` key so its label, colour and
legend toggle line up; rows without a config entry take `--chart-1` to `--chart-5` by
position.

Hiding a slice from the legend replays the sweep with what is left, and the donut's centre
counts to the new total. Slice labels print each share, so the split reads without colour.
