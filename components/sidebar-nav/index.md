---
title: Sidebar Nav
description: "A collapsible workspace sidebar: switcher, primary nav, searchable recents, and a footer action."
component: sidebar-nav
category: advanced
tags: [sidebar, navigation, workspace, chat]
---

Collapsing shrinks the sidebar to its icon rail without moving a single icon: only the
labels fade and slide out, so nothing reflows underneath a fixed cursor position.

## Built on the real DropdownMenu

The workspace switcher composes this registry's own `DropdownMenu`, not a hand-rolled
`position: fixed` popup with its own outside-click listener; positioning, dismissal and
keyboard handling all come from that primitive.

## No fictional default

`workspace`, `navItems` and `recents` are all required: the workspace name, nav items and
chat history are the whole point of the sidebar, so there's no built-in sample content.

## Footer only with a handler

The footer button renders only when `onFooterClick` is passed, and ships no default label.
Picking a recent activates `chatNavKey` (the first nav item by default).
