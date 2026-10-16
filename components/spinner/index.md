---
title: Spinner
description: Indeterminate loading indicator with an accessible name.
component: spinner
category: base
tags: [spinner]
---

`role="status"` with a real accessible name. A bare rotating SVG is announced as nothing
at all, which means a screen reader user gets silence where a sighted user gets feedback.

Give it a specific label. "Loading results" tells you what is happening; "Loading" tells
you only that something is.

## Reduced motion slows it, does not stop it

At `prefers-reduced-motion` the rotation drops to 2s rather than freezing. A stationary
spinner reads as a hung process, which is worse information than a slow one.
