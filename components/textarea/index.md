---
title: Textarea
description: Multi-line field that can grow with its content instead of scrolling.
component: textarea
category: base
tags: [textarea, form, multiline]
---

With `autoGrow`, height follows `scrollHeight` on every input event, up to `maxRows`.
Past that it scrolls, because a field that grows without limit pushes the submit button
off the screen.

## Why growth is not animated

Easing the height change looks considered in a demo and feels broken in use: the field
lags a frame or two behind the character you just typed, and the caret drifts below the
visible area. Height is set immediately. This is one of the places where the right
amount of animation is none.
