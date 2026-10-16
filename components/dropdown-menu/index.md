---
title: Dropdown Menu
description: Anchored action menu with roving focus, destructive styling and outside dismissal.
component: dropdown-menu
category: base
tags: [dropdown, menu, overlay]
---

Focus moves into the menu on open and returns to the trigger on close. A menu that opens
without moving focus leaves a keyboard user stranded on the trigger, arrowing into
nothing.

## Disabled items are skipped

Arrow keys step over disabled items rather than landing on them. Focusing an item only to
announce that it cannot be used wastes the user's time; the item stays visible so the
capability is still discoverable.

## Destructive is styled, not separated

A destructive item is coloured but stays in place. Moving it to the bottom is a common
habit that trains people to expect Delete last, which is exactly when a mis-click hurts.

## Submenus

`DropdownMenuSub`, `DropdownMenuSubTrigger` and `DropdownMenuSubContent` open to the right
of the trigger on hover, click, or arrow-right / enter. Its own arrow keys rove within the
submenu only, and arrow-left closes just that submenu and refocuses its trigger. Escape
closes the whole menu tree at once.
