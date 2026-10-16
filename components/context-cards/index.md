---
title: Context Cards
description: "Retrieved chunks in a stack, each with a source chip that confirms after the fact."
component: context-cards
category: agents
tags: [context, chunks, retrieval, rag, sources]
---

A stack of retrieval-augmented-generation chunks: title, character count, body text, and a
source-file chip. The chips fade in ~700ms after the cards themselves, so the source
citation reads as confirmation rather than as part of the initial answer.

## Data shape

```tsx
type ContextChunk = {
  title: string;
  chars: string;
  body: string;
  source: string;
  badge: string;
  tone: "destructive" | "success" | "warning";
};
```

`tone` colors the small badge square next to the source filename (e.g. red for a PDF,
green for a CSV): pick whichever reads as the right category for that source type.
