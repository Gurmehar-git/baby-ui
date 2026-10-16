---
title: Pixel Image Trail
description: A hidden image revealed in square fragments that trail the pointer and fade away.
component: pixel-image-trail
category: animated
tags: [image, pixel, trail, reveal, canvas]
---

The area is split into a grid of `pixelSize` squares. The cells under the pointer show the image
at full strength; cells it has crossed fade over `fadeDuration`, or shrink to their centre with
`variant="shrink"`. A few dimmed fragments hint at the image before anyone interacts.

The canvas only redraws while squares are fading, and pauses in hidden tabs. With reduced motion
there is no trail: only the squares under the pointer show.
