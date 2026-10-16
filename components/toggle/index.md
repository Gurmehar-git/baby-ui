---
title: Toggle
description: Two-state button that stays pressed, for formatting and view switches.
component: toggle
category: base
tags: [toggle]
---

`aria-pressed`, not `aria-checked`. A toggle is a button that stays down; a checkbox is a
value in a form. The distinction changes how it is announced and what the user expects
from it.

An icon-only toggle needs `label`, or it is announced as an unnamed button. That is the
single most common way this component gets shipped broken.
