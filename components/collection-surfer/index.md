---
title: Collection Surfer
description: An endless diagonal line of 3D image cards that glides toward you as you scroll.
component: collection-surfer
category: animated
tags: [scroll, 3d, gallery, infinite]
---

Every `scrollPerItem` px of scroll moves the line one card closer. The scroll offset wraps by one
full loop, so the line never runs out.

Near the pointer, cards grow (`magnetic`) or lift (`uplift`); `simple` leaves them still. Nothing
runs between scroll and pointer events.
