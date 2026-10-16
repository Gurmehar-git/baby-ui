---
title: Password Input
description: "A password field with a reveal toggle whose eye a slash draws across, and an optional strength meter with a rule checklist."
component: password-input
category: base
tags: [password, input, strength, form]
---

Leave out `rules` on sign-in forms. On sign-up forms pass `passwordRules(12)` (or your own
`{ id, label, test }` rules) to show the meter and checklist; scoring stays on the device.
