---
title: File Tree
description: Keyboard-navigable file explorer with animated expand and collapse, indent guides, and single selection.
component: file-tree
category: advanced
tags: [tree, explorer, navigation]
---

A node with a `children` array renders as a folder, even when that array is empty. That
distinction is data, not a flag: an empty folder is still a folder.

## Keyboard

The tree is a single tab stop. Once focus is inside it, arrow keys move between visible
rows, <kbd>→</kbd> opens a folder and then steps into it, and <kbd>←</kbd> closes it and
then steps out to the parent. That is the roving-tabindex pattern, and it is the reason
a deep tree does not add fifty tab stops to your page.

`aria-expanded` is set on folders only. A file that reports `aria-expanded="false"`
tells a screen reader it can be opened, which is a lie.

## Motion

Rows that become visible fade and travel two pixels into place over 200ms, and the
chevron rotates over the same duration so the two read as one gesture. Collapsing removes
rows immediately: an exit animation would need a JS-driven unmount in React and a
transition in Svelte, and the two would not match frame for frame.
