---
title: Morphing Modal
description: Card that expands into a dialog from its own position, measured with FLIP so the two frameworks travel identically.
component: morphing-modal
category: advanced
tags: [modal, dialog, morph]
---

The dialog appears to grow out of the card you clicked rather than fading in over it.
That continuity is the whole point: you keep your place because the thing you touched is
the thing that opened.

## How the morph is done

On open, the trigger's bounding box and the dialog's final box are both measured, and
the dialog is animated from a transform that maps one onto the other back to its own
identity transform. Only `transform` and `opacity` animate, so the morph never touches
layout.

This is FLIP against a measured rect, not a shared-layout animation. Framer Motion's
`layoutId` would be the obvious tool in React and has no Svelte equivalent, so both
ports measure instead and stay in step.

## Platform pieces

It renders as a native `<dialog>`, so the top layer, backdrop, and inertness of the rest
of the page come from the browser rather than from a focus-trap library. Escape is
intercepted only to run the closing morph before the dialog actually closes.

Closing is 30% faster than opening. By then the user has decided, and the animation is
confirmation rather than orientation.
