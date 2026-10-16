---
title: Line Chart
description: "Time series as lines that reveal, morph on new data and dim around the pointer."
component: line-chart
category: charts
tags: [line, chart, time series, trend]
---

Needs `chart`. Each `<Line dataKey>` registers its series, so the y-domain, tooltip rows,
summary and data table follow the lines you render. Hidden legend entries drop out of
the domain and the rest retween to fill the space.

Rows need a date under `xKey` (default `date`); a `Date`, ISO string or timestamp all work.

## Profit and loss

`<ProfitLossLine dataKey baseline>` splits one series where it crosses the baseline.
The positive side uses `--chart-positive`, the negative side `--chart-negative` plus a
dash (`encoding`), so the sides differ without relying on colour.
