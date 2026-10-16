---
title: Alert Dialog
description: Blocking confirmation with the safe action focused and the destructive one styled.
component: alert-dialog
category: base
tags: [alert, dialog]
---

`role="alertdialog"` rather than `dialog`, so assistive tech announces it as an
interruption and reads the description with the title.

## Focus goes to Cancel

Always. A confirmation dialog that focuses the destructive action turns a reflexive Enter
-- the key you just pressed to get here -- into data loss. The destructive button is
styled to be findable, not to be default.
