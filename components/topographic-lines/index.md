---
title: Topographic Lines
description: A slowly drifting contour map traced from a seeded height field, with heavier index contours.
component: topographic-lines
category: backgrounds
tags: [background, topographic, contour, map, terrain, hero, canvas]
---

A quiet texture for outdoor, mapping, travel or data products. Hills swell and merge as two noise layers drift apart, instead of the whole map sliding past.

`levels` sets how many lines cross the height range and `indexEvery` makes every Nth one heavier, like a survey map. `filled` adds soft elevation bands under the lines. The same `seed` always draws the same terrain.

Redraws are capped at 25 per second and stop offscreen, in a hidden tab or when `speed` is 0. Reduced motion draws the map once.
