---
title: Cube Text
description: "Each letter is a cube face that rolls down onto the next, in a wave across the text."
component: cube-text
category: text
tags: [flip, cube, roll, 3d, letters, text animation, loop]
---

Every letter has two identical faces, drawn with `::before` and `::after`. The roll turns one
onto the other, so the text never changes, it just keeps turning over. All of it is CSS.

`stagger="wave"` delays letters along a quarter sine, so the roll sweeps left to right.
Size the text with `size` or your own `class`; the faces scale with the font.
