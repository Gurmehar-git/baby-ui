---
title: CTA Section
description: "A call to action as a centred closing section, a split layout beside a visual, or a one-line banner that folds away when dismissed."
component: cta-section
category: blocks
tags: [cta, call to action, banner, marketing, landing, section]
---

Composes `button`. `CtaSectionContent` holds the title, description, `CtaSectionActions` and
an optional `CtaSectionNote`; each `CtaSectionAction` is a link with `href` or a button with
`onClick`, and `variant="outline"` makes it the secondary.

`centered` closes a page; put an `AvatarGroup` in the note as social proof. `split` puts the
copy and its `CtaSectionPoints` beside `CtaSectionVisual`, a product shot or a live card.
`banner` is one line; `CtaSectionDismiss` folds its own row closed, and `open` with
`onOpenChange` (or `bind:open`) brings it back.
