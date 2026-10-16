---
title: Animated Gradient Text
description: Text filled with a gradient that sweeps back and forth.
component: animated-gradient-text
category: text
tags: [text, gradient, animated, heading]
---

Renders as whatever `as` resolves to (`span` by default, pass `h1`/`h2`/`p`/etc.) so it
behaves like the real heading or paragraph it's standing in for -- inherited size, normal
line-breaking, nothing fixed-width.

## Two tones, not arbitrary colours

`tone` picks between the token-driven `primary`/`accent` gradient and a neutral
`foreground`/`muted-foreground` one, rather than accepting raw colour strings -- it stays
correct across light and dark automatically.
