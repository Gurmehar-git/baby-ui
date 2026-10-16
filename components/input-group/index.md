---
title: Input Group
description: An input or textarea with icons, text or buttons docked inside its border, sharing one focus ring.
component: input-group
category: base
tags: [input group, addon, prefix, suffix]
---

Addons dock to any edge with `align`: `inline-start`, `inline-end`, `block-start` or
`block-end`. The group draws the border and focus ring, so a prefix, the input and a button
read as one field.

## Recipes, not components

Search, password, currency, phone and card fields are compositions, not their own components.
The preview builds each from InputGroup: a search icon with a clear button, a show/hide toggle
with a strength hint, a currency symbol and code, a dialling code, and a card icon that names
the network. Copy the one you need; the formatting stays in your code, where your rules live.

## Clicks land on the input

Clicking an addon's padding focuses the control, as a label would. Buttons inside the addon
keep their own click.
