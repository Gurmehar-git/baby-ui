---
title: Input
description: Text field with invalid and disabled states that stay legible together.
component: input
category: base
tags: [input, form, text field]
---

Three sizes, and states that compose rather than override each other.

## Invalid survives focus

Focusing an invalid field keeps the red border. Plenty of implementations swap the error
border for the focus ring, which means the moment you go to fix the error, the signal
that there is one disappears.

## Placeholders are not labels

`placeholder` vanishes the instant someone types. Anything the user needs while filling
the field in belongs in a real `<label>`, which is what the `Label` component is for.
`aria-invalid` is set from `invalid`, so screen readers get the state without you
wiring anything.
