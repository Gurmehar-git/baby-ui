---
title: Date Field
description: Segmented month, day and year in the locale's order, typed or stepped with the arrow keys.
component: date-field
category: base
tags: [date field, date input, segmented date, birthday, form]
---

For dates people already know, like a birthday, where a calendar only slows them down. Each
segment is a spinbutton: digits type it, arrow keys step it, and a full segment moves focus
to the next. An empty segment steps from today.

## Values

React takes and returns a `Date` (or `null`); Svelte binds an `@internationalized/date` value
and runs on bits-ui's Date Field. The value stays empty until every segment is filled, so a
half-typed date never reaches your form. `name` submits it as ISO `yyyy-mm-dd`.

## Validation

`min` and `max` mark a date outside them invalid and show a Field error. `invalid` does the
same from outside, for a form library's own errors.
