---
title: Switch
description: On/off control whose thumb travels rather than teleports.
component: switch
category: base
tags: [switch, toggle, setting]
---

`role="switch"` with `aria-checked`, not a checkbox. The distinction is real: a switch
takes effect immediately, a checkbox waits for a submit. If your control needs a save
button, it is a checkbox.

## The travel is the point

The thumb moves over 140ms, the same duration as a button press, and the track colour
changes over the same window so the two land together. A thumb that teleports gives you
no sense that the control was actuated; a thumb that takes 400ms makes the setting feel
like it is still saving.
