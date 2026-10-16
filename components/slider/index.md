---
title: Slider
description: Range input on a spring glide, in seven looks from a classic thumb to a wave, a ruler and a thumbless pill.
component: slider
category: base
tags: [slider, range, form, ruler, wave]
---

Built on Base UI (React) and bits-ui (Svelte), so arrows, Page Up and Page Down, Home, End
and touch all work in every look without being reimplemented.

## Variants

- `default`: a thin track and a round thumb. The only look that supports `orientation="vertical"`.
- `track`: an inset fill under a thin pill handle that stretches while you drag.
- `inline`: `track` with the label and value inside it. The handle parts into two dots
  where it crosses the text, so the text stays readable.
- `bubble`: a value bubble pops out of the thumb while you drag it.
- `fluid`: no thumb. The whole pill is the control, and its text inverts under the fill.
- `wave`: equalizer bars rise into a crest around the value.
- `ruler`: a scale scrolls under a fixed needle. Drag the scale, not a handle.

`inline`, `fluid`, `wave` and `ruler` take a single value. Pass an array and they fall
back to `track`, which draws a range. `formatValue` sets the text in every look and the
value screen readers announce.
