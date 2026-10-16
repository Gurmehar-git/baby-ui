---
title: Time Picker
description: Segmented hour and minute, with AM/PM on a 12-hour clock, typed or stepped.
component: time-picker
category: base
tags: [time picker, time field, time input, clock, booking, form]
---

The time twin of Date Field: each segment is a spinbutton, digits type it, arrow keys step
it, and a full segment moves focus to the next. The value is a 24-hour `"HH:mm"` string in
both ports, the same one `<input type="time">` uses, and stays empty until the time is whole.

## Clock

`hourCycle` defaults to the locale's own clock: 12-hour for `en-US`, 24-hour for `en-GB`.
The AM/PM label comes from `Intl`, so it reads correctly in every language. An unset AM/PM
reads as the AM it shows.

## Step

`step` sets the minutes an arrow press moves and snaps to that grid, wrapping within the
hour; typed minutes are kept as typed.

## Bounds

`min` and `max` accept any `HH:mm` string. A value outside marks the field invalid and
surfaces `outOfRange` below it, mirroring Date Picker. Either bound may be omitted.

## Trailing buttons

Pass `clearable` to render an × button while the field has a value; it resets the value to
`null`. Pass `showNow` for a `Now` chip that sets the value to the current local time.
Both sit at the trailing edge, follow the group's focus ring, and stay disabled while the
field is.
