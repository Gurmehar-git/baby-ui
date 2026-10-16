---
title: Select
description: Listbox that matches its trigger width, keeps the selected option in view and flips when needed.
component: select
category: base
tags: [select, overlay]
---

The list matches the trigger's width, so an option lines up with the value it is about to
replace. Available height is measured, so a select near the bottom of the page scrolls
internally rather than running off the viewport.

## Opens on the selected option

Focus lands on the currently selected option, not the first one. Opening a twelve-item
list at the top when the seventh is selected means the user has to find their own value
before they can change it.

## Why not a native select

A native `<select>` cannot be styled to match the rest of this system, and that is the
only reason. It is otherwise better than this in every respect, particularly on mobile.
If you do not need the styling, use the platform control.
