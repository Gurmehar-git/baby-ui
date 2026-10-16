---
title: Loading Screen
description: A full-page or container loading overlay with your logo, an indicator and an optional caption.
component: loading-screen
category: blocks
tags: [loading, splash, boot, overlay]
---

Pass your own mark as `logo` and flip `open` to `false` when the app is ready: the screen fades,
then turns invisible and inert so it never blocks clicks. The `bar` indicator is the registry
Progress, indeterminate until you pass `progress`.

Use `position="absolute"` to cover a single panel instead of the page.

## Before hydration

To paint a screen before any JavaScript runs, inline the same markup and CSS in your HTML
shell, then remove it once the app mounts. This site does exactly that for its own boot screen.
