---
title: Signature Pad
description: "A signature field with real ink: width follows pen pressure or speed, ends taper, with undo, redo, a wiping clear and cropped PNG or SVG export."
component: signature-pad
category: advanced
tags: [signature, sign, pad, draw, ink, pen, form]
---

Composes `toggle-group` and `button`. Strokes are stored in pad units, so a signature keeps its
shape at any size; read them from `value` (bindable in Svelte), or turn them into a cropped
SVG or PNG with `signatureToSvg` and `signatureToPng`.

Width follows pen pressure on a stylus, and drawing speed with a mouse or finger. Undo, redo and
clear live in the toolbar and on the keyboard. For an animated handwritten name, use `signature`.
