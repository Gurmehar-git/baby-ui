---
title: Task Steps
description: Ordered agent plan where each step shows pending, active, done or failed, as a timeline or expandable rows.
component: task-steps
category: agents
tags: [tasks, steps, agent, plan, rows]
---

`variant="timeline"` ticks down a connector. `capsules` and `list` turn each step into an
expandable row with a `meta` figure, a status pill and `details`; failed rows get a retry
button when you pass `onRetry`. The status always comes from `steps`: there are no timers
inside.

Four states, each with its own icon and colour, and each with the status also present as
visually hidden text. A red circle and a green circle are the same circle to a
significant number of readers.

## Announced once

The list is `aria-live="polite"`, so a step changing status is announced on its own
rather than re-reading the entire plan. Putting the live region on each row instead
produces a pile-up when several steps settle at once.

## Only the active step moves

Exactly one spinner turns at a time. Animating pending steps too would suggest work is
happening on all of them, which is the opposite of what a sequential plan means.
