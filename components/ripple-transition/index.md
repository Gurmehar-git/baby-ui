---
title: Ripple Transition
description: An image stack where the next image ripples open from the click point.
component: ripple-transition
category: animated
tags: [image, slideshow, transition, clip-path]
---

Clicking opens the next image as a CSS clip-path circle from the pointer, sized to reach the farthest corner, while the outgoing image pushes back and rings ride the edge. Keys start the ripple from the centre: Enter or Space for next, arrows for either direction.

The index is controlled: `value` with `onValueChange` in React, `bind:value` in Svelte. `images` is required and each alt text is announced when that image becomes current. Reduced motion swaps images instantly.
