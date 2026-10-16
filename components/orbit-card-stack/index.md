---
title: Orbit Card Stack
description: Cards piled in a stack that fan into an arc, a row or a grid on hover or focus and raise the active card.
component: orbit-card-stack
category: animated
tags: [stack, cards, profiles, team, fan, grid, gallery]
---

Hovering or focusing a card fans the stack out and lifts that card; leaving closes it around the
active card. `layout="grid"` tiles the open cards into a grid scaled to fit the stage; `role` and
`description` are optional, so an image-only pile works too. Arrow keys, Home and End move
between cards, Escape closes.

The active card is `value` with `onValueChange` (`bind:value` in Svelte), and the fan is `open`.
Open spacing shrinks to fit the container. Items with `href` get a real link button.
