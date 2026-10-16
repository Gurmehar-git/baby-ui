---
title: Copy Button
description: Clipboard button that confirms, announces, and degrades when the API is blocked.
component: copy-button
category: base
tags: [copy, button]
---

A label that only changes visually is silent to a screen reader, so the confirmation goes
through a visually hidden live region as well.

`navigator.clipboard` throws outside a secure context. The catch does not pretend the copy
worked; it tells the user to press Ctrl+C, which is the only thing that actually helps.
