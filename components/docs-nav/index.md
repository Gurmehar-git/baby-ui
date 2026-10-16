---
title: Docs Nav
description: "Documentation sidebar: collapsible sections, a sliding hover pill and a tick or thread curve per link."
component: docs-nav
category: advanced
tags: [docs, sidebar, navigation, table of contents, tree, nav]
---

The sidebar this site uses, as a component. Composes `collapsible`: each section opens and
closes on its own, and collapsed links leave the tab order.

Pass the page's path as `current`; that link is marked `aria-current="page"` and centred in
whatever ancestor scrolls (a fixed rail, a drawer), only when it sits off-centre. `connector`
picks the marker: a short `tick`, or a `curve` thread with a rounded elbow into each row.

`onNavigate` fires on every link click: close a mobile drawer there, or call
`event.preventDefault()` and route client-side.
