---
title: Treemap Chart
description: "A zoomable hierarchy of parts: tiles size by value, deepen with a second measure, and zoom into a branch on click or Enter."
component: treemap-chart
category: charts
tags: [treemap, hierarchy, chart, zoom]
---

Pass a tree of `{ id, label, value?, color?, children? }`. Branches sum their children; a
breadcrumb, Escape or Backspace climbs back out. Give every node a stable `id` so tiles morph when
the data changes.
