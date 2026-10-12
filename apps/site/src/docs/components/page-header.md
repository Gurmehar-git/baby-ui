---
title: Page Header
description: "An app page header with breadcrumbs, a title with status and people, actions and counted tabs; the sticky variant condenses as the page scrolls."
component: page-header
category: blocks
tags: [page header, header, breadcrumbs, tabs, title, app, sticky]
---

Composes `breadcrumb`, `badge`, `avatar`, `tabs` and `rolling-digits`. With `tabs`, pass one
`TabsContent` per tab as children; counts roll whenever they change.

`variant="sticky"` pins the header to its scroll container. Once the page scrolls, the
breadcrumbs and description fold away and the title shrinks, so the tabs and actions stay
within reach.
