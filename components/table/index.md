---
title: Table
description: Styled semantic table primitives, drop-in compatible with shadcn's Table.
component: table
category: base
tags: [table, data, grid, rows, columns]
---

A real `<table>`/`<thead>`/`<tbody>`/`<tr>`/`<th>`/`<td>` tree. No anchoring, no portal,
no ARIA role overrides: the semantic elements already are the accessible primitive.

## Density is set once

`density` lives on `<Table>` and every `TableHead`/`TableCell` beneath it reads it back
through context, so nested cells never repeat the prop.

## Selected rows

Give a row `data-state="selected"` (or `aria-selected="true"`) to pick up the built-in
selected-row background; there's no separate `selected` prop to keep in sync.
