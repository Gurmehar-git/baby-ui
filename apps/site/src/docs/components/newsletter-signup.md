---
title: Newsletter Signup
description: "An email signup framed by the newsletter itself: subscribing drops the next issue, addressed to the reader, onto a stack of recent ones."
component: newsletter-signup
category: blocks
tags: [newsletter, signup, subscribe, email, form, marketing]
---

Composes `input-group`, `button`, `spinner`, `rolling-digits` and `avatar`. The component
validates the address; your `onSubmit` sends it and sets `status` from the response, so the
button reads Subscribing, Subscribed or Try again from real state.

Pass `issues` (newest first) and `upcoming` to show the stack. On success the upcoming issue,
addressed to the reader, rises onto the front and `readers.count` ticks up by one.
`onReset` backs "Use a different email"; set `status` to `idle` there.
