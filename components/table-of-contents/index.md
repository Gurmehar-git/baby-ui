---
title: Table of Contents
description: An on-this-page outline whose rail bends between heading depths and lights the headings in view.
component: table-of-contents
category: advanced
tags: [toc, outline, scrollspy]
---

The outline this site uses in its right rail. Pass the page's headings in order; every heading
on screen is marked current, and when none is, the last one scrolled past stays current.

The rail is one path through every link, bending in or out a step for sub-headings. An accent
copy of it is clipped to the current rows, and a small dot rides the rail to their leading
edge, which is why it reads direction: scrolling up, the dot sits on top of the range.

Headings inside a scrolling panel instead of the window? Pass that element as `root`, and set
`scrollOffset` to your sticky header's height so a heading tucked under it counts as passed.

Set `activeIds` to drive the highlight yourself, for example from your router; in Svelte, bind
it to read what the scroll spy sees.
