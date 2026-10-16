---
title: Context Menu
description: Right-click menu positioned at the pointer, clamped to the viewport.
component: context-menu
category: base
tags: [context, menu, overlay]
---

Positioned from the pointer rather than an element, so it clamps to the viewport instead
of flipping. Items take `variant="destructive"` for irreversible actions.

## Right-click is not an interface

There is no reliable keyboard equivalent for a context menu across platforms. Anything
reachable here must also be reachable somewhere else -- a toolbar, a dropdown, a keyboard
shortcut. Treat the context menu as an accelerator, never as the only path.

## Submenus

`ContextMenuSub`, `ContextMenuSubTrigger` and `ContextMenuSubContent` open a submenu to the
right of its trigger, on hover, on click, or with arrow-right / enter. Arrow-left or escape inside a
submenu closes just that submenu and returns focus to its trigger; a second escape closes
the menu.

## Checkbox and radio items

`ContextMenuCheckboxItem` and `ContextMenuRadioGroup` with `ContextMenuRadioItem` are
controlled like any input (`checked`, `value`, bindable in Svelte) and keep the menu open,
so several options can be set in one visit.
