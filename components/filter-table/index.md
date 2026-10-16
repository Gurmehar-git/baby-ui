---
title: Filter Table
description: "Status chips directly filter a task table, rows collapsing in place."
component: filter-table
category: advanced
tags: [table, filter, tasks, status]
---

A task table with status filter chips above it. Filtering doesn't unmount rows: each one
collapses via a `grid-template-rows` transition (`1fr` → `0fr`) plus a fade, so switching
filters animates instead of jump-cutting.

## Data shape

```tsx
type TableRow = {
  task: string;
  date: string;
  status: "todo" | "progress" | "done";
  owner: string;
};
```
