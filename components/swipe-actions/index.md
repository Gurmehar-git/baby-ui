---
title: Swipe Actions
description: "A list whose rows reveal actions on a horizontal swipe, like a mail inbox, with a menu on every row for keyboard and screen reader users."
component: swipe-actions
category: advanced
tags: [list, swipe, gesture, actions]
---

Remove the item in the action's `onSelect`: the row slides away and closes its height first, then
the action runs. Set `keepRow` for actions that leave the item in place, such as Mark as unread.
