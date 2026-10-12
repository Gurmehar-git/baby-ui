---
title: Inline Edit
description: "Text that edits in place: click to put the caret where you clicked, Enter or blur saves, Escape cancels, and a failed save rolls back."
component: inline-edit
category: advanced
tags: [inline, edit, rename, form]
---

Return the request's promise from `onSave`: the text shows saving, then a tick, or rolls back
with an Edit again link if the promise rejects. `validate` keeps the field open with a message.
