---
title: Hold to Confirm
description: "A button that commits only after it is held: the fill tracks the hold, an early release rewinds it, and finishing morphs into a done state."
component: hold-to-confirm
category: advanced
tags: [hold, confirm, destructive, button]
---

Leave `confirmed` unset and the button keeps its own done state. Control it (bindable in Svelte)
when a failed request should reset the button.
