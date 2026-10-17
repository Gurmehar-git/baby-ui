---
title: Overview Card
description: "A dashboard hero metric from parts: headline, trend, an optional period switcher and a full-width chart."
component: overview-card
category: blocks
tags: [overview, dashboard, hero metric, chart, card]
---

A bigger sibling of `stat-card`, built from parts: `OverviewCardHeader` holds the title and an
optional `OverviewCardPeriods` switcher, and `OverviewCardContent` holds `OverviewCardValue`
(with `OverviewCardTrend` inside) and the full-width `OverviewCardChart`.

`OverviewCardPeriods` is a ToggleGroup of `OverviewCardPeriod` items: listen to
`onValueChange` (or `bind:value` in Svelte) and pass a different `data` array, so the card
never owns any fetch logic. Leave it out for a single fixed range.

Pass `formatValue` for currency or units, and `locale` for the date and percent formats.
