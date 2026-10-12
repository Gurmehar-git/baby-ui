---
title: Card Stack
description: "A deck reviewed one card at a time: drag or flick the top card left or right, with undo that flies it back."
component: card-stack
category: advanced
tags: [card, stack, swipe, deck, media]
---

React takes `renderCard` and `renderEmpty`; Svelte takes `card` and `empty` snippets. Decisions
are yours to keep through `onDecide`; the stack only remembers its place and the undo history.
