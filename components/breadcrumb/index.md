---
title: Breadcrumb
description: Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator and BreadcrumbEllipsis.
component: breadcrumb
category: base
tags: [breadcrumb, navigation]
---

When the trail is longer than `maxVisible`, the root and the last two survive and the
middle collapses to an ellipsis. That choice is not arbitrary: the root is how you get
out, the last two are where you are, and the middle is the part nobody clicks.

## Semantics over separators

A `nav` labelled Breadcrumb wraps an ordered list, so the order is conveyed to a screen
reader rather than implied by the chevrons. The chevrons themselves are `aria-hidden` --
they are punctuation.

The last item is `aria-current="page"` and is deliberately not a link. Linking the page
you are already on is a dead control.
