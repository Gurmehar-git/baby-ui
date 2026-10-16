---
title: Theme Toggle
description: "Light/dark toggle that reveals the new theme across the whole page via the View Transition API."
component: theme-toggle
category: base
tags: [theme, dark mode, light mode, toggle, view transition]
---

Fully controlled: pass `theme`/`onThemeChange` to drive which mode is active, or leave it
uncontrolled with `defaultTheme` and let the component own its own flip. Either way, the
component only flips its own `theme` value: applying that to your actual page (a `dark`
class on `<html>`, a cookie, whatever your app uses) is the caller's job.

## Four reveal variants

`rectangle` and `blinds` clip the incoming theme in from `start`; `circle`/`circle-blur`
clip it in as a growing circle centred on `start` instead. Browsers without View
Transition support, or a reader with reduced motion, get an instant swap with no reveal.

## No dependency on a theme provider

The original ported from `next-themes`. This port doesn't: `theme`/`onThemeChange` replace
it, so the component works with any theme system (`next-themes`, a cookie, a Svelte store)
without importing one.
