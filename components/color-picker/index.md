---
title: Color Picker
description: Swatches plus the native colour input and a hex field.
component: color-picker
category: base
tags: [color, picker]
---

Built on `<input type="color">`, so the platform picker, the system eyedropper, and any
OS-level accessibility come free. A hand-rolled saturation square gets none of that.

The hex field is editable and labelled. For anyone who cannot use a visual picker, typing
the value is the only path, and a lot of colour pickers do not provide one.

## Variants

One component covers every colour control, picked with `variant`:

- `inline`: the full picker, with area, hue strip, hex field, channel sliders and presets.
- `field`: a swatch beside a hex input; the swatch opens the full picker.
- `area`: the saturation and brightness square on its own.
- `slider`: the hue strip, labelled with its current degree.
- `swatch`: one colour disc, for showing a value rather than editing it.
- `swatches`: a radio row of discs from `swatches`; the chosen one wears a ring in its own colour.

`size` scales the field, area, slider and discs. Every variant binds the same `value`.

## Field

`variant="field"` is the compact form for toolbars and forms: a swatch beside a hex input you
can type into. Enter commits, Escape reverts, arrows step the hex by 1 and Page keys by 16, and
pressing the swatch opens the full picker. `size` sets its height, `invalid` reds it.

Pass `recent` to show the last colours used; the parent owns that list. Where the browser has
the EyeDropper API, a button reads any colour off the screen.
