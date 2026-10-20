---
title: Citation Text
description: "An AI answer with numbered inline citations; each chip opens a source card and lights the sentence it backs."
component: citation-text
category: text
tags: [citations, sources, ai answer, rag, grounding]
---

Needs `hover-card`. Use it wherever generated text has to show its work: AI search answers,
RAG chat replies, research summaries.

Built from parts. The root holds the answer and its sources; the body and the list read them:

```tsx
<CitationText segments={segments} sources={sources}>
  <CitationTextBody />
  <CitationTextSources label="Sources" />
</CitationText>
```

Pass the answer as `segments`, one sentence or clause each, with the ids of the sources behind
it. Segments rather than parsed `[1]` markers: a streaming answer grows by appending segments,
and each chip knows which sentence to light. Sources are numbered by first citation, so an
uncited source never appears.

Chips fade in the first time they render and never replay, so only what a stream adds
animates. Set `chip="domain"` to label chips with the site name instead of a number, and leave
`CitationTextSources` out to drop the list under the text.

## Migrating

`<CitationText segments={...} sources={...} showSources sourcesLabel="..." />` used to render
the body and list itself. Keep the root's props and add `<CitationTextBody />` and
`<CitationTextSources />` inside it: `sourcesLabel` becomes the list's `label`, and
`showSources={false}` means leaving the list out.
