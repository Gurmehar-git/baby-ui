---
title: NPM Stats
description: "npm downloads: the range total and its trend, the facts behind it, the chart and every package's share."
component: npm-stats
category: blocks
tags: [npm, stats, dashboard, downloads, analytics, block]
---

No fetching of its own: pass `packages` already loaded (usually from your server) and the block
sums, compares and labels everything.

## Data shape

```ts
type NpmPackage = {
  name: string;
  allTime: number;
  last30Days: Array<{ date: string; downloads: number }>; // daily, YYYY-MM-DD
  last90Days: Array<{ date: string; downloads: number }>; // weekly, 'YYWww
};
```

## Range

The toggle switches the total, facts, chart and packages between two windows.

- `30d`: the trend is the last 7 days against the 7 before.
- `90d`: the trend is the last 4 full weeks against the 4 before. The first and last weeks are
  often partial, so they are left out.

When the earlier window had no downloads the trend reads "New" instead of an infinite percent.

## What it derives

- **Daily average** and **peak** day (or week, on `90d`).
- **Busiest weekday**, and how far it runs above the daily average. It always reads the daily
  rows, since weekly buckets hide the weekday.
- **Fastest growing**: the package with the largest positive trend.

## Packages

One bar splits the range between packages, each in its own shade of the chart colour. Rows keep
the order you pass, so switching range never reshuffles them.

## Variants

- `default`: the full block.
- `compact`: the total, two facts and the chart, for a sidebar.
- `minimal`: no card, mono labels, no share bar.
