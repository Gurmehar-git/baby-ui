---
title: Number Input
description: A stepper with hold-to-repeat buttons, keyboard steps, Intl formatting and a scrubbable label.
component: number-input
category: base
tags: [number input, stepper, spinbutton, quantity, currency]
---

Pass `formatOptions` to show currency, percent or units while the value stays a plain number.
Hold the minus or plus button to repeat, or drag the label sideways to scrub. PageUp and
PageDown step by `largeStep`; Home and End jump to `min` and `max`.

`variant="scrub"` is the compact inspector form: the label sits inside the field as its drag
handle, a `suffix` names the unit, and the steppers go.

The React port is Base UI's NumberField. The Svelte port matches its keys and formatting.

Pressing past `min` or `max` shakes the field and briefly names the limit; set
`limitHint={false}` to keep it silent. `prefix` and `suffix` frame the value in both variants.
