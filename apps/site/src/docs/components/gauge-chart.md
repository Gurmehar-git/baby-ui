---
title: Gauge Chart
description: "A reading drawn as a notched arc or track whose notches spring in one by one."
component: gauge-chart
category: charts
tags: [gauge, meter, score, chart]
---

Needs `chart` and `counter`. For a plain dial, use `gauge` instead.

A gauge is a single reading, so it is a `role="meter"` with a formatted `aria-valuetext`
rather than a keyboard-walked plot. Pass `label` to name it.

When `value` changes, notches switch on and off in a ripple from the old edge, and the
printed value counts from the previous reading.

`bands` names states along the track: the highest band the value reaches sets the tone and
adds its label, so "Healthy" or "Critical" is read, not just seen in colour.
