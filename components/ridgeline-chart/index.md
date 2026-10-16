---
title: Ridgeline Chart
description: "Compares the shape of many distributions at once: each series is a smoothed density on one shared axis, stacked with overlap."
component: ridgeline-chart
category: charts
tags: [ridgeline, distribution, density, joyplot]
---

Pass raw observations per series; each ridge is a Gaussian kernel density with Silverman's
bandwidth unless you set `bandwidth`. The focused ridge lifts and shows its middle half.
