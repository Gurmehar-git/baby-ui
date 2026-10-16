---
title: Ring Chart
description: "Concentric progress rings that expand, then sweep to each value against its maximum."
component: ring-chart
category: charts
tags: [ring, progress, radial, goal]
---

Needs `chart` and `counter`. Each row gives a value and a maximum (`maxKey`, default `max`);
the first row is the innermost ring. Rings keep their thickness ratio and scale to fit the
container.

Rings start at 90% scale rather than zero, so they settle into place instead of
appearing from a point.
