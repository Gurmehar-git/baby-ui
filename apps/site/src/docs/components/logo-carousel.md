---
title: Logo Carousel
description: "Columns of logos that cycle independently, staggered slide-and-fade per column."
component: logo-carousel
category: blocks
tags: [logo, carousel, marquee, cycle, marketing, social proof]
---

React takes logos as `children` (one element per logo), matching the source. Svelte takes
`items` (plain data) plus a `logo` snippet that renders one item, since a Svelte snippet
can't be split apart and reassembled the way React children can.

## No motion library

The source used `motion/react`. This port is CSS only: each cycle keys a fresh element in
and animates it in with `.logo-carousel-enter`, while the outgoing element animates out on
`.logo-carousel-exit` and is removed from the DOM once its `animationend` fires, so nothing
lingers as dead weight between cycles.

## Paused, not just slowed, when nobody can see it

An `IntersectionObserver` stops the interval entirely once the carousel scrolls out of
view, and a `visibilitychange` listener does the same when the tab itself is hidden. Idle
columns spend zero timers running for content nobody is looking at.

`variant="marquee"` drifts the logos past in one strip instead, built on the draggable
marquee: it holds under the pointer, can be thrown, and fades at both edges. A Pause button
sits under it by default (`pauseControl`); `paused` with `onPausedChange` controls it, and
works for the columns too. `tone="mono"` greys the logos until hovered.
