---
title: Navigation Menu
description: Site navigation with hover and focus triggers and one shared panel that resizes and slides between them.
component: navigation-menu
category: base
tags: [navigation, menu, navbar, header]
---

A drop-in for shadcn's Navigation Menu: the same part names, plus
`navigationMenuTriggerStyle` for top-level links that should look like triggers.

## One panel, not one popover per trigger

Every trigger shares a single viewport. Moving from one trigger to the next resizes that
panel to the new content and slides it under the new trigger, while the content itself
cross-slides from the side the pointer came from. The bar reads as one object, not a row
of popovers opening and closing.

## When to reach for a dropdown instead

A navigation menu is for links. If an item runs an action (sign out, duplicate, delete),
use Dropdown Menu, which gives menu semantics and roving focus over actions.
