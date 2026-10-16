---
title: Accordion
description: Disclosure sections with animated height; one open at a time, or many.
component: accordion
category: base
tags: [accordion, disclosure, faq]
---

shadcn's composition: `Accordion` takes `type="single"` (default) or `type="multiple"`,
and in single mode `collapsible` lets the open panel close again. Each `AccordionItem`
carries a `value`; `AccordionTrigger` and `AccordionContent` do the rest.

## Height without measuring

The panel animates `grid-template-rows` from `0fr` to `1fr`. No JavaScript measures
anything, no `max-height` guess is involved, and a panel with forty lines of content
opens at the same speed as one with two. `max-height` transitions are the usual approach
and they always animate to the guess rather than the content, which is why a short panel
opens instantly and a tall one lags.

Each trigger is a real button inside a heading, with `aria-expanded` and `aria-controls`
pointing at its region, so the relationship is announced rather than implied by proximity.
