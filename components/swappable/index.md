---
title: Swappable
description: Drag-to-swap primitive on Swapy. Make any layout's slots and items swappable.
component: swappable
category: base
tags: [swap, drag, reorder, sortable, kanban, dashboard]
---

A primitive, not a widget: `Swappable` wraps any markup, `SwappableSlot` marks where things
can sit, `SwappableItem` marks what moves, and an optional `SwappableHandle` limits the drag to
a grip. A bento dashboard, a kanban board and a sortable list are the same four parts.

Every option and event of Swapy's `createSwapy` is a prop under its own name: `animation`,
`swapMode`, `dragAxis`, `dragOnHold`, `autoScrollOnDrag`, `manualSwap`, `enabled`, `onSwap`,
`onSwapStart`, `onSwapEnd` and `onBeforeSwap`. `onReady` hands you the instance.

## Static or data-driven

Without `manualSwap`, Swapy moves the DOM itself, which suits a static layout like the
dashboard. When React or Svelte renders the items from data, pass `manualSwap`, keep the slot
map from `onSwap` in state and render from it, as the kanban and list examples do.
`initSlotItemMap` and `toSlottedItems` build that map from your items.

## Keyboard

Swapy is pointer-only, so the primitive adds a keyboard path: Alt and an arrow key swap the
focused item with the previous or next slot, focus follows it, and a live region announces
the new position. Keyboard moves fire `onSwap` with the same event, so one handler covers
both.
