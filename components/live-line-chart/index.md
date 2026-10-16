---
title: Live Line Chart
description: "Streaming line that scrolls with the clock and eases toward the latest value."
component: live-line-chart
category: charts
tags: [live, streaming, realtime, line, chart]
---

Needs `chart`. You own the stream: push samples into `data` (`time` in unix seconds) and
pass the newest as `value`. The chart never generates or polls data itself.

## Smoothing

`lerpSpeed` is the fraction eased per 60fps frame, applied by elapsed time, so a 120Hz
screen and a throttled tab settle on the same curve. Set `1` to jump. A growing y-range
snaps so spikes are never clipped; a shrinking one eases back.

## Cost

The loop only runs while it has something to do: it stops when `paused` has settled, when
the chart scrolls offscreen, and in a hidden tab.
