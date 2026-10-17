---
title: Page Header
description: "An app page header from parts: breadcrumbs, a title with status and people, actions and counted tabs; the sticky variant condenses as the page scrolls."
component: page-header
category: blocks
tags: [page header, header, breadcrumbs, tabs, title, app, sticky]
---

Built from parts you arrange: `PageHeaderBar` holds `PageHeaderBreadcrumbs`, a `PageHeaderRow`
with the `PageHeaderTitle` and `PageHeaderActions`, a `PageHeaderDescription` and
`PageHeaderTabs`; `PageHeaderContent` holds the page below. Drop in your own `Breadcrumb`,
`Badge`, `AvatarGroup` and buttons. For tabs, wrap the bar and the content in one `Tabs` root
and put a `PageHeaderTabCount` in any trigger; counts roll whenever they change.

`variant="sticky"` pins the bar to its scroll container. Once the page scrolls, the
breadcrumbs and description fold away and the title shrinks, so the tabs and actions stay
within reach.
