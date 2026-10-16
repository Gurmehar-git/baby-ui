---
title: Popover
description: Anchored panel that flips and shifts to stay on screen, dismissed by Escape or an outside click.
component: popover
category: base
tags: [popover, overlay]
---

Positioning, outside dismissal, focus return and portaling all come from Base UI (React)
and bits-ui (Svelte): the panel flips to the opposite side when it runs out of room and
shifts along its axis to stay clear of the viewport edge. This component only owns the
classes and data-slots.

## Why the origin moves

`transform-origin` follows whichever side the positioner settles on, so the panel always
grows out of the trigger. A popover that scales from a fixed corner reads as unrelated to
the thing you clicked, which is the whole point of anchoring it.

## Dismissal

An outside click or Escape closes the popover and returns focus to the trigger, handled
by the primitive rather than a hand-rolled outside-click listener.
