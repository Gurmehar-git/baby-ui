---
title: Badge
description: Compact status label with semantic colour variants and an optional leading dot.
component: badge
category: base
tags: [badge, status, label]
---

Six variants, three of which mean something. `success`, `warning` and `destructive`
carry state; `default`, `secondary` and `outline` are weight, not meaning.

## Colour is not the message

If a badge's colour is the only thing distinguishing "failed" from "passed", the badge
does not work for roughly one in twelve men. Put the state in the text as well. The
variant is there to make the text easier to scan, not to replace it.

The optional `dot` inherits the variant's colour and is decorative. It helps a dense
table scan faster; it does not add information.
