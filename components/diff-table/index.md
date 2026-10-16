---
title: Diff Table
description: "A proposed edit as a table; each changed row is its own include/exclude toggle."
component: diff-table
category: advanced
tags: [diff, table, review, changes]
---

Removed and added rows sit in one `rows` array, each carrying its own `change` and an
optional starting `included` state. Every row is its own control: click it to toggle
whether that specific edit is part of the change before applying.

## No scripted reveal

Rows fade in with a mount-time stagger, not a timed "computing the diff" sequence; the
table renders whatever `rows` it's given, immediately.

## Applying locks the table

Pressing Apply calls `onApply` with the currently-included row keys and swaps the footer
for a plain "N edits applied" confirmation; rows stop being interactive from that point on.
