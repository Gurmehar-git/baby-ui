---
title: Collapsible
description: Collapsible, CollapsibleTrigger and CollapsibleContent, with animated height and no measurement.
component: collapsible
category: base
tags: [collapsible]
---

Height animates from `0fr` to `1fr` on `grid-template-rows`. No JavaScript measures
anything, and a panel with two lines opens at exactly the same speed as one with forty.

The `max-height` approach everyone reaches for first animates to the guess rather than to
the content, which is why short panels snap and tall ones lag.
