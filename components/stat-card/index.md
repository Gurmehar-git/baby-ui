---
title: Stat Card
description: "A KPI card from parts whose headline, caption and trend follow the point under the chart."
component: stat-card
category: blocks
tags: [stat, kpi, metric, card, dashboard]
---

Built from parts you arrange: `StatCardHeader` holds the `StatCardTitle` and `StatCardTrend`
badge, and `StatCardContent` holds `StatCardValue`, `StatCardDescription` and `StatCardChart`.
`StatCard` owns the data: at rest the parts show `value`, `label` and `trend`; hovering or
arrowing through the chart swaps in that row's value, its month and its change from the
previous row.

Pass `formatValue` for currency or units, and `locale` for the month and percent formats.
`name` is what the metric is: the chart's accessible name and the start of the announcement
when the value changes.

Set `positive="down"` for metrics where a fall is good news (churn, latency, cost); a 0%
change is always neutral. `comparisonLabel` finishes the sentence screen readers hear for
the badge, e.g. "Increased by 12.5% vs last month".

`status` covers the fetch lifecycle: `loading` skeletons the value and trend, `empty` shows
`StatCardEmpty` and `error` shows `StatCardError` (put your own Retry button inside). The
headline only counts when `value` changes; hovering swaps it instantly.

Set `chart="none"` for a figure-only metric card: `data` becomes optional and the headline
still counts on a new `value`.
