---
title: Usage Card
description: "A settings-page usage panel: one ring per metric, or one segmented meter against a plan limit."
component: usage-card
category: blocks
tags: [usage, quota, storage, ring, settings, card]
---

Composes `card`, the ring chart and its legend. Each row in `data` becomes one ring; `config`
supplies the label and colour per ring, keyed by `nameKey`. `layout` places the rings beside
the legend (`side`) or above it (`stacked`), for narrower panels.

Every legend entry is a real toggle, so hiding a metric works from the keyboard too.

`layout="meter"` draws one segmented bar instead: every row shares `limit`, in the same
`unit`. A badge reads the free share, warns once usage passes `warnAt`, and turns into the
overage past the limit, where a hatch and a limit marker fade in. Hovering a segment or
legend entry previews its share in the headline; pressing pins it until pressed again or
Escape.
