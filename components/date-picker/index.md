---
title: Date Picker
description: A segmented date field with a calendar popover on the button at its end.
component: date-picker
category: base
tags: [date picker, datepicker, date input, calendar popover, form]
---

Date Field with a calendar one click away. People who know the date type it; people who
don't open the calendar. Built from Date Field, Popover, Calendar and Field.

## Typing

Segments follow the locale's own order, so `en-US` reads month, day, year and `en-GB` day,
month, year. Digits fill a segment and jump to the next; arrow keys step it. `Alt+ArrowDown`
opens the calendar. A date outside `min` and `max` turns the segments red and shows a Field
error, linked with `aria-describedby`.

## Values

React takes and returns a `Date` (or `null`). Svelte uses `@internationalized/date` values,
the same type bits-ui's calendar uses, and binds with `bind:value`. The value stays empty
until every segment is filled.
