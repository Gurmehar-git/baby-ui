---
title: Tabs
description: Tab list with an indicator that slides between tabs and a clipped label swap.
component: tabs
category: base
tags: [tabs, navigation, segmented]
---

The indicator is measured from the active tab's box, not positioned from an index, so
it stays correct when a font finishes loading or the container resizes.

## The clipped label

Each tab renders its label twice: once in the muted colour, and once in the active
colour clipped to the indicator's rectangle. As the indicator slides, the clip slides
with it, so the text recolours exactly where the pill's edge is.

The obvious alternative -- transitioning `color` on both tabs -- cross-fades them, and
for a moment both labels are a muddy in-between shade. No amount of tuning the duration
fixes that, because the problem is that two things are changing when one should be
moving.

## Selection follows focus

Arrow keys change the selected tab immediately. That is correct here because all panels
are already rendered. If switching a tab triggered a fetch, selection should *not*
follow focus, and you would need Enter to activate instead.
