---
title: Typography
description: Text scale with the right element for each visual level.
component: typography
category: base
tags: [typography]
---

`variant` picks both the style and the element, so by default the document outline matches
what is on screen. A page of `<div>`s styled to look like headings has no outline at all,
and heading navigation is one of the primary ways screen reader users move through a page.

Use `as` only when the outline and the visual level genuinely differ. That is rarer than
it feels.
