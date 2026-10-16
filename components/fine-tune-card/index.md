---
title: Fine Tune Card
description: "A compact interactive inspector: scrub-able number fields, a layout switch, a type select."
component: fine-tune-card
category: advanced
tags: [inspector, scrub, number, properties, editor]
---

Every number field scrubs: hover the label for an ↔ cursor and drag to adjust, use ↑/↓
(⇧ for ×10), or type directly. The layout switch and Type select track the same editable
state, surfaced together through `onChange`.

## No fictional default

`fields` is required: the scrub-able properties are the whole point of the card, so there's
no built-in sample set. `options` defaults to empty, which hides the Type row entirely rather
than showing a select with invented choices.

## Built on the real Select

The Type picker composes this registry's own `Select`, not a hand-rolled popup: its open
state, positioning and keyboard handling all come from that primitive.
