---
title: Infinite Image Field
description: An endless image field that drifts toward the pointer, or pans by drag through a fisheye or WebGL lens.
component: infinite-image-field
category: animated
tags: [images, field, infinite, drift, fisheye, lens, webgl, gallery, canvas]
---

Three engines behind one API. `drift` reads the pointer's offset from the centre and drifts up to `maxSpeed`, eased by `smoothing`. `fisheye` pans by drag with inertia and magnifies tiles toward the centre. `gallery` draws the grid in WebGL through a barrel lens, pulls back while dragging, and falls back to a plain image grid without WebGL.

Each cell always shows the same item, and a visually hidden list names them all. Every engine idles once nothing moves, offscreen or in a hidden tab.
