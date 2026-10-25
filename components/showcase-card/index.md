---
title: Showcase Card
description: A preview-first link card with solid, translucent and morphing footer treatments.
component: showcase-card
category: advanced
tags: [card, showcase, preview, catalog, morph]
---

Showcase Card composes the existing `Card` in its `framed` variant. It keeps the preview dominant
while preserving a real title, description and link.
Compose it from `ShowcaseCardPreview`, `ShowcaseCardFooter`, `ShowcaseCardCopy`,
`ShowcaseCardTitle`, `ShowcaseCardDescription` and `ShowcaseCardLink`.

## Variants

`solid` keeps an opaque footer inside the frame. `translucent` places a persistent material footer
over the preview. `morphing` rests as a full preview, then makes room for the same framed footer
without changing the outer card size. It reveals on hover or keyboard focus; on touch devices it
stays revealed because hover is unavailable.

## Link and actions

`ShowcaseCardLink` is an overlay sibling rather than a wrapper, so an independent button can sit
inside `ShowcaseCardAction` without nesting interactive elements. Give the link an accessible
name that includes the title and destination.

The card does not choose its own aspect ratio. Set height or aspect ratio at the call site so the
same component works in a masonry gallery, a uniform grid or a single featured slot.
