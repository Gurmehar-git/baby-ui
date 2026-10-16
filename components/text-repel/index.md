---
title: Text Repel
description: Letters shy away from, lean toward, or get flicked by the pointer, then spring back.
component: text-repel
category: text
tags: [text, cursor, hover, inertia]
---

Each letter reads its distance to the pointer and moves along that line, with a force that
falls off to nothing at `radius`. `attract` flips the direction. `inertia` ignores distance: each
letter the pointer crosses is flicked by the pointer's speed, capped at `strength`.

The offsets are written straight onto each letter as CSS custom properties, and a spring sampled
into a `linear()` easing does the settling. Nothing re-renders per pointer move, and a new target
simply retargets the running transition, so fast moves stay smooth.
