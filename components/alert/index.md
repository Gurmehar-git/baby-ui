---
title: Alert
description: Inline message composed from Alert, AlertTitle and AlertDescription, with an optional dismiss.
component: alert
category: base
tags: [alert, callout, notice]
---

## Drop-in for shadcn

`Alert`, `AlertTitle` and `AlertDescription`, with shadcn's `data-slot` values and grid
layout. An `<svg>` placed directly inside the root takes the first column; without one
the root collapses that column to zero, so an alert with no icon has no dead space.

`variant` and `dismissible` are the only additions.

## The variant picks the role

The variant picks more than a colour. `warning` and `destructive` render with
`role="alert"`, which interrupts a screen reader immediately. `info` and `success` use
`role="status"`, which waits for a pause.

That mapping is the reason to pick a variant honestly. Marking a routine confirmation as
`destructive` because red looked better will cut across whatever the user was reading.

## Dismissal is immediate

There is no exit animation. The user has read it and asked for it to go; holding the
layout open for another 200ms to play a fade serves the interface, not the person.
