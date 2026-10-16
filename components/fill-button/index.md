---
title: Fill Button
description: A call to action whose icon tile expands into a full fill on hover, swapping the label as it goes.
component: fill-button
category: advanced
tags: [button, cta, hover]
---

The fill is always full size; `clip-path` shows only the icon tile until hover or keyboard focus,
then opens it across the button. The arrow travels on a translated track and the label slides
out while an aria-hidden copy slides in on the fill, so nothing animates layout.

Pass `href` for a link. Keyboard focus plays the same fill as hover.
