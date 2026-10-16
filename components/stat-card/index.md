---
title: Stat Card
description: "A KPI card whose headline, caption and trend follow the point under the chart."
component: stat-card
category: blocks
tags: [stat, kpi, metric, card, dashboard]
---

Composes `card`, `badge`, `counter` and the area or line chart. At rest it shows `value`,
`label` and `trend`; hovering or arrowing through the chart swaps in that row's value, its
month and its change from the previous row.

Pass `formatValue` for currency or units, and `locale` for the month and percent formats.

Set `positive="down"` for metrics where a fall is good news (churn, latency, cost); a 0%
change is always neutral. `comparisonLabel` finishes the sentence screen readers hear for
the badge, e.g. "Increased by 12.5% vs last month".

`status` covers the fetch lifecycle: `loading` skeletons the headline and badge, `empty`
and `error` replace the chart with a message, and `onRetry` adds a Retry button to the
error state. The headline only counts when `value` changes; hovering swaps it instantly.

`description` adds a context line under the headline. Set `chart="none"` for a figure-only
metric card: `data` becomes optional and the headline still counts on a new `value`.
