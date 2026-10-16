---
title: Mask Text
description: A cursor-following circular mask reveals a second copy of the text.
component: mask-text
category: text
tags: [text, mask, cursor, hover, reveal]
---

`mask-position` tracks the cursor instantly (no easing, since it must feel 1:1); only
`mask-size` transitions, growing from 0 on hover. `revealText` is `aria-hidden` --
`baseText` is the real content underneath.
