---
title: Case Study Flip Stack
description: A pile of case study cards; scrolling flips each one up and away to reveal the next.
component: case-study-flip-stack
category: animated
tags: [scroll, cards, stack, portfolio]
---

Each card gets one box height of scroll: it rises and tilts back while the card beneath grows
from its resting offset to the front. `index` tracks the front card and scrolls there when set.

The scroll box is keyboard focusable. Under reduced motion the cards stay flat and cross-fade.
