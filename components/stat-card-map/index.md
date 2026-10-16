---
title: Stat Card Map
description: "A KPI card over a choropleth; the headline follows the region under the pointer."
component: stat-card-map
category: blocks
tags: [stat, kpi, map, choropleth, card]
---

Bring your own boundaries: a GeoJSON `FeatureCollection` such as the countries from
`world-atlas` converted with `topojson-client`. Nothing is fetched at runtime.

`trends` is optional per region; regions without one show the card's overall `trend`.
