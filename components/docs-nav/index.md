---
title: Docs Nav
description: "Documentation sidebar: collapsible sections, a sliding hover pill and a tick or thread curve per link."
component: docs-nav
category: advanced
tags: [docs, sidebar, navigation, table of contents, tree, nav]
---

The sidebar this site uses, as a component. A section with `href` is a direct top-level
link; a section with `items` composes `collapsible`, opens and closes independently, and
removes collapsed links from the tab order. Optional section icons, counts and path-prefix
matches let one ordered model cover a complete application sidebar.

Pass the page's path as `current`; that link is marked `aria-current="page"` and centred in
whatever ancestor scrolls (a fixed rail, a drawer), only when it sits off-centre. `connector`
picks the marker: a short `tick`, or a `curve` thread with a rounded elbow into each row.
Use `variant="sidebar"` for compact rows with end-aligned counts and disclosure chevrons.

`onNavigate` fires on every link click: close a mobile drawer there, or call
`event.preventDefault()` and route client-side.
