---
title: Collab Card
description: "A Figma-style multiplayer canvas: wandering cursors, click bursts, live presence."
component: collab-card
category: blocks
tags: [collaboration, multiplayer, cursors, presence, figma]
---

Every dimension is in `cqi` (container query inline units), so the whole card scales
continuously with its own width: drop it into a narrow sidebar or a wide bento cell and
the frame, cursors, pills and presence stack all track that width, not a viewport
breakpoint.

## The colors are fixed on purpose

This card depicts a specific external tool's canvas (Figma's own multiplayer cursor
colors), so it stays dark and keeps those exact brand colors regardless of the site's
light/dark mode, the same way a browser-chrome mockup wouldn't reskin either.

## No fake headcount

`liveLabel` defaults to a count derived from `presenceColors`/`extraCount`, never a fixed
number baked into the component: the "N editing" line can't drift from what's actually
shown in the presence stack.

## No built-in copy

`greeting`, `eyebrow` and `intro` are required: the card ships no words of its own.
