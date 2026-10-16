---
title: Records Table
description: "An AI-spreadsheet grid: columns are configurable properties, each with a type, a tool and a prompt."
component: records-table
category: advanced
tags: [table, records, spreadsheet, ai, columns]
---

A company-records grid where every column is itself a configurable property. Clicking a
header opens its config (type, tool, inputs, prompt preview); a "Go calculate" button
reveals computed values row by row, driven entirely by `calculatingColumn`/`resolvedCount`:
the caller owns the reveal timing, the component only renders it.

## Data shape

```tsx
type RecordRow = {
  id: string;
  name: string;
  logo?: string;
  tags: string[];
  last: string;
  strength: "strong" | "weak" | "veryweak" | "none";
  website?: string;
  aiValue?: string;
};
```

## Controlled state

Selection, sort, pinned columns, the AI column and every column's settings are controlled
triads: `selected`/`onSelectedChange`, `sort`/`onSortChange`, `pinned`/`onPinnedChange`,
`showAiColumn`/`onShowAiColumnChange`, `config`/`onConfigChange`. React also takes a
`default*` for each; Svelte binds them.

```tsx
const [config, setConfig] = useState<RecordsTableConfig>({
  links: { tool: "Claude Sonnet 5", toolKind: "model", grounding: true },
});

<RecordsTable rows={rows} config={config} onConfigChange={setConfig} />
```

Pinned columns stick to the left while the table scrolls. Every string, including aria
labels and footer counts, comes from `labels`.
