---
title: Tag Input
description: Free-text tags with Enter to commit and Backspace to remove the last one.
component: tag-input
category: base
tags: [tag, input]
---

Enter or comma commits. Backspace on an empty field removes the last tag, which is the
shortcut people already expect from every other tag field they have used.

Blur commits any pending text, so a half-typed tag is not silently lost when the user
clicks Save. A live region reports the count, so adding and removing is audible without
tabbing through every chip.
