---
title: Typing Text
description: "A classic typewriter reveal, with a blinking cursor and optional erase-and-repeat."
component: typing-text
category: text
tags: [text, typing, typewriter, cursor]
---

Different purpose from `StreamingText` (agents category), which tracks a live chat answer
with a caret on the last real word. This is a decorative typewriter effect for headings and
hero copy, with no relationship to actual streamed data: `repeat` erases and retypes on a
loop by design.

`stumbles` types like a person instead: wrong keys appear and get corrected on the way. The
same string always stumbles the same way, so server and client render alike.
