---
title: Progress
description: Determinate and indeterminate progress bar sharing one track.
component: progress
category: base
tags: [progress, loading]
---

One track, two behaviours. Pass `value` for known progress; pass `indeterminate` when
you genuinely do not know.

## Do not fake determinacy

An indeterminate bar omits `aria-valuenow` entirely rather than reporting 0. Reporting a
number you did not measure is worse than reporting nothing, because assistive tech will
read it out as fact.

The sweep is linear. Easing it would imply acceleration in work that is not being
measured. The determinate fill does ease, over 280ms, so a jump from 10 to 90 reads as
progress rather than a cut.
