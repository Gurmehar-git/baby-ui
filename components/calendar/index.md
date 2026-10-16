---
title: Calendar
description: Date grid with month and year dropdowns, keyboard navigation and shadcn's API.
component: calendar
category: base
tags: [calendar, date, date picker, form]
---

React runs on react-day-picker v9 and takes its props (`mode`, `selected`, `onSelect`,
`numberOfMonths`); Svelte runs on bits-ui's Calendar with `@internationalized/date` values.
Both render the same classes, so the two ports look identical.

## Today versus selected

Today gets an outline, not a fill. A filled today looks selected, and a user picking a date
next week would not know which one they chose.

## Dropdown captions

`captionLayout="dropdown"` swaps the heading for native month and year selects. Native
means the platform picker on a phone and full keyboard support everywhere.
