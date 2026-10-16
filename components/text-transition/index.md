---
title: Text Transition
description: "22 named text-reveal presets sharing one CSS animation engine."
component: text-transition
category: text
tags: [text, transition, reveal, animated, preset]
---

Nineteen named text-reveal presets (blur-out-up, soft-blur-in, fade-through,
per-character-rise, shared-axis-y/z, spring-scale-in, and 13 more) behind one component
with a `variant` prop, instead of 19 separate registry items.

## One engine, not 19 keyframes

Every preset shares a single `@keyframes` block in `motion.css`, driven by CSS custom
properties (`--tt-from-opacity`, `--tt-from-x/y`, `--tt-from-scale`, `--tt-from-blur`)
set per preset, so the whole family runs on CSS transitions instead of a JS engine,
matching the rest of this library's motion.

## Replays on `text` change, not a timer

There's no built-in cycling. Pass a new `text` (or switch `variant`) and the animated
units remount, replaying the entrance. Pair it with your own interval, or with
`TextLoop`, if you want auto-rotation.
