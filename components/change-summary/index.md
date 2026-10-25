---
title: Change Summary
description: "What moved since last time, one metric per row, each with a tinted trend mark and the change in words."
component: change-summary
category: blocks
tags: [changes, metrics, summary, digest, kpi, trend]
---

Use it where someone returns to a product and wants to know what moved: the top of a
dashboard, a weekly digest, a workspace home.

Built from parts:

```tsx
<ChangeSummary>
  <ChangeSummaryHeader>
    <ChangeSummaryTitle>What's changed</ChangeSummaryTitle>
    <ChangeSummaryPeriod>This week</ChangeSummaryPeriod>
  </ChangeSummaryHeader>
  <ChangeSummaryList>
    {changes.map((c) => (
      <ChangeSummaryItem key={c.label} tone={c.tone} direction={c.direction}>
        <ChangeSummaryLabel>{c.label}</ChangeSummaryLabel>
        <ChangeSummaryChange>{c.change}</ChangeSummaryChange>
      </ChangeSummaryItem>
    ))}
  </ChangeSummaryList>
</ChangeSummary>
```

`tone` says whether a move is good: green for positive, red for negative, a grey dash for
neutral. The arrow follows the tone unless you set `direction`, so a churn rate that fell is
`tone="positive" direction="down"`. Write the change in words with the new value; the mark is
decorative.

`variant="tray"` sets the heading in a grey rim above the raised list; `plain` keeps one
bordered card. Under 25rem each metric stacks above its change.
