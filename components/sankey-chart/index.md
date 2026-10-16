---
title: Sankey Chart
description: "Flows between stages, drawn link by link, with every path through a node lit on hover."
component: sankey-chart
category: charts
tags: [sankey, flow, journey]
---

Needs `chart`. Links point at nodes by index; layout comes from d3-sankey, so node order
within a column follows the flows, not your array.

Node colours take `--chart-1` to `--chart-5` by position; pass `color` on a node to pin one.
Pass `text` to translate the tooltip and table copy.
