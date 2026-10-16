---
title: Wheel Picker
description: "iOS-style barrel columns that flick, snap and loop, for times, dates and lists."
component: wheel-picker
category: advanced
tags: [wheel, picker, time, scroll]
---

Put one `WheelPickerColumn` per unit inside a `WheelPicker`. Columns scroll natively, so
touch flicks, the mouse wheel and trackpads keep the platform's own momentum, and the
barrel is a scroll-driven CSS animation rather than a JS spring.

`onValueChange` fires as each row passes the centre; `onValueCommit` fires once the
wheel rests. Browsers without scroll-driven animations get a flat snapping list.
