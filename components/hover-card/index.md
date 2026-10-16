---
title: Hover Card
description: Rich preview that opens on hover with a delay and survives the trip to its own surface.
component: hover-card
category: base
tags: [hover, card, overlay]
---

The close delay is the whole component. Without it, the card disappears the moment the
pointer leaves the trigger, and there is a gap between trigger and card that the pointer
must cross. Hovering the card itself cancels the pending close.

## Supplementary by definition

Nothing in a hover card should be the only copy of that information. It is unreachable on
touch, awkward on a keyboard, and invisible to anyone who does not happen to hover. It
opens on focus too, but that is a mitigation, not a substitute for putting important
things somewhere permanent.
