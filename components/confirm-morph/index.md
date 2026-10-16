---
title: Confirm Morph
description: "A button that asks in place: the pill morphs into a question with Cancel and Confirm, then a spinner, then a result with Undo."
component: confirm-morph
category: advanced
tags: [confirm, inline, undo, destructive]
---

Return the request's promise from `onConfirm`: the pill shows a spinner while it runs and an error
face with Retry if it rejects. Control `state` (bindable in Svelte) to drive the faces yourself.
