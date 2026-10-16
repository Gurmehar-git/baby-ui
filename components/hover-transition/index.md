---
title: Hover Transition
description: A card that swaps its content for a second view on hover or focus, with eight reveal effects.
component: hover-transition
category: animated
tags: [hover, reveal, card, wipe, ripple]
---

Pass the resting view as children and the second view as `hoverContent`. Hover or keyboard focus
plays the effect from `direction`; leaving plays it back. Every effect is a CSS transition on
clip-path, transform, opacity and filter.

`active` is controllable, so the reveal can also follow a tap, a scroll position or anything else.
Reduced motion swaps the views instantly.
