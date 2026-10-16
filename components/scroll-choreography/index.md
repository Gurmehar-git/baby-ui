---
title: Scroll Choreography
description: Four images swap corners, stack in the centre, then one grows to fill the frame as you scroll.
component: scroll-choreography
category: animated
tags: [scroll, images, gallery, expand]
---

Three phases share one scroll box: two images swap rows, all four slide to the centre, then the
top-right image grows to fill the frame. `variant="stack"` stops at the stack.

Offsets are container units, so it scales with its box. A CSS `view()` timeline drives it, with a
scroll-listener fallback; reduced motion holds the starting layout.
