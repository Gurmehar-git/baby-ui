---
title: Candlestick Chart
description: "OHLC candles that spring up in sequence, hollow when rising and filled when falling."
component: candlestick-chart
category: charts
tags: [candlestick, ohlc, finance, chart]
---

Needs `chart`. Rows carry `open`, `high`, `low` and `close` beside the date. The value axis
spans low to high with padding, so prices never sit squashed against zero.

Rising and falling candles read `var(--color-up)` and `var(--color-down)` from the config,
falling back to `--chart-positive` and `--chart-negative`; their legend entries toggle each
direction. Rename the keys with `upKey` and `downKey`, and the tooltip rows with `labels`.
