---
title: Carousel
description: "Centred row of slides browsed by drag, flick, trackpad swipe or keys, with neighbours in view and an indicator that travels with them."
component: carousel
category: base
tags: [carousel, slider, gallery, swipe]
---

Wrap each slide in `CarouselItem`, as in shadcn. The play control, indicators and arrows are
built in; set `interval` to offer rotation, and `autoplay` only when the viewer asked for it.

Use `variant="showcase"` for large editorial media. It keeps neighbouring slides visible,
uses a centered snapping track, and groups progress and playback into compact pill controls.

`projection="concave"` and `projection="convex"` keep the same controlled index, gestures,
keyboard behavior and controls while projecting each slide's x, y and scale onto a cylinder.
They wrap continuously by design. Use a smaller `slideSize` for these treatments so several
neighbours remain visible.
