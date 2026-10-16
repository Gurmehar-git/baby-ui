---
title: Scroll Split Card
description: One image splits into three panels that separate, then flip over to reveal cards as you scroll.
component: scroll-split-card
category: animated
tags: [scroll, flip, split, cards, 3d]
---

The component is its own scroll box. Scrolling first parts the image into three rounded panels,
then flips each one over to show a card, then lifts the row and fades in `endLabel`.

A CSS `view()` timeline drives the whole sequence where the browser supports it; elsewhere a
single scroll listener writes the same progress value. Under reduced motion the cards simply sit
face up.
