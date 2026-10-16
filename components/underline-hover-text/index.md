---
title: Underline Hover Text
description: Inline text with a hover underline in four strokes, a centre sweep, a lifting double hairline, a drawn hairline or a sliding bar.
component: underline-hover-text
category: text
tags: [text, underline, hover, link]
---

Wrap any words in a sentence; the underline stays inline. `variant` picks the stroke:

- `sweep` grows a stroke out from the centre over a faint baseline, lifting the text.
- `double` lifts a second hairline above the first.
- `draw` grows a hairline from the start of the line.
- `bar` slides a thick bar in from the start and out past the end.

`tone` picks token colours, so it reads right in light and dark. `trigger="always"` keeps the
stroke drawn, for a current-page link. Every stroke answers keyboard focus as well as hover.
