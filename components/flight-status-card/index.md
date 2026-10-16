---
title: Flight Status Card
description: A flight's route in dot-matrix airport codes, its status badge and a progress track with a plane riding the fill.
component: flight-status-card
category: blocks
tags: [flight, travel, status, progress, card]
---

Every value is a prop: codes, cities, times, `status` and `progress`. The card never advances on its
own; pass a new `progress` and the fill transitions to it.

`status` picks the badge label and a tone (scheduled neutral, boarding and in flight info, delayed
warning, landed success, cancelled destructive). Pass `tone` to override it, and `display="text"`
for monospace codes instead of the dot matrix. Badge text lives in `labels`.
