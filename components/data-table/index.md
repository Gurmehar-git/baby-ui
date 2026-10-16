---
title: Data Table
description: Composable parts over TanStack Table core, with virtualized rows, async states, pagination and infinite loading.
component: data-table
category: base
tags: [data table, datagrid, tanstack table, virtualized, infinite scroll, pagination]
---

Parts, not a props-only widget. `useDataTable` (React) or `createDataTable` (Svelte) builds a
TanStack Table instance and takes every TanStack option. Then compose what the screen needs:
`DataTableToolbar`, `DataTableSearch`, `DataTableViewOptions`, `DataTableContent`,
`DataTablePagination` and `DataTableColumnHeader`, inside a `DataTable` root. Every part takes
a `class`, and the body renders the [Table](/components/base/table) parts, so `variant` and
`density` match a plain table.

## Columns

Columns are TanStack column defs. `dataTableColumns<Row>()` gives a typed helper, and
`dataTableSelectColumn()` adds the checkbox column. `meta` sets a column's menu `label`, its
`align`, and classes for its head and cells. In Svelte, return `renderComponent(...)` or
`renderSnippet(...)` from `header` and `cell`.

Sorting, hiding, pinning (by logical start, so right-to-left works), resizing and reordering
are on by default. Turn any off per column (`enableSorting: false`, `meta.reorderable: false`)
or per table. Resize handles respond to the pointer, a double click (reset) and the arrow keys.
Each unpinned header has a grip: drag it onto another header, or focus it and press the arrow
keys.

## Large data

- **Virtualized:** pass `paginate: false` to the table and `virtualize` to
  `DataTableContent`, with a max height on `containerClassName` (`containerClass` in Svelte).
  Only the rows in view are in the DOM. Rows are measured, so their heights may vary.
- **Off the main thread:** pass `worker: createDataTableWorker(() => new Worker(...))` to the
  table and call `initDataTableWorker(columns)` in the worker entry, with accessor-only columns
  using the same ids. Filtering and sorting then run in TanStack's worker; the refetch bar shows
  while a result is pending. Keep `new Worker(new URL(...))` in your code so your bundler
  finds the entry, and `terminate()` the handle on unmount.
- **Server-side:** set `manualPagination`, `manualSorting` and `manualFiltering`, pass
  `rowCount`, and control `state` with the `on*Change` callbacks. Your fetch reads that state.
- **Infinite:** pass `hasMore` and `onLoadMore` to the root. It fires as the last row nears
  view and re-arms after each page, so a short page loads the next one at once.

## States

`loading` shows skeleton rows on the first load. `fetching` keeps the current rows on screen,
dimmed under a progress bar, while a refetch runs. `error` shows an error state with
`onRetry`. An empty result shows an [Empty](/components/base/empty); pass `empty` to replace it.
Override any text with `labels`.
