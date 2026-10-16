---
title: Pricing 02
description: A pricing section with a monthly and yearly toggle whose prices roll digit by digit, and a feature list under each plan.
component: pricing-02
category: blocks
tags: [pricing, plans, billing, monthly, yearly]
---

Switching the controlled `period` rolls each price in character by character: up from below
for later periods, down for the first. Screen readers get the whole price once.

Buttons link to a plan's `href` or call `onSelect`. Composes `card`, `button` and
`toggle-group`.
