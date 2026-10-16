---
title: Signature
description: Text that writes itself, glyph by glyph, in whatever font the element inherits.
component: signature
category: animated
tags: [signature, handwriting, svg, text]
---

Each glyph is an SVG `<tspan>` whose outline strokes in one step after the last, then fills. There is
no font file or path extraction: the text inherits the element's font, so pass a script font through
`class`.

Use `inView` to wait until it scrolls into view. The HTML copy underneath sizes the element and is
what screen readers read.
