---
title: Tooltip
description: Delayed label anchored to its trigger, shown on hover and on keyboard focus.
component: tooltip
category: base
tags: [tooltip, overlay]
---

Hover waits for `delay`; focus opens immediately. A deliberate key press is not an
accidental pointer sweep, so it does not need the same protection against firing.

## It must open on focus

A tooltip that only appears on hover does not exist for anyone using a keyboard. This one
opens on `focusin` and closes on `focusout`, and Escape dismisses it without moving focus.

## Never the only source

The tooltip is `aria-describedby` the trigger, which supplements the accessible name. If
the tooltip carries information the control cannot be used without, it belongs in a
visible label instead. `pointer-events` are off so the tooltip can never intercept the
click meant for the trigger.
