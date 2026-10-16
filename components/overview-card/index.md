---
title: Overview Card
description: "A dashboard hero metric: headline, trend, an optional period switcher and a full-width chart."
component: overview-card
category: blocks
tags: [overview, dashboard, hero metric, chart, card]
---

A bigger sibling of `stat-card`: the chart is the main event, and an optional period
switcher (`periods`, `period`, `onPeriodChange`) lets a caller swap in a different `data`
array without the card owning any fetch logic itself.

Pass `formatValue` for currency or units, and `locale` for the date and percent formats.
Omit `periods` to hide the switcher entirely, e.g. for a single fixed range.
