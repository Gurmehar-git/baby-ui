---
title: Date Range Picker
description: Segmented start and end dates with a two-month calendar, a presets rail and optional Apply.
component: date-range-picker
category: base
tags: [date range picker, range, presets, report filter, booking, form]
---

Built for report filters and bookings. Start and end are two Date Field segment sets in one
field, and focus runs from one into the other. The calendar button opens a presets rail
beside Range Calendar. An end date before the start marks both invalid and says why.

## Presets

Presets are functions of today, so "Last 7 days" stays correct after midnight. Pass your
own `presets` to change the list, or `[]` to hide the rail. Picking one moves the calendar to
the range's first month.

## Apply or commit

By default each click commits. Set `confirm` to hold the pick in a draft until Apply, which
suits filters that refetch data on every change.

## Months

Two months show from 640px up and one below, so the popover never overflows a phone.
