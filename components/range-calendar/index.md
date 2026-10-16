---
title: Range Calendar
description: Calendar that selects a start and end date, with the range drawn as one track.
component: range-calendar
category: base
tags: [calendar, date range, booking, form]
---

Svelte uses bits-ui's `RangeCalendar`; React's `RangeCalendar` is `Calendar` with
`mode="range"`, so both ports share one name.

The ends take the primary fill and the days between sit on a light track, so the range
reads as one continuous span rather than a row of separately selected days.
