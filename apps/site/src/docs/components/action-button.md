---
title: Action Button
description: "A button that runs its own async action: a spinner while it works, then a drawn tick and a past-tense label that morph in before it resets."
component: action-button
category: advanced
tags: [button, async, loading, success]
---

Built on Button: return a promise from `onAction` and the button shows Button's own pending face,
then the success word and tick, then resets after `resetAfterMs`.
