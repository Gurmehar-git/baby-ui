---
title: Rolling Digits
description: "A number whose changed digits spring in and out, one column at a time."
component: rolling-digits
category: text
tags: [number, digits, counter, spring]
---

Only the digits that change roll, each keyed from the right so a value gaining a digit
opens a new column instead of shifting the rest. Rapid updates queue `stepMs` apart, or
set `coalesce` to jump straight to the latest.

The springs are sampled into CSS keyframes, so the bounce matches the original with no
animation library. `variant="odometer"` turns digit strips instead, and `variant="count"` tweens the number.
