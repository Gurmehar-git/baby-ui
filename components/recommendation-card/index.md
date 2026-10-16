---
title: Recommendation Card
description: "A single recommendation that holds its shape while switching between options."
component: recommendation-card
category: agents
tags: [recommendation, confidence, agent, suggestion]
---

One recommendation, shown as body text plus a confidence meter (three bars) and label.
Pressing "Alternatives" opens a drawer listing the other options in place; picking one
promotes it to the recommendation immediately, in the same card, rather than opening a
separate flow.

## Data shape

```tsx
type RecommendationOption = {
  key: string;
  body: ReactNode; // Svelte: Snippet
  short: string;
  signal: number; // 0-3 confidence bars filled
  tone: string; // CSS colour for the filled bars, e.g. "var(--success)"
  label: string;
  cta: string;
  ctaVariant: ButtonVariant;
};
```

`ctaVariant` is the real `Button` variant type: pick the emphasis that matches the
option's confidence (`"default"` for a strong recommendation, `"secondary"` for one that
needs review). Accepting an option always shows a `"success"`-styled confirmation,
regardless of the option's own `ctaVariant`.
