---
title: Fullscreen Nav
description: Full-viewport navigation overlay with staggered links, a current-page mark and an optional footer.
component: fullscreen-nav
category: blocks
tags: [fullscreen, nav]
---

Links stagger in at 45ms, which is inside the range where a stagger still reads as one
gesture rather than a queue. Only opacity and transform animate, so a long list costs
nothing in layout.

Pass `current` to mark the page being viewed, `numbered` for editorial 01/02 indices, and a
`footer` for contact details or socials. The `clip` variant grows the panel as a circle from the
top-right corner, where a menu trigger usually sits.

## Scroll locking restores, not blanks

Body overflow is captured before it is changed and restored on close. Setting it to an
empty string on the way out clobbers whatever the page had, which is how a locked
scrollbar survives the menu closing.
