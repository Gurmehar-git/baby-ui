---
title: User Menu
description: "The account menu behind a person's avatar: identity, destinations, presence status, theme and sign out."
component: user-menu
category: advanced
tags: [account, avatar, menu, profile, presence]
---

Built on DropdownMenu. Status and theme choices keep the menu open; when `onSignOut` returns a
promise, the item shows progress and the menu closes once it settles.
