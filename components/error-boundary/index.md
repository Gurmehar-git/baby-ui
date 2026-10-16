---
title: Error Boundary
description: Catches errors while its children render and shows a retryable fallback built from Empty.
component: error-boundary
category: base
tags: [error, error boundary, fallback, retry]
---

Wrap the part of a page that can fail. When it throws while rendering, the boundary shows a
fallback in its place and the rest of the page keeps working.

The default fallback is an [Empty](/components/base/empty) with a destructive icon tile, a
Try again button and the error message folded into a details row. `variant`, `layout` and
`size` pass straight to Empty, and `fallback` replaces it entirely.

## Reset

Try again calls `onReset` (`onreset` in Svelte) first, so clear whatever made the children
throw there, then renders them again. In React, `resetKeys` clears the error by itself when
any key changes, e.g. the id of the record that failed to load.

## What it catches

Errors thrown while the children render, and in Svelte their effects too. Errors in event
handlers and async callbacks are not caught in either framework; handle those where they run.
