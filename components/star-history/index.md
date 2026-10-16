---
title: Star History
description: "GitHub star history: the total and its trend, milestones, and a total or gained chart."
component: star-history
category: blocks
tags: [github, stars, history, chart, line, bar, block]
---

No fetching of its own: pass `history` with a cumulative daily series and the block renders the
rest.

## Data shape

```ts
type StarHistoryData = {
  repo: string; // "owner/name"
  createdAt: string | Date;
  data: Array<{ date: Date; stars: number }>; // cumulative, oldest first, UTC days
};
```

The chart runs from the first row to the last, so you choose the window.

## What it derives

- **Trend**: the last 30 days against the 30 before; "New" when that earlier window had none.
- **Best day**: the most stars gained in one day.
- **Latest milestone**: the last round number crossed (100, 1k, 5k and so on) and when.
- **Next milestone**: the next round number and roughly how many days it takes at the last 30
  days' pace. The estimate is left out when the last 30 days gained nothing.
- **Last star**: the last day the count went up, not the last row.

## Charts

- `cumulative`: the running total as a line.
- `daily`: stars gained per day as bars, or per week once the history spans more than 120 days.

## Variants

- `default`: the full block.
- `compact`: the total, two facts and the chart, for a sidebar.
- `minimal`: no card, mono labels.
