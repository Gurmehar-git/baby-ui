---
title: Checkbox
description: Checkbox with an animated tick and a real indeterminate state.
component: checkbox
category: base
tags: [checkbox, form, selection]
---

A real `<input type="checkbox">` sits underneath, visually hidden rather than replaced.
Form submission, autofill, and the `indeterminate` DOM property all keep working.

## Indeterminate is a property, not an attribute

You cannot set indeterminate in markup. Both ports set it on the element after mount,
which is the only way it works, and it takes precedence over `checked` exactly as the
native control does.

## The tick draws

The box fills first, then the tick draws itself over 200ms via `stroke-dashoffset`. The
order is deliberate: the fill reads as the cause and the tick as the effect. A tick that
fades in at the same time as the fill reads as two unrelated things happening at once.
